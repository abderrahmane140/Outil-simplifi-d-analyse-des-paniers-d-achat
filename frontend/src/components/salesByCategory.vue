<template>
    <p v-if="loading">Loading...</p>
    <canvas id="salesDistributionChart" width="400" height="400"></canvas>
  </template>
  
  <script setup>
  import Chart from 'chart.js/auto';
  import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the datalabels plugin
  import { onMounted, ref } from 'vue';
  
  const apiURL = ref(import.meta.env.VITE_API_URL);
  const loading = ref(false);
  
  async function fetchAndRenderChart() {
    loading.value = true;
    try {
      const response = await fetch(`${apiURL.value}analytics/category_sales`, {
        method: 'GET',
      });
      const data = await response.json();
  
      // Extract categories and their percentages from the response
      const categories = data.categorySales.map((item) => item.category);
      const percentages = data.categorySales.map((item) => item.percentage);
  
      // Generate pastel colors for each category
      const colors = categories.map(
        () =>
          `hsl(${Math.floor(Math.random() * 360)}, ${30 + Math.random() * 30}%, ${70 + Math.random() * 10}%)`
      );
  
      // Get the canvas context
      const ctx = document.getElementById('salesDistributionChart').getContext('2d');
  
      // Register the ChartDataLabels plugin
      Chart.register(ChartDataLabels);
  
      // Create the Doughnut chart
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: categories,
          datasets: [
            {
              label: 'Sales Distribution by Category (%)',
              data: percentages,
              backgroundColor: colors,
              borderColor: colors.map((color) => color.replace(/70%/, '60%')),
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const value = tooltipItem.raw.toFixed(2);
                  return `${tooltipItem.label}: ${value}%`;
                },
              },
            },
            datalabels: {
              color: '#fff',
              font: {
                size: 14,
              },
              formatter: (value) => `${value.toFixed(2)}%`,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      const ctx = document.getElementById('salesDistributionChart').getContext('2d');
      ctx.font = '16px Arial';
      ctx.fillStyle = 'red';
      ctx.fillText('Failed to load data', 10, 50);
    } finally {
      loading.value = false;
    }
  }
  
  // Call the function to fetch data and render the chart on mount
  onMounted(() => {
    fetchAndRenderChart();
  });
  </script>
  
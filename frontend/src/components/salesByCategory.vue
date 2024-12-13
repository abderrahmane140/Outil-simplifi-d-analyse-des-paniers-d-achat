<template>
  <div>
    <!-- Conditional rendering for no data -->
    <div v-if="data.length === 0" class="flex justify-center items-center h-96 text-gray-500">
      <p>No such data</p>
    </div>

    <!-- Display chart when data exists -->
    <div v-else>
      <div v-if="loading" class="p-40 m-6 mt-10 bg-gray-200 animate-pulse shadow-lg rounded-md"></div>
      <canvas v-show="!loading" id="salesDistributionChart" width="400" height="400"></canvas>
    </div>
  </div>
</template>

<script setup>
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the datalabels plugin
import { onMounted, ref, watch, nextTick, onBeforeUnmount  } from 'vue';

const apiURL = ref(import.meta.env.VITE_API_URL);
const loading = ref(false);
let data = ref([])

const props = defineProps({
  dateRange: {
    type: Object,
    required: true,
  },
});

let chartInstance = null; // To store the chart instance for cleanup

async function fetchAndRenderChart() {
  loading.value = true;

  // Destroy existing chart instance if it exists
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  try {
    const response = await fetch(`${apiURL.value}analytics/category_sales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(props.dateRange),
    });
    const result = await response.json();

    // Update `data` reactively
    data.value = result.categorySales || [];

    // Extract categories and their percentages
    const categories = data.value.map((item) => item.category);
    const percentages = data.value.map((item) => item.percentage);

    // Generate pastel colors for each category
    const colors = categories.map(
      () =>
        `hsl(${Math.floor(Math.random() * 360)}, ${30 + Math.random() * 30}%, ${70 + Math.random() * 10}%)`
    );

    // Ensure the DOM updates before accessing the canvas
    await nextTick();

    const canvas = document.getElementById('salesDistributionChart');
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }

    const ctx = canvas.getContext('2d');

    // Register the ChartDataLabels plugin
    Chart.register(ChartDataLabels);

    // Create the Doughnut chart
    chartInstance = new Chart(ctx, {
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
  } finally {
    loading.value = false;
  }
}

// Cleanup the chart on component unmount
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});

// Call the function to fetch data and render the chart on mount
onMounted(() => {
  fetchAndRenderChart();
});

// Watch for changes in the props and refetch the data
watch(
  () => props.dateRange,
  () => {
    fetchAndRenderChart();
  },
  { deep: true }
);
</script>

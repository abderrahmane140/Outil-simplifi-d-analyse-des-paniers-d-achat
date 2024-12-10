<template>
  <div class="p-10">
    <h1 class="text-2xl font-bold mb-4">Sales by Product</h1>
    <p v-if="loading">loading ...</p>
    <canvas id="salesChart"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue';
import Chart from 'chart.js/auto';

const apiURL = ref(import.meta.env.VITE_API_URL);
const salesData = ref([]);
const loading = ref(false);
let chartInstance = null; // Store the chart instance

const fetchSalesData = async () => {
  loading.value = true;
  try {
    const response = await fetch(`${apiURL.value}products`, {
      method: 'GET',
    });
    const data = await response.json();
    salesData.value = data;
    createChart(); // Create chart after data is fetched
  } catch (err) {
    console.error('Error fetching sales data:', err);
  } finally {
    loading.value = false; // Always set loading to false
  }
};

const createChart = () => {
  const ctx = document.getElementById('salesChart').getContext('2d');

  // Destroy the previous chart instance if it exists
  if (chartInstance) {
    chartInstance.destroy();
  }

  const labels = salesData.value.map((item) => item.ProductName); // Extract product names
  const quantities = salesData.value.map((item) => item.totalQuantity); // Extract quantities

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Total Quantity Sold',
          data: quantities,
          backgroundColor: 'rgba(75, 192, 192, 0.6)', // Bar color
          borderColor: 'rgba(75, 192, 192, 1)', // Border color
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
        tooltip: {
          callbacks: {
            label: (context) => `Quantity: ${context.raw}`,
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Products',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Quantities Sold',
          },
          beginAtZero: true,
        },
      },
    },
  });
};

// Cleanup on component unmount
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});

onMounted(() => {
  fetchSalesData(); // Fetch data on component mount
});
</script>

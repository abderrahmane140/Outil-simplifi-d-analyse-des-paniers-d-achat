<template>
  <div class="p-10">
    <h1 class="text-2xl font-bold mb-4">Sales by Product</h1>
    <!-- Show a loading shadow when loading is true -->
    <div v-if="loading" class="w-full h-64 bg-gray-200 animate-pulse shadow-lg rounded-md"></div>
    <!-- Use v-show instead of v-if to keep the canvas in the DOM -->
    <canvas v-show="!loading" id="salesChart"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';

const apiURL = ref(import.meta.env.VITE_API_URL);
const salesData = ref([]);
const loading = ref(false);
let chartInstance = null; // Store the chart instance

const props = defineProps({
  dateRange: {
    type: Object,
    required: true,
  },
});

const fetchSalesData = async () => {
  loading.value = true;

  // Destroy the chart instance before fetching new data
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  try {
    const response = await fetch(`${apiURL.value}products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(props.dateRange),
    });
    const data = await response.json();
    salesData.value = data;

    // Wait for DOM updates and ensure the canvas exists
    await nextTick();
    createChart(); // Create the chart
  } catch (err) {
    console.error('Error fetching sales data:', err);
  } finally {
    loading.value = false;
  }
};

const createChart = () => {
  const canvas = document.getElementById('salesChart');
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  const ctx = canvas.getContext('2d');

  const labels = salesData.value.map((item) => item.ProductName);
  const quantities = salesData.value.map((item) => item.totalQuantity);

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Total Quantity Sold',
          data: quantities,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
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
  fetchSalesData();
});

// Watch for changes in the props and refetch data
watch(
  () => props.dateRange,
  () => {
    fetchSalesData();
  },
  { deep: true },
);
</script>

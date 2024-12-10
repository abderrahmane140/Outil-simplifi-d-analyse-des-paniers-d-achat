<script setup>
import { onMounted, ref } from 'vue';

const data = ref([]); // Initialize as an empty array
const loading = ref(false);
const error = ref(null);
const apiURL = ref(import.meta.env.VITE_API_URL);

const fetchData = async () => {
  loading.value = true; // Set loading to true at the start of the fetch

  try {
    // Await the fetch call
    const response = await fetch(`${apiURL.value}analytics/trending_products`, {
      method: "GET",
    });

    // Check if the response is ok
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Parse the JSON response
    const result = await response.json();
    data.value = result.trendingProducts; // Assign the array of products to data.value
    console.log("Data fetched successfully:", data.value);

  } catch (err) {
    // Handle errors
    error.value = err.message;
    console.error("Error fetching data:", error.value);

  } finally {
    // Always set loading to false
    loading.value = false;
  }
};

onMounted(() => {
  fetchData(); // Call fetchData when the component is mounted
});
</script>


<template>
  <div class="flex flex-col space-y-4">
    <h1 class="text-blue-400 font-bold text-xl">Trending Products</h1>

    <!-- Loading and Error States -->
    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-if="error" class="text-red-500">Error: {{ error }}</div>

    <!-- Render Trending Products as a Table -->
    <table v-if="data.length" class="min-w-full divide-y divide-gray-200">
      <thead>
        <tr class="bg-blue-50 text-left">
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sales</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Quantity</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr 
          v-for="(item, index) in data" 
          :key="index" 
          class="hover:bg-blue-100 odd:bg-white even:bg-gray-50"
        >
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.productName }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ item.totalSales.toFixed(2) }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.totalQuantity }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>



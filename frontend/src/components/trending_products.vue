<script setup>
import { onMounted, ref, watch } from 'vue';

const data = ref([]); // Initialize as an empty array
const loading = ref(false);
const error = ref(null);
const apiURL = ref(import.meta.env.VITE_API_URL);

const props = defineProps({
  dateRange: {
    type: Object,
    required: true,
  },
})

const fetchData = async () => {
  loading.value = true; // Set loading to true at the start of the fetch

  try {
    // Await the fetch call
    const response = await fetch(`${apiURL.value}analytics/trending_products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(props.dateRange), // Send the dateObject directly
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
watch(
  () => props.dateRange,
  () => {
    fetchData()
  },
  {deep: true}
)
console.log(props.dateRange);

</script>


<template>
  <div class="flex flex-col space-y-4">
    <h1 class="text-blue-400 font-bold text-xl">Trending Products</h1>

    <!-- Display loading state or no data message -->
    <div class="flex items-center justify-center min-h-[200px]" v-if="loading || data.length === 0">
      <template v-if="loading">
        <!-- Loading skeleton -->
        <div>
          <p class="h-2.5 bg-gray-200 rounded-full animate-pulse shadow-lg dark:bg-gray-200 w-10 mb-4"></p>
          <p class="h-2.5 bg-gray-200 rounded-full animate-pulse shadow-lg dark:bg-gray-200 w-10 mb-4"></p>
          <p class="h-2.5 bg-gray-200 rounded-full animate-pulse shadow-lg dark:bg-gray-200 w-10 mb-4"></p>
        </div>
      </template>
      <template v-else>
        <!-- No data message -->
        <p class="block text-center p-4 text-gray-500">No such data</p>
      </template>
    </div>

    <!-- Render Trending Products as a Table -->
    <table v-if="data.length > 0 && !loading" class="min-w-full divide-y divide-gray-200">
      <thead>
        <tr class="bg-blue-50 text-left">
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Product Name
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Total Sales
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Total Quantity
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="(item, index) in data"
          :key="index"
          class="hover:bg-blue-100 odd:bg-white even:bg-gray-50"
        >
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ item.productName }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${{ item.totalSales.toFixed(2) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ item.totalQuantity }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>




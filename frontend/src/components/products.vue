<script setup>
import { onMounted, ref } from 'vue';

const data = ref([]);
const loading = ref(false)
const error = ref(null)
const apiURl = ref(import.meta.env.VITE_API_URL);

const fetchData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(`${apiURl.value}products`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();

    // Validate if `result` is an array before assigning
    if (Array.isArray(result)) {
      data.value = result;
      console.log('Data fetched successfully', result);
    } else {
      throw new Error('Unexpected data format');
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
    fetchData();
})


</script>

<template>
    <div>
        <div class="bg-white-100 px-4 pb-4 rounded-sm border border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                            Id
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                            Product Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                            Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                            Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase tracking-wider">
                            total Quantity
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(item, index) in data" :key="index" class="hover:bg-gray-100">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.ProductID }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.ProductName }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm">
                        <span :class="`${item.Category === 'Electronics' ? 'text-blue-500 bg-blue-100 text-xs rounded-full px-2 py-1' : 'text-pink-500 bg-pink-100 text-xs rounded-full px-2 py-1'}`">
                            {{ item.Category }}
                        </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.Price }}$</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.totalQuantity }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
      <p v-if="loading">Loading...</p>
      <p v-if="error" class="text-red-500">{{ error }}</p>
      <ul v-if="data.length">
        <li v-for="(item, index) in data" :key="index"></li>
      </ul>
    </div>
</template>
  
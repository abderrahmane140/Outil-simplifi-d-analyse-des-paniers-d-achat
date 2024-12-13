<script setup>
import total_sales from './total_sales.vue';
import trending_products from './trending_products.vue';
import salesByProducts from './salesByProducts.vue';
import salesByCategory from './salesByCategory.vue';
import products from './products.vue';
import { ref, computed } from 'vue';

const selectedRange = ref('12m'); // Default selected range
const today = new Date();
const calculatedRange = computed(() => {
  let startDate = new Date(today);

  if (selectedRange.value === '12m') { // If "12 months" is selected
    startDate.setFullYear(today.getFullYear() - 1); // Subtract 1 year from today's date
  } else {
    const rangeInDays = parseInt(selectedRange.value, 10);
    startDate.setDate(today.getDate() - rangeInDays); // Subtract the range in days
  }

  return {
    startDate: startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
    endDate: today.toISOString().split('T')[0], // Format as YYYY-MM-DD
  };
});
</script>

<template>
  <div class="min-h-full flex flex-col bg-neutral-100">
    <!-- Header Section -->
    <header class="bg-gray-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="shrink-0">
            <h1 class="text-white font-bold text-xl">Dashboard</h1>
          </div>
        </div>
      </div>
    </header>
    <div class="p-3 flex justify-end">
      <!-- Filter Dropdown Container -->
    <div class="flex items-center gap-2 bg-white border-gray-200 rounded-lg px-4 py-2 shadow-sm">
      <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      aria-hidden="true"
      focusable="false"
      class="w-5 h-5 text-gray-500"
      >
      <path
        d="M3.9 54.9C10.5 40.9 24.5 32 40 32l432 0c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9 320 448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6l0-79.1L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z"
      />
      </svg>
      <!-- Label Text -->
       <span class="text-sm text-gray-600 font-medium">Filter</span>

      <!-- Select Dropdown -->
    <div class="relative">
      <select
        v-model="selectedRange"
        class="appearance-none bg-white text-gray-700 text-sm pl-2 pr-6 py-1 border-0 focus:outline-none cursor-pointer"
      >
        <option class="bg-gray-200 hover:bg-gray-300" value="7">7 days</option>
        <option class="bg-gray-200 hover:bg-gray-300" value="30">30 days</option>
        <option class="bg-gray-200 hover:bg-gray-300" value="12m">12 mois</option> 
      </select>
    </div>
  </div>
</div>
    <!-- Main Section -->
    <main class="flex flex-1 p-6 gap-4 bg-neutral-100 flex-col lg:flex-row">
      <!-- Total Sales Section -->
      <div class="p-6 bg-white border border-gray-200 rounded-lg flex-1 mb-4 lg:mb-0">
        <total_sales :date-range="calculatedRange" />
      </div>

      <!-- Trending Products Section (Flexible Space) -->
      <div class="flex-grow p-6 bg-white border border-gray-200 rounded-lg mb-4 lg:mb-0">
        <trending_products :date-range="calculatedRange" />
      </div>
    </main>

    <!-- Sales by Products and Sales by Category -->
    <div class="flex flex-col lg:flex-row justify-around gap-4 bg-neutral-100 pb-4 px-4">
      <div class="w-full lg:w-2/3 bg-white border border-gray-200 rounded-lg mb-4 lg:mb-0">
        <sales-by-products :date-range="calculatedRange" />
      </div>
      <div class="w-full lg:w-1/3 bg-white border border-gray-200 rounded-lg">
        <sales-by-category :date-range="calculatedRange" />
      </div>
    </div>

    <!-- Products Section -->
    <div class="m-4 bg-neutral-100 border border-gray-200 rounded-lg">
      <products :date-range="calculatedRange" />
    </div>
  </div>
</template>

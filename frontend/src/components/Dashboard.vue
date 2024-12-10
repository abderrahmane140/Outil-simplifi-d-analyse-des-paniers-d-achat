<template>
  <div class="min-h-full flex flex-col">
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

    <!-- Main Section -->
    <main class="flex flex-1 p-6 gap-4 bg-neutral-100">
      <!-- Total Sales Section -->
      <div class="p-6 bg-white border border-gray-200 rounded-lg">
        <total_sales />
      </div>

      <!-- Trending Products Section (Flexible Space) -->
      <div class="flex-grow p-6 bg-white border border-gray-200 rounded-lg">
        <trending_products />
      </div>
    </main>
    <div class="flex justify-between gap-4 bg-neutral-100 pb-4">
      <div class="w-2/3 bg-white border border-gray-200 rounded-lg">
        <sales-by-products/>
      </div>
      <div class="w-1/3 pt-6 bg-white border border-gray-200 rounded-lg">
        <sales-by-category/>
      </div>
    </div>
    <div>
      <products/>
    </div>
  </div>
</template>

<script setup>
import total_sales from './total_sales.vue';
import trending_products from './trending_products.vue';
import salesByProducts from './salesByProducts.vue';
import salesByCategory from './salesByCategory.vue';
import products from './products.vue';
</script>

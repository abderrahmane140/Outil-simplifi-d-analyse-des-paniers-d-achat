<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const dateRange = ref("");
const props = defineProps({
  dateRange: {
    type: Object,
    required: true,
  },
});
const dateObject = reactive({
  startDate: props.dateRange.startDate,
  endDate: props.dateRange.endDate,
});
let datePickerInstance = null;
const data = ref([]);
const loading = ref(false);
const error = ref(null);
const apiURl = ref(import.meta.env.VITE_API_URL);



const fetchData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(`${apiURl.value}analytics/total_sales`, {
      method: "POST", // Use POST for sending data
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dateObject), // Send the dateObject directly
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    data.value = result;
    console.log("Data fetched successfully:", result);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Initialize Flatpickr
onMounted(() => {
  datePickerInstance = flatpickr("#daterange", {
    mode: "range",
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "F j, Y",
    onChange(selectedDates) {
      if (selectedDates.length === 2) {
        dateObject.startDate = selectedDates[0];
        dateObject.endDate = selectedDates[1];
        console.log("Date Object:", dateObject);
      } else {
        dateObject.startDate = "";
        dateObject.endDate = "";
      }
    },
  });

  fetchData(); // Fetch initial data when the component is mounted
});

watch(
  () => props.dateRange,
  (newRange) => {
    dateObject.startDate = newRange.startDate;
    dateObject.endDate = newRange.endDate;
    fetchData(); // Re-fetch data whenever the dateRange prop changes
  },
  { deep: true } // Watch the dateRange deeply
);

// Watch for changes in dateObject and fetch data
watch(
  () => dateObject,
  () => {
    fetchData();
  },
  { deep: true } // Deep watch to detect nested changes
);

// Open the date picker programmatically
const openDatePicker = () => {
  if (datePickerInstance) {
    datePickerInstance.open();
  }
};


console.log("dataRange: ",props.dateRange);

</script>

<template>
  <div class="flex items-center  justify-between space-x-40">
    <h1 class="text-blue-400 font-bold text-xl">Total Sales</h1>
    <div>
      <!-- Calendar Icon Button to open the date picker -->
      <button
        @click="openDatePicker"
        type="button"
        id="daterange"
        class="text-gray-400 hover:text-blue-500 mt-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          class="w-6 h-6"
        >
          <path
            d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm64 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16 16l0-32c0-8.8-7.2-16 16-16l-32 0c-8.8 0-16 7.2-16 16zm128 0l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16 16l0-32c0-8.8-7.2-16 16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2-16-16l0-32c0-8.8-7.2-16 16-16l-32 0c-8.8 0-16 7.2-16 16zM64 400l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2-16 16l0-32c0-8.8-7.2-16 16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2-16 16l0-32c0-8.8-7.2-16 16-16l-32 0c-8.8 0-16 7.2-16 16zM112 416c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16l32 0z"
          />
        </svg>
      </button>
    </div>
  </div>
  <div class="mt-10">
    <p v-if="loading" class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-200 w-20 mb-4"></p>
    <p v-else-if="error" class="text-red-500">{{ error }}</p>
    <p v-else class="font-bold text-2xl">{{data.totalSales}}$</p>
  </div>
</template>

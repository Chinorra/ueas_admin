<script setup lang="ts">
import { ref, onMounted } from "vue";
import { supabase } from "@/services/supabase";

const orders = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const formatTime = (hour: number, minute: number, isAm: boolean) => {
  const amPm = isAm ? 'AM' : 'PM';
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${amPm}`;
};

onMounted(async () => {
  const { data, error: fetchError } = await supabase
    .from("orders")
    .select("*")
    .order("date", { ascending: false });

  if (fetchError) {
    error.value = fetchError.message;
  } else {
    orders.value = data || [];
  }

  loading.value = false;
});
</script>

<template>
  <h1 class="mb-4 text-3xl font-medium">Orders</h1>

  <div v-if="loading">Loading orders...</div>
  <div v-else-if="error" class="text-red-500">{{ error }}</div>
  <div v-else>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">


      <!-- Order Cards -->
      <router-link
        v-for="order in orders"
        :key="order.id"
        :to="{ name: 'OrderDetail', params: { id: order.id } }"
        class="block rounded-xl border p-4 shadow transition hover:scale-[1.02] hover:shadow-md"
      >
        <div class="mb-3">
          <div class="mb-2 flex items-start justify-between">
            <span class="text-sm text-gray-500">Order #{{ order.id }}</span>
            <span class="text-xs text-gray-500">
              {{ formatTime(order.hour, order.minute, order.is_am) }}
            </span>
          </div>
          <h2 class="mb-1 text-lg font-semibold">{{ order.customer_name }}</h2>
          <p class="mb-2 text-sm text-gray-600">{{ order.description || 'No description' }}</p>
          <p class="text-sm text-gray-500">{{ order.phone_number }}</p>
          <p class="text-sm text-gray-500">{{ order.email || 'No email' }}</p>
          <p class="text-sm text-gray-500">{{ order.address || 'No address' }}</p>
          <p class="mt-1 text-xs text-gray-500">
            {{ new Date(order.date).toLocaleDateString("vi-VN") }}
          </p>
        </div>
      </router-link>
    </div>
  </div>
</template>

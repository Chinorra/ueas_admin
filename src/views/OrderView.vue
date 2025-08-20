<script setup lang="ts">
import { ref, onMounted } from "vue";
import { supabase } from "@/services/supabase";

const orders = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  const { data, error: fetchError } = await supabase
    .from("order_detail")
    .select(
      `
      *,
      services(title)
    `
    )
    .order("created_at", { ascending: false });

  if (fetchError) {
    error.value = fetchError.message;
  } else {
    // Map the joined data to the expected structure
    orders.value = data?.map(order => ({
      ...order,
      customer_name: order.customer_name || "",
      service_name: order.services?.title || "",
    })) ?? [];
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
            <span
              class="rounded-full px-2 py-1 text-xs"
              :class="{
                'bg-green-100 text-green-800': order.status === 'completed',
                'bg-yellow-100 text-yellow-800': order.status === 'pending',
                'bg-blue-100 text-blue-800': order.status === 'processing',
                'bg-red-100 text-red-800': order.status === 'cancelled',
              }"
            >
              {{ order.status }}
            </span>
          </div>
          <h2 class="mb-1 text-lg font-semibold">{{ order.customer_name }}</h2>
          <p class="mb-2 text-sm text-gray-600">
            {{ order.services?.title || order.service_name }}
          </p>
          <p class="text-sm font-medium">
            {{
              new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(order.total_amount)
            }}
          </p>
          <p class="mt-1 text-xs text-gray-500">
            {{ new Date(order.created_at).toLocaleDateString("vi-VN") }}
          </p>
        </div>
      </router-link>
    </div>
  </div>
</template>

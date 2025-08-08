<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { supabase } from "@/services/supabase";

const route = useRoute();
const router = useRouter();

const order = ref<any>({});
const loading = ref(true);
const error = ref<string | null>(null);
const isEditing = ref(false);

const updateOrder = async () => {
  const { error: updateError } = await supabase
    .from("orders")
    .update({
      customer_name: order.value.customer_name,
      customer_phone: order.value.customer_phone,
      customer_email: order.value.customer_email,
      customer_address: order.value.customer_address,
      service_description: order.value.service_description,
      total_amount: order.value.total_amount,
      status: order.value.status,
      notes: order.value.notes,
    })
    .eq("id", order.value.id);

  if (updateError) {
    error.value = updateError.message;
  } else {
    isEditing.value = false;
    // Optionally refresh the order data
    await fetchOrder();
  }
};

const deleteOrder = async () => {
  const confirmDelete = confirm("Are you sure you want to delete this order?");
  if (!confirmDelete) return;

  const { error: deleteError } = await supabase
    .from("orders")
    .delete()
    .eq("id", order.value.id);

  if (deleteError) {
    error.value = `Failed to delete order: ${deleteError.message}`;
  } else {
    router.push("/orders");
  }
};

const fetchOrder = async () => {
  const { id } = route.params;

  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .select(
      `
      *,
      services(title)
    `
    )
    .eq("id", id)
    .single();

  if (orderError) {
    error.value = orderError.message;
    loading.value = false;
    return;
  }

  order.value = orderData;
  loading.value = false;
};

onMounted(fetchOrder);
</script>

<template>
  <div class="p-4">
    <div v-if="loading">Loading order...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else>
      <div class="mb-4 flex items-center justify-between">
        <h1 class="text-3xl font-bold">Order #{{ order.id }}</h1>
        <div class="flex gap-2">
          <button
            v-if="!isEditing"
            @click="isEditing = true"
            class="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
          >
            Edit
          </button>
          <template v-else>
            <button
              @click="updateOrder"
              class="rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
            >
              Save
            </button>
            <button
              @click="isEditing = false"
              class="rounded bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600"
            >
              Cancel
            </button>
          </template>
          <button
            @click="deleteOrder"
            class="rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Customer Information -->
        <div class="rounded-lg bg-white p-6 shadow">
          <h2 class="mb-4 text-xl font-semibold text-gray-700">Customer Information</h2>
          <div class="space-y-4">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700"
                >Name</label
              >
              <input
                v-model="order.customer_name"
                :readonly="!isEditing"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                :class="{ 'bg-gray-50': !isEditing }"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700"
                >Phone</label
              >
              <input
                v-model="order.customer_phone"
                :readonly="!isEditing"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                :class="{ 'bg-gray-50': !isEditing }"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700"
                >Email</label
              >
              <input
                v-model="order.customer_email"
                :readonly="!isEditing"
                type="email"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                :class="{ 'bg-gray-50': !isEditing }"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700"
                >Address</label
              >
              <textarea
                v-model="order.customer_address"
                :readonly="!isEditing"
                rows="3"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                :class="{ 'bg-gray-50': !isEditing }"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Order Information -->
        <div class="rounded-lg bg-white p-6 shadow">
          <h2 class="mb-4 text-xl font-semibold text-gray-700">Order Information</h2>
          <div class="space-y-4">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700"
                >Service</label
              >
              <input
                :value="order.services?.title || order.service_name"
                readonly
                class="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700"
                >Service Description</label
              >
              <textarea
                v-model="order.service_description"
                :readonly="!isEditing"
                rows="3"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                :class="{ 'bg-gray-50': !isEditing }"
              ></textarea>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700"
                >Total Amount</label
              >
              <input
                v-model="order.total_amount"
                :readonly="!isEditing"
                type="number"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                :class="{ 'bg-gray-50': !isEditing }"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700"
                >Status</label
              >
              <select
                v-model="order.status"
                :disabled="!isEditing"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                :class="{ 'bg-gray-50': !isEditing }"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700"
                >Notes</label
              >
              <textarea
                v-model="order.notes"
                :readonly="!isEditing"
                rows="3"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                :class="{ 'bg-gray-50': !isEditing }"
                placeholder="Additional notes about the order..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Metadata -->
      <div class="mt-6 rounded-lg bg-gray-50 p-4">
        <h3 class="mb-2 text-lg font-medium text-gray-700">Order Details</h3>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div class="text-gray-700">
            <span class="font-medium ">Created:</span>
            {{ new Date(order.created_at).toLocaleString("vi-VN") }}
          </div>
          <div class="text-gray-700">
            <span class="font-medium ">Updated:</span>
            {{ new Date(order.updated_at).toLocaleString("vi-VN") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

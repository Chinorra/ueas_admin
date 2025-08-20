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
const originalData = ref<any>({});

const startEditing = () => {
  // Store original values before editing
  originalData.value = {
    customer_name: order.value.customer_name,
    customer_phone: order.value.customer_phone,
    customer_email: order.value.customer_email,
    customer_address: order.value.customer_address,
    total_amount: order.value.total_amount,
    status: order.value.status,
    note: order.value.note,
  };
  isEditing.value = true;
};

const cancelEditing = () => {
  // Restore original values
  order.value.customer_name = originalData.value.customer_name;
  order.value.customer_phone = originalData.value.customer_phone;
  order.value.customer_email = originalData.value.customer_email;
  order.value.customer_address = originalData.value.customer_address;
  order.value.total_amount = originalData.value.total_amount;
  order.value.status = originalData.value.status;
  order.value.note = originalData.value.note;
  isEditing.value = false;
};

const updateOrder = async () => {
  try {
    // Check which specific fields have changed
    const customerChanges = {
      customer_name: order.value.customer_name !== originalData.value.customer_name,
      customer_phone: order.value.customer_phone !== originalData.value.customer_phone,
      customer_email: order.value.customer_email !== originalData.value.customer_email,
      customer_address: order.value.customer_address !== originalData.value.customer_address,
    };

    const orderChanges = {
      total_amount: order.value.total_amount !== originalData.value.total_amount,
      status: order.value.status !== originalData.value.status,
      note: order.value.note !== originalData.value.note,
    };

    const hasCustomerChanges = Object.values(customerChanges).some(change => change);
    const hasOrderChanges = Object.values(orderChanges).some(change => change);

    if (!hasCustomerChanges && !hasOrderChanges) {
      // No changes detected, just exit edit mode
      isEditing.value = false;
      return;
    }

    // Prepare update data based on what actually changed
    const updateData: any = {};

    // Only include customer fields that changed
    if (hasCustomerChanges) {
      if (customerChanges.customer_name) updateData.customer_name = order.value.customer_name;
      if (customerChanges.customer_phone) updateData.customer_phone = order.value.customer_phone;
      if (customerChanges.customer_email) updateData.customer_email = order.value.customer_email;
      if (customerChanges.customer_address) updateData.customer_address = order.value.customer_address;
    }

    // Only include order fields that changed
    if (hasOrderChanges) {
      if (orderChanges.total_amount) updateData.total_amount = order.value.total_amount;
      if (orderChanges.status) updateData.status = order.value.status;
      if (orderChanges.note) updateData.note = order.value.note;
    }

    // Update only the changed fields
    const { error: orderError } = await supabase
      .from("order_detail")
      .update(updateData)
      .eq("id", order.value.id);

    if (orderError) {
      error.value = "Failed to update order: " + orderError.message;
      return;
    }

    // Success - exit edit mode and refresh data
    isEditing.value = false;
    await fetchOrder();
  } catch (err) {
    error.value = "An unexpected error occurred: " + (err as Error).message;
  }
};

const deleteOrder = async () => {
  const confirmDelete = confirm("Are you sure you want to delete this order?");
  if (!confirmDelete) return;

  try {
    // Delete order detail first
    const { error: orderDeleteError } = await supabase
      .from("order_detail")
      .delete()
      .eq("id", order.value.id);

    if (orderDeleteError) {
      error.value = `Failed to delete order: ${orderDeleteError.message}`;
      return;
    }

    // Optionally delete customer if no other orders exist
    // You might want to keep customers for future orders
    // For now, we'll just delete the order detail
    
    router.push("/orders");
  } catch (err) {
    error.value = "An unexpected error occurred: " + (err as Error).message;
  }
};

const fetchOrder = async () => {
  const { id } = route.params;

  const { data: orderData, error: orderError } = await supabase
    .from("order_detail")
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

  // Map the joined data to the expected structure
  order.value = {
    ...orderData,
    customer_name: orderData.customer_name || "",
    customer_phone: orderData.customer_phone || "",
    customer_email: orderData.customer_email || "",
    customer_address: orderData.customer_address || "",
  };
  
  // Initialize original data for change detection
  originalData.value = {
    customer_name: order.value.customer_name,
    customer_phone: order.value.customer_phone,
    customer_email: order.value.customer_email,
    customer_address: order.value.customer_address,
    total_amount: order.value.total_amount,
    status: order.value.status,
    note: order.value.note,
  };
  
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
            @click="startEditing"
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
              @click="cancelEditing"
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
                v-model="order.note"
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

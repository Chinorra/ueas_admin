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

const formatTime = (hour: number, minute: number, isAm: boolean) => {
  const amPm = isAm ? 'AM' : 'PM';
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${amPm}`;
};

const formatCurrency = (amount: number) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

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

    console.log("Change detection:", {
      customerChanges,
      orderChanges,
      currentOrder: order.value,
      originalData: originalData.value
    });

    const hasCustomerChanges = Object.values(customerChanges).some(change => change);
    const hasOrderChanges = Object.values(orderChanges).some(change => change);

    if (!hasCustomerChanges && !hasOrderChanges) {
      // No changes detected, just exit edit mode
      isEditing.value = false;
      return;
    }



    // Update order fields in order_detail table
    if (hasOrderChanges) {
      const orderUpdateData: any = {};
      if (orderChanges.total_amount) orderUpdateData.total_amount = order.value.total_amount;
      if (orderChanges.status) orderUpdateData.status = order.value.status;
      if (orderChanges.note) orderUpdateData.note = order.value.note;
      orderUpdateData.update_at = new Date().toLocaleString("en-CA", { timeZone: "Asia/Ho_Chi_Minh", hour12: false }).replace(", ", "T") + ".000Z";

      console.log("Updating order_detail with:", orderUpdateData);
      console.log("Order ID being used:", order.value.id);
      
      // First check if order_detail record exists
      const { data: existingDetail, error: checkError } = await supabase
        .from("order_detail")
        .select("id")
        .eq("order_id", route.params.id)
        .single();
      
      if (checkError) {
        console.error("Error checking order_detail:", checkError);
        // If no record exists, create one
        const { error: insertError } = await supabase
          .from("order_detail")
          .insert({
            order_id: route.params.id,
            service_id: order.value.service_id, // Include service_id to satisfy foreign key
            created_at: new Date().toLocaleString("en-CA", { timeZone: "Asia/Ho_Chi_Minh", hour12: false }).replace(", ", "T") + ".000Z",
            update_at: new Date().toLocaleString("en-CA", { timeZone: "Asia/Ho_Chi_Minh", hour12: false }).replace(", ", "T") + ".000Z",
            ...orderUpdateData
          });
        
        if (insertError) {
          error.value = "Failed to create order details: " + insertError.message;
          console.error("Order detail insert error:", insertError);
          return;
        }
        console.log("Order details created successfully");
      } else {
        // Update existing record
        const { error: orderError } = await supabase
          .from("order_detail")
          .update(orderUpdateData)
          .eq("order_id", route.params.id);

        if (orderError) {
          error.value = "Failed to update order details: " + orderError.message;
          console.error("Order update error:", orderError);
          return;
        }
        console.log("Order details updated successfully");
      }
    }

    // Update customer fields in orders table
    if (hasCustomerChanges) {
      const customerUpdateData: any = {};
      if (customerChanges.customer_name) customerUpdateData.customer_name = order.value.customer_name;
      if (customerChanges.customer_phone) customerUpdateData.phone_number = order.value.customer_phone;
      if (customerChanges.customer_email) customerUpdateData.email = order.value.customer_email;
      if (customerChanges.customer_address) customerUpdateData.address = order.value.customer_address;
      customerUpdateData.update_at = new Date().toLocaleString("en-CA", { timeZone: "Asia/Ho_Chi_Minh", hour12: false }).replace(", ", "T") + ".000Z";

      console.log("Updating orders table with:", customerUpdateData);
      const { error: customerError } = await supabase
        .from("orders")
        .update(customerUpdateData)
        .eq("id", order.value.id);

      if (customerError) {
        error.value = "Failed to update customer info: " + customerError.message;
        console.error("Customer update error:", customerError);
        return;
      }
      console.log("Customer info updated successfully");
    }

    // Success - update local data and exit edit mode
    isEditing.value = false;
    
    // Update originalData to reflect the new changes
    originalData.value = {
      customer_name: order.value.customer_name,
      customer_phone: order.value.customer_phone,
      customer_email: order.value.customer_email,
      customer_address: order.value.customer_address,
      total_amount: order.value.total_amount,
      status: order.value.status,
      note: order.value.note,
    };
    
    // Show success message
    console.log("Order updated successfully!");
  } catch (err) {
    error.value = "An unexpected error occurred: " + (err as Error).message;
  }
};

const deleteOrder = async () => {
  const confirmDelete = confirm("Are you sure you want to delete this order?");
  if (!confirmDelete) return;

  try {
    // Delete order from orders table
    const { error: orderDeleteError } = await supabase
      .from("orders")
      .delete()
      .eq("id", order.value.id);

    if (orderDeleteError) {
      error.value = `Failed to delete order: ${orderDeleteError.message}`;
      return;
    }

    // Note: Customer is kept for potential future orders
    
    router.push("/orders");
  } catch (err) {
    error.value = "An unexpected error occurred: " + (err as Error).message;
  }
};

const fetchOrder = async () => {
  const { id } = route.params;

  // First get the order from orders table
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (orderError) {
    error.value = orderError.message;
    loading.value = false;
    return;
  }

  // Then get additional order details from order_detail table
  const { data: orderDetailData, error: detailError } = await supabase
    .from("order_detail")
    .select("*")
    .eq("order_id", id)
    .single();

  if (detailError) {
    console.warn("Failed to fetch order details:", detailError.message);
  }

  // Get service name from services table
  let serviceName = "No service";
  if (orderData.service_id) {
    const { data: serviceData, error: serviceError } = await supabase
      .from("services")
      .select("title")
      .eq("id", orderData.service_id)
      .single();

    if (!serviceError && serviceData) {
      serviceName = serviceData.title;
    }
  }

  // Map the combined data to the expected structure
  order.value = {
    ...orderData,
    ...orderDetailData,
    customer_name: orderData.customer_name || "No customer name",
    customer_phone: orderData.phone_number || "No phone",
    customer_email: orderData.email || "No email",
    customer_address: orderData.address || "No address",
    service_name: serviceName,
    status: orderDetailData?.status || "pending",
    total_amount: orderDetailData?.total_amount || 0,
    note: orderDetailData?.note || "",
  };
  
  // Initialize original data for change detection
  originalData.value = {
    customer_name: order.value.customer_name,
    customer_phone: order.value.customer_phone,
    customer_email: order.value.customer_email,
    customer_address: order.value.customer_address,
    total_amount: order.value.total_amount || 0,
    status: order.value.status || "pending",
    note: order.value.note || "",
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
                :value="order.service_name || 'No service'"
                readonly
                class="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700"
                >Date & Time</label
              >
              <input
                :value="`${new Date(order.date).toLocaleDateString('vi-VN')} at ${formatTime(order.hour, order.minute, order.is_am)}`"
                readonly
                class="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700"
              />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700"
                >Total Amount</label
              >
              <input
                v-if="isEditing"
                v-model="order.total_amount"
                type="number"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
              <div
                v-else
                class="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700"
              >
                {{ formatCurrency(order.total_amount || 0) }}
              </div>
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
            {{ new Date(order.update_at).toLocaleString("vi-VN") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

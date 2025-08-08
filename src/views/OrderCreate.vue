<template>
  <div class="mx-auto max-w-4xl p-6">
    <h1 class="mb-6 text-3xl font-bold">Create New Order</h1>

    <div
      v-if="error"
      class="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
    >
      {{ error }}
    </div>

    <form @submit.prevent="createOrder" class="space-y-6">
      <!-- Customer Information -->
      <div class="rounded-lg bg-white p-6 shadow">
        <h2 class="mb-4 text-xl font-semibold">Customer Information</h2>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700"
              >Customer Name *</label
            >
            <input
              v-model="customerName"
              type="text"
              required
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700"
              >Phone Number *</label
            >
            <input
              v-model="customerPhone"
              type="tel"
              required
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700"
              >Email</label
            >
            <input
              v-model="customerEmail"
              type="email"
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
            />
          </div>
          <div class="md:col-span-2">
            <label class="mb-1 block text-sm font-medium text-gray-700"
              >Address *</label
            >
            <textarea
              v-model="customerAddress"
              required
              rows="3"
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter customer address"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Service Information -->
      <div class="rounded-lg bg-white p-6 shadow">
        <h2 class="mb-4 text-xl font-semibold">Service Information</h2>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700"
              >Service *</label
            >
            <select
              v-model="selectedService"
              @change="onServiceChange"
              required
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a service</option>
              <option
                v-for="service in services"
                :key="service.id"
                :value="service"
              >
                {{ service.title }}
              </option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700"
              >Total Amount (VND) *</label
            >
            <input
              v-model="totalAmount"
              type="number"
              required
              min="0"
              step="1000"
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter total amount"
            />
          </div>
          <div class="md:col-span-2">
            <label class="mb-1 block text-sm font-medium text-gray-700"
              >Service Description</label
            >
            <textarea
              v-model="serviceDescription"
              rows="4"
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter service description or specific requirements"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Order Details -->
      <div class="rounded-lg bg-white p-6 shadow">
        <h2 class="mb-4 text-xl font-semibold">Order Details</h2>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700"
              >Status</label
            >
            <select
              v-model="status"
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div class="md:col-span-2">
            <label class="mb-1 block text-sm font-medium text-gray-700"
              >Notes</label
            >
            <textarea
              v-model="notes"
              rows="3"
              class="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes about the order"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Submit Buttons -->
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="router.back()"
          class="rounded-md border border-gray-300 px-6 py-2 text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="rounded-md bg-blue-500 px-6 py-2 text-white transition hover:bg-blue-600"
        >
          Create Order
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/services/supabase";

const router = useRouter();

// Form fields
const customerName = ref("");
const customerPhone = ref("");
const customerEmail = ref("");
const customerAddress = ref("");
const selectedService = ref("");
const serviceDescription = ref("");
const totalAmount = ref("");
const status = ref("pending");
const notes = ref("");

// Other state
const services = ref([]);
const error = ref(null);

// Load available services
onMounted(async () => {
  const { data, error: fetchError } = await supabase
    .from("services")
    .select("id, title, description")
    .order("title");

  if (fetchError) {
    error.value = "Failed to load services: " + fetchError.message;
  } else {
    services.value = data || [];
  }
});

const onServiceChange = () => {
  if (selectedService.value) {
    serviceDescription.value = selectedService.value.description;
  } else {
    serviceDescription.value = "";
  }
};

const createOrder = async () => {
  error.value = null;

  // Validation
  if (
    !customerName.value ||
    !customerPhone.value ||
    !customerAddress.value ||
    !selectedService.value ||
    !totalAmount.value
  ) {
    error.value = "Please fill in all required fields";
    return;
  }

  try {
    const { error: insertError } = await supabase.from("orders").insert([
      {
        customer_name: customerName.value,
        customer_phone: customerPhone.value,
        customer_email: customerEmail.value || null,
        customer_address: customerAddress.value,
        service_id: selectedService.value.id,
        service_description: serviceDescription.value,
        total_amount: parseFloat(totalAmount.value),
        status: status.value,
        notes: notes.value || null,
      },
    ]);

    if (insertError) {
      error.value = "Failed to create order: " + insertError.message;
      return;
    }

    // Success - redirect to orders list
    router.push("/orders");
  } catch (err) {
    error.value = "An unexpected error occurred: " + err.message;
  }
};
</script>

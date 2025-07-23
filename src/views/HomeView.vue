<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { supabase } from '@/services/supabase';

const services = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  const { data, error: fetchError } = await supabase
    .from('services')
    .select('*');

  if (fetchError) {
    error.value = fetchError.message;
  } else {
    services.value = data ?? [];
  }

  loading.value = false;
});
</script>


<template>
  <h1 class="text-3xl font-medium mb-4">Home</h1>

  <div v-if="loading">Loading services...</div>
  <div v-else-if="error" class="text-red-500">{{ error }}</div>
  <div v-else>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        v-for="service in services"
        :key="service.id"
        :to="{ name: 'ServiceDetail', params: { id: service.id } }"
        class="border rounded-xl p-4 shadow hover:shadow-md transition block hover:scale-[1.02]"
      >
        <img
          :src="service.service_image"
          alt="Service Image"
          class="w-full h-48 object-contain rounded-md mb-3"
        />
        <h2 class="text-lg font-semibold mb-1 text-center">{{ service.title }}</h2>
      </router-link>
    </div>
  </div>
</template>




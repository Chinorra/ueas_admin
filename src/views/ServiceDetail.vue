 <script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/services/supabase'

const route = useRoute()
const router = useRouter()

const service = ref(null)
const customers = ref([])
const loading = ref(true)
const error = ref(null)

const isEditing = ref(false)
const originalTitle = ref('')
const originalDescription = ref('')

const fileInput = ref(null)
const selectedFile = ref(null)

const triggerFileInput = () => {
    if (isEditing.value) {
        fileInput.value.click()
    }
    }

const startEditing = () => {
  originalTitle.value = service.value.title
  originalDescription.value = service.value.description
  isEditing.value = true
}

const cancelEditing = () => {
  service.value.title = originalTitle.value
  service.value.description = originalDescription.value
  isEditing.value = false
}

const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        selectedFile.value = file
        // Optional: preview the image immediately
        service.value.service_image = URL.createObjectURL(file)
    }
    }

const updateService = async () => {

    let imageUrl = service.value.image
    // If a new file is selected, upload to Supabase Storage
    if (selectedFile.value) {
        const file = selectedFile.value

        const fileName = `${service.value.id}-${Date.now()}.${file.name.split('.').pop()}`

        const { error: uploadError } = await supabase.storage
        .from('image') // your bucket name
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
        })

        if (uploadError) {
        error.value = 'Image upload failed: ' + uploadError.message
        return
        }

        // Get the public URL
        const { data } = supabase.storage
        .from('image')
        .getPublicUrl(fileName)


        imageUrl = data.publicURL
    }

  const { error: updateError } = await supabase
    .from('services')
    .update({
      title: service.value.title,
      description: service.value.description,
      service_image: imageUrl
    })
    .eq('id', service.value.id)

  if (updateError) {
    error.value = updateError.message
  } else {
    isEditing.value = false
    selectedFile.value = null

  }
}

const deleteService = async () => {
  const confirmDelete = confirm('Are you sure you want to delete this service and all its related customers?')
  if (!confirmDelete) return

  // Step 1: Delete related customers
  const { error: customerDeleteError } = await supabase
    .from('customers')
    .delete()
    .eq('service_id', service.value.id)

  if (customerDeleteError) {
    error.value = `Failed to delete related customers: ${customerDeleteError.message}`
    return
  }

  // Step 2: Delete the service
  const { error: serviceDeleteError } = await supabase
    .from('services')
    .delete()
    .eq('id', service.value.id)

  if (serviceDeleteError) {
    error.value = `Failed to delete service: ${serviceDeleteError.message}`
  } else {
    // Success: Navigate back or show message
    vueRouter.push('/services') // Change path to wherever you want to redirect
  }
}



onMounted(async () => {
  const { id } = route.params

  const { data: serviceData, error: serviceError } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single()

  if (serviceError) {
    error.value = serviceError.message
    loading.value = false
    return
  }

  service.value = serviceData

  const { data: customerData, error: customerError } = await supabase
    .from('customers')
    .select('*')
    .eq('service_id', id)

  if (customerError) {
    error.value = customerError.message
  } else {
    customers.value = customerData
  }

  loading.value = false
})
</script>

<template>
  <div class="p-4">
    <div v-if="loading">Loading service...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else>
        <div class="flex items-center justify-between mb-4">
            <input
  v-model="service.title"
  :readonly="!isEditing"
  :class="[
    'text-3xl font-bold mr-4 border-none focus:outline-none w-full',
    isEditing ? 'bg-white text-black' : 'bg-transparent text-white'
  ]"
/>

  <div class="flex gap-2">
  <button
    @click="isEditing ? updateService() : startEditing()"
    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
  >
    {{ isEditing ? 'Save' : 'Update' }}
  </button>

  <button
    @click="isEditing ? cancelEditing() : deleteService()"
    :class="isEditing 
      ? 'bg-gray-500 hover:bg-gray-600' 
      : 'bg-red-500 hover:bg-red-600'
    "
    class="text-white px-4 py-2 rounded"
  >
    {{ isEditing ? 'Cancel' : 'Delete' }}
  </button>
</div>


</div>

<div class="flex flex-col md:flex-row gap-6 mb-6">
  <div class="w-1/4 flex-shrink-0">
    <div class="aspect-square pt-4">
        <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleImageUpload"
            />

        <!-- Clickable image -->
        <img
        :src="service.service_image"
        @click="triggerFileInput"
        class="w-full h-full object-contain rounded cursor-pointer hover:opacity-80 transition"
        />
    </div>
  </div>
 

  <div class="w-full md:w-3/4">
            <div>
  <label class="block font-semibold text-white mb-1 text-lg">Mô tả dịch vụ:</label>
  <textarea
    v-model="service.description"
    :readonly="!isEditing"
    :class="[
      'w-full whitespace-pre-line border border-gray-300 focus:outline-none resize-none rounded p-2',
      isEditing ? 'bg-white text-black' : 'bg-transparent text-white'
    ]"
    rows="9"
  ></textarea>
</div>
</div>
</div>

<h2 class="text-2xl font-semibold mb-2">Dự án tiêu biểu</h2>

<div class="flex gap-4 py-4 overflow-x-auto">
  <!-- ➕ Add New Customer Card -->
  <div
  @click="$router.push({ path: '/customers/new', query: { service_id: service.id } })"
    class="min-w-[250px] cursor-pointer border-2 border-dashed border-gray-300 rounded-lg shadow flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 transition"
  >
    <span class="text-4xl">＋</span>
    <p class="mt-2 font-semibold">Thêm khách hàng</p>
  </div>

  <!-- Existing Customers -->
  <div
    v-for="customer in customers"
    :key="customer.id"
    @click="$router.push(`/customers/${customer.id}`)"
    class="min-w-[250px] cursor-pointer border rounded-lg shadow p-3 bg-white hover:bg-gray-50 transition"
  >
    <img :src="customer.image" alt="" class="w-full h-50 object-contain rounded mb-2" />
    <h3 class="font-bold text-gray-600 text-lg mb-1">{{ customer.name }}</h3>
    <p class="text-sm text-gray-600 mb-1">{{ customer.job }}</p>
    <p class="text-sm text-gray-600">{{ customer.address }}</p>
  </div>
  
</div>
    </div>
  </div>
</template> 




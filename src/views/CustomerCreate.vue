<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useRoute } from 'vue-router'

  import { supabase } from '@/services/supabase'
  import { useServiceStore } from '@/stores/serviceStore'

const serviceStore = useServiceStore()
const service = serviceStore.currentService
  
  const name = ref('')
  const job = ref('')
  const address = ref('')
  const imageFile = ref(null)
  const previewUrl = ref(null)
  const error = ref(null)
  const router = useRouter()

const route = useRoute()
  
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      imageFile.value = file
      previewUrl.value = URL.createObjectURL(file)
    }
  }
  
  const createCustomer = async () => {
    error.value = null

    if (!name.value || !job.value || !address.value || !imageFile.value) {
    alert('Vui lòng điền đầy đủ thông tin và chọn hình ảnh.')
    return
  }
  
    let imageUrl = null
  
    // 1. Upload image if provided
    if (imageFile.value) {
      const filename = `${Date.now()}-${imageFile.value.name}`
      const filePath = `customers/${filename}`
  
      const { error: uploadError } = await supabase.storage
        .from('image') // <-- your bucket name
        .upload(filePath, imageFile.value)
  
      if (uploadError) {
        error.value = 'Image upload failed: ' + uploadError.message
        return
      }
  
      const { data } = supabase.storage.from('image').getPublicUrl(filePath)
      imageUrl = data.publicURL
    }
  
    // 2. Insert customer into database
    const { error: insertError } = await supabase
      .from('customers')
      .insert([
        {
          name: name.value,
          job: job.value,
          address: address.value,
          image: imageUrl,
          service_id: service.id,
          project: service.title
        },
      ])
  
    if (insertError) {
      error.value = insertError.message
      return
    }
  
    // ✅ Redirect back or to the detail page
    router.back() // change this if needed
  }
  </script>

<template>
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Thêm khách hàng mới</h1>
  
      <div class="flex flex-col md:flex-row gap-6">
        <!-- 📷 Image Upload (square) -->
        <div class="w-full md:w-1/3 flex-shrink-0 pt-2">
          <div class="aspect-square border rounded flex items-center justify-center cursor-pointer hover:bg-gray-100 relative">
            <input type="file" accept="image/*" @change="handleFileChange" class="absolute inset-0 opacity-0 cursor-pointer" />
            <template v-if="previewUrl">
              <img :src="previewUrl" alt="Preview" class="w-full h-full object-cover rounded" />
            </template>
            <template v-else>
              <span class="text-gray-400">Chọn ảnh</span>
            </template>
          </div>
        </div>
  
        <!-- ✏️ Name and Job -->
        <div class="flex-1 space-y-4">
          <div>
            <label class="block font-medium mb-1">Tên khách hàng</label>
            <input v-model="name" type="text" class="w-full border rounded p-2 text-black" />
          </div>
  
          <div>
            <label class="block font-medium mb-1">Công việc</label>
            <input v-model="job" type="text" class="w-full border rounded p-2 text-black" />
          </div>

          <div class="mt-4">
        <label class="block font-medium mb-1">Địa chỉ</label>
        <textarea v-model="address" rows="3" class="w-full border rounded p-2 text-black"></textarea>
      </div>
        </div>
      </div>
  
      <!-- 🏠 Address -->
   
  
      <!-- ✅ Submit Button -->
      <div class="mt-6">
        <button
          @click="createCustomer"
          class="w-1/3 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Lưu khách hàng
        </button>
      </div>
  
      <!-- ❌ Error -->
      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    </div>
  </template>
  
  
  
  
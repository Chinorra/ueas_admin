<template>
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Thêm dịch vụ mới</h1>
  
      <div class="flex flex-col md:flex-row gap-6">
        <!-- 📷 Image Upload (square) -->
        <div class="w-full md:w-1/3 flex-shrink-0 pt-2">
          <div
            class="aspect-square border rounded flex items-center justify-center cursor-pointer hover:bg-gray-100 relative"
          >
            <input type="file" accept="image/*" @change="handleFileChange" class="absolute inset-0 opacity-0 cursor-pointer" />
            <template v-if="previewUrl">
              <img :src="previewUrl" alt="Preview" class="w-full h-full object-cover rounded" />
            </template>
            <template v-else>
              <span class="text-gray-400">Chọn ảnh</span>
            </template>
          </div>
        </div>
  
        <!-- ✏️ Title and Description -->
        <div class="flex-1 space-y-4">
          <div>
            <label class="block font-medium mb-1">Tên dịch vụ</label>
            <input v-model="title" type="text" class="w-full border rounded p-2 text-black" />
          </div>
  
          <div class="pt-3">
            <label class="block font-medium mb-1">Mô tả</label>
            <textarea v-model="description" rows="6" class="w-full border rounded p-2 text-black"></textarea>
          </div>
        </div>
      </div>
  
      <!-- ✅ Submit Button -->
      <div class="mt-6">
        <button
          @click="createService"
          class="w-1/3 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Lưu dịch vụ
        </button>
      </div>
  
      <!-- ❌ Error -->
      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  import { supabase } from '@/services/supabase'
  import { useRouter } from 'vue-router'
  
  const title = ref('')
  const description = ref('')
  const imageFile = ref(null)
  const previewUrl = ref(null)
  const error = ref(null)
  const router = useRouter()
  
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      imageFile.value = file
      previewUrl.value = URL.createObjectURL(file)
    }
  }
  
  const createService = async () => {
    error.value = null
  
    if (!title.value || !description.value || !imageFile.value) {
      error.value = 'Vui lòng nhập đủ tất cả trường và chọn ảnh.'
      return
    }
  
    // 💾 Upload image
    const filename = `${Date.now()}-${imageFile.value.name}`
    const filePath = `services/${filename}`
    const { error: uploadError } = await supabase.storage.from('image').upload(filePath, imageFile.value)
  
    if (uploadError) {
      error.value = 'Image upload failed: ' + uploadError.message
      return
    }
  
    const { data } = supabase.storage.from('image').getPublicUrl(filePath)
    const imageUrl = data.publicUrl
  
    // 🖊️ Insert into DB
    const { error: insertError } = await supabase.from('services').insert([
      {
        title: title.value,
        description: description.value,
        project_title: `dự án tiêu biểu ${title.value}`.toUpperCase(),
        service_image: imageUrl
      }
    ])
  
    if (insertError) {
      error.value = insertError.message
    } else {
      router.back()
    }
  }
  </script>
  
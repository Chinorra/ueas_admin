        <script setup>
        import { ref, onMounted } from 'vue'
        import { useRoute, useRouter } from 'vue-router'
        import { supabase } from '@/services/supabase'

        const route = useRoute()
        const router = useRouter()

        const customer = ref(null)
        const loading = ref(true)
        const error = ref(null)
    
        const isEditing = ref(false)
        const originalData = ref({})

        const fileInput = ref(null)
    const selectedFile = ref(null)

    const triggerFileInput = () => {
    if (isEditing.value) {
        fileInput.value.click()
    }
    }

    const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        selectedFile.value = file
        // Optional: preview the image immediately
        customer.value.image = URL.createObjectURL(file)
    }
    }

        const startEditing = () => {
        originalData.value = { ...customer.value }
        isEditing.value = true
        }

        const cancelEditing = () => {
        customer.value = { ...originalData.value }
        isEditing.value = false
        }

        const updateCustomer = async () => {
    let imageUrl = customer.value.image
    // If a new file is selected, upload to Supabase Storage
    if (selectedFile.value) {
        const file = selectedFile.value

        const fileName = `${customer.value.id}-${Date.now()}.${file.name.split('.').pop()}`

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


        imageUrl = data.publicUrl
    }

    // Update customer record
    const { error: updateError } = await supabase
        .from('customers')
        .update({
        name: customer.value.name,
        job: customer.value.job,
        address: customer.value.address,
        image: imageUrl, // use updated or original image
        })
        .eq('id', customer.value.id)

    if (updateError) {
        error.value = updateError.message
    } else {
        isEditing.value = false
        selectedFile.value = null
        router.back()
    }
    }

    const deleteCustomer = async () => {
  const confirmDelete = confirm('Are you sure you want to delete this customer?')
  if (!confirmDelete) return

  error.value = null

  // 🧠 Extract the file path from the full public URL
  const imageUrl = customer.value.image
  const imagePath = imageUrl?.split('/storage/v1/object/public/image/')[1]
        console.log(imagePath);
  // 🗑️ Delete the image from Supabase Storage
  if (imagePath) {
    const { error: storageError } = await supabase
      .storage
      .from('image') // bucket name
      .remove([imagePath])

    if (storageError) {
      console.error('Failed to delete image:', storageError.message)
      error.value = 'Failed to delete image from storage.'
      return
    }
  }

  // 🗑️ Delete the customer from the database
  const { error: deleteError } = await supabase
    .from('customers')
    .delete()
    .eq('id', customer.value.id)

  if (deleteError) {
    error.value = deleteError.message
  } else {
    router.back() // ✅ Redirect
  }
}


        onMounted(async () => {
        const { id } = route.params
        const { data, error: fetchError } = await supabase
            .from('customers')
            .select('*')
            .eq('id', id)
            .single()

        if (fetchError) {
            error.value = fetchError.message
        } else {
            customer.value = data
        }

        loading.value = false
        })
        </script>

        <template>
        <div class="p-4">
            <div v-if="loading">Loading customer...</div>
            <div v-else-if="error" class="text-red-500">{{ error }}</div>
            <div v-else>
            <div class="flex items-center justify-between mb-4">
                <input
                v-model="customer.name"
                :readonly="!isEditing"
                :class="[
                    'text-3xl font-bold mr-4 border-none focus:outline-none w-full',
                    isEditing ? 'bg-white text-black' : 'bg-transparent text-white'
                ]"
                />
                <div class="flex gap-2">
                <button
                    @click="isEditing ? updateCustomer() : startEditing()"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    {{ isEditing ? 'Save' : 'Update' }}
                </button>

                <button
                    @click="isEditing ? cancelEditing() : deleteCustomer()"
                    :class="isEditing
                    ? 'bg-gray-500 hover:bg-gray-600'
                    : 'bg-red-500 hover:bg-red-600'"
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
        :src="customer.image"
        @click="triggerFileInput"
        class="w-full h-full object-contain rounded cursor-pointer hover:opacity-80 transition"
        />
                </div>
                </div>

                <div class="w-full md:w-3/4">
                    <div>
        <label class="block font-semibold text-white mb-1 text-lg">Công việc:</label>
        <textarea
            v-model="customer.job"
            :readonly="!isEditing"
            :class="[
            'w-full whitespace-pre-line border border-gray-300 focus:outline-none resize-none rounded p-2',
            isEditing ? 'bg-white text-black' : 'bg-transparent text-white'
            ]"
            rows="3"
        ></textarea>
        </div>
        <div class="pt-4">
        <label class="block font-semibold text-white mb-1 text-lg">Địa chỉ:</label>
                <textarea
                    v-model="customer.address"
                    :readonly="!isEditing"
                    :class="[
                    'w-full whitespace-pre-line border border-gray-300 focus:outline-none resize-none rounded p-2',
                    isEditing ? 'bg-white text-black' : 'bg-transparent text-white'
                    ]"
                    rows="3"
                ></textarea>
                </div>
                </div>
            </div>
            </div>
        </div>
        </template>

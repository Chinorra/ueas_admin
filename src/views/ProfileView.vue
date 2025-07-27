<script setup lang="ts">
import { ref, onMounted } from "vue";
import { supabase } from "@/services/supabase";

const name = ref("");
const password = ref("");
const nickname = ref("");
const loading = ref(false);

onMounted(async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;
  const metadata = user?.user_metadata;
  name.value = metadata?.nickname || user?.email || "";
  nickname.value = name.value;
});

async function changePassword() {
  if (!password.value || password.value.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  loading.value = true;

  const { error } = await supabase.auth.updateUser({
    password: password.value,
  });

  alert(error?.message || "Password successfully changed");
  password.value = "";
  loading.value = false;
}
</script>


<template>
  <h1 class="mb-2 text-3xl font-medium">Profile</h1>
  <p class="mb-4 text-xl">Hi, {{ name }}</p>

  <div class="inline-grid grid-cols-1 gap-8 md:grid-cols-2">
    <form class="inline-flex flex-col space-y-2" @submit.prevent="changePassword">
      <VLabel for="password">Change your password</VLabel>
      <VPasswordInput
        :disabled="loading"
        v-model="password"
        class="inline-block"
        name="password"
        id="password"
        placeholder="Choose a new password"
      />
      <VButton :disabled="loading" class="bg-teal-700">Change Password</VButton>
    </form>
  </div>
</template>

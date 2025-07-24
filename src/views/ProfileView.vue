<script setup lang="ts">
import { ref } from "vue";
import { supabase } from "@/services/supabase";
import { User } from "@supabase/supabase-js";

// Get session from supabase.auth.getSession()
const {
  data: { session },
} = await supabase.auth.getSession();

const user = session?.user as User;
const metadata = user?.user_metadata;
const name = ref(metadata?.nickname || user?.email || "");

const password = ref("");
const nickname = ref(name.value);

const loading = ref(false);

/* Change Password (v2 style) */
async function changePassword() {
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

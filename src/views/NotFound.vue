<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { ref, onMounted } from "vue";

const { supabase } = useAuthStore();
const reRoute = ref({ to: "/signin", text: "Sign In" });

onMounted(async () => {
  const { data } = await supabase.auth.getUser();
  if (data.user) {
    reRoute.value = { to: "/", text: "Go Home" };
  }
});
</script>

<template>
  <div class="self-center text-xl font-medium mb-4">404 - Page not found</div>
  <router-link :to="reRoute.to" class="self-center">{{ reRoute.text }}</router-link>
</template>

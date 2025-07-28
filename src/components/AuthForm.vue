<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth";
import { Ref } from "vue";

const props = defineProps<{
  signUp: boolean;
  title: string;
  subtitle: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
}>();

const credentials: Ref<{ email: string; password: string }> = ref({
  email: "",
  password: "",
});


const router = useRouter();

const emailLoading = ref(false);
async function emailAuth() {
  emailLoading.value = true;
  const { supabase } = useAuthStore();
  const { data, error } = props.signUp
    ? await supabase.auth.signUp(credentials.value)
    : await supabase.auth.signInWithPassword(credentials.value);
  if (data?.user) router.push("/");
  else if (error) {
    alert(error.message);
    emailLoading.value = false;
  }
}

async function signInWithProvider(provider: "github" | "google" | "twitter" | "facebook", loadingRef: Ref<boolean>) {
  loadingRef.value = true;
  const { supabase } = useAuthStore();
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/callback`,
    },
  });
  if (error) {
    alert(error.message);
    loadingRef.value = false;
  }
}

const gitHubLoading = ref(false);
const googleLoading = ref(false);
const twitterLoading = ref(false);
const facebookLoading = ref(false);

const gitHubAuth = () => signInWithProvider("github", gitHubLoading);
const googleAuth = () => signInWithProvider("google", googleLoading);
const twitterAuth = () => signInWithProvider("twitter", twitterLoading);
const facebookAuth = () => signInWithProvider("facebook", facebookLoading);

const loading = computed(
  () =>
    gitHubLoading.value ||
    emailLoading.value ||
    googleLoading.value ||
    twitterLoading.value ||
    facebookLoading.value
);
</script>

<template>
  <div>

    <form class="flex w-full flex-col items-start" @submit.prevent="emailAuth">
      <VLabel for="email">Email</VLabel>
      <VInput
        required
        :disabled="loading"
        class="w-full"
        name="email"
        id="email"
        type="email"
        :placeholder="emailPlaceholder"
        v-model="(credentials.email as string)"
      />
      <VLabel for="password">Mật khẩu</VLabel>
      <VPasswordInput
        :disabled="loading"
        class="mb-4 w-full"
        name="password"
        id="password"
        :placeholder="passwordPlaceholder"
        v-model="(credentials.password as string)"
      />

      <VButton
        :loading="emailLoading"
        :disabled="loading"
        type="submit"
        class="bg-teal-700"
        >{{ signUp ? "Đăng kí" : "Đăng nhập" }}</VButton
      >
    </form>
   

    <slot name="actions" />
  </div>
</template>

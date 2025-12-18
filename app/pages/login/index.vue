<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui';
import { z } from 'zod'

definePageMeta({
  layout: false
})

const state = ref({
  email: '',
  password: ''
})
const schema = z.object({
  email: z.string().refine((val) => val.match(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/), {
    message: 'Invalid email'
  }),
  password: z.string().min(6)
})

async function onSubmit(event: FormSubmitEvent<z.output<typeof schema>>) {
  const { execute, error } = await useFetch('/api/login', {
    method: "POST",
    body: event.data,
     watch: false,
     immediate: false
  })

  await execute()
  if (!error.value) {
    navigateTo('/admin/dashboard')
    return
  }
  // const { data, error, execute } = await useFetch('/api/auth/login', {
  //   method: 'POST',
  //   body: event.data,
  //   immediate: false,
  //   watch: false
  // })
  // await execute()
  // if (!error.value) {
  //   token.value = data.value?.token
  //   navigateTo('/admin/dashboard')
  //   return
  // }

}
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <div class="bg-white border border-gray-200 p-6 rounded-lg flex flex-col gap-5 w-[400px]">
      <h1 class="text-2xl font-bold justify-center items-center flex">Login</h1>
      <p class="text-sm text-gray-600 text-center">Sign in for access application</p>
      <UForm :schema="schema" :state="state" @submit="onSubmit" class="flex flex-col gap-5">
        <UFormField name="email" required>
          <UInput type="email" class="w-full" v-model="state.email" placeholder="Email" />
        </UFormField>
        <UFormField name="password" required>
          <UInput type="password" class="w-full" v-model="state.password" placeholder="Password" />
        </UFormField>
        <UButton type="submit" color="primary" class="w-full flex justify-center">Submit</UButton>
      </UForm>
      <div class="flex items-center gap-2">
        <p class="text-sm text-gray-600">Don't have an account?</p>
        <UButton variant="link" class="text-blue-600 p-0">Sign up</UButton>
      </div>
    </div>

  </div>
</template>
export default defineNuxtPlugin(async () => {
  const token = useCookie('token')
  
  if (!token.value) return
  const getMe     = await $fetch('/api/getme', {
    headers: {
      Authorization: `Bearer ${token.value}`
    }
  })
  const checkUser = await $fetch('/api/user', {
    method: 'POST',
    body: {
      email: getMe.data.email
    }
  })
  const auth      = useAuth()
  auth.setUser(checkUser) 
})
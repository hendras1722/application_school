export default defineNuxtPlugin(async () => {
  const token = useCookie('token')

  
  try {
    if (!token.value) {
      return
    }
    const getMe = await $fetch('/api/getme', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    const checkUser = await $fetch<any>('/api/user', {
      method: 'POST',
      body: {
        email: getMe.data.email
      }
    })

    const profile = checkUser.role === 'student' ? await $fetch<any>('/api/student/single', {
      params: {
        idSiswa: checkUser._id
      }
    }) : await $fetch<any>('/api/teacher/single', {
      params: {
        idTeacher: checkUser._id
      }
    })

    const auth = useAuth()
    auth.setUser(checkUser)
    auth.setProfile(profile)

  } catch (error) {
    console.error('[AUTH PLUGIN ERROR]', error)
    token.value = null
    clearError()
    navigateTo('/login', { replace: true })
  }
})

export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = useCookie('token')
  console.log(to.fullPath, from.fullPath)
  if (!token.value && from.path !== '/login') {
    return navigateTo('/login')
  }
  if(token.value && to.path === '/login') {
    return navigateTo('/admin/dashboard')
  }

})
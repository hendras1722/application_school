import type { User } from "~/type/user"

export const useAuth =  defineStore('auth', () => {
  const token = useCookie('token')
  const user  = useState<User | null>('user', () => null)

  function setUser(data: any) {
    user.value = data
  }

  function setToken(data: any) {
    token.value = data
  }

  function logout() {
    token.value = null
    user.value  = null
  }

  return {
    token,
    user,
    setUser,
    setToken,
    logout
  }
})
import { defineStore } from 'pinia';

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

export const useUserStore = defineStore('userStore', () => {
  const user = ref<User>({
    id: '',
    email: '',
    name: '',
    avatar: ''
  });

  const setUser = (data: unknown) => {
    console.log(data, 'inidata');
    user.value = data as User;
  };

  return {
    user,
    setUser
  };
});

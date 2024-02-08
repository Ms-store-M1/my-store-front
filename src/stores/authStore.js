import { create } from 'zustand';

const useAuthStore = create((set) => ({
  isLogged: false,
  accountInfo: {},
  login: (data) => set(() => ({ isLogged: true, accountInfo: data })),
  logout: () => set(() => ({ isLogged: false, accountInfo: {} })),
}));

export default useAuthStore;

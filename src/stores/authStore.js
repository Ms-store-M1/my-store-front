import { addToWishlist, getUser } from '@/services/api/user.api';
import { create } from 'zustand';

function decodeJWT(token) {
  const base64Url = token.split('.')[1]; // Obtient le payload du token
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Remplace les caractères URL-safe
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

const useAuthStore = create((set) => ({
  isLogged: false,
  accountInfo: {},
  isAdmin: false,
  login: (data) => set(() => ({ isLogged: true, accountInfo: data })),
  logout: () => {
    localStorage.removeItem('token');
    set(() => ({ isLogged: false, accountInfo: {} }))
  },
  checkLogin: async () => {
    const token = localStorage.getItem('token');
    if (token && token != undefined) {
      set(() => ({ isLogged: true }));
      const payload = decodeJWT(token);
      const userId = payload.id;
      const isAdmin = payload.isAdmin === true;
    
      const user = await getUser(userId);
      set(() => ({ isLogged: true, isAdmin: isAdmin, accountInfo: user.data }));
    }
  },
  addToWishlist: async(productId) => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = decodeJWT(token);
      const userId = payload.id;
      const req = await addToWishlist(userId, productId);
      // set(() => ({ accountInfo: updatedUser }));
    }
  }
}));

export default useAuthStore;

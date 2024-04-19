import { getCart } from "@/services/api/cart.api";
import { addToWishlist, getUser } from "@/services/api/user.api";
import { create } from "zustand";

function decodeJWT(token) {
  const base64Url = token.split(".")[1]; 
  if (!base64Url) return console.error('Token is not valid');
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); 
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

const useAuthStore = create((set, get) => ({
  isLogged: false,
  accountInfo: {},
  isAdmin: false,
  userCartQty: 0,
  login: (data) => set(() => ({ isLogged: true, accountInfo: data })),
  logout: () => {
    localStorage.removeItem('token');
    set(() => ({ isLogged: false, accountInfo: {}, userCartQty: 0}))
  },
  checkLogin: async () => {
    const token = localStorage.getItem('token');
    if (token && token != undefined) {
      // set(() => ({ isLogged: true }));
      const payload = decodeJWT(token);
      let userId;
      let isAdmin = false;
      if (payload) {
       userId = payload.id;
       isAdmin = payload.isAdmin === true;
       const user = await getUser(userId);
       if (user.sucess) {
         set(() => ({ isLogged: true, isAdmin: isAdmin, accountInfo: user.data }));
       }
      }
    }
  },
  addToWishlist: async (productId) => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = decodeJWT(token);
      const userId = payload.id;
      const req = await addToWishlist(userId, productId);
      // set(() => ({ accountInfo: updatedUser }));
    }
  },
  setCartQty: async () => {
    const { isLogged, accountInfo } = get();
    if (!isLogged) {
      let localCart = JSON.parse(localStorage.getItem("cart")) || [];
        let tmpQty = 0
        localCart.forEach(item => {
          tmpQty += item.quantity;
        })
        set(() => ({ userCartQty: tmpQty }));
    } else {
      if (accountInfo.id) {
        let cartQty = 0;
        const cart = await getCart(accountInfo.id);
        if (cart) {
          cart.forEach(item => {
            cartQty += item.quantity;
          })
          set(() => ({ userCartQty: cartQty }));
        }
      }
    
    }
  }
}));

export default useAuthStore;

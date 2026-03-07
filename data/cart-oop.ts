import {CartItem} from './cart.js';

interface Cart {
  cartItems: CartItem[] | undefined;
  loadFromStorage(): void;
  saveToStorage(): void;
  addToCart(productId: string): void;
  removeFromCart(productId: string): void;
  updateDeliveryOption(productId: string, deliveryOptionId: string): void;
}

function Cart(localStorageKey: string): Cart {
  const cart: Cart = {
    cartItems: undefined,

    loadFromStorage() {
      const storedData = localStorage.getItem(localStorageKey);
      this.cartItems = storedData ? JSON.parse(storedData) : [{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2,
        deliveryOptionId: '1'
      }, {
        productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity: 1,
        deliveryOptionId: '2'
      }];
    },

    saveToStorage() {
      localStorage.setItem(localStorageKey, JSON.stringify(this.cartItems));
    },

    addToCart(productId: string) {
      let matchingItem: CartItem | undefined;

      this.cartItems!.forEach((cartItem) => {
        if (productId === cartItem.productId) {
          matchingItem = cartItem;
        }
      });

      if (matchingItem) {
        matchingItem.quantity += 1;
      } else {
        this.cartItems!.push({
          productId: productId,
          quantity: 1,
          deliveryOptionId: '1'
        });
      }

      this.saveToStorage();
    },

    removeFromCart(productId: string) {
      const newCart: CartItem[] = [];

      this.cartItems!.forEach((cartItem) => {
        if (cartItem.productId !== productId) {
          newCart.push(cartItem);
        }
      });

      this.cartItems = newCart;

      this.saveToStorage();
    },

    updateDeliveryOption(productId: string, deliveryOptionId: string) {
      let matchingItem: CartItem | undefined;

      this.cartItems!.forEach((cartItem) => {
        if (productId === cartItem.productId) {
          matchingItem = cartItem;
        }
      });

      if (matchingItem) {
        matchingItem.deliveryOptionId = deliveryOptionId;
      }

      this.saveToStorage();
    }
  };

  return cart;
}

const cart = Cart('cart-oop');
const businessCart = Cart('cart-business');

cart.loadFromStorage();

businessCart.loadFromStorage();

console.log(cart);
console.log(businessCart);

export interface CartItem {
  productId: string;
  quantity: number;
  deliveryOptionId: string;
}

export let cart: CartItem[];

loadFromStorage();

export function loadFromStorage(): void {
  const storedCart = localStorage.getItem('cart');
  cart = storedCart ? JSON.parse(storedCart) : [{
    productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    quantity: 2,
    deliveryOptionId: '1'
  }, {
    productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    quantity: 1,
    deliveryOptionId: '2'
  }];
}

function saveToStorage(): void {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId: string): void {
  let matchingItem: CartItem | undefined;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({
      productId: productId,
      quantity: 1,
      deliveryOptionId: '1'
    });
  }

  saveToStorage();
}

export function removeFromCart(productId: string): void {
  const newCart: CartItem[] = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;

  saveToStorage();
}

export function updateDeliveryOption(productId: string, deliveryOptionId: string): void {
  let matchingItem: CartItem | undefined;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.deliveryOptionId = deliveryOptionId;
  }

  saveToStorage();
}

export function loadCart(callback: () => void): void {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {
    console.log(xhr.response);
    callback();
  });

  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send();
}

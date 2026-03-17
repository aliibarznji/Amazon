'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

import { defaultCart } from '@/lib/default-state';
import { getDeliveryOption } from '@/lib/delivery-options';
import { getProduct } from '@/lib/products';
import { addDays } from '@/lib/utils';
import type { CartItem, Order } from '@/lib/types';

interface StoreContextValue {
  cart: CartItem[];
  orders: Order[];
  hydrated: boolean;
  cartQuantity: number;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateDeliveryOption: (productId: string, deliveryOptionId: string) => void;
  placeOrder: () => Order | null;
}

const cartStorageKey = 'cart';
const ordersStorageKey = 'orders';

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedCart = window.localStorage.getItem(cartStorageKey);
    const storedOrders = window.localStorage.getItem(ordersStorageKey);

    setCart(storedCart ? JSON.parse(storedCart) : defaultCart);
    setOrders(storedOrders ? JSON.parse(storedOrders) : []);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(ordersStorageKey, JSON.stringify(orders));
  }, [hydrated, orders]);

  const addToCart = (productId: string, quantity = 1) => {
    setCart((currentCart) => {
      const matchingItem = currentCart.find(
        (cartItem) => cartItem.productId === productId
      );

      if (matchingItem) {
        return currentCart.map((cartItem) =>
          cartItem.productId === productId
            ? {
                ...cartItem,
                quantity: cartItem.quantity + quantity
              }
            : cartItem
        );
      }

      return [
        ...currentCart,
        {
          productId,
          quantity,
          deliveryOptionId: '1'
        }
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((currentCart) =>
      currentCart.filter((cartItem) => cartItem.productId !== productId)
    );
  };

  const updateDeliveryOption = (
    productId: string,
    deliveryOptionId: string
  ) => {
    setCart((currentCart) =>
      currentCart.map((cartItem) =>
        cartItem.productId === productId
          ? {
              ...cartItem,
              deliveryOptionId
            }
          : cartItem
      )
    );
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      return null;
    }

    const orderTime = new Date();
    let subtotalCents = 0;
    let shippingCents = 0;

    const products = cart
      .map((cartItem) => {
        const product = getProduct(cartItem.productId);

        if (!product) {
          return null;
        }

        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);

        subtotalCents += product.priceCents * cartItem.quantity;
        shippingCents += deliveryOption.priceCents;

        return {
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          deliveryOptionId: cartItem.deliveryOptionId,
          estimatedDeliveryTime: addDays(
            orderTime,
            deliveryOption.deliveryDays
          ).toISOString()
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    const totalBeforeTax = subtotalCents + shippingCents;
    const taxCents = Math.round(totalBeforeTax * 0.1);

    const order: Order = {
      id: crypto.randomUUID(),
      orderTime: orderTime.toISOString(),
      subtotalCents,
      shippingCents,
      taxCents,
      totalCostCents: totalBeforeTax + taxCents,
      products
    };

    setOrders((currentOrders) => [order, ...currentOrders]);
    setCart([]);

    return order;
  };

  const cartQuantity = cart.reduce(
    (total, cartItem) => total + cartItem.quantity,
    0
  );

  return (
    <StoreContext.Provider
      value={{
        cart,
        orders,
        hydrated,
        cartQuantity,
        addToCart,
        removeFromCart,
        updateDeliveryOption,
        placeOrder
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }

  return context;
}

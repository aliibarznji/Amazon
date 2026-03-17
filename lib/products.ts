import productsData from '@/lib/data/products.json';

import type { Product } from '@/lib/types';

export const products: Product[] = productsData;

export function getProduct(productId: string) {
  return products.find((product) => product.id === productId);
}

export function getStarsImage(stars: number) {
  return `/images/ratings/rating-${stars * 10}.png`;
}

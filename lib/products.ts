import productsData from '@/lib/data/products.json';

import type { Product } from '@/lib/types';

export const products: Product[] = productsData;

export function getProduct(productId: string) {
  return products.find((product) => product.id === productId);
}

export function getStarsImage(stars: number) {
  return `/images/ratings/rating-${stars * 10}.png`;
}

export function getProductDescription(product: Product) {
  if (product.description) {
    return product.description;
  }

  const keywordSummary = (product.keywords ?? [])
    .slice(0, 3)
    .join(', ');

  const productCategory =
    product.type === 'clothing'
      ? 'wardrobe staple'
      : keywordSummary
        ? `${keywordSummary} essential`
        : 'everyday favorite';

  return `${product.name} is a thoughtfully selected ${productCategory} designed to bring dependable quality, practical comfort, and easy everyday use into your routine.`;
}

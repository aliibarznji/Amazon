import productsData from '@/lib/data/products.json';

import type { Product } from '@/lib/types';

export const products: Product[] = productsData;
export const productCategoryOrder = [
  'Fashion',
  'Kitchen',
  'Home',
  'Sports',
  'Accessories'
] as const;

export function getProduct(productId: string) {
  return products.find((product) => product.id === productId);
}

export function getStarsImage(stars: number) {
  return `/images/ratings/rating-${stars * 10}.png`;
}

export function getProductCategory(product: Product) {
  const keywords = product.keywords ?? [];

  if (
    product.type === 'clothing' ||
    keywords.some((keyword) =>
      [
        'apparel',
        'mens',
        'womens',
        'shirts',
        'tshirts',
        'hoodies',
        'sweaters',
        'pants',
        'shorts',
        'shoes',
        'footwear',
        'sandals',
        'flats',
        'beanies',
        'hats'
      ].includes(keyword)
    )
  ) {
    return 'Fashion';
  }

  if (
    keywords.some((keyword) =>
      [
        'kitchen',
        'appliances',
        'cookware',
        'baking',
        'plates',
        'dining',
        'mixing bowls',
        'food containers',
        'coffeemakers',
        'water boiler',
        'cooking set'
      ].includes(keyword)
    )
  ) {
    return 'Kitchen';
  }

  if (
    keywords.some((keyword) =>
      [
        'home',
        'bedroom',
        'bathroom',
        'washroom',
        'restroom',
        'towels',
        'bath towels',
        'bathmat',
        'mirrors',
        'curtains',
        'covers',
        'bed sheets',
        'sheets',
        'cleaning',
        'garbage',
        'bins',
        'cans'
      ].includes(keyword)
    )
  ) {
    return 'Home';
  }

  if (
    keywords.some((keyword) =>
      [
        'sports',
        'basketballs',
        'running shoes',
        'jogging',
        'swimming',
        'bathing'
      ].includes(keyword)
    )
  ) {
    return 'Sports';
  }

  return 'Accessories';
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

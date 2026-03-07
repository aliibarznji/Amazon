import {formatCurrency} from '../scripts/utils/money.js';

export interface ProductRating {
  stars: number;
  count: number;
}

export interface ProductDetails {
  id: string;
  image: string;
  name: string;
  rating: ProductRating;
  priceCents: number;
  keywords?: string[];
  type?: string;
  sizeChartLink?: string;
}

export function getProduct(productId: string): Product | undefined {
  let matchingProduct: Product | undefined;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  return matchingProduct;
}

class Product {
  id: string;
  image: string;
  name: string;
  rating: ProductRating;
  priceCents: number;

  constructor(productDetails: ProductDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
  }

  getStarsUrl(): string {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice(): string {
    return `$${formatCurrency(this.priceCents)}`;
  }

  extraInfoHTML(): string {
    return '';
  }
}

class Clothing extends Product {
  sizeChartLink: string;

  constructor(productDetails: ProductDetails) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink || '';
  }

  extraInfoHTML(): string {
    return `
      <a href="${this.sizeChartLink}" target="_blank">
        Size chart
      </a>
    `;
  }
}

export let products: Product[] = [];

export function loadProductsFetch(): Promise<void> {
  const promise = fetch(
    'backend/products.json'
  ).then((response) => {
    return response.json();
  }).then((productsData: ProductDetails[]) => {
    products = productsData.map((productDetails) => {
      if (productDetails.type === 'clothing') {
        return new Clothing(productDetails);
      }
      return new Product(productDetails);
    });

    console.log('load products');
  }).catch((error) => {
    console.log('Unexpected error. Please try again later.');
  });

  return promise;
}

export function loadProducts(callback: () => void): void {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {
    const productsData: ProductDetails[] = JSON.parse(xhr.response);
    products = productsData.map((productDetails) => {
      if (productDetails.type === 'clothing') {
        return new Clothing(productDetails);
      }
      return new Product(productDetails);
    });

    console.log('load products');

    callback();
  });

  xhr.addEventListener('error', (error) => {
    console.log('Unexpected error. Please try again later.');
  });

  xhr.open('GET', 'backend/products.json');
  xhr.send();
}

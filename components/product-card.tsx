'use client';

import { useEffect, useState } from 'react';

import { useStore } from '@/components/store-provider';
import { getStarsImage } from '@/lib/products';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/lib/types';

import styles from './ProductCard.module.css';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  useEffect(() => {
    if (!showAddedMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShowAddedMessage(false);
    }, 1500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [showAddedMessage]);

  return (
    <div className={styles.productContainer}>
      <div className={styles.productImageContainer}>
        <img
          className={styles.productImage}
          src={`/${product.image}`}
          alt={product.name}
        />
      </div>

      <div className={`${styles.productName} ${styles.limitTextTo2Lines}`}>
        {product.name}
      </div>

      <div className={styles.productRatingContainer}>
        <img
          className={styles.productRatingStars}
          src={getStarsImage(product.rating.stars)}
          alt={`${product.rating.stars} star rating`}
        />
        <div className={styles.productRatingCount}>{product.rating.count}</div>
      </div>

      <div className={styles.productPrice}>${formatCurrency(product.priceCents)}</div>

      <div className={styles.productQuantityContainer}>
        <select
          value={selectedQuantity}
          onChange={(event) => setSelectedQuantity(Number(event.target.value))}
        >
          {Array.from({ length: 10 }, (_, index) => index + 1).map((quantity) => (
            <option key={quantity} value={quantity}>
              {quantity}
            </option>
          ))}
        </select>
      </div>

      {product.sizeChartLink ? (
        <a
          className={`${styles.sizeChartLink} link-primary`}
          href={`/${product.sizeChartLink}`}
          target="_blank"
          rel="noreferrer"
        >
          Size chart
        </a>
      ) : null}

      <div className={styles.productSpacer} />

      <div
        className={`${styles.addedToCart} ${
          showAddedMessage ? styles.addedToCartVisible : ''
        }`}
      >
        <img src="/images/icons/checkmark.png" alt="" />
        Added
      </div>

      <button
        type="button"
        className={`${styles.addToCartButton} button-primary`}
        onClick={() => {
          addToCart(product.id, selectedQuantity);
          setShowAddedMessage(true);
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}

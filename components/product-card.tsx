'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { useStore } from '@/components/store-provider';
import { getStarsImage } from '@/lib/products';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/lib/types';

import styles from './ProductCard.module.css';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const badge =
    product.rating.count > 2000
      ? 'Best seller'
      : product.type === 'clothing'
        ? 'Style pick'
        : 'Curated find';

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
      <div className={styles.topRow}>
        <span className={styles.badge}>{badge}</span>
        <span className={styles.ratingChip}>{product.rating.stars.toFixed(1)} / 5</span>
      </div>

      <div className={styles.productImageContainer}>
        <Image
          className={styles.productImage}
          src={`/${product.image}`}
          alt={product.name}
          width={220}
          height={220}
          sizes="(max-width: 450px) 100vw, (max-width: 800px) 50vw, 20vw"
        />
      </div>

      <div className={`${styles.productName} ${styles.limitTextTo2Lines}`}>
        {product.name}
      </div>

      <div className={styles.productRatingContainer}>
        <Image
          className={styles.productRatingStars}
          src={getStarsImage(product.rating.stars)}
          alt={`${product.rating.stars} star rating`}
          width={100}
          height={20}
        />
        <div className={styles.productRatingCount}>{product.rating.count}</div>
      </div>

      <div className={styles.priceRow}>
        <div className={styles.productPrice}>${formatCurrency(product.priceCents)}</div>
        <span className={styles.shippingNote}>Fast ship</span>
      </div>

      <div className={styles.productQuantityContainer}>
        <span className={styles.quantityLabel}>Quantity</span>
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
        <Image src="/images/icons/checkmark.png" alt="" width={20} height={20} />
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

'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { AmazonHeader } from '@/components/amazon-header';
import { useStore } from '@/components/store-provider';
import {
  getProductDescription,
  getStarsImage
} from '@/lib/products';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/lib/types';

import styles from './ProductDetails.module.css';

function getBadge(product: Product) {
  if (product.rating.count > 2000) {
    return 'Best seller';
  }

  if (product.type === 'clothing') {
    return 'Style pick';
  }

  return 'Curated find';
}

export function ProductDetails({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const description = useMemo(() => getProductDescription(product), [product]);

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
    <>
      <AmazonHeader />

      <main className={styles.main}>
        <Link className={styles.breadcrumb} href="/">
          Back to products
        </Link>

        <div className={styles.layout}>
          <section className={styles.galleryPanel}>
            <Image
              className={styles.productImage}
              src={`/${product.image}`}
              alt={product.name}
              width={520}
              height={520}
              sizes="(max-width: 960px) 100vw, 50vw"
              priority
            />
          </section>

          <section className={styles.infoPanel}>
            <div className={styles.badgeRow}>
              <span className={styles.badge}>{getBadge(product)}</span>
              <span className={styles.rating}>{product.rating.stars.toFixed(1)} / 5</span>
            </div>

            <h1 className={styles.title}>{product.name}</h1>

            <div className={styles.metaRow}>
              <Image
                className={styles.stars}
                src={getStarsImage(product.rating.stars)}
                alt={`${product.rating.stars} star rating`}
                width={120}
                height={24}
              />
              <span className={styles.reviewCount}>
                {product.rating.count} reviews
              </span>
            </div>

            <div className={styles.price}>${formatCurrency(product.priceCents)}</div>

            <p className={styles.description}>{description}</p>

            <div className={styles.detailList}>
              <span className={styles.detailChip}>Fast shipping</span>
              {product.type ? (
                <span className={styles.detailChip}>{product.type}</span>
              ) : null}
              {(product.keywords ?? []).slice(0, 3).map((keyword) => (
                <span key={keyword} className={styles.detailChip}>
                  {keyword}
                </span>
              ))}
            </div>

            <div className={styles.actions}>
              <span className={styles.selectLabel}>Quantity</span>
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

              <button
                type="button"
                className={`${styles.addButton} button-primary`}
                onClick={() => {
                  addToCart(product.id, selectedQuantity);
                  setShowAddedMessage(true);
                }}
              >
                Add to Cart
              </button>

              <div
                className={`${styles.addedMessage} ${
                  showAddedMessage ? styles.addedMessageVisible : ''
                }`}
              >
                <Image src="/images/icons/checkmark.png" alt="" width={20} height={20} />
                Added to cart
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

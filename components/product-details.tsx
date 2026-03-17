'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { MouseEvent as ReactMouseEvent } from 'react';

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
  const [zoomState, setZoomState] = useState({
    active: false,
    xPercent: 50,
    yPercent: 50,
    lensLeft: 0,
    lensTop: 0
  });
  const imageStageRef = useRef<HTMLDivElement | null>(null);

  const description = useMemo(() => getProductDescription(product), [product]);
  const lensSize = 150;

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

  const handleZoomMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const stage = imageStageRef.current;

    if (!stage) {
      return;
    }

    const bounds = stage.getBoundingClientRect();
    const rawX = event.clientX - bounds.left;
    const rawY = event.clientY - bounds.top;
    const x = Math.max(0, Math.min(rawX, bounds.width));
    const y = Math.max(0, Math.min(rawY, bounds.height));

    setZoomState({
      active: true,
      xPercent: (x / bounds.width) * 100,
      yPercent: (y / bounds.height) * 100,
      lensLeft: Math.max(0, Math.min(x - lensSize / 2, bounds.width - lensSize)),
      lensTop: Math.max(0, Math.min(y - lensSize / 2, bounds.height - lensSize))
    });
  };

  return (
    <>
      <AmazonHeader />

      <main className={styles.main}>
        <Link className={styles.breadcrumb} href="/">
          Back to products
        </Link>

        <div className={styles.layout}>
          <section className={styles.galleryPanel}>
            <div className={styles.galleryLayout}>
              <div
                ref={imageStageRef}
                className={styles.imageStage}
                onMouseEnter={handleZoomMove}
                onMouseMove={handleZoomMove}
                onMouseLeave={() =>
                  setZoomState((currentState) => ({
                    ...currentState,
                    active: false
                  }))
                }
              >
                <Image
                  className={styles.productImage}
                  src={`/${product.image}`}
                  alt={product.name}
                  width={520}
                  height={520}
                  sizes="(max-width: 960px) 100vw, 50vw"
                  priority
                />

                <div
                  className={`${styles.zoomLens} ${
                    zoomState.active ? styles.zoomLensVisible : ''
                  }`}
                  style={{
                    width: `${lensSize}px`,
                    height: `${lensSize}px`,
                    left: `${zoomState.lensLeft}px`,
                    top: `${zoomState.lensTop}px`
                  }}
                />
              </div>

              {zoomState.active ? (
                <div className={styles.zoomPanel}>
                  <div
                    className={`${styles.zoomPreview} ${styles.zoomPreviewActive}`}
                    style={{
                      backgroundImage: `url(/${product.image})`,
                      backgroundPosition: `${zoomState.xPercent}% ${zoomState.yPercent}%`
                    }}
                  />
                </div>
              ) : null}
            </div>
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

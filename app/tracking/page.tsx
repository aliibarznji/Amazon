'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { AmazonHeader } from '@/components/amazon-header';
import { useStore } from '@/components/store-provider';
import { getProduct } from '@/lib/products';
import {
  formatLongDate,
  getDeliveryProgress,
  getDeliveryStatus
} from '@/lib/utils';

import styles from './tracking.module.css';

export default function TrackingPage() {
  return (
    <Suspense
      fallback={
        <>
          <AmazonHeader />
          <main className={styles.main}>
            <div className="empty-state">
              <h2>Loading tracking details</h2>
              <p>Your shipment progress is being prepared.</p>
            </div>
          </main>
        </>
      }
    >
      <TrackingPageContent />
    </Suspense>
  );
}

function TrackingPageContent() {
  const searchParams = useSearchParams();
  const { orders, hydrated } = useStore();

  const orderId = searchParams.get('orderId');
  const productId = searchParams.get('productId');
  const order = orders.find((candidate) => candidate.id === orderId);
  const orderedProduct = order?.products.find(
    (candidate) => candidate.productId === productId
  );
  const product = orderedProduct ? getProduct(orderedProduct.productId) : undefined;

  const currentStatus =
    order && orderedProduct
      ? getDeliveryStatus(order.orderTime, orderedProduct.estimatedDeliveryTime)
      : 'Preparing';
  const progress =
    order && orderedProduct
      ? getDeliveryProgress(order.orderTime, orderedProduct.estimatedDeliveryTime)
      : 0;

  return (
    <>
      <AmazonHeader />

      <main className={styles.main}>
        {!hydrated ? (
          <div className="empty-state">
            <h2>Loading tracking details</h2>
            <p>Your shipment progress is being prepared.</p>
          </div>
        ) : !order || !orderedProduct || !product ? (
          <div className="empty-state">
            <h2>Tracking info not found</h2>
            <p>Open the tracking page from your orders list to view shipment details.</p>
          </div>
        ) : (
          <div>
            <Link className={`${styles.backToOrdersLink} link-primary`} href="/orders">
              View all orders
            </Link>

            <div className={styles.deliveryDate}>
              Arriving on {formatLongDate(orderedProduct.estimatedDeliveryTime)}
            </div>

            <div className={styles.productInfo}>{product.name}</div>
            <div className={styles.productInfo}>Quantity: {orderedProduct.quantity}</div>

            <Image
              className={styles.productImage}
              src={`/${product.image}`}
              alt={product.name}
              width={150}
              height={150}
              sizes="150px"
            />

            <div className={styles.progressLabelsContainer}>
              {['Preparing', 'Shipped', 'Delivered'].map((status) => (
                <div
                  key={status}
                  className={`${styles.progressLabel} ${
                    currentStatus === status ? styles.currentStatus : ''
                  }`}
                >
                  {status}
                </div>
              ))}
            </div>

            <div className={styles.progressBarContainer}>
              <div
                className={styles.progressBar}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
}

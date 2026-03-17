'use client';

import { Fragment } from 'react';
import Link from 'next/link';

import { AmazonHeader } from '@/components/amazon-header';
import { useStore } from '@/components/store-provider';
import { getProduct } from '@/lib/products';
import { formatCurrency, formatShortDate } from '@/lib/utils';

import styles from './orders.module.css';

export default function OrdersPage() {
  const { orders, hydrated, addToCart } = useStore();

  return (
    <>
      <AmazonHeader />

      <main className={styles.main}>
        <div className={styles.pageTitle}>Your Orders</div>

        {!hydrated ? (
          <div className="empty-state">
            <h2>Loading your orders</h2>
            <p>Your recent purchases will appear here in a moment.</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <h2>No orders yet</h2>
            <p>Place an order from checkout and it will show up here.</p>
          </div>
        ) : (
          <div className={styles.ordersGrid}>
            {orders.map((order) => (
              <section key={order.id}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderHeaderLeftSection}>
                    <div className={styles.orderDate}>
                      <div className={styles.orderHeaderLabel}>Order Placed:</div>
                      <div>{formatShortDate(order.orderTime)}</div>
                    </div>

                    <div className={styles.orderTotal}>
                      <div className={styles.orderHeaderLabel}>Total:</div>
                      <div>${formatCurrency(order.totalCostCents)}</div>
                    </div>
                  </div>

                  <div className={styles.orderHeaderRightSection}>
                    <div className={styles.orderHeaderLabel}>Order ID:</div>
                    <div>{order.id}</div>
                  </div>
                </div>

                <div className={styles.orderDetailsGrid}>
                  {order.products.map((orderedProduct) => {
                    const product = getProduct(orderedProduct.productId);

                    if (!product) {
                      return null;
                    }

                    return (
                      <Fragment key={`${order.id}-${product.id}`}>
                        <div className={styles.productImageContainer}>
                          <img
                            className={styles.productImage}
                            src={`/${product.image}`}
                            alt={product.name}
                          />
                        </div>

                        <div>
                          <div className={styles.productName}>{product.name}</div>
                          <div className={styles.productDeliveryDate}>
                            Arriving on:{' '}
                            {formatShortDate(orderedProduct.estimatedDeliveryTime)}
                          </div>
                          <div className={styles.productQuantity}>
                            Quantity: {orderedProduct.quantity}
                          </div>
                          <button
                            type="button"
                            className={`${styles.buyAgainButton} button-primary`}
                            onClick={() => addToCart(product.id, 1)}
                          >
                            <img
                              className={styles.buyAgainIcon}
                              src="/images/icons/buy-again.png"
                              alt=""
                            />
                            <span>Buy it again</span>
                          </button>
                        </div>

                        <div className={styles.productActions}>
                          <Link
                            className={`${styles.trackPackageButton} button-secondary`}
                            href={`/tracking?orderId=${order.id}&productId=${product.id}`}
                          >
                            Track package
                          </Link>
                        </div>
                      </Fragment>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

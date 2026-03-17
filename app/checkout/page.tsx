'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { CheckoutHeader } from '@/components/checkout-header';
import { useStore } from '@/components/store-provider';
import { deliveryOptions, getDeliveryOption } from '@/lib/delivery-options';
import { getProduct } from '@/lib/products';
import { addDays, formatCurrency, formatLongDate } from '@/lib/utils';

import styles from './checkout.module.css';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    hydrated,
    removeFromCart,
    updateDeliveryOption,
    placeOrder
  } = useStore();

  const cartItems = cart
    .map((cartItem) => {
      const product = getProduct(cartItem.productId);

      if (!product) {
        return null;
      }

      const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);

      return {
        cartItem,
        product,
        deliveryOption
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const productPriceCents = cartItems.reduce(
    (total, item) => total + item.product.priceCents * item.cartItem.quantity,
    0
  );

  const shippingPriceCents = cartItems.reduce(
    (total, item) => total + item.deliveryOption.priceCents,
    0
  );

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = Math.round(totalBeforeTaxCents * 0.1);
  const totalCents = totalBeforeTaxCents + taxCents;
  const totalItems = cart.reduce(
    (total, cartItem) => total + cartItem.quantity,
    0
  );

  return (
    <>
      <CheckoutHeader />

      <main className={styles.main}>
        <div className={styles.pageTitle}>Review your order</div>

        {!hydrated ? (
          <div className="empty-state">
            <h2>Loading your cart</h2>
            <p>Your saved items are being prepared.</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className={`${styles.emptyCart} empty-state`}>
            <h2>Your cart is empty</h2>
            <p>Add some products from the home page to start checking out.</p>
          </div>
        ) : (
          <div className={styles.checkoutGrid}>
            <section>
              {cartItems.map(({ cartItem, product, deliveryOption }) => (
                <div key={product.id} className={styles.cartItemContainer}>
                  <div className={styles.deliveryDate}>
                    Delivery date:{' '}
                    {formatLongDate(
                      addDays(new Date(), deliveryOption.deliveryDays).toISOString()
                    )}
                  </div>

                  <div className={styles.cartItemDetailsGrid}>
                    <Image
                      className={styles.productImage}
                      src={`/${product.image}`}
                      alt={product.name}
                      width={120}
                      height={120}
                      sizes="120px"
                    />

                    <div>
                      <div className={styles.productName}>{product.name}</div>
                      <div className={styles.productPrice}>
                        ${formatCurrency(product.priceCents)}
                      </div>
                      <div>
                        <span>Quantity: {cartItem.quantity}</span>
                        <button
                          type="button"
                          className={styles.productQuantityAction}
                          onClick={() => removeFromCart(product.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className={styles.deliveryOptions}>
                      <div className={styles.deliveryOptionsTitle}>
                        Choose a delivery option:
                      </div>

                      {deliveryOptions.map((option) => {
                        const priceLabel =
                          option.priceCents === 0
                            ? 'FREE Shipping'
                            : `$${formatCurrency(option.priceCents)} Shipping`;

                        return (
                          <label
                            key={option.id}
                            className={styles.deliveryOption}
                          >
                            <input
                              className={styles.deliveryOptionInput}
                              type="radio"
                              name={`delivery-option-${product.id}`}
                              checked={cartItem.deliveryOptionId === option.id}
                              onChange={() =>
                                updateDeliveryOption(product.id, option.id)
                              }
                            />
                            <div>
                              <div className={styles.deliveryOptionDate}>
                                {formatLongDate(
                                  addDays(new Date(), option.deliveryDays).toISOString()
                                )}
                              </div>
                              <div className={styles.deliveryOptionPrice}>
                                {priceLabel}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <aside className={styles.paymentSummary}>
              <div className={styles.paymentSummaryTitle}>Order Summary</div>

              <div className={styles.paymentSummaryRow}>
                <div>Items ({totalItems}):</div>
                <div className={styles.paymentSummaryMoney}>
                  ${formatCurrency(productPriceCents)}
                </div>
              </div>

              <div className={styles.paymentSummaryRow}>
                <div>Shipping &amp; handling:</div>
                <div className={styles.paymentSummaryMoney}>
                  ${formatCurrency(shippingPriceCents)}
                </div>
              </div>

              <div className={`${styles.paymentSummaryRow} ${styles.subtotalRow}`}>
                <div>Total before tax:</div>
                <div className={styles.paymentSummaryMoney}>
                  ${formatCurrency(totalBeforeTaxCents)}
                </div>
              </div>

              <div className={styles.paymentSummaryRow}>
                <div>Estimated tax (10%):</div>
                <div className={styles.paymentSummaryMoney}>
                  ${formatCurrency(taxCents)}
                </div>
              </div>

              <div className={`${styles.paymentSummaryRow} ${styles.totalRow}`}>
                <div>Order total:</div>
                <div className={styles.paymentSummaryMoney}>
                  ${formatCurrency(totalCents)}
                </div>
              </div>

              <button
                type="button"
                className={`${styles.placeOrderButton} button-primary`}
                onClick={() => {
                  const order = placeOrder();

                  if (order) {
                    router.push('/orders');
                  }
                }}
              >
                Place your order
              </button>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}

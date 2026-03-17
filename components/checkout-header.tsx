'use client';

import Link from 'next/link';

import { useStore } from '@/components/store-provider';

import styles from './CheckoutHeader.module.css';

export function CheckoutHeader() {
  const { cartQuantity } = useStore();

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <div className={styles.leftSection}>
          <Link href="/">
            <img className={styles.logo} src="/images/amazon-logo.png" alt="Amazon" />
            <img
              className={styles.mobileLogo}
              src="/images/amazon-mobile-logo.png"
              alt="Amazon"
            />
          </Link>
        </div>

        <div className={styles.middleSection}>
          Checkout (
          <Link className={styles.returnToHomeLink} href="/">
            {cartQuantity} items
          </Link>
          )
        </div>

        <div className={styles.rightSection}>
          <img src="/images/icons/checkout-lock-icon.png" alt="Secure checkout" />
        </div>
      </div>
    </header>
  );
}

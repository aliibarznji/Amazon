'use client';

import Image from 'next/image';
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
            <Image
              className={styles.logo}
              src="/images/amazon-logo.png"
              alt="Amazon"
              width={100}
              height={31}
              priority
            />
            <Image
              className={styles.mobileLogo}
              src="/images/amazon-mobile-logo.png"
              alt="Amazon"
              width={36}
              height={35}
              priority
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
          <Image
            src="/images/icons/checkout-lock-icon.png"
            alt="Secure checkout"
            width={24}
            height={24}
          />
        </div>
      </div>
    </header>
  );
}

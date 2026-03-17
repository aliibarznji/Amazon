'use client';

import Link from 'next/link';

import { useStore } from '@/components/store-provider';

import styles from './AmazonHeader.module.css';

interface AmazonHeaderProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function AmazonHeader({
  searchValue = '',
  onSearchChange
}: AmazonHeaderProps) {
  const { cartQuantity } = useStore();
  const searchProps = onSearchChange
    ? {
        value: searchValue,
        onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
          onSearchChange(event.target.value)
      }
    : {
        defaultValue: searchValue
      };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <Link href="/" className={styles.headerLink}>
          <img
            className={styles.logo}
            src="/images/amazon-logo-white.png"
            alt="Amazon"
          />
          <img
            className={styles.mobileLogo}
            src="/images/amazon-mobile-logo-white.png"
            alt="Amazon"
          />
        </Link>
      </div>

      <div className={styles.middleSection}>
        <input
          className={styles.searchBar}
          type="text"
          placeholder="Search"
          {...searchProps}
        />

        <button type="button" className={styles.searchButton} aria-label="Search">
          <img
            className={styles.searchIcon}
            src="/images/icons/search-icon.png"
            alt=""
          />
        </button>
      </div>

      <div className={styles.rightSection}>
        <Link
          className={`${styles.headerLink} ${styles.ordersLink}`}
          href="/orders"
        >
          <span className={styles.returnsText}>Returns</span>
          <span className={styles.ordersText}>& Orders</span>
        </Link>

        <Link className={`${styles.headerLink} ${styles.cartLink}`} href="/checkout">
          <img
            className={styles.cartIcon}
            src="/images/icons/cart-icon.png"
            alt=""
          />
          <div className={styles.cartQuantity}>{cartQuantity}</div>
          <div className={styles.cartText}>Cart</div>
        </Link>
      </div>
    </header>
  );
}

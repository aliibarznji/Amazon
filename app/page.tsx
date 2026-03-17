'use client';

import { useDeferredValue, useState } from 'react';

import { AmazonHeader } from '@/components/amazon-header';
import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/products';

import styles from './home.module.css';

export default function HomePage() {
  const [searchValue, setSearchValue] = useState('');
  const deferredSearchValue = useDeferredValue(searchValue);
  const featuredCount = products.filter((product) => product.rating.count >= 500).length;
  const clothingCount = products.filter((product) => product.type === 'clothing').length;

  const normalizedQuery = deferredSearchValue.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    if (!normalizedQuery) {
      return true;
    }

    const searchableText = [product.name, ...(product.keywords ?? [])]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });

  return (
    <>
      <AmazonHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>Freshly redesigned storefront</span>
            <h1 className={styles.heroTitle}>Modern essentials with a calmer shopping flow.</h1>
            <p className={styles.heroDescription}>
              Browse the same catalog through a warmer, more premium interface with
              clearer hierarchy, softer surfaces, and faster product scanning.
            </p>

            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>{products.length}</span>
                <span className={styles.heroStatLabel}>Products ready to shop</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>{featuredCount}</span>
                <span className={styles.heroStatLabel}>High-demand picks</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatValue}>{clothingCount}</span>
                <span className={styles.heroStatLabel}>Style-forward wardrobe finds</span>
              </div>
            </div>
          </div>

          <div className={styles.heroPanel}>
            <div className={styles.heroCard}>
              <span className={styles.heroCardTitle}>This week&apos;s mood</span>
              <div className={styles.heroCardCopy}>
                Soft neutrals, practical upgrades, and everyday staples that feel elevated.
              </div>
            </div>

            <div className={styles.heroAccent}>
              <span className={styles.heroAccentTitle}>Curated filters</span>
              <div className={styles.heroAccentText}>
                Search by product name or keyword to narrow the grid instantly while
                keeping the catalog easy to browse on desktop and mobile.
              </div>
            </div>
          </div>
        </section>

        <section className={styles.catalogSection}>
          <div className={styles.catalogHeader}>
            <div>
              <span className={styles.catalogEyebrow}>Catalog</span>
              <h2 className={styles.catalogTitle}>Browse the full collection</h2>
            </div>

            <div className={styles.catalogMeta}>
              <div className={styles.metaPill}>{filteredProducts.length} results</div>
              <div className={styles.metaPill}>
                {normalizedQuery ? `Search: ${deferredSearchValue}` : 'All departments'}
              </div>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className={styles.productsGrid}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No matching products</h2>
              <p>Try a different search term to browse the catalog.</p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

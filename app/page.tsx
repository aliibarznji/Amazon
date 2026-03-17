'use client';

import { useDeferredValue, useState } from 'react';

import { AmazonHeader } from '@/components/amazon-header';
import { ProductCard } from '@/components/product-card';
import {
  getProductCategory,
  productCategoryOrder,
  products
} from '@/lib/products';

import styles from './home.module.css';

export default function HomePage() {
  const [searchValue, setSearchValue] = useState('');
  const deferredSearchValue = useDeferredValue(searchValue);

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
  const groupedProducts = productCategoryOrder
    .map((category) => ({
      category,
      slug: category.toLowerCase().replace(/\s+/g, '-'),
      products: filteredProducts.filter(
        (product) => getProductCategory(product) === category
      )
    }))
    .filter((group) => group.products.length > 0);

  return (
    <>
      <AmazonHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      <main className={styles.main}>
        {groupedProducts.length > 0 ? (
          <nav className={styles.categoryNav} aria-label="Categories">
            <div className={styles.categoryNavInner}>
              {groupedProducts.map((group) => (
                <a
                  key={group.slug}
                  className={styles.categoryNavLink}
                  href={`#${group.slug}`}
                >
                  {group.category}
                </a>
              ))}
            </div>
          </nav>
        ) : null}

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
            <div className={styles.categorySections}>
              {groupedProducts.map((group) => (
                <section
                  key={group.category}
                  id={group.slug}
                  className={styles.categorySection}
                >
                  <div className={styles.categoryHeader}>
                    <div>
                      <span className={styles.categoryLabel}>Category</span>
                      <h3 className={styles.categoryTitle}>{group.category}</h3>
                    </div>

                    <div className={styles.categoryCount}>
                      {group.products.length} product
                      {group.products.length === 1 ? '' : 's'}
                    </div>
                  </div>

                  <div className={styles.productsGrid}>
                    {group.products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
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

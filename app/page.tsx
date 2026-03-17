'use client';

import { useState } from 'react';

import { AmazonHeader } from '@/components/amazon-header';
import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/products';

import styles from './home.module.css';

export default function HomePage() {
  const [searchValue, setSearchValue] = useState('');

  const normalizedQuery = searchValue.trim().toLowerCase();
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
      </main>
    </>
  );
}

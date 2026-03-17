import { notFound } from 'next/navigation';

import { ProductDetails } from '@/components/product-details';
import { getProduct, products } from '@/lib/products';

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id
  }));
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}

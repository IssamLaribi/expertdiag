'tsx'
import React, { Suspense } from 'react';
import { INITIAL_PRODUCTS } from '@/data/mockData';
import { ProductDetailClient } from '@/components/ProductDetailClient';

export function generateStaticParams() {
  return INITIAL_PRODUCTS.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="p-20 text-center text-slate-500">Chargement du produit...</div>}>
      <ProductDetailClient id={resolvedParams.id} />
    </Suspense>
  );
}

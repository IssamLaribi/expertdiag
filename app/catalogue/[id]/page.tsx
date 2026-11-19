import { Suspense } from 'react';
import { INITIAL_PRODUCTS } from '@/data/mockData';
import { ProductDetailClient } from '@/components/ProductDetailClient';

type ProductPageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return INITIAL_PRODUCTS.map(({ id }) => ({ id }));
}

async function ProductRoute({ params }: ProductPageProps) {
  const { id } = await params;
  return <ProductDetailClient id={id} />;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  return (
    <Suspense fallback={<p className="site-width py-8 text-sm text-mute">Chargement du produit…</p>}>
      <ProductRoute params={params} />
    </Suspense>
  );
}

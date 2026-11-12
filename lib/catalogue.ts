import type { Product, ProductType } from '@/types';

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  equipment: 'Équipement',
  reagent: 'Réactif',
  consumable: 'Consommable',
};

export function normalizeCatalogueText(text: string) {
  return text.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function productLabels(products: Product[], field: 'brand' | 'domain') {
  const labels = new Map<string, string>();
  for (const product of products) {
    const value = product[field].trim();
    const key = normalizeCatalogueText(value);
    if (key && !labels.has(key)) labels.set(key, value);
  }
  return [...labels.values()].sort((a, b) => a.localeCompare(b, 'fr'));
}

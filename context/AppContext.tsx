'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type {
  Product, Domain, Brand, DeliveryOption, OrderRequest, ProblemReport, Customer,
  QuoteDetails, SubmissionReceipt, OrderStatus, ProblemStatus, ProblemType, UrgencyLevel,
} from '@/types';
import { API_URL, jsonRequest, requestJson } from '@/lib/api';
import { normalizeCatalogueText, productLabels } from '@/lib/catalogue';
import { INITIAL_PRODUCTS, INITIAL_DOMAINS, INITIAL_DELIVERY_OPTIONS, INITIAL_ORDERS, INITIAL_PROBLEMS } from '@/data/mockData';

export type UserRole = 'visitor' | 'customer' | 'admin';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentCustomer: Customer;
  customerSaved: boolean;
  setCurrentCustomer: React.Dispatch<React.SetStateAction<Customer>>;
  products: Product[];
  productsLoading: boolean;
  domains: Domain[];
  brands: Brand[];
  deliveryOptions: DeliveryOption[];
  orders: OrderRequest[];
  problems: ProblemReport[];
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  submitOrder: (details: QuoteDetails, submissionId: string) => Promise<SubmissionReceipt>;
  submitProblemReport: (equipmentId: string, serialNumber: string, problemType: ProblemType, description: string, urgency: UrgencyLevel) => string;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  toggleProductAvailability: (productId: string, expectedReturnDate?: string, note?: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateProblemStatus: (problemId: string, status: ProblemStatus, plannedDate?: string, customerMessage?: string, internalNote?: string) => void;
  recordOfflinePurchase: (customerId: string, productId: string, quantity: number, serialNumber?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_CUSTOMER: Customer = {
  id: 'cust-1',
  laboratoryName: 'Laboratoire d\'Analyses Médicales Pasteur Alger',
  contactPerson: 'Dr. Amine Kaci',
  phone: '+213 23 11 22 33',
  email: 'contact@labpasteur-alger.dz',
  address: '14 Boulevard des Martyrs',
  wilaya: 'Alger',
  commune: 'Hydra',
};

type DatabaseProduct = Omit<Product, 'id'> & {
  id: string | number;
  expected_return_date?: string | null;
  price_estimate?: string | null;
};

function mapDbProduct(data: DatabaseProduct): Product {
  return {
    id: String(data.id),
    reference: data.reference,
    name: data.name,
    type: data.type,
    brand: data.brand,
    domain: data.domain,
    description: data.description,
    features: data.features ?? [],
    image: data.image,
    status: data.status,
    expectedReturnDate: data.expected_return_date ?? data.expectedReturnDate,
    note: data.note,
    visible: data.visible,
    priceEstimate: data.price_estimate ?? data.priceEstimate,
  };
}

function readSaved<T>(key: string): T | undefined {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : undefined;
  } catch {
    return undefined;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('visitor');
  const [currentCustomer, setCurrentCustomer] = useState<Customer>(DEFAULT_CUSTOMER);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [productsLoading, setProductsLoading] = useState(true);
  const domains = useMemo(() => productLabels(products, 'domain').map((name) => ({
    id: normalizeCatalogueText(name),
    name,
    image: INITIAL_DOMAINS.find((domain) => domain.name === name)?.image ?? '',
  })), [products]);
  const brands = useMemo(() => productLabels(products, 'brand').map((name) => ({
    id: normalizeCatalogueText(name),
    name,
  })), [products]);
  const [deliveryOptions] = useState<DeliveryOption[]>(INITIAL_DELIVERY_OPTIONS);
  const [orders, setOrders] = useState<OrderRequest[]>(INITIAL_ORDERS);
  const [problems, setProblems] = useState<ProblemReport[]>(INITIAL_PROBLEMS);
  const [savedCart, setCart] = useState<CartItem[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const customerSaved = currentCustomer.id !== DEFAULT_CUSTOMER.id;
  const cart = useMemo(() => {
    const currentProducts = new Map(products.map((product) => [product.id, product]));
    return savedCart.map((item) => ({
      quantity: item.quantity,
      product: currentProducts.get(item.product.id) ?? { ...item.product, visible: false },
    }));
  }, [savedCart, products]);

  useEffect(() => {
    const controller = new AbortController();
    async function loadProducts() {
      try {
        const result = await requestJson<{ data: DatabaseProduct[] }>('/products', {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!controller.signal.aborted) setProducts(result.data.map(mapDbProduct));
      } catch {
        // The sample or last saved catalogue remains available while the API is unreachable.
      } finally {
        if (!controller.signal.aborted) setProductsLoading(false);
      }
    }

    const frame = requestAnimationFrame(() => {
      const cachedProducts = readSaved<Product[]>('ed_products');
      const cachedOrders = readSaved<OrderRequest[]>('ed_orders');
      const cachedProblems = readSaved<ProblemReport[]>('ed_problems');
      const cachedCart = readSaved<CartItem[]>('ed_cart');
      const cachedCustomer = readSaved<Customer>('ed_customer');

      if (Array.isArray(cachedProducts)) setProducts(cachedProducts);
      if (Array.isArray(cachedOrders)) setOrders(cachedOrders);
      if (Array.isArray(cachedProblems)) setProblems(cachedProblems);
      if (Array.isArray(cachedCart)) {
        setCart(cachedCart.filter((item) =>
          typeof item?.product?.id === 'string'
          && Number.isInteger(item.quantity)
          && item.quantity >= 1
          && item.quantity <= 999
        ));
      }
      if (cachedCustomer?.id && cachedCustomer.id !== DEFAULT_CUSTOMER.id) {
        setCurrentCustomer(cachedCustomer);
        setRole('customer');
      }
      setStorageReady(true);
      void loadProducts();
    });

    return () => {
      cancelAnimationFrame(frame);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      localStorage.setItem('ed_cart', JSON.stringify(savedCart));
      localStorage.setItem('ed_orders', JSON.stringify(orders));
      localStorage.setItem('ed_problems', JSON.stringify(problems));
      if (customerSaved) localStorage.setItem('ed_customer', JSON.stringify(currentCustomer));
      localStorage.setItem('ed_products', JSON.stringify(products));
    } catch {
      // The current session is still usable if browser storage is blocked or full.
    }
  }, [storageReady, savedCart, orders, problems, products, customerSaved, currentCustomer]);

  const addToCart = (product: Product, quantity = 1) => {
    if (!product.visible || product.status !== 'available' || !Number.isInteger(quantity) || quantity < 1) return;
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(999, item.quantity + quantity) }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(999, quantity) }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (!Number.isInteger(quantity)) return;
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.product.id === productId ? { ...item, quantity: Math.min(999, quantity) } : item
    ));
  };

  const clearCart = () => setCart([]);

  const submitOrder = async (details: QuoteDetails, submissionId: string) => {
    if (cart.length === 0 || cart.some(({ product }) => !product.visible || product.status !== 'available')) {
      throw new Error('Vérifiez les articles de votre demande.');
    }
    const delivery = deliveryOptions.find((option) => option.id === details.deliveryOptionId && option.active);
    if (!delivery) throw new Error('Choisissez un mode de livraison.');

    const items = cart.map(({ product, quantity }) => ({
      productId: product.id,
      productName: product.name,
      reference: product.reference,
      quantity,
    }));
    const receipt = await requestJson<SubmissionReceipt>('/quote-requests', jsonRequest('POST', {
      ...details,
      submissionId,
      items: items.map(({ productId, quantity }) => ({ productId, quantity })),
    }));

    const customer: Customer = {
      id: customerSaved ? currentCustomer.id : submissionId,
      contactPerson: details.contactPerson.trim(),
      laboratoryName: details.laboratoryName.trim(),
      email: details.email.trim(),
      phone: details.phone.trim(),
      wilaya: details.wilaya.trim(),
      commune: details.commune.trim(),
      address: details.address.trim(),
    };
    const order: OrderRequest = {
      id: submissionId,
      reference: receipt.reference,
      customerId: customer.id,
      customerName: customer.contactPerson,
      laboratoryName: customer.laboratoryName,
      email: customer.email,
      phone: customer.phone,
      wilaya: customer.wilaya,
      commune: customer.commune,
      address: customer.address,
      deliveryOptionId: delivery.id,
      deliveryOptionName: delivery.name,
      comment: details.comment.trim(),
      items,
      status: 'New',
      source: 'website',
      createdAt: receipt.createdAt,
    };
    setCurrentCustomer(customer);
    setRole((currentRole) => currentRole === 'admin' ? currentRole : 'customer');
    setOrders((previous) => [order, ...previous.filter((entry) => entry.id !== submissionId)]);
    clearCart();
    return receipt;
  };

  const submitProblemReport = (equipmentId: string, serialNumber: string, problemType: ProblemType, description: string, urgency: UrgencyLevel) => {
    const eq = products.find(p => p.id === equipmentId);
    const newRef = `SAV-2026-${String(problems.length + 1).padStart(3, '0')}`;

    const newReport: ProblemReport = {
      id: `prob-${Date.now()}`,
      reference: newRef,
      customerId: currentCustomer.id,
      customerName: currentCustomer.contactPerson,
      laboratoryName: currentCustomer.laboratoryName,
      equipmentId,
      equipmentName: eq ? eq.name : 'Équipement médical',
      serialNumber,
      problemType,
      description,
      urgency,
      photos: [],
      status: 'New',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setProblems(prev => [newReport, ...prev]);
    return newRef;
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    const response = await fetch(
      `${API_URL}/products`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create product');
    }

    const result = await response.json();
    const data = result.data;

    const newProduct: Product = {
      id: data.id || `prod-${Date.now()}`,
      reference: data.reference,
      name: data.name,
      type: data.type,
      brand: data.brand,
      domain: data.domain,
      description: data.description,
      features: data.features || [],
      image: data.image,
      status: data.status,
      expectedReturnDate: data.expected_return_date || data.expectedReturnDate,
      note: data.note,
      visible: data.visible,
      priceEstimate: data.price_estimate || data.priceEstimate,
    };

    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = async (updated: Product) => {
    try {
      const response = await fetch(
        `${API_URL}/products/${updated.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: updated.name,
            reference: updated.reference,
            type: updated.type,
            brand: updated.brand,
            domain: updated.domain,
            description: updated.description,
            features: updated.features,
            image: updated.image,
            status: updated.status,
            expectedReturnDate: updated.expectedReturnDate || null,
            note: updated.note || null,
            visible: updated.visible,
            priceEstimate: updated.priceEstimate || 'Sur devis',
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update product');
      }

      const result = await response.json();
      if (result.data) {
        const mapped = mapDbProduct(result.data);
        setProducts(prev => prev.map(p => p.id === mapped.id ? mapped : p));
      } else {
        setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      }
    } catch (e) {
      console.error('Error updating product via API:', e);
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(
        `${API_URL}/products/${productId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to delete product');
      }

      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (e) {
      console.error('Error deleting product via API:', e);
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const toggleProductAvailability = (productId: string, expectedReturnDate?: string, note?: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const nextStatus = p.status === 'available' ? 'unavailable' : 'available';
        return {
          ...p,
          status: nextStatus,
          expectedReturnDate: nextStatus === 'unavailable' ? (expectedReturnDate || 'Prochainement') : undefined,
          note: nextStatus === 'unavailable' ? (note || 'Indisponibilité temporaire') : undefined,
        };
      }
      return p;
    }));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const updateProblemStatus = (problemId: string, status: ProblemStatus, plannedDate?: string, customerMessage?: string, internalNote?: string) => {
    setProblems(prev => prev.map(p => {
      if (p.id === problemId) {
        return {
          ...p,
          status,
          plannedInterventionDate: plannedDate !== undefined ? plannedDate : p.plannedInterventionDate,
          messageToCustomer: customerMessage !== undefined ? customerMessage : p.messageToCustomer,
          internalNote: internalNote !== undefined ? internalNote : p.internalNote,
        };
      }
      return p;
    }));
  };

  const recordOfflinePurchase = (customerId: string, productId: string, quantity: number, serialNumber?: string) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    const newRef = `SALE-OFF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: OrderRequest = {
      id: `ord-${Date.now()}`,
      reference: newRef,
      customerId,
      customerName: currentCustomer.contactPerson,
      laboratoryName: currentCustomer.laboratoryName,
      email: currentCustomer.email,
      phone: currentCustomer.phone,
      wilaya: currentCustomer.wilaya,
      commune: currentCustomer.commune,
      address: currentCustomer.address,
      deliveryOptionId: 'del-1',
      deliveryOptionName: 'Achat Direct / Hors Site (Admin)',
      items: [{
        productId: prod.id,
        productName: prod.name,
        reference: prod.reference,
        quantity,
        serialNumber,
      }],
      status: 'Delivered',
      source: 'admin',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentCustomer,
        customerSaved,
        setCurrentCustomer,
        products,
        productsLoading,
        domains,
        brands,
        deliveryOptions,
        orders,
        problems,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        submitOrder,
        submitProblemReport,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        updateOrderStatus,
        updateProblemStatus,
        recordOfflinePurchase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};

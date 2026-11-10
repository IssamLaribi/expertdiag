'tsx'
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Domain, Brand, DeliveryOption, OrderRequest, ProblemReport, Customer } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_DOMAINS, INITIAL_BRANDS, INITIAL_DELIVERY_OPTIONS, INITIAL_ORDERS, INITIAL_PROBLEMS } from '@/data/mockData';

export type UserRole = 'visitor' | 'customer' | 'admin';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentCustomer: Customer;
  setCurrentCustomer: React.Dispatch<React.SetStateAction<Customer>>;
  products: Product[];
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
  submitOrder: (deliveryOptionId: string, address: string, wilaya: string, commune: string, comment?: string) => string;
  submitProblemReport: (equipmentId: string, serialNumber: string, problemType: any, description: string, urgency: any) => string;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  toggleProductAvailability: (productId: string, expectedReturnDate?: string, note?: string) => void;
  updateOrderStatus: (orderId: string, status: any) => void;
  updateProblemStatus: (problemId: string, status: any, plannedDate?: string, customerMessage?: string, internalNote?: string) => void;
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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('visitor');
  const [currentCustomer, setCurrentCustomer] = useState<Customer>(DEFAULT_CUSTOMER);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [deliveryOptions] = useState<DeliveryOption[]>(INITIAL_DELIVERY_OPTIONS);
  const [orders, setOrders] = useState<OrderRequest[]>(INITIAL_ORDERS);
  const [problems, setProblems] = useState<ProblemReport[]>(INITIAL_PROBLEMS);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('ed_products');
      if (savedProducts) setProducts(JSON.parse(savedProducts));
      const savedOrders = localStorage.getItem('ed_orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      const savedProblems = localStorage.getItem('ed_problems');
      if (savedProblems) setProblems(JSON.parse(savedProblems));
    } catch (e) {
      console.error('Failed to load from localStorage', e);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('ed_products', JSON.stringify(products));
      localStorage.setItem('ed_orders', JSON.stringify(orders));
      localStorage.setItem('ed_problems', JSON.stringify(problems));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [products, orders, problems]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsResponse, domainsResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/brands`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/domains`),
        ]);

        if (!brandsResponse.ok || !domainsResponse.ok) {
          throw new Error('Failed to fetch brands or domains');
        }

        const brandsResult = await brandsResponse.json();
        const domainsResult = await domainsResponse.json();

        setBrands(brandsResult.data);
        setDomains(domainsResult.data);

      } catch (error) {
        console.error('Error fetching brands and domains:', error);
      }
    };

    fetchData();
  }, []);

  const addToCart = (product: Product, quantity = 1) => {
    if (product.status === 'unavailable') {
      alert('Ce produit est temporairement indisponible et ne peut pas être ajouté à la commande.');
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  const submitOrder = (deliveryOptionId: string, address: string, wilaya: string, commune: string, comment?: string) => {
    const deliveryOpt = deliveryOptions.find(d => d.id === deliveryOptionId) || deliveryOptions[0];
    const newRef = `REQ-2026-${String(orders.length + 1).padStart(3, '0')}`;

    const newOrder: OrderRequest = {
      id: `ord-${Date.now()}`,
      reference: newRef,
      customerId: currentCustomer.id,
      customerName: currentCustomer.contactPerson,
      laboratoryName: currentCustomer.laboratoryName,
      email: currentCustomer.email,
      phone: currentCustomer.phone,
      wilaya,
      commune,
      address,
      deliveryOptionId,
      deliveryOptionName: deliveryOpt.name,
      comment,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        reference: item.product.reference,
        quantity: item.quantity,
      })),
      status: 'New',
      source: 'website',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newRef;
  };

  const submitProblemReport = (equipmentId: string, serialNumber: string, problemType: any, description: string, urgency: any) => {
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
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
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

    console.log('Product created:', result.data);
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
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

  const updateOrderStatus = (orderId: string, status: any) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const updateProblemStatus = (problemId: string, status: any, plannedDate?: string, customerMessage?: string, internalNote?: string) => {
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
        setCurrentCustomer,
        products,
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

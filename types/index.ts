// BlinkFeast CounterPro - POS Types

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'waiter' | 'chef' | 'cashier';
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  image?: string;
  description?: string;
}

export interface Table {
  id: string;
  number: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved';
  section: string;
  currentOrderId?: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableId: string;
  tableNumber: number;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'completed';
  createdAt: string;
  updatedAt: string;
  paymentMethod?: 'cash' | 'card' | 'upi';
}

export interface DailySummary {
  date: string;
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  paymentBreakdown: {
    cash: number;
    card: number;
    upi: number;
  };
}

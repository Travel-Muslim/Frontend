export type OrderStatus = "Selesai" | "Diproses";

export interface OrderRow {
  id: string;
  name: string;
  packageName: string;
  date: string;
  time: string;
  status: OrderStatus;
  payment: string;
}

// Dummy data dihapus, gunakan API untuk mengisi data order.
export const ORDERS: OrderRow[] = [];

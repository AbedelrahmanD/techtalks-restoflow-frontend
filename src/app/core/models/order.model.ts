export interface OrderItemDto {
  id: number;
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  note: string | null;
}

export interface OrderDto {
  id: number;
  tableId: number;
  tableNumber: string;
  status: string; // 'New' | 'InProgress' | 'Served'
  totalAmount: number;
  createdAt: string;
  updatedAt: string | null;
  items: OrderItemDto[];
}

export interface OrderItemCreateDto {
  menuItemId: number;
  quantity: number;
  note: string | null;
}

export interface CreateOrderDto {
  qrCodeToken: string;
  items: OrderItemCreateDto[];
}

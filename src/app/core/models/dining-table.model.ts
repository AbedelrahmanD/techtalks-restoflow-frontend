export interface DiningTableCreateDto {
  tableNumber: string;
  seatingCapacity: number;
}

export interface DiningTableUpdateDto {
  tableNumber: string;
  seatingCapacity: number;
}

export interface DiningTableDto {
  id: number;
  tableNumber: string;
  seatingCapacity: number;
  qrCodeToken: string;
}

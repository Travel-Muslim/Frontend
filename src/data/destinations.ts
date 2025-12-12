export interface DestinationMeta {
  id: number;
  title: string;
  location: string;
  price: number;
  image: string;
  period: string[];
  duration: string;
  airline: string;
  airport: string;
}

// Dummy data dihapus, gunakan API untuk mengisi data destinasi.
export const DESTINATIONS: DestinationMeta[] = [];

export interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  location: string;
  description: string;
  category: string;
  condition?: string;
  postedTime: string;
  sellerId: string;
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    totalSales?: number;
  };
  isNew?: boolean;
}

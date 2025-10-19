export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  photo?: string | null;
  photoMime?: string | null;
}

export interface AuthResponse {
  user: User;
}

export type Product = {
  id: string;
  userId: string;
  name: string;
  price: number;
  discountPrice: number | null;
  description: string | null;
  photo: string | null;
  photoMime: string | null;
  createdAt: string;
  updatedAt: string;
  likedByMe?: boolean;
};

export type ProductResponse = { product: Product };
export type ProductListResponse = {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

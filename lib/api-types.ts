export type UserRole = "admin" | "customer";

export type AppUserProfile = {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  role: UserRole;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type OrderProduct = {
  id: number;
  name: string;
  image?: string;
  price: number;
  quantity: number;
};

export type PaymentStatus = "pending" | "paid" | "failed";
export type OrderStatus =
  | "placed"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
export type OrderType = "card" | "upi" | "netbanking" | "cod";

export type OrderRecord = {
  id: string;
  userId?: string | null;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  products: OrderProduct[];
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  orderType: OrderType;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type NewsletterSubscriberRecord = {
  id: string;
  email: string;
  createdAt?: string | null;
};

export type WishlistRecord = {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  productId: number;
  productName: string;
  productImage: string;
  createdAt?: string | null;
};

export type WishlistSummaryUser = {
  userId: string;
  userEmail: string;
  userName: string;
  createdAt?: string | null;
};

export type WishlistSummaryRecord = {
  productId: number;
  productName: string;
  productImage: string;
  productCategory: string;
  count: number;
  userEmails: string[];
  users: WishlistSummaryUser[];
};

export type ProductReviewRecord = {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  productId: number;
  productName: string;
  productImage: string;
  productCategory: string;
  rating: number;
  comment: string;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type ApiErrorResponse = {
  error: string;
};

export type NotificationType =
  | "NEW_SERVICE_REQUEST"
  | "REQUEST_ACCEPTED"
  | "REQUEST_REJECTED"
  | "REQUEST_CANCELLED"
  | "SERVICE_STARTED"
  | "SERVICE_COMPLETED"
  | "SYSTEM";

export interface RelatedRequest {
  _id: string;
  category?: string;
  description?: string;
  location?: string;
  status?: string;
}

export interface Notification {
  _id: string;

  user: string;

  type: NotificationType;

  title: string;

  message: string;

  isRead: boolean;

  relatedRequest?: RelatedRequest | null;

  createdAt: string;

  updatedAt?: string;
}
export interface ServiceUser {
  _id: string;
  fullName: string;
  email?: string;
  phone?: string;
  profileImage?: string;
}

export interface ServiceCompany {
  _id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
}

export interface ServiceRequest {
  _id: string;

  customer:
    | string
    | ServiceUser;

  category: string;

  company?:
    | string
    | ServiceCompany
    | null;

  description: string;

  location: string;

  preferredDate?: string | null;

  preferredTime?: string;

  budget?: number;

  status:
    | "pending"
    | "matched"
    | "accepted"
    | "in_progress"
    | "completed"
    | "cancelled";

  assignedProfessional?:
    | string
    | ServiceUser
    | null;

  createdAt?: string;

  updatedAt?: string;
}
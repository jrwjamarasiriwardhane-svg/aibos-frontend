import type { ServiceRequest } from "../types/ServiceRequest";

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:5000/api";

// =====================================================
// COMMON API HELPER
// =====================================================

const apiRequest = async <T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  let data: any = {};
  const contentType = response.headers.get("content-type");
  
  // Safely parse JSON only if returned by server
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  }

  if (!response.ok) {
    throw new Error(
      data?.message || `Request failed with status ${response.status}`
    );
  }

  return data as T;
};

// =====================================================
// TYPES
// =====================================================

export interface CreateServiceRequestData {
  category: string;
  company?: string | null;
  description: string;
  location: string;
  preferredDate?: string | null;
  preferredTime?: string;
  budget?: number;
}

// =====================================================
// API METHODS
// =====================================================

export const getMyServiceRequests = async (
  token: string
): Promise<ServiceRequest[]> => {
  const data = await apiRequest<{
    success: boolean;
    count: number;
    requests: ServiceRequest[];
  }>("/service-requests/my", token, {
    method: "GET",
  });

  return data.requests || [];
};

export const getServiceRequestById = async (
  token: string,
  requestId: string
): Promise<ServiceRequest> => {
  const data = await apiRequest<{
    success: boolean;
    request: ServiceRequest;
  }>(`/service-requests/${requestId}`, token, {
    method: "GET",
  });

  return data.request;
};

export const createServiceRequest = async (
  token: string,
  requestData: CreateServiceRequestData
): Promise<ServiceRequest> => {
  const data = await apiRequest<{
    success: boolean;
    message: string;
    request: ServiceRequest;
  }>("/service-requests", token, {
    method: "POST",
    body: JSON.stringify(requestData),
  });

  return data.request;
};

export const cancelServiceRequest = async (
  token: string,
  requestId: string
): Promise<ServiceRequest> => {
  const data = await apiRequest<{
    success: boolean;
    message: string;
    request: ServiceRequest;
  }>(`/service-requests/${requestId}/cancel`, token, {
    method: "PATCH",
  });

  return data.request;
};
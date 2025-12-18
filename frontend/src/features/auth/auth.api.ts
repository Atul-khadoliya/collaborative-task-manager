import { apiClient } from "../../lib/apiClient";

interface LoginResponse {
  token: string;
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  return apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<void> => {
  return apiClient<void>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
};

import { apiRequest } from "./api";

export async function login(
  email: string,
  password: string
) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("token_type", data.token_type);

  return data;
}

export async function getCurrentUser() {
  return apiRequest("/auth/me");
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token_type");
}
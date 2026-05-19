import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const API_URL = import.meta.env.VITE_API_URL;

const tokenRenewalUrl = `${API_URL}/auth/token`;

let tokenRenewalRequest: Promise<void> | null = null;

const loginPath = "/login";

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

client.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status !== 401 || !error.config) {
      throw error;
    }

    const config = error.config as RetriableRequestConfig;

    if (config._retry || config.url === tokenRenewalUrl) {
      throw error;
    }

    config._retry = true;

    try {
      tokenRenewalRequest ??= (async () => {
        try {
          const response = await fetch(tokenRenewalUrl, {
            method: "POST",
            credentials: "include",
          });

          if (!response.ok) {
            if (!window.location.href.includes(loginPath)) {
              window.location.href = loginPath;
            }
          }
        } finally {
          tokenRenewalRequest = null;
        }
      })();

      await tokenRenewalRequest;
    } catch {
      throw error;
    }

    return client(config);
  },
);

export const api = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
) => client<T>({ ...config, ...options });

export default api;

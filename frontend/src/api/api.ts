import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const tokenRenewalUrl = `${import.meta.env.VITE_API_URL}/api/auth/token`;

let tokenRenewalRequest: Promise<void> | null = null;

const client = axios.create({
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
            throw new Error("Access token renewal failed");
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

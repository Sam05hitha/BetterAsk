import { sessionProvider } from "../utils/methods";
import axios from "axios";
export const baseURL = import.meta.env.VITE_REACT_APP_API_URL;

export const baseQuery = axios.create({
  baseURL,
});

baseQuery.interceptors.request.use(
  async (config) => {
    const userSession = sessionProvider.getSession();
    const accessToken = userSession?.token;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export async function postAPI(url: string, data: any) {
  try {
    const response = (await baseQuery.post(url, data)) as any;
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function putAPI(url: string, data?: any) {
  try {
    const response = (await baseQuery.put(url, data)) as any;
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function getAPI(url: string) {
  try {
    const response = (await baseQuery.get(url)) as any;
    return response?.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteAPI(url: string) {
  try {
    const response = (await baseQuery.delete(url)) as any;
    return response?.data;
  } catch (error) {
    throw error;
  }
}

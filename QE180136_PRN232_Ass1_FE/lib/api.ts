import axios, { AxiosError } from 'axios';
import { API_URL } from './config';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export function getErrorMessage(err: unknown): string {
  const e = err as AxiosError<{ error?: string; errors?: Record<string, string[]>; title?: string }>;
  if (e.response?.data) {
    const d = e.response.data;
    if (d.error) return d.error;
    if (d.errors) {
      const firstKey = Object.keys(d.errors)[0];
      if (firstKey) return `${firstKey}: ${d.errors[firstKey].join(', ')}`;
    }
    if (d.title) return d.title;
  }
  return e.message || 'Unexpected error';
}

import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "./supabase/info";

interface UseRealtimeDataOptions {
  endpoint: string;
  accessToken?: string;
  refreshInterval?: number;
}

export function useRealtimeData<T>(options: UseRealtimeDataOptions) {
  const { endpoint, accessToken, refreshInterval = 3000 } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      } else {
        headers["Authorization"] = `Bearer ${publicAnonKey}`;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-71783a73${endpoint}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Polling para simular tiempo real
    const interval = setInterval(fetchData, refreshInterval);

    return () => clearInterval(interval);
  }, [endpoint, accessToken, refreshInterval]);

  return { data, loading, error, refetch: fetchData };
}

export async function apiRequest<T>(
  endpoint: string,
  options: {
    method?: string;
    body?: any;
    accessToken?: string;
  } = {}
): Promise<T> {
  const { method = "GET", body, accessToken } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  } else {
    headers["Authorization"] = `Bearer ${publicAnonKey}`;
  }

  const response = await fetch(
    `https://${projectId}.supabase.co/functions/v1/make-server-71783a73${endpoint}`,
    {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || response.statusText);
  }

  return response.json();
}

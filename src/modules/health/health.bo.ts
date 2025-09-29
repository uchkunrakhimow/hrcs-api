export interface HealthStatusBO {
  status: "ok" | "error";
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  database: {
    status: "connected" | "disconnected";
    responseTime?: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}

export interface DatabaseHealthBO {
  status: "connected" | "disconnected";
  responseTime?: number;
  error?: string;
}

import { PrismaClient } from "../../generated/prisma";
import { HealthStatusBO, DatabaseHealthBO } from "./health.bo";

export class HealthService {
  private prisma: PrismaClient;
  private startTime: number;

  constructor() {
    this.prisma = new PrismaClient();
    this.startTime = Date.now();
  }

  async getHealthStatus(): Promise<HealthStatusBO> {
    const timestamp = new Date().toISOString();
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);

    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal;
    const usedMemory = memoryUsage.heapUsed;
    const memoryPercentage = Math.round((usedMemory / totalMemory) * 100);

    const databaseHealth = await this.checkDatabaseHealth();

    return {
      status: databaseHealth.status === "connected" ? "ok" : "error",
      timestamp,
      uptime,
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      database: databaseHealth,
      memory: {
        used: Math.round(usedMemory / 1024 / 1024),
        total: Math.round(totalMemory / 1024 / 1024),
        percentage: memoryPercentage,
      },
    };
  }

  async getSimpleHealth(): Promise<{ status: "ok"; timestamp: string }> {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }

  private async checkDatabaseHealth(): Promise<DatabaseHealthBO> {
    try {
      const startTime = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - startTime;

      return {
        status: "connected",
        responseTime,
      };
    } catch (error) {
      return {
        status: "disconnected",
        error:
          error instanceof Error ? error.message : "Unknown database error",
      };
    }
  }
}

import { Router } from "express";
import { checkPostgres, checkRedis, checkStripe, checkS3 } from "../services/healthChecks";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

router.get("/health/ready", async (req, res) => {
  const checks = await Promise.allSettled([
    checkPostgres(), checkRedis(), checkStripe(), checkS3(),
  ]);
  const allHealthy = checks.every((c) => c.status === "fulfilled");
  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? "ready" : "degraded",
    checks: {
      postgres: checks[0].status === "fulfilled" ? "ok" : "fail",
      redis: checks[1].status === "fulfilled" ? "ok" : "fail",
      stripe: checks[2].status === "fulfilled" ? "ok" : "fail",
      s3: checks[3].status === "fulfilled" ? "ok" : "fail",
    },
  });
});

export default router;

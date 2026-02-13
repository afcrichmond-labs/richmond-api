import { describe, it, expect } from "vitest";
import { createTestApp } from "../fixtures/app";

describe("Auth Token Refresh", () => {
  const app = createTestApp();

  it("returns 200 with new token pair on valid refresh", async () => {
    const { refreshToken } = await loginUser(app);
    const res = await app.post("/api/auth/refresh").send({ refresh_token: refreshToken });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("access_token");
    expect(res.body).toHaveProperty("refresh_token");
    expect(res.body).toHaveProperty("expires_in");
  });

  it("returns 401 on expired refresh token", async () => {
    const res = await app.post("/api/auth/refresh").send({ refresh_token: "expired-token" });
    expect(res.status).toBe(401);
  });

  it("returns 400 on malformed token", async () => {
    const res = await app.post("/api/auth/refresh").send({ refresh_token: "not-a-jwt" });
    expect(res.status).toBe(400);
  });

  it("returns 429 when rate limited (>10 refreshes/min)", async () => {
    const { refreshToken } = await loginUser(app);
    for (let i = 0; i < 11; i++) {
      await app.post("/api/auth/refresh").send({ refresh_token: refreshToken });
    }
    const res = await app.post("/api/auth/refresh").send({ refresh_token: refreshToken });
    expect(res.status).toBe(429);
  });
});

-- RLS policy: enforce tenant_id in analytics aggregate CTEs
-- ENG-55: patches cross-tenant data leakage
CREATE POLICY tenant_isolation_analytics ON analytics_events
  USING (tenant_id = current_setting('app.current_tenant')::uuid);

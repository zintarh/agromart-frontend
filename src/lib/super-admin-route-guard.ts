/**
 * @deprecated Use @/lib/portal-route-guard
 */
export {
  PORTAL_LOGIN_PATH as SUPER_ADMIN_LOGIN_PATH,
  ensurePortalRouteAccess as ensureSuperAdminRouteAccess,
  isPortalPublicPath as isSuperAdminPublicPath,
  ensureAdminOperationsAccess,
  ensureSuperAdminOperationsAccess,
} from "@/lib/portal-route-guard"

export const permissionMapping = {
  '/users': 'manage_users',
  '/trades': 'manage_trades',
  '/profit-sharing': 'manage_share_configs',
  '/withdraw-requests': 'manage_withdraw_requests',
  '/deposits': 'manage_transactions',
  '/dp-requests': ['manage_partner_requests', 'manage_ib_requests'],
  '/kyc-requests': 'manage_kyc_requests',
  '/notifications': 'send_notifications',
};

export const hasRoutePermission = (path, role, permissions = []) => {
  if (role !== 'SUB_ADMIN') return true;

  // Find matching mapped route prefix
  const matchedKey = Object.keys(permissionMapping).find(
    (key) => path === key || path.startsWith(key + '/')
  );

  if (!matchedKey) {
    // Explicitly block sub-admins from managing sub-admins
    if (path === '/sub-admins' || path.startsWith('/sub-admins/')) {
      return false;
    }
    return true; // Unrestricted pages like dashboard or settings
  }

  const requiredPermission = permissionMapping[matchedKey];
  if (Array.isArray(requiredPermission)) {
    return requiredPermission.some((p) => permissions.includes(p));
  }
  return permissions.includes(requiredPermission);
};

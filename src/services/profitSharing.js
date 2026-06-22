import { api, request } from "./api";

export const getProfitSharing = (params) =>
  request(() => api.get("/admin/profit-sharing", { params }));

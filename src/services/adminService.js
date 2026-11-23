import { api, getData } from './portal';
export const adminService = {
 getDashboardStats:()=>getData('/admin/stats'),getReports:()=>getData('/admin/reports'),
 getClaims:()=>getData('/admin/claims'),getUsers:()=>getData('/admin/users'),
 getCategories:()=>getData('/categories'),getNotifications:()=>getData('/notifications'),
 updateReportStatus:(id,status,reason)=>api.patch(`/admin/reports/${id}/status`,{status,reason}),
 updateClaimStatus:(id,status,remarks)=>api.patch(`/admin/claims/${id}`,{status,remarks})
};
export default adminService;

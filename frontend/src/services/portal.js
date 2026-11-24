import axios from 'axios';
export const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
export const api = axios.create({baseURL:BASE_URL});
api.interceptors.request.use(config => {
 const token = localStorage.getItem('adminToken') || localStorage.getItem('studentToken');
 if(token) config.headers.Authorization = `Bearer ${token}`;
 return config;
});
export const errorMessage = err => err.response?.data?.message || err.message || 'Request failed';
export const getData = async (url, options) => (await api.get(url,options)).data.data;
export const reportView = r => ({...r,id:r._id,date:r.createdAt?new Date(r.createdAt).toLocaleDateString('en-IN'):'',type:r.type?.charAt(0).toUpperCase()+r.type?.slice(1),status:r.status?.charAt(0).toUpperCase()+r.status?.slice(1),lostDate:r.type==='lost'?r.eventDate:undefined,foundDate:r.type==='found'?r.eventDate:undefined,image:r.images?.[0] ? `${BASE_URL.replace(/\/api$/, '')}/${r.images[0].replace(/^\/+/, '')}` : '',reporterEmail:r.user?.email||'',reportedBy:r.user?.name||''});

import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../services/portal';
export default function ProtectedRoute({children}){
 const [allowed,setAllowed]=useState(null);
 useEffect(()=>{let active=true;const token=localStorage.getItem('studentToken');if(!token){Promise.resolve().then(()=>{if(active)setAllowed(false);});return()=>{active=false;};}
 api.get('/auth/me',{headers:{Authorization:`Bearer ${token}`}}).then(r=>{if(active)setAllowed(r.data?.data?.role==='user');}).catch(()=>{if(active)setAllowed(false);});return()=>{active=false;};},[]);
 if(allowed===null)return <p className="text-center p-5">Checking student session...</p>;
 return allowed?children:<Navigate to="/login" replace/>;
}

import { useContext } from 'react';
import { AdminContext } from './AdminContextDefinition';

export const useAdmin = () => useContext(AdminContext);
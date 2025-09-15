import { User } from '../types';

// Usuário padrão Admin/Admin conforme solicitado
export const users: User[] = [
  {
    id: '1', 
    email: 'Admin',
    password: 'Admin',
    name: 'Administrador',
    role: 'admin',
  },
  {
    id: '2',
    email: 'operador@example.com',
    password: 'op123',
    name: 'Operador',
    role: 'operator',
  },
];
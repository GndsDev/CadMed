import { Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';
import { UserRole } from './models/auth';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./login/login').then((m) => m.LoginComponent) },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard').then((m) => m.DashboardComponent)
  },
  {
    path: 'financeiro',
    loadComponent: () => import('./financeiro/financeiro').then((m) => m.FinanceiroComponent),
    canActivate: [RoleGuard],
    data: { roles: [UserRole.SECRETARIA] }
  },
  {
    path: 'medicos/novo',
    loadComponent: () => import('./medicos/medico-form/medico-form').then((m) => m.MedicoFormComponent),
    canActivate: [RoleGuard],
    data: { roles: [UserRole.SECRETARIA] }
  },
  {
    path: 'medicos',
    loadComponent: () => import('./medicos/medico-list/medico-list').then((m) => m.MedicoListComponent),
    canActivate: [RoleGuard],
    data: { roles: [UserRole.SECRETARIA] }
  },
  {
    path: 'pacientes/novo',
    loadComponent: () =>
      import('./pacientes/paciente-form/paciente-form').then((m) => m.PacienteFormComponent),
    canActivate: [RoleGuard],
    data: { roles: [UserRole.SECRETARIA] }
  },
  {
    path: 'pacientes/editar/:id',
    loadComponent: () =>
      import('./pacientes/paciente-form/paciente-form').then((m) => m.PacienteFormComponent),
    canActivate: [RoleGuard],
    data: { roles: [UserRole.SECRETARIA] }
  },
  {
    path: 'medicos/editar/:id',
    loadComponent: () => import('./medicos/medico-form/medico-form').then((m) => m.MedicoFormComponent),
    canActivate: [RoleGuard],
    data: { roles: [UserRole.SECRETARIA] }
  },
  {
    path: 'pacientes',
    loadComponent: () =>
      import('./pacientes/paciente-list/paciente-list').then((m) => m.PacienteListComponent),
    canActivate: [RoleGuard],
    data: { roles: [UserRole.SECRETARIA] }
  },
  {
    path: 'agenda',
    loadComponent: () => import('./agendamentos/agenda/agenda').then((m) => m.AgendaComponent),
    canActivate: [RoleGuard],
    data: { roles: [UserRole.SECRETARIA, UserRole.MEDICO, UserRole.PACIENTE] }
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

import { Routes } from '@angular/router';
import { LoginComponent } from './login/login'; // <-- IMPORTAR O LOGIN
import { MedicoFormComponent } from './medicos/medico-form/medico-form';
import { PacienteFormComponent } from './pacientes/paciente-form/paciente-form';
import { PacienteListComponent } from './pacientes/paciente-list/paciente-list';
import { AgendaComponent } from './agendamentos/agenda/agenda';
import { MedicoListComponent } from './medicos/medico-list/medico-list';
import { DashboardComponent } from './dashboard/dashboard';
import { RoleGuard } from './guards/role.guard';
import { UserRole } from './models/auth';
import { FinanceiroComponent } from './financeiro/financeiro';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'financeiro', component: FinanceiroComponent },

  {
    path: 'medicos/novo',
    component: MedicoFormComponent,
    canActivate: [RoleGuard],
    data: { role: UserRole.SECRETARIA }
  },
  {
    path: 'medicos',
    component: MedicoListComponent,
    canActivate: [RoleGuard],
    data: { role: UserRole.SECRETARIA }
  },
  {
    path: 'pacientes/novo',
    component: PacienteFormComponent,
    canActivate: [RoleGuard],
    data: { role: UserRole.SECRETARIA }
  },

  { path: 'pacientes/editar/:id',
     component: PacienteFormComponent,
     canActivate: [RoleGuard],
     data: { role: UserRole.SECRETARIA }
  },

  { path: 'medicos/editar/:id',
     component: MedicoFormComponent,
     canActivate: [RoleGuard],
     data: { role: UserRole.SECRETARIA }
  },
  { path: 'pacientes', component: PacienteListComponent },
  { path: 'agenda', component: AgendaComponent },
  // Se abrir o site vazio, vai para a página de Login!
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: 'financeiro',
    component: FinanceiroComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_SECRETARIA'] }
  },
  {
    path: 'medicos',
    component: MedicoListComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_SECRETARIA'] }
  },
  {
    path: 'agenda',
    component: AgendaComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ROLE_SECRETARIA', 'ROLE_MEDICO', 'ROLE_PACIENTE'] }
  }

];

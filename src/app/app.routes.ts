import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home';

import { Roles } from './components/roles/roles';
import { RolListar } from './components/roles/rol-listar/rol-listar';
import { RolForm } from './components/roles/rol-form/rol-form';

import { Usuarios } from './components/usuarios/usuarios';
import { UsuarioListar } from './components/usuarios/usuario-listar/usuario-listar';
import { UsuarioForm } from './components/usuarios/usuario-form/usuario-form';

import { Ubicaciones } from './components/ubicaciones/ubicaciones';
import { UbicacionListar } from './components/ubicaciones/ubicacion-listar/ubicacion-listar';
import { UbicacionForm } from './components/ubicaciones/ubicacion-form/ubicacion-form';
import { UbicacionReportes } from './components/ubicaciones/ubicacion-reportes/ubicacion-reportes';

import { Categorias } from './components/categorias/categorias';
import { CategoriaListar } from './components/categorias/categoria-listar/categoria-listar';
import { CategoriaForm } from './components/categorias/categoria-form/categoria-form';

import { Reportes } from './components/reportes/reportes';
import { ReporteListar } from './components/reportes/reporte-listar/reporte-listar';
import { ReporteForm } from './components/reportes/reporte-form/reporte-form';

import { Acciones } from './components/acciones/acciones';
import { AccionListar } from './components/acciones/accion-listar/accion-listar';
import { AccionForm } from './components/acciones/accion-form/accion-form';

import { Evidencias } from './components/evidencias/evidencias';
import { EvidenciaListar } from './components/evidencias/evidencia-listar/evidencia-listar';
import { EvidenciaForm } from './components/evidencias/evidencia-form/evidencia-form';
import { UsuarioReportes } from './components/usuarios/usuario-reportes/usuario-reportes';

import { Login } from './components/login/login';
import { Registro } from './components/registro/registro';
import { authGuard } from './guards/auth-guard';
import {AccionReportes} from './components/acciones/accion-reportes/accion-reportes';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'registro', component: Registro },

  { path: 'home', component: HomeComponent, canActivate: [authGuard] },

  {
    path: 'roles',
    component: Roles,
    canActivate: [authGuard],
    children: [
      { path: '', component: RolListar },
      { path: 'nuevo', component: RolForm },
      { path: 'editar/:id', component: RolForm },
    ],
  },

  {
    path: 'usuarios',
    component: Usuarios,
    canActivate: [authGuard],
    children: [
      { path: '', component: UsuarioListar },
      { path: 'nuevo', component: UsuarioForm },
      { path: 'editar/:id', component: UsuarioForm },
      { path: 'reportes', component: UsuarioReportes },
    ],
  },

  {
    path: 'ubicaciones',
    component: Ubicaciones,
    canActivate: [authGuard],
    children: [
      { path: '', component: UbicacionListar },
      { path: 'nuevo', component: UbicacionForm },
      { path: 'editar/:id', component: UbicacionForm },
      { path: 'reportes', component: UbicacionReportes },
    ],
  },

  {
    path: 'categorias',
    component: Categorias,
    canActivate: [authGuard],
    children: [
      { path: '', component: CategoriaListar },
      { path: 'nuevo', component: CategoriaForm },
      { path: 'editar/:id', component: CategoriaForm },
    ],
  },

  {
    path: 'reportes',
    component: Reportes,
    canActivate: [authGuard],
    children: [
      { path: '', component: ReporteListar },
      { path: 'nuevo', component: ReporteForm },
      { path: 'editar/:id', component: ReporteForm },
    ],
  },

  {
    path: 'acciones',
    component: Acciones,
    canActivate: [authGuard],
    children: [
      { path: '', component: AccionListar },
      { path: 'nuevo', component: AccionForm },
      { path: 'editar/:id', component: AccionForm },
      { path: 'reportes', component: AccionReportes, },
    ],
  },

  {
    path: 'evidencias',
    component: Evidencias,
    canActivate: [authGuard],
    children: [
      { path: '', component: EvidenciaListar },
      { path: 'nuevo', component: EvidenciaForm },
    ],
  },

  { path: '**', redirectTo: 'home' },
];

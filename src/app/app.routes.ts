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
import { roleGuard } from './guards/role-guard';

import { ReporteEstados } from './components/reportes/reporte-estados/reporte-estados';

// Roles válidos: 'ADMIN' | 'USER' | 'AUTHORITY'
const ADMIN = ['ADMIN'];
const STAFF = ['ADMIN', 'AUTHORITY'];
const TODOS = ['ADMIN', 'USER', 'AUTHORITY'];

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'registro', component: Registro },

  { path: 'home', component: HomeComponent, canActivate: [authGuard] },

  // Usuarios y Roles: solo ADMIN (gestión del sistema)
  {
    path: 'roles',
    component: Roles,
    canActivate: [roleGuard(ADMIN)],
    children: [
      { path: '', component: RolListar },
      { path: 'nuevo', component: RolForm },
      { path: 'editar/:id', component: RolForm },
    ],
  },

  {
    path: 'usuarios',
    component: Usuarios,
    canActivate: [roleGuard(ADMIN)],
    children: [
      { path: '', component: UsuarioListar },
      { path: 'nuevo', component: UsuarioForm },
      { path: 'editar/:id', component: UsuarioForm },
      { path: 'reportes', component: UsuarioReportes },
    ],
  },

  // Ubicaciones: los 3 roles pueden ver el listado (catálogo) y crear una
  // nueva ubicación (USER indica el lugar exacto de su reporte); editar y
  // ver reportes por ubicación es cosa de staff.
  {
    path: 'ubicaciones',
    component: Ubicaciones,
    canActivate: [authGuard],
    children: [
      { path: '', component: UbicacionListar, canActivate: [roleGuard(TODOS)] },
      { path: 'nuevo', component: UbicacionForm, canActivate: [roleGuard(TODOS)] },
      { path: 'editar/:id', component: UbicacionForm, canActivate: [roleGuard(STAFF)] },
      { path: 'reportes', component: UbicacionReportes, canActivate: [roleGuard(STAFF)] },
    ],
  },

  // Categorías: los 3 roles ven el listado; solo ADMIN crea/edita.
  {
    path: 'categorias',
    component: Categorias,
    canActivate: [authGuard],
    children: [
      { path: '', component: CategoriaListar, canActivate: [roleGuard(TODOS)] },
      { path: 'nuevo', component: CategoriaForm, canActivate: [roleGuard(ADMIN)] },
      { path: 'editar/:id', component: CategoriaForm, canActivate: [roleGuard(ADMIN)] },
    ],
  },

  // Reportes: cualquiera puede crear una denuncia (USER incluido). El listado
  // también es accesible para USER, pero se filtra a "sus" reportes en el
  // propio componente; ADMIN/AUTHORITY ven el listado completo.
  {
  path: 'reportes',
  component: Reportes,
  canActivate: [authGuard],
  children: [
    { path: '', component: ReporteListar, canActivate: [roleGuard(TODOS)] },
    { path: 'nuevo', component: ReporteForm, canActivate: [roleGuard(TODOS)] },
    { path: 'editar/:id', component: ReporteForm, canActivate: [roleGuard(STAFF)] },
    { path: 'estados', component: ReporteEstados, canActivate: [roleGuard(STAFF)] }, // ← nuevo
  ],
  },

  // Acciones administrativas: trabajo de staff (ADMIN, AUTHORITY).
  {
    path: 'acciones',
    component: Acciones,
    canActivate: [roleGuard(STAFF)],
    children: [
      { path: '', component: AccionListar },
      { path: 'nuevo', component: AccionForm },
      { path: 'editar/:id', component: AccionForm },
    ],
  },

  // Evidencias: cualquiera puede subir evidencia. El listado también es
  // accesible para USER (filtrado a "sus" evidencias en el componente).
  {
    path: 'evidencias',
    component: Evidencias,
    canActivate: [authGuard],
    children: [
      { path: '', component: EvidenciaListar, canActivate: [roleGuard(TODOS)] },
      { path: 'nuevo', component: EvidenciaForm, canActivate: [roleGuard(TODOS)] },
    ],
  },

  { path: '**', redirectTo: 'home' },
];

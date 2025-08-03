import { Routes } from '@angular/router';
import { AppLayout } from './layouts/app-layout/app-layout'; // ← bon chemin ici
import { Crud } from './layouts/pages/crud/crud';
import { Specialites } from './layouts/pages/specialites/specialites';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

export const appRoutes: Routes = [
    // Authentication routes (guest only)
    {
        path: 'login',
        loadComponent: () => import('./layouts/pages/login/login').then(m => m.Login),
        canActivate: [GuestGuard]
    },
    {
        path: 'register',
        loadComponent: () => import('./layouts/pages/register/register').then(m => m.RegisterComponent),
        canActivate: [GuestGuard]
    },
    
    // Protected dashboard routes (authenticated users only)
    {
        path: 'dashboard',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'crud', pathMatch: 'full' },
            { path: 'crud', component: Crud},
            { path: 'specialite', component: Specialites},
            { path: 'niveau', loadComponent: () => import('./layouts/pages/niveaux/niveaux').then(m => m.Niveaux) },
            { path: 'matiere', loadComponent: () => import('./layouts/pages/matieres/matieres').then(m => m.Matieres) },
            { path: 'classe', loadComponent: () => import('./layouts/pages/classes/classes').then(m => m.Classes) },
            { path: 'mention', loadComponent: () => import('./layouts/pages/mentions/mentions').then(m => m.Mentions) },
            { path: 'semestre', loadComponent: () => import('./layouts/pages/semestres/semestres').then(m => m.Semestres) },
            { path: 'ue', loadComponent: () => import('./layouts/pages/ues/ues').then(m => m.Ues) },
            { path: 'note', loadComponent: () => import('./layouts/pages/notes/notes').then(m => m.Notes) },
            { path: 'absence', loadComponent: () => import('./layouts/pages/absences/absences').then(m => m.Absences) },
            { path: 'annee-scolaire', loadComponent: () => import('./layouts/pages/annees-scolaires/annees-scolaires').then(m => m.AnneesScolaires) },
            { path: 'enseignement', loadComponent: () => import('./layouts/pages/enseignements/enseignements').then(m => m.Enseignements) },
            { path: 'inscription', loadComponent: () => import('./layouts/pages/inscriptions/inscriptions').then(m => m.Inscriptions) },
            { path: 'leparent', loadComponent: () => import('./layouts/pages/leparents/leparents').then(m => m.Leparents) },
        ]
    },
    
    // Default redirect
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    
    // Wildcard route for 404 page
    { path: '**', redirectTo: '/login' }
];

import { Routes } from '@angular/router';
import { AppLayout } from './layouts/app-layout/app-layout';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';
// All components will be lazy loaded for better performance

export const appRoutes: Routes = [
    // Authentication routes (guest only)
    {
        path: 'login',
        loadComponent: async () => {
            const m = await import('./layouts/pages/login/login');
            return m.Login;
        },
        canActivate: [GuestGuard]
    },
    {
        path: 'register',
        loadComponent: async () => {
            const m = await import('./layouts/pages/register/register');
            return m.RegisterComponent;
        },
        canActivate: [GuestGuard]
    },
    


    // Protected dashboard routes (authenticated users only)
    {
        path: 'app',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            { 
                path: '', 
                loadComponent: async () => {
                    const m = await import('./layouts/pages/dashboard/role-dashboard.component');
                    return m.RoleDashboard;
                },
                pathMatch: 'full'
            },
            { 
                path: 'crud', 
                loadComponent: async () => {
                    const m = await import('./layouts/pages/crud/crud');
                    return m.Crud;
                }
            },
            { 
                path: 'specialite', 
                loadComponent: async () => {
                    const m = await import('./layouts/pages/specialites/specialites');
                    return m.Specialites;
                }
            },
            { 
                path: 'niveau', 
                loadComponent: async () => {
                    const m = await import('./layouts/pages/niveaux/niveaux');
                    return m.Niveaux;
                }
            },
            { 
                path: 'matiere', 
                loadComponent: async () => {
                    const m = await import('./layouts/pages/matieres/matieres');
                    return m.Matieres;
                }
            },
            { 
                path: 'classe', 
                loadComponent: async () => {
                    const m = await import('./layouts/pages/classes/classes');
                    return m.Classes;
                }
            },
            { 
                path: 'mention', 
                loadComponent: async () => {
                    const m = await import('./layouts/pages/mentions/mentions');
                    return m.Mentions;
                }
            },
            { 
                path: 'semestre', 
                loadComponent: async () => {
                    const m = await import('./layouts/pages/semestres/semestres');
                    return m.Semestres;
                }
            },
            { 
                path: 'ue', 
                loadComponent: async () => {
                    const m = await import('./layouts/pages/ues/ues');
                    return m.Ues;
                }
            },
            { 
                path: 'note', 
                loadComponent: async () => {
                    const m = await import('./layouts/pages/notes/notes');
                    return m.Notes;
                }
            },
            { 
                path: 'absence', 
                loadComponent: async () => {
                    const m = await import('./layouts/pages/absences/absences');
                    return m.Absences;
                }
            },
            { 
                path: 'annee-scolaire', 
                loadComponent: async () => {
                    const m = await import('./layouts/pages/annees-scolaires/annees-scolaires');
                    return m.AnneesScolaires;
                }
            },
            { 
                path: 'enseignement', 
                loadComponent: async () => {
                    const m = await import('./layouts/pages/enseignements/enseignements');
                    return m.Enseignements;
                }
            },
            { 
                path: 'inscription', 
                loadComponent: async () => {
                    const m = await import('./layouts/pages/inscriptions/inscriptions');
                    return m.Inscriptions;
                }
            },
            { 
                path: 'leparent', 
                loadComponent: async () => {
                    const m = await import('./layouts/pages/leparents/leparents');
                    return m.Leparents;
                }
            },

            // User Management Routes
            { 
                path: 'management', 
                children: [
                    { 
                        path: 'etudiants', 
                        loadComponent: async () => {
                            const m = await import('./layouts/pages/Users/Admins/user-management/etudiants/etudiants');
                            return m.Etudiants;
                        }
                    },

                    { 
                        path: 'profs', 
                        loadComponent: async () => {
                            const m = await import('./layouts/pages/Users/Admins/user-management/profs/profs');
                            return m.Profs;
                        }
                    },
                    {
                        path: 'parents', 
                        loadComponent: async () => {
                            const m = await import('./layouts/pages/leparents/leparents');
                            return m.Leparents;
                        }
                    },
                    { 
                        path: 'admins', 
                        loadComponent: async () => {
                            const m = await import('./layouts/pages/Users/Admins/user-management/admins/admins');
                            return m.Admins;
                        }
                    },
                ]
                
            },
            



            //Etudiant Routes
             // User Management Routes
             { 
                path: 'etudiant', 
                children: [
                    { 
                        path: 'notes', 
                        loadComponent: async () => {
                            const m = await import('./layouts/pages/Users/Etudiants/mes-notes/mes-notes.component');
                            return m.MesNotesComponent;
                        }
                    },

                    { 
                        path: 'absences', 
                        loadComponent: async () => {
                            const m = await import('./layouts/pages/Users/Etudiants/mes-absences/mes-absences.component');
                            return m.MesAbsencesComponent;
                        }
                    },
                    {
                        path: 'bulletins', 
                        loadComponent: async () => {
                            const m = await import('./layouts/pages/Users/Etudiants/mon-bulletin/mon-bulletin.component');
                            return m.MonBulletinComponent;
                        }
                    },
                    { 
                        path: 'dashboard', 
                        loadComponent: async () => {
                            const m = await import('./layouts/pages/Users/Etudiants/dashboard/dashboard.component');
                            return m.EtudiantDashboardComponent;
                        }
                    },
                ]
                
            },
            
            // Admin Additional Routes
            { 
                path: 'parent-relations', 
                loadComponent: async () => {
                    const m = await import('./layouts/pages/parent-relations/parent-relations');
                    return m.ParentRelations;
                }
            },
            { 
                path: 'AdminDashboard', 
                loadComponent: async () => {
                    const m = await import('./layouts/pages/Users/Admins/dashboard/admin-dashboard.component');
                    return m.AdminDashboard;
                },
                data: { title: 'Dashboard Admin' }
            },
            { 
                path: 'prof-dashboard', 
                loadComponent: async () => {
                    const m = await import('./layouts/pages/prof/prof-dashboard.component');
                    return m.ProfDashboard;
                },
                data: { title: 'Dashboard Professeur' }
            },
            { 
                path: 'etudiant-dashboard', 
                loadComponent: async () => {
                    const m = await import('./layouts/pages/etudiant/etudiant');
                    return m.EtudiantDashboard;
                },
                data: { title: 'Dashboard Étudiant' }
            },
            { 
                path: 'parent-dashboard', 
                loadComponent: async () => {
                    const m = await import('./layouts/pages/dashboard/parent-dashboard.component');
                    return m.ParentDashboard;
                },
                data: { title: 'Dashboard Parent' }
            }
        ]

    
    },
            // Admin Routes avec lazy loading
            
    // Default redirect
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    
    // Wildcard route for 404 page
    { path: '**', redirectTo: '/login' }
];

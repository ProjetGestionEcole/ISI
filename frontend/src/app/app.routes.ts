import { Routes } from '@angular/router';
import { AppLayout } from './layouts/app-layout/app-layout'; // ← bon chemin ici
export const appRoutes: Routes = [
    {
        path: 'dashboard',
        component: AppLayout,
        children: [
            /*{ path: 'offre', 
                component: OffreComponent,
            },*/
            
        ]
    },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

import { Routes } from '@angular/router';
import { AppLayout } from './layouts/app-layout/app-layout'; // ← bon chemin ici
import { Crud } from './layouts/pages/crud/crud';
export const appRoutes: Routes = [
    {
        path: 'dashboard',
        component: AppLayout,
        children: [
                    { path: 'crud', component: Crud},
            /*{ path: 'offre', 
                component: OffreComponent,
            },*/
            
        ]
    },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

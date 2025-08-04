import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../services/auth.service';
import { RoleBasedDataService, DashboardStats } from '../../services/role-based-data.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu implements OnInit, OnDestroy {
    model: MenuItem[] = [];
    private userSubscription: Subscription = new Subscription();
    private statsSubscription: Subscription = new Subscription();
    private dashboardStats: DashboardStats | null = null;

    constructor(
        private authService: AuthService,
        private roleBasedDataService: RoleBasedDataService
    ) {}

    ngOnInit() {
        // Subscribe to user changes to update menu dynamically
        this.userSubscription = this.authService.currentUser$.subscribe(user => {
            if (user) {
                // Load role-based data when user changes
                this.roleBasedDataService.loadDashboardStats();
            }
            this.updateMenuBasedOnRole();
        });
        
        // Subscribe to dashboard stats changes
        this.statsSubscription = this.roleBasedDataService.dashboardStats$.subscribe(stats => {
            this.dashboardStats = stats;
            this.updateMenuBasedOnRole(); // Refresh menu with stats
        });
        
        // Initial menu setup
        this.updateMenuBasedOnRole();
    }

    ngOnDestroy() {
        this.userSubscription.unsubscribe();
        this.statsSubscription.unsubscribe();
    }

    private updateMenuBasedOnRole() {
        const userRole = this.authService.getCurrentUserRole();

        let commonItems: MenuItem[] = [];

        switch (userRole) {
        case 'Admin':
            commonItems = [
            {
                label: 'Accueil',
                items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/admin/dashboard'] }
                ]
            },
            ];
            break;
        case 'Prof':
            commonItems = [
            {
                label: 'Accueil',
                items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/prof/dashboard'] }
                ]
            },
            ];
            break;
        case 'Etudiant':
            commonItems = [
            {
                label: 'Accueil',
                items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/etudiant/dashboard'] }
                ]
            },
            ];
            break;
        case 'Parent':
            commonItems = [
            {
                label: 'Accueil',
                items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/parent/dashboard'] }
                ]
            },
            ];
            break;
       /* case 'user':
            commonItems = [
            {
                label: 'Accueil',
                items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/user/dashboard'] }
                ]
            },
            ];
            break;

        default:
            commonItems = [
            {
                label: 'Accueil',
                items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            }
            ];
            break;
        */
        }

        switch (userRole) {
            case 'Admin':
                this.model = [...commonItems, ...this.getAdminMenu()];
                break;
            case 'Prof':
                this.model = [...commonItems, ...this.getProfMenu()];
                break;
            case 'Etudiant':
                this.model = [...commonItems, ...this.getEtudiantMenu()];
                break;
            case 'Parent':
                this.model = [...commonItems, ...this.getParentMenu()];
                break;
            default:
                // Default menu for non-authenticated users or unknown roles
                this.model = commonItems;
                break;
        }
    }

    private getAdminMenu(): MenuItem[] {
        return [
            {
                label: 'Gestion Utilisateurs',
                items: [
                    { label: 'Étudiants', icon: 'pi pi-fw pi-graduation-cap', routerLink: ['/app/management/etudiants'] },
                    { label: 'Professeurs', icon: 'pi pi-fw pi-user-edit', routerLink: ['/app/management/profs'] },
                    { label: 'Parents', icon: 'pi pi-fw pi-users', routerLink: ['/app/management/parents'] },
                    { label: 'Administrateurs', icon: 'pi pi-fw pi-shield', routerLink: ['/app/anagement/admins'] },
                ]
            },
            {
                label: 'Gestion Académique',
                items: [
                    { label: 'Spécialités', icon: 'pi pi-fw pi-book', routerLink: ['/app/specialite'] },
                    { label: 'Niveaux', icon: 'pi pi-fw pi-sort-amount-up', routerLink: ['/app/niveau'] },
                    { label: 'Matières', icon: 'pi pi-fw pi-bookmark', routerLink: ['/app/matiere'] },
                    { label: 'Classes', icon: 'pi pi-fw pi-users', routerLink: ['/app/classe'] },
                    { label: 'Semestres', icon: 'pi pi-fw pi-calendar', routerLink: ['/app/semestre'] },
                    { label: 'UE', icon: 'pi pi-fw pi-sitemap', routerLink: ['/app/ue'] },
                    { label: 'Années Scolaires', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/app/annee-scolaire'] },
                ]
            },
            {
                label: 'Gestion Pédagogique',
                items: [
                    { label: 'Enseignements', icon: 'pi pi-fw pi-graduation-cap', routerLink: ['/app/enseignement'] },
                    { label: 'Notes', icon: 'pi pi-fw pi-star', routerLink: ['/app/note'] },
                    { label: 'Mentions', icon: 'pi pi-fw pi-trophy', routerLink: ['/app/mention'] },
                    { label: 'Absences', icon: 'pi pi-fw pi-times-circle', routerLink: ['/app/absence'] },
                ]
            },
            {
                label: 'Gestion Administrative',
                items: [
                    { label: 'Inscriptions', icon: 'pi pi-fw pi-user-plus', routerLink: ['/app/inscription'] },
                    { label: 'Relations Parent-Enfant', icon: 'pi pi-fw pi-link', routerLink: ['/app/parent-relations'] },
                ]
            },
            {
                label: 'Statistiques',
                items: [
                    { label: 'Statistiques Système', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/app/system-stats'] },
                ]
            }

            
        ];
    }

    private getProfMenu(): MenuItem[] {
        const stats = this.dashboardStats;
        return [
            {
                label: 'Mon Enseignement',
                items: [
                    { 
                        label: `Mes Enseignements${stats?.enseignements_count ? ` (${stats.enseignements_count})` : ''}`, 
                        icon: 'pi pi-fw pi-book', 
                        routerLink: ['/enseignement'] 
                    },
                    { 
                        label: 'Mes Matières', 
                        icon: 'pi pi-fw pi-bookmark', 
                        routerLink: ['/matiere'] 
                    },
                    { 
                        label: 'Mes Classes', 
                        icon: 'pi pi-fw pi-users', 
                        routerLink: ['/classe'] 
                    },
                ]
            },
            {
                label: 'Gestion des Notes',
                items: [
                    { 
                        label: `Mes Notes${stats?.notes_added ? ` (${stats.notes_added})` : ''}`, 
                        icon: 'pi pi-fw pi-star', 
                        routerLink: ['/note'] 
                    },
                ]
            },
            {
                label: 'Suivi Pédagogique',
                items: [
                    { 
                        label: `Absences${stats?.absences_recorded ? ` (${stats.absences_recorded})` : ''}`, 
                        icon: 'pi pi-fw pi-times-circle', 
                        routerLink: ['/absence'] 
                    },
                    { 
                        label: 'Statistiques', 
                        icon: 'pi pi-fw pi-chart-line', 
                        routerLink: ['/dashboard/prof/stats'] 
                    },
                ]
            }
        ];
    }

    private getEtudiantMenu(): MenuItem[] {
        const stats = this.dashboardStats;
        return [
            {
                label: 'Mon Parcours',
                items: [
                    { 
                        label: `Mes Notes${stats?.notes_count ? ` (${stats.notes_count})` : ''}`, 
                        icon: 'pi pi-fw pi-star', 
                        routerLink: ['/note'] 
                    },
                    { 
                        label: `Mes Absences${stats?.absences_count ? ` (${stats.absences_count})` : ''}`, 
                        icon: 'pi pi-fw pi-times-circle', 
                        routerLink: ['/absence'] 
                    },
                    { 
                        label: 'Mon Bulletin', 
                        icon: 'pi pi-fw pi-file-pdf', 
                        routerLink: ['/dashboard/etudiant/bulletin'] 
                    },
                    { 
                        label: 'Mes Statistiques', 
                        icon: 'pi pi-fw pi-chart-pie', 
                        routerLink: ['/dashboard/etudiant/stats'] 
                    },
                ]
            },
            {
                label: 'Scolarité',
                items: [
                    { 
                        label: `Mes Inscriptions${stats?.inscriptions_count ? ` (${stats.inscriptions_count})` : ''}`, 
                        icon: 'pi pi-fw pi-id-card', 
                        routerLink: ['/inscription'] 
                    },
                    { 
                        label: 'Ma Classe', 
                        icon: 'pi pi-fw pi-users', 
                        routerLink: ['/classe'] 
                    },
                    { 
                        label: 'Mes Matières', 
                        icon: 'pi pi-fw pi-bookmark', 
                        routerLink: ['/matiere'] 
                    },
                    { 
                        label: 'Planning', 
                        icon: 'pi pi-fw pi-calendar', 
                        routerLink: ['/dashboard/etudiant/planning'] 
                    },
                ]
            },
            {
                label: 'Services',
                items: [
                    { 
                        label: 'Réclamations', 
                        icon: 'pi pi-fw pi-exclamation-triangle', 
                        routerLink: ['/dashboard/etudiant/reclamations'] 
                    },
                    { 
                        label: 'Demandes', 
                        icon: 'pi pi-fw pi-send', 
                        routerLink: ['/dashboard/etudiant/demandes'] 
                    },
                ]
            }
        ];
    }

    private getParentMenu(): MenuItem[] {
        const stats = this.dashboardStats;
        return [
            {
                label: 'Mes Enfants',
                items: [
                    { 
                        label: `Liste des Enfants${stats?.children_count ? ` (${stats.children_count})` : ''}`, 
                        icon: 'pi pi-fw pi-users', 
                        routerLink: ['/leparent'] 
                    },
                    { 
                        label: `Notes des Enfants${stats?.children_notes ? ` (${stats.children_notes})` : ''}`, 
                        icon: 'pi pi-fw pi-star', 
                        routerLink: ['/note'] 
                    },
                    { 
                        label: `Absences des Enfants${stats?.children_absences ? ` (${stats.children_absences})` : ''}`, 
                        icon: 'pi pi-fw pi-times-circle', 
                        routerLink: ['/absence'] 
                    },
                ]
            },
            {
                label: 'Suivi Scolaire',
                items: [
                    { 
                        label: 'Bulletins', 
                        icon: 'pi pi-fw pi-file-pdf', 
                        routerLink: ['/dashboard/parent/bulletins'] 
                    },
                    { 
                        label: 'Statistiques', 
                        icon: 'pi pi-fw pi-chart-bar', 
                        routerLink: ['/dashboard/parent/stats'] 
                    },
                    { 
                        label: 'Évolution', 
                        icon: 'pi pi-fw pi-chart-line', 
                        routerLink: ['/dashboard/parent/evolution'] 
                    },
                ]
            },
            {
                label: 'Communication',
                items: [
                    { 
                        label: 'Messages', 
                        icon: 'pi pi-fw pi-envelope', 
                        routerLink: ['/dashboard/parent/messages'] 
                    },
                    { 
                        label: 'Rendez-vous', 
                        icon: 'pi pi-fw pi-calendar-plus', 
                        routerLink: ['/dashboard/parent/appointments'] 
                    },
                ]
            }
        ];
    }
}

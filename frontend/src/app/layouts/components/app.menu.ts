import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../services/auth.service';
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

    constructor(private authService: AuthService) {}

    ngOnInit() {
        // Subscribe to user changes to update menu dynamically
        this.userSubscription = this.authService.currentUser$.subscribe(user => {
            this.updateMenuBasedOnRole();
        });
        
        // Initial menu setup
        this.updateMenuBasedOnRole();
    }

    ngOnDestroy() {
        this.userSubscription.unsubscribe();
    }

    private updateMenuBasedOnRole() {
        const userRole = this.authService.getCurrentUserRole();
        
        // Common dashboard item for all users
        const commonItems: MenuItem[] = [
            {
                label: 'Accueil',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            }
        ];

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
                    { label: 'Étudiants', icon: 'pi pi-fw pi-graduation-cap', routerLink: ['/dashboard/etudiants'] },
                    { label: 'Professeurs', icon: 'pi pi-fw pi-user-edit', routerLink: ['/dashboard/profs'] },
                    { label: 'Parents', icon: 'pi pi-fw pi-users', routerLink: ['/dashboard/parents'] },
                    { label: 'Administrateurs', icon: 'pi pi-fw pi-shield', routerLink: ['/dashboard/admins'] },
                ]
            },
            {
                label: 'Gestion Académique',
                items: [
                    { label: 'Spécialités', icon: 'pi pi-fw pi-book', routerLink: ['/dashboard/specialite'] },
                    { label: 'Niveaux', icon: 'pi pi-fw pi-sort-amount-up', routerLink: ['/dashboard/niveau'] },
                    { label: 'Matières', icon: 'pi pi-fw pi-bookmark', routerLink: ['/dashboard/matiere'] },
                    { label: 'Classes', icon: 'pi pi-fw pi-users', routerLink: ['/dashboard/classe'] },
                    { label: 'Semestres', icon: 'pi pi-fw pi-calendar', routerLink: ['/dashboard/semestre'] },
                    { label: 'UE', icon: 'pi pi-fw pi-sitemap', routerLink: ['/dashboard/ue'] },
                    { label: 'Années Scolaires', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/dashboard/annee-scolaire'] },
                ]
            },
            {
                label: 'Gestion Pédagogique',
                items: [
                    { label: 'Enseignements', icon: 'pi pi-fw pi-graduation-cap', routerLink: ['/dashboard/enseignement'] },
                    { label: 'Notes', icon: 'pi pi-fw pi-star', routerLink: ['/dashboard/note'] },
                    { label: 'Mentions', icon: 'pi pi-fw pi-trophy', routerLink: ['/dashboard/mention'] },
                    { label: 'Absences', icon: 'pi pi-fw pi-times-circle', routerLink: ['/dashboard/absence'] },
                ]
            },
            {
                label: 'Gestion Administrative',
                items: [
                    { label: 'Inscriptions', icon: 'pi pi-fw pi-user-plus', routerLink: ['/dashboard/inscription'] },
                    { label: 'Relations Parent-Enfant', icon: 'pi pi-fw pi-link', routerLink: ['/dashboard/parent-relations'] },
                ]
            },
            {
                label: 'Statistiques',
                items: [
                    { label: 'Statistiques Système', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/dashboard/system-stats'] },
                ]
            }
        ];
    }

    private getProfMenu(): MenuItem[] {
        return [
            {
                label: 'Mon Enseignement',
                items: [
                    { label: 'Mes Matières', icon: 'pi pi-fw pi-bookmark', routerLink: ['/dashboard/prof/subjects'] },
                    { label: 'Mes Classes', icon: 'pi pi-fw pi-users', routerLink: ['/dashboard/prof/classes'] },
                    { label: 'Mes Étudiants', icon: 'pi pi-fw pi-graduation-cap', routerLink: ['/dashboard/prof/students'] },
                ]
            },
            {
                label: 'Gestion des Notes',
                items: [
                    { label: 'Ajouter des Notes', icon: 'pi pi-fw pi-plus', routerLink: ['/dashboard/prof/add-notes'] },
                    { label: 'Mes Notes Ajoutées', icon: 'pi pi-fw pi-star', routerLink: ['/dashboard/prof/my-notes'] },
                    { label: 'Bulletins', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/dashboard/prof/bulletins'] },
                ]
            },
            {
                label: 'Suivi Pédagogique',
                items: [
                    { label: 'Absences', icon: 'pi pi-fw pi-times-circle', routerLink: ['/dashboard/prof/absences'] },
                    { label: 'Statistiques', icon: 'pi pi-fw pi-chart-line', routerLink: ['/dashboard/prof/stats'] },
                ]
            }
        ];
    }

    private getEtudiantMenu(): MenuItem[] {
        return [
            {
                label: 'Mon Parcours',
                items: [
                    { label: 'Mes Notes', icon: 'pi pi-fw pi-star', routerLink: ['/dashboard/etudiant/notes'] },
                    { label: 'Mes Absences', icon: 'pi pi-fw pi-times-circle', routerLink: ['/dashboard/etudiant/absences'] },
                    { label: 'Mon Bulletin', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/dashboard/etudiant/bulletin'] },
                    { label: 'Mes Statistiques', icon: 'pi pi-fw pi-chart-pie', routerLink: ['/dashboard/etudiant/stats'] },
                ]
            },
            {
                label: 'Scolarité',
                items: [
                    { label: 'Ma Classe', icon: 'pi pi-fw pi-users', routerLink: ['/dashboard/etudiant/classe'] },
                    { label: 'Mes Matières', icon: 'pi pi-fw pi-bookmark', routerLink: ['/dashboard/etudiant/matieres'] },
                    { label: 'Planning', icon: 'pi pi-fw pi-calendar', routerLink: ['/dashboard/etudiant/planning'] },
                ]
            },
            {
                label: 'Services',
                items: [
                    { label: 'Réclamations', icon: 'pi pi-fw pi-exclamation-triangle', routerLink: ['/dashboard/etudiant/reclamations'] },
                    { label: 'Demandes', icon: 'pi pi-fw pi-send', routerLink: ['/dashboard/etudiant/demandes'] },
                ]
            }
        ];
    }

    private getParentMenu(): MenuItem[] {
        return [
            {
                label: 'Mes Enfants',
                items: [
                    { label: 'Liste des Enfants', icon: 'pi pi-fw pi-users', routerLink: ['/dashboard/parent/children'] },
                    { label: 'Notes des Enfants', icon: 'pi pi-fw pi-star', routerLink: ['/dashboard/parent/children-notes'] },
                    { label: 'Absences des Enfants', icon: 'pi pi-fw pi-times-circle', routerLink: ['/dashboard/parent/children-absences'] },
                ]
            },
            {
                label: 'Suivi Scolaire',
                items: [
                    { label: 'Bulletins', icon: 'pi pi-fw pi-file-pdf', routerLink: ['/dashboard/parent/bulletins'] },
                    { label: 'Statistiques', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/dashboard/parent/stats'] },
                    { label: 'Évolution', icon: 'pi pi-fw pi-chart-line', routerLink: ['/dashboard/parent/evolution'] },
                ]
            },
            {
                label: 'Communication',
                items: [
                    { label: 'Messages', icon: 'pi pi-fw pi-envelope', routerLink: ['/dashboard/parent/messages'] },
                    { label: 'Rendez-vous', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/dashboard/parent/appointments'] },
                ]
            }
        ];
    }
}

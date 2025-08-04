import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

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
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Crud', icon: 'pi pi-fw pi-pencil', routerLink: ['/dashboard/crud'] },
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
                    { label: 'Parents', icon: 'pi pi-fw pi-users', routerLink: ['/dashboard/leparent'] },
                ]
            },
            {
                label: 'Administration',
                items: [
                    { label: 'Dashboard Admin', icon: 'pi pi-fw pi-chart-line', routerLink: ['/dashboard/admin/dashboard'] },
                    { label: 'Gestion Élèves', icon: 'pi pi-fw pi-users', routerLink: ['/dashboard/admin/eleves'] },
                    { label: 'Gestion Enseignants', icon: 'pi pi-fw pi-user-plus', routerLink: ['/dashboard/admin/enseignants'] },
                    { label: 'Gestion Classes', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard/classe'] },
                    { label: 'Gestion Matières', icon: 'pi pi-fw pi-book', routerLink: ['/dashboard/matiere'] },
                ]
            }
        ];
    }
}

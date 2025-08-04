import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-admin-enseignants',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule
  ],
  template: `
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <h1 class="text-2xl font-medium text-900 mb-4">Gestion des Enseignants</h1>
          <div class="text-center py-8">
            <i class="pi pi-user-plus text-6xl text-400 mb-4"></i>
            <h3 class="text-xl text-600 mb-2">Module Enseignants</h3>
            <p class="text-500">Ce module sera implémenté prochainement avec toutes les fonctionnalités de gestion des enseignants.</p>
            <p-button 
              label="Retour au Dashboard" 
              icon="pi pi-arrow-left" 
              severity="secondary"
              routerLink="/dashboard/admin/dashboard">
            </p-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-center {
      text-align: center;
    }
  `]
})
export class AdminEnseignants implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // Implementation will be added later
  }
}
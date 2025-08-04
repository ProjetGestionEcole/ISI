import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { take, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-role-dashboard',
  template: `
    <div class="flex justify-center items-center h-64">
      <div class="text-center">
        <i class="pi pi-spin pi-spinner text-4xl text-blue-500 mb-4"></i>
        <p class="text-lg text-gray-600">Redirection vers votre tableau de bord...</p>
      </div>
    </div>
  `,
  standalone: true
})
export class RoleDashboard implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private subscription: Subscription = new Subscription();
  private hasRedirected = false;
  private static isRedirecting = false;
  private static redirectTimeout: any = null;

  ngOnInit() {
    // Prevent multiple redirects globally
    if (this.hasRedirected || RoleDashboard.isRedirecting) {
      console.log('Redirect already in progress, skipping');
      return;
    }

    // Clear any existing timeout
    if (RoleDashboard.redirectTimeout) {
      clearTimeout(RoleDashboard.redirectTimeout);
    }

    // Get current user immediately
    const currentUser = this.authService.getCurrentUserValue();
    if (currentUser && currentUser.role) {
      this.redirectToRoleDashboard(currentUser);
      return;
    }

    // If no user available immediately, wait for auth service
    const userSub = this.authService.currentUser$
      .pipe(
        filter(user => user !== null && !!user.role), 
        take(1)
      )
      .subscribe(user => {
        if (!this.hasRedirected && !RoleDashboard.isRedirecting) {
          this.redirectToRoleDashboard(user);
        }
      });

    this.subscription.add(userSub);

    // Safety timeout - redirect to login if no user after 2 seconds
    RoleDashboard.redirectTimeout = setTimeout(() => {
      if (!this.hasRedirected && !RoleDashboard.isRedirecting) {
        console.warn('No user found after timeout, redirecting to login');
        RoleDashboard.isRedirecting = true;
        this.router.navigate(['/login'], { replaceUrl: true });
      }
    }, 2000);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private redirectToRoleDashboard(user: any) {
    if (this.hasRedirected || RoleDashboard.isRedirecting) {
      return;
    }
    
    this.hasRedirected = true;
    RoleDashboard.isRedirecting = true;
    const userRole = user?.role;
    
    console.log('Current user:', user);
    console.log('User role:', userRole);
    
    let targetRoute: string;
    
    switch (userRole) {
      case 'Admin':
        console.log('Redirecting to Admin dashboard');
        targetRoute = '/app/AdminDashboard';
        break;
      case 'Prof':
        console.log('Redirecting to Prof dashboard');
        targetRoute = '/app/prof-dashboard';
        break;
      case 'Etudiant':
        console.log('Redirecting to Etudiant dashboard');
        targetRoute = '/app/etudiant-dashboard';
        break;
      case 'Parent':
        console.log('Redirecting to Parent dashboard');
        targetRoute = '/app/parent-dashboard';
        break;
      default:
        console.warn('Rôle utilisateur non reconnu:', userRole, 'User:', user);
        targetRoute = '/app/crud';
        break;
    }

    console.log('Attempting navigation to:', targetRoute);
    
    // Use replaceUrl to prevent back navigation and avoid loops
    this.router.navigate([targetRoute], { replaceUrl: true }).then(
      () => RoleDashboard.isRedirecting = false
    ).catch(error => {
      console.error('Navigation error:', error);
      RoleDashboard.isRedirecting = false;
      this.router.navigate(['/app/crud'], { replaceUrl: true });
    });
  }
}

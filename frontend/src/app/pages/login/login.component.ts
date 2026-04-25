import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatInputModule, MatButtonModule,
    MatFormFieldModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="page-center">
      <div class="card">
        <h2>Welcome Back</h2>
        <p class="subtitle">Sign in to your account</p>
        <div *ngIf="error" class="error-msg">{{ error }}</div>
        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Email</mat-label>
          <mat-icon matPrefix>email</mat-icon>
          <input matInput type="email" [(ngModel)]="email" placeholder="you@example.com"/>
        </mat-form-field>
        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Password</mat-label>
          <mat-icon matPrefix>lock</mat-icon>
          <input matInput [type]="hide ? 'password' : 'text'" [(ngModel)]="password"/>
          <button mat-icon-button matSuffix (click)="hide = !hide">
            <mat-icon>{{ hide ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
        </mat-form-field>
        <button mat-raised-button color="primary" class="btn-primary" (click)="login()" [disabled]="loading">
          <mat-spinner *ngIf="loading" diameter="20" style="display:inline-block;margin-right:8px"></mat-spinner>
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
        <div class="link-row">Don't have an account? <a routerLink="/register">Register</a></div>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = ''; password = ''; hide = true; loading = false; error = '';

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.error = ''; this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => { this.error = 'Invalid email or password'; this.loading = false; }
    });
  }
}

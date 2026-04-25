import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  template: `
    <div class="auth-wrapper">
      <div class="auth-brand">
        <div class="brand-logo">👥</div>
        <h1>UserFlow</h1>
        <p>The modern platform for managing your users and team members efficiently.</p>
        <div class="features">
          <div class="feature"><mat-icon>verified_user</mat-icon><span>Secure JWT Authentication</span></div>
          <div class="feature"><mat-icon>speed</mat-icon><span>Real-time User Management</span></div>
          <div class="feature"><mat-icon>cloud_done</mat-icon><span>Deployed on Kubernetes</span></div>
        </div>
      </div>

      <div class="auth-form-side">
        <div class="auth-form-box">
          <div class="auth-header">
            <h2>Welcome back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          <div class="error-banner" *ngIf="error">
            <mat-icon style="font-size:16px;width:16px;height:16px">error_outline</mat-icon>
            {{ error }}
          </div>

          <div class="form-group">
            <label>Email address</label>
            <div class="input-wrap">
              <mat-icon>mail_outline</mat-icon>
              <input type="email" [(ngModel)]="email" placeholder="you@company.com"/>
            </div>
          </div>

          <div class="form-group">
            <label>Password</label>
            <div class="input-wrap">
              <mat-icon>lock_outline</mat-icon>
              <input [type]="hide ? 'password' : 'text'" [(ngModel)]="password" placeholder="••••••••"/>
              <button class="eye-btn" (click)="hide = !hide">
                <mat-icon style="font-size:18px;width:18px;height:18px">{{ hide ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </div>
          </div>

          <button class="btn-auth" (click)="login()" [disabled]="loading">
            <div class="spinner" *ngIf="loading"></div>
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>

          <div class="auth-footer">
            Don't have an account? <a routerLink="/register">Create one</a>
          </div>
        </div>
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
      error: () => { this.error = 'Invalid email or password. Please try again.'; this.loading = false; }
    });
  }
}

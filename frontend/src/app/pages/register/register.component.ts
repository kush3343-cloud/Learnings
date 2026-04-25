import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
  template: `
    <div class="auth-wrapper">
      <div class="auth-brand">
        <div class="brand-logo">👥</div>
        <h1>UserFlow</h1>
        <p>Join thousands of teams managing their users with UserFlow.</p>
        <div class="features">
          <div class="feature"><mat-icon>verified_user</mat-icon><span>Secure JWT Authentication</span></div>
          <div class="feature"><mat-icon>speed</mat-icon><span>Real-time User Management</span></div>
          <div class="feature"><mat-icon>cloud_done</mat-icon><span>Deployed on Kubernetes</span></div>
        </div>
      </div>

      <div class="auth-form-side">
        <div class="auth-form-box">
          <div class="auth-header">
            <h2>Create your account</h2>
            <p>Get started for free today</p>
          </div>

          <div class="error-banner" *ngIf="error">
            <mat-icon style="font-size:16px;width:16px;height:16px">error_outline</mat-icon>
            {{ error }}
          </div>

          <div class="form-group">
            <label>Full name</label>
            <div class="input-wrap">
              <mat-icon>person_outline</mat-icon>
              <input type="text" [(ngModel)]="name" placeholder="John Smith"/>
            </div>
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
              <input [type]="hide ? 'password' : 'text'" [(ngModel)]="password" placeholder="Min. 8 characters"/>
              <button class="eye-btn" (click)="hide = !hide">
                <mat-icon style="font-size:18px;width:18px;height:18px">{{ hide ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </div>
          </div>

          <button class="btn-auth" (click)="register()" [disabled]="loading">
            <div class="spinner" *ngIf="loading"></div>
            {{ loading ? 'Creating account...' : 'Create account' }}
          </button>

          <div class="auth-footer">
            Already have an account? <a routerLink="/login">Sign in</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  name = ''; email = ''; password = ''; hide = true; loading = false; error = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.error = ''; this.loading = true;
    this.auth.register(this.name, this.email, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (e) => { this.error = e.error || 'Registration failed. Please try again.'; this.loading = false; }
    });
  }
}

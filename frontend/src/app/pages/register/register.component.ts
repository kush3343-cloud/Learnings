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
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatInputModule, MatButtonModule,
    MatFormFieldModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="page-center">
      <div class="card">
        <h2>Create Account</h2>
        <p class="subtitle">Join us today — it's free!</p>
        <div *ngIf="error" class="error-msg">{{ error }}</div>
        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Full Name</mat-label>
          <mat-icon matPrefix>person</mat-icon>
          <input matInput [(ngModel)]="name" placeholder="Kushal Kumar"/>
        </mat-form-field>
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
        <button mat-raised-button color="primary" class="btn-primary" (click)="register()" [disabled]="loading">
          <mat-spinner *ngIf="loading" diameter="20" style="display:inline-block;margin-right:8px"></mat-spinner>
          {{ loading ? 'Creating account...' : 'Create Account' }}
        </button>
        <div class="link-row">Already have an account? <a routerLink="/login">Sign In</a></div>
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
      error: (e) => { this.error = e.error || 'Registration failed'; this.loading = false; }
    });
  }
}

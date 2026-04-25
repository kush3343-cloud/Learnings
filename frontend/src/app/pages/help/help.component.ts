import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="app-layout">
      <aside class="sidebar">
        <div class="sidebar-brand">
          <div class="brand-icon"><mat-icon>group</mat-icon></div>
          <span>UserFlow</span>
        </div>
        <div class="sidebar-section">
          <label>Main Menu</label>
          <a class="nav-item" (click)="go('/dashboard')"><mat-icon>dashboard</mat-icon><span>Dashboard</span></a>
          <a class="nav-item" (click)="go('/dashboard')"><mat-icon>people</mat-icon><span>Users</span></a>
          <a class="nav-item" (click)="go('/roles')"><mat-icon>shield</mat-icon><span>Roles</span></a>
        </div>
        <div class="sidebar-section">
          <label>System</label>
          <a class="nav-item" (click)="go('/settings')"><mat-icon>settings</mat-icon><span>Settings</span></a>
          <a class="nav-item active"><mat-icon>help_outline</mat-icon><span>Help</span></a>
        </div>
        <div class="sidebar-footer">
          <div class="user-info">
            <div class="avatar">{{ user?.name?.charAt(0)?.toUpperCase() }}</div>
            <div class="user-meta">
              <div class="name">{{ user?.name }}</div>
              <div class="role">{{ user?.role }}</div>
            </div>
            <button (click)="logout()"><mat-icon style="font-size:18px;width:18px;height:18px">logout</mat-icon></button>
          </div>
        </div>
      </aside>

      <div class="main-content">
        <div class="topbar">
          <div class="page-title">Help & Documentation</div>
        </div>

        <div class="page-content">

          <!-- Quick Start -->
          <div class="section-card" style="margin-bottom:20px">
            <div class="section-header"><h3>Quick Start Guide</h3></div>
            <div style="padding:24px;display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
              <div *ngFor="let s of steps" style="padding:20px;background:#f8fafc;border-radius:10px;border:1px solid #f1f5f9">
                <div style="width:36px;height:36px;background:#eff6ff;border-radius:8px;
                  display:flex;align-items:center;justify-content:center;margin-bottom:12px">
                  <mat-icon style="color:#1a56db;font-size:18px;width:18px;height:18px">{{ s.icon }}</mat-icon>
                </div>
                <div style="font-size:13px;font-weight:700;color:#0f172a;margin-bottom:4px">{{ s.title }}</div>
                <div style="font-size:12px;color:#64748b;line-height:1.5">{{ s.desc }}</div>
              </div>
            </div>
          </div>

          <!-- FAQ -->
          <div class="section-card" style="margin-bottom:20px">
            <div class="section-header"><h3>Frequently Asked Questions</h3></div>
            <div style="padding:8px 24px 24px">
              <div *ngFor="let faq of faqs" style="border-bottom:1px solid #f1f5f9;padding:16px 0">
                <div (click)="faq.open = !faq.open"
                  style="display:flex;justify-content:space-between;align-items:center;cursor:pointer">
                  <div style="font-size:14px;font-weight:600;color:#0f172a">{{ faq.q }}</div>
                  <mat-icon style="color:#94a3b8;font-size:18px;width:18px;height:18px">
                    {{ faq.open ? 'expand_less' : 'expand_more' }}
                  </mat-icon>
                </div>
                <div *ngIf="faq.open" style="font-size:13px;color:#64748b;margin-top:10px;line-height:1.6">
                  {{ faq.a }}
                </div>
              </div>
            </div>
          </div>

          <!-- API Reference -->
          <div class="section-card">
            <div class="section-header"><h3>API Reference</h3></div>
            <div style="padding:24px">
              <div *ngFor="let api of apis" style="display:flex;align-items:flex-start;gap:16px;
                padding:14px;background:#f8fafc;border-radius:8px;border:1px solid #f1f5f9;margin-bottom:10px">
                <span style="padding:3px 8px;border-radius:4px;font-size:11px;font-weight:700;
                  font-family:monospace;flex-shrink:0"
                  [style.background]="api.method === 'GET' ? '#dcfce7' : api.method === 'POST' ? '#dbeafe' : api.method === 'PATCH' ? '#fef3c7' : api.method === 'PUT' ? '#f3e8ff' : '#fee2e2'"
                  [style.color]="api.method === 'GET' ? '#16a34a' : api.method === 'POST' ? '#1d4ed8' : api.method === 'PATCH' ? '#d97706' : api.method === 'PUT' ? '#7c3aed' : '#dc2626'">
                  {{ api.method }}
                </span>
                <div>
                  <div style="font-size:13px;font-weight:600;color:#0f172a;font-family:monospace">{{ api.path }}</div>
                  <div style="font-size:12px;color:#64748b;margin-top:2px">{{ api.desc }}</div>
                </div>
                <span style="margin-left:auto;font-size:11px;padding:2px 8px;border-radius:10px"
                  [style.background]="api.auth ? '#fef3c7' : '#dcfce7'"
                  [style.color]="api.auth ? '#d97706' : '#16a34a'">
                  {{ api.auth ? 'JWT Required' : 'Public' }}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class HelpComponent {
  user: any;

  steps = [
    { icon: 'person_add', title: 'Register / Login', desc: 'Create your account or sign in with your credentials to access the dashboard.' },
    { icon: 'group_add', title: 'Add Users', desc: 'Click "Add User" on the dashboard to create new user entries in the system.' },
    { icon: 'admin_panel_settings', title: 'Manage Roles', desc: 'Go to Roles page to promote users to ADMIN or demote them back to USER.' },
  ];

  faqs = [
    { q: 'How do I add a new user?', a: 'Go to Dashboard and click the "Add User" button in the top right of the users table. Fill in the name and email, then click Add User.', open: false },
    { q: 'How do I promote a user to Admin?', a: 'Navigate to the Roles page from the sidebar. Find the user and click the "Promote" button to give them ADMIN role.', open: false },
    { q: 'How do I change my password?', a: 'Go to Settings from the sidebar. Scroll to the "Change Password" section, enter your new password, confirm it and click Update Password.', open: false },
    { q: 'Is my data secure?', a: 'Yes. All API calls are protected with JWT authentication. Passwords are hashed using BCrypt. The app is deployed on Kubernetes with TLS.', open: false },
    { q: 'What happens if I delete a user?', a: 'The user is permanently removed from the database. This action cannot be undone.', open: false },
  ];

  apis = [
    { method: 'POST', path: '/auth/register', desc: 'Register a new user account', auth: false },
    { method: 'POST', path: '/auth/login', desc: 'Login and receive a JWT token', auth: false },
    { method: 'GET',  path: '/users', desc: 'Get all users', auth: true },
    { method: 'POST', path: '/users', desc: 'Create a new user', auth: true },
    { method: 'DELETE', path: '/users/{id}', desc: 'Delete a user by ID', auth: true },
    { method: 'PATCH', path: '/users/{id}/role', desc: 'Update user role (ADMIN/USER)', auth: true },
    { method: 'PUT',  path: '/users/profile', desc: 'Update own name or password', auth: true },
  ];

  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getUser();
  }

  go(path: string) { this.router.navigate([path]); }
  logout() { this.authService.logout(); }
}

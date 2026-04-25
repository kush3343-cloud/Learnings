import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatSnackBarModule],
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
          <a class="nav-item active"><mat-icon>shield</mat-icon><span>Roles</span></a>
        </div>
        <div class="sidebar-section">
          <label>System</label>
          <a class="nav-item" (click)="go('/settings')"><mat-icon>settings</mat-icon><span>Settings</span></a>
          <a class="nav-item" (click)="go('/help')"><mat-icon>help_outline</mat-icon><span>Help</span></a>
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
          <div class="page-title">Role Management</div>
        </div>

        <div class="page-content">
          <div class="section-card">
            <div class="section-header">
              <h3>User Roles <span style="color:#94a3b8;font-weight:400">({{ users.length }})</span></h3>
              <div style="font-size:12px;color:#64748b">Promote or demote user roles</div>
            </div>

            <div *ngIf="loading" style="text-align:center;padding:48px">
              <div style="width:32px;height:32px;border:3px solid #e2e8f0;border-top-color:#1a56db;
                border-radius:50%;animation:spin 0.6s linear infinite;margin:auto"></div>
            </div>

            <div class="table-wrap" *ngIf="!loading">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Current Role</th>
                    <th>Change Role</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let u of users">
                    <td>
                      <div class="user-cell">
                        <div class="avatar">{{ u.name?.charAt(0)?.toUpperCase() }}</div>
                        <div>
                          <div class="user-name">{{ u.name }}</div>
                          <div class="user-email">{{ u.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="badge" [class]="u.role === 'ADMIN' ? 'admin' : 'user'">
                        {{ u.role || 'USER' }}
                      </span>
                    </td>
                    <td>
                      <div style="display:flex;gap:8px">
                        <button class="action-btn" (click)="setRole(u, 'ADMIN')"
                          [disabled]="u.role === 'ADMIN'"
                          style="color:#1a56db;border-color:#bfdbfe"
                          [style.opacity]="u.role === 'ADMIN' ? '0.4' : '1'">
                          <mat-icon>arrow_upward</mat-icon> Promote
                        </button>
                        <button class="action-btn danger" (click)="setRole(u, 'USER')"
                          [disabled]="u.role === 'USER' || !u.role"
                          [style.opacity]="u.role === 'USER' || !u.role ? '0.4' : '1'">
                          <mat-icon>arrow_downward</mat-icon> Demote
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RolesComponent implements OnInit {
  users: any[] = [];
  loading = true;
  user: any;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.userService.getUsers().subscribe({
      next: (data) => { this.users = data; this.loading = false; this.cdr.detectChanges(); },
      error: () => { this.loading = false; }
    });
  }

  setRole(u: any, role: string) {
    this.userService.updateRole(u.id, role).subscribe({
      next: () => {
        u.role = role;
        this.snackBar.open(`${u.name} is now ${role}`, '', { duration: 3000 });
        this.cdr.detectChanges();
      },
      error: () => this.snackBar.open('Failed to update role', '', { duration: 3000 })
    });
  }

  go(path: string) { this.router.navigate([path]); }
  logout() { this.authService.logout(); }
}

import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-settings',
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
          <a class="nav-item" (click)="go('/roles')"><mat-icon>shield</mat-icon><span>Roles</span></a>
        </div>
        <div class="sidebar-section">
          <label>System</label>
          <a class="nav-item active"><mat-icon>settings</mat-icon><span>Settings</span></a>
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
          <div class="page-title">Settings</div>
        </div>

        <div class="page-content">

          <!-- Profile Card -->
          <div class="section-card" style="margin-bottom:20px">
            <div class="section-header">
              <h3>Profile Information</h3>
              <div style="font-size:12px;color:#64748b">Update your display name</div>
            </div>
            <div style="padding:24px;max-width:480px">
              <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px">
                <div style="width:64px;height:64px;border-radius:16px;
                  background:linear-gradient(135deg,#1a56db,#7c3aed);
                  display:flex;align-items:center;justify-content:center;
                  color:white;font-size:26px;font-weight:700">
                  {{ name?.charAt(0)?.toUpperCase() }}
                </div>
                <div>
                  <div style="font-size:16px;font-weight:700;color:#0f172a">{{ name }}</div>
                  <div style="font-size:13px;color:#64748b">{{ user?.email }}</div>
                  <span class="badge" [class]="user?.role === 'ADMIN' ? 'admin' : 'user'" style="margin-top:4px">
                    {{ user?.role }}
                  </span>
                </div>
              </div>
              <div class="form-group" style="margin-bottom:16px">
                <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Full Name</label>
                <input [(ngModel)]="name" style="width:100%;padding:10px 12px;border:1.5px solid #e2e8f0;
                  border-radius:8px;font-size:14px;outline:none"/>
              </div>
              <button class="btn-primary" (click)="saveProfile()" [disabled]="saving">
                <div class="spinner" *ngIf="saving"></div>
                <mat-icon *ngIf="!saving">save</mat-icon>
                {{ saving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </div>

          <!-- Password Card -->
          <div class="section-card">
            <div class="section-header">
              <h3>Change Password</h3>
              <div style="font-size:12px;color:#64748b">Update your account password</div>
            </div>
            <div style="padding:24px;max-width:480px">
              <div class="form-group" style="margin-bottom:16px">
                <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">New Password</label>
                <input type="password" [(ngModel)]="newPassword" placeholder="Min. 8 characters"
                  style="width:100%;padding:10px 12px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:14px;outline:none"/>
              </div>
              <div class="form-group" style="margin-bottom:20px">
                <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px">Confirm Password</label>
                <input type="password" [(ngModel)]="confirmPassword" placeholder="Repeat password"
                  style="width:100%;padding:10px 12px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:14px;outline:none"/>
                <div *ngIf="confirmPassword && newPassword !== confirmPassword"
                  style="color:#dc2626;font-size:12px;margin-top:4px">Passwords do not match</div>
              </div>
              <button class="btn-primary" (click)="savePassword()"
                [disabled]="savingPwd || !newPassword || newPassword !== confirmPassword">
                <div class="spinner" *ngIf="savingPwd"></div>
                <mat-icon *ngIf="!savingPwd">lock_reset</mat-icon>
                {{ savingPwd ? 'Updating...' : 'Update Password' }}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class SettingsComponent {
  user: any;
  name = '';
  newPassword = '';
  confirmPassword = '';
  saving = false;
  savingPwd = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.user = this.authService.getUser();
    this.name = this.user?.name || '';
  }

  saveProfile() {
    this.saving = true;
    this.userService.updateProfile(this.name, '').subscribe({
      next: (u) => {
        const stored = this.authService.getUser();
        localStorage.setItem('user', JSON.stringify({ ...stored, name: u.name }));
        this.user = this.authService.getUser();
        this.snackBar.open('Profile updated!', '', { duration: 3000 });
        this.saving = false; this.cdr.detectChanges();
      },
      error: () => { this.snackBar.open('Failed to update', '', { duration: 3000 }); this.saving = false; }
    });
  }

  savePassword() {
    this.savingPwd = true;
    this.userService.updateProfile(this.name, this.newPassword).subscribe({
      next: () => {
        this.snackBar.open('Password updated!', '', { duration: 3000 });
        this.newPassword = ''; this.confirmPassword = '';
        this.savingPwd = false; this.cdr.detectChanges();
      },
      error: () => { this.snackBar.open('Failed to update password', '', { duration: 3000 }); this.savingPwd = false; }
    });
  }

  go(path: string) { this.router.navigate([path]); }
  logout() { this.authService.logout(); }
}

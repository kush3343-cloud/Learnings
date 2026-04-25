import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { AddUserDialogComponent } from '../../components/add-user-dialog/add-user-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatDialogModule, MatSnackBarModule],
  template: `
    <div class="app-layout">

      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-brand">
          <div class="brand-icon"><mat-icon>group</mat-icon></div>
          <span>UserFlow</span>
        </div>
        <div class="sidebar-section">
          <label>Main Menu</label>
          <a class="nav-item active">
            <mat-icon>dashboard</mat-icon><span>Dashboard</span>
          </a>
          <a class="nav-item">
            <mat-icon>people</mat-icon><span>Users</span>
          </a>
          <a class="nav-item">
            <mat-icon>shield</mat-icon><span>Roles</span>
          </a>
        </div>
        <div class="sidebar-section">
          <label>System</label>
          <a class="nav-item">
            <mat-icon>settings</mat-icon><span>Settings</span>
          </a>
          <a class="nav-item">
            <mat-icon>help_outline</mat-icon><span>Help</span>
          </a>
        </div>
        <div class="sidebar-footer">
          <div class="user-info">
            <div class="avatar">{{ user?.name?.charAt(0)?.toUpperCase() }}</div>
            <div class="user-meta">
              <div class="name">{{ user?.name }}</div>
              <div class="role">{{ user?.role }}</div>
            </div>
            <button (click)="logout()" title="Logout">
              <mat-icon style="font-size:18px;width:18px;height:18px">logout</mat-icon>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main -->
      <div class="main-content">

        <!-- Topbar -->
        <div class="topbar">
          <div class="page-title">Dashboard</div>
          <div class="topbar-right">
            <div class="search-box">
              <mat-icon>search</mat-icon>
              <input [(ngModel)]="search" placeholder="Search users..." (input)="filterUsers()"/>
            </div>
            <button class="icon-btn" title="Notifications">
              <mat-icon style="font-size:18px;width:18px;height:18px">notifications_none</mat-icon>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="page-content">

          <!-- Stats -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-info">
                <div class="stat-label">Total Users</div>
                <div class="stat-value">{{ users.length }}</div>
                <div class="stat-change neutral">All registered users</div>
              </div>
              <div class="stat-icon blue"><mat-icon>people</mat-icon></div>
            </div>
            <div class="stat-card">
              <div class="stat-info">
                <div class="stat-label">Active Today</div>
                <div class="stat-value">{{ users.length }}</div>
                <div class="stat-change up">↑ All active</div>
              </div>
              <div class="stat-icon green"><mat-icon>person_check</mat-icon></div>
            </div>
            <div class="stat-card">
              <div class="stat-info">
                <div class="stat-label">Admins</div>
                <div class="stat-value">{{ adminCount }}</div>
                <div class="stat-change neutral">With admin role</div>
              </div>
              <div class="stat-icon purple"><mat-icon>admin_panel_settings</mat-icon></div>
            </div>
            <div class="stat-card">
              <div class="stat-info">
                <div class="stat-label">Regular Users</div>
                <div class="stat-value">{{ users.length - adminCount }}</div>
                <div class="stat-change neutral">Standard role</div>
              </div>
              <div class="stat-icon orange"><mat-icon>manage_accounts</mat-icon></div>
            </div>
          </div>

          <!-- Users Table -->
          <div class="section-card">
            <div class="section-header">
              <h3>All Users <span style="color:#94a3b8;font-weight:400">({{ filteredUsers.length }})</span></h3>
              <div class="header-actions">
                <button class="btn-primary" (click)="openAddDialog()">
                  <mat-icon>person_add</mat-icon> Add User
                </button>
              </div>
            </div>

            <!-- Loading -->
            <div *ngIf="loading" style="text-align:center;padding:48px">
              <div style="width:32px;height:32px;border:3px solid #e2e8f0;border-top-color:#1a56db;
                border-radius:50%;animation:spin 0.6s linear infinite;margin:auto"></div>
              <p style="margin-top:12px;color:#94a3b8;font-size:13px">Loading users...</p>
            </div>

            <!-- Empty -->
            <div *ngIf="!loading && filteredUsers.length === 0" class="empty-state">
              <mat-icon>people_outline</mat-icon>
              <h4>No users found</h4>
              <p>{{ search ? 'Try a different search term' : 'Add your first user to get started' }}</p>
            </div>

            <!-- Table -->
            <div class="table-wrap" *ngIf="!loading && filteredUsers.length > 0">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>ID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let u of filteredUsers">
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
                    <td style="color:#94a3b8;font-size:12px;font-family:monospace">
                      {{ u.id?.substring(0, 8) }}...
                    </td>
                    <td>
                      <button class="action-btn danger" (click)="deleteUser(u.id)">
                        <mat-icon>delete_outline</mat-icon> Remove
                      </button>
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
export class DashboardComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  loading = true;
  user: any;
  search = '';

  get adminCount() { return this.users.filter(u => u.role === 'ADMIN').length; }

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = Array.isArray(data) ? data : [];
        this.filteredUsers = [...this.users];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => { console.error('Failed to load users', err); this.loading = false; this.cdr.detectChanges(); }
    });
  }

  filterUsers() {
    const q = this.search.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }

  openAddDialog() {
    const ref = this.dialog.open(AddUserDialogComponent, { width: '440px', panelClass: 'clean-dialog' });
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.userService.addUser(result.name, result.email).subscribe({
          next: () => { this.snackBar.open('User added successfully', '', { duration: 3000 }); this.loadUsers(); },
          error: () => this.snackBar.open('Failed to add user', '', { duration: 3000 })
        });
      }
    });
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id).subscribe({
      next: () => { this.snackBar.open('User removed', '', { duration: 3000 }); this.loadUsers(); },
      error: () => this.snackBar.open('Failed to remove user', '', { duration: 3000 })
    });
  }

  logout() { this.authService.logout(); }
}

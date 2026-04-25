import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { AddUserDialogComponent } from '../../components/add-user-dialog/add-user-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule,
    MatDialogModule, MatProgressSpinnerModule, MatSnackBarModule],
  template: `
    <mat-toolbar color="primary" style="position:sticky;top:0;z-index:100;box-shadow:0 2px 10px rgba(0,0,0,0.2)">
      <mat-icon style="margin-right:10px">group</mat-icon>
      <span>User Management</span>
      <span class="toolbar-spacer"></span>
      <span style="margin-right:16px;font-size:14px">Hi, {{ user?.name }}</span>
      <button mat-icon-button (click)="logout()" title="Logout">
        <mat-icon>logout</mat-icon>
      </button>
    </mat-toolbar>

    <div class="dashboard-container">
      <div class="dashboard-header">
        <h2>Users <span style="color:#aaa;font-size:16px">({{ users.length }})</span></h2>
        <button mat-raised-button color="accent" (click)="openAddDialog()">
          <mat-icon>person_add</mat-icon> Add User
        </button>
      </div>

      <div *ngIf="loading" style="text-align:center;padding:60px">
        <mat-spinner style="margin:auto"></mat-spinner>
      </div>

      <div *ngIf="!loading && users.length === 0" class="empty-state">
        <mat-icon>people_outline</mat-icon>
        <p>No users yet. Add your first user!</p>
      </div>

      <div class="user-grid" *ngIf="!loading && users.length > 0">
        <div class="user-card" *ngFor="let u of users">
          <button mat-icon-button class="delete-btn" (click)="deleteUser(u.id)" title="Delete">
            <mat-icon>delete</mat-icon>
          </button>
          <div class="user-avatar">{{ u.name?.charAt(0)?.toUpperCase() }}</div>
          <div class="user-name">{{ u.name }}</div>
          <div class="user-email">{{ u.email }}</div>
          <span class="user-role">{{ u.role || 'USER' }}</span>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  users: any[] = [];
  loading = true;
  user: any;

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
      next: (data) => { this.users = Array.isArray(data) ? data : []; this.loading = false; this.cdr.detectChanges(); },
      error: (err) => { console.error('Failed to load users', err); this.loading = false; this.cdr.detectChanges(); }
    });
  }

  openAddDialog() {
    const ref = this.dialog.open(AddUserDialogComponent, { width: '420px' });
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.userService.addUser(result.name, result.email).subscribe({
          next: () => { this.snackBar.open('User added!', '', { duration: 2500 }); this.loadUsers(); },
          error: () => this.snackBar.open('Failed to add user', '', { duration: 2500 })
        });
      }
    });
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id).subscribe({
      next: () => { this.snackBar.open('User deleted', '', { duration: 2500 }); this.loadUsers(); },
      error: () => this.snackBar.open('Failed to delete user', '', { duration: 2500 })
    });
  }

  logout() { this.authService.logout(); }
}

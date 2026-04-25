import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-user-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatIconModule],
  template: `
    <div class="dialog-header">
      <h2>Add New User</h2>
      <p>Fill in the details to create a new user account</p>
    </div>
    <div class="dialog-body">
      <div class="form-group">
        <label>Full Name</label>
        <input type="text" [(ngModel)]="name" placeholder="John Smith"/>
      </div>
      <div class="form-group">
        <label>Email Address</label>
        <input type="email" [(ngModel)]="email" placeholder="john@company.com"/>
      </div>
    </div>
    <div class="dialog-footer">
      <button class="btn-cancel" (click)="close()">Cancel</button>
      <button class="btn-primary" (click)="save()" [disabled]="!name || !email">
        <mat-icon>person_add</mat-icon> Add User
      </button>
    </div>
  `
})
export class AddUserDialogComponent {
  name = ''; email = '';
  constructor(private dialogRef: MatDialogRef<AddUserDialogComponent>) {}
  save() { this.dialogRef.close({ name: this.name, email: this.email }); }
  close() { this.dialogRef.close(); }
}

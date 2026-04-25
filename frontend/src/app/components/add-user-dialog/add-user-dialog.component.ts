import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-user-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatInputModule,
    MatButtonModule, MatFormFieldModule, MatIconModule],
  template: `
    <h2 mat-dialog-title class="dialog-title">Add New User</h2>
    <mat-dialog-content style="padding-top:16px">
      <mat-form-field class="full-width" appearance="outline">
        <mat-label>Full Name</mat-label>
        <mat-icon matPrefix>person</mat-icon>
        <input matInput [(ngModel)]="name" placeholder="John Doe"/>
      </mat-form-field>
      <mat-form-field class="full-width" appearance="outline">
        <mat-label>Email</mat-label>
        <mat-icon matPrefix>email</mat-icon>
        <input matInput type="email" [(ngModel)]="email" placeholder="john@example.com"/>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="!name || !email">Add User</button>
    </mat-dialog-actions>
  `
})
export class AddUserDialogComponent {
  name = ''; email = '';

  constructor(private dialogRef: MatDialogRef<AddUserDialogComponent>) {}

  save() { this.dialogRef.close({ name: this.name, email: this.email }); }
  close() { this.dialogRef.close(); }
}

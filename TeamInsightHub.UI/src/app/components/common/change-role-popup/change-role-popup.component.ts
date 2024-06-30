import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserDto } from 'src/app/dtos/user.dto';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-role-popup',
  templateUrl: './change-role-popup.component.html',
  styleUrls: ['./change-role-popup.component.scss'],
})
export class ChangeRolePopupComponent {
  connectedUserId!: string;
  changeRoleForm!: FormGroup;
  userId: string = '';
  user: UserDto | null = null;

  roleOptions: { value: string, label: string }[] = [
    { value: 'Consultant', label: 'Consultant' },
    { value: 'Manager', label: 'Manager' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Record<string, string>,
    private dialogRef: MatDialogRef<ChangeRolePopupComponent>,
    private fb: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {

    this.userId = this.data['UserId'];
  }

  ngOnInit(): void {
    this.changeRoleForm = this.fb.group({
      newRole: ['', [Validators.required]],
    });
    this.userId = this.data['UserId'];
    this.getUser();
  }

  getController(controllerName: string): AbstractControl | null {
    return this.changeRoleForm.controls[controllerName] || null;
  }

  cancel() {
    this.dialogRef.close();
  }

  getUser() {
    this.userService.getUserById(this.userId).subscribe(
      (user: UserDto) => {
        this.user = user;
      },
      (error) => {
        this.toastr.error('An error occurred while fetching user data', 'Error');
      }
    );
  }

  changeRole() {
    if (this.changeRoleForm.valid ) {
      const newRoleControl = this.getController('newRole');

      if (newRoleControl) {
        const newRole = newRoleControl.value;

        this.userService.updateUserRole(this.userId, newRole).subscribe(
          (response) => {
            if (response) {
              this.toastr.success('Role changed successfully', 'Success');
              this.dialogRef.close(true);
            } else {
              this.toastr.error('Failed to change role', 'Error');
            }
          },
          (error) => {
            this.toastr.error('An error occurred', 'Error');
          }
        );
      }
    }
  }
}

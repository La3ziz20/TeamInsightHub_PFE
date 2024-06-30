import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-password-popup',
  templateUrl: './change-password-popup.component.html',
  styleUrls: ['./change-password-popup.component.scss'],
})
export class ChangePasswordPopupComponent {
  connectedUserId!: string;

  resetPasswordForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Record<string, string>,
    private dialogRef: MatDialogRef<ChangePasswordPopupComponent>,
    private localStorageService: LocalStorageService,
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.connectedUserId = this.localStorageService.getUserInfo().id;
    this.resetPasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  getController(controllerName: string): AbstractControl {
    return this.resetPasswordForm.controls[controllerName];
  }

  cancel() {
    this.dialogRef.close();
  }

  isPasswordNotMatch(): boolean {
    if (
      this.getController('newPassword').value !==
      this.getController('confirmPassword').value
    ) {
      return true;
    }
    return false;
  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      this.userService
        .changePassword(this.connectedUserId, {
          oldPassword: this.getController('oldPassword').value,
          newPassword: this.getController('newPassword').value,
        })
        .subscribe(
          (response) => {
            if (response) {
              this.toastr.success('Password changed successfully', 'Success');
              this.dialogRef.close(true);
            } else {
              this.toastr.error(
                'An error occurred while changing the password',
                'Error'
              );
            }
          },
          (error) => {
            this.toastr.error(
              'An error occurred while changing the password',
              'Error'
            );
          }
        );
    }
  }
}

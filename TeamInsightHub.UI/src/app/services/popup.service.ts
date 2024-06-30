import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from '../components/common/confirmation-popup/confirmation-popup.component';
import { firstValueFrom } from 'rxjs';
import { ChangePasswordPopupComponent } from '../components/common/change-password-popup/change-password-popup.component';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(private dialog: MatDialog) { }

  confrim(message: string): Promise<boolean> {
    const dialogRef: MatDialogRef<ConfirmationPopupComponent> = this.dialog.open(ConfirmationPopupComponent, {
      disableClose: true,
      width: '500px',
      data: { confirmationMessage: message }
    });
    return firstValueFrom(dialogRef.afterClosed());
  }

  changePasswordPopup() {
    const dialogRef: MatDialogRef<ChangePasswordPopupComponent> = this.dialog.open(ChangePasswordPopupComponent, {
      disableClose: true,
      width: '500px',
      data: {}
    });
    return firstValueFrom(dialogRef.afterClosed());
  }
}

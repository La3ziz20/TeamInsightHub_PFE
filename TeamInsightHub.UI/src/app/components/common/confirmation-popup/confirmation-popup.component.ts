import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.scss']
})
export class ConfirmationPopupComponent {
  message!: string;


  constructor(@Inject(MAT_DIALOG_DATA) private data: Record<string, string>,
    private dialogRef: MatDialogRef<ConfirmationPopupComponent>) {
    this.message = data['confirmationMessage'];

  }

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }

}

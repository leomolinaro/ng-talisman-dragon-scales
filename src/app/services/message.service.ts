import { Observable } from 'rxjs/Observable';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Injectable, Component, Inject } from '@angular/core';

@Injectable()
export class MessageService {

  constructor (private dialog: MatDialog) { }

  public alert (message: string, tokenSource: string) {
    this.dialog.open (MessageDialog, { width: "400px", data: { message: message, tokenSource: tokenSource } });
  } // alert

  public confirm (message: string, tokenSource: string, confirm: string): Observable<boolean> {
    let dialogRef = this.dialog.open (MessageDialog, { width: "400px", data: { message: message, tokenSource: tokenSource, confirm: confirm } });
    return dialogRef.afterClosed ();
  } // alert

}

@Component({
  selector: 'message-dialog',
  templateUrl: 'message-dialog.html',
})
export class MessageDialog {

  tokenSource: string;
  message: string;
  confirm: string;

  constructor (public dialogRef: MatDialogRef<MessageDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.tokenSource = data.tokenSource;
    this.message = data.message;
    this.confirm = data.confirm;
  } // constructor

} // MessageDialog
import { Component, OnInit } from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

@Component({
  selector: 'app-notify-popup',
  templateUrl: './notify-popup.component.html',
  styleUrls: ['./notify-popup.component.css']
})
export class NotifyPopupComponent implements OnInit {

  durationInSeconds = 5;

  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar() {
    const config = new MatSnackBarConfig();
    config.panelClass = ['custom-class'];
    this._snackBar.openFromComponent(notifypopupcomponent, {
      duration: this.durationInSeconds * 1000,
    });
  }


  ngOnInit() {
  }

}

@Component({
  selector: 'snack-bar-component-example-snack',
  templateUrl: 'notify-popup-show.html',
  styles: [`
    .example-pizza-party {
        color: hotpink;
    }
  `],
})

export class notifypopupcomponent {

}

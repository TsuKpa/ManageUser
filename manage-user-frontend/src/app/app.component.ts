import { Component } from '@angular/core';
import {AuthenticationService} from "./authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Manage User Application';
  constructor(public auth: AuthenticationService, private router: Router) {}

  profile() {
    this.router.navigate(['details', this.auth.getUserDetails()._id]);
  }
}

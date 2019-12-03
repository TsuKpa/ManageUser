import { Component, OnInit } from '@angular/core';
import {User} from "../user";
import {FormControl, Validators} from "@angular/forms";
import {UserService} from "../user.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../authentication.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: User = new User();
  submitted = false;
  confirmpasswords = false;
  repassword: string;
  private notice = false;

  constructor(private userService: UserService,
              private router: Router, public auth: AuthenticationService) { }

  ngOnInit() {
  }

  onSubmit() {
    if (this.user.password==this.repassword){
      this.confirmpasswords = false;
      this.submitted = true;
      this.user.role = '5db65e50467ad955560a7981';
      this.userService.registerUser(this.user).subscribe(result => {
          console.log(this.user);
          console.log(result);
          this.notice = true;
      },error => {
        console.log(error);
      });
    }
    else {
      this.confirmpasswords = true;
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import {Router} from "@angular/router";
import {FormControl, Validators} from "@angular/forms";
import {UserService} from "../user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  pwdFormControl = new FormControl('', [
    Validators.required,
  ]);

  user: TokenPayload = {
    email: '',
    password: ''
  };

  pwdWrong: boolean;
  userWrong: false;
  isLock: boolean;


  constructor(private auth: AuthenticationService, private router: Router,
  private userService: UserService) { }

  ngOnInit() {
  }

  login() {
    if (this.user.email !== '' && this.user.password !== ''){
      this.auth.login(this.user).subscribe((user) => {
        var id = this.auth.getUserDetails()._id;
        this.userService.getUser(id).subscribe(user => {
          if (user.status == false){
            this.isLock = true;
            this.auth.logout();
            setTimeout( () => {
              this.isLock = false;
            }, 5000);
          }
          else {
            this.router.navigateByUrl('/users');
          }
        });
      }, (err) => {
        if (err.error.message == 'Password is wrong'){
          this.pwdWrong = true;
          setTimeout( () => {
            this.pwdWrong = false;
          }, 5000);
        }
        else if (err.error.message == 'User not found'){
          // @ts-ignore
          this.userWrong = true;
          setTimeout( () => {
            this.userWrong = false;
          }, 5000);
        }
        else console.log(err);
      });
    }
  }

  register() {
    this.router.navigateByUrl('/register');
  }
}

import {UserService} from '../user.service';
import {User} from '../user';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Role} from "../role";
import {Functions} from "../functions";
import {RoleService} from '../role.service';
import {FunctionsService} from '../functions.service';
import {AuthenticationService} from "../authentication.service";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  user: User = new User();
  submitted = false;
  roles: Role[];
  fn: Functions[];
  selected: string[];
  private emailWrong: false;
  private emsg: false;
  private isAdmin: boolean = false;

  constructor(private userService: UserService,
              private router: Router, public auth: AuthenticationService,
              private RoleService: RoleService, private fnService: FunctionsService,
              private FunctionsService: FunctionsService) {
  }

  ngOnInit() {
    this.roles = [];
    this.fn = [];
    this.selected = [];

    this.check('add').then(value => {
      if (value==true){
        this.RoleService.getRole(this.auth.getUserDetails().role).subscribe(role => {
          if (role.name == 'admin') {
            this.isAdmin = true;
            this.RoleService.getRolesList().subscribe(roles => {
              for (const r of roles) {
                if (containsObject(r.name, this.roles) == false) {
                  this.roles.push(r);
                }
              }
            });
          }
        });
      }
      else {
        this.router.navigate(['/users']);
      }
    });


  }

  check(fn): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.userService.getUser(this.auth.getUserDetails()._id).subscribe(user => {
        for (let i = 0; i < user.functions.length; i++) {
          this.fnService.getFunction(user.functions[i]).subscribe(f => {
            if (f.description === fn) {
              resolve(true);
            } else if (i == user.functions.length - 1) {
              resolve(false);
            }
          });
        }
      });
    });
  }

  save() {
    this.userService.createUser(this.user)
      .subscribe(data => {
          this.user = new User();
          this.gotoList();
        }, error => {
          if (error.error.message == 'User validation failed: email: is already taken.') {
            // @ts-ignore
            this.emailWrong = true;
            setTimeout(() => {
              this.emailWrong = false;
            }, 5000);
          } else {
            // @ts-ignore
            this.emsg = true;
            setTimeout(() => {
              this.emsg = false;
            }, 5000);
          }
        }
      );
  }

  onSubmit() {
    this.submitted = true;
    this.save();
  }

  gotoList() {
    this.router.navigate(['/users']);
  }

  modelChanged(id) {
    this.fn = [];
    this.RoleService.getRole(id)
      .subscribe(f => {
        this.user.functions = f.listFunction;
        for (var i of this.user.functions) {
          this.FunctionsService.getFunction(i).subscribe(fs => {
            this.fn.push(fs);
          });
        }
      }, error => console.log(error));
  }
}

function containsObject(name, list) {
  var i;
  for (i = 0; i < list.length; i++) {
    if (list[i].name === name) {
      return true;
    }
  }

  return false;
}

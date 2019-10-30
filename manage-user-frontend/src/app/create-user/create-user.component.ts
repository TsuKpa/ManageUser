import {UserService} from '../user.service';
import {User} from '../user';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Role} from "../role";
import {Functions} from "../functions";
import {RoleService} from '../role.service';
import {FunctionsService} from '../functions.service';

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

  constructor(private userService: UserService,
              private router: Router,
              private RoleService: RoleService,
              private FunctionsService: FunctionsService) {
  }

  ngOnInit() {
    this.roles = new Array();
    this.fn = new Array();
    this.selected = new Array();
    this.RoleService.getRolesList().subscribe(roles => {
      for (const r of roles) {
        if (containsObject(r.name, this.roles) == false) {
          this.roles.push(r);
        }
        ;
      }
    });
  }

  save() {
    this.userService.createUser(this.user)
      .subscribe(data => {
          this.user = new User();
          this.gotoList();
        }, error => {
          if (error.error.message == 'User validation failed: email: is already taken.'){
            // @ts-ignore
            this.emailWrong = true;
            setTimeout( () => {
              this.emailWrong = false;
            }, 5000);
          }
          else {
            // @ts-ignore
            this.emsg = true;
            setTimeout( () => {
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
        for (var i of this.user.functions){
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

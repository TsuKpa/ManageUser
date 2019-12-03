import { Component, OnInit } from '@angular/core';
import {User} from "../user";
import {UserService} from "../user.service";
import {ActivatedRoute, Router} from "@angular/router";
import { RoleService } from '../role.service';
import { FunctionsService } from '../functions.service';
import {Role} from "../role";
import {Functions} from "../functions";
import {AuthenticationService} from "../authentication.service";


@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  id: string;
  user: User = new User();
  submitted = false;
  roles: Role[];
  fn: Functions[];
  selected: string[];
  isAdmin: boolean = true;

  constructor(private route: ActivatedRoute, private userService: UserService,
              private router: Router, public auth: AuthenticationService,
              private RoleService: RoleService,
              private FunctionsService: FunctionsService) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.user = new User();
    this.roles = [];
    this.fn = [];
    this.selected = [];

    this.check('edit').then(value => {
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
        this.router.navigate(['details', this.auth.getUserDetails()._id]);
      }
    });


    this.userService.getUser(this.id)
      .subscribe(data => {
        this.user = data;
        for (var i of this.user.functions){
          this.FunctionsService.getFunction(i).subscribe(fs => {
            this.fn.push(fs);
          });
        }
        this.RoleService.getRole(this.user.role)
          .subscribe(role => {
            if (role.name!=='admin'){
              this.isAdmin = false;
            }
          }, error => console.log(error));
      }, error => console.log(error));

    this.RoleService.getRolesList().subscribe(roles => {
      for (const r of roles){
        if(containsObject(r.name, this.roles)==false){
          this.roles.push(r);
        }
      }
    });
  }

  check(fn): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.userService.getUser(this.auth.getUserDetails()._id).subscribe(user => {
        for (let i = 0; i < user.functions.length; i++) {
          this.FunctionsService.getFunction(user.functions[i]).subscribe(f => {
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
    this.userService.updateUser(this.id, this.user)
      .subscribe(error => console.log(error));
    //this.user = new User();
    this.router.navigate(['details', this.id]);
  }

  onSubmit() {
    this.submitted = true;
    this.save();
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

  addOrRemoveFunction(value: string) {
    //console.log(value);
    var i = this.user.functions.indexOf(value);
    if (i>-1){
      this.user.functions.splice(i, 1);
    }
    else {
      this.user.functions.push(value);
    }
    //console.log(this.user.functions);
  }

  checked(_id: string, functions: string[]) {
    var a = this.user.functions.indexOf(String(_id));
    if(a==-1){
      return false;
    }
    return true;
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

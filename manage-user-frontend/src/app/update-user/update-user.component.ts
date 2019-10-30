import { Component, OnInit } from '@angular/core';
import {User} from "../user";
import {UserService} from "../user.service";
import {ActivatedRoute, Router} from "@angular/router";
import { RoleService } from '../role.service';
import { FunctionsService } from '../functions.service';
import {Role} from "../role";
import {Functions} from "../functions";


@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {
  id: number;
  user: User = new User();
  submitted = false;
  roles: Role[];
  fn: Functions[];
  selected: string[];

  constructor(private route: ActivatedRoute, private userService: UserService,
              private router: Router,
              private RoleService: RoleService,
              private FunctionsService: FunctionsService) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.user = new User();
    this.roles = new Array();
    this.fn = new Array();
    this.selected = new Array();
    this.userService.getUser(this.id)
      .subscribe(data => {
        this.user = data;
        for (var i of this.user.functions){
          this.FunctionsService.getFunction(i).subscribe(fs => {
            this.fn.push(fs);
          });
        }
      }, error => console.log(error));

    this.RoleService.getRolesList().subscribe(roles => {
      for (const r of roles){
        if(containsObject(r.name, this.roles)==false){
          this.roles.push(r);
        };
      }
    });
  }


  save() {
    this.userService.updateUser(this.id, this.user)
      .subscribe(error => console.log(error));
    this.user = new User();
    this.gotoList();
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

import { User } from '../user';
import { Role } from '../role';
import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../user.service';
import { RoleService } from '../role.service';
import { FunctionsService } from '../functions.service';
import { Router, ActivatedRoute } from '@angular/router';
import {AuthenticationService} from "../authentication.service";



@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  id: string;
  user: User;
  role: Role;
  fn: string[];

  constructor(private route: ActivatedRoute,private router: Router,
    private userService: UserService, private auth: AuthenticationService,
    private RoleService: RoleService,
    private FunctionsService: FunctionsService
    ) { }

  ngOnInit() {
    this.user = new User();
    this.role = new Role();
    this.fn = [];

    this.id = this.route.snapshot.params['id'];

    this.check('view').then(value => {
      if (value==true){
        this.userService.getUser(this.id)
          .subscribe(data => {
            this.user = data;
            this.RoleService.getRole(this.user.role)
              .subscribe(role => {
                this.role = role;
              }, error => console.log(error));
            for (const func of this.user.functions)
            {
              this.FunctionsService.getFunction(func)
                .subscribe(f => {
                  this.fn.push(f.description);
                }, error => console.log(error));
            }
          }, error => console.log(error));
      }
      else {
        this.list();
      }
    });


  }

  update(){
    this.id = this.route.snapshot.params['id'];
    this.router.navigate(['update', this.id]);
  }

  list(){
    this.router.navigate(['users']);
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
}

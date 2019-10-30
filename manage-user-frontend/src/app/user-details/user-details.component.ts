import { User } from '../user';
import { Role } from '../role';
import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../user.service';
import { RoleService } from '../role.service';
import { FunctionsService } from '../functions.service';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  id: number;
  user: User;
  role: Role;
  fn: string[];

  constructor(private route: ActivatedRoute,private router: Router,
    private userService: UserService,
    private RoleService: RoleService,
    private FunctionsService: FunctionsService
    ) { }

  ngOnInit() {
    this.user = new User();
    this.role = new Role();
    this.fn = new Array();

    this.id = this.route.snapshot.params['id'];

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
              this.fn.push(f.codef);
            }, error => console.log(error));
        }
      }, error => console.log(error));
  }

  update(){
    this.id = this.route.snapshot.params['id'];
    this.router.navigate(['update', this.id]);
  }

  list(){
    this.router.navigate(['users']);
  }
}

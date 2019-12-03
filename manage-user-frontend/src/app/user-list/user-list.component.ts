import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';

import {UserService} from "../user.service";
import {User} from "../user";
import {Router} from '@angular/router';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RoleService} from "../role.service";
import {AuthenticationService} from "../authentication.service";
import {FunctionsService} from "../functions.service";


@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.css"]
})
export class UserListComponent implements OnInit {
  users: User[];
  id: number;

  dataSource: MatTableDataSource<User>;

  constructor(private userService: UserService,
              public dialog: MatDialog, public auth: AuthenticationService,
              private router: Router, private fnService: FunctionsService,
              private roleService: RoleService) {
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  // @ts-ignore
  @ViewChild('filter') filter: ElementRef;

  displayedColumns: string[] = ['id', 'email', 'role', 'status', 'avatar', 'btn'];

  ngOnInit() {
    this.roleService.getRole(this.auth.getUserDetails().role).subscribe(role => {
      if (role.name == 'admin') {
        this.getUserList();
      } else if (role.name == 'manager') {
        this.getNormalUserList();
      } else {
        this.router.navigate(['details', this.auth.getUserDetails()._id]);
      }
    });
  }

  applyFilter(filterValue: string) {
    // @ts-ignore
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getUserList(): void {
    this.userService.getUsersList()
      .subscribe((users) => {
        users.map(user => { //map user.role id to name
          this.roleService.getRole(user.role).subscribe(role => {
            user.role = role.name;
          });
        });
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  getNormalUserList(): void {
    this.userService.getNormalUsersList()
      .subscribe((users) => {
        users.map(user => { //map user.role id to name
          this.roleService.getRole(user.role).subscribe(role => {
            user.role = role.name;
          });
        });
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  deleteUser(id: string) {
    if (id == this.auth.getUserDetails()._id) {
      const dialogRef = this.dialog.open(NoticeDialogComponent, {
        width: '250px',
        data: {notice: "You can not delete yourself"}
      });
    } else {
      this.check('delete').then(value => {
        if (value == true) {
          const dialogRef = this.dialog.open(ExampleDialogComponent, {
            height: '230px',
            width: '350px',
            data: {index: id, action: 'delete'}
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result != undefined) {
              this.userService.deleteUser(id)
                .subscribe(
                  data => {
                    this.getUserList();
                  },
                  error => console.log(error));
            }
          });
        } else {
          const dialogRef = this.dialog.open(NoticeDialogComponent, {
            width: '250px',
            data: {data: "Delete"}
          });
        }
      });
    }
  }

  userDetails(id: number) {
    this.check('view').then(value => {
      if (value == true) {
        this.router.navigate(['details', id]);
      } else {
        const dialogRef = this.dialog.open(NoticeDialogComponent, {
          width: '250px',
          data: {data: "View"}
        });
      }
    });
  }

  Edit(_id: number) {
    this.check('edit').then(value => {
      if (value == true) {
        this.router.navigate(['update', _id]);
      } else {
        const dialogRef = this.dialog.open(NoticeDialogComponent, {
          width: '250px',
          data: {data: "Edit"}
        });
      }
    });
  }

  activate($event: boolean, _id: string, user: User) {
      this.check('deactive').then(value => {
        if (value == true) {
          const dialogRef = this.dialog.open(ExampleDialogComponent, {
            height: '230px',
            width: '350px',
            data: {index: _id, action: 'change status'}
          });

          dialogRef.afterClosed().subscribe(result => {
            if (result != undefined) {
              this.userService.getUser(_id).subscribe(u => {
                user.role = u.role;
                this.userService.updateUser(result, user)
                  .subscribe(
                    data => {
                      if (_id == this.auth.getUserDetails()._id) {
                        const dialogRef = this.dialog.open(NoticeDialogComponent, {
                          width: '250px',
                          data: {notice: "You deactive yourself. You will be logout now!"}
                        });
                        dialogRef.afterClosed().subscribe(result => {
                          this.auth.logout();
                        });
                      } else {
                        this.roleService.getRole(this.auth.getUserDetails().role).subscribe(role => {
                          if (role.name == 'admin') {
                            this.getUserList();
                          } else if (role.name == 'manager') {
                            this.getNormalUserList();
                          } else {
                            this.router.navigate(['details', this.auth.getUserDetails()._id]);
                          }
                        });
                      }
                    },
                    error => console.log(error));
              });
            }
            //console.log(result, user);
          });
        } else {
          const dialogRef = this.dialog.open(NoticeDialogComponent, {
            width: '250px',
            data: {data: "Activate"}
          });
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
}


@Component({
  selector: 'notice-dialog',
  templateUrl: 'notice-dialog.html',
})

export class NoticeDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<NoticeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})

export class ExampleDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ExampleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

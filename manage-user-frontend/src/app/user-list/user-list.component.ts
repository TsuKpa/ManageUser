import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';

import {UserService} from "../user.service";
import {User} from "../user";
import {Router} from '@angular/router';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RoleService} from "../role.service";


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
              public dialog: MatDialog,
              private router: Router,
              private roleService: RoleService) {
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  // @ts-ignore
  @ViewChild('filter') filter: ElementRef;

  displayedColumns: string[] = ['id', 'email', 'role', 'status', 'avatar', 'btn'];

  ngOnInit() {
    this.getUserList();
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
          this.roleService.getRole(user.role).subscribe(role =>{
            user.role = role.name;
          });
        });
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  deleteUser(id: number, email: string) {
    const dialogRef = this.dialog.open(ExampleDialogComponent, {
      width: '250px',
      data: {index: id, email: email}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined){
        this.userService.deleteUser(id)
          .subscribe(
            data => {
              this.getUserList();
            },
            error => console.log(error));
      }
    });
  }

  userDetails(id: number) {
    this.router.navigate(['details', id]);
  }

  Edit(_id: number) {
    this.router.navigate(['update', _id]);
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
    private userService: UserService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

import { UserDetailsComponent } from './user-details/user-details.component';
import { CreateUserComponent } from './create-user/create-user.component';
import {Component, NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UpdateUserComponent } from "./update-user/update-user.component";
import {AuthGuardService} from "./auth-guard.service";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'users', component: UserListComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'add', component: CreateUserComponent, canActivate: [AuthGuardService] },
  { path: 'details/:id', component: UserDetailsComponent, canActivate: [AuthGuardService]},
  { path: 'update/:id', component: UpdateUserComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

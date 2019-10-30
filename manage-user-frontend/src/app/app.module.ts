import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import {ExampleDialogComponent, UserListComponent} from './user-list/user-list.component';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { UpdateUserComponent } from './update-user/update-user.component';
import {notifypopupcomponent, NotifyPopupComponent} from './notify-popup/notify-popup.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSortModule} from "@angular/material/sort";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import { LoginComponent } from './login/login.component';
import {AuthenticationService} from "./authentication.service";
import {AuthGuardService} from "./auth-guard.service";
import {MatMenuModule} from "@angular/material/menu";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatCheckboxModule} from "@angular/material/checkbox";

@NgModule({
  declarations: [
    AppComponent,
    CreateUserComponent,
    UserDetailsComponent,
    UserListComponent,
    UpdateUserComponent,
    NotifyPopupComponent,
    notifypopupcomponent,
    ExampleDialogComponent,
    LoginComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MatSnackBarModule,
    AppRoutingModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatCheckboxModule
  ],
  entryComponents: [NotifyPopupComponent, notifypopupcomponent, ExampleDialogComponent],
  providers: [AuthenticationService, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }

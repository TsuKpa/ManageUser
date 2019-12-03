import { Injectable } from '@angular/core';
import { CanActivate, Router} from "@angular/router";
import {AuthenticationService} from "./authentication.service";

@Injectable()
export class PermissionService implements CanActivate{

  constructor(private auth: AuthenticationService, private router: Router) { }

  canActivate(){
    return undefined;
  }
}

import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate } from "@angular/router";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(protected auth: AuthService) { }

  canActivate() {
    if (this.auth.authenticated())
      return true; 
    
    this.auth.login();
    return false; 
  }
}

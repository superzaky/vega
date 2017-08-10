﻿import { AuthGuard } from './auth-gaurd.service';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AdminAuthGuard extends AuthGuard {

    constructor(auth: AuthService) {
        super(auth);
    }

    canActivate() {
        var isAuthenticated = super.canActivate();

        return isAuthenticated ? this.auth.isInRole('Admin') : false;
    }
}

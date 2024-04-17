import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';
import jwtDecode from 'jwt-decode';

import { GlobalConstants } from '../shared/global-constants';

@Injectable({
  providedIn: 'root',
})
export class RouteGuardService implements CanActivate {
  constructor(
    public auth: AuthService,
    public router: Router,
    private snackbarService: SnackbarService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let expectedRoleArray = route.data;
    expectedRoleArray = expectedRoleArray.expectedRole;
    const token: any = localStorage.getItem('token');
    console.log(token);
    let tokenPayload: any;
    try {
      tokenPayload = jwtDecode(token); // Change function call to use jwtDecode directly
    } catch (error) {
      localStorage.clear();
      this.router.navigate(['/']);
      return false;
    }
    let checkRole = false;
    for (let i = 0; i < expectedRoleArray.length; i++) {
      if (expectedRoleArray[i] == tokenPayload.role) {
        checkRole = true;
        break;
      }
    }
    if (tokenPayload.role == 'user' || tokenPayload.role == 'admin') {
      if (this.auth.isAuthenticated() && checkRole) {
        return true;
      }
      this.snackbarService.openSnackBar(
        GlobalConstants.unauthorized,
        GlobalConstants.error
      );
      this.router.navigate(['/cafe/dashboard']);
      return false;
    } else {
      this.router.navigate(['/']);
      localStorage.clear();
      return false;
    }
  }
}

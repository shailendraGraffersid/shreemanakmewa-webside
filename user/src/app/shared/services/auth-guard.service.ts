import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthGuardService {

  constructor(private authenticationService: AuthenticationService, private _router: Router) { }

  /*Check Routing states*/
  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (state.url === '/home/dashboard' || state.url === "/settings/profile"|| state.url === "/admin/categories-list"|| state.url === "/admin/product-variants-list"|| state.url === "/admin/products-list") {
      
      if (this.isLoggedIn()) {
        if(this.authenticationService.currentUserValue)
        {let role = this.authenticationService.currentUserValue.role
        if (role === "admin") {
          return true;
        }}
        // if (role === "user") {
        //   this._router.navigate(["user"]);
        //   return true;
        // }

      }
      else{
        this._router.navigate(["/auth/login"]);
        return true;
      }
    } 
    if(state.url === '/auth/login'){
      if (this.isLoggedIn()) {
        this._router.navigate(["/home/dashboard"]);
      }
      else{
        // this._router.navigate(["/auth/login"]);
        return true;
      }
    }
    // else {
    //   if (this.isLoggedIn()) {
    //     return true;
    //   } else {
    //     if (state.url === '/auth/login') {
    //       this._router.navigate(["auth/login"]);
    //       return true;
    //     } else if (route.routeConfig.path === "auth/login") {
    //       this._router.navigate([state.url]);
    //       return true;
    //     }
    //   }
    // }
    return true;
  }

  /*Check user is authorized or not*/
  isLoggedIn(): boolean {
    if (this.authenticationService.currentUserValue) {
      let token = this.authenticationService.currentUserValue.token
      let role = this.authenticationService.currentUserValue.role
      if (token && (role === "admin" || role === "user")) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

}

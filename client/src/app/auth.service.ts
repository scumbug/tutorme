import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Cred } from './model.interface';

@Injectable()
export class AuthService {
  private token = '';
  private role;
  private id;
  constructor(private http: HttpClient, private router: Router) {}

  async login(credentials: Cred): Promise<boolean> {
    try {
      const res = await this.http
        .post<any>('/v1/login', credentials, { observe: 'response' })
        .toPromise();
      if (res.status == 200) {
        this.token = res.body.token;
        this.role = res.body.role;
        this.id = res.body.id;
        return true;
      }
    } catch (error) {
      return false;
    }
  }

  isLogin() {
    return this.token != '';
  }

  isAdmin() {
    return this.role == 2;
  }

  getToken() {
    return this.token;
  }

  getID() {
    return this.id;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.isLogin()) return true;
    return this.router.navigate(['/login']);
  }
}

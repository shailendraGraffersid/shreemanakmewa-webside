import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    public currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;
    private apidomain = `${environment.baseURL}`;

    constructor(private http: HttpClient, private router: Router) {
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): any {
        return this.currentUserSubject.value;
    }

    register(body) {
        let Url = this.apidomain + '/users';
        return this.http.post<any>(Url, body);
    }

    login(body) {
        let headers = new HttpHeaders()
        headers = headers.append('content-type', 'application/json')
        let Url = this.apidomain + '/users/login';
        return this.http.post<any>(Url, body, { 'headers': headers })
            .pipe(map(user => {
                // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
                // user.authdata = window.btoa(username + ':' + password);
                if(user['user']){
                let userData = {
                    id: user['user'].id,
                    userName: user['user'].username,
                    email: user['user'].email,
                    token: user['user'].token,
                    role: user['user'].role ? "admin" : "user",
                    // profilePicture: user.user_image
                }
                localStorage.setItem('currentUser', JSON.stringify(userData));
                
                this.currentUserSubject.next(userData);
            }
                return user;
            }));
    }

    logout() {
        let headers = new HttpHeaders()
        headers = headers.append('content-type', 'application/json')
        // headers = headers.append('access-token', this.currentUserValue.token);
        // let Url = this.apidomain + url
        // return this.http.get<any>(Url, { 'headers': headers })
            // .pipe(map(user => {
                localStorage.removeItem('currentUser');
                this.currentUserSubject.next(null);
                this.router.navigate(['/auth/login']);
                // return user;
            // }));
    }

    unauthorizedUserLogout() {

        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
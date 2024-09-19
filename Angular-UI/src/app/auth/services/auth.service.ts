import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User, AuthStatus, LoginResponse } from '../interfaces';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http: HttpClient = inject(HttpClient);
  private readonly baseUrl: string = environment.baseUrl;

  private _currentUser = signal<User | null>(null);
  private _authStatus  = signal<AuthStatus>(AuthStatus.checking);

  public currentUser = computed( () => this._currentUser );
  public authStatus  = computed( () => this._authStatus  );

  public login( email: string, password: string): Observable<boolean> {
    const url: string = `${this.baseUrl}/auth/login`;
    const body = { email, password };
    return this.http.post<LoginResponse>(url, body).pipe(
      tap( ({ user, token }) => {
        this._currentUser.set(user);
        this._authStatus.set(AuthStatus.authenticated);
        localStorage.setItem('token', token);
      }),
      map( () => true ),
      catchError( err => throwError( () => err.error.message)
    ));
  }
}
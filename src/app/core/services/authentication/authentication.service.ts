import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRegister, UserResponse } from '../../interfaces/user.interface';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { catchError, map, of } from 'rxjs';
const BASE_URL = environment.apiUrl;
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  registerUser(userData: UserRegister): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${BASE_URL}/register`, userData);
  }
  loginUser(email: string, password: string): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${BASE_URL}/login`, {
      email,
      password,
    });
  }
  logout(): Observable<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.clear();
      return new Observable((observer) => {
        observer.next();
        observer.complete();
      });
    }

    return new Observable((observer) => {
      this.http
        .post(
          `${BASE_URL}/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .subscribe({
          next: () => {
            console.log('Déconnexion réussie');
            localStorage.clear();
            observer.next();
            observer.complete();
          },
          error: (error) => {
            console.error('Erreur de déconnexion', error);
            observer.error(error);
          },
        });
    });
  }

  isAuthenticated(): Observable<boolean> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .get<{ authenticated: boolean }>(`${BASE_URL}/is-authenticated`, {
        headers,
      })
      .pipe(
        map((response) => response.authenticated),
        catchError((error: HttpErrorResponse) => {
          // Si erreur 401 ou autre => non authentifié
          return of(false);
        })
      );
  }
}

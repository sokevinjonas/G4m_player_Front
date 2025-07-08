import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRegister, UserResponse } from '../../interfaces/user.interface';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
const BASE_URL = environment.apiUrl;
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject = new BehaviorSubject<UserResponse | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialUser();
  }

  private loadInitialUser() {
    const token = localStorage.getItem('token');
    if (token) {
      this.getUserProfile().subscribe();
    }
  }

  registerUser(userData: UserRegister): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${BASE_URL}/register`, userData);
  }
  loginUser(email: string, password: string): Observable<UserResponse> {
    return this.http
      .post<UserResponse>(`${BASE_URL}/login`, { email, password })
      .pipe(
        tap((user) => {
          localStorage.setItem('token', user.token);
          this.currentUserSubject.next(user);
        })
      );
  }
  logout(): Observable<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.clear();
      this.currentUserSubject.next(null);
      return of(undefined);
    }

    return this.http.post(`${BASE_URL}/logout`, {}).pipe(
      tap(() => {
        localStorage.clear();
        this.currentUserSubject.next(null);
      }),
      map(() => undefined),
      catchError((error) => {
        console.error('Logout error', error);
        localStorage.clear();
        this.currentUserSubject.next(null);
        return of(undefined);
      })
    );
  }
  getUserProfile(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${BASE_URL}/user`).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
      })
    );
  }

  searchUsers(query: string): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${BASE_URL}/users/search?q=${query}`);
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser.pipe(map((user) => !!user));
  }
}

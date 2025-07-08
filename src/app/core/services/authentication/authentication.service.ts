import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  User,
  UserRegister,
  UserResponse,
} from '../../interfaces/user.interface';

const BASE_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.isAuthenticated;
  }

  registerUser(userData: UserRegister): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${BASE_URL}/register`, userData);
  }

  loginUser(email: string, password: string): Observable<UserResponse> {
    return this.http
      .post<UserResponse>(`${BASE_URL}/login`, { email, password })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user)); // Sauvegarder l'utilisateur
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout(): Observable<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);

    // L'appel au backend est optionnel mais recommandé
    return this.http.post<void>(`${BASE_URL}/logout`, {}).pipe(
      catchError(() => of(undefined)) // Gérer les erreurs si le serveur est inaccessible
    );
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${BASE_URL}/user`).pipe(
      tap((user) => {
        localStorage.setItem('user', JSON.stringify(user)); // Mettre à jour l'utilisateur
        this.currentUserSubject.next(user);
      })
    );
  }

  isAuthenticated(): boolean {
    // Vérification synchrone pour les gardes de route
    return !!localStorage.getItem('token');
  }
}

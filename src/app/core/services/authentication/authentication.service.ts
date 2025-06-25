import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRegister, UserResponse } from '../../interfaces/user.interface';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
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
}

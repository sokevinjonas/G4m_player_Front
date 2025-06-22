import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const BASE_URL = environment.apiUrl;
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // --- COMPETITIONS ---
  getCompetitions(): Observable<any> {
    return this.http.get(`${BASE_URL}/competitions`);
  }

  getCompetition(id: number): Observable<any> {
    return this.http.get(`${BASE_URL}/competitions/${id}`);
  }

  registerToCompetition(id: number, userData: any): Observable<any> {
    return this.http.post(`${BASE_URL}/competitions/${id}/register`, userData);
  }

  getCompetitionPlayers(id: number): Observable<any> {
    return this.http.get(`${BASE_URL}/competitions/${id}/players`);
  }

  // --- GAMES ---
  getGames(): Observable<any> {
    return this.http.get(`${BASE_URL}/games`);
  }

  getGame(id: number): Observable<any> {
    return this.http.get(`${BASE_URL}/games/${id}`);
  }

  // --- BADGES ---
  getBadges(): Observable<any> {
    return this.http.get(`${BASE_URL}/badges`);
  }

  getBadge(id: number): Observable<any> {
    return this.http.get(`${BASE_URL}/badges/${id}`);
  }
}

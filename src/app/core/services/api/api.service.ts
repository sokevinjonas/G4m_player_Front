import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const BASE_URL = environment.apiUrl;
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // --- USER ---

  updateUserProfile(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    // Ajouter _method pour simuler PUT avec POST (meilleur pour les fichiers)
    formData.append('_method', 'PUT');
    return this.http.post(`${BASE_URL}/userUpdate`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // --- FILLEULS ---
  getFilleuls(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${BASE_URL}/myFilleuls`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // --- COMPETITIONS ---
  getCompetitions(): Observable<any> {
    return this.http.get(`${BASE_URL}/competitions`);
  }

  getCompetition(id: number): Observable<any> {
    return this.http.get(`${BASE_URL}/competitions/${id}`);
  }

  getCompetitionPlayers(id: number): Observable<any> {
    return this.http.get(`${BASE_URL}/competitions/${id}/players`);
  }

  getCompetitionsCountAllEnable(): Observable<any> {
    return this.http.get(`${BASE_URL}/countAllEnabledCompetitions`);
  }

  getCompetitionsCount(): Observable<any> {
    return this.http.get(`${BASE_URL}/countCompetitionsUser`);
  }

  getCompetitionsPoints(): Observable<any> {
    return this.http.get(`${BASE_URL}/pointsCompetitionsUser`);
  }

  // --- GAMES ---
  getGames(): Observable<any> {
    return this.http.get(`${BASE_URL}/games`);
  }

  getGame(id: number): Observable<any> {
    return this.http.get(`${BASE_URL}/games/${id}`);
  }

  getGamesCountAll(): Observable<any> {
    return this.http.get(`${BASE_URL}/countAllGame`);
  }
}

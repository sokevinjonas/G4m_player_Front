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

  registerToCompetition(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${BASE_URL}/registerToCompetition?competition_id=${id}`;
    return this.http.post(url, {}, { headers });
  }
  // unregisterToCompetition
  unregisterToCompetition(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${BASE_URL}/unregisterToCompetition?competition_id=${id}`;
    return this.http.post(url, {}, { headers });
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

  checkExistingParticipation(competitionId: number) {
    const token = localStorage.getItem('token');
    return this.http.get(
      `${BASE_URL}/checkExistingParticipate?competition_id=${competitionId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
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

  // --- BADGES ---
  getBadges(): Observable<any> {
    return this.http.get(`${BASE_URL}/badges`);
  }

  getBadge(id: number): Observable<any> {
    return this.http.get(`${BASE_URL}/badges/${id}`);
  }

  getBadgesCount(): Observable<any> {
    return this.http.get(`${BASE_URL}/countUsersBadge`);
  }

  // Nouveaux endpoints pour les badges verrouillés/déverrouillés d'un utilisateur
  getUserBadgesLocked(userId: number): Observable<any> {
    return this.http.get(`${BASE_URL}/LoadUsersBadgeLocked/${userId}`);
  }

  getUserBadgesUnLocked(userId: number): Observable<any> {
    return this.http.get(`${BASE_URL}/LoadUsersBadgeUnLocked/${userId}`);
  }
}

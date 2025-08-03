import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../interfaces/user.interface';

const BASE_URL = environment.apiUrl;
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // private apiUrl = environment.apiUrl;

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
  searchUsers(query: string): Observable<User[]> {
    const token = localStorage.getItem('token');
    return this.http.get<User[]>(`${BASE_URL}/userSearch?q=${query}`, {
      headers: { Authorization: `Bearer ${token}` },
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

  teamByCompetition(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${BASE_URL}/teams-by-competition/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
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

  // --- TEAMS ---
  checkTeamRegistrationStatus(competitionId: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(
      `${BASE_URL}/check-team-registration/${competitionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  createTeamAndParticipate(
    competitionId: string,
    teamData: any
  ): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post<any>(
      `${BASE_URL}/participate/${competitionId}`,
      teamData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  inviteToTeam(teamId: string, userId: string): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/api/teams/${teamId}/invitation`, {
      userId,
    });
  }

  // --- MATCHES ---
  getMatches(params?: {
    competition_id?: number;
    status?: string;
    phase?: string;
    search?: string;
    page?: number;
  }): Observable<any> {
    let url = `${BASE_URL}/matches`;

    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }

    return this.http.get<any>(url);
  }
}

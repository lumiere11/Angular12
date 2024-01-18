import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionModel } from '@core/models/session.model';
import { Observable } from 'rxjs';
import { enviroment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly URL = enviroment.api;
  constructor(private httpClient: HttpClient) {}

  sendCredentials(email: string, password: string) : Observable<any> {
    return this.httpClient.post<SessionModel>(`${this.URL}/auth/login`, {
      email,
      password,
    })
  }
}

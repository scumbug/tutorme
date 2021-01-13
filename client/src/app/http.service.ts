import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Title, User } from './model.interface';

@Injectable()
export class HttpService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${this.auth.getToken()}`
  );

  async getTitles(): Promise<Title[]> {
    return await this.http
      .get<any>('/v1/subjects', { headers: this.headers })
      .toPromise();
  }

  async getTutees(): Promise<User[]> {
    return await this.http
      .get<any>('/v1/users', { headers: this.headers })
      .toPromise();
  }

  async getLessonFeed(start, end) {
    const params = new HttpParams().set('start', start).set('end', end);
    return await this.http
      .get<any>('/v1/lessons', { headers: this.headers, params })
      .toPromise();
  }

  async addLesson(payload) {
    return await this.http
      .post<any>('/v1/lessons', payload, {
        headers: this.headers,
        observe: 'response',
      })
      .toPromise();
  }

  async updateLesson(id, payload): Promise<any> {
    return await this.http
      .put<any>(`/v1/lessons/${id}`, payload, {
        headers: this.headers,
        observe: 'response',
      })
      .toPromise();
  }

  async deleteLesson(id): Promise<any> {
    return await this.http
      .delete<any>(`/v1/lessons/${id}`, {
        headers: this.headers,
        observe: 'response',
      })
      .toPromise();
  }
}

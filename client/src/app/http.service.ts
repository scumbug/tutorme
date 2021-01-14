import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Subject, Title, User } from './model.interface';

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

  async getLessonFeed(start, end, id = null) {
    const params = new HttpParams()
      .set('start', start)
      .set('end', end)
      .set('id', id);
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
      .put<any>(
        `/v1/lessons/${id}`,
        { ...payload, id },
        {
          headers: this.headers,
          observe: 'response',
        }
      )
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

  async getSubjects(): Promise<Subject[]> {
    return await this.http
      .get<any>('/v1/subjects', { headers: this.headers })
      .toPromise();
  }

  async addSubjects(payload): Promise<any> {
    return await this.http
      .post<any>('/v1/subjects', payload, {
        headers: this.headers,
        observe: 'response',
      })
      .toPromise();
  }

  async updateSubject(id, payload): Promise<any> {
    return await this.http
      .put<any>(
        `/v1/subjects/${id}`,
        { ...payload, id },
        {
          headers: this.headers,
          observe: 'response',
        }
      )
      .toPromise();
  }

  async deleteSubject(id): Promise<any> {
    return await this.http
      .delete<any>(`/v1/subjects/${id}`, {
        headers: this.headers,
        observe: 'response',
      })
      .toPromise();
  }

  async getUser(id): Promise<any> {
    return await this.http
      .get<any>(`/v1/users/${id}`, {
        headers: this.headers,
      })
      .toPromise();
  }

  async updateUser(id, payload): Promise<any> {
    return await this.http
      .put<any>(
        `/v1/users/${id}`,
        { ...payload, id },
        {
          headers: this.headers,
          observe: 'response',
        }
      )
      .toPromise();
  }

  async addUser(payload): Promise<any> {
    return await this.http
      .post<any>('/v1/users', payload, {
        headers: this.headers,
        observe: 'response',
      })
      .toPromise();
  }

  async deleteUser(id): Promise<any> {
    return await this.http
      .delete<any>(`/v1/users/${id}`, {
        headers: this.headers,
        observe: 'response',
      })
      .toPromise();
  }

  async getMapsKey(): Promise<any> {
    return await this.http
      .get<any>('/v1/mapskey', { headers: this.headers })
      .toPromise();
  }

  async getQuestions(): Promise<any> {
    return await this.http
      .get<any>('/v1/questions', { headers: this.headers })
      .toPromise();
  }

  async addQuestions(payload): Promise<any> {
    return await this.http
      .post<any>('/v1/questions', payload, { headers: this.headers })
      .toPromise();
  }
}

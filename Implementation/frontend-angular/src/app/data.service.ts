import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  data: any;
  constructor(private http: HttpClient) {}
  getSensorPoints(): Observable<any> {
    return this.http.get<any>(environment.filesurl+"sensors");
  }
  getSensorIdmismatch(id:any):Observable<any> {
    return this.http.get<any>(environment.filesurl+"particular_mismatch/" + id);
  }
  getSensorIdMatch(id:any):Observable<any> {
    return this.http.get<any>(environment.filesurl+"particular_match/" + id);
  }
  getTemporalMismatch(time_list:any, day:any, weeknum:any):Observable<any> {
    return this.http.get<any>(environment.filesurl+"mismatch_time/" + time_list[0]+'/' +time_list[1]+'/' + day+'/' + weeknum);
  }
  getMismatchChart(id:any):Observable<any> {
    return this.http.get<any>(environment.filesurl+"particular_match/" + id);
  }
}

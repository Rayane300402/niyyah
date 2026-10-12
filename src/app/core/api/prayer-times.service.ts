import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from './api.config';
import { map, Observable } from 'rxjs';


interface AlAdhanResponse {
  data : {
    timings: {
      Fajr:  string;
      Maghrib: string;
    }
  }
}

export interface PrayerTimes{
  fajr: Date;
  maghrib: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PrayerTimesService {

  constructor(private http: HttpClient) { }

  getTodayPrayerTimes(city: string, country: string): Observable<PrayerTimes>{
    const today = new Date();

    const date = [
      today.getDate().toString().padStart(2, '0'),
      (today.getMonth() + 1).toString().padStart(2, '0'),
      today.getFullYear()
    ].join('-');

    const params = new HttpParams()
    .set('city', city)
    .set('country', country)
    .set('iso8601', 'true');

    return this.http.get<AlAdhanResponse>(
      `${API_CONFIG.aladhanBaseUrl}/timingsByCity/${date}`,
      {params}
    ).pipe(
      map(response => ({
        fajr: new Date(response.data.timings.Fajr),
        maghrib: new Date(response.data.timings.Maghrib)
      }))
    )

  }

}

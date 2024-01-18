import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiTrackModel } from '@core/models/api-track.model';
import { TrackModel } from '@core/models/tracks.model';
import { Observable, map, of } from 'rxjs';
import { enviroment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  public dataTracksTrending$: Observable<TrackModel[]> = of([]);
  public dataTracksRandom$: Observable<TrackModel[]> = of([]);
  
  private readonly URL = enviroment.api;
  constructor(private httpClient: HttpClient) { 
    
  }

  getAllTracks$() : Observable<TrackModel[]>{
    return this.httpClient.get<ApiTrackModel>(`${this.URL}/tracks`).pipe(
      map((dataRaw) =>  dataRaw.data)
    );
  } 
  getAllRandom$() : Observable<TrackModel[]>{
    return this.httpClient.get<ApiTrackModel>(`${this.URL}/tracks`).pipe(
      map((dataRaw) =>  dataRaw.data.reverse())
    );
  } 
}

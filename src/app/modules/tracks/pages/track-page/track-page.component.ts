import { Component, OnDestroy, OnInit } from '@angular/core';
import { TrackModel } from '@core/models/tracks.model';
import { TrackService } from '@modules/tracks/services/track.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-track-page',
  templateUrl: './track-page.component.html',
  styleUrls: ['./track-page.component.scss'],
})
export class TrackPageComponent implements OnInit, OnDestroy {
  tracksTrending: Array<TrackModel> = [];
  tracksRandom: Array<TrackModel> = [];
  listObservers$: Array<Subscription> = [];
  constructor(private tracksService: TrackService) {}

  ngOnInit(): void {
    this.loadData();
    this.loadDataRandom();


  }
  loadData(): void {
    this.tracksService.getAllTracks$().subscribe((response) => {
      this.tracksTrending = response;
    }, error =>{
      console.log(error);
    })
  }
  loadDataRandom(): void {
    this.tracksService.getAllRandom$().subscribe((response) => {
      this.tracksRandom = response;
    })
  }
  ngOnDestroy(): void {
    this.listObservers$.forEach(u => u.unsubscribe()); 
  }
}

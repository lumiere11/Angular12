import { Component, OnDestroy, OnInit } from '@angular/core';
import { TrackModel } from '@core/models/tracks.model';
import { MultiMediaService } from '@shared/services/multi-media.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.scss']
})
export class MediaPlayerComponent implements OnInit , OnDestroy{
  mockCover : TrackModel = {
    cover: 'https://fastly.picsum.photos/id/1039/200/300.jpg?hmac=6ltGhc0bwc07wl0cbQxDwnJd-vpqJcHZLTO8xm-M15o',
    album: 'Giolo and assai',
    name: 'BEBE',
    url: 'https://localhost/a.mp3',
    _id: "1"
  }
  listaObservers$: Array<Subscription> = []
  constructor(private multimediaService : MultiMediaService) { }

  ngOnInit(): void {
    
    const observer1$ : Subscription = this.multimediaService.callback.subscribe(
      (response: TrackModel) => {
        console.log('Recibiendo cancion.....')
    });

    this.listaObservers$ = [observer1$]
  }
  ngOnDestroy(): void {
    this.listaObservers$.forEach(item => item.unsubscribe());
    
  }
}

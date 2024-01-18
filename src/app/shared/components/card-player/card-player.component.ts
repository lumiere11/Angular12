import { Component, Input, OnInit } from '@angular/core';
import { TrackModel } from '@core/models/tracks.model';
import { MultiMediaService } from '@shared/services/multi-media.service';

@Component({
  selector: 'app-card-player',
  templateUrl: './card-player.component.html',
  styleUrls: ['./card-player.component.scss']
})
export class CardPlayerComponent implements OnInit {
  @Input() mode: 'small' | 'big' = 'small';
  @Input() track = {} as TrackModel;
  constructor(private multimediaService: MultiMediaService) {

  }

  ngOnInit(): void {
  }
  sendPlay(track : TrackModel): void {
    this.multimediaService.callback.emit();
  }
}

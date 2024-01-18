import { Component, OnInit } from '@angular/core';
import { TrackModel } from '@core/models/tracks.model';
import * as dataRaw from '../../../data/tracks.json';
@Component({
  selector: 'app-play-list-body',
  templateUrl: './play-list-body.component.html',
  styleUrls: ['./play-list-body.component.scss']
})
export class PlayListBodyComponent implements OnInit {
  tracks : TrackModel[] = []
  optionSort: {prop: string | null, order: string } = {prop: null, order: 'asc'};
  constructor() { }

  ngOnInit(): void {
    const {data} = (dataRaw as any).default;
    this.tracks = data;
  }

  changeSort(prop: string):void{
    const {order} = this.optionSort;
    this.optionSort ={
      prop: prop,
      order: order === 'asc'? 'desc' : 'asc'
    }
  }

}

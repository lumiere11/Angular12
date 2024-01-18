import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { TrackPageComponent } from './pages/track-page/track-page.component';
import { TracksRoutingModule } from './tracks-routing.module';


@NgModule({
  declarations: [
    TrackPageComponent
  ],
  imports: [
    CommonModule,
    TracksRoutingModule,
    SharedModule  
  ]
})
export class TracksModule { }

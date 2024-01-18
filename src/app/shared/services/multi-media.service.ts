import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MultiMediaService {
  callback: EventEmitter<any> = new EventEmitter();
  constructor() { 
    
  }
}

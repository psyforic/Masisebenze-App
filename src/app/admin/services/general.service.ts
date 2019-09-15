import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  photoUrl = new BehaviorSubject<string>('../../../assets/img/faces/face-0.jpg');
  currentPhotoUrl = this.photoUrl.asObservable();
  constructor() { }
  changeClientPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }
}

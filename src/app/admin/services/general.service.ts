import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  photoUrl = new BehaviorSubject<string>('../../../assets/img/faces/face-0.jpg');
  currentPhotoUrl = this.photoUrl.asObservable();
  private componentMethodCallSource = new Subject<any>();

  // tslint:disable-next-line: member-ordering
  public myFunc: () => void;
  // tslint:disable-next-line: member-ordering
  componentMethodCalled$ = this.componentMethodCallSource.asObservable();
  changeClientPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }
  callComponentMethod() {
    this.componentMethodCallSource.next();
  }
}

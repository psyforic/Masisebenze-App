import { registerLocaleData } from '@angular/common';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  photoUrl = new BehaviorSubject<string>('../../../assets/img/faces/face-0.jpg');
  currentPhotoUrl = this.photoUrl.asObservable();
  questionnaires = [
    { type: 1, description: 'PATIENT HEALTH' },
    { type: 2, description: 'DEPRESSION' },
    { type: 3, description: 'ACTIVITIES OF DAILY LIVING' },
    { type: 4, description: 'INSTRUMENTAL ACTIVITIES OF DAILY LIVING' }
  ];
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

  getAge(idNumber: string): number {
    const tempDate = new Date(
      +idNumber.substr(0, 2),
      +(idNumber.substring(2, 4)) - 1,
      +idNumber.substring(4, 6));
    const id_month = tempDate.getMonth();
    const id_year = tempDate.getFullYear();
    let currentAge = new Date().getFullYear() - id_year;
    if (id_month > new Date().getMonth()) {
      currentAge = currentAge - 1;
    } else if (id_month === new Date().getMonth() && tempDate.getDate() < new Date().getDate()) {
      currentAge = currentAge - 1;
    }
    return currentAge;
  }
  getQuestionnaires() {
    return this.questionnaires;
  }
  getGender(idNumber: string): number {
    const genderIdentifier = idNumber.charAt(6);
    if (Number.parseInt(genderIdentifier) < 5) {
      return 0;
    }
    return 1;
  }
}

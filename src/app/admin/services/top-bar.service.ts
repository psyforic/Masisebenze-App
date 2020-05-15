import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopBarService {
  private title = new BehaviorSubject<String>('Dashboard');
  private notifications = new BehaviorSubject<Number>(0);
  private notifications$ = this.notifications.asObservable();
  private title$ = this.title.asObservable();
  constructor() { }

  setTitle(title: String) {
    this.title.next(title);
  }

  setNotifications(notifications: number) {
    this.notifications.next(notifications);
  }
  getNotifications(): Observable<Number> {
    return this.notifications$;
  }
  getTitle(): Observable<String> {
    return this.title$;
  }

}

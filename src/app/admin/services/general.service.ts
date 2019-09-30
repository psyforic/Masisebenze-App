import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ClientListDto, ClientServiceProxy } from '@shared/service-proxies/service-proxies';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  photoUrl = new BehaviorSubject<string>('../../../assets/img/faces/face-0.jpg');
  currentPhotoUrl = this.photoUrl.asObservable();
  private clients = new BehaviorSubject<ClientListDto[]>([]);
  constructor(private clientService: ClientServiceProxy) {

  }
  changeClientPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }
  fetchClients(attorneyId: string, contactId: string) {
    this.clientService.getByContactAttorneyId(attorneyId, contactId)
      .subscribe((result) => {
        this.clients.next(result.items);
      });
  }
  get clientList() {
    return this.clients.asObservable();
  }
  addClient(client: ClientListDto) {
    let list: ClientListDto[] = [];
    this.clients.subscribe((result) => {
      list = result;
    })
    this.clients.next(list.concat(client));
  }
}

import { MobilityDto, MobilityServiceProxy } from './../../../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, Input, ViewChild, ElementRef, Injector } from '@angular/core';
import { ClientDetailOutput, ClientServiceProxy, AssessmentServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-mobility',
  templateUrl: './mobility.component.html',
  styleUrls: ['./mobility.component.scss'],
  providers: [
    MobilityServiceProxy
  ]
})
export class MobilityComponent extends AppComponentBase implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() fullName: string;
  @Input() clientId: string;
  isLoading = false;
  mobility: MobilityDto = new MobilityDto();
  client: ClientDetailOutput = new ClientDetailOutput();
  constructor(private _clientService: ClientServiceProxy,
    private injector: Injector,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _mobilityService: MobilityServiceProxy,
    private _assessmentService: AssessmentServiceProxy) {
    super(injector);
  }

  ngOnInit() {
  }
  open() {
    this.isLoading = true;
    this._mobilityService.getByClientAsync(this.clientId)
    .pipe(finalize(() => {
      this.isLoading = false;
    }))
    .subscribe(
      (result) => {
        this.mobility = result;
      }
    );
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then(() => { }, () => { });
  }
  save() {
    this.isLoading = true;
    this.mobility.clientId = this.clientId;
    this.mobility.status = 0;
    this.mobility.isSelected = true;
    this._mobilityService.createAsync(this.mobility)
    .pipe(finalize(() => {
      this.isLoading = false;
    })).subscribe(
      () => {
        this.notify.success('Saved successfully');
        this.close();
      }
    );
  }
  close() {
    this.activeModal.close();
  }
}

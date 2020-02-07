import { finalize } from 'rxjs/operators';
import { AffectDto, AffectServiceProxy } from './../../../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, Injector, ViewChild, ElementRef, Input } from '@angular/core';
import { ClientDetailOutput, ClientServiceProxy, AssessmentServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-affect',
  templateUrl: './affect.component.html',
  styleUrls: ['./affect.component.scss'],
  providers: [
    AffectServiceProxy
  ]
})
export class AffectComponent extends AppComponentBase implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  client: ClientDetailOutput = new ClientDetailOutput();
  @Input() fullName: string;
  @Input() clientId: string;
  affect: AffectDto = new AffectDto();
  isLoading = false;
  constructor(
    private _clientService: ClientServiceProxy,
    private injector: Injector,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _assessmentService: AssessmentServiceProxy,
    private _affectService: AffectServiceProxy) {
    super(injector);
  }

  ngOnInit() {
  }
  open() {
    this.isLoading = true;
    this._affectService.getByClientAsync(this.clientId)
    .pipe(finalize(() => {
      this.isLoading = false;
    })).subscribe(
      (affect) => {
        this.affect = affect;
      }
    );
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then(() => { }, () => { });
  }
  getAffect(clientId) {

  }
  save() {
    this.isLoading = true;
    this.affect.clientId = this.clientId;
    this.affect.status = 0;
    this.affect.isSelected = true;
    this._affectService.createAsync(this.affect)
    .pipe(finalize(() => {
      this.isLoading = false;
    }))
    .subscribe(() => {
      this.notify.success('Saved sccessfully');
      this.close();
    })
  }
  close() {
    this.activeModal.close();
  }
}

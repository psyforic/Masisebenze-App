import { AppComponentBase } from '@shared/app-component-base';
import { Component, OnInit, ViewChild, ElementRef, Input, Injector } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AssessmentServiceProxy, CognitiveServiceProxy, CalculationsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AssessmentService } from '@app/admin/services/assessment.service';

@Component({
  selector: 'app-memory',
  templateUrl: './memory.component.html',
  styleUrls: ['./memory.component.scss'],
  providers: [CognitiveServiceProxy, CalculationsServiceProxy]
})
export class MemoryComponent extends AppComponentBase implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() clientId: string;
  @Input() fullName: string;
  isLoading = false;
  totalOfRecall = 0;
  totalOfAnterograde = 0;
  totalOfRetrograde = 0;
  comment;
  constructor(private _injector: Injector,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _assessmentService: AssessmentServiceProxy,
    private _cognitiveService: CognitiveServiceProxy,
    private generalService: AssessmentService,
    private calculationService: CalculationsServiceProxy) {
    super(_injector);
  }

  ngOnInit() {
  }
  open() {
    this.getMemory();
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then(() => { }, () => { });
  }
  close() {
    this.activeModal.close();
  }
  getMemory() {
    this._cognitiveService.getMemory(this.clientId)
      .subscribe(result => {
        if (result != null && result.options != null) {
          if (result.options.items != null) {
            result.options.items.forEach((item) => {
              if (item.position >= 1 && item.position <= 3) {
                this.totalOfRecall += item.score;
              } else if (item.position > 3 && item.position <= 10) {
                this.totalOfAnterograde += item.score;
              } else if (item.position > 10 && item.position <= 13) {
                this.totalOfRetrograde += item.score;
              }
            });
          }
        }
      });
  }
}

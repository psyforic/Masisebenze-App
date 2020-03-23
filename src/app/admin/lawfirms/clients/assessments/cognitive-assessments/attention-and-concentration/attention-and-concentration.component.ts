import { CalculationsServiceProxy, CognitiveServiceProxy, CognitiveParentDto }
from './../../../../../../../shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { Component, OnInit, ViewChild, ElementRef, Input, Injector } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AssessmentServiceProxy, CoordinationServiceProxy } from '@shared/service-proxies/service-proxies';
import { AssessmentService } from '@app/admin/services/assessment.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-attention-and-concentration',
  templateUrl: './attention-and-concentration.component.html',
  styleUrls: ['./attention-and-concentration.component.scss'],
  providers: [CognitiveServiceProxy, CalculationsServiceProxy]
})
export class AttentionAndConcentrationComponent extends AppComponentBase implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() clientId: string;
  @Input() fullName: string;
  isLoading = false;
  totalOfSubtraction = 0;
  totalOfSpelling = 0;
  attentionAndConcentration: CognitiveParentDto = new CognitiveParentDto();
  comment;
  constructor(private injector: Injector,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _assessmentService: AssessmentServiceProxy,
    private _cognitiveService: CognitiveServiceProxy,
    private generalService: AssessmentService,
    private calculationService: CalculationsServiceProxy) {
    super(injector);
  }

  ngOnInit() {
  }

  open() {
    this.getAttentionAndConcentration();
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then(() => { }, () => { });
  }
  close() {
    this.activeModal.close();
  }
  save() {
    this.isLoading = true;
    this._cognitiveService.updateCognitiveComment(this.attentionAndConcentration)
    .pipe(finalize(() => {
      this.isLoading = false;
    })).subscribe(() => {
      this.notify.success('Saved successfully!');
    });
  }
  getAttentionAndConcentration() {
    this.isLoading = true;
    this.totalOfSpelling = 0;
    this.totalOfSubtraction = 0;
    this._cognitiveService.getAttentionAndConcentration(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        // console.log(result);
        if (result != null && result.options != null) {
          this.attentionAndConcentration = result;
          if (result.options.items != null) {
            result.options.items.forEach( (item, index) => {
              if (item.position >= 1 && item.position <= 5) {
                (item.score !== -1) ? this.totalOfSubtraction += item.score : this.totalOfSubtraction += 0;
              } else if (item.position > 6 && item.position <= 9) {

                (item.score !== -1) ? this.totalOfSpelling += item.score : this.totalOfSpelling += 0;
              }
            });
          }
        }
        // this.coordinationOptions = result.items;
      });
  }
}

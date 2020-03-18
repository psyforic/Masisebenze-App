import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { Component, OnInit, ViewChild, Input, ElementRef, Injector } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssessmentServiceProxy, CognitiveServiceProxy, CalculationsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AssessmentService } from '@app/admin/services/assessment.service';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
  providers: [CalculationsServiceProxy, CognitiveServiceProxy]
})
export class LanguageComponent extends AppComponentBase implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() clientId: string;
  @Input() fullName: string;
  isLoading = false;
  comment;
  totalOfComprehension = 0;
  totalOfNaming = 0;
  totalOfImageComprehension = 0;
  totalOfReading = 0;
  totalOfRepetition = 0;
  totalOfWritting = 0;
  constructor(
    private injector: Injector,
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
    this.getLanguage();
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then(() => { }, () => { });
  }
  close() {
    this.activeModal.close();
  }
  getLanguage() {
    this.isLoading = true;
    this._cognitiveService.getComprehension(this.clientId)
      .subscribe(result => {
        if (result != null) {
          if (result.options != null && result.options.items != null) {
            result.options.items.forEach((item, index) => {
              this.totalOfComprehension += item.score;
            });
          }
        }
      });
    this._cognitiveService.getImageComprehension(this.clientId)
      .subscribe(result => {
        if (result != null) {
          if (result.options != null && result.options.items != null) {
            result.options.items.forEach((item, index) => {
              this.totalOfImageComprehension += item.score;
            });
          }
        }
      });
    this._cognitiveService.getNaming(this.clientId)
      .subscribe(result => {
        if (result != null) {
          if (result.options != null && result.options.items != null) {
            result.options.items.forEach((item, index) => {
              this.totalOfNaming += item.score;
            });
          }
        }
      });
    this._cognitiveService.getReading(this.clientId)
      .subscribe(result => {
        if (result != null) {
          if (result.options != null && result.options.items != null) {
            result.options.items.forEach((item, index) => {
              this.totalOfReading += item.score;
            });
          }
        }
      });
    this._cognitiveService.getRepetition(this.clientId)
      .subscribe(result => {
        if (result != null) {
          if (result.options != null && result.options.items != null) {
            result.options.items.forEach((item, index) => {
              this.totalOfRepetition += item.score;
            });
          }
        }
      });
    this._cognitiveService.getWriting(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(result => {
        if (result != null) {
          if (result.options != null && result.options.items != null) {
            result.options.items.forEach((item, index) => {
              this.totalOfWritting += item.score;
            });
          }
        }
      });
  }
}

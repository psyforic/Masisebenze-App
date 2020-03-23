import { CognitiveParentDto } from './../../../../../../../shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { Component, OnInit, ViewChild, ElementRef, Input, Injector } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AssessmentServiceProxy, CognitiveServiceProxy, CalculationsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AssessmentService } from '@app/admin/services/assessment.service';

@Component({
  selector: 'app-verbal-fluency',
  templateUrl: './verbal-fluency.component.html',
  styleUrls: ['./verbal-fluency.component.scss'],
  providers: [CognitiveServiceProxy, CalculationsServiceProxy]
})
export class VerbalFluencyComponent extends AppComponentBase implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() clientId: string;
  @Input() fullName: string;
  isLoading = false;
  comment;
  totalOfGeneralWords = 0;
  totalOfAnimals = 0;
  verbalFluency: CognitiveParentDto = new CognitiveParentDto();
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
    this.getVerbalFlency();
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then(() => { }, () => { });
  }
  close() {
    this.activeModal.close();
  }
  save() {
    this.isLoading = true;
    this._cognitiveService.updateCognitiveComment(this.verbalFluency).
    pipe(finalize(() => {
      this.isLoading = false;
    })).subscribe(() => {
      this.notify.success('Saved successfully!');
    });
  }
  getVerbalFlency() {
    this.isLoading = true;
    this.totalOfGeneralWords = 0;
    this.totalOfAnimals = 0;
    this._cognitiveService.getVerbalFluency(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe(result => {
        if (result != null && result.options != null && result.options.items != null) {
          this.verbalFluency = result;
          result.options.items.forEach((item) => {
            if (item.position === 1) {
              (item.score !== -1) ? this.totalOfGeneralWords = item.score : this.totalOfGeneralWords += 0;
            } else {
              (item.score !== -1) ? this.totalOfAnimals = item.score : this.totalOfAnimals += 0;
            }
          });
        }
      });
  }
}

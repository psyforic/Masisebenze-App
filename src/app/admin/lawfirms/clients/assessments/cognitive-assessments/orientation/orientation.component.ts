import { AppComponentBase } from 'shared/app-component-base';
import { Component, OnInit, Injector, ViewChild, ElementRef, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AssessmentServiceProxy, CognitiveServiceProxy, CalculationsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AssessmentService } from '@app/admin/services/assessment.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-orientation',
  templateUrl: './orientation.component.html',
  styleUrls: ['./orientation.component.scss'],
  providers: [CognitiveServiceProxy, CalculationsServiceProxy]
})
export class OrientationComponent extends AppComponentBase implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() clientId: string;
  @Input() fullName: string;
  isLoading = false;
  comment;
  totalOfTimeQuestions = 0;
  totalOfPlaceQuestions = 0;
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
    this.getOrientation();
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then(() => { }, () => { });
  }
  close() {
    this.activeModal.close();
  }
  save() {

  }
  getOrientation() {
    this._cognitiveService.getOrientation(this.clientId).pipe(finalize(() => {

    })).subscribe(result => {
      if (result != null && result.options != null) {
        if (result.options.items != null) {
          result.options.items.forEach((item) => {
            if (item.position < 6) {
              this.totalOfTimeQuestions += item.score;
            } else {
              this.totalOfPlaceQuestions += item.score;
            }
          });
        }
      }
    });
  }
}
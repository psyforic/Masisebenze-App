import { QuestionListDto } from './../../../../../../../shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { Component, OnInit, ViewChild, Input, ElementRef, Injector } from '@angular/core';
import { ClientServiceProxy, AssessmentServiceProxy, FunctionalAssessmentServiceProxy,
   ClientDetailOutput } from '@shared/service-proxies/service-proxies';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralService } from '@app/admin/services/general.service';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent extends AppComponentBase implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  client: ClientDetailOutput = new ClientDetailOutput();
  @Input() fullName: string;
  @Input() clientId: string;
  @Input() type: number;
  @Input() description: string;
  questions: QuestionListDto[] = [];
  isLoading = false;
  index = 0;
  constructor(
    private _clientService: ClientServiceProxy,
    private injector: Injector,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _assessmentService: AssessmentServiceProxy,
    private _generalService: GeneralService,
    private _functionAssessmentService: FunctionalAssessmentServiceProxy) {
    super(injector);
  }

  ngOnInit() {
  }
  open(type) {
    this.getQuestions(type);
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
    .result.then(() => { }, () => { });
  }
  save() {

  }
  close() {
    this.activeModal.close();
  }
  getQuestions(type) {
    this.isLoading = true;
    this._functionAssessmentService.getQuestionList(type)
    .pipe(finalize(() => {
      this.isLoading = false;
    }))
    .subscribe(result => {
      this.questions = result.items;
      console.log(this.questions);
    });
  }
}

import { GeneralService } from './../../../../services/general.service';
import { registerLocaleData } from '@angular/common';
import { ContactsComponent } from './../../../contacts/contacts.component';
import { FunctionalAssessmentServiceProxy, QuestionnaireDto } from './../../../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, ViewChild, ElementRef, Input, Injector, Type, EventEmitter, Output } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import {
  ClientDetailOutput, AffectDto, ClientServiceProxy, AssessmentServiceProxy,
  AffectServiceProxy
} from '@shared/service-proxies/service-proxies';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-functional-assessment',
  templateUrl: './functional-assessment.component.html',
  styleUrls: ['./functional-assessment.component.scss'],
  providers: [
    FunctionalAssessmentServiceProxy
  ]
})
export class FunctionalAssessmentComponent extends AppComponentBase implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  @Output() assessmentsAdded = new EventEmitter();
  client: ClientDetailOutput = new ClientDetailOutput();
  @Input() fullName: string;
  @Input() clientId: string;
  questionnairesDto: QuestionnaireDto[] = [];
  questionnaires = [
    { type: 1, description: 'PATIENT HEALTH' },
    { type: 2, description: 'DEPRESSION' },
    { type: 3, description: 'ACTIVITIES OF DAILY LIVING' },
    { type: 4, description: 'INSTRUMENTAL ACTIVITIES OF DAILY LIVING' }
  ];
  addedQuestionnaires: Array<number> = [];
  isLoading = false;
  saving = false;
  modalRef: any;
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
  open() {
    this.isLoading = true;
    // this.questionnaires = this._generalService.getQuestionnaires();
    this.getQuestionnaires();
    this.modalRef = this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then(() => { }, () => { });
  }
  getAffect(clientId) {

  }
  addQuestionnaire(type) {
    if (this.addedQuestionnaires.indexOf(type) === -1) {
      this.addedQuestionnaires.push(type);
      // const index = this.questionnaires.indexOf(this.questionnaires.filter(q => q.type == type)[0]);
      // this.questionnaires.splice(index, 1);
    }
  }
  save() {
    this.saving = true;
    this.isLoading = true;
    this._functionAssessmentService.createAsync(this.addedQuestionnaires, this.clientId)
      .pipe(finalize(() => {
        this.saving = false;
        this.isLoading = false;
      })).subscribe(() => {
        this.notify.success('Saved successfully');
      });
  }
  close() {
    this.assessmentsAdded.emit(null);
    this.modalService.dismissAll();
  }
  isQuestionnaireAdded(type) {
    if (this.questionnaires != null) {
      if (this.questionnaires.filter(q => q.type == type).length > 0) {
        const questionnaire = this.questionnaires.filter(q => q.type == type)[0];
        const index = this.questionnaires.indexOf(questionnaire);
        this.questionnaires.splice(index, 1);
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
  setCardClass(type) {
    if (this.addedQuestionnaires != null) {
      if (this.addedQuestionnaires.indexOf(type) !== -1) {
        return 'card-description text-primary';
      } else {
        return 'card-description text dark';
      }

    }
    return 'card card-pricing custom-shadow text-center';
  }
  getQuestionnaires() {
    this._functionAssessmentService.getQuestionnaires(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(result => {
        this.questionnairesDto = result.items;
        if (this.questionnairesDto != null && this.questionnairesDto.length > 0) {
          this.questionnairesDto.forEach((questionnaire) => {
            this.isQuestionnaireAdded(questionnaire.type);
          });
        }
      });
  }
}

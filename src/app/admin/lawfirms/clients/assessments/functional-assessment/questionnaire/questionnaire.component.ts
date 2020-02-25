
import { registerLocaleData } from '@angular/common';
import { QuestionListDto, OptionListDto, QuestionOptionListDto } from './../../../../../../../shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { Component, OnInit, ViewChild, Input, ElementRef, Injector, Type } from '@angular/core';
import {
  ClientServiceProxy, AssessmentServiceProxy, FunctionalAssessmentServiceProxy,
  ClientDetailOutput
} from '@shared/service-proxies/service-proxies';
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
  options: QuestionOptionListDto[] = [];
  questionnaireOptions = [
    {
      type: 1, position: 1, optionPositon: 0, options: [
        { text: 'Not at all' },
        { text: 'Several days' },
        { text: 'More than half the days' },
        { text: 'Nearly every day' }
      ]
    },
    {
      type: 1, position: 2, optionPositon: 0, options: [
        { text: 'NO' },
        { text: 'YES' }
      ]
    },
    {
      type: 1, position: 5, optionPositon: 0, options: [
        { text: 'NO' },
        { text: 'YES' }
      ]
    },
    {
      type: 1, position: 7, optionPositon: 0, options: [
        { text: 'NO' },
        { text: 'YES' }
      ]
    },
    {
      type: 1, position: 8, optionPositon: 2, options: [
        { text: 'NO' },
        { text: 'YES' }
      ]
    },
    {
      type: 1, position: 8, optionPositon: 3, options: [
        { text: 'NO' },
        { text: 'YES' }
      ]
    },
    {
      type: 1, position: 8, optionPositon: 4, options: [
        { text: 'NO' },
        { text: 'YES' }
      ]
    },
    {
      type: 1, position: 8, optionPositon: 5, options: [
        { text: 'NO' },
        { text: 'YES' }
      ]
    },
    {
      type: 1, position: 8, optionPositon: 6, options: [
        { text: 'NO' },
        { text: 'YES' }
      ]
    },
    {
      type: 1, position: 8, optionPositon: 1, options: [
        { text: 'Periods are unchanged' },
        { text: 'No periods because pregnant or recently gave birth' },
        { text: 'Periods have become irregular or changed in frequency, duration, or amount' },
        { text: 'No periods for at least a year' },
        { text: 'Having periods because takin hormone replacement (estrogen) therapy or oral contraceptives' }
      ]
    },
    {
      type: 1, position: 3, optionPositon: 0, options: [
        { text: 'Not difficult at all' },
        { text: 'Somewhat difficult' },
        { text: 'Very difficult' },
        { text: 'Extremely defficlt' }
      ]
    },
    {
      type: 1, position: 4, optionPositon: 0, options: [
        { text: 'Not bothered' },
        { text: 'Bothered a little' },
        { text: 'Bothered a lot' }
      ]
    },
    {
      type: 1, position: 6, optionPositon: 0, options: [
        { text: 'text' }
      ]
    },
    {
      type: 2, position: 17, optionPositon: 0, options: [
        { text: 'not at all' },
        { text: 'a little bit' },
        { text: 'a moderate amount' },
        { text: 'quite a bit' },
        { text: 'extremely' }
      ]
    },
    {
      type: 2, position: 16, optionPositon: 0, options: [
        { text: 'not at all true' },
        { text: 'rarely true' },
        { text: 'sometimes true' },
        { text: 'often true' },
        { text: 'almost always true' }
      ]
    },
    {
      type: 2, position: 8, optionPositon: 0, options: [
        { text: 'very good, my life could hardly be better' },
        { text: 'pretty good, most things are going well' },
        { text: 'the good and bad parts are about equal' },
        { text: 'pretty bad, most things are going poorly' },
        { text: 'very bad, my life could hardly be worse' }
      ]
    },
  ];
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
    this.modalService.open(this.content, { windowClass: 'modal-height', backdrop: 'static', keyboard: false, size: 'xl' })
      .result.then(() => { }, () => { });
  }
  save() {

  }
  close() {
    this.activeModal.close();
  }
  next() {
    if (this.index < this.questions.length) {
      this.index++;
    }

  }
  prev() {
    if (this.index > 0) {
      this.index--;
    }

  }
  getQuestionOptions(position) {
    switch (this.type) {
      case 1:
          if (this.questions.filter(q => q.position === position).length > 0) {
            if (this.questions.filter(q => q.position === position)[0].options.length > 0) {
              this.options = this.questions.filter(q => q.position === position)[0].options;
              return this.options;
            } else {
              return this.questions.filter(q => q.position === position);
            }
          } else {
            return null;
          }

        break;
      default:
        break;
    }
  }
  getLetter(i: number) {
    return String.fromCharCode(96 + i);
  }
  getQuestionnaireOptions(type, position, optionPosition) {
    if (optionPosition > 0) {
      if (this.questionnaireOptions.filter(qo => qo.type === type
        && qo.position === position
        && qo.optionPositon === optionPosition).length > 0) {
        return this.questionnaireOptions.filter(qo => qo.type === type
          && qo.position === position
          && qo.optionPositon === optionPosition)[0].options;
      }

    } else {
      if (type === 2 && position <= 16) {
        if (this.questionnaireOptions.filter(qo => qo.type === type
          && qo.position === 16).length > 0) {
          return this.questionnaireOptions.filter(qo => qo.type === type
            && qo.position === 16)[0].options;
        }
      } else {
        if (this.questionnaireOptions.filter(qo => qo.type === type
          && qo.position === position).length > 0) {
          return this.questionnaireOptions.filter(qo => qo.type === type
            && qo.position === position)[0].options;
        }
      }
    }
  }
  getQuestions(type) {
    this.index = 0;
    this.isLoading = true;
    this._functionAssessmentService.getQuestionList(type)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(result => {
        this.questions = result.items;
      });
  }
}


import { registerLocaleData } from '@angular/common';
import {
  QuestionListDto, OptionListDto, QuestionOptionListDto,
  ClientAnswerListDto,
  QuestionDto,
  OptionDto,
  QuestionOptionDto
} from './../../../../../../../shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { Component, OnInit, ViewChild, Input, ElementRef, Injector, Type } from '@angular/core';
import {
  ClientServiceProxy, AssessmentServiceProxy, FunctionalAssessmentServiceProxy,
  ClientDetailOutput
} from '@shared/service-proxies/service-proxies';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralService } from '@app/admin/services/general.service';
import { MatRadioChange } from '@angular/material';

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
  questionDto: QuestionDto = new QuestionDto();
  questionOptions: QuestionOptionDto[] = [];
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
      type: 2, position: 18, optionPositon: 0, options: [
        { text: 'very good, my life could hardly be better' },
        { text: 'pretty good, most things are going well' },
        { text: 'the good and bad parts are about equal' },
        { text: 'pretty bad, most things are going poorly' },
        { text: 'very bad, my life could hardly be worse' }
      ]
    },
  ];
  clientAsnwers: ClientAnswerListDto[] = [];
  isLoading = false;
  isSaved = false;
  index = 0;
  answer: string;
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
    this.getClientAnswers(type, this.clientId);
    this.type = type;
    this.modalService.open(this.content, { windowClass: 'modal-height', backdrop: 'static', keyboard: false, size: 'xl' })
      .result.then(() => { }, () => { });
  }
  save() {
    this.isLoading = true;
    this.questionDto.clientId = this.clientId;
    this.questionDto.id = this.questions[this.index].id;
    this.questionDto.position = this.questions[this.index].position;
    this.questionDto.type = this.questions[this.index].type;
    if (this.questionDto.position != 6) {
      this.questionDto.options = this.questionOptions;
    }

    this.questionDto.answer = this.answer;
    this._functionAssessmentService.updateAsync(this.questionDto).
      pipe(finalize(() => {
        this.isSaved = true;
        this.isLoading = false;
      })).subscribe(() => {
        this.notify.success('Save successfully');
      });
  }
  close() {
    this.index = 0;
    this.activeModal.close();
  }
  next() {
    if (this.index < this.questions.length) {
      this.index++;
      this.getQuestion(this.clientId, this.questions[this.index].id);
    } else {
      this.index = this.index;
    }

  }
  prev() {
    if (this.index > 0) {
      this.index--;
      this.getQuestion(this.clientId, this.questions[this.index].id);
    } else {
      this.index = this.index;
    }
  }
  getQuestionOptions(position) {

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
  async getQuestions(type) {
    this.index = 0;
    this.isLoading = true;
    await this._functionAssessmentService.getQuestionList(type)
      .subscribe(result => {
        this.questions = result.items;
        // this.questionDto = new QuestionDto();
        // this.createQuestionDto(this.questions[this.index]);
        this.getQuestion(this.clientId, this.questions[this.index].id);
      });
  }
  async getClientAnswers(type, clientId) {
    await this._functionAssessmentService.getListAsync(type, clientId).subscribe(
      result => {
        this.clientAsnwers = result.items;
      });
  }
  createQuestionDto(question: QuestionListDto) {
    if (question != null && question.options.length > 0) {
      question.options.forEach((option) => {
        if (this.questionOptions.filter(qo => qo.id == option.id).length == 0) {
          const questionOption = new QuestionOptionDto();
          questionOption.id = option.id;
          this.questionOptions.push(questionOption);
        }
      });
    }
  }
  async getQuestion(clientId, id) {
    this.questionOptions = [];
    this.isLoading = true;
    await this._functionAssessmentService.getByQuestionIdAsync(clientId, id)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(result => {
        result.items.forEach((r) => {
          this.setQuestionOption(r.questionOptionId, r.optionScore);
        });
        console.log(result);
      });
    // const questions = this.clientAsnwers.filter(ca => ca.questionId == id && ca.clientId == clientId && ca.type == this.type);
    // if (questions.length > 0) {
    //   questions.forEach((r) => {
    //     this.setQuestionOption(r.questionOptionId, r.optionScore);
    //   });
    // }
    // console.log(this.questionOptions);
  }
  isOptionChecked(id, score) {
    if (this.questionOptions.filter(qo => qo.optionScore === score && qo.id === id).length > 0) {
      return true;
    }
    return false;
  }
  isSavable(question: QuestionListDto) {
    if (question != null && question.options != null) {
      if (this.questionOptions.filter(qo => qo.optionScore !== -1).length === question.options.length) {
        return true;
      }
      return false;
    } else if (this.type === 1 && question != null && question.position === 6) {
      if (this.answer) {
        return true;
      } else {
        return false;
      }
    }

    return false;
  }
  setQuestionOption(id, value) {
    if (this.questionOptions.filter(qo => qo.id === id).length === 0) {
      const questionOption = new QuestionOptionDto();
      questionOption.id = id;
      questionOption.optionScore = value;
      this.questionOptions.push(questionOption);
    } else {
      this.questionOptions.filter(qo => qo.id === id)[0].optionScore = value;
    }
  }
  changedListener(event: MatRadioChange, questionId, optionId = null) {
    if (event.source.checked) {
      if (optionId != null && this.questions[this.index].options.length > 0) {
        this.setQuestionOption(optionId, event.value);
      }
    }
  }

}


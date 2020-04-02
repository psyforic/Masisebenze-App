import { QuestionnaireResolverService } from './../../../../../resolvers/questionnaire-resolver.service';
import { ActivatedRoute } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import {
  QuestionListDto, OptionListDto, QuestionOptionListDto,
  ClientAnswerListDto,
  QuestionDto,
  OptionDto,
  QuestionOptionDto,
  CreateCommentInput,
  QuestionnaireDto,
  CommentServiceProxy
} from './../../../../../../../shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import {
  Component, OnInit, ViewChild, Input, ElementRef, Injector, Type,
  ChangeDetectorRef, AfterViewChecked
} from '@angular/core';
import {
  ClientServiceProxy, AssessmentServiceProxy, FunctionalAssessmentServiceProxy,
  ClientDetailOutput
} from '@shared/service-proxies/service-proxies';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralService } from '@app/admin/services/general.service';
import { MatRadioChange } from '@angular/material';
import { QuestionnaireCommentComponent } from '../questionnaire-comment/questionnaire-comment.component';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss'],
  providers: [CommentServiceProxy]
})
export class QuestionnaireComponent extends AppComponentBase implements OnInit, AfterViewChecked {
  @ViewChild('content', { static: false }) content: ElementRef;
  client: ClientDetailOutput = new ClientDetailOutput();
  @ViewChild('questionnaireComment', { static: false }) questionnaireComment: QuestionnaireCommentComponent;
  @Input() fullName: string;
  @Input() clientId: string;
  @Input() type: number;
  @Input() description: string;
  questions: QuestionListDto[] = [];
  questionDto: QuestionDto = new QuestionDto();
  questionDtos: QuestionDto[] = [];
  questionOptions: QuestionOptionDto[] = [];
  options: QuestionOptionListDto[] = [];
  commentInput: CreateCommentInput = new CreateCommentInput();
  questionnaire: QuestionnaireDto = new QuestionnaireDto();
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
  clientAnswers: ClientAnswerListDto[] = [];
  isLoading = false;
  saving = false;
  answer;
  isSaved;
  index = 0;
  total = 0;
  constructor(
    private _clientService: ClientServiceProxy,
    private cdr: ChangeDetectorRef,
    private injector: Injector,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _assessmentService: AssessmentServiceProxy,
    private _generalService: GeneralService,
    private _functionAssessmentService: FunctionalAssessmentServiceProxy,
    private _activatedRoute: ActivatedRoute) {
    super(injector);
  }
  ngOnInit() {
  }
  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  open(type: number) {
    this.questions = [];
    this.clientAnswers = [];
    this.isSaved = false;
    this.type = type;
    this.getQuestions(this.type);
    this.getClientAnswers(this.type, this.clientId);
    this.modalService.open(this.content, { windowClass: 'modal-height', backdrop: 'static', keyboard: false, size: 'xl' })
      .result.then(() => { }, () => { });
  }
  save() {
    this.saving = true;
    if (this.type !== 2) {
      if (this.clientAnswers != null && this.clientAnswers.length > 0) {

        this._functionAssessmentService.updateQuestionList(
          this.clientAnswers.filter(ca => ca.questionId === this.questions[this.index].id)
        )
          .pipe(finalize(() => {
            this.isSaved = false;
            this.saving = false;
          }))
          .subscribe(() => {
            this.notify.success('Save successfully');
          });
      }

    } else {
      if (this.clientAnswers != null && this.clientAnswers.length > 0) {
        this._functionAssessmentService.updateQuestionList(this.clientAnswers)
          .pipe(finalize(() => {
            this.isSaved = false;
            this.saving = false;
          }))
          .subscribe(() => {
            this.notify.success('Saved successfully');
          });
      }
    }
  }
  close() {
    this.index = 0;
    this.clientAnswers = [];
    this.questions = [];
    this.modalService.dismissAll();
  }
  next() {
    if (this.index < this.questions.length) {
      this.index++;
    } else {
      this.index = this.index;
      return;
    }

  }
  prev() {
    if (this.index > 0) {
      this.index--;
      // this.getQuestion(this.clientId, this.questions[this.index].id);
    } else {
      this.index = this.index;
      return;
    }
  }
  getQuestionOptions(position) {

    if (this.questions.filter(q => q.position === position).length > 0) {
      if (this.questions.filter(q => q.position === position)[0].options.length > 0) {
        if (this.isSavable(this.questions.filter(q => q.position === position)[0])) {
          // this.isSaved = false;
        }
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
  getQuestions(type: number) {
    this.index = 0;
    this.isLoading = true;
    this._functionAssessmentService.getQuestionList(type)
      .subscribe(result => {
        this.questions = result.items;
        // if (this.type !== 2) {
        //   this.getQuestion(this.clientId, this.questions[this.index].id);
        // }

      });
  }
  getClientAnswers(type, clientId) {
    this.clientAnswers = [];
    this._functionAssessmentService.getListAsync(type, clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(
        result => {
          this.clientAnswers = result.items;
          this.clientAnswers.forEach((clientAnswer) => {
            if (clientAnswer.optionScore !== -1) {
              this.total += clientAnswer.optionScore;
            }
          });
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
  getQuestion(clientId, id) {
    if (this.clientAnswers.filter(ca => ca.questionId === id).length > 0) {
      this.clientAnswers.filter(ca => ca.questionId === id).forEach((r) => {
        this.setQuestionOption(r.questionOptionId, r.optionScore);
      });
    }
  }
  isOptionChecked(id, score) {
    if (this.type !== 2) {
      if (this.clientAnswers.filter(ca => ca.questionId === this.questions[this.index].id
        && ca.questionOptionId === id && ca.optionScore === score).length > 0) {
        return true;
      }
      return false;
    } else {
      if (this.clientAnswers.filter(ca => ca.questionId === id &&
        ca.optionScore === score).length > 0) {
        return true;
      }
      return false;
    }
  }
  isSavable(question: QuestionListDto) {
    if (question != null) {
      if (this.type === 1 && question.options != null && question.options.length > 0) {
        if (this.clientAnswers.filter(ca => ca.questionId === question.id && ca.optionScore !== -1).length === question.options.length) {
          return true;
        }
        return false;
      } else if (this.type === 1 && question != null && question.position === 6) {
        if (this.clientAnswers.filter(ca => ca.questionId === question.id && ca.answer != null && ca.answer !== '').length > 0) {
          return true;
        }
        return false;
      } else if (this.type === 2) {
        if (this.clientAnswers.filter(ca => ca.optionScore !== -1).length === this.clientAnswers.length) {
          this.isSaved = true;
          return true;
        }
        return false;
      } else if (this.type > 2) {
        if (this.clientAnswers.filter(ca => ca.questionId === question.id && ca.optionScore !== -1).length > 0) {
          return true;
        }
        return false;
      }
    }

    return false;
  }
  setTextValue(answer) {
    if (answer != null && answer !== '') {
      if (this.clientAnswers.filter(ca => ca.questionId === this.questions[this.index].id).length > 0) {
        this.clientAnswers.filter(ca => ca.questionId === this.questions[this.index].id)[0].answer = answer;
        // this.isSaved = true;
      }
    } else {
      this.clientAnswers.filter(ca => ca.questionId === this.questions[this.index].id)[0].answer = answer;
    }

  }
  getTextValue(questionId) {
    if (this.clientAnswers.filter(ca => ca.questionId === questionId &&
      ca.answer != null && ca.type === this.type).length > 0) {
      this.isSaved = false;
      return this.clientAnswers.filter(ca => ca.answer != null
        && ca.questionId === questionId && ca.type === this.type)[0].answer;
    }
    return ' ';
  }
  setQuestionOption(id, value) {
    if (id != null) {
      if (this.clientAnswers.filter(ca => ca.questionId === this.questions[this.index].id
        && ca.questionOptionId === id).length > 0) {
        this.clientAnswers.filter(ca => ca.questionId === this.questions[this.index].id
          && ca.questionOptionId === id)[0].optionScore = value;
        if (this.type > 2) {
          this.clientAnswers.filter(ca => ca.questionId === this.questions[this.index].id
            && ca.questionOptionId !== id).forEach((clientAnswer) => {
              if (clientAnswer.optionScore !== -1) {
                clientAnswer.optionScore = -1;
              }
            });
        }
      }
    }
  }
  changedListener(event: MatRadioChange, questionId, optionId = null) {

    if (event.source.checked) {

      if (this.type !== 2 && optionId != null && this.questions[this.index].options.length > 0) {
        this.setQuestionOption(optionId, event.value);
        this.isSaved = true;
      } else if (this.type === 2) {
        if (this.clientAnswers.filter(ca => ca.questionId === questionId).length > 0) {
          this.clientAnswers.filter(ca => ca.questionId === questionId)[0].optionScore = event.value;
        }
      }
    }
  }
  viewQuestionnaireComment(type) {
    this.questionnaireComment.open(type);
  }
  setOptionValue(questionPosition, optionPosition) {
    if (questionPosition != null && optionPosition != null) {
      switch (questionPosition) {
        case 1:
          if (optionPosition === 4) {
            return 0;
          } else {
            return 1;
          }
        case 2:
        case 3:
        case 7:
          if (optionPosition === 1) {
            return 1;
          } else {
            return 0;
          }
        case 4:
          if (optionPosition === 5) {
            return 0;
          } else {
            return 1;
          }
        case 5:
        case 6:
        case 8:
          if (optionPosition === 3 || optionPosition === 4) {
            return 0;
          } else {
            return 1;
          }
        default:
          break;
      }
    } else {
      return -1;
    }
  }
}


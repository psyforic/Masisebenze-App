import { CognitiveParentDto } from './../../../../../../../shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { Component, OnInit, ViewChild, Input, ElementRef, Injector } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssessmentServiceProxy, CognitiveServiceProxy, CalculationsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AssessmentService } from '@app/admin/services/assessment.service';
import { MatTabChangeEvent } from '@angular/material';

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
  comprehension: CognitiveParentDto = new CognitiveParentDto();
  imageComprehension: CognitiveParentDto = new CognitiveParentDto();
  naming: CognitiveParentDto = new CognitiveParentDto();
  reading: CognitiveParentDto = new CognitiveParentDto();
  repetition: CognitiveParentDto = new CognitiveParentDto();
  writting: CognitiveParentDto = new CognitiveParentDto();
  comment;
  totalOfComprehension = 0;
  totalOfNaming = 0;
  totalOfImageComprehension = 0;
  totalOfReading = 0;
  totalOfRepetition = 0;
  totalOfWriting = 0;
  totalOfAllComprehension = 0;
  totalOfAllNaming = 0;
  totalOfAllImageComprehension = 0;
  totalOfAllReading = 0;
  totalOfAllRepetition = 0;
  totalOfAllWriting = 0;
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
    this.getComprehension();
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false, size: 'xl' })
      .result.then(() => { }, () => { });
  }
  close() {
    this.activeModal.close();
  }
  save(cognitive: CognitiveParentDto) {
    this.isLoading = true;
    if (cognitive != null) {
        this._cognitiveService.updateCognitiveComment(cognitive)
        .pipe(finalize(() => {
            this.isLoading = false;
        }))
        .subscribe(() => {
          this.notify.success('Saved successfully!');
        });
    }
  }
  getComprehension() {
    this.totalOfComprehension = 0;
    this.totalOfAllComprehension = 0;
    this._cognitiveService.getComprehension(this.clientId)
    .pipe(finalize(() => {
      this.isLoading = false;
    }))
    .subscribe(result => {
      if (result != null) {
        this.comprehension = result;
        if (result.options != null && result.options.items != null) {
          result.options.items.forEach((item, index) => {
            (item.score !== -1) ? this.totalOfComprehension += item.score : this.totalOfComprehension += 0;
          });
          this.totalOfAllComprehension = result.options.items.length;
        }
      }
    });
  }
  getImageComprehension() {
    this.isLoading = true;
    this.totalOfImageComprehension  = 0;
    this.totalOfAllImageComprehension  = 0;
    this._cognitiveService.getImageComprehension(this.clientId)
    .pipe(finalize(() => {
      this.isLoading = false;
    }))
    .subscribe(result => {
      if (result != null) {
        this.imageComprehension = result;
        if (result.options != null && result.options.items != null) {
          result.options.items.forEach((item, index) => {
            (item.score !== -1) ? this.totalOfImageComprehension += item.score : this.totalOfImageComprehension += 0;
          });
          this.totalOfAllImageComprehension  =   result.options.items.length;
        }
      }
    });
  }
  getNaming() {
    this.isLoading = true;
    this.totalOfNaming = 0;
    this.totalOfAllNaming = 0;
    this._cognitiveService.getNaming(this.clientId)
    .pipe(finalize(() => {
      this.isLoading = false;
    }))
    .subscribe(result => {
      if (result != null) {
        this.naming = result;
        if (result.options != null && result.options.items != null) {
          result.options.items.forEach((item, index) => {
            (item.score !== -1) ? this.totalOfNaming += item.score : this.totalOfNaming += 0;
          });
          this.totalOfAllNaming =  result.options.items.length;
        }
      }
    });
  }
  getReading() {
    this.isLoading = true;
    this.totalOfReading = 0;
    this.totalOfAllReading = 0;
    this._cognitiveService.getReading(this.clientId)
    .pipe(finalize(() => {
      this.isLoading = false;
    }))
    .subscribe(result => {
      console.log(result);
      if (result != null) {
        this.reading = result;
        if (result.options != null && result.options.items != null) {
          result.options.items.forEach((item, index) => {
            (item.score !== -1) ? this.totalOfReading += item.score : this.totalOfReading += 0;
          });
          this.totalOfAllReading =  result.options.items.length;
        }
      }
    });
  }
  getRepetition() {
    this.isLoading = true;
    this.totalOfRepetition = 0;
    this.totalOfAllRepetition = 0;
    this._cognitiveService.getRepetition(this.clientId)
    .pipe(finalize(() => {
      this.isLoading = false;
    }))
    .subscribe(result => {
      if (result != null) {
        this.repetition = result;
        if (result.options != null && result.options.items != null) {
          result.options.items.forEach((item, index) => {
            (item.score !== -1) ? this.totalOfRepetition += item.score : this.totalOfRepetition = 0;
          });
          this.totalOfAllRepetition = result.options.items.length +1;
          console.log(result.options.items);
        }
      }
    });
  }
  getWritting() {
    this.isLoading = true;
    this.totalOfWriting = 0;
    this.totalOfAllWriting = 0;
    this._cognitiveService.getWriting(this.clientId)
    .pipe(finalize(() => {
      this.isLoading = false;
    }))
    .subscribe(result => {
      if (result != null) {
        this.writting = result;
        if (result.options != null && result.options.items != null) {
          result.options.items.forEach((item, index) => {
            (item.score !== -1) ? this.totalOfWriting += item.score : this.totalOfWriting += 0;
          });
          this.totalOfAllWriting = result.options.items.length;
        }
      }
    });
  }
  handleTabChange(event: MatTabChangeEvent) {

    switch (event.index) {
      case 0:
        this.getComprehension();
        break;
      case 1:
        this.getImageComprehension();
        break;
      case 2:
        this.getNaming();
        break;
      case 3:
        this.getReading();
        break;
      case 4:
        this.getRepetition();
        break;
      case 5:
        this.getWritting();
        break;
      default:
        break;
    }
  }
}

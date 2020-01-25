import { Component, OnInit, ViewChild, ElementRef, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PostureOptionDto, AssessmentServiceProxy } from '@shared/service-proxies/service-proxies';
import { AssessmentService } from '@app/admin/services/assessment.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-posture',
  templateUrl: './posture.component.html',
  styleUrls: ['./posture.component.scss']
})
export class PostureComponent extends AppComponentBase implements OnInit {

  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() fullName: string;
  @Input() clientId: string;
  current_step = 1;
  MAX_STEP = 13;
  isLoading = false;


  postureOptions: PostureOptionDto[] = [];
  constructor(
    private injector: Injector,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _assessmentService: AssessmentServiceProxy,
    private _generalService: AssessmentService) {
    super(injector);
  }

  ngOnInit() {
  }
  open() {
    this.getPostureOptions();
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then(() => { }, () => { });
  }
  close() {
    this.activeModal.close();
  }
  getPostureOptions() {
    this.isLoading = true;
    this._assessmentService.getPosture(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.postureOptions = result.items;
      });
  }
  next() {
    if (this.current_step !== this.MAX_STEP) {
      this.current_step++;
    }
  }
  prev() {
    if (this.current_step !== 1) {
      this.current_step--;
    }
  }
  decodePain(option: number) {
    return this._generalService.getPain(option);
  }
}
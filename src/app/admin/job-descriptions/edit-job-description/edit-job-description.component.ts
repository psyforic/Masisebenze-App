import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Injector } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreateJobDescriptionInput, JobDescriptionServiceProxy, JobDescriptionDetailOutput } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-edit-job-description',
  templateUrl: './edit-job-description.component.html',
  styleUrls: ['./edit-job-description.component.scss']
})
export class EditJobDescriptionComponent extends AppComponentBase implements OnInit {

  @ViewChild('content', { static: true }) content: ElementRef;
  @Output() jobDescriptionUpdated = new EventEmitter();
  modalRef: BsModalRef;
  closeResult: string;
  id: number;
  jobDescriptionForm: FormGroup;
  jobDescriptionDetail: JobDescriptionDetailOutput = new JobDescriptionDetailOutput();
  jobDemands = ['Constant', 'Rare', 'Occassional', 'Frequent'];
  constructor(private injector: Injector, private modalService: BsModalService,
    private fb: FormBuilder, private jobDescriptionService: JobDescriptionServiceProxy) {
    super(injector);
  }
  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm() {
    this.jobDescriptionForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      liftingJobDemand: [''],
      bilateralCarryJobDemand: [''],
      unilateralCarryJobDemand: [''],
      pushPullJobDemand: [''],
      kneelingJobDemand: [''],
      crouchingJobDemand: [''],
      midLevelReachJobDemand: [''],
      elevatedReachJobDemand: [''],
      sittingJobDemand: [''],
      standingJobDemand: [''],
      crawlingJobDemand: [''],
      repFootMotionJobDemand: [''],
      stairClimbingJobDemand: [''],
      walkingJobDemand: [''],
      balanceJobDemand: [''],
      ladderWorkJobDemand: [''],
      squattingJobDemand: [''],
    });
  }
  save() {
    this.jobDescriptionDetail = Object.assign({}, this.jobDescriptionForm.value);
    this.jobDescriptionDetail.id = this.id;
    this.jobDescriptionService.editJobDescription(this.jobDescriptionDetail)
      .pipe(finalize(() => { }))
      .subscribe(() => {
        this.notify.success('Updated Successfully');
        this.jobDescriptionUpdated.emit(this.jobDescriptionDetail);
        this.modalRef.hide();
      });
  }
  open(id: number) {
    this.jobDescriptionService.getDetail(id).subscribe(result => {
      this.jobDescriptionDetail = result;
      this.id = result.id;
      this.jobDescriptionForm.patchValue(result);
    });
    this.modalRef = this.modalService.show(this.content, { class: 'modal-lg' });
  }

}

import { Component, OnInit, ViewChild, ElementRef, TemplateRef, Injector, Output, EventEmitter, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { JobDescriptionServiceProxy, CreateJobDescriptionInput } from '@shared/service-proxies/service-proxies';
import { finalize, map } from 'rxjs/operators';

@Component({
  selector: 'app-new-job-description',
  templateUrl: './new-job-description.component.html',
  styleUrls: ['./new-job-description.component.scss'],
  providers: [JobDescriptionServiceProxy]
})
export class NewJobDescriptionComponent extends AppComponentBase implements OnInit {

  @ViewChild('content', { static: true }) content: ElementRef;
  @Output() jobDescriptionAddded = new EventEmitter();
  @Input() jobTitle: string;
  modalRef: BsModalRef;
  closeResult: string;
  jobDescriptionForm: FormGroup;
  jobDescriptionInput: CreateJobDescriptionInput = new CreateJobDescriptionInput();
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
      title: [this.jobTitle, Validators.required],
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
    this.jobDescriptionInput = Object.assign({}, this.jobDescriptionForm.value);
    console.log(this.jobDescriptionInput);
    this.jobDescriptionService.createJobDescription(this.jobDescriptionInput)
      .pipe(finalize(() => { }))
      .subscribe(() => {
        this.notify.success('Saved Successfully');
        this.jobDescriptionAddded.emit(this.jobDescriptionInput);
        this.modalRef.hide();
      });
  }
  open(jobTitle?) {
    this.jobDescriptionForm.get('title').setValue(jobTitle);
    this.modalRef = this.modalService.show(this.content);
  }
}

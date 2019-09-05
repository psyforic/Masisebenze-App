import { Component, OnInit, ViewChild, ElementRef, TemplateRef, Injector, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { JobDescriptionServiceProxy, CreateJobDescriptionInput } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-new-job-description',
  templateUrl: './new-job-description.component.html',
  styleUrls: ['./new-job-description.component.scss']
})
export class NewJobDescriptionComponent extends AppComponentBase implements OnInit {

  @ViewChild('content', { static: true }) content: ElementRef;
  @Output() jobDescriptionAddded = new EventEmitter();
  modalRef: BsModalRef;
  closeResult: string;
  jobDescriptionForm: FormGroup;
  jobDescriptionInput: CreateJobDescriptionInput = new CreateJobDescriptionInput();
  constructor(private injector: Injector, private modalService: BsModalService,
    private fb: FormBuilder, private jobDescriptionService: JobDescriptionServiceProxy) {
    super(injector);
  }
  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm() {
    this.jobDescriptionForm = this.fb.group({
      code: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }
  save() {
    this.jobDescriptionInput = Object.assign({}, this.jobDescriptionForm.value);
    this.jobDescriptionService.create(this.jobDescriptionInput)
      .pipe(finalize(() => { }))
      .subscribe(() => {
        this.notify.success('Saved Successfully');
        this.jobDescriptionAddded.emit(this.jobDescriptionInput);
        this.modalRef.hide();
      });
  }
  open() {
    this.modalRef = this.modalService.show(this.content);
  }
}

import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Injector, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LawFirmListDto, CreateAttorneyInput, LawFirmServiceProxy, AttorneyServiceProxy } from '@shared/service-proxies/service-proxies';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-new-attorney',
  templateUrl: './new-attorney.component.html',
  styleUrls: ['./new-attorney.component.scss'],
  providers: [AttorneyServiceProxy]
})
export class NewAttorneyComponent extends AppComponentBase implements OnInit {

  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() lawFirmId = new Input();
  @Output() attorneyAdded = new EventEmitter();
  closeResult: string;
  filter = '';
  newAttorneyForm: FormGroup;
  attorneyInput: CreateAttorneyInput = new CreateAttorneyInput();
  constructor(private injector: Injector, private modalService: NgbModal,
    private attorneyService: AttorneyServiceProxy,
    private fb: FormBuilder) {
    super(injector);
  }
  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm() {
    this.newAttorneyForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      cellPhone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      fax: [''],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]]
    });
  }
  open() {
    this.modalService.open(this.content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  save() {
    this.attorneyInput = Object.assign({}, this.newAttorneyForm.value);
    this.attorneyInput.lawFirmId = this.lawFirmId;
    this.attorneyService.create(this.attorneyInput)
      .pipe(finalize(() => { }))
      .subscribe(() => {
        this.notify.success('Saved Successfully');
        this.attorneyAdded.emit(this.attorneyInput);
        this.modalService.dismissAll();
      });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}

import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  LawFirmListDto,
  AttorneyDetailOutput,
  AttorneyServiceProxy
} from '@shared/service-proxies/service-proxies';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'kt-view-attorney',
  templateUrl: './view-attorney.component.html',
  styleUrls: ['./view-attorney.component.scss'],
  providers: [AttorneyServiceProxy]
})
export class ViewAttorneyComponent extends AppComponentBase implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  @Output() editedAttorney = new EventEmitter();
  closeResult: string;
  filter = '';
  editAttorneyForm: FormGroup;
  lawFirms: LawFirmListDto[] = [];
  attorneyInput: AttorneyDetailOutput = new AttorneyDetailOutput();
  constructor(private injector: Injector, private modalService: NgbModal,
    private attorneyService: AttorneyServiceProxy,
    private fb: FormBuilder) {
    super(injector);
  }
  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm() {
    this.editAttorneyForm = this.fb.group({
      firstName: [],
      lastName: [],
      cellphone: [],
      email: [],
      fax: [''],
      phone: [],
      lawFirm: []
    });
  }
  open(id: string) {
    this.attorneyService.getDetail(id)
      .subscribe((result) => {
        this.attorneyInput = result;
        this.editAttorneyForm.patchValue(result);
        this.editAttorneyForm.get('lawFirm').setValue(result.lawFirm.companyName);
      });
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false }).result.then(() => { });
  }
}

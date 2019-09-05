import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Injector } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CreateLawFirmInput, LawFirmServiceProxy, CreateAddressInput } from '@shared/service-proxies/service-proxies';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-new-lawfirm',
  templateUrl: './new-lawfirm.component.html',
  styleUrls: ['./new-lawfirm.component.scss'],
  providers: [LawFirmServiceProxy]
})
export class NewLawfirmComponent extends AppComponentBase implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  @Output() newContact = new EventEmitter();
  closeResult: string;
  lawFirm: CreateLawFirmInput = new CreateLawFirmInput();
  public lawFirmForm: FormGroup;
  constructor(
    private injector: Injector,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private lawFirmService: LawFirmServiceProxy) {
    super(injector);
  }
  ngOnInit(): void {
    this.initializeForm();
    // this.aliases();
  }
  initializeForm() {
    this.lawFirmForm = this.fb.group({
      companyName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      fax: ['', Validators.required],
      line1: [''],
      line2: [''],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      province: ['', Validators.required]
    });
  }
  initAddress() {
    return this.fb.group({
      line1: ['', Validators.required],
      line: [''],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      province: ['', Validators.required],
    });
  }
  addPostalAddress() {
    // add address to the list
    const control = <FormArray>this.lawFirmForm.controls['addresses'];
    control.push(this.initAddress());
  }
  open() {
    this.modalService.open(this.content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  removeAddress(i: number) {
    // remove address from the list
    const control = <FormArray>this.lawFirmForm.controls['addresses'];
    control.removeAt(i);
  }
  contactAdded() {
    this.newContact.emit(this.lawFirm);
    this.modalService.dismissAll();
  }
  save() {
    this.lawFirm = Object.assign({}, this.lawFirmForm.value);
    this.lawFirm.physicalAddress = new CreateAddressInput();
    this.lawFirm.sameAddress = true;
    this.lawFirm.physicalAddress.line1 = this.lawFirmForm.get('line1').value;
    this.lawFirm.physicalAddress.line2 = this.lawFirmForm.get('line2').value;
    this.lawFirm.physicalAddress.city = this.lawFirmForm.get('city').value;
    this.lawFirm.physicalAddress.postalCode = this.lawFirmForm.get('postalCode').value;
    this.lawFirm.physicalAddress.province = this.lawFirmForm.get('province').value;
    this.lawFirmService.create(this.lawFirm)
      .pipe(finalize(() => { }))
      .subscribe(() => {
        this.notify.success('Saved Successfully');
        this.newContact.emit(this.lawFirm);
        this.modalService.dismissAll();
      });
  }
  aliases() {
    return this.lawFirmForm.get('addresses') as FormArray;
    // return this.lawFirmForm.get('addresses') as FormArray;
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

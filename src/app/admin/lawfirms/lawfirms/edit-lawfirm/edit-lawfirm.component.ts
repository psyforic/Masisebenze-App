import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Injector } from '@angular/core';
import { LawFirmDetailOutput, LawFirmServiceProxy, CreateAddressInput } from '@shared/service-proxies/service-proxies';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-edit-lawfirm',
  templateUrl: './edit-lawfirm.component.html',
  styleUrls: ['./edit-lawfirm.component.scss']
})
export class EditLawfirmComponent extends AppComponentBase implements OnInit {

  @ViewChild('content', { static: false }) content: ElementRef;
  @Output() editedLawFirm = new EventEmitter();
  closeResult: string;
  lawFirm: LawFirmDetailOutput = new LawFirmDetailOutput();
  lawFirmId: string;
  physicalAddressId: number;
  postalAddressId: number;
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
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      fax: [''],
      line1: ['', Validators.required],
      line2: [''],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      province: ['', Validators.required]
    });
  }
  open(id: string) {
    this.lawFirmService.getDetail(id).pipe(finalize(() => {
    })).subscribe((result) => {
      this.lawFirm = result;
      this.lawFirmId = result.id;
      this.physicalAddressId = this.lawFirm.physicalAddressId;
      this.postalAddressId = this.lawFirm.postalAddressId;
      this.lawFirmForm.patchValue(result);
      this.lawFirmForm.get('line1').setValue(result.physicalAddress.line1);
      this.lawFirmForm.get('line2').setValue(result.physicalAddress.line2);
      this.lawFirmForm.get('city').setValue(result.physicalAddress.city);
      this.lawFirmForm.get('postalCode').setValue(result.physicalAddress.postalCode);
      this.lawFirmForm.get('province').setValue(result.physicalAddress.province);
    });
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then((result) => {
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
  save() {
    this.lawFirm = Object.assign({}, this.lawFirmForm.value);
    this.lawFirm.physicalAddress = new CreateAddressInput();
    this.lawFirm.physicalAddress.line1 = this.lawFirmForm.get('line1').value;
    this.lawFirm.physicalAddress.line2 = this.lawFirmForm.get('line2').value;
    this.lawFirm.physicalAddress.city = this.lawFirmForm.get('city').value;
    this.lawFirm.physicalAddress.postalCode = this.lawFirmForm.get('postalCode').value;
    this.lawFirm.physicalAddress.province = this.lawFirmForm.get('province').value;
    this.lawFirm.id = this.lawFirmId;
    this.lawFirm.physicalAddressId = this.physicalAddressId;
    this.lawFirm.postalAddressId = this.postalAddressId;
    this.lawFirmService.editLawFirm(this.lawFirm)
      .pipe(finalize(() => { }))
      .subscribe(() => {
        this.notify.success('Updated Successfully');
        this.editedLawFirm.emit(this.lawFirm);
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

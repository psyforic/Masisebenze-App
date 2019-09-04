import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CreateLawFirmInput } from '@shared/service-proxies/service-proxies';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-new-lawfirm',
  templateUrl: './new-lawfirm.component.html',
  styleUrls: ['./new-lawfirm.component.scss']
})
export class NewLawfirmComponent implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  @Output() newContact = new EventEmitter();
  closeResult: string;
  lawFirm: CreateLawFirmInput = new CreateLawFirmInput();
  public lawFirmForm: FormGroup;
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder) { }
  ngOnInit(): void {
    this.initializeForm();
    this.aliases();
  }
  initializeForm() {
    this.lawFirmForm = this.fb.group({
      companyName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      fax: ['', Validators.required],
      addresses: this.fb.array([
        this.initAddress(),
      ])

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

import { Component, OnInit, ViewChild, AfterViewInit, Injector, ElementRef, Output, EventEmitter } from '@angular/core';
import { NewContactComponent } from '../../lawfirms/new-contact/new-contact.component';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppComponentBase } from '@shared/app-component-base';
import { LawFirmServiceProxy, AttorneyServiceProxy, LawFirmListDto, CreateAttorneyInput } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

export class Contact {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    constructor() {
    }
}
@Component({
    selector: 'kt-new-attorney',
    templateUrl: './new-attorney.component.html',
    styleUrls: ['./new-attorney.component.scss'],
    providers: [LawFirmServiceProxy, AttorneyServiceProxy]
})
export class NewAttorneyComponent extends AppComponentBase implements OnInit {

    closeResult: string;
    @ViewChild('newContact', { static: false }) newContactRef: NewContactComponent;
    @ViewChild('content', { static: false }) content: ElementRef;
    @Output() attorneyAdded = new EventEmitter();
    newAttorneyForm: FormGroup;
    lawFirms: LawFirmListDto[] = [];
    attorneyInput: CreateAttorneyInput = new CreateAttorneyInput();
    constructor(private injector: Injector, private modalService: NgbModal,
        private lawFirmService: LawFirmServiceProxy,
        private attorneyService: AttorneyServiceProxy,
        private fb: FormBuilder) {
        super(injector);
    }
    ngOnInit(): void {
        this.getLawFirms();
        this.initializeForm();
    }
    initializeForm() {
        this.newAttorneyForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            cellPhone: ['', Validators.required],
            email: ['', Validators.required],
            fax: [''],
            phone: ['', Validators.required],
            lawFirmId: ['']
        });
    }
    open() {
        this.modalService.open(this.content).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    getLawFirms() {
        this.lawFirmService.getLawFirms().subscribe((result) => {
            this.lawFirms = result.items;
            console.log(result.items);
        });
    }
    save() {
        this.attorneyInput = Object.assign({}, this.newAttorneyForm.value);
        this.attorneyInput.lawFirmId = this.lawFirms[0].id;
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

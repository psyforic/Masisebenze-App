import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Injector } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppComponentBase } from '@shared/app-component-base';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
    LawFirmListDto,
    LawFirmServiceProxy,
    AttorneyServiceProxy,
    AttorneyDetailOutput,
    AttorneyListDto
} from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'kt-edit-attorney',
    templateUrl: './edit-attorney.component.html',
    styleUrls: ['./edit-attorney.component.scss'],
    providers: [LawFirmServiceProxy, AttorneyServiceProxy]
})
export class EditAttorneyComponent extends AppComponentBase implements OnInit {
    @ViewChild('content', { static: false }) content: ElementRef;
    @Output() editedAttorney = new EventEmitter();
    @Output() deletedAttorney = new EventEmitter();
    closeResult: string;
    filter = '';
    attorneyId: string;
    editAttorneyForm: FormGroup;
    lawFirms: LawFirmListDto[] = [];
    attorneyInput: AttorneyDetailOutput = new AttorneyDetailOutput();
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
        this.editAttorneyForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            cellphone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(11)]],
            email: ['', [Validators.required, Validators.email]],
            fax: [''],
            phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(11)]],
            lawFirmId: ['', Validators.required]
        });
    }
    open(id: string) {
        this.attorneyService.getDetail(id)
            .subscribe((result) => {
                this.attorneyInput = result;
                this.attorneyId = result.id;
                this.editAttorneyForm.patchValue(result);
            });
        this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false }).result.then(() => { });
    }
    getLawFirms() {
        this.lawFirmService.getLawFirms(this.filter).subscribe((result) => {
            this.lawFirms = result.items;
        });
    }
    save() {
        this.attorneyInput = Object.assign({}, this.editAttorneyForm.value);
        this.attorneyInput.id = this.attorneyId;
        this.attorneyService.editAttorney(this.attorneyInput)
            .pipe(finalize(() => { }))
            .subscribe(() => {
                this.notify.success('Saved Successfully');
                this.editedAttorney.emit(this.attorneyInput);
                this.modalService.dismissAll();
            });
    }
    delete(entity: AttorneyListDto): void {
        abp.message.confirm(
            'Delete Attorney \'' + entity.firstName + ' ' + entity.lastName + '\'?',
            (result: boolean) => {
                if (result) {
                    this.attorneyService.delete(entity.id).pipe(finalize(() => {
                        abp.notify.success('Deleted Attorney: ' + entity.firstName + ' ' + entity.lastName);
                    })).subscribe(() => {
                        this.deletedAttorney.emit(null);
                    });
                }
            }
        );
    }
}

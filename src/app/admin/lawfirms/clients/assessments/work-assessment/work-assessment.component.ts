import { finalize } from 'rxjs/operators';
import { WorkAssessmentReportServiceProxy } from './../../../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, Injector, Input, ViewChild, ElementRef, TemplateRef, Optional, Inject } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EditUserDialogComponent } from '@app/admin/users/edit-user/edit-user-dialog.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
export interface CommentInput {
  comment: string;
}
@Component({
  selector: 'app-work-assessment',
  templateUrl: './work-assessment.component.html',
  styleUrls: ['./work-assessment.component.scss'],
  providers: [WorkAssessmentReportServiceProxy]
})
export class WorkAssessmentComponent extends AppComponentBase implements OnInit {
  @Input() fullName: string;
  @Input() clientId: string;
  @Input() activity: string;
  @ViewChild('content', { static: false }) content: ElementRef;
  @ViewChild('content', { static: false }) _dialogTemplate: TemplateRef<any>;
  commentInput: CommentInput = { comment: '' };
  id: string;
  isLoading = false;
  constructor(
    private _dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private _data: any,
    injector: Injector,
    private modalService: NgbModal,
    private _workAssessmentReportService: WorkAssessmentReportServiceProxy) {
    super(injector);
  }


  ngOnInit() {
    if (this._data != null) {
      this.fullName = this._data.fullName;
      this.clientId = this._data.clientId;
      this.id = this._data.id;
      this.activity = this._data.activity;
    }
    this._workAssessmentReportService.getWeightedProtocolComment(this.id, this.activity)
      .pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe((result: string) => {
        console.log(result);
        console.log(typeof result);
        this.commentInput.comment = (result != null) ? result : '';
      });
  }
  show() {
    this.isLoading = true;
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then(() => { }, () => { });
  }
  save() {
    this.isLoading = true;
    if (this.commentInput.comment != null || this.commentInput.comment !== '') {
      this._workAssessmentReportService.updateWeightedProtocolComment(this.id, this.activity, this.commentInput.comment)
        .pipe(finalize(() => {
          this.isLoading = false;
        }))
        .subscribe(() => {
          this.notify.success('Saved Successfully');
          this.close();
        });
    }
  }
  close() {
    this.modalService.dismissAll();
    this._dialogRef.close(true);
  }

}

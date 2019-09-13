import { Component, OnInit, Optional, Injector, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';
import {
  UserServiceProxy,
  ResetPasswordDto
} from '@shared/service-proxies/service-proxies';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordDialogComponent extends AppComponentBase
  implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  public isLoading = false;
  public resetPasswordDto: ResetPasswordDto;
  _userId: number;
  constructor(
    injector: Injector,
    private _userService: UserServiceProxy,
    private modalService: NgbModal,
  ) {
    super(injector);
  }

  ngOnInit() {

  }
  open(id: number) {
    this.isLoading = true;
    this.resetPasswordDto = new ResetPasswordDto();
    this.resetPasswordDto.userId = this._userId;
    this.resetPasswordDto.newPassword = Math.random()
      .toString(36)
      .substr(2, 10);
    this.isLoading = false;
    this.modalService.open(this.content).result.then(() => { }, () => { });
  }
  public resetPassword(): void {
    this.isLoading = true;
    this._userService
      .resetPassword(this.resetPasswordDto)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.notify.info('Password Reset');
        this.modalService.dismissAll();
      });
  }
}

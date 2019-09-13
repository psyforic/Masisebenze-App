import { Component, Injector, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { PagedListingComponentBase, PagedRequestDto } from 'shared/paged-listing-component-base';
import { UserServiceProxy, UserDto, PagedResultDtoOfUserDto } from '@shared/service-proxies/service-proxies';
import { CreateUserDialogComponent } from './create-user/create-user-dialog.component';
import { EditUserDialogComponent } from './edit-user/edit-user-dialog.component';
import { Moment } from 'moment';
import { ResetPasswordDialogComponent } from './reset-password/reset-password.component';

class PagedUsersRequestDto extends PagedRequestDto {
    keyword: string;
    isActive: boolean | null;
}

@Component({
    templateUrl: './users.component.html',
    animations: [appModuleAnimation()],
    styles: [
        `
          mat-form-field {
            padding: 10px;
          }
        `
    ]
})
export class UsersComponent extends PagedListingComponentBase<UserDto> {

    @ViewChild('newUser', { static: false }) newUserRef: CreateUserDialogComponent;
    @ViewChild('editUserModal', { static: false }) editUserRef: EditUserDialogComponent;
    @ViewChild('resetPasswordModal', { static: false }) resetPasswordRef: ResetPasswordDialogComponent;
    users: UserDto[] = [];
    keyword = '';
    isActive: boolean | null;

    constructor(
        injector: Injector,
        private _userService: UserServiceProxy,
        private _dialog: MatDialog
    ) {
        super(injector);
    }

    createUser(): void {
        this.newUserRef.open();
    }

    editUser(user: UserDto): void {
        // this.showCreateOrEditUserDialog(user.id);
        this.editUserRef.open(user.id);
    }

    public resetPassword(user: UserDto): void {
        // this.showResetPasswordUserDialog(user.id);
        this.resetPasswordRef.open(user.id);
    }

    protected list(
        request: PagedUsersRequestDto,
        pageNumber: number,
        finishedCallback: Function
    ): void {

        request.keyword = this.keyword;
        request.isActive = this.isActive;

        this._userService
            .getAll(request.keyword, request.isActive, request.skipCount, request.maxResultCount)
            .pipe(
                finalize(() => {
                    finishedCallback();
                })
            )
            .subscribe((result: PagedResultDtoOfUserDto) => {
                this.users = result.items;
                this.showPaging(result, pageNumber);
            });
    }

    protected delete(user: UserDto): void {
        abp.message.confirm(
            'Are You Want to delete User ' + user.fullName + '?',
            (result: boolean) => {
                if (result) {
                    this._userService.delete(user.id).subscribe(() => {
                        abp.notify.success(this.l('SuccessfullyDeleted'));
                        this.refresh();
                    });
                }
            }
        );
    }


}

import {
  Component, Injector, OnInit, ViewChild, ElementRef, Output,
  EventEmitter
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { AppComponentBase } from '@shared/app-component-base';
import {
  UserServiceProxy,
  CreateUserDto,
  RoleDto
} from '@shared/service-proxies/service-proxies';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { } from 'events';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user-dialog.component.html',
  styles: [
    `
      mat-form-field {
        width: 100%;
      }
      mat-checkbox {
        padding-bottom: 5px;
      }
    `
  ]
})
export class CreateUserDialogComponent extends AppComponentBase
  implements OnInit {

  @ViewChild('content', { static: false }) content: ElementRef;
  @Output() userAdded = new EventEmitter();
  saving = false;
  user: CreateUserDto = new CreateUserDto();
  roles: RoleDto[] = [];
  checkedRolesMap: { [key: string]: boolean } = {};
  defaultRoleCheckedStatus = false;

  constructor(
    injector: Injector,
    public _userService: UserServiceProxy,
    private modalService: NgbModal
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.user.isActive = true;

    this._userService.getRoles().subscribe(result => {
      this.roles = result.items;
      this.setInitialRolesStatus();
    });
  }
  open() {
    this.modalService.open(this.content).result.then(() => { }, () => { });
  }
  setInitialRolesStatus(): void {
    _.map(this.roles, item => {
      this.checkedRolesMap[item.normalizedName] = this.isRoleChecked(
        item.normalizedName
      );
    });
  }

  isRoleChecked(normalizedName: string): boolean {
    // just return default role checked status
    // it's better to use a setting
    return this.defaultRoleCheckedStatus;
  }

  onRoleChange(role: RoleDto, $event: MatCheckboxChange) {
    this.checkedRolesMap[role.normalizedName] = $event.checked;
  }

  getCheckedRoles(): string[] {
    const roles: string[] = [];
    _.forEach(this.checkedRolesMap, function (value, key) {
      if (value) {
        roles.push(key);
      }
    });
    return roles;
  }

  save(): void {
    this.saving = true;

    this.user.roleNames = this.getCheckedRoles();

    this._userService
      .create(this.user)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.userAdded.emit(null);
        this.modalService.dismissAll();
      });
  }
}

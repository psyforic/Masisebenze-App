
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { Component, OnInit, Optional, Inject, Injector, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSelectChange } from '@angular/material';
import { EditUserDialogComponent } from '@app/admin/users/edit-user/edit-user-dialog.component';
export class Equipment {
  section: string;
  equipment: string;
  estimatedLifespan: string;
  approximateCost: number;
}
@Component({
  selector: 'app-new-equipment',
  templateUrl: './new-equipment.component.html',
  styleUrls: ['./new-equipment.component.scss']
})
export class NewEquipmentComponent extends AppComponentBase implements OnInit {
  @Input() fullName: string;
  @Input() clientId: string;
  isLoading = false;
  equipmentForm: FormGroup;
  sections = [
    { id: '1', text: 'Bathroom' }
  ];
  isNewSection = false;
  equipment: Equipment = new Equipment();
  constructor(
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private _data: any,
    private injector: Injector,
  ) {
    super(injector);
    this.initializeForm();
  }

  ngOnInit() {
    if (this._data != null) {
      this.fullName = this._data.fullName;
      this.clientId = this._data.clientId;
    }
  }
  initializeForm() {
    this.equipmentForm = this._fb.group({
      section: [undefined, Validators.required],
      newSection: [''],
      name: ['', Validators.required],
      estimatedLifespan: ['', Validators.required],
      approximateCost: ['', Validators.required]
    });
  }
  save() {
    if (this.isNewSection) {
      this.equipment.section = this.equipmentForm.get('newSection').value;
    } else {
      this.equipment.section = this.equipmentForm.get('section').value;
    }
    this.equipment.equipment = this.equipmentForm.get('name').value;
    this.equipment.estimatedLifespan = this.equipmentForm.get('estimatedLifespan').value;
    this.equipment.approximateCost = this.equipmentForm.get('approximateCost').value;
    this.close(this.equipment);
  }
  sectionSelected(event: MatSelectChange) {
    if (event.value === 'new') {
      this.isNewSection = true;
    } else {
      this.isNewSection = false;
    }
  }
  close(result: Equipment) {
    this._dialogRef.close(result);
  }
}

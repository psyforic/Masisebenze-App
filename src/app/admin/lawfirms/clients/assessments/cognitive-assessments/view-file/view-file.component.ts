import { Observable } from 'rxjs';
import { FileUrlDto } from './../../../../../../../shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { Component, OnInit, Input, Injector, Optional, Inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EditUserDialogComponent } from '@app/admin/users/edit-user/edit-user-dialog.component';
import { MatBasicAudioPlayerComponent } from 'ngx-audio-player';
@Component({
  selector: 'app-view-file',
  templateUrl: './view-file.component.html',
  styleUrls: ['./view-file.component.scss']
})
export class ViewFileComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @Input() fullName: string;
  @Input() clientId: string;
  @ViewChild('images', {static: false}) images: ElementRef;
  @ViewChild('audioOption', {static: false}) audioOption: ElementRef;
  isLoading = false;
  msbapTitle = 'Audio Title';
  msbapAudioUrl = 'Link to audio URL';
  msbapDisplayTitle = false;
  msbapDisplayVolumeControls = true;
  files: FileUrlDto[] = [];
  file: Observable<string[]>;
  constructor(
    injector: Injector,
    private _dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private _data: any) {
    super(injector);
   }
  ngAfterViewInit() {
    // this.audioOption.nativeElement.play();
  }
  ngOnInit() {
    if (this._data != null) {
      this.fullName = this._data.fullName;
      this.clientId = this._data.clientId;
      this.files = this._data.files;
    }
  }
  onEnded(event) {
    console.log(event);
  }
  close() {
    this._dialogRef.close();
  }
}

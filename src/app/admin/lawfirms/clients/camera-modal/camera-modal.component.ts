import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-camera-modal',
  templateUrl: './camera-modal.component.html',
  styleUrls: ['./camera-modal.component.scss']
})
export class CameraModalComponent extends AppComponentBase implements OnInit {

  @ViewChild('content', { static: false }) content: ElementRef;
  @Output()
  public pictureTaken = new EventEmitter<WebcamImage>();
  @Output() pictureUpload = new EventEmitter;
  public webcamImage: WebcamImage = null;
  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];
  public imageChangedEvent: any = '';
  public croppedImage: any = '';
  showCropper = false;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  constructor(private injector: Injector,
    private modalService: NgbModal) {
    super(injector);
  }
  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }
  open() {
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then(() => { }, () => { });
  }
  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }
  public handleImage(event): void {
    this.imageChangedEvent = event;
    const webcamImage = event as WebcamImage;
    console.log('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    // this.showCropper = true;
    this.pictureTaken.emit(webcamImage);
  }
  uploadImage(webcamImage: WebcamImage) {
    this.pictureUpload.emit(webcamImage.imageAsDataUrl);
    this.modalService.dismissAll();
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded');
  }
  cropperReady() {
    console.log('Cropper ready');
  }
  loadImageFailed() {
    console.log('Load failed');
  }
}

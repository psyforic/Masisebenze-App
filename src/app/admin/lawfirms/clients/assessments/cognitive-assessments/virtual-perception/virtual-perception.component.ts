import { AppComponentBase } from '@shared/app-component-base';
import { Component, OnInit, ViewChild, ElementRef, Input, Injector } from '@angular/core';
import { CognitiveServiceProxy, CognitiveParentDto } from '@shared/service-proxies/service-proxies';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-virtual-perception',
  templateUrl: './virtual-perception.component.html',
  styleUrls: ['./virtual-perception.component.scss'],
  providers: [CognitiveServiceProxy]
})
export class VirtualPerceptionComponent extends AppComponentBase implements OnInit  {
  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() clientId: string;
  @Input() fullName: string;
  isLoading = false;
  attentionAndConcentration: CognitiveParentDto = new CognitiveParentDto();
  constructor(
    private injector: Injector,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _cognitiveService: CognitiveServiceProxy) {
    super(injector);
  }

  ngOnInit() {
  }
  open() {
    this.getVertualPerception();
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false, size: 'xl' })
      .result.then(() => { }, () => { });
  }
  close() {
    this.activeModal.close();
  }
  save(cognitive: CognitiveParentDto) {
    this.isLoading = true;
    if (cognitive != null) {
        this._cognitiveService.updateCognitiveComment(cognitive)
        .pipe(finalize(() => {
            this.isLoading = false;
        }))
        .subscribe(() => {
          this.notify.success('Saved successfully!');
        });
    }
  }
  getVertualPerception() {
    this.isLoading = true;
    this._cognitiveService.getVirtualPerception(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        console.log(result)
        // if (result != null && result.options != null) {
        //   this.attentionAndConcentration = result;
        //   if (result.options.items != null) {
        //     result.options.items.forEach( (item, index) => {
        //       if (item.position >= 1 && item.position <= 5) {
        //         (item.score !== -1) ? this.totalOfSubtraction += item.score : this.totalOfSubtraction += 0;
        //       } else if (item.position > 6 && item.position <= 9) {

        //         (item.score !== -1) ? this.totalOfSpelling += item.score : this.totalOfSpelling += 0;
        //       }
        //     });
        //   }
        // }
        // this.coordinationOptions = result.items;
      });
  }
}

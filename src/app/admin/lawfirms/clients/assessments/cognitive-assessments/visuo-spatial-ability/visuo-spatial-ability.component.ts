import { OptionListDto, CognitiveParentDto } from './../../../../../../../shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from 'shared/app-component-base';
import { Component, OnInit, ViewChild, ElementRef, Input, Injector } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AssessmentServiceProxy, CognitiveServiceProxy, CalculationsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AssessmentService } from '@app/admin/services/assessment.service';

@Component({
  selector: 'app-visuo-spatial-ability',
  templateUrl: './visuo-spatial-ability.component.html',
  styleUrls: ['./visuo-spatial-ability.component.scss'],
  providers: [CognitiveServiceProxy, CalculationsServiceProxy]
})
export class VisuoSpatialAbilityComponent extends AppComponentBase implements OnInit {

  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() clientId: string;
  @Input() fullName: string;
  visuoSpatialAbilities: CognitiveParentDto = new CognitiveParentDto();
  isLoading = false;
  comment;
  visuoSpatialOptions: OptionListDto[] = [];
  constructor(private injector: Injector,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _assessmentService: AssessmentServiceProxy,
    private _cognitiveService: CognitiveServiceProxy,
    private generalService: AssessmentService,
    private calculationService: CalculationsServiceProxy) {
    super(injector);
  }

  ngOnInit() {
  }
  open() {
    this.getVisuoSpatialAbility();
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then(() => { }, () => { });
  }
  save() {
    this.isLoading = true;
    this._cognitiveService.updateCognitiveComment(this.visuoSpatialAbilities).
    pipe(finalize(() => {
      this.isLoading = false;
    })).subscribe(() => {
      this.notify.success('Saved successfully!');
    });
  }
  close() {
    this.activeModal.close();
  }
  getVisuoSpatialAbility() {
    this.isLoading = true;
    this.visuoSpatialOptions = [];
    this._cognitiveService.getVisuoSpatialAbility(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe(result => {
        if (result != null && result.options != null && result.options.items != null) {
          this.visuoSpatialAbilities = result;
          this.visuoSpatialOptions = result.options.items;
        }
      });
  }
}

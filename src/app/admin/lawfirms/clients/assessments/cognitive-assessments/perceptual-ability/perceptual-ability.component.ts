import { CommentDetailOutput, CognitiveParentDto } from './../../../../../../../shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { Component, OnInit, ViewChild, ElementRef, Input, Injector } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AssessmentServiceProxy, CognitiveServiceProxy, CalculationsServiceProxy } from '@shared/service-proxies/service-proxies';
import { AssessmentService } from '@app/admin/services/assessment.service';
import { TableRowHeightAttributes } from 'docx';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-perceptual-ability',
  templateUrl: './perceptual-ability.component.html',
  styleUrls: ['./perceptual-ability.component.scss'],
  providers: [CognitiveServiceProxy, CalculationsServiceProxy]
})
export class PerceptualAbilityComponent extends AppComponentBase implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() clientId: string;
  @Input() fullName: string;
  isLoading = false;
  comment;
  totalOfImages = 0;
  totalOfLetters = 0;
  perceptualAbility: CognitiveParentDto = new CognitiveParentDto();
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
    this.getPerceptalAbility();
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then(() => { }, () => { });
  }
  close() {
    this.activeModal.close();
  }
  save() {
  }
  getPerceptalAbility() {
    this.isLoading = true;
    this._cognitiveService.getPerceptualAbility(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe(result => {
        if (result != null && result.options != null && result.options.items != null) {
          this.perceptualAbility = result;
          result.options.items.forEach((item) => {
            if (item.position < 5) {
              this.totalOfImages += item.score;
            } else {
              this.totalOfLetters += item.score;
            }
          });
        }
      });
  }
}
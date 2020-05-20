import { CognitiveCommentComponent } from './cognitive-comment/cognitive-comment.component';
import { SelectedAssessmentsDto } from './../../../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AssessmentsListListDto, AssessmentServiceProxy, 
  CognitiveServiceProxy, CognitiveParentDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { MatTableDataSource, MatPaginator } from '@angular/material';
interface formattedSelectedAssessments{
  name: string;
  id: string;
  score: number;
  totalScore: number;
}
@Component({
  selector: 'app-cognitive-assessments',
  templateUrl: './cognitive-assessments.component.html',
  styleUrls: ['./cognitive-assessments.component.scss'],
  providers: [AssessmentServiceProxy, CognitiveServiceProxy]
})
export class CognitiveAssessmentsComponent implements OnInit {
  @Input() categoryId: string;
  @Input() clientId: string;
  @Input() fullName: string;
  @ViewChild('cognitiveComment', {static: false}) cognitiveComment: CognitiveCommentComponent;
  displayedColumns: string[] = ['name', 'score'];
  
  selectedAssessments: SelectedAssessmentsDto[] = [];
  dataSource = new MatTableDataSource<SelectedAssessmentsDto>();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  isLoading = false;
  MAX_STEP = 0;
  current_step = 0;
  comment;
  totalScore = 0;

  constructor(
    private _cognitiveService: CognitiveServiceProxy,
    private _assessmentService: AssessmentServiceProxy,
  ) { }

  ngOnInit() {
  }
  next() {
    if (this.current_step !== this.MAX_STEP) {
      this.current_step++;
    }
  }
  prev() {
    if (this.current_step !== 0) {
      this.current_step--;
    }
  }
  getSelectedAssessments(categoryId: string) {
    this.selectedAssessments = [];
    this.totalScore = 0;
    this.isLoading = true;
    if (categoryId != null) {
      this._cognitiveService.getSelectedAssessments(this.clientId, categoryId)
        .pipe(finalize(() => {
          this.isLoading = false;
        }))
        .subscribe(assessments => {
          this.selectedAssessments = assessments;
          this.dataSource = new MatTableDataSource<SelectedAssessmentsDto>();
          this.dataSource.data = this.selectedAssessments;
          this.dataSource.paginator = this.paginator;
          if(this.selectedAssessments.length > 0){
            this.selectedAssessments.forEach((item, index) => {
                this.totalScore += item.score;
            });
            this.MAX_STEP = this.selectedAssessments.length;
          }

        });
    }
  }
  show(categoryId) {
    this.getSelectedAssessments(categoryId);
  }
  showComment(){
    this.cognitiveComment.show();
  }
  viewCognitiveAssessments(assessmentName: string) {
    switch (assessmentName) {
      case 'Attention':
        // this.getAttentionAndConcentration();
        break;
      case 'Alternating And Trail Making':
        // this.getLanguage();
        break;
      case 'Memory':
        // this.getMemory();
        break;
      case 'Orientation':
        // this.getOrientation();
        break;
      case 'Registration':
        // this.getRegistration();
        break;
      case 'Vigilance':
        // this.getPerceptualAbility();
        break;
      case 'Visuoconstructional Skills':
        // this.getVisuoSpatialAbility();
        break;
      case 'Verbal Fluency':
        // this.getVerbalFluency();
        break;
      case 'Serial Sevens':
        // this.getVitualPreception();
        break;
      case 'Sentence Repetition':
        break;
      case 'Naming':
        break;
      case 'Abstraction':
        break;
      case 'Delayed recall':
        break;
    }
  }
}

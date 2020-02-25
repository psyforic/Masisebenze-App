import { QuestionnaireComponent } from './functional-assessment/questionnaire/questionnaire.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentsComponent } from './assessments.component';
import { GripStrengthComponent } from './grip-strength/grip-strength.component';
import { MusclePowerComponent } from './muscle-power/muscle-power.component';
import { RangeOfMotionComponent } from './range-of-motion/range-of-motion.component';
import { BorgBalanceComponent } from './borg-balance/borg-balance.component';
import { SensationComponent } from './sensation/sensation.component';
import { CoordinationComponent } from './coordination/coordination.component';
import { PostureComponent } from './posture/posture.component';
import { RepetitiveToleranceProtocolComponent } from './repetitive-tolerance-protocol/repetitive-tolerance-protocol.component';
import { GaitComponent } from './gait/gait.component';
import { PartialsModule } from '@app/admin/partials/partials.module';
import { MobilityComponent } from './mobility/mobility.component';
import { AffectComponent } from './affect/affect.component';
import { FunctionalAssessmentComponent } from './functional-assessment/functional-assessment.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    CommonModule,
    PartialsModule,
    PerfectScrollbarModule
  ],
  declarations: [
    AssessmentsComponent,
    GripStrengthComponent,
    MusclePowerComponent,
    RangeOfMotionComponent,
    BorgBalanceComponent,
    SensationComponent,
    CoordinationComponent,
    PostureComponent,
    RepetitiveToleranceProtocolComponent,
    GaitComponent,
    MobilityComponent,
    AffectComponent,
    FunctionalAssessmentComponent,
    QuestionnaireComponent
  ],

  exports: [GripStrengthComponent,
    MusclePowerComponent,
    RangeOfMotionComponent,
    BorgBalanceComponent,
    SensationComponent,
    CoordinationComponent,
    PostureComponent,
    RepetitiveToleranceProtocolComponent,
    GaitComponent,
    MobilityComponent,
    AffectComponent,
    FunctionalAssessmentComponent,
    QuestionnaireComponent,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  entryComponents: [
    GripStrengthComponent,
    MusclePowerComponent,
    RangeOfMotionComponent,
    BorgBalanceComponent,
    SensationComponent,
    CoordinationComponent,
    PostureComponent,
    RepetitiveToleranceProtocolComponent,
    GaitComponent]
})
export class AssessmentsModule { }

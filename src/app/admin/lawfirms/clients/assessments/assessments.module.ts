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

@NgModule({
  imports: [
    CommonModule,
    PartialsModule
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
    AffectComponent],

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
    AffectComponent],

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

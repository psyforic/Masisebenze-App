import { VisuoSpatialAbilityComponent } from './visuo-spatial-ability/visuo-spatial-ability.component';
import { VerbalFluencyComponent } from './verbal-fluency/verbal-fluency.component';
import { RegistrationComponent } from './registration/registration.component';
import { PerceptualAbilityComponent } from './perceptual-ability/perceptual-ability.component';
import { OrientationComponent } from './orientation/orientation.component';
import { MemoryComponent } from './memory/memory.component';
import { LanguageComponent } from './language/language.component';
import { AttentionAndConcentrationComponent } from './attention-and-concentration/attention-and-concentration.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CognitiveAssessmentsComponent } from './cognitive-assessments.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatTabsModule, MatInputModule } from '@angular/material';
import { PartialsModule } from '@app/admin/partials/partials.module';
import { VirtualPerceptionComponent } from './virtual-perception/virtual-perception.component';

@NgModule({
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    PartialsModule
  ],
  declarations: [
  CognitiveAssessmentsComponent,
  AttentionAndConcentrationComponent,
  LanguageComponent,
  MemoryComponent,
  OrientationComponent,
  PerceptualAbilityComponent,
  RegistrationComponent,
  VerbalFluencyComponent,
  VisuoSpatialAbilityComponent,
  VirtualPerceptionComponent
],
  exports: [
    AttentionAndConcentrationComponent,
    LanguageComponent,
    MemoryComponent,
    OrientationComponent,
    PerceptualAbilityComponent,
    RegistrationComponent,
    VerbalFluencyComponent,
    VisuoSpatialAbilityComponent,
    VirtualPerceptionComponent
  ],
  providers: [

  ],
  entryComponents: [

  ]
})
export class CognitiveAssessmentsModule { }

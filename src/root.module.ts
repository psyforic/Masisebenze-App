import { AssessmentReportService } from './app/admin/services/assessment-report.service';
import { SensationComponent } from './app/admin/lawfirms/clients/assessments/sensation/sensation.component';
import { PostureServiceProxy, GripStrengthServiceProxy, BorgBalanceServiceProxy, MusclePowerServiceProxy, GaitServiceProxy, SensationServiceProxy, CoordinationServiceProxy, ClientServiceProxy, DocumentServiceProxy, ReportSummaryServiceProxy, ClientAssessmentReportServiceProxy, WorkAssessmentReportServiceProxy, AffectServiceProxy, MobilityServiceProxy } from './shared/service-proxies/service-proxies';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injector, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { PlatformLocation, registerLocaleData } from '@angular/common';

import { AbpModule } from '@abp/abp.module';
import { AbpHttpInterceptor } from '@abp/abpHttpInterceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { SharedModule } from '@shared/shared.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { RootRoutingModule } from './root-routing.module';

import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from '@shared/session/app-session.service';
import {
    API_BASE_URL,
    AssessmentServiceProxy,
    RangeOfMotionServiceProxy,
    WalkingProtocolServiceProxy,
    BalanceProtocolServiceProxy,
    StairClimbingProtocolServiceProxy,
    LadderWorkProtocolServiceProxy,
    RepetitiveSquattingProtocolServiceProxy,
    RepetitiveFootMotionProtocolServiceProxy,
    CrawlingProtocolServiceProxy,
    ReportServiceProxy,
    FunctionalAssessmentServiceProxy
} from '@shared/service-proxies/service-proxies';

import { RootComponent } from './root.component';
import { AppPreBootstrap } from './AppPreBootstrap';
import { ModalModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { GestureConfig } from '@angular/material';

import * as _ from 'lodash';
import { environment } from 'environments/environment';
import { GeneralService } from '@app/admin/services/general.service';

export function appInitializerFactory(injector: Injector,
    platformLocation: PlatformLocation) {
    return () => {

        abp.ui.setBusy();
        return new Promise<boolean>((resolve, reject) => {
            AppConsts.appBaseHref = getBaseHref(platformLocation);
            const appBaseUrl = getDocumentOrigin() + AppConsts.appBaseHref;

            AppPreBootstrap.run(appBaseUrl, () => {
                abp.event.trigger('abp.dynamicScriptsInitialized');
                const appSessionService: AppSessionService = injector.get(AppSessionService);
                appSessionService.init().then(
                    (result) => {
                        abp.ui.clearBusy();

                        if (shouldLoadLocale()) {
                            const angularLocale = convertAbpLocaleToAngularLocale(abp.localization.currentLanguage.name);
                            import(`@angular/common/locales/${angularLocale}.js`)
                                .then(module => {
                                    registerLocaleData(module.default);
                                    resolve(result);
                                }, reject);
                        } else {
                            resolve(result);
                        }
                    },
                    (err) => {
                        abp.ui.clearBusy();
                        reject(err);
                    }
                );
            });
        });
    };
}

export function convertAbpLocaleToAngularLocale(locale: string): string {
    if (!AppConsts.localeMappings) {
        return locale;
    }

    const localeMapings = _.filter(AppConsts.localeMappings, { from: locale });
    if (localeMapings && localeMapings.length) {
        return localeMapings[0]['to'];
    }

    return locale;
}

export function shouldLoadLocale(): boolean {
    return abp.localization.currentLanguage.name && abp.localization.currentLanguage.name !== 'en-US';
}

export function getRemoteServiceBaseUrl(): string {
    return AppConsts.remoteServiceBaseUrl;
}

export function getCurrentLanguage(): string {
    if (abp.localization.currentLanguage.name) {
        return abp.localization.currentLanguage.name;
    }

    // todo: Waiting for https://github.com/angular/angular/issues/31465 to be fixed.
    return 'en';
}

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        SharedModule.forRoot(),
        ModalModule.forRoot(),
        AbpModule,
        ServiceProxyModule,
        RootRoutingModule,
        HttpClientModule,
        AngularFireModule.initializeApp(environment.firebase, 'MasisebenzeFCE'),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireStorageModule,
    ],
    declarations: [
        RootComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AbpHttpInterceptor, multi: true },
        { provide: API_BASE_URL, useFactory: getRemoteServiceBaseUrl },
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            deps: [Injector, PlatformLocation],
            multi: true
        },
        {
            provide: LOCALE_ID,
            useFactory: getCurrentLanguage
        },
        { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
        AssessmentServiceProxy, RangeOfMotionServiceProxy, WalkingProtocolServiceProxy,
        BalanceProtocolServiceProxy, StairClimbingProtocolServiceProxy, LadderWorkProtocolServiceProxy,
        RepetitiveSquattingProtocolServiceProxy, RepetitiveFootMotionProtocolServiceProxy,
        CrawlingProtocolServiceProxy, ReportServiceProxy, PostureServiceProxy, GripStrengthServiceProxy,
        BorgBalanceServiceProxy, MusclePowerServiceProxy, GaitServiceProxy, SensationServiceProxy, CoordinationServiceProxy,
        AssessmentReportService, ClientServiceProxy, DocumentServiceProxy, ReportServiceProxy, ReportSummaryServiceProxy,
        ClientAssessmentReportServiceProxy, WorkAssessmentReportServiceProxy, GeneralService, AffectServiceProxy, MobilityServiceProxy,
        SensationServiceProxy
    ],
    bootstrap: [RootComponent]
})

export class RootModule {

}

export function getBaseHref(platformLocation: PlatformLocation): string {
    const baseUrl = platformLocation.getBaseHrefFromDOM();
    if (baseUrl) {
        return baseUrl;
    }

    return '/';
}

function getDocumentOrigin() {
    if (!document.location.origin) {
        const port = document.location.port ? ':' + document.location.port : '';
        return document.location.protocol + '//' + document.location.hostname + port;
    }

    return document.location.origin;
}

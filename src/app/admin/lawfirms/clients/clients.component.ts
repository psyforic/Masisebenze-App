import { SensationServiceProxy, PostureServiceProxy, ClientAssessmentReportServiceProxy, AssessmentReportDto } from './../../../../shared/service-proxies/service-proxies';
import { Component, ViewChild, Injector } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import {
  ClientListDto,
  ClientServiceProxy,
  WorkHistoryListDto,
  MedicalHistoryListDto,
  CreateAddressInput,
  DocumentServiceProxy,
  DocumentListDto,
  WorkHistoryDetailOutput,
  ClientDetailOutput,
  ReportServiceProxy,
  ReportGripStrength,
  ReportRoMShoulderDto,
  ReportRoMForearmWristDto,
  ReportRoMElbowDto,
  ReportRoMHandDto,
  ReportRoMHipDto,
  ReportRoMKneeDto,
  ReportRoMAnkleDto,
  AssessmentServiceProxy,
  AffectServiceProxy,
  MobilityServiceProxy,
  AffectDto,
  MobilityDto,
} from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import { NewClientComponent } from './new-client/new-client.component';
import { DocumentCreator } from '@app/admin/partials/document-creator';
import * as moment from 'moment';
import { GeneralService } from '@app/admin/services/general.service';
import { Subject, Observable } from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  providers: [ClientServiceProxy, DocumentServiceProxy, ReportServiceProxy,
    MobilityServiceProxy, AffectServiceProxy, SensationServiceProxy, PostureServiceProxy,
    ClientAssessmentReportServiceProxy]
})
export class ClientsComponent extends PagedListingComponentBase<ClientListDto>  {

  @ViewChild('newClient', { static: false }) newClientRef: NewClientComponent;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  dataSource: MatTableDataSource<ClientListDto>;
  displayedColumns = ['firstName', 'lastName', 'dob', 'age', 'dateOfInjury', 'actions'];
  clients: ClientListDto[] = []; client: ClientListDto;
  workData: WorkHistoryListDto = new WorkHistoryDetailOutput();
  medicalData: MedicalHistoryListDto = new MedicalHistoryListDto();
  isSaving = false; isGenerating = false; documents: DocumentListDto[] = [];
  filteredDocuments; lawFirmCity: string;
  gripStrengthReport: ReportGripStrength;
  musclePowerReport: string;
  shoulderLeftReport: ReportRoMShoulderDto = new ReportRoMShoulderDto();
  shoulderRightReport: ReportRoMShoulderDto = new ReportRoMShoulderDto();
  forearmWristLeftReport: ReportRoMForearmWristDto = new ReportRoMForearmWristDto();
  forearmWristRightReport: ReportRoMForearmWristDto = new ReportRoMForearmWristDto();
  elbowLeftReport: ReportRoMElbowDto = new ReportRoMElbowDto();
  elbowRightReport: ReportRoMElbowDto = new ReportRoMElbowDto();
  handLeftReport: ReportRoMHandDto = new ReportRoMHandDto();
  handRightReport: ReportRoMHandDto = new ReportRoMHandDto();
  hipLeftReport: ReportRoMHipDto = new ReportRoMHipDto();
  hipRightReport: ReportRoMHipDto = new ReportRoMHipDto();
  kneeLeftReport: ReportRoMKneeDto = new ReportRoMKneeDto();
  kneeRightReport: ReportRoMKneeDto = new ReportRoMKneeDto();
  ankleLeftReport: ReportRoMAnkleDto = new ReportRoMAnkleDto();
  ankleRightReport: ReportRoMAnkleDto = new ReportRoMAnkleDto();
  borgBalanceReport: string; sensation: string; affectComment: string;
  mobilityComment: string; coordinationReport: string; postureReport: string;
  gaitReport: string; walkingReport: string; stairClimbing: string;
  balanceReport: string; ladderWork: string; repetitiveSquatting: string;
  repetitiveFootMotionReport: string; crawlingReport: string;

  assessmentReport: any[] = [];
  rangeOfMotionReport: any[] = [];
  comment: string;
  affect: AffectDto = new AffectDto();
  mobility: MobilityDto = new MobilityDto();
  searchTerm$ = new Subject<string>();
  searchTerm: FormControl = new FormControl();
  isSearching = false;

  constructor(injector: Injector,
    private clientService: ClientServiceProxy,
    private documentService: DocumentServiceProxy,
    private _reportService: ReportServiceProxy,
    private _assessmentReportService: ClientAssessmentReportServiceProxy,
    private _generalService: GeneralService,
    private _affectService: AffectServiceProxy,
    private _mobilityService: MobilityServiceProxy,
    private _sensationService: SensationServiceProxy,
    private _posrureService: PostureServiceProxy,
    private _assessmentService: AssessmentServiceProxy) {
    super(injector);
    this.searchClients();
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
  searchClients() {
    this.searchTerm.valueChanges
      .debounceTime(400)
      .subscribe(data => {
        this.isSearching = true;
        this.clientService.clientSearch(data).pipe(finalize(() => {
          this.isSearching = false;
        }))
          .subscribe(result => {
            this.clients = result.items;
            this.dataSource.data = this.clients;
            this.totalItems = this.clients.length;
            this.pageSize = 5;
          });
      });
  }

  createClient() {
    this.newClientRef.open();
  }
  generate(client) {
    let entity: ClientDetailOutput = new ClientDetailOutput();
    this._reportService.getPersonalDetails(client.id).pipe(finalize(() => {
      const address: CreateAddressInput = new CreateAddressInput();
      const age = this._generalService.getAge('' + client.idNumber);
      const gender = this._generalService.getGender('' + client.idNumber);
      this.isGenerating = true;
      this._assessmentReportService.getAssessmentReport(entity.id, gender, age)
        .pipe(finalize(() => {
          console.log(this.assessmentReport);
          this.isGenerating = false;
          // const docCreator = new DocumentCreator();
          // // setTimeout(async () => {
          //    this.generateDocument(docCreator, entity, entity.address)
          //     .then(() => {
          //       // this.notify.success('Saved Successfully', 'Success');
          //       this.isGenerating = false;
          //     })
          //     .catch(error => {
          //       this.notify.error('An Error Occurred Please Try Again to Download');
          //     });
          // }, 20000);
        }))
        .subscribe((result) => {
          console.log(result);
          /***************************************************************************************
           * COGNITIVE ASSESSMENT REPORT SECTION
           ****************************************************************************************/
          this.gripStrengthReport = result.reportGripStrength;
          this.assessmentReport[0] = result.reportGripStrength;

          this.musclePowerReport = result.musclePowerReport;
          this.assessmentReport[1] = result.musclePowerReport;

          this.shoulderLeftReport = result.reportRoMShoulder.filter(x => x.side === 0)[0];
          this.rangeOfMotionReport[0] = result.reportRoMShoulder.filter(x => x.side === 0)[0];
          this.shoulderRightReport = result.reportRoMShoulder.filter(x => x.side === 1)[0];
          this.rangeOfMotionReport[1] = result.reportRoMShoulder.filter(x => x.side === 1)[0];

          this.forearmWristLeftReport = result.reportRoMForearmWrist.filter(x => x.side === 0)[0];
          this.rangeOfMotionReport[2] = result.reportRoMForearmWrist.filter(x => x.side === 0)[0];
          this.forearmWristRightReport = result.reportRoMForearmWrist.filter(x => x.side === 1)[0];
          this.rangeOfMotionReport[3] = result.reportRoMForearmWrist.filter(x => x.side === 1)[0];

          this.elbowLeftReport = result.reportRoMElbow.filter(x => x.side === 0)[0];
          this.rangeOfMotionReport[4] = result.reportRoMElbow.filter(x => x.side === 0)[0];
          this.elbowRightReport = result.reportRoMElbow.filter(x => x.side === 1)[0];
          this.rangeOfMotionReport[5] = result.reportRoMElbow.filter(x => x.side === 1)[0];

          this.handLeftReport = result.reportRoMHand.filter(x => x.side === 0)[0];
          this.rangeOfMotionReport[6] = result.reportRoMHand.filter(x => x.side === 0)[0];
          this.handRightReport = result.reportRoMHand.filter(x => x.side === 1)[0];
          this.rangeOfMotionReport[7] = result.reportRoMHand.filter(x => x.side === 1)[0];

          this.hipLeftReport = result.reportRoMHip.filter(x => x.side === 0)[0];
          this.rangeOfMotionReport[8] = result.reportRoMHip.filter(x => x.side === 0)[0];
          this.hipRightReport = result.reportRoMHip.filter(x => x.side === 1)[0];
          this.rangeOfMotionReport[9] = result.reportRoMHip.filter(x => x.side === 1)[0];

          this.kneeLeftReport = result.reportRoMKnee.filter(x => x.side === 0)[0];
          this.rangeOfMotionReport[10] = result.reportRoMKnee.filter(x => x.side === 0)[0];
          this.kneeRightReport = result.reportRoMKnee.filter(x => x.side === 1)[0];
          this.rangeOfMotionReport[11] = result.reportRoMKnee.filter(x => x.side === 1)[0];

          this.ankleLeftReport = result.reportRoMAnkle.filter(x => x.side === 0)[0];
          this.rangeOfMotionReport[12] = result.reportRoMAnkle.filter(x => x.side === 0)[0];
          this.ankleRightReport = result.reportRoMAnkle.filter(x => x.side === 1)[0];
          this.rangeOfMotionReport[13] = result.reportRoMAnkle.filter(x => x.side === 1)[0];

          this.borgBalanceReport = result.borgBalanceReport;
          this.assessmentReport[9] = result.borgBalanceReport;

          this.coordinationReport = result.coordinationReport;
          this.assessmentReport[13] = result.coordinationReport;

          this.postureReport = result.postureReport;
          this.assessmentReport[14] = result.postureReport;

          this.gaitReport = result.gaitReport;
          this.assessmentReport[15] = result.gaitReport;

          this.walkingReport = result.walkingProtocolReport;
          this.assessmentReport[16] = result.walkingProtocolReport;

          this.stairClimbing = result.stairClimbingProtocolReport;
          this.assessmentReport[17] = result.stairClimbingProtocolReport;

          this.balanceReport = result.balanceProtocolReport;
          this.assessmentReport[18] = result.balanceProtocolReport;

          this.ladderWork = result.ladderWorkProtocolReport;
          this.assessmentReport[19] = result.ladderWorkProtocolReport;

          this.repetitiveSquatting = result.repetitiveSquattingProtocolReport;
          this.assessmentReport[20] = result.repetitiveSquattingProtocolReport;

          this.repetitiveFootMotionReport = result.repetitiveFootMotionProtocolReport;
          this.assessmentReport[21] = result.repetitiveFootMotionProtocolReport;

          this.crawlingReport = result.crawlingProtocolReport;
          this.assessmentReport[22] = result.crawlingProtocolReport;

          /***************************************************************************************
           * COGNITIVE ASSESSMENT REPORT SECTION
           ****************************************************************************************/
          this.assessmentReport[23] = result.attentionAndConcentration.comment;
          if (gender === 0) {
            this.assessmentReport[24] = 'She';
          } else if (gender === 1) {
            this.assessmentReport[24] = 'He';
          }
          this.assessmentReport[25] = (result.shortTermMemory != null &&
            result.shortTermMemory.score != null) ? result.shortTermMemory.score : -1;
          this.assessmentReport[26] = (result.shortTermMemory != null &&
            result.shortTermMemory.score != null) ? result.shortTermMemory.totalScore : -1;
          this.assessmentReport[27] = (result.shortTermMemory !== null &&
            result.shortTermMemory.comment !== null) ? result.shortTermMemory.memoryAssessmentType : 'NONE';
          this.assessmentReport[28] = (result.longTermMemory != null) ? result.longTermMemory.comment : 'No Comment';
          this.assessmentReport[29] = (result.insight != null) ? result.insight.comment : 'No Comment';
          this.assessmentReport[30] = (result.reading != null) ? result.reading.comment : 'No Comment';
          this.assessmentReport[31] = (result.speech != null) ? result.speech.comment : 'No Comment';
          this.assessmentReport[32] = (result.writing != null) ? result.writing.comment : 'No Comment';
          this.assessmentReport[33] = (result.visualPerception != null) ? result.visualPerception.comment : 'No Comment';
        });
      this.getReportData(client.id, age, gender);
    })).subscribe((result) => {
      entity = result;
      this.lawFirmCity = entity.address.city;
      this.getMedicalHistory(client.id);
      this.getWorkHistory(client.id);
      this.getClientHistory(client.id);
      this.getFileData(client.id);

    });



    // const docCreator = new DocumentCreator();
    // setTimeout(async () => {
    //   await this.generateDocument(docCreator, entity, entity.address)
    //     .then(() => {
    //       // this.notify.success('Saved Successfully', 'Success');
    //       this.isGenerating = false;
    //     })
    //     .catch(error => {
    //       this.notify.error('An Error Occurred Please Try Again to Download');
    //     });
    // }, 20000);

  }
  async generateDocument(docCreator: DocumentCreator, entity: ClientDetailOutput, address: CreateAddressInput) {
    const today = moment().format('LL');
    docCreator.generateDoc([entity, address, this.filteredDocuments, this.medicalData,
      this.workData, this.lawFirmCity, this.assessmentReport, this.rangeOfMotionReport], today);

  }
  async getMedicalHistory(id) {
    this._reportService.getMedicalHistoryByClientId(id)
      .pipe(finalize(() => {
      }))
      .subscribe((result) => {
        this.medicalData = result;
      });
  }
  async getFileData(id) {
    this.documentService.getClientDocuments(id)
      .pipe(finalize(() => { }))
      .subscribe((result) => {
        this.documents = result.items;
        const filtered = this.documents.map((value) => {
          return {
            date_authored: value.authorDate ? moment(value.authorDate).format('DD/MM/YYYY') : '',
            file_name: value.name,
            author_name: value.authorName
          };
        });
        this.filteredDocuments = filtered;
      });
  }
  async getWorkHistory(id) {
    this._reportService.getWorkHistoryByClientId(id)
      .pipe(finalize(() => { }))
      .subscribe((result) => {
        this.workData = result;
      });
  }
  async getClientHistory(id) {
    this.clientService.getById(id)
      .subscribe((result) => {
        this.client = result;
      });
  }
  getAge(entity: ClientListDto) {
    const idNumber: string = '' + entity.idNumber;
    const tempDate = new Date(
      +idNumber.substr(0, 2),
      +(idNumber.substring(2, 4)) - 1,
      +idNumber.substring(4, 6));
    const id_month = tempDate.getMonth();
    const id_year = tempDate.getFullYear();
    let currentAge = new Date().getFullYear() - id_year;
    if (id_month > new Date().getMonth()) {
      currentAge = currentAge - 1;
    } else if (id_month === new Date().getMonth() && tempDate.getDate() < new Date().getDate()) {
      currentAge = currentAge - 1;
    }
    return currentAge;
  }

  getDob(entity: ClientListDto) {
    const idNumber: string = '' + entity.idNumber;
    const tempDate = new Date(
      +idNumber.substr(0, 2),
      +(idNumber.substring(2, 4)) - 1,
      +idNumber.substring(4, 6));
    const fullDate = moment(tempDate).format('DD/MM/YYYY');
    return fullDate;
  }
  handleChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.totalItems = event.length;
    this.getDataPage(event.pageIndex + 1);
  }

  async getReportData(clientId: string, age: number, gender: number) {
    // await this.getGripStrength(clientId, age, gender);
    // await this.getMusclePower(clientId);
    // await this.getShoulders(clientId);
    // await this.getForearmWrist(clientId);
    // await this.getElbow(clientId);
    // await this.getHand(clientId);
    // await this.getHip(clientId);
    // await this.getKnee(clientId);
    // await this.getAnkle(clientId);
    // await this.getBorgBalance(clientId);
    await this.getSensation(clientId);
    await this.getMobility(clientId);
    await this.getAffect(clientId);
    // await this.getCoordination(clientId);
    // await this.getPosture(clientId);
    // await this.getGait(clientId);
    // await this.getWalking(clientId);
    // await this.getStairClimbing(clientId);
    // await this.getBalance(clientId);
    // await this.getLadderWork(clientId);
    // await this.getRepetitiveSquatting(clientId);
    // await this.getRepetitiveFootMotion(clientId);
    // await this.getCrawling(clientId);
  }
  // async getGripStrength(clientId: string, age: number, gender: number) {
  //   this._assessmentReportService.getGripStrengthReport(clientId, age, gender)
  //     .subscribe((result) => {
  //       this.gripStrengthReport = result;
  //       this.assessmentReport[0] = result;
  //     });
  // }
  // async getMusclePower(clientId: string) {
  //   this._assessmentReportService.getMusclePowerReport(clientId)
  //     .subscribe((result) => {
  //       this.musclePowerReport = result;
  //       this.assessmentReport[1] = result;
  //     });
  // }
  // async getShoulders(clientId: string) {
  //   this._assessmentReportService.getRoMShoulderReport(clientId)
  //     .subscribe((result) => {
  //       this.shoulderLeftReport = result;
  //       this.rangeOfMotionReport[0] = result;
  //     });

  //   this._assessmentReportService.getRoMShoulderReport(clientId)
  //     .subscribe((result) => {
  //       this.shoulderRightReport = result;
  //       this.rangeOfMotionReport[1] = result;
  //     });
  // }
  // async getForearmWrist(clientId: string) {
  //   this._assessmentReportService.getRoMForearmWristReport(clientId)
  //     .subscribe((result) => {
  //       this.forearmWristLeftReport = result;
  //       this.rangeOfMotionReport[2] = result;
  //     });
  //   this._assessmentReportService.getRoMForearmWristReport(clientId)
  //     .subscribe((result) => {
  //       this.forearmWristRightReport = result;
  //       this.rangeOfMotionReport[3] = result;
  //     });
  // }

  // async getHand(clientId: string) {
  //   this._assessmentReportService.getRoMHandReport(clientId, 0)
  //     .subscribe((result) => {
  //       this.handLeftReport = result;
  //       this.rangeOfMotionReport[6] = result;
  //     });

  //   this._assessmentReportService.getRoMHandReport(clientId, 1)
  //     .subscribe((result) => {
  //       this.handRightReport = result;
  //       this.rangeOfMotionReport[7] = result;
  //     });
  // }

  // async getHip(clientId: string) {
  //   this._assessmentReportService.getRoMHipReport(clientId)
  //     .subscribe((result) => {
  //       this.hipLeftReport = result;
  //       this.rangeOfMotionReport[8] = result;
  //     });
  //   this._assessmentReportService.getRoMHipReport(clientId)
  //     .subscribe((result) => {
  //       this.hipRightReport = result;
  //       this.rangeOfMotionReport[9] = result;
  //     });
  // }

  // async getKnee(clientId: string) {
  //   this._assessmentReportService.getRoMKneeReport(clientId)
  //     .subscribe((result) => {
  //       this.kneeLeftReport = result;
  //       this.rangeOfMotionReport[10] = result;
  //     });
  //   this._assessmentReportService.getRoMKneeReport(clientId)
  //     .subscribe((result) => {
  //       this.kneeRightReport = result;
  //       this.rangeOfMotionReport[11] = result;
  //     });
  // }
  // async getAnkle(clientId: string) {
  //   this._assessmentReportService.getRoMAnkleReport(clientId)
  //     .subscribe((result) => {
  //       this.ankleLeftReport = result;
  //       this.rangeOfMotionReport[12] = result;
  //     });
  //   this._assessmentReportService.getRoMAnkleReport(clientId)
  //     .subscribe((result) => {
  //       this.ankleRightReport = result;
  //       this.rangeOfMotionReport[13] = result;
  //     });
  // }

  // async getBorgBalance(clientId: string) {
  //   this._assessmentReportService.getBorgBalanceReport(clientId)
  //     .subscribe((result) => {
  //       this.borgBalanceReport = result;
  //       this.assessmentReport[9] = result;
  //     });
  // }

  async  getSensation(clientId: string) {
    this._sensationService.getSensation(clientId)
      .pipe(finalize(() => {
      }))
      .subscribe(
        (sensation) => {
          this.comment = sensation.otComment;
          this.assessmentReport[10] = this.comment;
        }
      );
  }

  // async  getCoordination(clientId: string) {
  //   this._assessmentReportService.getCoordinationReport(clientId)
  //     .subscribe((result) => {
  //       this.coordinationReport = result;
  //       this.assessmentReport[13] = result;
  //     });
  // }

  // async  getPosture(clientId: string) {
  //   this._assessmentReportService.getPostureReport(clientId)
  //     .subscribe((result) => {
  //       this.postureReport = result;
  //       this.assessmentReport[14] = result;
  //     });
  // }

  // async getGait(clientId: string) {
  //   this._assessmentReportService.getGaitReport(clientId)
  //     .subscribe((result) => {
  //       this.gaitReport = result;
  //       this.assessmentReport[15] = result;
  //     });
  // }
  async getMobility(clientId: string) {
    this._mobilityService.getByClientAsync(clientId)
      .pipe(finalize(() => {
      }))
      .subscribe(
        (result) => {
          this.mobility = result;
          this.mobilityComment = result.comment;
          this.assessmentReport[11] = result.comment;
        }
      );
  }
  async getAffect(clientId: string) {
    this._affectService.getByClientAsync(clientId)
      .pipe(finalize(() => {
      })).subscribe(
        (affect) => {
          this.affect = affect;
          this.affectComment = affect.comment;
          this.assessmentReport[12] = affect.comment;
        }
      );
  }
  // async getWalking(clientId: string) {
  //   this._assessmentReportService.getWalkingProtocolReport(clientId)
  //     .subscribe((result) => {
  //       this.walkingReport = result;
  //       this.assessmentReport[16] = result;
  //     });
  // }
  // async getStairClimbing(clientId: string) {
  //   this._assessmentReportService.getStairClimbingProtocolReport(clientId)
  //     .subscribe((result) => {
  //       this.stairClimbing = result;
  //       this.assessmentReport[17] = result;
  //     });
  // }
  // async  getBalance(clientId: string) {
  //   this._assessmentReportService.getBalanceProtocolReport(clientId)
  //     .subscribe((result) => {
  //       this.balanceReport = result;
  //       this.assessmentReport[18] = result;
  //     });
  // }

  // async getLadderWork(clientId: string) {
  //   this._assessmentReportService.getLadderWorkProtocolReport(clientId)
  //     .subscribe((result) => {
  //       this.ladderWork = result;
  //       this.assessmentReport[19] = result;
  //     });
  // }

  // async getRepetitiveSquatting(clientId: string) {
  //   this._assessmentReportService.getRepetitiveSquattingProtocolReport(clientId)
  //     .subscribe((result) => {
  //       this.repetitiveSquatting = result;
  //       this.assessmentReport[20] = result;
  //     });
  // }

  // async getRepetitiveFootMotion(clientId: string) {
  //   this._assessmentReportService.getRepetitiveFootMotionProtocolReport(clientId)
  //     .subscribe((result) => {
  //       this.repetitiveFootMotionReport = result;
  //       this.assessmentReport[21] = result;
  //     });
  // }
  // async getCrawling(clientId: string) {
  //   this._assessmentReportService.getCrawlingProtocolReport(clientId)
  //     .pipe(finalize(() => {
  //       this.isGenerating = false;
  //     }))
  //     .subscribe((result) => {
  //       this.crawlingReport = result;
  //       this.assessmentReport[22] = result;
  //     });
  // }

  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.clientService.getAll(request.sorting, request.skipCount, request.maxResultCount)
      .pipe(finalize(() => {
        finishedCallback();
      }))
      .subscribe((result) => {
        this.clients = result.items;
        this.showPaging(result, pageNumber);
        this.dataSource = new MatTableDataSource(this.clients);
        this.dataSource.sort = this.sort;
      });
  }
  protected delete(entity: ClientListDto): void {
    abp.message.confirm(
      'Delete Client \'' + entity.firstName + ' ' + entity.lastName + '\'?',
      (result: boolean) => {
        if (result) {
          this.isSaving = true;
          this.clientService.delete(entity.id).pipe(finalize(() => {
            this.isSaving = false;
            abp.notify.success('Deleted Client: ' + entity.firstName + ' ' + entity.lastName);
            this.refresh();
          })).subscribe(() => { });
        } else {
          this.isSaving = false;
        }
      }
    );
  }
}

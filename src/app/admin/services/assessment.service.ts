import { GripStrengthServiceProxy, MusclePowerServiceProxy, BorgBalanceServiceProxy,
   SensationServiceProxy, CoordinationServiceProxy, PostureServiceProxy,
    GaitServiceProxy } from './../../../shared/service-proxies/service-proxies';
import { Injectable } from '@angular/core';
import {
  AssessmentServiceProxy,
  RangeOfMotionServiceProxy,
  WalkingProtocolServiceProxy,
  BalanceProtocolServiceProxy,
  StairClimbingProtocolServiceProxy,
  LadderWorkProtocolServiceProxy,
  RepetitiveSquattingProtocolServiceProxy,
  RepetitiveFootMotionProtocolServiceProxy,
  CrawlingProtocolServiceProxy,
  GripStrengthDetailOutput,
} from '@shared/service-proxies/service-proxies';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {

  constructor(private _assessmentService: AssessmentServiceProxy,
    private _rangeOfMotionService: RangeOfMotionServiceProxy,
    private _walkingProtocolService: WalkingProtocolServiceProxy,
    private _balanceProtocolService: BalanceProtocolServiceProxy,
    private _stairClimbingProtocolService: StairClimbingProtocolServiceProxy,
    private _postureService: PostureServiceProxy,
    private _ladderWorkProtocolService: LadderWorkProtocolServiceProxy,
    private _gripStrengthService: GripStrengthServiceProxy,
    private _sensationService: SensationServiceProxy,
    private _borgBalanceService: BorgBalanceServiceProxy,
    private _musclePowerService: MusclePowerServiceProxy,
    private _coordinationService: CoordinationServiceProxy,
    private _gaitService: GaitServiceProxy,
    private _repetitiveSquattingProtocolService: RepetitiveSquattingProtocolServiceProxy,
    private _repetitiveFootMotionProtocolService: RepetitiveFootMotionProtocolServiceProxy,
    private _crawlingProtocolService: CrawlingProtocolServiceProxy) { }

  getGripStrength(clientId: string, side: number): Observable<GripStrengthDetailOutput> {
    return this._gripStrengthService.getGripStrength(clientId, side);
  }
  getMusclePower(clientId: string, type: number) {
    this._musclePowerService
      .getMusclePowerOption(clientId, type)
      .subscribe((result) => {
        return result;
      });
  }
  getRoMShoulder(clientId: string, side: number) {
    this._rangeOfMotionService
      .getShoulder(clientId, side)
      .subscribe(result => {
        return result;
      });
  }
  getRoMForearmWrist(clientId: string, side: number) {
    this._rangeOfMotionService.getForearmWrist(clientId, side)
      .subscribe(result => {
        return result;
      });
  }
  getRoMElbow(clientId: string, side: number) {
    this._rangeOfMotionService.getElbow(clientId, side)
      .subscribe(result => {
        return result;
      });
  }
  getRoMHand(clientId: string, side: number) {
    this._rangeOfMotionService.getHand(clientId, side)
      .subscribe(result => {
        return result;
      });
  }

  getRoMHip(clientId: string, side: number) {
    this._rangeOfMotionService.getHip(clientId, side)
      .subscribe(result => {
        return result;
      });
  }
  getRoMKnee(clientId: string, side: number) {
    this._rangeOfMotionService.getKnee(clientId, side)
      .subscribe(result => {
        return result;
      });
  }
  getRoMAnkle(clientId: string, side: number) {
    this._rangeOfMotionService.getAnkle(clientId, side)
      .subscribe(result => {
        return result;
      });
  }
  getBorgBalance(clientId: string) {
    this._borgBalanceService.getBorgBalance(clientId)
      .subscribe(result => {
        return result.items;
      });
  }

  getSensationUpper(clientId: string, side: number) {
    this._sensationService.getUpperExtremity(clientId, side)
      .subscribe(result => {
        return result.items;
      });
  }
  getSensationTrunk(clientId: string, side: number) {
    this._sensationService.getTrunkExtremity(clientId, side)
      .subscribe(result => {
        return result.items;
      });
  }
  getSensationLower(clientId: string, side: number) {
    this._sensationService.getLowerExtremity(clientId, side)
      .subscribe(result => {
        return result.items;
      });
  }
  getCoordination(clientId: string) {
    this._coordinationService.getCoordination(clientId, 0)
      .subscribe(result => {
        return result.items;
      });
  }
  getPosture(clientId: string) {
    this._postureService.getPosture(clientId)
      .subscribe(result => {
        return result.items;
      });
  }
  getGait(clientId: string) {
    this._gaitService.getGait(clientId)
      .subscribe(result => {
        return result;
      });
  }

  getWalkingProtocol(clientId: string) {
    this._walkingProtocolService.get(clientId)
      .subscribe(result => {
        return result;
      });
  }

  // getStairClimbingProtocol(clientId: string): Observable<StairClimbingProtocolDetailOutput> {
  //   return this._stairClimbingProtocolService.get(clientId);
  // }
  getBalanceProtocol(clientId: string) {
    this._balanceProtocolService.get(clientId)
      .subscribe(result => {
        return result.items;
      });
  }
  getLadderWorkProtocol(clientId: string) {
    this._ladderWorkProtocolService.get(clientId)
      .subscribe(result => {
        return result;
      });
  }
  getRepetitiveSquattingProtocol(clientId: string) {
    this._repetitiveSquattingProtocolService.get(clientId)
      .subscribe(result => {
        return result;
      });
  }
  getRepetitiveFootMotionProtocol(clientId: string, side: number) {
    this._repetitiveFootMotionProtocolService.get(clientId)
      .subscribe(result => {
        return result;
      });
  }
  getCrawlingProtocol(clientId: string) {
    this._crawlingProtocolService.get(clientId)
      .subscribe(result => {
        return result;
      });
  }
  getPain(painLevel: number): string {
    switch (painLevel) {
      case 0:
        return 'No Pain';
      case 1:
        return 'Hurts a Little';
      case 2:
        return 'Hurts a Little More';
      case 3:
        return 'Hurts Even More';
      case 4:
        return 'Hurts a Whole Lot';
      case 5:
        return 'Hurts Worse';
      default:
        return '';
        break;
    }
  }
  getBorgBalanceOptions(index: number): string[] {
    let options: string[] = [];
    switch (index) {
      case 0:
        options = ['needs moderate or maximal assist to stand',
          'needs minimal aid to stand or to stabilize',
          'able to stand using hands after several tries',
          'able to stand independently using hands',
          'able to stand without using hands and stabilize independently'];
        return options;
      case 1:
        options = [
          'unable to stand 30 seconds unassisted',
          'needs several tries to stand 30 seconds unsupported',
          'able to stand 30 seconds unsupported',
          'able to stand 2 minutes with supervision',
          'able to stand safely 2 minutes'];

        return options;
      case 2:
        options = ['unable to sit without support 10 seconds',
          'able to sit 10 seconds',
          'able to sit 30 seconds',
          'able to sit 2 minutes under supervision',
          'able to sit safely and securely 2 minutes'];
        return options;
      case 3:
        options = ['needs assistance to sit',
          'sits independently but has uncontrolled descent',
          'uses back of legs against chair to control descent',
          'controls descent by using hands',
          'sits safely with minimal use of hands'];
        return options;
      case 4:
        options = ['needs two people to assist or supervise to be safe',
          'needs one person to assist',
          'able to transfer with verbal cueing and/or supervision',
          'able to transfer safely definite need of hands',
          'able to transfer safely with minor use of hands'];
        return options;

      case 5:
        options = ['needs help to keep from falling',
          'unable to keep eyes closed 3 seconds but stays steady',
          'able to stand 3 seconds',
          'able to stand 10 seconds with supervision',
          'able to stand 10 seconds safely'];
        return options;

      case 6:
        options = ['needs help to attain position and unable to hold for 15 seconds',
          'needs help to attain position but able to stand 15 seconds with feet together',
          'able to place feet together independently but unable to hold for 30 seconds',
          'able to place feet together independently and stand for 1 minute with supervision',
          'able to place feet together independently and stand 1 minute safely'];
        return options;

      case 7:
        options = ['Loses balance while trying/requires external support',
          'Reaches forward but needs supervision',
          'Can reach forward >5 cm safely (2 inches)',
          'Can reach forward >12 cm safely (5 inches)',
          'Can reach forward confidently >25 cm (10 inches)'];
        return options;

      case 8:
        options = ['Unable to try/needs assist to keep from losing balance or falling',
          'Unable to pick up and needs supervision while trying',
          'Unable to pick up but reaches 2-5cm (1-2 inches) from slipper and keeps balance independently',
          'Able to pick up slipper but needs supervision',
          'Able to pick up slipper safely and easily'];
        return options;

      case 9:
        options = ['Needs assist to keep from losing balance or falling',
          'Needs supervision when turning',
          'Turns sideways only but maintains balance',
          'Looks behind one side only other side shows less weight shift',
          'Looks behind from both sides and weight shifts well'];
        return options;

      case 10:
        options = ['Needs assistance while turning',
          'Needs close supervision or verbal cueing',
          'Able to turn 360 degrees safely but slowly',
          'Able to turn 360 degrees safely one side only in 4 seconds or less',
          'Able to turn 360 degrees safely in 4 seconds or less'];
        return options;

      case 11:
        options = ['Needs assistance to keep from falling/unable to try',
          'Able to complete >2 steps needs minimal assist',
          'Able to complete 4 steps without aid with supervision',
          'Able to stand independently and complete 8 steps in >20 seconds',
          'Able to stand independently and safely and complete 8 steps in 20 seconds'];
        return options;

      case 12:
        options = ['loses balance while stepping or standing',
          'needs help to step but can hold 15 seconds',
          'able to take small step independently and hold 30 seconds',
          'able to place foot ahead of other independently and hold 30 seconds',
          'able to place foot tandem independently and hold 30 seconds'];
        return options;

      case 13:
        options = ['unable to try or needs assist to prevent fall',
          'tries to lift leg unable to hold 3 seconds but remains standing independently',
          'able to lift leg independently and hold = or >3 seconds',
          'able to lift leg independently and hold 5-10 seconds',
          'able to lift leg independently and hold >10 seconds'
        ]

    }

  }
  getMusclePowerOptions(option: number): string {
    switch (option) {
      case 0:
        return 'No Contraction';
      case 1:
        return 'Flickering';
      case 2:
        return 'Movement without gravity';
      case 3:
        return 'Against Gravity';
      case 4:
        return 'Resistance';
      case 5:
        return 'Full Resistance/Normal';
      default:
        break;
    }
  }


  decodeGaitResult(option: number): string {
    switch (option) {
      case 0:
        return 'less than 2 minutes sustained walking at slow pace';
      case 1:
        return 'sustained walk greater than 2 minutes but less than 10 minutes slow/functional pace';
      case 2:
        return '10 minute sustained walk at functional pace or no difficulty walking while casually observed';
      case 3:
        return '20 minute sustained walk at functional pace';
      case 4:
        return '30 minute sustained walk at 2 MPH or greater functional pace';
      default:
        break;
    }
  }

  decodeGaitPain(option: number): string {
    switch (option) {
      case 0:
        return 'significant pain indicators';
      case 1:
        return 'moderate pain indicators initially, possibly progressing to significant pain indicators';
      case 2:
        return 'minimal to no pain indicators';
      case 3:
        return 'minimal pain indicators minimum to moderate CV exertion';
      case 4:
        return 'no pain indicators minimum CV exertion';
      default:
        break;
    }
  }
  decodeOtObservation(option: number): string {
    switch (option) {
      case 0:
        return 'functional/work history of intolerance to walking';
      case 1:
        return 'functional/work history of difficulty with sustained walking';
      case 2:
        return 'functional/work history of tolerance to extended durations of walking';
      default:
        break;
    }
  }
  decodeSensationOption(option: number): string {
    switch (option) {
      case 0:
        return 'Absent, no response';
      case 1:
        return 'Decreased, delayed response';
      case 2:
        return 'Increased, exaggerated response';
      case 3:
        return 'Inconsistent response';
      case 4:
        return 'Intact normal response';
      case 5:
        return 'Unable to test';
      case 6:
        return 'Proximal';
      case 7:
        return 'Distal';
      default:
        break;
    }
  }
  decodeRoMHandOption(option: number): string {
    switch (option) {
      case 0:
        return 'MP';
      case 1:
        return 'PIP';
      case 2:
        return 'DIP';
      default:
        return 'NIL';
    }
  }
}


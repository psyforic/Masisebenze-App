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
  StairClimbingProtocolDetailOutput
} from '@shared/service-proxies/service-proxies';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  constructor(private _assessmentService: AssessmentServiceProxy,
    private _rangeOfMotionService: RangeOfMotionServiceProxy,
    private _walkingProtocolService: WalkingProtocolServiceProxy,
    private _balanceProtocolService: BalanceProtocolServiceProxy,
    private _stairClimbingProtocolService: StairClimbingProtocolServiceProxy,
    private _ladderWorkProtocolService: LadderWorkProtocolServiceProxy,
    private _repetitiveSquattingProtocolService: RepetitiveSquattingProtocolServiceProxy,
    private _repetitiveFootMotionProtocolService: RepetitiveFootMotionProtocolServiceProxy,
    private _crawlingProtocolService: CrawlingProtocolServiceProxy) { }

  getGripStrength(clientId: string, side: number): Observable<GripStrengthDetailOutput> {
    return this._assessmentService.getGripStrength(clientId, side);
  }
  getMusclePower(clientId: string, type: number) {
    this._assessmentService
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
    this._assessmentService.getBorgBalance(clientId)
      .subscribe(result => {
        return result.items;
      });
  }

  getSensationUpper(clientId: string, side: number) {
    this._assessmentService.getUpperExtremity(clientId, side)
      .subscribe(result => {
        return result.items;
      });
  }
  getSensationTrunk(clientId: string, side: number) {
    this._assessmentService.getTrunkExtremity(clientId, side)
      .subscribe(result => {
        return result.items;
      });
  }
  getSensationLower(clientId: string, side: number) {
    this._assessmentService.getLowerExtremity(clientId, side)
      .subscribe(result => {
        return result.items;
      });
  }
  getCoordination(clientId: string) {
    this._assessmentService.getCoordination(clientId)
      .subscribe(result => {
        return result.items;
      });
  }
  getPosture(clientId: string) {
    this._assessmentService.getPosture(clientId)
      .subscribe(result => {
        return result.items;
      });
  }
  getGait(clientId: string) {
    this._assessmentService.getGait(clientId)
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

  getStairClimbingProtocol(clientId: string): Observable<StairClimbingProtocolDetailOutput> {
    return this._stairClimbingProtocolService.get(clientId);
  }
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
    this._repetitiveFootMotionProtocolService.get(clientId, side)
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

}



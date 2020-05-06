import { TemplateRef } from '@angular/core';
import { createReport } from 'docx-templates';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import * as Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import * as Pizzip from 'pizzip';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ReportRoMHandDto } from '@shared/service-proxies/service-proxies';


export class DocumentCreator {
  
    generateDoc(data, today) {
        let handRightReport: ReportRoMHandDto[] = [];
        let handLeftReport: ReportRoMHandDto[] = [];
        let handLeftLittle: ReportRoMHandDto;
        let handLeftIndex: ReportRoMHandDto;
        let handLeftRing: ReportRoMHandDto;
        let handLeftMiddle: ReportRoMHandDto;
        let handLeftThumb: ReportRoMHandDto;
        let handRightLittle: ReportRoMHandDto;
        let handRightIndex: ReportRoMHandDto;
        let handRightRing: ReportRoMHandDto;
        let handRightMiddle: ReportRoMHandDto;
        let handRightThumb: ReportRoMHandDto;
        const clientData = data[0];
        const address = data[1];
        const filteredDocuments = data[2];
        const medicalData = data[3];
        const workData = data[4];
        const city = data[5];
        const idNumber: string = clientData.idNumber;
        const cutoff = (new Date()).getFullYear() - 2000;
        const id_year = idNumber.substring(0, 2);
        const id_month = +idNumber.substring(2, 4) - 1;
        const id_day = +idNumber.substring(4, 6);
        const full_year = (+id_year > cutoff ? '19' : '20') + id_year;
        let currentAge = new Date().getFullYear() - (+full_year);
        if (id_month > new Date().getMonth()) {
            currentAge = currentAge - 1;
        } else if (id_month === new Date().getMonth() && id_day > new Date().getDate()) {
            currentAge = currentAge - 1;
        }
       // return currentAge;

        const assessmentReport = data[6];
       
        const romReport = data[7];
        handRightReport = romReport[6];
        handLeftReport = romReport[7];
        if(handLeftReport.length > 0) {
            handLeftLittle = handLeftReport.filter(x => x.position === 1)[0];
            handLeftRing = handLeftReport.filter(x => x.position === 2)[0];
            handLeftMiddle = handLeftReport.filter(x => x.position === 3)[0];
            handLeftIndex = handLeftReport.filter(x => x.position === 4)[0];
            handLeftThumb = handLeftReport.filter(x => x.position === 5)[0];
        }
        if(handRightReport.length > 0) {
            handRightLittle = handRightReport.filter(x => x.position === 1)[0];
            handRightRing = handRightReport.filter(x => x.position === 2)[0];
            handRightMiddle = handRightReport.filter(x => x.position === 3)[0];
            handRightIndex = handRightReport.filter(x => x.position === 4)[0];
            handRightThumb = handRightReport.filter(x => x.position === 5)[0];
        }
        function loadFile(url, callback) {
            JSZipUtils.getBinaryContent(url, callback);
        }
        loadFile('../../../assets/doc/template.docx', function (error, content) {
            if (error) { throw error; }
            const zip = new Pizzip(content);
            const doc = new Docxtemplater().loadZip(zip);
            doc.setData({
                fullName: clientData.firstName + ' ' + clientData.lastName,
                dateOfBirth: id_day + '/' + id_month + '/' + full_year,
                age: currentAge,
                IdNumber: idNumber,
                line1: (address != null) ? address.line1 : '',
                line2: (address != null) ? address.line2 : '',
                city: (address != null) ? address.city : '',
                ref: (clientData.caseNumber != null) ? clientData.caseNumber : '',
                documents: filteredDocuments,
                postalCode: address.postalCode,
                dateOfInjury: moment(clientData.dateOfInjury).format('DD/MM/YYYY'),
                assessmentDate: moment(clientData.assessmentDate).format('DD/MM/YYYY'),
                today: moment(today).format('DD/MM/YYYY'),
                attorney: (clientData.attorney != null) ? clientData.attorney.firstName + ' ' + clientData.attorney.lastName : '',
                lawFirm: (clientData.lawFirm != null) ? clientData.lawFirm.companyName : '',
                lawFirmCity: city,
                earlyChildhood: clientData.earlyChildhood != null ? clientData.earlyChildhood.replace(/<[^>]*>/g, '') : '',
                family: clientData.family != null ? clientData.family.replace(/<[^>]*>/g, '') : '',
                homeEnvironment: clientData.homeEnvironment != null ? clientData.homeEnvironment.replace(/<[^>]*>/g, '') : '',
                educational: clientData.education != null ? clientData.education.replace(/<[^>]*>/g, '') : '',
                premorbid: workData.premorbid != null ? workData.premorbid.replace(/<[^>]*>/g, '') : '',
                postmorbid: workData.postMorbid != null ? workData.postMorbid.replace(/<[^>]*>/g, '') : '',
                socialHabits: clientData.socialHabits != null ? clientData.socialHabits.replace(/<[^>]*>/g, '') : '',
                previousInjuries: medicalData.previousInjuries != null ? medicalData.previousInjuries.replace(/<[^>]*>/g, '') : '',
                medicalConditions: medicalData.medicalConditions != null ? medicalData.medicalConditions.replace(/<[^>]*>/g, '') : '',
                currentHistory: medicalData.currentHistory != null ? medicalData.currentHistory.replace(/<[^>]*>/g, '') : '',
                medication: medicalData.medication != null ? medicalData.medication.replace(/<[^>]*>/g, '') : '',
                clinicalObservations: medicalData.clinicalObservation != null ?
                    medicalData.clinicalObservation.replace(/<[^>]*>/g, '') : '',
                workHistory: workData.description != null ? workData.description.replace(/<[^>]*>/g, '') : '',
                currentComplaints: clientData.currentComplaints != null ? clientData.currentComplaints.replace(/<[^>]*>/g, '') : '',
                generalAppearance: clientData.generalAppearance != null ? clientData.generalAppearance.replace(/<[^>]*>/g, '') : '',
                rightHand: (assessmentReport[0] != null) ? assessmentReport[0].rightHandMachineTest : '',
                leftHand: (assessmentReport[0] != null) ? assessmentReport[0].leftHandMachineTest : '',
                dominantHand: (assessmentReport[0] != null) ? assessmentReport[0].normRight : '',
                nondominantHand: (assessmentReport[0] != null) ? assessmentReport[0].normLeft : '',
                musclePower: assessmentReport[1],
                // Shoulder Range Of Motion
                shRFlex: (romReport[0] != null && romReport[0].flexion != null) ? romReport[0].flexion : '',
                shLFlex: (romReport[1] != null && romReport[1].flexion != null) ? romReport[1].flexion : '',
                shRExtn: (romReport[0] != null && romReport[0].extension != null) ? romReport[0].extension : '',
                shLExtn: (romReport[1] != null && romReport[1].extension != null) ? romReport[1].extension : '',
                shRAbd: (romReport[0] != null && romReport[0].abduction != null) ? romReport[0].abduction : '',
                shLAbd: (romReport[1] != null && romReport[1].abduction != null) ? romReport[1].abduction : '',
                shRAdd: (romReport[0] != null && romReport[0].adduction != null) ? romReport[0].adduction : '',
                shLAdd: (romReport[1] != null && romReport[1].adduction != null) ? romReport[1].adduction : '',
                shIrRig: (romReport[0] != null && romReport[0].internalRotation != null) ? romReport[0].internalRotation : '',
                shIrLft: (romReport[1] != null && romReport[1].internalRotation != null) ? romReport[1].internalRotation : '',
                shErRig: (romReport[0] != null && romReport[0].externalRotation != null) ? romReport[0].externalRotation : '',
                shErLft: (romReport[1] != null && romReport[1].externalRotation != null) ? romReport[1].externalRotation : '',
                // Shoulder Muscle Power
                shRMFlex: (romReport[0] != null && romReport[0].flexMusclePower != null) ? romReport[0].flexMusclePower : '',
                shLMFlex: (romReport[1] != null && romReport[1].flexMusclePower != null) ? romReport[1].flexMusclePower : '',
                shRMExtn: (romReport[0] != null && romReport[0].extMusclePower != null) ? romReport[0].extMusclePower : '',
                shLMExtn: (romReport[1] != null && romReport[1].extMusclePower != null) ? romReport[1].extMusclePower : '',
                shRMAbd: (romReport[0] != null && romReport[0].abdMusclePower != null) ? romReport[0].abdMusclePower : '',
                shLMAbd: (romReport[1] != null && romReport[1].abdMusclePower != null) ? romReport[1].abdMusclePower : '',
                shRMAdd: (romReport[0] != null && romReport[0].addMusclePower != null) ? romReport[0].addMusclePower : '',
                shLMAdd: (romReport[1] != null && romReport[1].addMusclePower != null) ? romReport[1].addMusclePower : '',
                shIrRigM: (romReport[0] != null && romReport[0].irMusclePower != null) ? romReport[0].irMusclePower : '',
                shIrLftM: (romReport[1] != null && romReport[1].irMusclePower != null) ? romReport[1].irMusclePower : '',
                shErRigM: (romReport[0] != null && romReport[0].erMusclePower != null) ? romReport[0].erMusclePower : '',
                shErLftM: (romReport[1] != null && romReport[1].erMusclePower != null) ? romReport[1].erMusclePower : '',
                // Forearm And Wrist Range of motion
                fwRPro: (romReport[2] != null && romReport[2].pronation != null) ? romReport[2].pronation : '',
                fwLPro: (romReport[3] != null && romReport[3].pronation != null) ? romReport[3].pronation : '',
                fwRSup: (romReport[2] != null && romReport[2].supination != null) ? romReport[2].supination : '',
                fwLSup: (romReport[3] != null && romReport[3].supination != null) ? romReport[3].supination : '',
                fwRExtn: (romReport[2] != null && romReport[2].extension != null) ? romReport[2].extension : '',
                fwLExtn: (romReport[3] != null && romReport[3].extension != null) ? romReport[3].extension : '',
                fwRFlex: (romReport[2] != null && romReport[2].flexion != null) ? romReport[2].flexion : '',
                fwLFlex: (romReport[3] != null && romReport[3].flexion != null) ? romReport[3].flexion : '',
                fwRRad: (romReport[2] != null && romReport[2].radialDeviation != null) ? romReport[2].radialDeviation : '',
                fwLRad: (romReport[3] != null && romReport[3].radialDeviation != null) ? romReport[3].radialDeviation : '',
                fwRUlnar: (romReport[2] != null && romReport[2].ulnarDeviation != null) ? romReport[2].ulnarDeviation : '',
                fwLUlnar: (romReport[3] != null && romReport[3].ulnarDeviation != null) ? romReport[3].ulnarDeviation : '',
                // Forearm And Wrist Muscle Power
                fwRMPro: (romReport[2] != null && romReport[2].proMusclePower != null) ? romReport[2].proMusclePower : '',
                fwLMPro: (romReport[3] != null && romReport[3].proMusclePower != null) ? romReport[3].proMusclePower : '',
                fwRMSup: (romReport[2] != null && romReport[2].supMusclePower != null) ? romReport[2].supMusclePower : '',
                fwLMSup: (romReport[3] != null && romReport[3].supMusclePower != null) ? romReport[3].supMusclePower : '',
                fwRMExtn: (romReport[2] != null && romReport[2].extMusclePower != null) ? romReport[2].extMusclePower : '',
                fwLMExtn: (romReport[3] != null && romReport[3].extMusclePower != null) ? romReport[3].extMusclePower : '',
                fwRMFlex: (romReport[2] != null && romReport[2].flexMusclePower != null) ? romReport[2].flexMusclePower : '',
                fwLMFlex: (romReport[3] != null && romReport[3].flexMusclePower != null) ? romReport[3].flexMusclePower : '',
                fwRMRad: (romReport[2] != null && romReport[2].radMusclePower != null) ? romReport[2].radMusclePower : '',
                fwLMRad: (romReport[3] != null && romReport[3].radMusclePower != null) ? romReport[3].radMusclePower : '',
                fwRMUlnar: (romReport[2] != null && romReport[2].ulnMusclePower != null) ? romReport[2].ulnMusclePower : '',
                fwLMUlnar: (romReport[3] != null && romReport[3].ulnMusclePower != null) ? romReport[3].ulnMusclePower : '',
                // Elbow Range Of Motion
                elRExtn: (romReport[4] != null && romReport[4].extension != null) ? romReport[4].extension : '',
                elLExtn: (romReport[5] != null && romReport[5].extension != null) ? romReport[5].extension : '',
                elRFlex: (romReport[4] != null && romReport[4].flexion != null) ? romReport[4].flexion : '',
                elLFlex: (romReport[5] != null && romReport[5].flexion != null) ? romReport[5].flexion : '',
                elRPro: (romReport[4] != null && romReport[4].pronation != null) ? romReport[4].pronation : '',
                elLPro: (romReport[5] != null && romReport[5].pronation != null) ? romReport[5].pronation : '',
                elRSup: (romReport[4] != null && romReport[4].supination != null) ? romReport[4].supination : '',
                elLSup: (romReport[5] != null && romReport[5].supination != null) ? romReport[5].supination : '',
                // Elbow Muscle Power
                elRMExtn: (romReport[4] != null && romReport[4].extMusclePower != null) ? romReport[4].extMusclePower : '',
                elLMExtn: (romReport[5] != null && romReport[5].extMusclePower != null) ? romReport[5].extMusclePower : '',
                elRMFlex: (romReport[4] != null && romReport[4].flexMusclePower != null) ? romReport[4].flexMusclePower : '',
                elLMFlex: (romReport[5] != null && romReport[5].flexMusclePower != null) ? romReport[5].flexMusclePower : '',
                elRMPro: (romReport[4] != null && romReport[4].proMusclePower != null) ? romReport[4].proMusclePower : '',
                elLMPro: (romReport[5] != null && romReport[5].proMusclePower != null) ? romReport[5].proMusclePower : '',
                elRMSup: (romReport[4] != null && romReport[4].supMusclePower != null) ? romReport[4].supMusclePower : '',
                elLMSup: (romReport[5] != null && romReport[5].supMusclePower != null) ? romReport[5].supMusclePower : '',
                /* ***************************************************************************************************************
                    LEFT HAND RANGE OF MOTION
                * ****************************************************************************************************************/
                // Little Finger
                ltMPFex: ( handLeftLittle != null && handLeftLittle.mpFlexion != null) ? handLeftLittle.mpFlexion : '',
                ltMPHyp: (handLeftLittle != null && handLeftLittle.mpHyperExtension != null) ? handLeftLittle.mpHyperExtension : '',
                ltPIPFlx: (handLeftLittle != null && handLeftLittle.pipFlexionExtension != null) ? handLeftLittle.pipFlexionExtension : '',
                ltDIPFlx: (handLeftLittle != null && handLeftLittle.dipFlexionExtension != null) ? handLeftLittle.dipFlexionExtension : '',
                ltAbd: (handLeftLittle != null && handLeftLittle.abduction != null) ? handLeftLittle.abduction : '',
                ltAdd: (handLeftLittle != null && handLeftLittle.adduction != null) ? handLeftLittle.adduction : '',

                 // Ring Finger
                 rngMPFex: ( handLeftRing != null && handLeftRing.mpFlexion != null) ? handLeftRing.mpFlexion : '',
                 rngMPHyp: (handLeftRing != null && handLeftRing.mpHyperExtension != null) ? handLeftRing.mpHyperExtension : '',
                 rngPIPFlx: (handLeftRing != null && handLeftRing.pipFlexionExtension != null) ? handLeftRing.pipFlexionExtension : '',
                 rngDIPFlx: (handLeftRing != null && handLeftRing.dipFlexionExtension != null) ? handLeftRing.dipFlexionExtension : '',
                 rngAbd: (handLeftRing != null && handLeftRing.abduction != null) ? handLeftRing.abduction : '',
                 rngAdd: (handLeftRing != null && handLeftRing.adduction != null) ? handLeftRing.adduction : '',

                  // Middle Finger
                mdMPFex: ( handLeftMiddle != null && handLeftMiddle.mpFlexion != null) ? handLeftMiddle.mpFlexion : '',
                mdMPHyp: (handLeftMiddle != null && handLeftMiddle.mpHyperExtension != null) ? handLeftMiddle.mpHyperExtension : '',
                mdPIPFlx: (handLeftMiddle != null && handLeftMiddle.pipFlexionExtension != null) ? handLeftMiddle.pipFlexionExtension : '',
                mdDIPFlx: (handLeftMiddle != null && handLeftMiddle.dipFlexionExtension != null) ? handLeftMiddle.dipFlexionExtension : '',
                mdAbd: (handLeftMiddle != null && handLeftMiddle.abduction != null) ? handLeftMiddle.abduction : '',
                mdAdd: (handLeftMiddle != null && handLeftMiddle.adduction != null) ? handLeftMiddle.adduction : '',

                 // Index Finger
                 idxMPFex: (handLeftIndex != null && handLeftIndex.mpFlexion != null) ? handLeftIndex.mpFlexion : '',
                 idxMPHyp: (handLeftIndex != null && handLeftIndex.mpHyperExtension != null) ? handLeftIndex.mpHyperExtension : '',
                 idxPIPFlx: (handLeftIndex != null && handLeftIndex.pipFlexionExtension != null) ? handLeftIndex.pipFlexionExtension : '',
                 idxDIPFlx: (handLeftIndex != null && handLeftIndex.dipFlexionExtension != null) ? handLeftIndex.dipFlexionExtension : '',
                 idxAbd: (handLeftIndex != null && handLeftIndex.abduction != null) ? handLeftIndex.abduction : '',
                 idxAdd: (handLeftIndex != null && handLeftIndex.adduction != null) ? handLeftIndex.adduction : '',
                 // Thumb 
                 tmbCMFlx: (handLeftThumb != null && handLeftThumb.cmFlexion != null) ? handLeftThumb.cmFlexion : '',
                 tmbCMExt: (handLeftThumb != null && handLeftThumb.cmExtension != null) ? handLeftThumb.cmExtension : '',
                 tmbMPFlx: (handLeftThumb != null && handLeftThumb.mpFlexion != null) ? handLeftThumb.mpFlexion : '',
                 tmbIPFlx: (handLeftThumb != null && handLeftThumb.ipFlexionExtension != null) ? handLeftThumb.ipFlexionExtension : '',
                 tmbAbd: (handLeftThumb != null && handLeftThumb.abduction != null) ? handLeftThumb.abduction : '',
                 tmbOpp: (handLeftThumb != null && handLeftThumb.opposition != null) ? handLeftThumb.opposition : '',
              /* ***************************************************************************************************************
                    RIGHT HAND RANGE OF MOTION
                * ****************************************************************************************************************/
               // Little Finger
               ltRMPFex: (handRightLittle != null && handRightLittle.mpFlexion != null) ? handRightLittle.mpFlexion : '',
               ltRMPHyp: (handRightLittle != null && handRightLittle.mpHyperExtension != null) ? handRightLittle.mpHyperExtension : '',
               ltRPIPFlx: (handRightLittle != null && handRightLittle.pipFlexionExtension != null) ? handRightLittle.pipFlexionExtension : '',
               ltRDIPFlx: (handRightLittle != null && handRightLittle.dipFlexionExtension != null) ? handRightLittle.dipFlexionExtension : '',
               ltRAbd: (handRightLittle != null && handRightLittle.abduction != null) ? handRightLittle.abduction : '',
               ltRAdd: (handRightLittle != null && handRightLittle.adduction != null) ? handRightLittle.adduction : '',

                // Ring Finger
                rngRMPFex: (handRightRing != null && handRightRing.mpFlexion != null) ? handRightRing.mpFlexion : '',
                rngRMPHyp: (handRightRing != null && handRightRing.mpHyperExtension != null) ? handRightRing.mpHyperExtension : '',
                rngRPIPFlx: (handRightRing != null && handRightRing.pipFlexionExtension != null) ? handRightRing.pipFlexionExtension : '',
                rngRDIPFlx: (handRightRing != null && handRightRing.dipFlexionExtension != null) ? handRightRing.dipFlexionExtension : '',
                rngRRAbd: (handRightRing != null && handRightRing.abduction != null) ? handRightRing.abduction : '',
                rngRAdd: (handRightRing != null && handRightRing.adduction != null) ? handRightRing.adduction : '',

                 // Middle Finger
               mdRMPFex: (handRightMiddle != null && handRightMiddle.mpFlexion != null) ? handRightMiddle.mpFlexion : '',
               mdRMPHyp: (handRightMiddle != null && handRightMiddle.mpHyperExtension != null) ? handRightMiddle.mpHyperExtension : '',
               mdRPIPFlx: (handRightMiddle != null && handRightMiddle.pipFlexionExtension != null) ? handRightMiddle.pipFlexionExtension : '',
               mdRDIPFlx: (handRightMiddle != null && handRightMiddle.dipFlexionExtension != null) ? handRightMiddle.dipFlexionExtension : '',
               mdRAbd: (handRightMiddle != null && handRightMiddle.abduction != null) ? handRightMiddle.abduction : '',
               mdRAdd: (handRightMiddle != null && handRightMiddle.adduction != null) ? handRightMiddle.adduction : '',

                // Index Finger
                idxRMPFex: (handRightIndex != null && handRightIndex.mpFlexion != null) ? handRightIndex.mpFlexion : '',
                idxRMPHyp: (handRightIndex != null && handRightIndex.mpHyperExtension != null) ? handRightIndex.mpHyperExtension : '',
                idxRPIPFlx: (handRightIndex != null && handRightIndex.pipFlexionExtension != null) ? handRightIndex.pipFlexionExtension : '',
                idxRDIPFlx: (handRightIndex != null && handRightIndex.dipFlexionExtension != null) ? handRightIndex.dipFlexionExtension : '',
                idxRAbd: (handRightIndex != null && handRightIndex.abduction != null) ? handRightIndex.abduction : '',
                idxRAdd: (handRightIndex != null && handRightIndex.adduction != null) ? handRightIndex.adduction : '',
                // Thumb
                tmbRCMFlx: (handRightThumb != null && handRightThumb.cmFlexion != null) ? handRightThumb.cmFlexion : '',
                tmbRCMExt: (handRightThumb != null && handRightThumb.cmExtension != null) ? handRightThumb.cmExtension : '',
                tmbRMPFlx: (handRightThumb != null && handRightThumb.mpFlexion != null) ? handRightThumb.mpFlexion : '',
                tmbRIPFlx: (handRightThumb != null && handRightThumb.ipFlexionExtension != null) ? handRightThumb.ipFlexionExtension : '',
                tmbRAbd: (handRightThumb != null && handRightThumb.abduction != null) ? handRightThumb.abduction : '',
                tmbROpp: (handRightThumb != null && handRightThumb.opposition != null) ? handRightThumb.opposition : '',
                // Hip Range Of Motion
                hipRFlex: (romReport[8] != null && romReport[8].flexion != null) ? romReport[8].flexion : '',
                hipLFlex: (romReport[9] != null && romReport[9].flexion != null) ? romReport[9].flexion : '',
                hipRExtn: (romReport[8] != null && romReport[8].extension != null) ? romReport[8].extension : '',
                hipLExtn: (romReport[9] != null && romReport[9].extension != null) ? romReport[9].extension : '',
                hipRAbd: (romReport[8] != null && romReport[8].abduction != null) ? romReport[8].abduction : '',
                hipLAbd: (romReport[9] != null && romReport[9].abduction != null) ? romReport[9].abduction : '',
                hipRAdd: (romReport[8] != null && romReport[8].adduction != null) ? romReport[8].adduction : '',
                hipLAdd: (romReport[9] != null && romReport[9].adduction != null) ? romReport[9].adduction : '',
                hipIrRig: (romReport[8] != null && romReport[8].internalRotation != null) ? romReport[8].internalRotation : '',
                hipIrLft: (romReport[9] != null && romReport[9].internalRotation != null) ? romReport[9].internalRotation : '',
                hipErRig: (romReport[8] != null && romReport[8].externalRotation != null) ? romReport[8].externalRotation : '',
                hipErLft: (romReport[9] != null && romReport[9].externalRotation != null) ? romReport[9].externalRotation : '',
                // Hip Muscle Power
                hipRMFlex: (romReport[8] != null && romReport[8].flexMusclePower != null) ? romReport[8].flexMusclePower : '',
                hipLMFlex: (romReport[9] != null && romReport[9].flexMusclePower != null) ? romReport[9].flexMusclePower : '',
                hipRMExtn: (romReport[8] != null && romReport[8].extMusclePower != null) ? romReport[8].extMusclePower : '',
                hipLMExtn: (romReport[9] != null && romReport[9].extMusclePower != null) ? romReport[9].extMusclePower : '',
                hipRMAbd: (romReport[8] != null && romReport[8].abdMusclePower != null) ? romReport[8].abdMusclePower : '',
                hipLMAbd: (romReport[9] != null && romReport[9].abdMusclePower != null) ? romReport[9].abdMusclePower : '',
                hipRMAdd: (romReport[8] != null && romReport[8].addMusclePower != null) ? romReport[8].addMusclePower : '',
                hipLMAdd: (romReport[9] != null && romReport[9].addMusclePower != null) ? romReport[9].addMusclePower : '',
                hipIrRigM: (romReport[8] != null && romReport[8].irMusclePower != null) ? romReport[8].irMusclePower : '',
                hipIrLftM: (romReport[9] != null && romReport[9].irMusclePower != null) ? romReport[9].irMusclePower : '',
                hipErRigM: (romReport[8] != null && romReport[8].erMusclePower != null) ? romReport[8].erMusclePower : '',
                hipErLftM: (romReport[9] != null && romReport[9].erMusclePower != null) ? romReport[9].erMusclePower : '',
                // Knee Range of motion
                knRFlex: (romReport[10] != null && romReport[10].flexion != null) ? romReport[10].flexion : '',
                knLFlex: (romReport[11] != null && romReport[11].flexion != null) ? romReport[11].flexion : '',
                knRExtn: (romReport[10] != null && romReport[10].extension != null) ? romReport[10].extension : '',
                knLExtn: (romReport[11] != null && romReport[11].extension != null) ? romReport[11].extension : '',
                // Knee Muscle Power
                knRMFlex: (romReport[10] != null && romReport[10].flexMusclePower != null) ? romReport[10].flexMusclePower : '',
                knLMFlex: (romReport[11] != null && romReport[11].flexMusclePower != null) ? romReport[11].flexMusclePower : '',
                knRMExtn: (romReport[10] != null && romReport[10].extMusclePower != null) ? romReport[10].extMusclePower : '',
                knLMExtn: (romReport[11] != null && romReport[11].extMusclePower != null) ? romReport[11].extMusclePower : '',
                // Ankle Range Of Motion
                anRDflex: (romReport[12] != null && romReport[12].dorsiflexion != null) ? romReport[12].dorsiflexion : '',
                anLDflex: (romReport[13] != null && romReport[13].dorsiflexion != null) ? romReport[13].dorsiflexion : '',
                anRPflex: (romReport[12] != null && romReport[12].plantarFlexion != null) ? romReport[12].plantarFlexion : '',
                anLPflex: (romReport[13] != null && romReport[13].plantarFlexion != null) ? romReport[13].plantarFlexion : '',
                anRInvers: (romReport[12] != null && romReport[12].inversion != null) ? romReport[12].inversion : '',
                anLInvers: (romReport[13] != null && romReport[13].inversion != null) ? romReport[13].inversion : '',
                anREvers: (romReport[12] != null && romReport[12].eversion != null) ? romReport[12].eversion : '',
                anLEvers: (romReport[13] != null && romReport[13].eversion != null) ? romReport[13].eversion : '',
                // Ankle Muscle Power
                anRMDflex: (romReport[12] != null && romReport[12].dorsiMusclePower != null) ? romReport[12].dorsiMusclePower : '',
                anLMDflex: (romReport[13] != null && romReport[13].dorsiMusclePower != null) ? romReport[13].dorsiMusclePower : '',
                anRMPflex: (romReport[12] != null && romReport[12].plantarMusclePower != null) ? romReport[12].plantarMusclePower : '',
                anLMPflex: (romReport[13] != null && romReport[13].plantarMusclePower != null) ? romReport[13].plantarMusclePower : '',
                anRMInvers: (romReport[12] != null && romReport[12].invMusclePower != null) ? romReport[12].invMusclePower : '',
                anLMInvers: (romReport[13] != null && romReport[13].invMusclePower != null) ? romReport[13].invMusclePower : '',
                anRMEvers: (romReport[12] != null && romReport[12].evMusclePower != null) ? romReport[12].evMusclePower : '',
                anLMEvers: (romReport[13] != null && romReport[13].evMusclePower != null) ? romReport[13].evMusclePower : '',

                // conditional properties
                hasShoulder: romReport[14],
                hasForearmAndWrist: romReport[15],
                hasElbow: romReport[16],
                hasHand: romReport[17],
                hasHip: romReport[18],
                hasKnee: romReport[19],
                hasAnkle: romReport[20],

                forearmWrist: assessmentReport[3],
                elbow: assessmentReport[4],
                hand: assessmentReport[5],
                hip: assessmentReport[6],
                knee: assessmentReport[7],
                ankle: assessmentReport[8],
                borgBalance: assessmentReport[9],
                sensation: assessmentReport[10],
                mobilityComment: assessmentReport[11],
                affectComment: assessmentReport[12],
                coordination: assessmentReport[13],
                posture: assessmentReport[14],
                gait: assessmentReport[15],
                walking: assessmentReport[16],
                stairClimbing: assessmentReport[17],
                balance: assessmentReport[18],
                ladderWork: assessmentReport[19],
                repetitiveSquatting: assessmentReport[20],
                repetitiveFootMotion: assessmentReport[21],
                crawling: assessmentReport[22],
                // Cognitive Assessment
                attentionAndConcentrationComment: assessmentReport[23] != null ? assessmentReport[23].replace(/<[^>]*>/g, '') : '',
                genderPronoun: assessmentReport[24],
                memoryScore: assessmentReport[25],
                memoryTotalScore: assessmentReport[26],
                memoryAssessmentType: assessmentReport[27],
                memoryComment: assessmentReport[28] != null ? assessmentReport[28].replace(/<[^>]*>/g, '') : '',
                insightComment: assessmentReport[29] != null ? assessmentReport[29].replace(/<[^>]*>/g, '') : '',
                readingComment: assessmentReport[30] != null ? assessmentReport[30].replace(/<[^>]*>/g, '') : '',
                speechComment: assessmentReport[31] != null ? assessmentReport[31].replace(/<[^>]*>/g, '') : '',
                writingComment: assessmentReport[32] != null ? assessmentReport[32].replace(/<[^>]*>/g, '') : '',
                visualPerceptionComment: assessmentReport[33].replace(/<[^>]*>/g, ''),
                // Functional Assessment
                // Work Assessment
                jobDescription: assessmentReport[34] != null ? assessmentReport[34].replace(/<[^>]*>/g, '') : '',
                workAssessment: assessmentReport[35] != null ? assessmentReport[35].replace(/<[^>]*>/g, '') : '',
                discussion: assessmentReport[36] != null ? assessmentReport[36].replace(/<[^>]*>/g, '') : '',
                recommendations: assessmentReport[37] != null ? assessmentReport[37].replace(/<[^>]*>/g, '') : '',
                positionalToleranceTasks: assessmentReport[51],
                forcefulTasks: assessmentReport[52],
                repetitiveTasks: assessmentReport[53],
                ptTasks: assessmentReport[54],
                fTasks: assessmentReport[55],
                rtTasks: assessmentReport[56],
                noPositionalToleranceTasks: assessmentReport[57],
                noForcefulTasks: assessmentReport[58],
                noRepetitiveTasks: assessmentReport[59],
                lossOfEmenities: assessmentReport[40].replace(/<[^>]*>/g, ''),
                residualWorkCapacity: assessmentReport[41].replace(/<[^>]*>/g, ''),
                futureMedicalExpenses: assessmentReport[42].replace(/<[^>]*>/g, ''),
                futureMedicalAndSurgicalIntervention: assessmentReport[43].replace(/<[^>]*>/g, ''),
                supplementaryHealthServices: assessmentReport[44].replace(/<[^>]*>/g, ''),
                physiotherapy: assessmentReport[45].replace(/<[^>]*>/g, ''),
                occupationalTherapy: assessmentReport[46].replace(/<[^>]*>/g, ''),
                specialEquipment: assessmentReport[47].replace(/<[^>]*>/g, ''),
                caseManagement1: assessmentReport[48].replace(/<[^>]*>/g, ''),
                transportationCosts: assessmentReport[49].replace(/<[^>]*>/g, ''),
                psychology: assessmentReport[50].replace(/<[^>]*>/g, ''),
                caseManagement2: ''
            });

            try {
                doc.render();
            } catch (error) {
                const e = {
                    message: error.message,
                    name: error.name,
                    stack: error.stack,
                    properties: error.properties,
                };
                // console.log(JSON.stringify({ error: e }));
                throw error;
            }
            const out = doc.getZip().generate({
                type: 'blob',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });
            saveAs(out, clientData.firstName + '_' + clientData.lastName + '_' + 'Report.docx');
        });
    }

}

import { TemplateRef } from '@angular/core';
import { createReport } from 'docx-templates';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import * as Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import * as Pizzip from 'pizzip';
import * as moment from 'moment';
import * as _ from 'lodash';

export class DocumentCreator {

    generateDoc(data, today) {
        const clientData = data[0];
        const address = data[1];
        const filteredDocuments = data[2];
        const medicalData = data[3];
        const workData = data[4];
        const city = data[5];
        const idNumber: string = '' + clientData.idNumber;
        const tempDate = new Date(
            +idNumber.substr(0, 2),
            +(idNumber.substring(2, 4)) - 1,
            +idNumber.substring(4, 6));
        const id_month = tempDate.getMonth();
        const id_year = tempDate.getFullYear();
        const fullDate = moment(tempDate).format('DD/MM/YYYY');
        let currentAge = new Date().getFullYear() - id_year;
        if (id_month > new Date().getMonth()) {
            currentAge = currentAge - 1;
        } else if (id_month === new Date().getMonth() && tempDate.getDate() < new Date().getDate()) {
            currentAge = currentAge - 1;
        }

        const assessmentReport = data[6];
        const romReport = data[7];
        // console.log(romReport);
        // console.log(assessmentReport[0]);
        function loadFile(url, callback) {
            JSZipUtils.getBinaryContent(url, callback);
        }
        loadFile('../../../assets/doc/template.docx', function (error, content) {
            if (error) { throw error; }
            const zip = new Pizzip(content);
            const doc = new Docxtemplater().loadZip(zip);
            doc.setData({
                fullName: clientData.firstName + ' ' + clientData.lastName,
                dateOfBirth: fullDate,
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
                rightHand: (assessmentReport[0] != null) ? assessmentReport[0].rightHandWeight : '',
                leftHand: (assessmentReport[0] != null) ? assessmentReport[0].leftHandWeight : '',
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
                shIrRigM: (romReport[0] != null && romReport[0].iRMusclePower != null) ? romReport[0].iRMusclePower : '',
                shIrLftM: (romReport[1] != null && romReport[1].iRMusclePower != null) ? romReport[1].iRMusclePower : '',
                shErRigM: (romReport[0] != null && romReport[0].eRMusclePower != null) ? romReport[0].eRMusclePower : '',
                shErLftM: (romReport[1] != null && romReport[1].eRMusclePower != null) ? romReport[1].eRMusclePower : '',
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
                // Hand Range Of Motion
                haRMP: (romReport[6] != null && romReport[6].mpFlexion != null) ? romReport[6].mpFlexion : '',
                haRPIP: (romReport[7] != null && romReport[7].mpFlexion != null) ? romReport[7].mpFlexion : '',
                haRDIP: (romReport[6] != null && romReport[6].pipFlexionExtension != null) ? romReport[6].pipFlexionExtension : '',
                haLMP: (romReport[7] != null && romReport[7].pipFlexionExtension != null) ? romReport[7].pipFlexionExtension : '',
                haLPIP: (romReport[6] != null && romReport[6].dipFlexionExtension != null) ? romReport[6].dipFlexionExtension : '',
                haLDIP: (romReport[7] != null && romReport[7].dipFlexionExtension != null) ? romReport[7].dipFlexionExtension : '',
                // Hand Muscle Power
                haRMMP: (romReport[6] != null && romReport[6].mpFlexion != null) ? romReport[6].mpFlexion : '',
                haRMPIP: (romReport[7] != null && romReport[7].mpFlexion != null) ? romReport[7].mpFlexion : '',
                haRMDIP: (romReport[6] != null && romReport[6].pipFlexionExtension != null) ? romReport[6].pipFlexionExtension : '',
                haLMMP: (romReport[7] != null && romReport[7].pipFlexionExtension != null) ? romReport[7].pipFlexionExtension : '',
                haLMPIP: (romReport[6] != null && romReport[6].dipFlexionExtension != null) ? romReport[6].dipFlexionExtension : '',
                haLMDIP: (romReport[7] != null && romReport[7].dipFlexionExtension != null) ? romReport[7].dipFlexionExtension : '',
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
                hipIrRigM: (romReport[8] != null && romReport[8].iRMusclePower != null) ? romReport[8].iRMusclePower : '',
                hipIrLftM: (romReport[9] != null && romReport[9].iRMusclePower != null) ? romReport[9].iRMusclePower : '',
                hipErRigM: (romReport[8] != null && romReport[8].eRMusclePower != null) ? romReport[8].eRMusclePower : '',
                hipErLftM: (romReport[9] != null && romReport[9].eRMusclePower != null) ? romReport[9].eRMusclePower : '',
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
                ptTasks: assessmentReport[38],
                fTasks: assessmentReport[39],
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

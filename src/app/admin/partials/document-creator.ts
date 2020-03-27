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
                line1: address.line1,
                line2: address.line2,
                city: address.city,
                documents: filteredDocuments,
                postalCode: address.postalCode,
                dateOfInjury: moment(clientData.dateOfInjury).format('DD/MM/YYYY'),
                assessmentDate: moment(clientData.assessmentDate).format('DD/MM/YYYY'),
                today: moment(today).format('DD/MM/YYYY'),
                attorney: clientData.attorney.firstName + ' ' + clientData.attorney.lastName,
                lawFirm: clientData.lawFirm.companyName,
                lawFirmCity: city,
                earlyChildhood: _.escape(clientData.earlyChildhood),
                family: _.escape(clientData.family),
                homeEnvironment: _.escape(clientData.homeEnvironment),
                educational: _.escape(clientData.education),
                premorbid: _.escape(workData.premorbid),
                postmorbid: _.escape(workData.postMorbid),
                socialHabits: _.escape(clientData.socialHabits),
                previousInjuries: _.escape(medicalData.previousInjuries),
                medicalConditions: _.escape(medicalData.medicalConditions),
                currentHistory: _.escape(medicalData.currentHistory),
                medication: _.escape(medicalData.medication),
                workHistory: _.escape(workData.description),
                generalAppearance: _.escape(clientData.generalAppearance),
                rightHand: assessmentReport[0].rightHandWeight,
                leftHand: assessmentReport[0].leftHandWeight,
                dominantHand: assessmentReport[0].normRight,
                nondominantHand: assessmentReport[0].normLeft,
                musclePower: assessmentReport[1],

                shRFlexion: romReport[0].flexion,
                shLFlexion: romReport[1].flexion,
                shRExtension: romReport[0].extension,
                shLExtension: romReport[1].extension,
                shRAbduction: romReport[0].abduction,
                shLAbduction: romReport[1].abduction,
                shRAdduction: romReport[0].adduction,
                shLAdduction: romReport[1].adduction,
                shIrRight: romReport[0].internalRotation,
                shIrLeft: romReport[1].internalRotation,
                shErRight: romReport[0].externalRotation,
                shErLeft: romReport[1].externalRotation,

                fwRPronation: romReport[2].pronation,
                fwLPronation: romReport[3].pronation,
                fwRSupination: romReport[2].supination,
                fwLSupination: romReport[3].supination,
                fwExtension: romReport[2].extension,
                fwLExtension: romReport[3].extension,
                fwRFlexion: romReport[2].flexion,
                fwLFlexion: romReport[3].flexion,
                fwRRadialDeviation: romReport[2].radialDeviation,
                fwLRadialDeviation: romReport[3].radialDeviation,
                fwRUlnarDeviation: romReport[2].ulnarDeviation,
                fwLUlnarDeviation: romReport[3].ulnarDeviation,

                elRExtension: romReport[4].extension,
                elLExtension: romReport[5].extension,
                elRFlexion: romReport[4].flexion,
                elLFlexion: romReport[5].flexion,
                elRPronation: romReport[4].pronation,
                elLPronation: romReport[5].pronation,
                elRSupination: romReport[4].supination,
                elLSupination: romReport[5].supination,

                hipRFlexion: romReport[8].flexion,
                hipLFlexion: romReport[9].flexion,
                hipRExtension: romReport[8].extension,
                hipLExtension: romReport[9].extension,
                hipAbduction: romReport[8].abduction,
                hipLAbduction: romReport[9].abduction,
                hipRAdduction: romReport[8].adduction,
                hipLAdduction: romReport[9].adduction,
                hipIrRight: romReport[8].internalRotation,
                hipLeft: romReport[9].internalRotation,
                hipErRight: romReport[8].externalRotation,
                hipErLeft: romReport[9].externalRotation,

                knRFlexion: romReport[10].flexion,
                knLFlexion: romReport[11].flexion,
                knRExtension: romReport[10].extension,
                knLExtension: romReport[11].extension,

                anRDorsiflexion: romReport[12].dorsiflexion,
                anLDorsiflexion: romReport[13].dorsiflexion,
                anRPlantarflexion: romReport[12].plantarFlexion,
                anPlantarflexion: romReport[13].plantarFlexion,
                anRInversion: romReport[12].inversion,
                anLInversion: romReport[13].inversion,
                anREversion: romReport[12].eversion,
                anLEversion: romReport[13].eversion,

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
                attentionAndConcentrationComment: assessmentReport[23],
                genderPronoun: assessmentReport[24],
                memoryScore: assessmentReport[25],
                memoryTotalScore: assessmentReport[26],
                memoryAssessmentType: assessmentReport[27],
                memoryComment: assessmentReport[28],
                insightComment: assessmentReport[29],
                readingComment: assessmentReport[30],
                speechComment: assessmentReport[31],
                writingComment: assessmentReport[32],
                visualPerceptionComment: assessmentReport[33],
                // Functional Assessment
                // Work Assessment
                jobDescription: assessmentReport[34],
                workAssessment: assessmentReport[35],
                discussion: assessmentReport[36],
                recommendations: assessmentReport[37]
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

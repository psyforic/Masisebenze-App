import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import * as Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import * as Pizzip from 'pizzip';
import * as moment from 'moment';
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
                earlyChildhood: clientData.earlyChildhood,
                family: clientData.family,
                homeEnvironment: clientData.homeEnvironment,
                educational: clientData.education,
                premorbid: workData.premorbid,
                postmorbid: workData.postMorbid,
                socialHabits: clientData.socialHabits,
                previousInjuries: medicalData.previousInjuries,
                medicalConditions: medicalData.medicalConditions,
                currentHistory: medicalData.currentHistory,
                medication: medicalData.medication,
                workHistory: workData.description,
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
                console.log(JSON.stringify({ error: e }));
                // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
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

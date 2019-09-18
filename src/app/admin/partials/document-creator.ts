import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import * as Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import * as Pizzip from 'pizzip';
export class DocumentCreator {

    generateDoc(data, today) {
        const clientData = data[0];
        const address = data[1];
        const workData = data[2];
        const medicalData = data[3];

        console.log(clientData.idNumber);
        const idNumber: string = '' + clientData.idNumber;

        const tempDate = new Date(
            +idNumber.substr(0, 2),
            +(idNumber.substring(2, 4)) - 1,
            +idNumber.substring(4, 6));
        const id_date = tempDate.getDate();
        const id_month = tempDate.getMonth();
        const id_year = tempDate.getFullYear();
        const fullDate = id_date + '-' + (id_month + 1) + '-' + id_year;
        let currentAge = new Date().getFullYear() - id_year;
        if (id_month > new Date().getMonth()) {
            currentAge = currentAge - 1;
        }
        function loadFile(url, callback) {
            JSZipUtils.getBinaryContent(url, callback);
        }
        loadFile('../../../assets/doc/template.docx', function (error, content) {
            if (error) { throw error; }
            const zip = new Pizzip(content);
            // const zip = JSZip.loadAsync(content);
            const doc = new Docxtemplater().loadZip(zip);
            doc.setData({
                fullName: clientData.firstName + ' ' + clientData.lastName,
                dateOfBirth: fullDate,
                age: currentAge,
                idNumber: clientData.idNumber,
                line1: address.line1,
                line2: address.line2,
                city: address.city,
                postalCode: address.postalCode,
                dateOfInjury: clientData.dateOfInjury,
                assessmentDate: clientData.assessmentDate,
                today: today,
                attorney: 'my Attorney',
                lawFirm: 'clientData.lawFirm.companyName,',
                lawFirmCity: 'clientData.lawFirm.physicalAddress.city,',
                earlyChildhood: clientData.earlyChildhood,
                family: clientData.family,
                homeEnvironment: clientData.homeEnvironment,
                educational: clientData.educational,
                premorbid: workData.premorbid,
                postmorbid: workData.postmorbid,
                socialHabits: clientData.socialHabits,
                previousInjuries: medicalData.previousInjuries,
                medicalConditions: medicalData.medicalConditions,
                currentHistory: medicalData.currentHistory,
                medication: medicalData.description,
                workHistory: workData.description,
            });

            try {
                // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
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
            saveAs(out, 'report.docx');
        });
    }
}

import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import * as Docxtemplater from 'docxtemplater';
import { saveAs } from 'file-saver';
import * as Pizzip from 'pizzip';
export class DocumentCreator {

    generateDoc(data, today) {
        const clientData = data[0];
        const workData = data[1];
        const medicalData = data[2];
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
                dateOfBirth: clientData.dob,
                age: clientData.age,
                line1: '',
                line2: 'clientData.address.line2',
                city: 'clientData.address.city',
                postalCode: 'clientData.address.postalCode',
                dateOfInjury: clientData.dateOfInjury,
                assessmentDate: clientData.assessmentDate,
                today: today,
                attorney: clientData.attorney.firstName + ' ' + clientData.attorney.lastName,
                lawFirm: clientData.lawFirm.companyName,
                lawFirmCity: clientData.lawFirm.physicalAddress.city,
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
            saveAs(out, clientData.firstName + ' ' + clientData.lastName + '.docx');
        });
    }
}

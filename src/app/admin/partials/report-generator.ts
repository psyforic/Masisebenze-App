import { Document, Paragraph, Packer, TextRun, HeadingLevel, Table } from 'docx';
import { purpose, purposeBullets } from './static-text';

export class ReportGenerator {

    create(data) {
        const personalHistory = data[0];
        const address = data[1];
        const workData = data[2];
        const medicalData = data[3];
        const _purpose = purpose;
        const bullets1: any[] = purposeBullets;
        const document = new Document();
        document.addSection({
            children: [
                this.purposeOfReport(),
                this.reportDescription(_purpose),
                this.purposeOfReportList(bullets1)[0],
                this.purposeOfReportList(bullets1)[1],
                this.purposeOfReportList(bullets1)[2],
                this.sourcesOfInformation(),
                this.interviewAndAssessment(),
                this.interviewAssessmentDescription(personalHistory.firstName + ' ' +
                    personalHistory.lastName, personalHistory.assessmentDate, address),
                this.createHistory(),
                this.createPersonalHistory(),
                this.childhoodHistory(),
                this.childHoodHistoryDescription(personalHistory.childhood),
                this.familyHistory(),
                this.familyhistoryDescription(personalHistory.firstName),
                this.homeEnvironment(),
                this.homeEnvironmentDescription(personalHistory.homeEnvironment),
                this.educationalHistory(),
                this.educationalHistoryDescription(personalHistory.education),
                this.workHistoryTitle(),
                this.socialHabits(),
                this.previousInjuries(),
                this.medicalConditions(),
                this.medication(),
                this.currentHistory(),
                this.createWorkHistory(),
                new Paragraph({
                    text: '4. Components of Assessment',
                    heading: HeadingLevel.TITLE,
                    style: 'color: #000000'
                })

            ]
        });
        return document;
    }
    purposeOfReport() {
        const para = new Paragraph({
            text: '1. Purpose of report',
            heading: HeadingLevel.TITLE,
            style: 'color: #000000'
        });
        return para;
    }
    reportDescription(Rep_purpose) {
        return new Paragraph({
            text: Rep_purpose
        });
    }
    purposeOfReportList(list) {
        const arr = [];
        for (const item of list) {
            arr.push(new Paragraph(
                {
                    text: item,
                    bullet: {
                        level: 0
                    }
                }));
        }
        return arr;
    }
    sourcesOfInformation() {
        const sourceOfInfo = new Paragraph({
            text: '2. Sources of Information',
            heading: HeadingLevel.TITLE,
            style: 'color: #000000'

        });
        return sourceOfInfo;
    }
    interviewAndAssessment() {
        const sourceOfInfo = new Paragraph({
            text: '2.1 Interview and assessment',
            heading: HeadingLevel.HEADING_2,
            style: 'color: #000000'

        });
        return sourceOfInfo;
    }
    interviewAssessmentDescription(fullName, date, address) {
        const writing = new Paragraph({
            text: `The writer consulted with ${fullName} on ${date} ${address},
         for interview and Assessment. `});
    }
    documentation(documents) {
        const table = new Table({
            rows: 4,
            columns: 3,
        });
        return table;
    }


    createHistory() {
        const workHistory = new Paragraph({
            text: '3 History',
            heading: HeadingLevel.TITLE,
            style: 'color: #000000'
        });

        return workHistory;
    }
    createPersonalHistory() {
        const workHistory = new Paragraph({
            text: '3.1 Personal History',
            heading: HeadingLevel.HEADING_2,
            style: 'color: #000000'
        });

        return workHistory;
    }
    childhoodHistory() {
        const para = new Paragraph({
            text: '3.1.1 EarlyChildhood:',
            heading: HeadingLevel.HEADING_3
        });
        return para;
    }
    childHoodHistoryDescription(cdHistory) {
        const history = new Paragraph({ text: cdHistory });
        return history;
    }

    familyHistory() {
        const para = new Paragraph({
            text: '3.1.2 Family:',
            heading: HeadingLevel.HEADING_3,
            style: 'color: #000000'
        });
        return para;
    }
    familyhistoryDescription(cdHistory) {

        const history = new Paragraph(new TextRun(cdHistory));
        return history;
    }
    homeEnvironment() {
        const para = new Paragraph({
            text: '3.1.3 Home Environment:',
            heading: HeadingLevel.HEADING_3,
            style: 'color: #000000'
        });

    }
    homeEnvironmentDescription(cdHistory) {
        const history = new Paragraph({ text: cdHistory });
        return history;
    }
    educationalHistory() {
        const para = new Paragraph({
            text: '3.1.4 Educational:',
            heading: HeadingLevel.HEADING_3,
            style: 'color: #000000',

        });
        return para;

    }
    educationalHistoryDescription(cdHistory) {

        const history = new Paragraph({ text: cdHistory });
        return history;
    }

    workHistoryTitle() {
        const title = new Paragraph({
            text: '3.1.5 Work',
            heading: HeadingLevel.HEADING_2,
            style: 'color:#000000'
        });
        return title;
    }
    workHistory(premorbid, postmorbid) {
        const heading = new Paragraph({
            text: '3.1.5.1 Premorbid',
        });

        const premo = new TextRun(premorbid);
        heading.addRun(premo);
        const post = new TextRun(postmorbid);
        heading.addRun(post);

        return heading;
    }
    socialHabits() {
        const para = new Paragraph({
            text: '3.1.6 Social Habits',
            heading: HeadingLevel.HEADING_2,
            style: 'color: #000000'
        });

        return para;
    }

    medicalHistory() {
        return new Paragraph({
            text: '3.2 Medical History',
            heading: HeadingLevel.TITLE,
            style: 'color:#000000'
        });
    }
    medicalHistorySub() {
        return new Paragraph({
            text: '3.2.1 Past Medical History',
            heading: HeadingLevel.HEADING_2,
            style: 'color:#000000'
        });
    }
    previousInjuries() {
        const subtitle = new Paragraph({
            text: '3.2.1.1 Previous Injuries'
        });
        return subtitle;
    }
    medicalConditions() {
        const subtitle = new Paragraph({
            text: '3.2.1.2 Medical Conditions'
        });
        return subtitle;
    }
    medication() {
        const para = new Paragraph({
            text: '3.2.2.1 Medication'
        });

        return para;
    }
    currentHistory() {
        const paragraph = new Paragraph({
            text: '3.2.2Current History',
            heading: HeadingLevel.HEADING_2,
            style: 'color:#000000'
        });
        return paragraph;
    }

    createWorkHistory() {
        const paragraph = new Paragraph({
            text: '3.3 \t \t \t \t Work History',
            heading: HeadingLevel.TITLE
        });
        return paragraph;

    }

    workHistorySub(title, firstName) {
        const paragraph = new Paragraph({
            text: `${title} ${firstName} Provided the following work history`
        });
        return paragraph;
    }
    workHistoryContent(content) {
        const para = new Paragraph(new TextRun(content));
        return para;
    }

    createComponents() {
        const paragraph = new Paragraph(
            {
                text: '4. Components Of Assessment',
                heading: HeadingLevel.TITLE,
                style: 'color:#000000'
            });
    }

    currentComplaints(complaint) {
        const paragraph = new Paragraph({
            text: '4.1 Current Complaints',
            heading: HeadingLevel.HEADING_2,
            style: 'color:#000000'
        });
        const run = new TextRun(complaint);
        return paragraph.addRun(complaint);
    }

    listOfComplaints(complaints) {
        const arr = [];

        for (const complaint of complaints) {
            arr.push(new Paragraph({
                text: complaint,
                bullet: {
                    level: 1
                }
            }));
        }
        return arr;
    }
}

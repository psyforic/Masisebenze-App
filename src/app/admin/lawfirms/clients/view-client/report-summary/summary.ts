export interface Summary {
    discussion: string;
    lossOfAmenities: string;
    residualWorkCapacity: string;
    futureMedicalExpenses: string;
    futureMedicalAndSurgicalIntervention: string;
    supplementaryHealthServices: string;
    physiotherapy: string;
    occupationalTherapy: string;
    specialEquipment: string;
    caseManagement1: string;
    psychology: string;
    transportationCosts: string;
    recommendations: string;
    homeAdaptions: string;
}
   // tslint:disable-next-line: max-line-length
export const summary: Summary = {
    discussion: '',
    lossOfAmenities: '<p>This has been significant/insignificant.&nbsp;The claimant has been scarred which is permanent in nature.' +
        '</p><p>There are functional limitations which will be permanent in nature.</p>',
    residualWorkCapacity: '<p><br></p><p>5.1.2 Residual work capacity</p><p><br></p><p><u>Summary of medical opinion</u>:</p><p><br>' +
        '</p><p><u>Neurosurgeon, Dr &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
        '&nbsp;diagnosed</u>:</p><p><br>' +
        '</p><p><br></p><p><br></p><p>Orthopaedic surgeon, Dr. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
        '&nbsp;&nbsp;&nbsp;diagnosed:</p><p><br></p><p>Maxillofacial - and oral surgeon, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Dr .&nbsp;diagnosed:</p><p><br></p><p><br></p><p>Clinical' +
        ' psychologist, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;, diagnosed:</p><p><br></p><p><br></p>' +
        '<p><br></p><p>The claimant demonstrated the residual capacity to manage a job with&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;demands or lighter.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p><br></p>' +
        '<p>The claimant’s ability to work on the open labour market has been compromised significantly by the injuries' +
        ' sustained and will need a measure of supervision for the rest of her life.</p>',
    futureMedicalExpenses: '<p>All costs and the extent of intervention required as indicated below are approximations.</p>',
    futureMedicalAndSurgicalIntervention: '<p>Drs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
        '&nbsp;&nbsp;&nbsp;provided for the necessary medical treatment.</p>',
    supplementaryHealthServices: '<p><em>It should be noted that tariffs are no longer fixed and may vary from one Service' +
        ' Provider to another. Should the service providers be required to travel to the location of the client, this should' +
        ' also be included. AA rates are recommended to cover the mileage.&nbsp;</em></p>',
    physiotherapy: '<ul><li>&nbsp;The client would benefit from an assessment by a Physiotherapist with regards to his/her ' +
        'joint stiffness and pain.&nbsp;The number of sessions required for this will be determined by the service provider ' +
        'depending on the evaluation findings.</li><li>Cost of sessions will be determined by the service provider as tariffs ' +
        'are no longer dictated.&nbsp;</li><li>&nbsp;Should surgery be required at a later stage, further Physiotherapy may become ' +
        'necessary.&nbsp;</li></ul>',
    occupationalTherapy: '<p class="ql-align-justify">5.2.6.1&nbsp;&nbsp;From a cognitive perspective the claimant would benefit ' +
        'from practical group work sessions &nbsp;&nbsp;&nbsp;</p><p class="ql-align-justify">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;and/or support group sessions run by an Occupational Therapist working specifically in the &nbsp;' +
        '</p><p class="ql-align-justify">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;field of psychiatry/ ' +
        'traumatic brain injury.</p><p class="ql-align-justify"><br></p><p class="ql-align-justify">5.2.6.2&nbsp;The claimant will ' +
        'benefit from 5 -10 hours’ occupational therapy, which should include:</p><ul><li class="ql-align-justify">Teaching joint ' +
        'protection and ergonomic principles, energy-saving techniques and method simplification principles in his/her activities of' +
        'daily living to reduce stress and strain on the affected joints</li><li class="ql-align-justify">Identification of appropriate' +
        ' assistive devices, and correct use and care of such equipment</li><li class="ql-align-justify">Family support and guidance on ' +
        'how to support and handle the claimant</li><li class="ql-align-justify">Introduction to alternative and constructive leisure time' +
        ' spending</li></ul><p class="ql-align-justify"><br></p><p class="ql-align-justify">5.2.6.2&nbsp;In the longer term, the claimant ' +
        'will require ongoing access to an Occupational Therapist during times of change or crisis. I recommend that allowance be made for ' +
        '<strong>1 hour home visit once per year for 2 years</strong>.&nbsp;</p><p class="ql-align-justify"><br></p>' +
        '<p class="ql-align-justify">5.2.6.3 Occupational therapy fees are presently R550.00 – R 700.00 per hour including VAT.' +
        ' This fee is not fixed and does vary slightly. Allowance should be made for the therapist’s travel costs and time at' +
        ' current AA and occupational therapy rates.</p><p class="ql-align-justify"><br></p><p class="ql-align-justify">5.2.7' +
        ' Orthotist</p><p class="ql-align-justify">5.2.8&nbsp;Dietician</p><p class="ql-align-justify">5.2.9 Speech and language' +
        ' therapist</p><p class="ql-align-justify">5.2.10 Pain clinic:&nbsp;&nbsp;</p><p class="ql-align-justify"><br></p><ul>' +
        '<li class="ql-align-justify">DBC</li><li class="ql-align-justify">Dr. E Buitendag</li></ul><p><br></p>',
    specialEquipment: '',
    caseManagement1: '<p class="ql-align-justify">5.2.9.1&nbsp;&nbsp;Case Management</p><p class="ql-align-justify"><br></p>' +
        '<p class="ql-align-justify">When considering the available information and the claimant’s functioning, it seems that she' +
        ' will benefit from obtaining a case manager.</p><p><br></p><p>The role of the case manager is to co-ordinate medical services' +
        ' to ensure the quality and continuity of services to a specific patient/client.</p><p><br></p><ul><li>Oversee implementation of' +
        ' plans</li><li>Adaptation to plans where necessary</li><li>Oversee follow-up consultations within the multi-disciplinary team</li>' +
        '<li>Facilitate communication between care providers&nbsp;</li><li>Communicate test results/ changes in medication between care' +
        ' providers</li><li>Crisis management</li><li>Education of client/family/home care workers</li><li>Assessment of appropriate ' +
        'home environment&nbsp;&nbsp;</li><li>Collect/store medical records for easy access to team</li></ul><p><br></p><p>The rate of' +
        ' the Case Manager will be determined by the specific qualification as the rates differ from profession to profession.&nbsp;</p>' +
        '<p><br></p><p>5.2.9.2&nbsp;&nbsp;Provision should be made for a full-time care worker/domestic worker at a rate of R 250.00 per' +
        ' day.&nbsp;She has been dependent on care and supervision from the date of the accident and this will continue into the future.' +
        '</p><p><br></p><p>5.2.9.3&nbsp;&nbsp;Provision should be made for the services of a gardener/handy man for 1 day per week/month' +
        ' at a rate of R 180.00 – R 220.00 per day.</p><p><br></p><p>5.2.9.4&nbsp;<span style="color: black;">&nbsp;Provision should be' +
        ' made for personal assistance for 1 - 4 weeks following surgery at R 200.00 per day.</span></p><p><br></p>',
    psychology: '<p>The report from a clinical psychologist may contribute/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
        'is noted.</p>',
    transportationCosts: '<p>It would be fair for the claim to cater for transport costs for the client to attend medical and ' +
        'rehabilitation related examination / treatment sessions. Transport costs are recommended at AA rates.</p><p><br></p>' +
        '<p>Transport by sedan motor may be necessary after surgery as minibus transfers will be difficult and unsafe.</p>',
    recommendations: '<p>Considering injury ethology, prognosis, treatment (medical and rehabilitative) proposed, test results' +
        ' obtained and observations made on the day of the assessment, as well as reporting by various specialists, the following' +
        ' recommendations are made:&nbsp;</p>',
    homeAdaptions: ''
};

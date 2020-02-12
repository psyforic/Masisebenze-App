import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { NewContactComponent } from '../new-contact/new-contact.component';
import { NewClientComponent } from '../new-client/new-client.component';
import { ActivatedRoute } from '@angular/router';
import {
  LawFirmServiceProxy,
  LawFirmDetailOutput,
  ContactListDto,
  ContactServiceProxy,
  ClientServiceProxy,
  ClientListDto,
  AttorneyListDto,
  CreateAddressInput,
  WorkHistoryDetailOutput,
  MedicalHistoryDetailOutput,
  DocumentListDto,
  DocumentServiceProxy,
  AddressDetailOutput,
  ClientDetailOutput
} from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { NewAttorneyComponent } from '../../attorneys/new-attorney/new-attorney.component';
import { ViewAttorneyComponent } from '../../attorneys/view-attorney/view-attorney.component';
import { EditAttorneyComponent } from '../../attorneys/edit-attorney/edit-attorney.component';
import { EditContactComponent } from '../../contacts/edit-contact/edit-contact.component';
import { DocumentCreator } from '@app/admin/partials/document-creator';
import * as moment from 'moment';
import { AppComponentBase } from '@shared/app-component-base';


@Component({
  selector: 'app-view-lawfirm',
  templateUrl: './view-lawfirm.component.html',
  styleUrls: ['./view-lawfirm.component.scss'],
  providers: [LawFirmServiceProxy, ContactServiceProxy, ClientServiceProxy, DocumentServiceProxy]
})
export class ViewLawfirmComponent extends AppComponentBase implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  @ViewChild(MatPaginator, { static: false }) clientPaginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) clientSort: MatSort;


  @ViewChild(MatPaginator, { static: false }) attorneyPaginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) attorneySort: MatSort;

  @ViewChild('newContact', { static: false }) newContactRef: NewContactComponent;
  @ViewChild('editContact', { static: false }) editContactRef: EditContactComponent;

  @ViewChild('newClient', { static: false }) newClientRef: NewClientComponent;
  @ViewChild('newAttorney', { static: false }) newAttorneyRef: NewAttorneyComponent;
  @ViewChild('viewAttorney', { static: false }) viewAttorneyRef: ViewAttorneyComponent;
  @ViewChild('editAttorney', { static: false }) editAttorneyRef: EditAttorneyComponent;


  dataSource: MatTableDataSource<ContactListDto> = new MatTableDataSource<ContactListDto>();
  clientDataSource: MatTableDataSource<ClientListDto> = new MatTableDataSource<ClientListDto>();
  attorneyDataSource: MatTableDataSource<AttorneyListDto> = new MatTableDataSource<AttorneyListDto>();

  contacts: ContactListDto[] = [];
  clients: ClientListDto[] = [];
  attorneys: AttorneyListDto[] = [];

  displayedColumns = ['firstName', 'lastName', 'email', 'role', 'actions'];
  displayedAttCols = ['firstName', 'lastName', 'email', 'phone', 'actions'];
  clientDisplayedColumns = ['firstName', 'lastName', 'dob', 'age', 'dateOfInjury', 'actions'];

  lawFirmId: string;
  lawFirm: LawFirmDetailOutput = new LawFirmDetailOutput();
  isSaving = false;
  isLoading = false;
  workData: WorkHistoryDetailOutput = new WorkHistoryDetailOutput();
  medicalData: MedicalHistoryDetailOutput = new MedicalHistoryDetailOutput();
  lawFirmCity: string;
  documents: DocumentListDto[] = [];
  filteredDocuments;
  constructor(private injector: Injector,
    private route: ActivatedRoute,
    private lawFimService: LawFirmServiceProxy,
    private contactService: ContactServiceProxy,
    private clientService: ClientServiceProxy,
    private documentService: DocumentServiceProxy) {
    super(injector);
    this.route.paramMap.subscribe((paramMap) => {
      this.lawFirmId = paramMap.get('id');

    });
  }
  ngOnInit() {
    this.getLawFirm();
    this.getAttorneys();
    this.getContacts();
    this.getClients();
  }
  getLawFirm() {
    this.isLoading = true;
    this.lawFirm.physicalAddress = new AddressDetailOutput();
    this.lawFirm.postalAddress = new AddressDetailOutput();
    this.lawFimService.getDetail(this.lawFirmId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.lawFirm = result;
      });
  }
  getFileData(id) {
    this.documentService.getClientDocuments(id)
      .pipe(finalize(() => { }))
      .subscribe((result) => {
        this.documents = result.items;
        const filtered = this.documents.map((value) => {
          return { date_authored: moment(value.authorDate).format('DD/MM/YYYY'), file_name: value.name, author_name: value.authorName };
        });
        this.filteredDocuments = filtered;
      });
  }
  addContact() {
    this.newContactRef.open();
  }
  editSelectedContact(id: string) {
    this.editContactRef.open(id);
  }
  deleteContact(contact: any) {
    this.editContactRef.delete(contact);
  }
  addClient() {
    this.newClientRef.open(this.lawFirmId);
  }
  addAttorney() {
    this.newAttorneyRef.open();
  }
  displayContact(contact) {
    this.getContacts();
  }
  viewSelectedAttorney(id: string) {
    this.viewAttorneyRef.open(id);
  }
  editSelectedAttorney(id: string) {
    this.editAttorneyRef.open(id);
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.clientDataSource.filter = filterValue;
  }
  getAttorneys() {
    this.isLoading = true;
    this.lawFimService.getAttorneys(this.lawFirmId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.attorneys = result.items;
        this.attorneyDataSource.data = result.items;
        this.attorneyDataSource.paginator = this.attorneyPaginator;
        this.attorneySort = this.attorneySort;
      });
  }
  deleteAttorney(entity: any) {
    this.editAttorneyRef.delete(entity);
    this.getAttorneys();
  }
  getAge(entity: ClientListDto) {
    const idNumber: string = '' + entity.idNumber;
    const tempDate = new Date(
      +idNumber.substr(0, 2),
      +(idNumber.substring(2, 4)) - 1,
      +idNumber.substring(4, 6));
    const id_month = tempDate.getMonth();
    const id_year = tempDate.getFullYear();
    let currentAge = new Date().getFullYear() - id_year;
    if (id_month > new Date().getMonth()) {
      currentAge = currentAge - 1;
    } else if (id_month === new Date().getMonth() && tempDate.getDate() < new Date().getDate()) {
      currentAge = currentAge - 1;
    }
    return currentAge;
  }

  getDob(entity: ClientListDto) {
    const idNumber: string = '' + entity.idNumber;
    const tempDate = new Date(
      +idNumber.substr(0, 2),
      +(idNumber.substring(2, 4)) - 1,
      +idNumber.substring(4, 6));
    const fullDate = moment(tempDate).format('DD/MM/YYYY');
    return fullDate;
  }
  generate(clientId: string) {
    this.isSaving = true;
    let entity: ClientDetailOutput = new ClientDetailOutput();
    this.clientService.getDetail(clientId).pipe(finalize(() => {
    })).subscribe((result) => {
      entity = result;
    });
    this.getMedicalHistory(clientId);
    this.getWorkHistory(clientId);
    this.getFileData(clientId);
    this.lawFirmCity = 'Port Elizabeth';
    const address: CreateAddressInput = new CreateAddressInput();

    this.clientService.getDetail(clientId)
      .pipe(finalize(() => {
        this.clientService.getMedicalHistoryByClientId(clientId)
          .pipe(finalize(() => { }))
          .subscribe((result) => {
            this.medicalData = result;
          });
        this.clientService.getWorkHistoryByClientId(clientId)
          .subscribe((result) => {
            this.workData = result;
          });
      }))
      .subscribe((result) => {
        address.line1 = result.address.line1;
        address.line2 = result.address.line2;
        address.city = result.address.city;
        address.postalCode = result.address.postalCode;
        address.province = result.address.province;
      });

    const docCreator = new DocumentCreator();
    setTimeout(() => {
      const today = moment().format('LL');
      docCreator.generateDoc([entity, address, this.filteredDocuments, this.medicalData, this.workData, this.lawFirmCity], today);
      this.notify.success('Document created successfully');
      this.isSaving = false;
    }, 5000);
  }
  getMedicalHistory(id) {
    this.clientService.getMedicalHistoryByClientId(id)
      .pipe(finalize(() => {
      }))
      .subscribe((result) => {
        this.medicalData = result;
      });
  }

  getWorkHistory(id) {
    this.clientService.getWorkHistoryByClientId(id)
      .pipe(finalize(() => {

      }))
      .subscribe((result) => {
        this.workData = result;
      });
  }
  getContacts() {
    this.isLoading = true;
    this.contactService.getByLawFirm(this.lawFirmId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.contacts = result.items;
        this.dataSource.data = this.contacts;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }
  getClients() {
    this.isLoading = true;
    this.lawFimService.getClients(this.lawFirmId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.clients = result.items;
        this.clientDataSource.data = result.items;
        this.clientDataSource.paginator = this.clientPaginator;
        this.clientDataSource.sort = this.clientSort;
      });
  }

  protected delete(entity: ContactListDto): void {
    abp.message.confirm(
      'Delete Contact \'' + entity.firstName + '\'?',
      (result: boolean) => {
        if (result) {
          this.contactService.delete(entity.id).pipe(finalize(() => {
            abp.notify.success('Deleted Contact: ' + entity.firstName);
          })).subscribe(() => {
            this.getContacts();
          });
        }
      }
    );
  }

  protected deleteClient(entity: ClientListDto): void {
    abp.message.confirm(
      'Delete Client \'' + entity.firstName + ' ' + entity.lastName + '\'?',
      (result: boolean) => {
        if (result) {
          this.contactService.delete(entity.id).pipe(finalize(() => {
            abp.notify.success('Deleted Client: ' + entity.firstName + ' ' + entity.lastName);
          })).subscribe(() => {
            this.getClients();
          });
        }
      }
    );
  }

}

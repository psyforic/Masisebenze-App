import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import {
  ClientServiceProxy,
  DocumentServiceProxy,
  ClientDetailOutput,
  CreateDocumentInput,
  DocumentListDto
} from '@shared/service-proxies/service-proxies';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss'],
  providers: [ClientServiceProxy, DocumentServiceProxy]
})
export class UploadDocumentComponent extends AppComponentBase implements OnInit {

  clientId: string;
  client: ClientDetailOutput = new ClientDetailOutput();
  document: CreateDocumentInput = new CreateDocumentInput();
  documents: DocumentListDto[] = [];
  documentForm: FormGroup;
  constructor(private injector: Injector,
    private route: ActivatedRoute,
    private clientService: ClientServiceProxy,
    private documentService: DocumentServiceProxy,
    private fb: FormBuilder) {
    super(injector);
    this.route.paramMap.subscribe((paramMap) => {
      this.clientId = paramMap.get('id');
    });
  }

  ngOnInit() {
    this.initializeForm();
    this.getClient();
    this.getDocuments();
  }
  initializeForm() {
    this.documentForm = this.fb.group({
      parentDocId: ['', Validators.required],
      name: ['', Validators.required],
      authorName: ['', Validators.required],
      authorDate: ['', Validators.required]
    });
  }
  getClient() {
    this.clientService.getDetail(this.clientId).subscribe((result) => {
      this.client = result;
    });
  }
  getDocuments() {
    this.documentService.getAllUserDocuments(this.clientId)
      .subscribe((result) => {
        this.documents = result.items;
        console.log(result);
      });
  }
  selectedId($event) {

  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from 'src/app/model/client';
import { ClientService } from 'src/app/services/client.service';
import { ToastrService } from 'ngx-toastr'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-form-client',
  templateUrl: './form-client.component.html',
  styleUrls: ['./form-client.component.scss']
})
export class FormClientComponent implements OnInit {
  client: Client = new Client();
  clientForm!: FormGroup;
  isEditMode = false;
  submitted = false;
  clientId!: string;


  breadcrumbList = [{ title: 'Clients', path: '/clients' }];

  constructor(private clientService: ClientService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder) {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['id']) {
        this.getClientById(params['id']);
        this.isEditMode = true;
        this.clientId = params['id'];
      }
    })
    const breadcrumb =
      { title: this.isEditMode === true ? 'Edit client' : 'Create client', path: this.isEditMode === true ? '/clients/edit?id=' + this.clientId : '/clients/create' };
    this.breadcrumbList.push(breadcrumb);
  }

  ngOnInit(): void {
    this.initForm();
  }
  initForm(): void {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      description: ['', Validators.required]
    });
  }
  save(): void {
    this.submitted = true;
    if (this.clientForm.valid) {
      if (this.isEditMode) {
        this.updateClient();
      } else {
        this.createClient();
      }
    }

  }

  cancel(): void {
    this.initForm();
    this.submitted = false;
    this.router.navigate(['clients']);

  }

  createClient(): void {
    this.clientService.createClient(this.clientForm.value).subscribe(
      (createdClient) => {
        this.toastr.success('Client created successfully.', 'Success');
        this.router.navigate(['clients']);
      },
      (error) => {

        this.toastr.error('Error creating client', error);
      }
    );
  }


  updateClient() {
    const clientToUpdate: Client = this.clientForm.value;
    clientToUpdate.id = this.client.id
    this.clientService.updateClient(clientToUpdate)
      .subscribe(
        updatedClient => {
          this.toastr.success('Client updated successfully', 'Success');
          this.router.navigate(['clients']);
        },
        error => {
          this.toastr.error('An error occurred while updating the client', 'Error');
        }
      );
  }

  getClientById(id: string) {
    this.clientService.getClientById(id).subscribe((value) => {
      this.client = value;
    })
  }

}


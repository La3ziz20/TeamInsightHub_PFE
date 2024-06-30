import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Project } from 'src/app/model/project';
import { ClientDtailsService } from 'src/app/services/client-dtails.service';
@Component({
  selector: 'app-form-project',
  templateUrl: './form-project.component.html',
  styleUrls: ['./form-project.component.scss']
})
export class FormProjectComponent implements OnInit {
  project: Project = new Project();
  projectForm!: FormGroup;
  isEditMode = false;
  submitted = false;
  clientId!: string;
  projectId!: string;


  breadcrumbList = [{ title: 'Clients', path: '/clients' }];


  constructor(private projectService: ClientDtailsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private fb: FormBuilder) {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['id']) {
        this.getProjectById(params['id']);
        this.isEditMode = true;
        this.projectId = params['id'];
      }
      this.clientId = params['clientId'];
    })
    const breadcrumb =
      [{ title: 'Client Details', path: '/client/details?id=' + this.clientId },
      { title: this.isEditMode === true ? 'Edit project' : 'Add project', path: this.isEditMode === true ? '/client/details/edit?id=' + this.projectId : '/client/details/Add?clientId=' + this.clientId }];
    this.breadcrumbList.push(...breadcrumb);
  }


  ngOnInit(): void {
    this.initForm();
  }
  initForm(): void {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      status: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      technology: ['', Validators.required],
      details: ['', Validators.required],

    });


  }
  save(): void {
    this.submitted = true;
    if (this.projectForm.valid) {
      if (this.isEditMode) {
        this.updateProject();
      } else {
        this.createProject();
      }
    }

  }
  cancel(): void {
    this.initForm();
    this.submitted = false;
    this.router.navigate(['/projects'])

  }
  getProjectById(id: string) {
    this.projectService.getProjectById(id).subscribe((value) => {
      this.project = value;
      if (this.project) {
        const startDate = this.datePipe.transform(this.project.startDate, 'yyyy-MM-dd');
        const endDate = this.datePipe.transform(this.project.endDate, 'yyyy-MM-dd');
        this.projectForm.patchValue({ ...this.project, startDate, endDate });
      }
    });
  }
  createProject(): void {
    this.project = this.projectForm.value;
    this.project.clientId = this.clientId;
    this.projectService.createProject(this.project).subscribe(
      (createdProject) => {
        this.toastr.success('project created successfully.', 'Success');
        this.router.navigate(['/client/details'], { queryParams: { id: this.clientId } });
      },
      (error) => {

        this.toastr.error('Error creating project', error);
      }
    );
  }


  updateProject() {
    const projectToUpdate: Project = this.projectForm.value;
    projectToUpdate.id = this.project.id

    this.projectService.updateProject(projectToUpdate)
      .subscribe(
        projectToUpdate => {
          this.toastr.success('project updated successfully', 'Success');
          this.router.navigate(['/client/details'], { queryParams: { id: this.project.clientId } });
        },
        error => {
          this.toastr.error('An error occurred while updating the project', 'Error');
        }
      );
  }
}

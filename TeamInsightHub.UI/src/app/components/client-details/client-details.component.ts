import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/model/project';
import { ClientDtailsService } from 'src/app/services/client-dtails.service';
import { ToastrService } from 'ngx-toastr';
import { PopupService } from 'src/app/services/popup.service';
import { Client } from 'src/app/model/client';
import { ClientService } from 'src/app/services/client.service';
import { UserDto } from 'src/app/dtos/user.dto';
import { LocalStorageService } from 'src/app/services/local-storage.service';


@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit {
  client!: Client;
  projects: Project[] = [];
  pageSizeOptions = [10, 20, 30];
  pageSize = 10;
  currentPage = 1;
  sortOrderASC: boolean = true;
  breadcrumbList = [{ title: 'Clients', path: '/clients' }];
  clientId!: string;
  currentuser!: UserDto;
  constructor(private clientService: ClientService,
    private activatedRoute: ActivatedRoute,
    private projectService: ClientDtailsService,
    private toastr: ToastrService,
    private popupService: PopupService,
    private localStorageService: LocalStorageService,
  ) {
    this.currentuser = this.localStorageService.getUserInfo();
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['id']) {
        this.clientId = params['id'];
        this.getClientById(this.clientId);
      }
    })
    const breadcrumb = {
      title: 'Client Details',
      path: '/client/details?id=' + this.clientId,
      queryParams: {}
    };
    this.breadcrumbList.push(breadcrumb);
  }

  ngOnInit(): void {
    this.getProjectsByClient();
  }
  getProjectsByClient() {
    if (!this.clientId) return;
    this.projectService.getProjectsByClient(this.clientId).subscribe(projects => {
      this.projects = projects;
    });
  }
  get paginatedProjects(): Project[] {
    return this.projects.slice(this.startIndex, this.endIndex);
  }
  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }
  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.projects.length);
  }

  nextPage() {
    if (this.currentPage < this.getPages().length) {
      this.currentPage++;
      this.paginatedProjects;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginatedProjects;
    }
  }
  getPages(): number[] {
    const total = Math.ceil(this.projects.length / this.pageSize);
    return Array.from({ length: total }, (_, index) => index + 1);
  }



  goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.getPages().length) {
      this.currentPage = pageNumber;
    }
  }
  sortData(criteria: keyof Project) {
    if (criteria === 'consultants') return;
    if (this.sortOrderASC) {
      this.projects.sort((a, b) => (a[criteria] > b[criteria]) ? 1 : -1);
      this.sortOrderASC = false;
    } else {
      this.projects.sort((a, b) => (a[criteria] < b[criteria]) ? 1 : -1);
      this.sortOrderASC = true;
    }


  }

  deleteProject(projectId: string): void {
    this.popupService.confrim('Are you sure you want to delete this project !!').then(confirmation => {
      if (confirmation) {
        this.projectService.deletProject(projectId).subscribe(
          () => {
            this.toastr.success('Project successfully deleted');
            this.getProjectsByClient();

          },
          error => {
            this.toastr.error('Error occurred while deleting the project', error);
          }
        );
      }
    });
  }
  getClientById(id: string) {
    this.clientService.getClientById(id).subscribe((value) => {
      this.client = value;
    })
  }
}



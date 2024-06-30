import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserDto } from 'src/app/dtos/user.dto';
import { Project } from 'src/app/model/project';
import { ClientDtailsService } from 'src/app/services/client-dtails.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { PopupService } from 'src/app/services/popup.service';
import { ProjectDetailsService } from 'src/app/services/project-details.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class ProjectComponent implements OnInit {
  listProject!: Project[];
  pageSizeOptions = [10, 20, 30];
  pageSize = 10;
  currentPage = 1;
  sortOrderASC: boolean = true;
  breadcrumbList = [{ title: 'Project', path: '/projects' }];
  currentuser!: UserDto;
  constructor(
    private projectsService: ProjectDetailsService,
    private projectservice: ClientDtailsService,
    private popupService: PopupService,
    private toastr: ToastrService,
    private localStorageService: LocalStorageService,
  ) {
    this.currentuser = this.localStorageService.getUserInfo();
   }

  ngOnInit(): void {
    this.getProjectList();
  }

  getProjectList() {
    this.projectsService.getAllProjects().subscribe((data: Project[]) => {
      this.listProject = data;
    });
  }

  get paginatedProject(): Project[] {
    return this.listProject.slice(this.startIndex, this.endIndex);
  }
  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }
  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.listProject.length);
  }

  nextPage() {
    if (this.currentPage < this.getPages().length) {
      this.currentPage++;
      this.paginatedProject;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginatedProject;
    }
  }
  getPages(): number[] {
    const total = Math.ceil(this.listProject.length / this.pageSize);
    return Array.from({ length: total }, (_, index) => index + 1);
  }



  deleteProject(projectId: string): void {
    this.popupService.confrim('Are you sure you want to delete this project !!').then(confirmation => {
      if (confirmation) {
        this.projectservice.deletProject(projectId).subscribe(
          () => {
            this.toastr.success('Project successfully deleted');
            this.listProject = this.listProject.filter(project => project.id !== projectId)
          },
          error => {
            this.toastr.error('Error occurred while deleting the project', error);
          }
        );
      }
    });
  }

  goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.getPages().length) {
      this.currentPage = pageNumber;
    }
  }
  sortData(criteria: keyof Project) {
    if (criteria === 'consultants') return;
    if (this.sortOrderASC) {
      this.listProject.sort((a, b) => (a[criteria] > b[criteria]) ? 1 : -1);
      this.sortOrderASC = false;
    } else {
      this.listProject.sort((a, b) => (a[criteria] < b[criteria]) ? 1 : -1);
      this.sortOrderASC = true;
    }

  }

}

import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/model/project';
import { ClientDtailsService } from 'src/app/services/client-dtails.service';
import { UserService } from 'src/app/services/user.service';
import { ProjectDetailsService } from 'src/app/services/project-details.service';
import { User } from 'src/app/model/user';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PopupService } from 'src/app/services/popup.service';
import { UserDto } from 'src/app/dtos/user.dto';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
})
export class ProjectDetailsComponent implements OnInit {
  breadcrumbList = [{ title: 'Client', path: '/clients' }];

  project!: Project;
  users!: User[];
  projectId!: string;
  sortOrderASC: boolean = true;
  selected!: boolean;
  showDropdown: boolean = false;
  searchInput = '';
  currentuser!: UserDto;
  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private toastr: ToastrService,
    private popupService: PopupService,
    private projectService: ClientDtailsService,
    private projectDetailService: ProjectDetailsService,
    private localStorageService: LocalStorageService,
  ) {
    this.currentuser = this.localStorageService.getUserInfo();
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['id']) {
        this.projectId = params['id'];
        this.getProjectById(this.projectId);
      }
    });
  }

  ngOnInit(): void {
    this.getUserList();
    this.showDropdown = true;
  }
  getUserList() {
    this.userService.getAllUsers().subscribe((data: User[]) => {
      this.users = data;
    });
  }

  getFiltredusers(): User[] {
    return this.users.filter(
      (user) =>
        !this.project.consultants
          ?.map((consultant) => consultant.id)
          .includes(user.id) &&
        (user.firstname
          .toLocaleUpperCase()
          .includes(this.searchInput.toLocaleUpperCase()) ||
          user.lastname
            .toLocaleUpperCase()
            .includes(this.searchInput.toLocaleUpperCase()))
    );
  }
  getProjectById(id: string) {
    this.projectService.getProjectById(id).subscribe((project) => {
      this.project = project;

      const breadcrumb = [
        {
          title: 'Client Details',
          path: '/client/details?id=' + project.clientId,
          queryParams: {},
        },
        {
          title: 'Project Details',
          path: '/project/details?id=' + this.projectId,
          queryParams: {},
        },
      ];
      this.breadcrumbList.push(...breadcrumb);
    });
  }

  sortData(criteria: keyof User) {
    if (this.sortOrderASC) {
      this.users.sort((a, b) => (a[criteria] > b[criteria] ? 1 : -1));
      this.sortOrderASC = false;
    } else {
      this.users.sort((a, b) => (a[criteria] < b[criteria] ? 1 : -1));
      this.sortOrderASC = true;
    }
  }
  addUsersToProject() {
    const consultantIds: string[] = this.users
      .filter((u) => u.selected)
      .map((u) => u.id);
    this.projectDetailService
      .updateConsultantsInProject(this.projectId, consultantIds)
      .subscribe(
        (updatedProject) => {
          this.toastr.success(
            'Consultants added to project successfully',
            'Success'
          );
          this.project = updatedProject;
          this.getUserList();
        },

        (error) => {
          this.toastr.error('Failed to add consultants to project', 'Error');
        }
      );
  }
  deleteConsultant(projectId: string, consultantId: string) {
    this.popupService
      .confrim('Are you sure you want to delete this consultant !!')
      .then((confirmation) => {
        if (confirmation) {
          this.projectDetailService
            .deletConsultantFromProject(projectId, consultantId)
            .subscribe(
              (project) => {
                this.toastr.success('Consultant successfully deleted');
                this.project = project;
              },
              (error) => {
                this.toastr.error(
                  'Error occurred while deleting the consultant',
                  error
                );
              }
            );
        }
      });
  }
}

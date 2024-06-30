import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDto } from 'src/app/dtos/user.dto';
import { Project } from 'src/app/model/project';
import { ClientDtailsService } from 'src/app/services/client-dtails.service';
import { PopupService } from 'src/app/services/popup.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  breadcrumbList = [{ title: 'Users', path: '/users' }];
  user!: UserDto;
  projects!: Project[];
  Userid!: string;
  pageSizeOptions = [10, 20, 30];
  pageSize = 10;
  currentPage = 1;
  sortOrderASC: boolean = true;
  constructor(
    private activatedRoute: ActivatedRoute,
    private userservice: UserService,
    private clientDetailsService: ClientDtailsService,
    private popupService: PopupService,
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['id']) {
        this.Userid = params['id'];
        this.getUserById(this.Userid);
      }
    });
    const breadcrumb = {
      title: 'User Details',
      path: '/users/details'
    };
    this.breadcrumbList.push(breadcrumb);
  }

  ngOnInit(): void {
    this.getUserById(this.Userid);
    this.getProjectsOfConnectedUser();
  }

  getUserById(id: string) {
    this.userservice.getUserById(id).subscribe((user) => {
      this.user = user;

    });
  }

  getProjectsOfConnectedUser() {
    this.clientDetailsService.getProjectsByConsultant(this.Userid).subscribe(projects => {
      this.projects = projects;
    });
  }

  changePassword() {
    this.popupService.changePasswordPopup();
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
}

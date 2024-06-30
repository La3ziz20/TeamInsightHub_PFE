import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserDto } from 'src/app/dtos/user.dto';
import { Project } from 'src/app/model/project';
import { ClientDtailsService } from 'src/app/services/client-dtails.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { PopupService } from 'src/app/services/popup.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
})
export class ProfilComponent implements OnInit {
  breadcrumbList = [{ title: 'Profile', path: '/profile' }];
  connectedUserId = '';
  user!: UserDto;
  projects!: Project[];
  constructor(
    private userservice: UserService,
    private route: Router,
    private toastr: ToastrService,
    private clientDetailsService: ClientDtailsService,
    private localStorageService: LocalStorageService,
    private popupService: PopupService,
  ) {
    this.connectedUserId = this.localStorageService.getUserInfo().id;
  }

  ngOnInit(): void {
    this.getUserById();
    this.getProjectsOfConnectedUser();
  }

  getUserById(): void {
    const user = this.userservice
      .getUserById(this.connectedUserId)
      .subscribe((user: UserDto) => {
        if (!user) {
          this.toastr.error('User not found');
          this.route.navigate(['']);
        } else {
          this.user = user;
        }
      });
  }

  getProjectsOfConnectedUser() {
    this.clientDetailsService.getProjectsByConsultant(this.connectedUserId).subscribe(projects => {
      this.projects = projects;
    });
  }

  changePassword() {
    this.popupService.changePasswordPopup();
  }
}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/model/user';
import { PopupService } from 'src/app/services/popup.service';
import { UserService } from 'src/app/services/user.service';
import { ChangeRolePopupComponent } from '../common/change-role-popup/change-role-popup.component';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserDto } from 'src/app/dtos/user.dto';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {
  listUser!: User[];
  pageSizeOptions = [10, 20, 30];
  pageSize = 10;
  currentPage = 1;
  sortOrderASC: boolean = true;
  breadcrumbList = [{ title: 'Users', path: '/users' }];
  currentuser!: UserDto;
  constructor(private popupService: PopupService,
    private userService: UserService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private localStorageService: LocalStorageService,){
      this.currentuser = this.localStorageService.getUserInfo();
    }

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList() {
    this.userService.getAllUsers().subscribe((data: User[]) => {
      this.listUser = data;
    });
  }

  get paginatedUsers(): User[] {
    return this.listUser.slice(this.startIndex, this.endIndex);
  }
  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }
  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.listUser.length);
  }

  nextPage() {
    if (this.currentPage < this.getPages().length) {
      this.currentPage++;
      this.paginatedUsers;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginatedUsers;
    }
  }
  getPages(): number[] {
    const total = Math.ceil(this.listUser.length / this.pageSize);
    return Array.from({ length: total }, (_, index) => index + 1);
  }



  goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.getPages().length) {
      this.currentPage = pageNumber;
    }
  }
  sortData(criteria: keyof User) {
    if (this.sortOrderASC) {
      this.listUser.sort((a, b) => (a[criteria] > b[criteria]) ? 1 : -1);
      this.sortOrderASC = false;
    } else {
      this.listUser.sort((a, b) => (a[criteria] < b[criteria]) ? 1 : -1);
      this.sortOrderASC = true;
    }

  }

  deleteUser(UserId: string) {
    this.popupService.confrim('Are you sure you want to delete this User !!').then(confiarmation => {
      if (confiarmation) {
        this.userService.deleteUser(UserId).subscribe(
          () => {
            this.toastr.success('User successfully deleted');
            this.getUserList();
          },
          error => {
            this.toastr.error('Error occurred while deleting the User', error);
          });
      }
    })

  }

  openChangeRoleDialog(id: string) {
    const dialogRef = this.dialog.open(ChangeRolePopupComponent, {
      data: { UserId: id },
      width: '500px',
    });
  }

}

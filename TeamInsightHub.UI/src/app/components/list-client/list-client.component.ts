import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserDto } from 'src/app/dtos/user.dto';
import { Client } from 'src/app/model/client';
import { ClientService } from 'src/app/services/client.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { PopupService } from 'src/app/services/popup.service';

@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.scss']
})
export class ListClientComponent implements OnInit {
  listClient!: Client[];
  pageSizeOptions = [10, 20, 30];
  pageSize = 10;
  currentPage = 1;
  currentuser!: UserDto;
  sortOrderASC: boolean = true;
  breadcrumbList = [{ title: 'Clients', path: '/clients' }];
  constructor(private popupService: PopupService,
    private clientService: ClientService,
    private toastr: ToastrService,
    private localStorageService: LocalStorageService,
    ){
      this.currentuser = this.localStorageService.getUserInfo();
    }

  ngOnInit(): void {
    this.getClientList();
  }

  getClientList() {
    this.clientService.getAllClients().subscribe((data: Client[]) => {
      this.listClient = data;
    });
  }

  get paginatedClients(): Client[] {
    return this.listClient.slice(this.startIndex, this.endIndex);
  }
  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }
  get endIndex(): number {
    return Math.min(this.startIndex + this.pageSize, this.listClient.length);
  }

  nextPage() {
    if (this.currentPage < this.getPages().length) {
      this.currentPage++;
      this.paginatedClients;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginatedClients;
    }
  }
  getPages(): number[] {
    const total = Math.ceil(this.listClient.length / this.pageSize);
    return Array.from({ length: total }, (_, index) => index + 1);
  }



  goToPage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.getPages().length) {
      this.currentPage = pageNumber;
    }
  }
  sortData(criteria: keyof Client) {
    if (this.sortOrderASC) {
      this.listClient.sort((a, b) => (a[criteria] > b[criteria]) ? 1 : -1);
      this.sortOrderASC = false;
    } else {
      this.listClient.sort((a, b) => (a[criteria] < b[criteria]) ? 1 : -1);
      this.sortOrderASC = true;
    }

  }

  deleteClient(clientId: string) {
    this.popupService.confrim('Are you sure you want to delete this client !!').then(confiarmation => {
      if (confiarmation) {
        this.clientService.deleteClient(clientId).subscribe(
          () => {
            this.toastr.success('Client successfully deleted');
            this.getClientList();
          },
          error => {
            this.toastr.error('Error occurred while deleting the client', error);
          });
      }
    })

  }
}




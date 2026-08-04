import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComplaintsService } from '../../../services/Complaints-Service/complaints.service';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { DistributionServiceService } from '../../../services/Distribution-Service/distribution-service.service';
import { SerchableDropdownComponent } from '../../../components/serchable-dropdown/serchable-dropdown.component';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';

@Component({
  selector: 'app-product-shortage-today-todo',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent, SerchableDropdownComponent],
  templateUrl: './product-shortage-today-todo.component.html',
  styleUrl: './product-shortage-today-todo.component.css'
})
export class ProductShortageTodayTodoComponent implements OnInit {

  itemsArr!: ShortageProducts[];
  officersArr!: Officers[];
  selectedItem!: ShortageProducts

  searchText: string = '';
  selectStatus: string = '';
  
  hasData: boolean = true;
  isLoading: boolean = true;

  isStatusDropdownOpen = false;
  statusDropdownOptions = ['Assigned', 'Not Assigned'];

  toggleStatusDropdown() {
    this.isStatusDropdownOpen = !this.isStatusDropdownOpen;
  }

  selectStatusOption(option: string) {
    this.selectStatus = option;
    this.isStatusDropdownOpen = false;
    this.filterStatus();
  }

  isModalOpen: boolean = false;
  selectedOfficerId!: number;
currentTime!: Date;
afterSixPm!: boolean;

  constructor(
    private router: Router,
    private ComplainSrv: ComplaintsService,
    private DistributionSrv: DistributionServiceService,
    private location: Location,
    private toastSrv: ToastAlertService
  ) { }


  ngOnInit(): void {
    this.currentTime = new Date();
    this.afterSixPm = this.currentTime.getHours() >= 18;
    this.getAllShortageTodayToDo();
  }

  getAllShortageTodayToDo(status: string = this.selectStatus, search: string = this.searchText) {
    console.log('status', this.selectStatus)
    this.isLoading = true;
    this.DistributionSrv.fetchAllShortageTodayToDo(status, search).subscribe(
      (res) => {
        this.itemsArr = res.data
        this.officersArr = res.officers
        console.log('itemsArr', this.itemsArr)
        if (res.data.length === 0) {
          this.hasData = false;
        } else {
          this.hasData = true;

        }
        this.isLoading = false;

      }
    )
  }

  assign(item: ShortageProducts) {}

  onSearch() {
    this.searchText = this.searchText.trimStart();
    this.getAllShortageTodayToDo();

  }

  offSearch() {
    this.searchText = '';
    this.getAllShortageTodayToDo();

  }

  filterStatus() {
    this.getAllShortageTodayToDo();
  }

  cancelStatus(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectStatus = '';
    this.isStatusDropdownOpen = false;
    this.getAllShortageTodayToDo();
  }

  openAssignOfficerModel(item: ShortageProducts) {
    this.selectedItem = item
    this.isModalOpen = true;
  }

  get officerDropdownItems() {
    return this.officersArr.map(officer => ({
      value: officer.id,
      label: `${officer.empId} - ${officer.firstNameEnglish} ${officer.firstNameEnglish}`
    }));
  }

  closeModal() {
     this.isModalOpen = false;
  }

 assignOfficer() {
  this.isLoading = true;

  const shortageId = this.selectedItem.id;
  const shortageAssignId = this.selectedItem.shortageAssignId;

  this.DistributionSrv
    .assignOfficerToProduct(shortageId, shortageAssignId, this.selectedOfficerId)
    .subscribe({
      next: (res: any) => {
        this.isLoading = false;

        if (res.success) {
          this.isModalOpen = false;
          this.toastSrv.success('Officer assigned Successfully.');
          this.getAllShortageTodayToDo();
        }
      },
      error: (err) => {
        this.isLoading = false;
          this.isModalOpen = false;
        this.toastSrv.error('Officer assign failed.');
      }
    });
}

  goBack() {
    this.location.back();
  }

}


class ShortageProducts {
  id!: number;
  shortageAssignId!: number;
  mpItemId!: number;
  qty!: number;
  displayName!: string;
  image!: string;
  assignOfficerId!: number | null;
  empId!: string;
  price!: number;
}


class Officers {
  id!: number;
  empId!: string;
  firstNameEnglish!: string;
  lastNameEnglish!: string;
  status!: string;
}
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComplaintsService } from '../../../services/Complaints-Service/complaints.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { DistributionServiceService } from '../../../services/Distribution-Service/distribution-service.service';


@Component({
  selector: 'app-product-shortage-today-todo',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule, LoadingSpinnerComponent],
  templateUrl: './product-shortage-today-todo.component.html',
  styleUrl: './product-shortage-today-todo.component.css'
})
export class ProductShortageTodayTodoComponent implements OnInit {

  itemsArr!: ShortageProducts[];

  searchText: string = '';
  selectStatus: string = '';
  
  hasData: boolean = true;
  isLoading: boolean = true;

  dummyData = [
  {
    id: 1,
    image: 'assets/images/product1.jpg',
    name: 'Chicken Curry',
    shortage: 'Traditional Sri Lankan chicken curry.',
    price: 1200,
    assignee: '',
    Assign: 1
  },
  {
    id: 2,
    image: 'assets/images/product2.jpg',
    name: 'Fish Curry',
    shortage: 'Spicy fish curry with coconut milk.',
    price: 950,
    assignee: 'CCM0001',
    Assign: 1
  },
  {
    id: 3,
    image: 'assets/images/product3.jpg',
    name: 'Dhal Curry',
    shortage: 'Creamy parippu curry.',
    price: 450,
    assignee: 'CCM0001',
    Assign: 0
  },
  {
    id: 4,
    image: 'assets/images/product4.jpg',
    name: 'Vegetable Stir Fry',
    shortage: 'Mixed vegetables with Sri Lankan spices.',
    price: 700,
    assignee: 'CCM0001',
    Assign: 0
  }
];

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


  constructor(
    private router: Router,
    private ComplainSrv: ComplaintsService,
    private DistributionSrv: DistributionServiceService
  ) { }


  ngOnInit(): void {
    this.getAllShortageTodayToDo();
  }

  getAllShortageTodayToDo(status: string = this.selectStatus, search: string = this.searchText) {
    this.isLoading = true;
    this.DistributionSrv.fetchAllShortageTodayToDo(status, search).subscribe(
      (res) => {
        this.itemsArr = res.items
        console.log('itemsArr', this.itemsArr)
        if (res.items.length === 0) {
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


}


class ShortageProducts {
  companyNameEnglish!: string;
  companyNameSinhala!: string;
  companyNameTamil!: string;
  manageFirstNameEnglish!: string;
  manageFirstNameSinhala!: string;
  manageFirstNameTamil!: string;
  manageLastNameEnglish!: string;
  manageLastNameSinhala!: string;
  manageLastNameTamil!: string;
  centerName!: string;
  regCode!: string;
}

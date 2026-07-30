import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComplaintsService } from '../../../services/Complaints-Service/complaints.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import Swal from 'sweetalert2';
import { DistributionComplaintsService } from '../../../services/distribution-complaints-service/distribution-complaints.service';
import { SerchableDropdownComponent } from '../../../components/serchable-dropdown/serchable-dropdown.component';
import { ProductShortageTodayCompletedComponent } from '../../../application/product-storage/product-shortage-today-completed/product-shortage-today-completed.component';
import { ProductShortageTodayTodoComponent } from '../../../application/product-storage/product-shortage-today-todo/product-shortage-today-todo.component'

@Component({
  selector: 'app-product-shortage-today',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductShortageTodayCompletedComponent, SerchableDropdownComponent, ProductShortageTodayTodoComponent],
  templateUrl: './product-shortage-today.component.html',
  styleUrl: './product-shortage-today.component.css'
})
export class ProductShortageTodayComponent implements OnInit {

  isSelectToDo: boolean = true;
  isSelectCompleted: boolean = false;
  
  category: string = '';
  complaint: string = '';
  isLoading: boolean = false;

  constructor(
    private complaintsService: ComplaintsService,
    private toastSrv: ToastAlertService,
    private DistributionComplaintsSrv: DistributionComplaintsService,
    private location: Location
  ) { }

  ngOnInit(): void {
    
  }

  selectToDo() {
    this.isSelectToDo = true;
    this.isSelectCompleted = false;
  }

  selectCompleted() {
    this.isSelectToDo = false;
    this.isSelectCompleted = true;
  }

    goBack() {
    this.location.back();
  }

}

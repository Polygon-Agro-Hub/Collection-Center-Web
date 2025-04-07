import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExpensesComponent } from '../expenses/expenses.component';
// import { CchSendComplaintComponent } from '/cch-send-complaint/cch-send-complaint.component';
import { ComplaintsService } from '../../../services/Complaints-Service/complaints.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { CollectionComponent } from '../collection/collection.component';

@Component({
  selector: 'app-collection-reports',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ExpensesComponent, LoadingSpinnerComponent, CollectionComponent
  ],
  templateUrl: './collection-reports.component.html',
  styleUrl: './collection-reports.component.css'
})
export class CollectionReportsComponent implements OnInit {

  isLoading: boolean = false;

  isSelectExpenses: boolean = true;
  isSelectCollection: boolean = false;

  constructor(
    private complaintsService: ComplaintsService,
    private toastSrv: ToastAlertService
  ) { }

  ngOnInit(): void {

  }

  selectExpenses() {
    this.isSelectExpenses = true;
    this.isSelectCollection = false;
  }

  selectCollection() {
    this.isSelectCollection = true;
    this.isSelectExpenses = false;
  }


}

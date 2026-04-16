import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComplaintsService } from '../../../services/Complaints-Service/complaints.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { RedefineTodoOrdersComponent } from '../redefine-todo-orders/redefine-todo-orders.component';
import { RedefineSentToDispatchOrdersComponent } from '../redefine-sent-to-dispatch-orders/redefine-sent-to-dispatch-orders.component';


@Component({
  selector: 'app-redefine-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RedefineTodoOrdersComponent, LoadingSpinnerComponent, RedefineSentToDispatchOrdersComponent],
  templateUrl: './redefine-orders.component.html',
  styleUrl: './redefine-orders.component.css'
})
export class RedefineOrdersComponent implements OnInit {

  isLoading: boolean = false;

  isSelectToDo: boolean = true;
  isSelectSentToDispatch: boolean = false;

  constructor(
    private toastSrv: ToastAlertService
  ) { }

  ngOnInit(): void {

  }

  onSwitchToOutForDelivery() {
    this.selectSentToDispatch();
  }

  selectToDo() {
    this.isSelectToDo = true;
    this.isSelectSentToDispatch = false;
  }

  selectSentToDispatch() {
    this.isSelectSentToDispatch = true;
    this.isSelectToDo = false;
  }


}

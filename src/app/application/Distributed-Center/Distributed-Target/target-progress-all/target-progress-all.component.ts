import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComplaintsService } from '../../../../services/Complaints-Service/complaints.service';
import { ToastAlertService } from '../../../../services/toast-alert/toast-alert.service';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { TargetProgressOngoingComponent } from '../target-progress-ongoing/target-progress-ongoing.component';

@Component({
  selector: 'app-target-progress-all',
  standalone: true,
  imports: [CommonModule, FormsModule, TargetProgressOngoingComponent],
  templateUrl: './target-progress-all.component.html',
  styleUrl: './target-progress-all.component.css'
})
export class TargetProgressAllComponent implements OnInit {

  isSelectAll: boolean = true;
  isSelectToDo: boolean = false;

  constructor(
    
  ) { }

  ngOnInit(): void {

  }

  selectAll() {
    this.isSelectAll = true;
    this.isSelectToDo = false;
  }

  selectToDo() {
    this.isSelectAll = false;
    this.isSelectToDo = true;
  }

}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComplaintsService } from '../../../../services/Complaints-Service/complaints.service';
import { ToastAlertService } from '../../../../services/toast-alert/toast-alert.service';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { TargetProgressOngoingComponent } from '../target-progress-ongoing/target-progress-ongoing.component';
import { TargetProgressTodoComponent } from "../target-progress-todo/target-progress-todo.component";
import { TargetProgressCompletedComponent } from "../target-progress-completed/target-progress-completed.component";

@Component({
  selector: 'app-target-progress-all',
  standalone: true,
  imports: [CommonModule, FormsModule, TargetProgressOngoingComponent, TargetProgressTodoComponent, TargetProgressCompletedComponent],
  templateUrl: './target-progress-all.component.html',
  styleUrl: './target-progress-all.component.css'
})
export class TargetProgressAllComponent implements OnInit {

  isSelectAll: boolean = true;
  isSelectToDo: boolean = false;
  isSelectCompleted: boolean = false;

  constructor(
    
  ) { }

  ngOnInit(): void {

  }

  selectAll() {
    this.isSelectAll = true;
    this.isSelectToDo = false;
    this.isSelectCompleted = false;
  }

  selectToDo() {
    this.isSelectAll = false;
    this.isSelectToDo = true;
    this.isSelectCompleted = false;
  }

  selectCompleted() {
    this.isSelectAll = false;
    this.isSelectToDo = false;
    this.isSelectCompleted = true;
  }

}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TargetService } from '../../../services/Target-service/target.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-officer-target-view',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, NgxPaginationModule],
  templateUrl: './officer-target-view.component.html',
  styleUrl: './officer-target-view.component.css'
})
export class OfficerTargetViewComponent {
  OfficerObj: Officer = new Officer();
  hasData: boolean = true;
  responseTitle: string = '--Fill input fields first--';
  targetArr: Target[] = [];

  page: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;

  constructor(
    private router: Router,
    private TargetSrv: TargetService,
    private toastSrv: ToastAlertService,
    private route: ActivatedRoute
  ) { }

  onInit(): void {
    this.onSubmit()
  }

  onSubmit(page: number = this.page, limit: number = this.itemsPerPage) {
    if(this.OfficerObj.jobRole === 'Collection Center Manager'){
      this.OfficerObj.empId = 'CCM'+this.OfficerObj.officerId;
    }else if(this.OfficerObj.jobRole === 'Collection Officer'){
      this.OfficerObj.empId = 'COO'+this.OfficerObj.officerId;
    }else if(this.OfficerObj.jobRole === 'Customer Officer'){
      this.OfficerObj.empId = 'CUO'+this.OfficerObj.officerId;
    }

    this.TargetSrv.getOfficerAvailabeTarget(this.OfficerObj,page, limit ).subscribe(
      (res)=>{
        if(res.status){
          this.responseTitle = res.message;
          this.hasData = true;
          this.targetArr = res.result;
          this.totalItems = res.total;
        }else{
          this.responseTitle = res.message;
          this.hasData = false;
        }
      }
    )
  }

  claculateTodo(num1: number, num2: number) {
    let todo;
    todo = num1 - num2;
    if(todo < 0) {todo = 0;}
    return todo;
  }

  onPageChange(event: number) {
    this.page = event;
    this.onSubmit();
  }

}

class Officer {
  jobRole: string = '';
  officerId: string = '';
  empId: string = '';
  toDate!: string;
  fromDate!: string;
}

class Target {
  varietyNameEnglish!:string
  cropNameEnglish!:string 
  grade!:string 
  target!:number 
  complete!:number 
  date!:string 
  validity!:string
}


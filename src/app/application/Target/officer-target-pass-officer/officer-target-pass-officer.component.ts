import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TargetService } from '../../../services/Target-service/target.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-officer-target-pass-officer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './officer-target-pass-officer.component.html',
  styleUrl: './officer-target-pass-officer.component.css'
})
export class OfficerTargetPassOfficerComponent implements OnInit {
  targetObj: TargetDetalis = new TargetDetalis();
  officerArr: Officers[] = [];
  filteredOfficers: Officers[] = [];

  targetItemId!: number;

  passAmount: number = 0.00;
  amount: number = 0.00;
  searchTerm: string = '';
  selectedOfficerId!: number | null;

  isLoading: boolean = true;


  constructor(
    private router: Router,
    private TargetSrv: TargetService,
    private toastSrv: ToastAlertService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.targetItemId = this.route.snapshot.params['id'];
  }

  fetchTargetDetalis() {
    this.isLoading = true;
    this.TargetSrv.getOfficerTartgetItem(this.targetItemId).subscribe(
      (res) => {

        this.targetObj = res.resultTarget;
        this.passAmount = res.resultTarget.todo;
        this.amount = res.resultTarget.todo;
        this.officerArr = res.resultOfficer;
        this.filteredOfficers = [...this.officerArr];

        this.isLoading = false;
      }
    );
  }

  filterOfficer() {

  }

  selectOfficer(id: number) {

  }

  onSubmit(){

  }

  onCancel(){
    
  }



}

class TargetDetalis {
  id!: number;
  varietyNameEnglish!: string;
  target!: number;
  complete!: number;
  todo!: number;
  empId!: string;
}

class Officers {
  id!: number;
  firstNameEnglish!: string;
  lastNameEnglish!: string;
}


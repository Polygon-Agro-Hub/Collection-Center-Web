import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TargetService } from '../../../../services/Target-service/target.service';
import { ToastAlertService } from '../../../../services/toast-alert/toast-alert.service';

@Component({
  selector: 'app-assign-center-target',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-center-target.component.html',
  styleUrl: './assign-center-target.component.css'
})
export class AssignCenterTargetComponent implements OnInit {
  @Input() centerDetails!: CenterDetails;
  assignCropsArr: AssignCrops[] = [];

  isFormValid: boolean = false;
  countCrops: number = 0;
  searchText: string = '';
  selectDate: string = new Date().toISOString().split('T')[0];
  isNew: boolean = true;


  constructor(
    private router: Router,
    private TargetSrv: TargetService,
    private toastSrv: ToastAlertService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.fetchSavedCenterCrops()
  }

  fetchSavedCenterCrops() {
    this.TargetSrv.getSavedCenterCrops(this.centerDetails.centerId, this.selectDate).subscribe(
      (res) => {
        this.assignCropsArr = res.data
        this.countCrops = res.data.length
        this.isNew = res.isNew
      }
    )
  }

  onSubmit() { }
  onCancel() { }

  onSearch() { }
  offSearch() { }

  saveGrade(grade: string, item: any, price:number) {
    if (grade === 'A') item.editingA = false;
    if (grade === 'B') item.editingB = false;
    if (grade === 'C') item.editingC = false;

    console.log(`Saving grade ${grade} for`, item ,price);

  }

}

class CenterDetails {
  centerId!: number;
  centerName!: string;
  regCode!: string;
}

class AssignCrops {
  cropNameEnglish!: string
  varietyNameEnglish!: string
  targetA: number = 0.00
  targetB: number = 0.00
  targetC: number = 0.00
  editingA: boolean = false;
  editingB: boolean = false;
  editingC: boolean = false;
}


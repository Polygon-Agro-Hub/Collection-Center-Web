import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TargetService } from '../../../../services/Target-service/target.service';
import { ToastAlertService } from '../../../../services/toast-alert/toast-alert.service';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { Location } from '@angular/common';


@Component({
  selector: 'app-assign-center-target',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './assign-center-target.component.html',
  styleUrl: './assign-center-target.component.css'
})
export class AssignCenterTargetComponent implements OnInit {
  @Input() centerDetails!: CenterDetails;
  assignCropsArr: AssignCrops[] = [];
  newTargetObj: NewTarget = new NewTarget();

  isFormValid: boolean = false;
  countCrops: number = 0;
  searchText: string = '';
  selectDate: string = new Date().toISOString().split('T')[0];
  isNew: boolean = true;
  companyCenterId!: number;
  isLoading: boolean = true;
  isDateValid: boolean = true;
  hasData: boolean = false;


  constructor(
    private router: Router,
    private TargetSrv: TargetService,
    private toastSrv: ToastAlertService,
    private route: ActivatedRoute,
    private location: Location

  ) { }

  ngOnInit(): void {
    this.fetchSavedCenterCrops()
  }

  fetchSavedCenterCrops() {
    this.isLoading = true;
    this.validateSelectDate()
    this.TargetSrv.getSavedCenterCrops(this.centerDetails.centerId, this.selectDate, this.searchText).subscribe(
      (res) => {
        this.assignCropsArr = res.result.data
        this.countCrops = res.result.data.length
        this.isNew = res.result.isNew
        this.companyCenterId = res.companyCenterId
        this.isLoading = false;
        this.hasData = res.result.data.length > 0 ? true : false;

      }
    )
  }

  onSubmit() {
    this.newTargetObj.companyCenterId = this.companyCenterId
    this.newTargetObj.date = this.selectDate
    this.newTargetObj.crop = this.assignCropsArr


    this.TargetSrv.addNewCenterTarget(this.newTargetObj).subscribe(
      (res) => {
        if (res.status) {
          this.toastSrv.success(res.message)
          // this.router.navigate(['/target/assign-center-target'])
          this.fetchSavedCenterCrops();
        }
      }
    )

  }


  onCancel() {
    this.toastSrv.warning('Cancel Add New Center Target')
    // this.fetchSavedCenterCrops()
    this.location.back();
  }

  onSearch() {
    this.fetchSavedCenterCrops();
  }
  offSearch() {
    this.searchText = ''
    this.fetchSavedCenterCrops()
  }

  saveGrade(grade: string, item: any, qty: number, editId: number | null) {
    if (grade === 'A') {
      if (item.targetA < item.preValueA) {
        return this.toastSrv.warning('Value must be greater than the current saved value')
      }

    } else if (grade === 'B') {
      if (item.targetB < item.preValueB) {
        return this.toastSrv.warning('Value must be greater than the current saved value')
      }
    } else {
      if (item.targetC < item.preValueC) {
        return this.toastSrv.warning('Value must be greater than the current saved value')
      }
    }


    let data = {
      id: editId,
      qty: qty,
      date: this.selectDate,
      companyCenterId: this.companyCenterId,
      grade: grade,
      varietyId: item.varietyId
    }

    this.TargetSrv.updateTargetQty(data).subscribe(
      (res) => {
        if (res.status) {
          this.toastSrv.success(res.message)
          this.fetchSavedCenterCrops()
          if (grade === 'A') item.editingA = false;
          if (grade === 'B') item.editingB = false;
          if (grade === 'C') item.editingC = false;
        }

      }
    )
  }

  validateSelectDate() {
    const selectedDate = new Date(this.selectDate);
    const today = new Date();

    // Reset time components to compare just dates
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      this.isDateValid = false;
    } else {
      this.isDateValid = true;
    }
  }

  validateForm() {
    this.isFormValid = this.assignCropsArr.some(crop =>
      crop.targetA > 0 || crop.targetB > 0 || crop.targetC > 0
    );
  }

  pressEditIcon(item: AssignCrops, grade: string) {
    if (grade === 'A') item.preValueA = item.targetA;
    if (grade === 'B') item.preValueB = item.targetB;
    if (grade === 'C') item.preValueC = item.targetC;
  }

  checkNegativeValue(item: AssignCrops, grade: string) {
    if (this.isNew && this.isDateValid) {
      if (item.targetA < 0 || item.targetB < 0 || item.targetC < 0) {
        if (grade === 'A') item.targetA = 0;
        if (grade === 'B') item.targetB = 0;
        if (grade === 'C') item.targetC = 0;
        this.toastSrv.error('Negative values are not allowed.')
        return;
      }
    }
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
  idA: number | null = null;
  idB: number | null = null;
  idC: number | null = null;
  preValueA!: number;
  preValueB!: number;
  preValueC!: number;
}

class NewTarget {
  companyCenterId!: number;
  date!: string;
  crop!: AssignCrops[]

}


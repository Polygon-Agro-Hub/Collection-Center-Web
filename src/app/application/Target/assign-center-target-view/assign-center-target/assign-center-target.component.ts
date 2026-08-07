import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TargetService } from '../../../../services/Target-service/target.service';
import { ToastAlertService } from '../../../../services/toast-alert/toast-alert.service';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { Location } from '@angular/common';
import { CustomDatepickerComponent } from "../../../../components/custom-datepicker/custom-datepicker.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assign-center-target',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, CustomDatepickerComponent],
  templateUrl: './assign-center-target.component.html',
  styleUrl: './assign-center-target.component.css'
})
export class AssignCenterTargetComponent implements OnInit {
  @Input() centerDetails!: CenterDetails;
  assignCropsArr: AssignCrops[] = [];
  newTargetObj: NewTarget = new NewTarget();

  selectDatePickerDate: string | Date | null = null;

  isFormValid: boolean = false;
  countCrops: number = 0;
  searchText: string = '';
  selectDate!: string;
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
const today = new Date();
const tomorrow = new Date(today);

tomorrow.setDate(today.getDate() + 1);

this.selectDate = tomorrow.toISOString().split('T')[0];
    this.selectDatePickerDate = this.selectDate;
    this.fetchSavedCenterCrops()
  }

  onDateChange(newDate: string | Date | null) {
    console.log('newDate', newDate)
    this.selectDatePickerDate = newDate;
    this.selectDate = this.selectDatePickerDate
  ? this.selectDatePickerDate.toString().split('T')[0]
  : '';

    console.log('selectDatePickerDate', this.selectDatePickerDate)
    this.fetchSavedCenterCrops();
  }

  fetchSavedCenterCrops() {
    this.isLoading = true;
    this.validateSelectDate()
    this.TargetSrv.getSavedCenterCrops(this.centerDetails.centerId, this.selectDate, this.searchText).subscribe(
      (res) => {
        this.assignCropsArr = res.products.map((p: AssignCrops) => ({
          ...p,
          originalTotal: (p.targetA || 0) + (p.targetB || 0) + (p.targetC || 0)
        }));
        console.log('assignCropsArr', this.assignCropsArr)
        this.countCrops = res.products.length
        this.companyCenterId = res.companyCenterId
        this.isLoading = false;
        this.hasData = res.products.length > 0 ? true : false;
        this.validateForm();
        console.log('hasData', this.hasData)

      }
    )
  }

onSubmit() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to save these assinged targets?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm and save!',
      cancelButtonText: 'No, cancel',
      customClass: {
        popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
        title: 'dark:text-white',

        icon: '',
        // confirmButton: 'hover:bg-red-600 dark:hover:bg-red-700 focus:ring-red-500 dark:focus:ring-red-800',
        // cancelButton: 'hover:bg-blue-600 dark:hover:bg-blue-700 focus:ring-blue-500 dark:focus:ring-blue-800',
        actions: 'gap-2'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newCrops = this.assignCropsArr.filter(crop => crop.isNew);
    const invalidCrop = newCrops.find(crop =>
      crop.targetA < 0 || crop.targetB < 0 || crop.targetC < 0 || this.isQtyExceeded(crop)
    );

    if (invalidCrop) {
      this.toastSrv.warning(`Total target across grades cannot exceed ${this.maxQty(invalidCrop)} ${invalidCrop.unitType}`)
      return;
    }

    this.isLoading = true;
    this.newTargetObj.companyCenterId = this.companyCenterId
    this.newTargetObj.date = this.selectDate
    this.newTargetObj.crop = newCrops
    console.log('newTargetObj', this.newTargetObj)


    this.TargetSrv.addNewCenterTarget(this.newTargetObj).subscribe(
      (res) => {
        if (res.status) {
          this.isLoading = false;
          this.toastSrv.success('New target quantity added successfully.')
          this.fetchSavedCenterCrops();
        }
      }
    )
      }
    });


  }

  onCancel() {
    this.toastSrv.warning('Cancel Add New Center Target')
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

    if (this.isQtyExceeded(item)) {
      return this.toastSrv.warning(`Total target across grades cannot exceed ${this.maxQty(item)} ${item.unitType}`)
    }

    let data = {
      id: editId,
      qty: qty,
      date: this.selectDate,
      companyCenterId: this.companyCenterId,
      grade: grade,
      varietyId: item.varietyId
    }
    console.log('data', data);
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

    this.isDateValid = selectedDate >= today;
  }

  validateForm() {
    this.isFormValid = this.assignCropsArr.some(crop =>
      crop.isNew && (crop.targetA > 0 || crop.targetB > 0 || crop.targetC > 0)
    ) && !this.assignCropsArr.some(crop => crop.isNew && this.isQtyExceeded(crop));
  }

  get hasNewItems(): boolean {
    return this.assignCropsArr.some(crop => crop.isNew);
  }

  isQtyExceeded(item: AssignCrops): boolean {
    if (item.isNew) {
      const total = (item.targetA || 0) + (item.targetB || 0) + (item.targetC || 0);
      return total > item.remaining;
    }

    const addedA = item.editingA ? (item.targetA || 0) - (item.preValueA || 0) : 0;
    const addedB = item.editingB ? (item.targetB || 0) - (item.preValueB || 0) : 0;
    const addedC = item.editingC ? (item.targetC || 0) - (item.preValueC || 0) : 0;

    return (addedA + addedB + addedC) > item.remaining;
  }

  maxQty(item: AssignCrops): number {
    return Math.round((item.remaining * 1.02) * 100) / 100;
  }

  isGradeInvalid(item: AssignCrops, grade: string): boolean {
    const target = grade === 'A' ? item.targetA : grade === 'B' ? item.targetB : item.targetC;
    const preValue = grade === 'A' ? item.preValueA : grade === 'B' ? item.preValueB : item.preValueC;
    const isEditingGrade = grade === 'A' ? item.editingA : grade === 'B' ? item.editingB : item.editingC;

    if (target < 0) return true;

    if (!item.isNew && isEditingGrade && target < preValue) return true;

    return (item.isNew || isEditingGrade) && this.isQtyExceeded(item);
  }

  // selectDate is the default-fetched "must complete by" date; the notice's other
  // two dates are always exactly one day before/after it.
  get systemAppearDate(): string {
    return this.formatDayMonth(this.offsetSelectDate(-1));
  }

  get mustCompleteDate(): string {
    return this.formatDayMonth(this.offsetSelectDate(0));
  }

  get scheduledDeliveryDate(): string {
    return this.formatDayMonth(this.offsetSelectDate(1));
  }

  private offsetSelectDate(offsetDays: number): Date {
    const d = new Date(this.selectDate);
    d.setDate(d.getDate() + offsetDays);
    return d;
  }

  private formatDayMonth(d: Date): string {
    const day = d.getDate();
    const rem10 = day % 10;
    const rem100 = day % 100;
    let suffix = 'th';
    if (rem100 < 11 || rem100 > 13) {
      if (rem10 === 1) suffix = 'st';
      else if (rem10 === 2) suffix = 'nd';
      else if (rem10 === 3) suffix = 'rd';
    }
    const month = d.toLocaleString('en-US', { month: 'long' });
    return `${day}${suffix} ${month}`;
  }

  pressEditIcon(item: AssignCrops, grade: string) {
    if (grade === 'A') item.preValueA = item.targetA;
    if (grade === 'B') item.preValueB = item.targetB;
    if (grade === 'C') item.preValueC = item.targetC;
  }

  checkNegativeValue(item: AssignCrops, grade: string) {
    if (this.isDateValid) {
      if (item.targetA < 0 || item.targetB < 0 || item.targetC < 0) {
        if (grade === 'A') item.targetA = 0;
        if (grade === 'B') item.targetB = 0;
        if (grade === 'C') item.targetC = 0;
        this.toastSrv.error('Negative values are not allowed.')
      }
    }
    this.validateForm();
  }

  restrictDecimal(event: any, item: AssignCrops, grade: string) {
    item.lastEditedGrade = grade;
    let value = event.target.value;

    if (value.includes('.')) {
      const parts = value.split('.');
      if (parts[1].length > 3) {
        value = parts[0] + '.' + parts[1].substring(0, 3);
        event.target.value = value;

        const parsed = parseFloat(value);
        if (grade === 'A') item.targetA = parsed;
        if (grade === 'B') item.targetB = parsed;
        if (grade === 'C') item.targetC = parsed;
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
  isNew: boolean = true;
  qty: number = 0;
  unitType: string = '';
  lastEditedGrade: string | null = null;
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
  remaining!: number;
  originalTotal: number = 0;
}

class NewTarget {
  companyCenterId!: number;
  date!: string;
  crop!: AssignCrops[]

}
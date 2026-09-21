import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TargetService } from '../../../services/Target-service/target.service';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assign-officer-target',
  standalone: true,
  imports: [FormsModule, CommonModule, LoadingSpinnerComponent],
  templateUrl: './assign-officer-target.component.html',
  styleUrl: './assign-officer-target.component.css',
  providers: [DatePipe]

})
export class AssignOfficerTargetComponent implements OnInit {
  targetVerity: TargetVerity = new TargetVerity();
  officerArr!: Officer[];
  AssignTargetObj: AssignTarget = new AssignTarget();

  totTargetA: number = 0;
  totTargetB: number = 0;
  totTargetC: number = 0;

  varietyId!: number;
  companyCenterId!: number;

  isLoading: boolean = true;


  constructor(
    private router: Router,
    private targetSrv: TargetService,
    private route: ActivatedRoute,
    private toastSrv: ToastAlertService,
    private cdRef: ChangeDetectorRef,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.varietyId = this.route.snapshot.params['varietyId'];
    this.companyCenterId = this.route.snapshot.params['companyCenterId'];
    this.fetchTargetVerity();
  }

  fetchTargetVerity() {
    this.isLoading = true;
    this.targetSrv.getTargetVerity(this.varietyId, this.companyCenterId).subscribe(
      (res) => {

        this.targetVerity = res.crop;

        if (this.targetVerity && this.targetVerity.toDate) {
          this.targetVerity.formattedToDate = this.datePipe.transform(this.targetVerity.toDate, 'yyyy/MM/dd')!;
        }

        this.officerArr = res.officer.map((officer: Officer) => ({
          ...officer,
          targetA: officer.targetA ?? 0,
          targetB: officer.targetB ?? 0,
          targetC: officer.targetC ?? 0,
        }));

        this.AssignTargetObj.dailyTargetsIds.idA = res.crop.idA;
        this.AssignTargetObj.dailyTargetsIds.idB = res.crop.idB;
        this.AssignTargetObj.dailyTargetsIds.idC = res.crop.idC;

        this.isLoading = false;

      }
    );
  }


  get isFormValid(): boolean {
    return (
      +this.totTargetA === +this.targetVerity.qtyA &&
      +this.totTargetB === +this.targetVerity.qtyB &&
      +this.totTargetC === +this.targetVerity.qtyC
    );
  }


  onSubmit() {
    this.isLoading = true;
    this.AssignTargetObj.varietyId = this.targetVerity.varietyId;
    this.AssignTargetObj.OfficerData = this.officerArr;
    this.AssignTargetObj.id = this.targetVerity.id;
    if (+this.totTargetA !== +this.targetVerity.qtyA || +this.totTargetB !== +this.targetVerity.qtyB || +this.totTargetC !== +this.targetVerity.qtyC) {
      this.toastSrv.warning('Please assign the correct target!');
      this.isLoading = false;
      return;
    }

    this.targetSrv.assignOfficerTartget(this.AssignTargetObj).subscribe(
      (res) => {
        if (res.status) {
          this.isLoading = false;
          this.toastSrv.success('Successfully assigned the target!');
          this.router.navigate(['/target'], {
            state: { selectAssign: true }
          });
        } else {
          this.isLoading = false;
          this.toastSrv.error('Failed to assign the target!');
        }
      }
    )
  }

  onCancel() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to clear the operation?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, Stay On Page',
      customClass: {
        popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
        title: 'dark:text-white',

        icon: '',
        confirmButton: 'hover:bg-red-600 dark:hover:bg-red-700 focus:ring-red-500 dark:focus:ring-red-800',
        cancelButton: 'hover:bg-blue-600 dark:hover:bg-blue-700 focus:ring-blue-500 dark:focus:ring-blue-800',
        actions: 'gap-2'
      }
    }).then((result) => {
      if (result.isConfirmed) {

        this.toastSrv.warning('Assign Officer Target Operation Canceled.')
        this.router.navigate(['/target'], {
          state: { selectAssign: true }
        });
      }
    });
  }

  updateTotals(index: number, grade: 'A' | 'B' | 'C') {
    this.totTargetA = Number(
        this.officerArr
            .reduce((sum, officer) => sum + (officer.targetA || 0), 0)
            .toFixed(3)
    );
        
    this.totTargetB = Number(
        this.officerArr
          .reduce((sum, officer) => sum + Number(officer.targetB || 0), 0)
          .toFixed(3)
    );

      
    this.totTargetC = Number(
        this.officerArr
          .reduce((sum, officer) => sum + Number(officer.targetC || 0), 0)
          .toFixed(3)
    );

  
    let remainingA = this.targetVerity.qtyA - (this.totTargetA - (this.officerArr[index].targetA || 0));
    let remainingB = this.targetVerity.qtyB - (this.totTargetB - (this.officerArr[index].targetB || 0));
    let remainingC = this.targetVerity.qtyC - (this.totTargetC - (this.officerArr[index].targetC || 0));
  
    if (grade === 'A' && this.totTargetA > this.targetVerity.qtyA) {
      this.toastSrv.warning(`Total Grade A target cannot exceed ${this.targetVerity.qtyA}!`);
      setTimeout(() => {
        this.officerArr[index].targetA = Math.max(0, Math.round(remainingA * 1000) / 1000);
        this.cdRef.detectChanges();
      }, 0);
    }

    if (grade === 'B' && this.totTargetB > this.targetVerity.qtyB) {
      this.toastSrv.warning(`Total Grade B target cannot exceed ${this.targetVerity.qtyB}!`);
      setTimeout(() => {
        this.officerArr[index].targetB = Math.max(0, Math.round(remainingB * 1000) / 1000);
        this.cdRef.detectChanges();
      }, 0);
    }

    if (grade === 'C' && this.totTargetC > this.targetVerity.qtyC) {
      this.toastSrv.warning(`Total Grade C target cannot exceed ${this.targetVerity.qtyC}!`);
      setTimeout(() => {
        this.officerArr[index].targetC = Math.max(0, Math.round(remainingC * 1000) / 1000);
        this.cdRef.detectChanges();
      }, 0);
    }
  
    setTimeout(() => {
      this.totTargetA = Number(this.officerArr.reduce((sum, officer) => sum + (officer.targetA || 0), 0).toFixed(3));
      this.totTargetB = Number(this.officerArr.reduce((sum, officer) => sum + (officer.targetB || 0), 0).toFixed(3));
      this.totTargetC = Number(this.officerArr.reduce((sum, officer) => sum + (officer.targetC || 0), 0).toFixed(3));
    }, 10);
  }

  restrictDecimals(event: Event, index: number, grade: 'A' | 'B' | 'C') {
  const input = event.target as HTMLInputElement;
  let value = input.value;

  // Allow empty, digits, and up to 3 decimal places only
  const regex = /^\d*\.?\d{0,3}$/;

  if (!regex.test(value)) {
    // strip extra decimals beyond 3
    const match = value.match(/^\d*\.?\d{0,3}/);
    value = match ? match[0] : '';
    input.value = value;

    // keep ngModel in sync since we're mutating the DOM value directly
    const numericValue = value === '' ? 0 : parseFloat(value);
    if (grade === 'A') this.officerArr[index].targetA = numericValue;
    if (grade === 'B') this.officerArr[index].targetB = numericValue;
    if (grade === 'C') this.officerArr[index].targetC = numericValue;

    this.updateTotals(index, grade);
  }
}
}

class TargetVerity {
  idA: number | null = null;
  idB: number | null = null;
  idC: number | null = null;
  varietyId!: number;
  cropNameEnglish!: string;
  varietyNameEnglish!: string;
  qtyA!: number;
  qtyB!: number;
  qtyC!: number;
  companyCenterId!: number

  id!: number;
  toDate!: Date;
  formattedToDate!: string;
}

class Officer {
  id!: number;
  empId!: string;
  jobRole!: string;
  firstNameEnglish!: string;
  lastNameEnglish!: string;
  targetA: number = 0;
  targetB: number = 0;
  targetC: number = 0;
  idA:number | null = null;
  idB:number | null = null;
  idC:number | null = null;
}

class AssignTarget {
  id!: number;
  varietyId!: number;
  OfficerData!: Officer[];
  dailyTargetsIds: DailyTargetsIds = new DailyTargetsIds();
}

class InputData {
  targetA: number = 0;
  targetB: number = 0;
  targetC: number = 0;
}

class DailyTargetsIds {
  idA: number | null = null;
  idB: number | null = null;
  idC: number | null = null;
}
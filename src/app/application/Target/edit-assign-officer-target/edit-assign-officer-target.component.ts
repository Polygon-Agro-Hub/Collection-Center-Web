import { ChangeDetectorRef, Component } from '@angular/core';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TargetService } from '../../../services/Target-service/target.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-assign-officer-target',
  standalone: true,
  imports: [FormsModule, CommonModule, LoadingSpinnerComponent],
  templateUrl: './edit-assign-officer-target.component.html',
  styleUrl: './edit-assign-officer-target.component.css',
  providers: [DatePipe]

})
export class EditAssignOfficerTargetComponent {
  targetVerity: TargetVerity = new TargetVerity();
  officerArr!: Officer[];
  AssignTargetObj: AssignTarget = new AssignTarget();

  totTargetA: number = 0;
  totTargetB: number = 0;
  totTargetC: number = 0;

  targetId!: number;
  varietyId!: number;
  companyCenterId!: number;


  isLoading: boolean = false;


  constructor(
    private router: Router,
    private targetSrv: TargetService,
    private route: ActivatedRoute,
    private toastSrv: ToastAlertService,
    private cdRef: ChangeDetectorRef,
    private location: Location,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.varietyId = this.route.snapshot.params['varietyId'];
    this.companyCenterId = this.route.snapshot.params['companyCenterId'];
    this.fetchTargetVerity();
  }

  fetchTargetVerity() {
    this.isLoading = true;
    this.targetSrv.getExistTargetVerity(this.varietyId, this.companyCenterId).subscribe(
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
        this.checkTotals();
        this.AssignTargetObj.targetIds = res.targetId

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
    this.targetSrv.editAssignedOfficerTartget(this.AssignTargetObj).subscribe(
      (res) => {
        if (res.status) {
          this.isLoading = false;
          this.toastSrv.success('Successfully assigned the target!');
          this.router.navigate(['/target'])
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
      text: 'Do you really want to cancel the operation?',
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

        this.toastSrv.warning('Edit Assign Officer Target Operation Canceled.')
        this.location.back();
      }
    });
  }

  updateTotals(index: number, grade: 'A' | 'B' | 'C') {
    this.totTargetA = this.officerArr.reduce((sum, officer) => sum + (officer.targetA || 0), 0);
    this.totTargetB = this.officerArr.reduce((sum, officer) => sum + (officer.targetB || 0), 0);
    this.totTargetC = this.officerArr.reduce((sum, officer) => sum + (officer.targetC || 0), 0);

    let remainingA = this.targetVerity.qtyA - (this.totTargetA - this.officerArr[index].targetA);
    let remainingB = this.targetVerity.qtyB - (this.totTargetB - this.officerArr[index].targetB);
    let remainingC = this.targetVerity.qtyC - (this.totTargetC - this.officerArr[index].targetC);

    if (grade === 'A' && this.totTargetA > this.targetVerity.qtyA) {
      this.toastSrv.warning(`Total Grade A target cannot exceed ${this.targetVerity.qtyA}!`);
      this.officerArr[index].targetA = Math.max(0, remainingA);
    }

    if (grade === 'B' && this.totTargetB > this.targetVerity.qtyB) {
      this.toastSrv.warning(`Total Grade B target cannot exceed ${this.targetVerity.qtyB}!`);
      this.officerArr[index].targetB = Math.max(0, remainingB);
    }

    if (grade === 'C' && this.totTargetC > this.targetVerity.qtyC) {
      this.toastSrv.warning(`Total Grade C target cannot exceed ${this.targetVerity.qtyC}!`);
      this.officerArr[index].targetC = Math.max(0, remainingC);
    }

    this.totTargetA = this.officerArr.reduce((sum, officer) => sum + (officer.targetA || 0), 0);
    this.totTargetB = this.officerArr.reduce((sum, officer) => sum + (officer.targetB || 0), 0);
    this.totTargetC = this.officerArr.reduce((sum, officer) => sum + (officer.targetC || 0), 0);

    this.cdRef.detectChanges();
  }

  checkTotals() {
    this.totTargetA = this.officerArr.reduce((sum, officer) => sum + (officer.targetA || 0), 0);
    this.totTargetB = this.officerArr.reduce((sum, officer) => sum + (officer.targetB || 0), 0);
    this.totTargetC = this.officerArr.reduce((sum, officer) => sum + (officer.targetC || 0), 0);

    if (
      +this.totTargetA === +this.targetVerity.qtyA &&
      +this.totTargetB === +this.targetVerity.qtyB &&
      +this.totTargetC === +this.targetVerity.qtyC
    ) {

    } else {

    }
  }




}

class TargetVerity {
  id!: number;
  varietyId!: number;
  cropNameEnglish!: string;
  varietyNameEnglish!: string;
  qtyA!: number;
  qtyB!: number;
  qtyC!: number;
  toDate!: Date;
  toTime!: Date;
  formattedToDate!: string
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
  prevousTargetA: number = 0;
  prevousTargetB: number = 0;
  prevousTargetC: number = 0;
  targetAId: number | null = null;
  targetBId: number | null = null;
  targetCId: number | null = null;
  dailyTargetIdA: number | null = null;
  dailyTargetIdB: number | null = null;
  dailyTargetIdC: number | null = null;
}

class AssignTarget {
  id!: number;
  varietyId!: number;
  OfficerData!: Officer[];
  targetIds: TargetIds = new TargetIds();
}

class InputData {
  targetA: number = 0;
  targetB: number = 0;
  targetC: number = 0;
}

class TargetIds {
  idA: number | null = null;
  idB: number | null = null;
  idC: number | null = null;
}
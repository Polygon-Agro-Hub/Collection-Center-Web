import { ChangeDetectorRef, Component } from '@angular/core';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TargetService } from '../../../services/Target-service/target.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import Swal from 'sweetalert2';

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
  assignedTargets: { targetA: number; targetB: number; targetC: number }[] = [];
  AssignTargetObj: AssignTarget = new AssignTarget();

  totTargetA: number = 0;
  totTargetB: number = 0;
  totTargetC: number = 0;

  targetId!: number;
  varietyId!: number;
  companyCenterId!: number;
  passingDate!: string;


  isLoading: boolean = false;


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
    this.passingDate = this.route.snapshot.params['passingDate'];
    this.fetchTargetVerity();
  }

  fetchTargetVerity() {
    this.isLoading = true;
    this.targetSrv.getExistTargetVerity(this.varietyId, this.companyCenterId, this.passingDate).subscribe(
      (res) => {

        this.targetVerity = res.crop;
        if (this.targetVerity && this.targetVerity.toDate) {
          this.targetVerity.formattedToDate = this.datePipe.transform(this.targetVerity.toDate, 'yyyy/MM/dd')!;
        }

        this.officerArr = res.officer.map((officer: Officer) => ({
          ...officer,
          targetA: Number(officer.targetA ?? 0),
          targetB: Number(officer.targetB ?? 0),
          targetC: Number(officer.targetC ?? 0),
        }));
        this.assignedTargets = this.officerArr.map(({ targetA, targetB, targetC }) => ({
          targetA, targetB, targetC
        }));
        this.checkTotals();
        this.AssignTargetObj.targetIds = res.targetId

        this.isLoading = false;

      }
    );
  }


  get isFormValid(): boolean {
    return (
      this.hasValidAssignedTargets() &&
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
    if (!this.hasValidAssignedTargets() || +this.totTargetA !== +this.targetVerity.qtyA || +this.totTargetB !== +this.targetVerity.qtyB || +this.totTargetC !== +this.targetVerity.qtyC) {
      this.toastSrv.warning('Please assign the correct target!');
      this.isLoading = false;
      return;
    }
    this.targetSrv.editAssignedOfficerTartget(this.AssignTargetObj).subscribe(
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

        this.toastSrv.warning('Assign Officer Target edit was canceled.')
        this.router.navigate(['/target'], {
          state: { selectAssign: true }
        });
      }
    });
  }

  private hasValidAssignedTargets(): boolean {
    return !!this.officerArr && this.officerArr.every((officer, index) => {
      const assigned = this.assignedTargets[index];
      return !!assigned && (['targetA', 'targetB', 'targetC'] as const).every(key =>
        officer[key] !== null && Number.isFinite(Number(officer[key])) &&
        Number(officer[key]) >= assigned[key]
      );
    });
  }

  updateTotals(index: number, grade: 'A' | 'B' | 'C') {
    const key = `target${grade}` as 'targetA' | 'targetB' | 'targetC';
    const minimum = this.assignedTargets[index][key];
    const entered = this.officerArr[index][key];
    let value = Number(entered);

    if (entered === null || !Number.isFinite(value) || value < minimum) {
      this.toastSrv.warning(`Grade ${grade} target cannot be lower than the already assigned target of ${minimum}!`);
      value = minimum;
    }

    const otherTotal = this.officerArr.reduce((sum, officer, officerIndex) =>
      sum + (officerIndex === index ? 0 : Number(officer[key] || 0)), 0);
    const maximum = Math.max(minimum, Math.round((Number(this.targetVerity[`qty${grade}`]) - otherTotal) * 1000) / 1000);

    if (value > maximum) {
      this.toastSrv.warning(`Total Grade ${grade} target cannot exceed ${this.targetVerity[`qty${grade}`]}!`);
      value = maximum;
    }

    this.checkTotals();
    this.cdRef.detectChanges();

    // Let Angular observe the entered value before restoring the allowed value,
    // so the visible input resets even when it returns to its previous value.
    setTimeout(() => {
      this.officerArr[index][key] = value;
      this.checkTotals();
      this.cdRef.detectChanges();
    }, 0);
  }

  checkTotals() {
      this.totTargetA = Number(this.officerArr.reduce((sum, officer) => sum + Number(officer.targetA || 0), 0).toFixed(3));
      this.totTargetB = Number(this.officerArr.reduce((sum, officer) => sum + Number(officer.targetB || 0), 0).toFixed(3));
      this.totTargetC = Number(this.officerArr.reduce((sum, officer) => sum + Number(officer.targetC || 0), 0).toFixed(3));

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

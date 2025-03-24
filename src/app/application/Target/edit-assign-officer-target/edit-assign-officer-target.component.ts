import { ChangeDetectorRef, Component } from '@angular/core';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TargetService } from '../../../services/Target-service/target.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';

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

  isLoading: boolean = true;


  constructor(
    private router: Router,
    private targetSrv: TargetService,
    private route: ActivatedRoute,
    private toastSrv: ToastAlertService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.targetId = this.route.snapshot.params['id'];
    this.fetchTargetVerity();
  }

  fetchTargetVerity() {
    this.isLoading = true;
    this.targetSrv.getExistTargetVerity(this.targetId).subscribe(
      (res) => {

        this.targetVerity = res.crop;

        this.officerArr = res.officer.map((officer: Officer) => ({
          ...officer,
          targetA: officer.targetA ?? 0,
          targetB: officer.targetB ?? 0,
          targetC: officer.targetC ?? 0,
        }));
        this.checkTotals();

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
          this.router.navigate(['/target/view-target'])
        } else {
          this.isLoading = false;
          this.toastSrv.error('Failed to assign the target!');
        }
      }
    )
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
      console.log('All targets are fully assigned.');
    } else {
      console.log('Targets are not fully assigned.');
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
  prevousTargetA:number = 0;
  prevousTargetB:number = 0;
  prevousTargetC:number = 0;
  targetAId: number | null = null;
  targetBId: number | null = null;
  targetCId: number | null = null;
}

class AssignTarget {
  id!: number;
  varietyId!: number;
  OfficerData!: Officer[];
}

class InputData {
  targetA: number = 0;
  targetB: number = 0;
  targetC: number = 0;
}
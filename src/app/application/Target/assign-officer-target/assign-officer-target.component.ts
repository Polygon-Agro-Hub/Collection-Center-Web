import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TargetService } from '../../../services/Target-service/target.service';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';

@Component({
  selector: 'app-assign-officer-target',
  standalone: true,
  imports: [FormsModule, CommonModule],
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

  targetId!: number;

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
    this.targetSrv.getTargetVerity(this.targetId).subscribe(
      (res) => {
        console.log(res);
        this.targetVerity = res.crop;

        this.officerArr = res.officer.map((officer: Officer) => ({
          ...officer,
          targetA: officer.targetA ?? 0,
          targetB: officer.targetB ?? 0,
          targetC: officer.targetC ?? 0,
        }));
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
    this.AssignTargetObj.varietyId = this.targetVerity.varietyId;
    this.AssignTargetObj.OfficerData = this.officerArr;
    this.AssignTargetObj.id = this.targetVerity.id;
    if(+this.totTargetA !== +this.targetVerity.qtyA || +this.totTargetB !== +this.targetVerity.qtyB || +this.totTargetC !== +this.targetVerity.qtyC){
      this.toastSrv.warning('Please assign the correct target!');
      return;
    }
    this.targetSrv.assignOfficerTartget(this.AssignTargetObj).subscribe(
      (res)=>{
        if(res.status){
          this.toastSrv.success('Successfully assigned the target!');
        }else{
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
}

class AssignTarget {
  id!: number;
  varietyId!: number;
  OfficerData!: Officer[];
}

class InputData{
  targetA: number = 0;
  targetB: number = 0;
  targetC: number = 0;
}
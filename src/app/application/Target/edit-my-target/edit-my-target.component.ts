import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TargetService } from '../../../services/Target-service/target.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';

@Component({
  selector: 'app-edit-my-target',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-my-target.component.html',
  styleUrl: './edit-my-target.component.css',
  providers: [DatePipe]
})
export class EditMyTargetComponent implements OnInit {
  targetItemId!: number;
  targetObj: TargetDetalis = new TargetDetalis();
  officerArr: Officers[] = [];
  filteredOfficers: Officers[] = [];

  passAmount: number = 0.00;
  amount: number = 0.00;

  searchTerm: string = '';
  selectedOfficerId!: number | null;

  constructor(
    private router: Router,
    private TargetSrv: TargetService,
    private toastSrv: ToastAlertService
  ) { }

  ngOnInit(): void {
    this.targetItemId = 4;
    this.fetchTargetDetalis();
  }

  fetchTargetDetalis() {
    this.TargetSrv.getOfficerTartgetItem(this.targetItemId).subscribe(
      (res) => {
        console.log(res);
        this.targetObj = res.resultTarget;
        this.passAmount = res.resultTarget.todo;
        this.amount = res.resultTarget.todo;
        this.officerArr = res.resultOfficer;
        this.filteredOfficers = [...this.officerArr];
      }
    );
  }

  filterOfficer() {
    if (!this.officerArr) return;
    const search = this.searchTerm.toLowerCase();
    this.filteredOfficers = this.officerArr.filter(officer =>
      officer.firstNameEnglish.toLowerCase().includes(search) ||
      officer.lastNameEnglish.toLowerCase().includes(search)
    );
  }

  selectOfficer(id: number) {
    const selectedOfficer = this.officerArr.find(officer => officer.id === id);
    if (selectedOfficer) {
      this.searchTerm = `${selectedOfficer.firstNameEnglish} ${selectedOfficer.lastNameEnglish}`;
      this.selectedOfficerId = id;
      this.filteredOfficers = [];
    }
  }

  onSubmit() {
    console.log(this.selectedOfficerId, this.passAmount);
    if (!this.selectedOfficerId) {
      this.toastSrv.warning('Pleace fill all feild!')
      return;
    }

    if (this.passAmount > this.amount) {
      this.toastSrv.warning(`The maximum amount you can pass <b>${this.amount}</b>Kg`)
      return;
    }

    this.TargetSrv.passToTargetToOfficer(this.selectedOfficerId, this.targetItemId, this.passAmount).subscribe(
      (res) => {
        if (res.status) {
          this.toastSrv.success(res.message);
          this.router.navigate(['/targets'])
        } else {
          this.toastSrv.error(res.message);
        }
      }
    )
  }
}

class TargetDetalis {
  id!: number;
  varietyNameEnglish!: string;
  target!: number;
  complete!: number;
  todo!: number;
  toDate!: Date;
  toTime!: Date;
  empId!: string;
}

class Officers {
  id!: number;
  firstNameEnglish!: string;
  lastNameEnglish!: string;
}

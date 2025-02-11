import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { TargetService } from '../../../services/Target-service/target.service';

@Component({
  selector: 'app-edit-officer-target',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-officer-target.component.html',
  styleUrl: './edit-officer-target.component.css'
})
export class EditOfficerTargetComponent {
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
    private ManageOficerSrv: ManageOfficersService,
    private toastSrv: ToastAlertService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.targetItemId = this.route.snapshot.params['id'];
    this.fetchTargetDetalis();
  }

  fetchTargetDetalis() {
    this.ManageOficerSrv.getTargetDetails(this.targetItemId).subscribe(
      (res) => {
       
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
    
    if (!this.selectedOfficerId) {
      this.toastSrv.warning('Pleace fill all feild!')
      return;
    }

    if (this.passAmount > this.amount) {
      this.toastSrv.warning(`The maximum amount you can pass <b>${this.amount}</b>Kg`)
      return;
    }

    this.ManageOficerSrv.editOfficerTarget(this.selectedOfficerId, this.targetItemId, this.passAmount).subscribe(
      (res) => {
        if (res.status) {
          this.toastSrv.success(res.message);
          this.router.navigate([`/manage-officers/view-officer-target/${this.targetItemId}`])
        } else {
          this.toastSrv.error(res.message);
        }
      }
    )
  }

  onCancel(){
    this.searchTerm = '';
    this.fetchTargetDetalis();
    this.toastSrv.warning("Cancel this process")
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

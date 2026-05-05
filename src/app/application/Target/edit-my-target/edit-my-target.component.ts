import { CommonModule, DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TargetService } from '../../../services/Target-service/target.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { SerchableDropdownComponent } from '../../../components/serchable-dropdown/serchable-dropdown.component';

@Component({
  selector: 'app-edit-my-target',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, SerchableDropdownComponent],
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
  selectedOfficerId!: number | string| null;
  isOpen: boolean = false;
  filterTerm: string = '';



  isLoading: boolean = true;

  constructor(
    private router: Router,
    private TargetSrv: TargetService,
    private toastSrv: ToastAlertService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.targetItemId = this.route.snapshot.params['id'];
    this.fetchTargetDetalis();
  }

  fetchTargetDetalis() {
    this.isLoading = true;
    this.TargetSrv.getOfficerTartgetItem(this.targetItemId).subscribe(
      (res) => {

        this.targetObj = res.resultTarget;
        this.passAmount = res.resultTarget.todo;
        this.amount = res.resultTarget.todo;
        this.officerArr = res.resultOfficer;
        // this.filteredOfficers = [...this.officerArr];

        this.isLoading = false;
      }
    );
  }

  get officerDropdownItems() {
    return this.officerArr.map(officer => ({
      value: officer.id.toString(),
      label: officer.firstNameEnglish + ' ' + officer.lastNameEnglish + ' - ' + officer.empId,
      disabled: false
    }));
  }

  onOfficerSelectionChange(selectedValue: string) {
    this.selectedOfficerId = selectedValue || '';
    // Add any additional logic you need when category changes
    console.log('Category selected:', selectedValue);

    console.log('officer', this.selectedOfficerId)
  }

//   filterOfficer() {
//   if (!this.officerArr) return;
//   const search = this.filterTerm.toLowerCase();
//   this.filteredOfficers = this.officerArr.filter(officer =>
//     officer.firstNameEnglish.toLowerCase().includes(search) ||
//     officer.lastNameEnglish.toLowerCase().includes(search)
//   );
// }

//   selectOfficer(id: number) {
//   const selectedOfficer = this.officerArr.find(officer => officer.id === id);
//   if (selectedOfficer) {
//     this.searchTerm = `${selectedOfficer.firstNameEnglish} ${selectedOfficer.lastNameEnglish}`;
//     this.selectedOfficerId = id;
//     this.isOpen = false;
//     this.filterTerm = '';
//     this.filteredOfficers = [...this.officerArr];
//   }
// }

  onSubmit() {
    this.isLoading = true;

    if (!this.selectedOfficerId) {
      this.isLoading = false;
      this.toastSrv.warning('Please fill all fields!')
      return;
    }

    if (this.passAmount > this.amount) {
      this.isLoading = false;
      this.toastSrv.warning(`The maximum amount you can pass <b>${this.amount}</b>Kg`)
      return;
    }

    this.selectedOfficerId = Number(this.selectedOfficerId);

    this.TargetSrv.passToTargetToOfficer(this.selectedOfficerId, this.targetItemId, this.passAmount).subscribe(
      (res) => {
        if (res.status) {
          this.toastSrv.success(res.message);
          this.isLoading = false;
          this.location.back();
        } else {
          this.isLoading = false;
          this.toastSrv.error(res.message);
        }
      }
    )
  }

  onCancel() {
    this.searchTerm = '';
    this.fetchTargetDetalis();
    this.toastSrv.warning("Canceled this process");
  }

  toggleDropdown() {
  this.isOpen = !this.isOpen;
  if (this.isOpen) {
    this.filterTerm = '';
    this.filteredOfficers = [...this.officerArr];
  }
}

onBlur() {
  // Small delay so mousedown on option fires before blur closes the dropdown
  setTimeout(() => {
    this.isOpen = false;
  }, 150);
}

back() {
    this.location.back();
  }

}

class TargetDetalis {
  id!: number;
  varietyNameEnglish!: string;
  target!: number;
  complete!: number;
  todo!: number;
  empId!: string;
}

class Officers {
  id!: number;
  empId!: string;
  firstNameEnglish!: string;
  lastNameEnglish!: string;
}

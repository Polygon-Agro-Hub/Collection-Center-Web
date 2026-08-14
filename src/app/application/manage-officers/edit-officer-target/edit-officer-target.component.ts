import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ManageOfficersService } from '../../../services/manage-officers-service/manage-officers.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { TargetService } from '../../../services/Target-service/target.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { SerchableDropdownComponent } from '../../../components/serchable-dropdown/serchable-dropdown.component';

@Component({
  selector: 'app-edit-officer-target',
  standalone: true,
  imports: [FormsModule, CommonModule, LoadingSpinnerComponent, SerchableDropdownComponent],
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
  selectedOfficerId!: number | string | null;
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private ManageOficerSrv: ManageOfficersService,
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
    this.ManageOficerSrv.getTargetDetails(this.targetItemId).subscribe(
      (res) => {

        this.targetObj = res.resultTarget;
        this.passAmount = res.resultTarget.todo;
        this.amount = res.resultTarget.todo;
        this.officerArr = res.resultOfficer;
        this.filteredOfficers = [...this.officerArr];
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

  // 5. Add selection change handler
  onOfficerSelectionChange(selectedValue: string) {
    this.selectedOfficerId = selectedValue || '';
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
    this.isLoading = true;

    if (this.passAmount < 0) {
      this.isLoading = false;
      this.toastSrv.warning(`The amount cannot be negative!`)
      return;
    }

    if (this.passAmount > this.amount) {
      this.isLoading = false;
      this.toastSrv.warning(`The maximum amount you can pass <b>${this.amount}</b>Kg`)
      return;
    }

    this.ManageOficerSrv.editOfficerTarget(this.selectedOfficerId, this.targetItemId, this.passAmount).subscribe(
      (res) => {
        if (res.status) {
          this.isLoading = false;
          this.toastSrv.success(res.message);
          // this.router.navigate([`/manage-officers/view-officer-target/${this.targetItemId}`])
          this.location.back();
        } else {
          this.isLoading = false;
          this.toastSrv.error(res.message);
        }
      }
    )
  }

  onAmountInput(event: any) {
    let value = event.target.value;
    
    // Block negative values
    if (value.startsWith('-')) {
        event.target.value = value.substring(1);
        this.passAmount = parseFloat(event.target.value) || 0;
        return;
    }
    
    // Block more than 3 decimal places
    if (value.includes('.')) {
        const parts = value.split('.');
        if (parts[1].length > 3) {
            event.target.value = parts[0] + '.' + parts[1].substring(0, 3);
            this.passAmount = parseFloat(event.target.value);
        }
    }
}

  onCancel() {
    this.searchTerm = '';
    this.fetchTargetDetalis();
    this.toastSrv.warning("Target passing canceled.")
    this.location.back();
  }

  preventZeroAndNegative(event: KeyboardEvent) {
    const inputChar = event.key;

    // Block minus sign entirely
    if (inputChar === '-') {
      event.preventDefault();
    }
  }

  validatePassAmount() {
    const input = document.getElementById('passAmount') as HTMLInputElement;
    const raw = input?.value ?? '';

    // Block negative
    if (this.passAmount < 0) {
      this.passAmount = 0.1;
      return;
    }

    // If it looks like "0", "00", "0.0", "0.00" etc. (all zeros, no non-zero digit)
    const allZeros = /^0*\.?0*$/.test(raw) && raw !== '' && !raw.includes('e');
    if (allZeros) {
      this.passAmount = 0.1;
    }
  }

  onBlurPassAmount() {
    const input = document.getElementById('passAmount') as HTMLInputElement;
    const raw = input?.value ?? '';

    // On blur: if last digit makes it 0.00...0, force last digit to 1
    // e.g. "0.000" → "0.001", "0.00" → "0.01", "0" → "0.1"
    if (/^0\.0*$/.test(raw)) {
      // Replace trailing zero with 1 → e.g. "0.00" → "0.01"
      const fixed = raw.replace(/0$/, '1');
      this.passAmount = parseFloat(fixed);
      return;
    }

    // Catch any remaining <= 0 edge cases
    if (!this.passAmount || this.passAmount <= 0) {
      this.passAmount = 0.1;
    }
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
  empId!: string;
}


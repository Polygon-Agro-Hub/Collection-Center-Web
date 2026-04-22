import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TargetService } from '../../../services/Target-service/target.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import Swal from 'sweetalert2';
import { SerchableDropdownComponent } from '../../../components/serchable-dropdown/serchable-dropdown.component';

@Component({
  selector: 'app-officer-target-pass-officer',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, SerchableDropdownComponent],
  templateUrl: './officer-target-pass-officer.component.html',
  styleUrl: './officer-target-pass-officer.component.css'
})
export class OfficerTargetPassOfficerComponent implements OnInit {
  targetObj: TargetDetalis = new TargetDetalis();
  officerArr: Officers[] = [];
  filteredOfficers: Officers[] = [];

  targetItemId!: number;
  toDate!: string;
  fromDate!: string;

  passAmount: number = 0.00;
  amount: number = 0.00;
  searchTerm: string = '';
  selectedOfficerId!: number | string | null;

  officer1: string = '';

  isLoading: boolean = true;

  officerId!: string;


  constructor(
    private router: Router,
    private TargetSrv: TargetService,
    private toastSrv: ToastAlertService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.targetItemId = this.route.snapshot.params['id'];
    this.toDate = this.route.snapshot.params['toDate'];
    this.fromDate = this.route.snapshot.params['fromDate'];

    this.route.queryParams.subscribe(params => {
      this.officerId = params['officerId'];

      console.log('officerId', this.officerId)
    });

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
    // Add any additional logic you need when category changes
    console.log('Category selected:', selectedValue);

    console.log('officer', this.selectedOfficerId)
  }

  // onOfficerSelectionChange(selectedValue: string) {
  //   this.selectedOfficerId = selectedValue ? Number(selectedValue) : null;

  //   console.log('Officer selected:', this.selectedOfficerId);
  //   console.log('officer', this.officer1);
  // }

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
    // this.isLoading = true;

    console.log('passAmount', this.passAmount)

    if (!this.selectedOfficerId) {
      this.isLoading = false;
      this.toastSrv.warning('Please fill all fields!')
      return;
    }

    if (!this.passAmount || this.passAmount <= 0) {
      this.isLoading = false;
      this.toastSrv.warning('Amount must be greater than 0.');
      return;
    }

    this.selectedOfficerId = Number(this.selectedOfficerId);

    if (this.passAmount > this.amount) {
      this.isLoading = false;
      this.toastSrv.warning(`The maximum amount you can pass <b>${this.amount}</b>Kg`)
      return;
    }

    this.TargetSrv.passToTargetToOfficer(this.selectedOfficerId, this.targetItemId, this.passAmount).subscribe(
      (res) => {
        if (res.status) {
          this.toastSrv.success("Successfully changed the Target Amount");
          this.isLoading = false;
          this.fetchTargetDetalis()
          this.router.navigate(['/officer-target'], {
            queryParams: { id: this.targetItemId, toDate: this.toDate, fromDate: this.fromDate, officerId: this.officerId },
          });
        } else {
          this.isLoading = false;
          this.toastSrv.error(res.message);
        }
      }
    )

  }

  back() {
    this.router.navigate(['/officer-target'], {
      queryParams: { id: this.targetItemId, toDate: this.toDate, fromDate: this.fromDate, officerId: this.officerId },
    });
  }

  formatDate(dateString: string | Date): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Invalid date

    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${month}.${day}.${year}`;
  }

  formatNextDate(dateString: string | Date): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    date.setDate(date.getDate() + 1);

    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${month}.${day}.${year}`;
  }

  onCancel() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to cancel this form?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Cancel it!',
      cancelButtonText: 'No, Stay On Page',
      customClass: {
        popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
        title: 'dark:text-white',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.toastSrv.warning('Officer Target Edit Canceled.')
        this.router.navigate(['/officer-target']);

      }
    });
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
  empId!: string;
  date!: Date
}

class Officers {
  id!: number;
  empId!: string;
  firstNameEnglish!: string;
  lastNameEnglish!: string;
}


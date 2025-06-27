import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TargetService } from '../../../services/Target-service/target.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-officer-target-pass-officer',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './officer-target-pass-officer.component.html',
  styleUrl: './officer-target-pass-officer.component.css'
})
export class OfficerTargetPassOfficerComponent implements OnInit {
  targetObj: TargetDetalis = new TargetDetalis();
  officerArr: Officers[] = [];
  filteredOfficers: Officers[] = [];

  targetItemId!: number;
  toDate! :string;
  fromDate!: string;

  passAmount: number = 0.00;
  amount: number = 0.00;
  searchTerm: string = '';
  selectedOfficerId!: number | null;

  isLoading: boolean = true;


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
    this.isLoading = true;

    if (!this.selectedOfficerId) {
      this.isLoading = false;
      this.toastSrv.warning('Pleace fill all feild!')
      return;
    }

    if (this.passAmount > this.amount) {
      this.isLoading = false;
      this.toastSrv.warning(`The maximum amount you can pass <b>${this.amount}</b>Kg`)
      return;
    }

    this.TargetSrv.passToTargetToOfficer(this.selectedOfficerId, this.targetItemId, this.passAmount).subscribe(
      (res) => {
        if (res.status) {
          this.toastSrv.success(res.message);
          this.isLoading = false;
          this.fetchTargetDetalis()
          this.router.navigate(['/officer-target'])
        } else {
          this.isLoading = false;
          this.toastSrv.error(res.message);
        }
      }
    )

  }

  onCancel() {

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
  firstNameEnglish!: string;
  lastNameEnglish!: string;
}


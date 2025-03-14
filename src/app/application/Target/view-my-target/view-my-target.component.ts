import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { TargetService } from '../../../services/Target-service/target.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-view-my-target',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, LoadingSpinnerComponent],
  templateUrl: './view-my-target.component.html',
  styleUrl: './view-my-target.component.css',
  providers: [DatePipe]
})
export class ViewMyTargetComponent implements OnInit {
  officerDataArr!: OfficerTarget[];

  hasData: boolean = true;
  selectStatus: string = '';
  searchText: string = '';

  isLoading: boolean = true;

  constructor(
    private router: Router,
    private TargetSrv: TargetService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    // this.today = this.datePipe.transform(new Date(), 'yyyy/MM/dd') || '';
    this.fetchOfficerTarget()
  }

  fetchOfficerTarget(status: string = this.selectStatus, search: string = this.searchText) {
    this.isLoading = true;
    this.TargetSrv.getOfficerTargetData(status, search).subscribe(
      (res) => {
        this.officerDataArr = res.items;

        if (res.items.length === 0) {
          this.hasData = false;
        } else {
          this.hasData = true;
        }
        this.isLoading = false;
      }
    )
  }

  navigateToNewPage(id: number) {
    this.router.navigate([`/target/edit-my-target/${id}`]);
  }

  cancelStatus() {
    this.selectStatus = '';
    this.fetchOfficerTarget(this.selectStatus, this.searchText);
  }

  filterStatus() {
    this.fetchOfficerTarget(this.selectStatus, this.searchText);
  }

  onSearch() {
    this.fetchOfficerTarget(this.selectStatus, this.searchText);
  }

  offSearch() {
    this.searchText = '';
    this.fetchOfficerTarget(this.selectStatus, this.searchText);
  }

}

class OfficerTarget {
  id!: number
  dailyTargetId!: number
  varietyNameEnglish!: string
  cropNameEnglish!: string
  target!: number
  grade!: string
  complete!: string
  toDate!: Date
  toTime!: string
  empId!: string
  status!: string
  remaining!: number
}

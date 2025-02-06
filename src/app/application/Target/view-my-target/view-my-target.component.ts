import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
// import { NgxPaginationModule } from 'ngx-pagination';
import { DropdownModule } from 'primeng/dropdown';
import { TargetService } from '../../../services/Target-service/target.service';

@Component({
  selector: 'app-view-my-target',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule],
  templateUrl: './view-my-target.component.html',
  styleUrl: './view-my-target.component.css',
  providers: [DatePipe]
})
export class ViewMyTargetComponent implements OnInit{
  officerDataArr!: OfficerTarget[];

  hasData: boolean = true;
  selectStatus: string = '';
  searchText: string = '';

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
    this.TargetSrv.getOfficerTargetData(status, search).subscribe(
      (res) => {
        this.officerDataArr = res.items;
        console.log(res.items.length);
        if (res.items.length === 0) {
          this.hasData = false;
        }else{
          this.hasData = true;

        }
      }
    )
  }

  navigateToNewPage(): void {
    // Navigate to the new page when the status is not 'Pending'
    this.router.navigate(['/change-password']);  // Assuming you want to pass the `item.id` to the new page
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

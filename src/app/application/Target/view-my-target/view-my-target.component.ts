import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { TargetService } from '../../../services/Target-service/target.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import Swal from 'sweetalert2';

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

  isDownloading = false;

  constructor(
    private router: Router,
    private TargetSrv: TargetService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
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

  downloadTemplate1() {
    this.isDownloading = true;

    this.TargetSrv
      .downloadMyTarget(this.selectStatus, this.searchText)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `Officer Target Report_${this.officerDataArr[0].empId  }.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);

          Swal.fire({
            icon: "success",
            title: "Downloaded",
            text: "Please check your downloads folder",
            customClass: {
              popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
              title: 'dark:text-white',
            }
          });
          this.isDownloading = false;
        },
        error: (error) => {
          Swal.fire({
            icon: "error",
            title: "Download Failed",
            text: error.message,
            customClass: {
              popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
              title: 'dark:text-white',
            }
          });
          this.isDownloading = false;
        }
      });
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

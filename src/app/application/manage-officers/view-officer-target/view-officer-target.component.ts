import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TargetService } from '../../../services/Target-service/target.service';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-view-officer-target',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule],
  templateUrl: './view-officer-target.component.html',
  styleUrl: './view-officer-target.component.css',
  providers: [DatePipe]
})
export class ViewOfficerTargetComponent implements OnInit {
  officerId!: number;

  selectedOfficerDataArr!: SelectedOfficerTarget[];

  hasData: boolean = true;
  selectStatus: string = '';
  searchText: string = '';

  constructor(
    private TargetSrv: TargetService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe

  ) { }

  ngOnInit(): void {
    this.officerId = this.route.snapshot.params['officerId'];
    this.fetchSelectedOfficerTarget(this.officerId);
  }

  fetchSelectedOfficerTarget(officerId: number, status: string = this.selectStatus, search: string = this.searchText) {
    this.TargetSrv.getSelectedOfficerTargetData(officerId, status, search).subscribe(
      (res) => {
        

        this.selectedOfficerDataArr = res.items;
        
        if (res.items.length === 0) {
          this.hasData = false;
        } else {
          this.hasData = true;
        }
      }
    )
  }

  // fetchSelectedOfficerTarget(status: string = this.selectStatus, search: string = this.searchText) {
  //   this.TargetSrv.getSelectedOfficerTargetData(status, search).subscribe(
  //     (res) => {
  //       this.selectedOfficerDataArr = res.items;
  //       console.log(res.items.length);
  //       if (res.items.length === 0) {
  //         this.hasData = false;
  //       }else{
  //         this.hasData = true;

  //       }
  //     }
  //   )
  // }

  navigateToNewPage(id: number): void {
    this.router.navigate([`/manage-officers/edit-officer-target/${id}`]);  // Assuming you want to pass the `item.id` to the new page
  }

  cancelStatus() {
    this.selectStatus = '';
    this.fetchSelectedOfficerTarget(this.officerId, this.selectStatus, this.searchText);
  }

  filterStatus() {
    this.fetchSelectedOfficerTarget(this.officerId, this.selectStatus, this.searchText);
  }

  onSearch() {
    this.fetchSelectedOfficerTarget(this.officerId, this.selectStatus, this.searchText);
  }

  offSearch() {
    this.searchText = '';
    this.fetchSelectedOfficerTarget(this.officerId, this.selectStatus, this.searchText);
  }

}

class SelectedOfficerTarget {
  id!: number;
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

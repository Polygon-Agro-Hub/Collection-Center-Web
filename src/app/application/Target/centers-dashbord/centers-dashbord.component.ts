import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TargetService } from '../../../services/Target-service/target.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-centers-dashbord',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './centers-dashbord.component.html',
  styleUrl: './centers-dashbord.component.css'
})
export class CentersDashbordComponent implements OnInit {
  centerNameObj: CenterName = new CenterName();
  resentCollectionArr!: ResentCollection[];

  selectTable: string = 'collection';
  centerId!: number;
  transCount: number = 0;
  transAmount: number = 0.00;
  totExpences: number = 0.00;
  expencePrecentage: number = 0.00;


  isLoading: boolean = true;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private TargetSrv: TargetService

  ) { }


  ngOnInit(): void {
    this.centerId = this.route.snapshot.params['id'];
    this.fetchCenterDashbordDetails();
  }

  fetchCenterDashbordDetails() {
    this.isLoading = true;
    this.TargetSrv.getDashbordDetails(this.centerId).subscribe((res) => {
      this.centerNameObj = res.officerCount
      this.transCount = res.transCount.transactionCount;
      this.transAmount = res.transAmountCount.transAmountCount;
      this.resentCollectionArr = res.limitedResentCollection;
      this.totExpences = res.totExpences.totExpences;
      this.expencePrecentage = res.difExpences
      this.isLoading = false;




    });
  }

  chooseTable(table: string) {
    this.selectTable = table;
  }

  navigatePath(path: string) {
    this.router.navigate([path]);
  }

  navigateAddTarget() {
    this.router.navigate([`/centers/add-target/${this.centerId}/${this.centerNameObj.centerName}/${this.centerNameObj.regCode}`]);
  }

  navigateToMarketPrice() {
    this.router.navigate([`centers/center-view-price-list/${this.centerId}`]);
  }

  viewCenterTarget() {
    this.router.navigate([`/centers/view-center-target/${this.centerId}`]);
  }

  navigateCenterOfficers(){
    this.router.navigate([`centers/center-view-officers/${this.centerId}`]);
  }

  navigateCollectionExpenses(){
    this.router.navigate([`centers/center-collection-expense/${this.centerId}`]);
  }
}

class CenterName {
  id!: number;
  centerName!: string;
  regCode!: string;
  officerCount!: number;
}

class ResentCollection {
  cropNameEnglish!: string;
  varietyNameEnglish!: string;
  totPrice!: number;
  totQty!: number;
  grade!: string;
  date!: Date;
}
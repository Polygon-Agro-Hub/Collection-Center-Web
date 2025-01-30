import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TargetService } from '../../../services/Target-service/target.service';

@Component({
  selector: 'app-centers-dashbord',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    this.TargetSrv.getDashbordDetails(this.centerId).subscribe((res) => {
      this.centerNameObj = res.officerCount
      this.transCount = res.transCount.transactionCount;
      this.transAmount = res.transAmountCount.transAmountCount;
      this.resentCollectionArr = res.limitedResentCollection;
      this.totExpences = res.totExpences.totExpences;


      console.log(res);

    });
  }

  chooseTable(table: string) {
    this.selectTable = table;
  }

  navigatePath(path: string) {
    this.router.navigate([path]);
  }

  navigateAddTarget() {
    this.router.navigate([`/centers/add-target/${this.centerId}`]);
  }

}

class CenterName {
  id!: number;
  centerName!: string;
  officerCount!: number;
}

class ResentCollection {
  cropNameEnglish!: string;
  varietyNameEnglish!: string;
  totPrice!: string;
  totQty!: string;
  grade!: string;
  date!: Date;
}
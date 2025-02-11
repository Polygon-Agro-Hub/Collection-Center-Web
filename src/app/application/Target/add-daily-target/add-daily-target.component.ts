import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TargetService } from '../../../services/Target-service/target.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';

@Component({
  selector: 'app-add-daily-target',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-daily-target.component.html',
  styleUrl: './add-daily-target.component.css',
  providers: [DatePipe]

})
export class AddDailyTargetComponent implements OnInit {
  cropsObj: Crop[] = [];
  selectedVarieties!: Variety[];
  centerId!: number;
  centerName!: string;

  dailyTartgetObj: DailyTarget = new DailyTarget();
  InputObj: TargetItem = new TargetItem();

  isVerityVisible = true;
  isAddColumn = false;
  selectCropId: number | string = '';


  totalTime = 10;
  remainingTime = this.totalTime;
  intervalId: any;
  progress = 283;

  isSaveButtonDisabled = false;
  iscountDown = true;


  constructor(
    private router: Router,
    private TargetSrv: TargetService,
    private toastSrv: ToastAlertService,
    private route: ActivatedRoute,


  ) { }


  ngOnInit(): void {
    this.dailyTartgetObj.centerId = this.route.snapshot.params['id'];
    this.centerName = this.route.snapshot.params['name'];
    this.getAllCropVerity();
  }

  getAllCropVerity() {
    this.TargetSrv.getCropVerity().subscribe(
      (res) => {
        this.cropsObj = res;
        
      },
      (error) => {
        
      }
    );
  }

  onCropChange() {
    const sample = this.cropsObj.filter(crop => crop.cropId === +this.selectCropId);
    const selectedCrop = this.cropsObj.find(crop => crop.cropId === +this.selectCropId);

    console.log("Filtered crops:", sample);

    if (sample.length > 0 && selectedCrop) {
      this.InputObj.cropName = selectedCrop.cropNameEnglish;
      this.selectedVarieties = sample[0].variety;
      
      this.isVerityVisible = false;
    } else {
      // console.log("No crop found with selectId:", this.selectCropId);
    }
  }

  onVariatyChange() {
    const sample = this.selectedVarieties.find(crop => crop.id === +this.InputObj.varietyId);
    console.log("Filtered verity:", sample);

    if (sample) {
      this.InputObj.VarietyName = sample.varietyEnglish;
      
    } else {
      // console.log("No crop found with selectId:", this.selectCropId);
    }

  }

  goButton() {
    this.isAddColumn = true;
  }

  AddButton() {
    if (!this.InputObj.varietyId || this.InputObj.qtyA < 0 || this.InputObj.qtyB < 0 || this.InputObj.qtyC < 0) {
      // this.toastSrv.warning("")
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Please ensure all fields are filled and quantities are non-negative.',
      });
      return;
    } else {
      this.dailyTartgetObj.TargetItems.push(
        {
          varietyId: this.InputObj.varietyId,
          qtyA: this.InputObj.qtyA,
          qtyB: this.InputObj.qtyB,
          qtyC: this.InputObj.qtyC,
          cropName: this.InputObj.cropName,
          VarietyName: this.InputObj.VarietyName,
        }
      );
      this.toastSrv.success(`<b>${this.InputObj.cropName} - ${this.InputObj.VarietyName}</b> added successfully!`);

      this.InputObj = new TargetItem();
      this.selectCropId = ''
      this.isAddColumn = false;

    }
  }

  removeItem(index: number) {
    if (index >= 0 && index < this.dailyTartgetObj.TargetItems.length) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to remove this item?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.isConfirmed) {
          this.dailyTartgetObj.TargetItems.splice(index, 1);
          this.toastSrv.success('The item has been removed.')

        }
      });
    }
  }

  onSubmit() {
    if (this.iscountDown) {
      this.iscountDown = false;
      this.isSaveButtonDisabled = true;
      this.startTimer();
      return;
    }

    console.log(this.dailyTartgetObj);
    if (this.dailyTartgetObj.TargetItems.length === 0) {
      Swal.fire('warning', 'Pleace fill all required feilds', 'warning')
    } else {
      this.TargetSrv.createDailyTarget(this.dailyTartgetObj).subscribe(
        (res: any) => {
          if (res.status) {
            this.toastSrv.success(res.message)
            this.router.navigate(['/target/view-target'])
          } else {
            this.toastSrv.error(res.message)

          }
        },
        (error: any) => {
          this.toastSrv.error('There was an error creating the Daily Targets')
        }
      );

    }
  }

  checkFromDate(inputField: HTMLInputElement) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(this.dailyTartgetObj.fromDate);

    if (selectedDate < today) {
      this.toastSrv.warning('The selected <b>From Date</b> cannot be in the past.')

      this.dailyTartgetObj.fromDate = '';
      inputField.value = '';
    }
  }


  checkToDate(inputField: HTMLInputElement) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(this.dailyTartgetObj.toDate);

    if (selectedDate < today) {
      this.toastSrv.warning('The selected <b>To Date</b> cannot be in the past.')


      this.dailyTartgetObj.toDate = '';
      inputField.value = '';
    }
  }

  onCancel() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'All unsaved changes will be lost. Do you want to proceed?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel',
      cancelButtonText: 'No, stay'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dailyTartgetObj = new DailyTarget();
        this.InputObj = new TargetItem();
        this.selectCropId = '';
        this.isVerityVisible = true;
        this.isAddColumn = false;
        this.router.navigate(['/target/view-target'])

      }
    });
  }

  startTimer() {
    this.intervalId = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
        this.progress = (this.remainingTime / this.totalTime) * 283; 
      } else {
        clearInterval(this.intervalId);
        this.isSaveButtonDisabled = false;
      }
    }, 1000);
  }
  

  getFormattedTime(): string {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }



}

class Crop {
  cropId!: number;
  cropNameEnglish!: string;
  variety: Variety[] = [];
}

class Variety {
  id!: number;
  varietyEnglish!: string;
}

class TargetItem {
  varietyId!: number
  qtyA: number = 0
  qtyB: number = 0
  qtyC: number = 0

  cropName!: string
  VarietyName!: string
}

class DailyTarget {
  fromDate: Date | string = ''
  toDate: Date | string = ''
  fromTime: Date | string = ''
  toTime: Date | string = ''
  centerId!: number
  TargetItems: TargetItem[] = []
}

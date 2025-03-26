import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TargetService } from '../../../services/Target-service/target.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-add-daily-target',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './add-daily-target.component.html',
  styleUrl: './add-daily-target.component.css',
  providers: [DatePipe]

})
export class AddDailyTargetComponent implements OnInit {
  cropsObj: Crop[] = [];
  selectedVarieties!: Variety[];
  centerId!: number;
  centerName!: string;
  regCode!: string;

  dailyTartgetObj: DailyTarget = new DailyTarget();
  InputObj: TargetItem = new TargetItem();

  isVerityVisible = true;
  isAddColumn = false;
  selectCropId: number | string = '';
  isAddButton: boolean = true;


  totalTime = 300;
  remainingTime = this.totalTime;
  intervalId: any;
  progress = 283;

  isSaveButtonDisabled = false;
  iscountDown = true;
  isLoading: boolean = false;


  constructor(
    private router: Router,
    private TargetSrv: TargetService,
    private toastSrv: ToastAlertService,
    private route: ActivatedRoute,
  ) { }


  ngOnInit(): void {
    this.dailyTartgetObj.centerId = this.route.snapshot.params['id'];
    this.centerName = this.route.snapshot.params['name'];
    this.regCode = this.route.snapshot.params['regCode'];
    this.getAllCropVerity();
  }

  getAllCropVerity() {
    this.isLoading = true;
    this.TargetSrv.getCropVerity().subscribe(
      (res) => {
        this.cropsObj = res;
        this.isLoading = false;

      },
      (error) => {
        this.isLoading = false;
        this.toastSrv.error("Try Again Later!")
      }
    );
  }

  onCropChange() {
    this.InputObj.VarietyName = ''
    this.isAddColumn = false;
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
    this.isLoading = true;
    if (this.dailyTartgetObj.TargetItems.some(item => item.varietyId === this.InputObj.varietyId)) {
      this.toastSrv.warning(`The variety has already been added.`);
      this.selectCropId = '';
      this.InputObj = new TargetItem();
      this.isLoading = false;
      return;
    }
    this.isAddColumn = true;
    this.isLoading = false;

  }

  AddButton() {
    this.isLoading = true;
    if (this.isAddButton) {
      this.toastSrv.warning("You have already added a weight value. Please delete the existing one and re-enter a new value.");
      this.isLoading = false;
      return;
    }

    if (!this.InputObj.varietyId || this.InputObj.qtyA < 0 || this.InputObj.qtyB < 0 || this.InputObj.qtyC < 0) {
      this.toastSrv.error('Please ensure all fields are filled and quantities are non-negative.')
      this.isLoading = false;
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
      this.isLoading = false;


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
          this.isLoading = true;
          this.dailyTartgetObj.TargetItems.splice(index, 1);
          this.toastSrv.success('The item has been removed.')
          this.isLoading = false;
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
    this.isLoading = true;
    console.log(this.dailyTartgetObj);
    if (this.dailyTartgetObj.TargetItems.length === 0) {
      // Swal.fire('warning', 'Pleace fill all required feilds', 'warning')
      this.toastSrv.success('Pleace fill all required feilds')
      this.isLoading = false;
      return;

    } else {
      this.TargetSrv.createDailyTarget(this.dailyTartgetObj).subscribe(
        (res: any) => {
          if (res.status) {
            this.toastSrv.success(res.message)
            this.isLoading = false;
            this.router.navigate(['/target/view-target'])
          } else {
            this.isLoading = false;
            this.toastSrv.error(res.message)

          }
        },
        (error: any) => {
          this.isLoading = false;
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
    today.setHours(0, 0, 0, 0); // Reset time for accurate date-only comparison
  
    const fromDate = new Date(this.dailyTartgetObj.fromDate);
    const toDate = new Date(this.dailyTartgetObj.toDate);
  
    if (toDate < today) {
      this.toastSrv.warning('The selected <b>To Date</b> cannot be in the past.');
  
      this.dailyTartgetObj.toDate = '';
      inputField.value = '';
    }

    if (toDate < fromDate) {
      this.toastSrv.warning('The <b>To Date</b> cannot be before the <b>From Date</b>.');
  
      this.dailyTartgetObj.toDate = ''; // Reset to null (instead of empty string)
      inputField.value = '';
      return;
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
        this.router.navigate(['/centers'])

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

  checkAddButton() {
    if (this.InputObj.qtyA > 0 || this.InputObj.qtyB > 0 || this.InputObj.qtyC > 0) {
      if (this.InputObj.qtyA < 0) {
        this.InputObj.qtyA = 0;
      }
      if (this.InputObj.qtyB < 0) {
        this.InputObj.qtyB = 0;
      }
      if (this.InputObj.qtyC < 0) {
        this.InputObj.qtyC = 0;
      }
      this.isAddButton = false;
    }
  }

  validateTimes() {
    if (!this.dailyTartgetObj.fromTime || !this.dailyTartgetObj.toTime) {
      return true; // Let required validation handle empty fields
    }

    // If dates are different, times don't need comparison
    if (this.dailyTartgetObj.fromDate !== this.dailyTartgetObj.toDate) {
      return true;
    }

    const fromTime = this.dailyTartgetObj.fromTime.toString();
    const toTime = this.dailyTartgetObj.toTime.toString();

    return fromTime <= toTime;
  }

  checkFromTime(inputField: HTMLInputElement) {
    if (!this.validateTimes()) {
      this.toastSrv.warning('The <b>From Time</b> cannot be after the <b>To Time</b>');
      this.dailyTartgetObj.fromTime = '';
      inputField.value = '';
    }
  }

  checkToTime(inputField: HTMLInputElement) {
    if (this.dailyTartgetObj.fromTime === '') {
      this.toastSrv.warning('Pleace Enter 1st <b>From Time</b>')
      this.dailyTartgetObj.toTime = '';
      return;
    }
    if (!this.validateTimes()) {
      this.toastSrv.warning('The <b>To Time</b> cannot be before the <b>From Time</b>');
      this.dailyTartgetObj.toTime = '';
      inputField.value = '';
    }
  }


  formatDate(dateString: string | Date): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ''; // Invalid date
  
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${month}/${day}/${year}`;
}

formatTime(timeString: string | Date): string {
  if (!timeString) return '';
  
  // Handle both Date objects and time strings
  let hours: number, minutes: string;
  
  if (typeof timeString === 'string') {
    const [h, m] = timeString.split(':');
    hours = parseInt(h, 10);
    minutes = m?.padStart(2, '0') || '00';
  } else {
    const date = new Date(timeString);
    if (isNaN(date.getTime())) return '';
    hours = date.getHours();
    minutes = date.getMinutes().toString().padStart(2, '0');
  }

  // Convert to 12-hour format with AM/PM
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours || 12; // Convert 0 to 12 for 12-hour format
  
  return `${hours}:${minutes} ${ampm}`;
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
  varietyId: number | string = ''
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

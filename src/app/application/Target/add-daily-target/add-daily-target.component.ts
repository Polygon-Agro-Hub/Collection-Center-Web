import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TargetService } from '../../../services/Target-service/target.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

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

  dailyTartgetObj: DailyTarget = new DailyTarget();
  InputObj: TargetItem = new TargetItem();

  isVerityVisible = true;
  isAddColumn = false;
  selectCropId: number | string = '';


  constructor(
    private router: Router,
    private TargetSrv: TargetService,
  ) { }


  ngOnInit(): void {
    this.getAllCropVerity();
  }

  getAllCropVerity() {
    this.TargetSrv.getCropVerity().subscribe(
      (res) => {
        this.cropsObj = res;
        console.log("Crops fetched successfully:", res);
      },
      (error) => {
        console.log("Error: Crop variety fetching issue", error);
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
      console.log(selectedCrop.cropNameEnglish, "Selected crop varieties:", this.selectedVarieties);
      this.isVerityVisible = false;
    } else {
      console.log("No crop found with selectId:", this.selectCropId);
    }
  }

  onVariatyChange() {
    const sample = this.selectedVarieties.find(crop => crop.id === +this.InputObj.varietyId);
    console.log("Filtered verity:", sample);

    if (sample) {
      this.InputObj.VarietyName = sample.varietyEnglish;
      console.log("Selected crop varieties:", this.selectedVarieties);
    } else {
      console.log("No crop found with selectId:", this.selectCropId);
    }

  }

  goButton() {
    this.isAddColumn = true;
  }

  AddButton() {
    if (!this.InputObj.varietyId || this.InputObj.qtyA < 0 || this.InputObj.qtyB < 0 || this.InputObj.qtyC < 0) {
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

      this.InputObj = new TargetItem();
      this.selectCropId = ''
      this.isAddColumn = false;

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Target item added successfully!',
      });
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
          Swal.fire('Removed!', 'The item has been removed.', 'success');
        }
      });
    }
  }

  onSubmit() {
    console.log(this.dailyTartgetObj);
    if (this.dailyTartgetObj.TargetItems.length === 0) {
      Swal.fire('warning', 'Pleace fill all required feilds', 'warning')
    } else {
      this.TargetSrv.createDailyTarget(this.dailyTartgetObj).subscribe(
        (res: any) => {
          if (res.status) {
            Swal.fire('Success', res.message, 'success');
            // this.router.navigate(['/manage-officers/view-officer'])
          } else {
            Swal.fire('Error', res.message, 'error');
          }
        },
        (error: any) => {
          Swal.fire('Error', 'There was an error creating the Daily Targets', 'error');
        }
      );

    }
  }

  checkFromDate(inputField: HTMLInputElement) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(this.dailyTartgetObj.fromDate);

    if (selectedDate < today) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Date',
        text: 'The selected date cannot be in the past.',
      });

      // Reset both model and input field
      this.dailyTartgetObj.fromDate = '';
      inputField.value = '';
    }
  }


  checkToDate(inputField: HTMLInputElement) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(this.dailyTartgetObj.toDate);

    if (selectedDate < today) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Date',
        text: 'The selected date cannot be in the past.',
      });

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
      }
    });
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
  TargetItems: TargetItem[] = []
}

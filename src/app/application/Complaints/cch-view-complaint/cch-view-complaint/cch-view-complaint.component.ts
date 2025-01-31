import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CchReceviedComplaintComponent } from '../cch-recevied-complaint/cch-recevied-complaint.component';
import { CchSendComplaintComponent } from '../cch-send-complaint/cch-send-complaint.component';

@Component({
  selector: 'app-cch-view-complaint',
  standalone: true,
  imports: [CommonModule, FormsModule, CchReceviedComplaintComponent, CchSendComplaintComponent],
  templateUrl: './cch-view-complaint.component.html',
  styleUrl: './cch-view-complaint.component.css'
})
export class CchViewComplaintComponent {
  isSelectRecevied: boolean = true;
  isSelectSent: boolean = false;
  isAddComplaintOpen: boolean = false;

  selectRecevied() {
    this.isSelectRecevied = true;
    this.isSelectSent = false;
  }

  selectSent() {
    this.isSelectRecevied = false;
    this.isSelectSent = true;
  }

  closeAddComplaint() {
    this.isAddComplaintOpen = false;
  }

  openAddComplaint() {
    this.isAddComplaintOpen = true;
  }

}

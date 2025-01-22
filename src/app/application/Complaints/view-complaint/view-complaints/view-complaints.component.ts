import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReceviedComplaintsComponent } from '../recevied-complaints/recevied-complaints.component';
import { AddComplaintComponent } from '../../add-complaint/add-complaint.component';
import { SendedComplaintComponent } from '../sended-complaint/sended-complaint.component';

@Component({
  selector: 'app-view-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule, ReceviedComplaintsComponent, AddComplaintComponent, SendedComplaintComponent],
  templateUrl: './view-complaints.component.html',
  styleUrl: './view-complaints.component.css'
})
export class ViewComplaintsComponent {

  isSelectRecevied: boolean = true;
  isSelectSent: boolean = false;
  isAddComplaintOpen:boolean = false;

  selectRecevied() {
    this.isSelectRecevied = true;
    this.isSelectSent = false;
  }

  selectSent() {
    this.isSelectRecevied = false;
    this.isSelectSent = true;
  }

  closeAddComplaint(){
    this.isAddComplaintOpen = false;
  }

  openAddComplaint(){
    this.isAddComplaintOpen = true;
  }


}

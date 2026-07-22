import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TargetProgressOngoingComponent } from '../target-progress-ongoing/target-progress-ongoing.component';
import { TargetProgressTodoComponent } from "../target-progress-todo/target-progress-todo.component";
import { TargetProgressCompletedComponent } from "../target-progress-completed/target-progress-completed.component";
import { TargetOutForDeliveryComponent } from "../target-out-for-delivery/target-out-for-delivery.component";
import { DcmPositioningComponent } from "../dcm-positioning/dcm-positioning.component"

@Component({
  selector: 'app-packing-targets',
  standalone: true,
    imports: [CommonModule, FormsModule, TargetProgressOngoingComponent, TargetProgressTodoComponent, TargetProgressCompletedComponent, TargetOutForDeliveryComponent, DcmPositioningComponent],
  templateUrl: './packing-targets.component.html',
  styleUrl: './packing-targets.component.css'
})
export class PackingTargetsComponent implements OnInit {

  isSelectPackingLIne: boolean = false;
  isSelectPositioning: boolean = true;
  isSelectAssign: boolean = false;

  constructor() { }

  ngOnInit(): void { }

  // onSwitchToOutForDelivery() {
  //   this.selectOutForDelivery();
  // }

  selectPackingLIne() {
    this.isSelectPackingLIne = true;
    this.isSelectPositioning = false;
    this.isSelectAssign = false;
  }

  selectPositioning() {
    this.isSelectPackingLIne = false;
    this.isSelectPositioning = true;
    this.isSelectAssign = false;
  }

  selectAssign() {
    this.isSelectPackingLIne = false;
    this.isSelectPositioning = false;
    this.isSelectAssign = true;
  }


}

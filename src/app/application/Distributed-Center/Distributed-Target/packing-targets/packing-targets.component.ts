import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TargetProgressOngoingComponent } from '../target-progress-ongoing/target-progress-ongoing.component';
import { TargetProgressTodoComponent } from "../target-progress-todo/target-progress-todo.component";
import { TargetOutForDeliveryComponent } from "../target-out-for-delivery/target-out-for-delivery.component";
import { DcmPositioningComponent } from "../dcm-positioning/dcm-positioning.component"
import { DchPackingLineComponent } from "./../../dch-packing-line/dch-packing-line.component";
@Component({
  selector: 'app-packing-targets',
  standalone: true,
  imports: [CommonModule, FormsModule, TargetProgressOngoingComponent, TargetProgressTodoComponent, TargetOutForDeliveryComponent, DcmPositioningComponent, DchPackingLineComponent],
  templateUrl: './packing-targets.component.html',
  styleUrl: './packing-targets.component.css'
})
export class PackingTargetsComponent implements OnInit {

  isSelectPackingLIne: boolean = true;
  isSelectPositioning: boolean = false;

  constructor() { }

  ngOnInit(): void { }

  selectPackingLIne() {
    this.isSelectPackingLIne = true;
    this.isSelectPositioning = false;
  }

  selectPositioning() {
    this.isSelectPackingLIne = false;
    this.isSelectPositioning = true;
  }

}

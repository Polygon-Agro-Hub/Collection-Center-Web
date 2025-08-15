import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TargetService } from '../../../../services/Target-service/target.service';
import { ToastAlertService } from '../../../../services/toast-alert/toast-alert.service';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-move-officer-target',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, NgxPaginationModule],
  templateUrl: './move-officer-target.component.html',
  styleUrl: './move-officer-target.component.css'
})
export class MoveOfficerTargetComponent {

  isLoading = false;

}

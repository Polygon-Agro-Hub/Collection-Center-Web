import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ComplaintsService } from '../../../services/Complaints-Service/complaints.service';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import Swal from 'sweetalert2';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-cch-recived-complaint',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './cch-recived-complaint.component.html',
  styleUrl: './cch-recived-complaint.component.css',
  providers: [DatePipe]

})
export class CchRecivedComplaintComponent {
  compalintObj: Complaint = new Complaint();
  replyObj: Reply = new Reply();


  compalinId!: number;
  hasData: boolean = false;
  officerName!: string;
  phone1!: string;
  phone2!: string;

  isReplyView: boolean = false;
  isLoading: boolean = true;


  constructor(
    private router: Router,
    private ComplainSrv: ComplaintsService,
    private route: ActivatedRoute,
    private toastSrv: ToastAlertService
  ) { }

  ngOnInit(): void {
    this.compalinId = this.route.snapshot.params['id'];
    this.fetchComplainById(this.compalinId);

  }

  fetchComplainById(id: number) {
    this.isLoading = true;
    this.ComplainSrv.getComplainById(id).subscribe(
      (res) => {
        console.log(res);
        
        this.compalintObj = res.data
        console.log(res);
        this.officerName = this.compalintObj.firstNameEnglish + " " + this.compalintObj.lastNameEnglish
        this.phone1 = this.compalintObj.phoneCode01 + " - " + this.compalintObj.phoneNumber01;
        this.phone2 = this.compalintObj.phoneCode02 + " - " + this.compalintObj.phoneNumber02;


        if (res.data.length === 0) {
          this.hasData = false;
        } else {
          this.hasData = true;

        }
        this.isLoading = false;

      }
    )
  }

  forwordComplain() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to forward this complaint?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, forward it!',
      cancelButtonText: 'No, cancel',
      customClass: {
        popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
        title: 'dark:text-white',

        icon: '',
        confirmButton: 'hover:bg-red-600 dark:hover:bg-red-700 focus:ring-red-500 dark:focus:ring-red-800' ,
        cancelButton: 'hover:bg-blue-600 dark:hover:bg-blue-700 focus:ring-blue-500 dark:focus:ring-blue-800',
        actions: 'gap-2'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.ComplainSrv.forwordCCHComplain(this.compalinId).subscribe(
          (res) => {
            if (res.status) {
              this.isLoading = false;
              this.toastSrv.success(res.message)
              this.router.navigate(['/cch-complaints']);
            } else {
              this.isLoading = false;
              this.toastSrv.error(res.message)

            }
          }
        );
      }
    });
  }

 
  replyBtn() {
    this.isReplyView = true;
  }

  cancelViewReply() {
    this.isReplyView = false;
  }

  sendReply() {
    if (!this.replyObj.reply) {
      return this.toastSrv.warning('Pleace fill reply before send!')
    }
    this.isLoading = true;
    this.replyObj.id = this.compalinId;

    this.ComplainSrv.cchReplyToComplain(this.replyObj).subscribe(
      (res) => {
        if (res.status) {
          this.isLoading = false;
          this.toastSrv.success(res.message)
          this.router.navigate(['/cch-complaints']);
        } else {
          this.isLoading = false;
          this.toastSrv.error(res.message)

        }
      }
    )
  }




}

class Complaint {
  id!: number
  refNo!: string
  complainCategory!: string
  complain!: string
  createdAt!: string
  reply!: string
  language!: string
  empId!: string
  firstNameEnglish!: string
  lastNameEnglish!: string
  phoneCode01!: string
  phoneNumber01!: string
  phoneCode02!: string
  phoneNumber02!: string
}

class Reply {
  id!: number
  reply!: string
}

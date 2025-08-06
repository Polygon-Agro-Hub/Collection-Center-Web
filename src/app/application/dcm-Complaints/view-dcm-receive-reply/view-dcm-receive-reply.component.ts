import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComplaintsService } from '../../../services/Complaints-Service/complaints.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastAlertService } from '../../../services/toast-alert/toast-alert.service';
import Swal from 'sweetalert2';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { DistributionComplaintsService } from '../../../services/distribution-complaints-service/distribution-complaints.service';

@Component({
  selector: 'app-view-dcm-receive-reply',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './view-dcm-receive-reply.component.html',
  styleUrl: './view-dcm-receive-reply.component.css'
})
export class ViewDcmReceiveReplyComponent implements OnInit {

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
    private toastSrv: ToastAlertService,
    private DistributionComplaintsSrv: DistributionComplaintsService
  ) { }

  ngOnInit(): void {
    this.compalinId = this.route.snapshot.params['id'];
    this.fetchComplainById(this.compalinId);

  }

  fetchComplainById(id: number) {
    this.isLoading = true;
    this.DistributionComplaintsSrv.dcmGetComplainById(id).subscribe(
      (res) => {
        this.compalintObj = res.data;
        console.log('compalintObj', this.compalintObj)

        this.officerName =
          (this.compalintObj?.firstNameEnglish || '') + ' ' +
          (this.compalintObj?.lastNameEnglish || '');

        // Handle phone1
        if (
          this.compalintObj?.phoneNumber01 === null ||
          this.compalintObj?.phoneNumber01 === undefined
        ) {
          this.phone1 = '-';
        } else {
          this.phone1 = `${this.compalintObj.phoneCode01 || ''} - ${this.compalintObj.phoneNumber01}`;
        }

        // Handle phone2
        if (
          this.compalintObj?.phoneNumber02 === null ||
          this.compalintObj?.phoneNumber02 === undefined
        ) {
          this.phone2 = '-';
        } else {
          this.phone2 = `${this.compalintObj.phoneCode02 || ''} - ${this.compalintObj.phoneNumber02}`;
        }

        if (!res.data || (Array.isArray(res.data) && res.data.length === 0)) {
          this.hasData = false;
        } else {
          this.hasData = true;
        }
        this.replyObj.reply = res.data.reply === null ? this.createTemplate(this.officerName, res.data.language, res.template) : res.data.reply;


        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching complaint:', error);
        this.isLoading = false;
      }
    );
  }
  // Swal.fire({
  //   title: 'Are you sure?',
  //   text: 'Do you really want to delete this Collection Officer? This action cannot be undone.',
  //   icon: 'warning',
  //   showCancelButton: true,
  //   confirmButtonColor: '#3085d6', // Default blue
  //   cancelButtonColor: '#d33',
  //   confirmButtonText: 'Yes, delete it!',
  //   cancelButtonText: 'Cancel',
  //   customClass: {
  //     popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white',
  //     title: 'dark:text-white',
  //     icon: '!border-gray-200 dark:!border-gray-500',
  //     confirmButton: 'hover:!bg-[#3085d6] dark:hover:!bg[#3085d6]', 
  //     cancelButton: '',
  //     actions: 'gap-2'
  //   }
  // })


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
        popup: 'bg-white dark:bg-[#363636] text-gray-800 dark:text-white rounded-lg',
        title: 'dark:text-white',
        icon: '!border-gray-200 dark:!border-gray-500',
        confirmButton: 'hover:!bg-[#3085d6] dark:hover:!bg[#3085d6] w-36', 
        cancelButton: 'w-36',
        actions: 'gap-2'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true
        this.DistributionComplaintsSrv.dcmforwordComplaint(this.compalinId).subscribe(
          (res) => {
            if (res.status) {
              this.isLoading = false;
              this.toastSrv.success(res.message)
              this.router.navigate(['/dcm-complaints']);
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
    this.isLoading = true
    this.replyObj.id = this.compalinId;

    this.DistributionComplaintsSrv.replyToComplaint(this.replyObj).subscribe(
      (res) => {
        if (res.status) {
          this.isLoading = false;
          this.toastSrv.success(res.message)
          this.router.navigate(['/dcm-complaints']);
        } else {
          this.isLoading = false;
          this.toastSrv.error(res.message)

        }
      }
    )
  }

  createTemplate(fname: string = '', language: string = 'English', templateData: TemplateData): string {
    if (language === 'Sinhala') {
      return `
හිතවත් ${fname},

ඔබට තවත් ගැටළු හෝ ප්‍රශ්න තිබේ නම්, කරුණාකර අප හා සම්බන්ධ වන්න. ඔබේ ඉවසීම සහ අවබෝධය වෙනුවෙන් ස්තූතියි.

මෙයට,
${templateData.SinName}
Collection Center Manager of ${templateData.companyNameSinhala}
    `
    } else if (language === 'Tamil') {
      return `
அன்புள்ள ${fname},

உங்களுக்கு மேலும் ஏதேனும் சிக்கல்கள் அல்லது கேள்விகள் இருந்தால், தயவுசெய்து எங்களைத் தொடர்பு கொள்ளவும். உங்கள் பொறுமைக்கும் புரிதலுக்கும் நன்றி.

இதற்கு,
  ${templateData.TamName}
Collection Center Manager of ${templateData.companyNameTamil}
      `
    } else {
      return `
Dear ${fname},

If you have any further concerns or questions, feel free to reach out.
Thank you for your patience and understanding.


Sincerely, ${templateData.EngName}
Collection Center Manager of  ${templateData.companyNameEnglish}

  `
    }

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


interface TemplateData {
  EngName: string
  SinName: string
  TamName: string
  companyNameEnglish: string
  companyNameSinhala: string
  companyNameTamil: string
}

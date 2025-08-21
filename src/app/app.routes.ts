import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard.service';
import { LoginComponent } from './application/Auth/login/login.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { DashboardComponent } from './application/dashboard/dashboard.component';
import { AddOfficersComponent } from './application/manage-officers/add-officers/add-officers.component';
import { ChangePasswordComponent } from './application/Auth/change-password/change-password.component';
import { ViewOfficersComponent } from './application/manage-officers/view-officers/view-officers.component';
import { EditOfficerComponent } from './application/manage-officers/edit-officer/edit-officer.component';
import { ViewPriceListComponent } from './application/Price-List/view-price-list/view-price-list.component';
import { PriceRequestComponent } from './application/Price-List/price-request/price-request.component';
import { SelectReportComponent } from './application/Report/select-report/select-report/select-report.component';
import { CollectionMonthlyReportComponent } from './application/Report/collection-monthly-report/collection-monthly-report.component';
import { FarmerListComponent } from './application/Report/farmer-list/farmer-list.component';
import { CollectionDailyReportComponent } from './application/Report/collection-daily-report/collection-daily-report.component';
import { FarmerReportComponent } from './application/Report/farmer-report/farmer-report.component';
import { ViewDailyTargetComponent } from './application/Target/view-daily-target/view-daily-target.component';
import { OfficerProfileComponent } from './application/manage-officers/officer-profile/officer-profile.component';
import { DownloadTargetComponent } from './application/Target/download-target/download-target.component';
import { ViewComplaintsComponent } from './application/Complaints/view-complaint/view-complaints/view-complaints.component';
import { ViewRecivedComplaintComponent } from './application/Complaints/view-recived-complaint/view-recived-complaint.component';
import { ClaimOfficerComponent } from './application/manage-officers/claim-officer/claim-officer.component';
import { ViewCentersComponent } from './application/Target/view-centers/view-centers.component';
import { CentersDashbordComponent } from './application/Target/centers-dashbord/centers-dashbord.component';
import { ProfileComponent } from './application/Auth/profile/profile.component';
import { CenterViewOfficersComponent } from './application/Target/center-view-officers/center-view-officers.component';
import { CchViewComplaintComponent } from './application/Complaints/cch-view-complaint/cch-view-complaint/cch-view-complaint.component';
import { CchRecivedComplaintComponent } from './application/Complaints/cch-recived-complaint/cch-recived-complaint.component';
import { CenterViewPriceListComponent } from './application/Target/center-view-price-list/center-view-price-list.component';
import { AssignOfficerTargetComponent } from './application/Target/assign-officer-target/assign-officer-target.component';
import { EditMyTargetComponent } from './application/Target/edit-my-target/edit-my-target.component';
import { ViewMyTargetComponent } from './application/Target/view-my-target/view-my-target.component';
import { ViewOfficerTargetComponent } from './application/manage-officers/view-officer-target/view-officer-target.component';
import { EditOfficerTargetComponent } from './application/manage-officers/edit-officer-target/edit-officer-target.component';
import { RoleGuardService } from './services/RoleGuard/role-guard.service';
import { EditAssignOfficerTargetComponent } from './application/Target/edit-assign-officer-target/edit-assign-officer-target.component';
import { AddCenterComponent } from './application/Target/add-center/add-center.component';
import { ViewCenterTargetComponent } from './application/Target/view-center-target/view-center-target.component';
import { PendingChangesGuard } from './guards/can-deactivate.guard';
import { AssignCenterTargetViewComponent } from './application/Target/assign-center-target-view/assign-center-target-view/assign-center-target-view.component';
import { ReportDashboardComponent } from './application/Report/report-dashboard/report-dashboard.component';
import { CollectionReportsComponent } from './application/Report/collection-reports/collection-reports.component';
import { OfficerTargetViewComponent } from './application/Target/officer-target-view/officer-target-view.component';
import { CenterCollectionExpenseComponent } from './application/Target/center-collection-expense/center-collection-expense.component';
import { FarmerReportInvoiceComponent } from './application/Report/farmer-report-invoice/farmer-report-invoice.component';
import { OfficerTargetPassOfficerComponent } from './application/Target/officer-target-pass-officer/officer-target-pass-officer.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { UnauthorizedAccessPageComponent } from './components/unauthorized-access-page/unauthorized-access-page.component';
import { CcmRoleGuardService } from './services/RoleGuard/ccm-role-guard.service';
import { ViewCentresComponent } from './application/Distributed-Center/Centres/view-centres/view-centres.component';
import { ViewDistributedOfficersComponent } from './application/Distributed-Center/distributed-manage-officers/view-distributed-officers/view-distributed-officers.component';
import { CreateDistributionCentreComponent } from './application/Distributed-Center/Centres/create-distribution-centre/create-distribution-centre.component';
import { EditCentreComponent } from './application/Target/edit-centre/edit-centre.component';
import { AddDistributedOfficerComponent } from './application/Distributed-Center/add-distributed-officer/add-distributed-officer.component';
import { EditDistributedOfficerComponent } from './application/Distributed-Center/edit-distributed-officer/edit-distributed-officer.component';
import { CenterDashboardComponent } from './application/Distributed-Center/center-dashboard/center-dashboard.component';
import { AssignDistributionTargetComponent } from './application/Distributed-Center/Distributed-Target/assign-distribution-target/assign-distribution-target.component';
import { ViewDistributionCenterTargetComponent } from './application/Distributed-Center/Distributed-Target/view-distribution-center-target/view-distribution-center-target.component';
import { TargetProgressAllComponent } from './application/Distributed-Center/Distributed-Target/target-progress-all/target-progress-all.component';
import { RequestsComponent } from './application/Distributed-Center/requests/requests.component';
import { DcmComplaintsComponent } from './application/dcm-Complaints/dcm-complaints/dcm-complaints.component';
import { ViewDcmReceiveReplyComponent } from './application/dcm-Complaints/view-dcm-receive-reply/view-dcm-receive-reply.component';
import { OfficerTargetsComponent } from './application/Distributed-Center/Distributed-Target/officer-targets/officer-targets.component';
import { ViewDistributionOfficerTargetComponent } from './application/Distributed-Center/Distributed-Target/view-distribution-officer-target/view-distribution-officer-target.component';
import { DchComplaintsComponent } from './application/dch-Complaints/dch-complaints/dch-complaints.component';
import { DchViewRecieveComplaintComponent } from './application/dch-Complaints/dch-view-recieve-complaint/dch-view-recieve-complaint.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    { path: 'login', component: LoginComponent },
    { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
    { path: '451', component: UnauthorizedAccessPageComponent},


    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'profile',
                component: ProfileComponent,
            },
            {
                path: 'dashbord',
                canActivate:[CcmRoleGuardService],
                component: DashboardComponent
            },
            {
                path: 'manage-officers',
                children: [
                    {
                        path: 'create-officer',
                        component: AddOfficersComponent
                    },
                    
                    {
                        // view-officer removed
                        path: '',
                        component: ViewOfficersComponent
                    },
                    {
                        path: 'edit-officer/:id',
                        component: EditOfficerComponent
                    },
                    {
                        path: 'officer-profile/:id',
                        component: OfficerProfileComponent
                    },
                    {
                        path: 'claim-officer',
                        component: ClaimOfficerComponent
                    },
                    {
                        path: 'view-officer-target/:officerId/:centerName',
                        component: ViewOfficerTargetComponent
                    },
                    {
                        path: 'edit-officer-target/:id',
                        component: EditOfficerTargetComponent
                    }

                ]
            },
            {
                path: 'price-list',
                canActivate:[CcmRoleGuardService],
                children: [
                    {
                        path: '',
                        component: ViewPriceListComponent,
                        canDeactivate: [PendingChangesGuard]
                    }
                ]
            },
            {
                path: 'price-request',
                canActivate:[CcmRoleGuardService],
                children: [
                    {
                        path: '',
                        component: PriceRequestComponent
                    }
                ]
            },
            {
                path: 'reports',
                children: [

                    {
                        path: '',
                        component: ReportDashboardComponent
                    },
                    {
                        path: 'officer-reports',
                        component: SelectReportComponent
                    },

                    {
                        path: 'collection-reports',
                        component: CollectionReportsComponent
                    },
                    {
                        path: 'collection-monthly-report/:id',
                        component: CollectionMonthlyReportComponent
                    },
                    {
                        path: 'farmer-list/:id/:officer',
                        component: FarmerListComponent
                    },
                    {
                        path: 'daily-report/:id/:name/:empid',
                        component: CollectionDailyReportComponent
                    },
                    {
                        path: 'farmer-report/:id',
                        component: FarmerReportComponent
                    },
                    {
                        path: 'farmer-report-invoice/:invNo',
                        component: FarmerReportInvoiceComponent
                    },


                ]
            },
            {
                path: 'target',
                canActivate:[CcmRoleGuardService],
                children: [
                    {
                        path: '',
                        component: ViewDailyTargetComponent
                    },
                    {
                        path: 'download-target',
                        component: DownloadTargetComponent
                    },
                    {
                        path: 'assing-target/:varietyId/:companyCenterId',
                        component: AssignOfficerTargetComponent
                    },
                    {
                        path: 'view-my-target',
                        component: ViewMyTargetComponent
                    },
                    {
                        path: 'edit-my-target/:id',
                        component: EditMyTargetComponent
                    },
                    {
                        path: 'edit-assing-target/:varietyId/:companyCenterId',
                        component: EditAssignOfficerTargetComponent
                    }

                ]
            },
            {
                path: 'complaints',
                canActivate:[CcmRoleGuardService],
                children: [
                    {
                        path: '',
                        component: ViewComplaintsComponent
                    },
                    {
                        path: 'view-recive-reply/:id',
                        component: ViewRecivedComplaintComponent
                    }
                ]
            },
            {
                path: 'centers',
                canActivate: [RoleGuardService],
                children: [
                    {
                        path: '',
                        component: ViewCentersComponent
                    },
                    {
                        path: 'center-shashbord/:id',
                        component: CentersDashbordComponent
                    },
                    {
                        path: 'add-target/:id/:name/:regCode',
                        component: AssignCenterTargetViewComponent
                    },
                    {
                        path: 'edit-officer/:id/:centerId',
                        component: EditOfficerComponent
                    },
                    {
                        path: 'officer-profile/:id/:centerId',
                        component: OfficerProfileComponent
                    },
                    {
                        path: 'center-view-price-list/:id',
                        component: CenterViewPriceListComponent
                    },
                    {
                        path: 'center-view-officers/:id',
                        component: CenterViewOfficersComponent
                    },
                    {
                        path: 'add-a-center',
                        component: AddCenterComponent
                    },
                    {
                        path: 'edit-center/:id',
                        component: EditCentreComponent
                    },
                    {
                        path: 'view-center-target/:id',
                        component: ViewCenterTargetComponent
                    },
                    {
                        path: 'center-collection-expense/:id',
                        component: CenterCollectionExpenseComponent
                    },
                ]
            },
            {
                path: 'cch-complaints',
                canActivate: [RoleGuardService],
                children: [
                    {
                        path: '',
                        component: CchViewComplaintComponent
                    },
                    {
                        path: 'view-recive-reply/:id',
                        component: CchRecivedComplaintComponent
                    }
                ]
            },
            {
                path: 'officer-target',
                canActivate:[CcmRoleGuardService],
                children: [
                    {
                        path: '',
                        component: OfficerTargetViewComponent
                    },
                    {
                        path: 'edit-officer-target/:id/:toDate/:fromDate',
                        component: OfficerTargetPassOfficerComponent
                    }

                ]
            },
            // ----------------------------------------- Distribution Center Routes ------------------------------------------
            {
                path: 'distribution-center',
                // canActivate:[CcmRoleGuardService],
                children: [
                    {
                        path: '',
                        component: ViewCentresComponent,
                    },
                    {
                        path: 'create-distribution-centre',
                        component: CreateDistributionCentreComponent,
                    },
                    {
                        path: 'center-dashboard/:id/:centerName/:regCode',
                        component: CenterDashboardComponent,
                    },

                    {
                        path: 'edit-distribution-officer/:id',
                        component: EditDistributedOfficerComponent,
                    },
                    {
                        path: 'officer-profile/:id',
                        component: EditDistributedOfficerComponent,
                    }
                    
                ]
            },
            {
                path: 'distribution-officers',
                // canActivate:[CcmRoleGuardService],
                children: [
                    {
                        path: '',
                        component: ViewDistributedOfficersComponent,
                    },
                    {
                        path: 'create-distribution-officer',
                        component: AddDistributedOfficerComponent
                    },
                    {
                        path: 'edit-distribution-officer/:id',
                        component: EditDistributedOfficerComponent
                    }
                ]
            },
            // {
            //     path: 'distribution-center-dashboard',
            //     component: AddDistributedOfficerComponent
            //     // canActivate:[CcmRoleGuardService],
            //     // children: [
            //     //     {
            //     //         path: '',
            //     //         component: ViewDistributedOfficersComponent,
            //     //     },
            //     //     {
            //     //         path: 'create-distribution-officer',
            //     //         component: AddDistributedOfficerComponent
            //     //     },
            //     //     {
            //     //         path: 'edit-distribution-officer/:id',
            //     //         component: EditDistributedOfficerComponent
            //     //     }
            //     // ]
            // },

            {
                path: 'assign-targets',
                // canActivate:[CcmRoleGuardService],
                children: [
                    {
                        path: '',
                        component: ViewDistributionCenterTargetComponent,
                    },
                    {
                        path: 'Assign',
                        component: AssignDistributionTargetComponent,
                    },
                    // {
                    //     path: 'create-distribution-officer',
                    //     component: AddDistributedOfficerComponent
                    // },
                    // {
                    //     path: 'edit-distribution-officer/:id',
                    //     component: EditDistributedOfficerComponent
                    // }
                ]
            },

            {
                path: 'officer-targets',
                // canActivate:[CcmRoleGuardService],
                children: [
                    {
                        path: '',
                        component: OfficerTargetsComponent,
                    },
                    {
                        path: 'view-officer-target/:officerId',  
                        component: ViewDistributionOfficerTargetComponent
                      }
                    // {
                    //     path: 'edit-distribution-officer/:id',
                    //     component: EditDistributedOfficerComponent
                    // }
                ]
            },

            {
                path: 'target-progress',
                // canActivate:[CcmRoleGuardService],
                children: [
                    {
                        path: '',
                        component: TargetProgressAllComponent,
                    },
                    // {
                    //     path: 'Assign',
                    //     component: AssignDistributionTargetComponent,
                    // },
                    // {
                    //     path: 'create-distribution-officer',
                    //     component: AddDistributedOfficerComponent
                    // },
                    // {
                    //     path: 'edit-distribution-officer/:id',
                    //     component: EditDistributedOfficerComponent
                    // }
                ]
            },

            {
                path: 'requests',
                // canActivate:[CcmRoleGuardService],
                children: [
                    {
                        path: '',
                        component: RequestsComponent,
                    },
                    // {
                    //     path: 'Assign',
                    //     component: AssignDistributionTargetComponent,
                    
                ]
            },


            {
                path: 'dcm-complaints',
                // canActivate:[CcmRoleGuardService],
                children: [
                    {
                        path: '',
                        component: DcmComplaintsComponent,
                    },
                    {
                        path: 'view-dcm-recive-complaint/:id',
                        component: ViewDcmReceiveReplyComponent
                    }
                ]
            },

            {
                path: 'dch-complaints',
                // canActivate:[CcmRoleGuardService],
                children: [
                    {
                        path: '',
                        component: DchComplaintsComponent,
                    },
                    {
                        path: 'view-recieve-complaint/:id',
                        component: DchViewRecieveComplaintComponent,
                    }
                ]
            },

        ]
    },
    {path:'**', component: NotFoundPageComponent}

];
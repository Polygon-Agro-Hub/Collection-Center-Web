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
import { AddDailyTargetComponent } from './application/Target/add-daily-target/add-daily-target.component';
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

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    { path: 'login', component: LoginComponent },
    { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },


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
                        path: 'view-officer-target/:officerId',
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
                        path: 'edit-officer/:id',
                        component: EditOfficerComponent
                    },
                    {
                        path: 'officer-profile/:id',
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
                children: [
                    {
                        path: '',
                        component: OfficerTargetViewComponent
                    }
                ]
            }

        ]
    },
];
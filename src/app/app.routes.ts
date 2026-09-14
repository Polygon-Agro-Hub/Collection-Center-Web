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
import { TargetProgressAllComponent } from './application/Distributed-Center/Distributed-Target/target-progress-all/target-progress-all.component';
import { RequestsComponent } from './application/Distributed-Center/requests/requests.component';
import { DcmComplaintsComponent } from './application/dcm-Complaints/dcm-complaints/dcm-complaints.component';
import { ViewDcmReceiveReplyComponent } from './application/dcm-Complaints/view-dcm-receive-reply/view-dcm-receive-reply.component';
import { DchComplaintsComponent } from './application/dch-Complaints/dch-complaints/dch-complaints.component';
import { DchViewRecieveComplaintComponent } from './application/dch-Complaints/dch-view-recieve-complaint/dch-view-recieve-complaint.component';
import { CchPriceRequestComponent } from './application/Price-List/cch-price-request/cch-price-request.component';
import { CchCenterPriceListComponent } from './application/Price-List/cch-center-price-list/cch-center-price-list.component';
import { pendingPricelistUpdateCchGuard } from './guards/pending-pricelist-update-cch.guard';
import { AssignCitiesComponent } from './application/Distributed-Center/Centres/assign-cities/assign-cities.component';
import { ProcurementDashboardComponent } from './application/procurement/procurement-dashboard/procurement-dashboard.component';
import { RedefineOrdersComponent } from './application/procurement/redefine-orders/redefine-orders.component';
import { ToDoRedefinePremadeOrdersComponent } from './application/procurement/to-do-redefine-premade-orders/to-do-redefine-premade-orders.component';
import { SentToDispatchPremadeOrdersComponent } from './application/procurement/sent-to-dispatch-premade-orders/sent-to-dispatch-premade-orders.component';
import { RecievedOrdersComponent } from './application/procurement/recieved-orders/recieved-orders.component';
import { RequestedItemsComponent } from './application/procurement/requested-items/requested-items.component';
import { ViewMyTargetDcmComponent } from './application/Distributed-Center/view-my-target-dcm/view-my-target-dcm.component';
import { DcmDashboardComponent } from './application/Distributed-Center/dcm-dashboard/dcm-dashboard.component';
import { ViewDistributionCenterComponent } from './application/Distributed-Center/Centres/view-distribution-center/view-distribution-center.component';
import { EditDistributionCenterComponent } from './application/Distributed-Center/Centres/edit-distribution-center/edit-distribution-center.component';
import { DispatchedDashboardComponent } from './application/Dispatched/dispatched-dashboard/dispatched-dashboard.component';
import { CashActivityDashboardComponent } from './application/Cash-activity/cash-activity-dashboard/cash-activity-dashboard.component';
import { ViewPickupCashRevenueComponent } from './application/Cash-activity/view-pickup-cash-revenue/view-pickup-cash-revenue.component';
import { ViewDeliveryRevenueComponent } from './application/Cash-activity/view-delivery-revenue/view-delivery-revenue.component';
import { PackingTargetsComponent } from './application/Distributed-Center/Distributed-Target/packing-targets/packing-targets.component';
import { ProductStorageDashboardComponent } from './application/product-storage/product-storage-dashboard/product-storage-dashboard.component';
import { ProductShortageTodayComponent } from './application/product-storage/product-shortage-today/product-shortage-today.component';
import { ProductStorageHistoryComponent } from './application/product-storage/product-storage-history/product-storage-history.component'
import { DistributionProcurementDashboardComponent } from './application/distribution-procurement/distribution-procurement-dashboard/distribution-procurement-dashboard.component'
import { ShortageHistoryComponent } from './application/distribution-procurement/shortage-history/shortage-history.component'
import { ShortageTodayComponent } from './application/distribution-procurement/shortage-today/shortage-today.component'
import { ShortageTodayFinalizationComponent } from './application/distribution-procurement/shortage-today-finalization/shortage-today-finalization.component'
import { ShortageAssignComponent } from './application/distribution-procurement/shortage-assign/shortage-assign.component';
import { ViewOutForDeiveryOrderDetailsComponent } from './application/Distributed-Center/Distributed-Target/view-out-for-deivery-order-details/view-out-for-deivery-order-details.component'

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
                canActivate:[RoleGuardService],
                data: { roles: ['Collection Centre Manager', 'Collection Centre Head', 'Distribution Centre Manager', 'Distribution Centre Head'] },
                children: [
                    {
                        path: '',
                        component: ProfileComponent
                    },

                    {
                        path: 'view-my-target',
                        component: ViewMyTargetComponent
                    },
                    
                    {
                        path: 'view-my-target-dcm/:id',
                        component: ViewMyTargetDcmComponent
                    },

                ]
            },

            
            {
                path: 'dashbord',
                canActivate:[RoleGuardService],
                data: { roles: ['Collection Centre Manager'] },
                component: DashboardComponent
            },
            {
                path: 'manage-officers',
                canActivate:[RoleGuardService],
                data: { roles: ['Collection Centre Manager', 'Collection Centre Head'] },
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
                        path: 'view-officer-target/:officerId/:newCenterName',
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
                canActivate:[RoleGuardService],
                data: { roles: ['Collection Centre Manager'] },
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
                canActivate:[RoleGuardService],
                data: { roles: ['Collection Centre Manager'] },
                children: [
                    {
                        path: '',
                        component: PriceRequestComponent
                    }
                ]
            },
            {
                path: 'reports',
                canActivate:[RoleGuardService],
                data: { roles: ['Collection Centre Manager', 'Collection Centre Head'] },
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
                path: 'procurement',
                canActivate:[RoleGuardService],
                data: { roles: ['Collection Centre Head'] },
                children: [

                    {
                        path: '',
                        component: ProcurementDashboardComponent
                    },
                    {
                        path: 'redefine-orders',
                        component: RedefineOrdersComponent
                    },

                    {
                        path: 'todo-redefine-premade-orders',
                        component: ToDoRedefinePremadeOrdersComponent
                    },

                    {
                        path: 'view-dispatched-define-orders',
                        component: SentToDispatchPremadeOrdersComponent
                    },

                    {
                        path: 'view-recieved-orders',
                        component: RecievedOrdersComponent
                    },

                ]
            },
            {
                path: 'target',
                canActivate:[RoleGuardService],
                data: { roles: ['Collection Centre Manager'] },
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
                canActivate:[RoleGuardService],
                data: { roles: ['Collection Centre Manager'] },
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
                data: {roles: ['Collection Centre Head']},
                children: [
                    {
                        path: '',
                        component: ViewCentersComponent
                    },
                    {
                        path: 'center-dashboard/:id',
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
                canActivate:[RoleGuardService],
                data: { roles: ['Collection Centre Head'] },
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
                path: 'cch-price-request',
                canActivate:[RoleGuardService],
                data: { roles: ['Collection Centre Head'] },
                children: [
                    {
                        path: '',
                        component: CchPriceRequestComponent
                    },
                    {
                        path: 'cch-center-price-list/:requestId/:officerId',
                        component: CchCenterPriceListComponent,
                        canDeactivate: [pendingPricelistUpdateCchGuard]
                    }
                ]
            },
            {
                path: 'officer-target',
                canActivate:[RoleGuardService],
                data: { roles: ['Collection Centre Manager'] },
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
            // ----------------------------------------- Distribution Centre Routes ------------------------------------------
            {
                path: 'distribution-center',
                canActivate:[RoleGuardService],
                data: { roles: ['Distribution Centre Head'] },
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
                        path: 'view-distribution-centre/:centerId',
                        component: ViewDistributionCenterComponent,
                    },
                    {
                        path: 'edit-distribution-centre/:centerId',
                        component: EditDistributionCenterComponent,
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
                        component: OfficerProfileComponent,
                    },
                    {
                        path: 'assign-cities',
                        component: AssignCitiesComponent,
                    },
                    
                ]
            },
            {
                path: 'distribution-center-dashboard',
                canActivate:[RoleGuardService],
                data: { roles: ['Distribution Centre Manager'] },
                children: [
                    {
                        path: '',
                        component: DcmDashboardComponent,
                    },
                    
                    
                ]
            },
            {
                path: 'distribution-officers',
                canActivate:[RoleGuardService],
                data: { roles: ['Distribution Centre Manager', 'Distribution Centre Head'] },
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

                ]
            },

            {
                path: 'requested-items',
                canActivate:[RoleGuardService],
                data: { roles: ['Distribution Centre Head', 'Distribution Centre Manager'] },
                children: [
                    {
                        path: '',
                        component: RequestedItemsComponent
                    },
                    
                ]
            },

            {
                path: 'product-shortage',
                canActivate:[RoleGuardService],
                data: { roles: ['Distribution Centre Manager'] },
                children: [
                    {
                        path: '',
                        component: ProductStorageDashboardComponent,
                    },

                    {
                        path: 'product-shortage-today',
                        component: ProductShortageTodayComponent,
                    },

                    {
                        path: 'product-shortage-history',
                        component: ProductStorageHistoryComponent,
                    }
                ]
            },
            

            {
                path: 'assign-targets',
                canActivate:[RoleGuardService],
                data: { roles: ['Distribution Centre Manager'] },
                children: [

                    {
                        path: '',
                        component: PackingTargetsComponent,
                    }
                    
                ]
            },

            {
                path: 'distribution-procurement',
                canActivate:[RoleGuardService],
                data: { roles: ['Distribution Centre Head'] },
                children: [
                    {
                        path: '',
                        component: DistributionProcurementDashboardComponent,
                    },

                    {
                        path: 'shortage-today',
                        component: ShortageTodayComponent,
                    },

                    { path: 'shortage-assign/:id', 
                      component: ShortageAssignComponent 
                    },

                    {
                        path: 'shortage-finalization-today',
                        component: ShortageTodayFinalizationComponent,
                    },

                    {
                        path: 'shortage-history',
                        component: ShortageHistoryComponent,
                    }
                ]
            },

            {
                path: 'target-progress',
                canActivate:[RoleGuardService],
                data: { roles: ['Distribution Centre Manager'] },
                children: [
                    {
                        path: '',
                        component: TargetProgressAllComponent,
                    }
                   
                ]
            },

            {
                path: 'requests',
                canActivate:[RoleGuardService],
                data: { roles: ['Distribution Centre Manager'] },
                children: [
                    {
                        path: '',
                        component: RequestsComponent,
                    },
                    
                ]
            },

            // {
            //     path: 'dispatched',
            //     canActivate:[RoleGuardService],
            //     data: { roles: ['Distribution Centre Manager'] },
            //     children: [
            //         {
            //             path: '',
            //             component: DispatchedDashboardComponent,
            //         },
                    
            //     ]
            // },


            {
                path: 'dcm-complaints',
                canActivate:[RoleGuardService],
                data: { roles: ['Distribution Centre Manager'] },
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

            // {
            //     path: 'cash-activity',
            //     canActivate:[RoleGuardService],
            //     data: { roles: ['Distribution Centre Manager'] },
            //     children: [
            //         {
            //             path: '',
            //             component: CashActivityDashboardComponent,
            //         },

            //         {
            //             path: 'view-pikup-chash-revenue',
            //             component: ViewPickupCashRevenueComponent,
            //         },

            //         {
            //             path: 'view-delivery-revenue',
            //             component: ViewDeliveryRevenueComponent,
            //         },
            //     ]
            // },


            {
                path: 'dch-complaints',
                canActivate:[RoleGuardService],
                data: { roles: ['Distribution Centre Head'] },
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
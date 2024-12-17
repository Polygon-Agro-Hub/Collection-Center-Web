import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard.service';
import { LoginComponent } from './application/Auth/login/login.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { DashboardComponent } from './application/dashboard/dashboard.component';
import { AddOfficersComponent } from './application/manage-officers/add-officers/add-officers.component';
import { ChangePasswordComponent } from './application/Auth/change-password/change-password.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    { path: 'login', component: LoginComponent },
    { path: 'change-password', component: ChangePasswordComponent,canActivate: [AuthGuard] },

    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { 
                path: 'dashbord',
                component: DashboardComponent
            },
            {
                path: 'manage-officers',
                children: [
                    {
                        path:'create-officer',
                        component:AddOfficersComponent
                    }
                ]
            }

        ]
    },
    // { path: 'login', component: LoginComponent },

];

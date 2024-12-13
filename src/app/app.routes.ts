import { Routes } from '@angular/router';
import { LoginComponent } from './application/Auth/login/login.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { DashboardComponent } from './application/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    { path: 'login', component: LoginComponent },

    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: 'dashbord', component: DashboardComponent },

        ]
    },
    // { path: 'login', component: LoginComponent },

];

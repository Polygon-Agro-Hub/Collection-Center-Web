import { Routes } from '@angular/router';
import { LoginComponent } from './application/Auth/login/login.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: 'login', component: LoginComponent },

        ]
    },
    // { path: 'login', component: LoginComponent },

];

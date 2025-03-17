import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../theme.service';
import { FormsModule } from '@angular/forms';
import { TokenServiceService } from '../../services/Token/token-service.service';
import { ToastAlertService } from '../../services/toast-alert/toast-alert.service';

export const MENU_ITEMS = [
  {
    id:1,
    key: 'dashboard',
    path: '/dashbord',
    label: 'Dashbord',
    icon: 'fas fa-th-large'
  },
  {
    id:2,
    key: 'target',
    path: '/target/view-target',
    label: 'Collection Target',
    icon: 'fa-solid fa-bullseye',
    permission:'Collection Center Manager'

  },
  {
    id:3,
    key: 'centers',
    path: '/centers',
    label: 'Centers',
    icon: 'fa-solid fa-bullseye',
    permission:'Collection Center Head'

  },
  {
    id:3,
    key: 'pricelist',
    path: '/price-list/view-prices',
    label: 'Price List',
    icon: 'fa-solid fa-tag',
    permission:'Collection Center Manager'

  },
  {
    id:4,
    key: 'pricerequest',
    path: '/price-request/view-request',
    label: 'Price Requests',
    icon: 'fas fa-hand-holding-usd',
    permission:'Collection Center Manager'

  },
  {
    id:5,
    key: 'reports',
    path: '/reports/select-report',
    label: 'Reports',
    icon: 'fa-solid fa-chart-pie'
  },
  {
    id:6,
    key: 'manageofficer',
    path: '/manage-officers/view-officer',
    label: 'Manage Officers',
    icon: 'fas fa-user-cog'
  },
  {
    id:7,
    key: 'complaints',
    path: '/complaints',
    label: 'Complaints',
    icon: 'fa-solid fa-triangle-exclamation',
    permission:'Collection Center Manager'

  },
  {
    id:8,
    key: 'cch-complaints',
    path: '/cch-complaints',
    label: 'Complaints',
    icon: 'fa-solid fa-triangle-exclamation',
    permission:'Collection Center Head'
  }
];

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent{
  isCollapsed = false;
  role: string | null = localStorage.getItem('role:');
  isSelectTab: string = 'dashboard';
  menuItems = MENU_ITEMS;

  get filteredMenuItems() {
    return this.menuItems.filter(item => 
      !item.permission || item.permission === this.role
    );
  }

  constructor(
    private themeService: ThemeService, 
    private router: Router,
    private tokenSrv:TokenServiceService,
    private toastSrv:ToastAlertService
  ) {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  isDarkTheme(): boolean {
    return this.themeService.getActiveTheme() === 'dark';
  }

  navigate(path: string, selectTab: string) {
    this.isSelectTab = selectTab;
    this.router.navigate([path]);
  }

  isTabSelected(tab: string): boolean {
    return this.isSelectTab === tab;
  }

  logOut(){
    this.tokenSrv.clearLoginDetails();
    this.toastSrv.success(`<b>Logout !`);
    this.router.navigate(['/'])
  }
}


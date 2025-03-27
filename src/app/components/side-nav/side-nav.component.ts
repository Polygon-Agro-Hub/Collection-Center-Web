import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ThemeService } from '../../theme.service';
import { FormsModule } from '@angular/forms';
import { TokenServiceService } from '../../services/Token/token-service.service';
import { ToastAlertService } from '../../services/toast-alert/toast-alert.service';
import Swal from 'sweetalert2';

export const MENU_ITEMS = [
  {
    id: 1,
    key: 'dashboard',
    path: '/dashbord',
    label: 'Dashbord',
    icon: 'fas fa-th-large',
    permission: 'Collection Center Manager',
  },
  {
    id: 2,
    key: 'target',
    path: '/target',
    label: 'Collection Target',
    icon: 'fa-solid fa-bullseye',
    permission: 'Collection Center Manager',
  },
  {
    id: 3,
    key: 'centers',
    path: '/centers',
    label: 'Centers',
    icon: 'fa-solid fa-bullseye',
    permission: 'Collection Center Head',
  },
  {
    id: 4,
    key: 'price-list',
    path: '/price-list',
    label: 'Price List',
    icon: 'fa-solid fa-tag',
    permission: 'Collection Center Manager',
  },
  {
    id: 5,
    key: 'price-request',
    path: '/price-request',
    label: 'Price Requests',
    icon: 'fas fa-hand-holding-usd',
    permission: 'Collection Center Manager',
  },
  {
    id: 6,
    key: 'reports',
    path: '/reports',
    label: 'Reports',
    icon: 'fa-solid fa-chart-pie',
  },
  {
    id: 7,
    key: 'manage-officers',
    path: '/manage-officers',
    label: 'Manage Officers',
    icon: 'fas fa-user-cog',
  },
  {
    id: 8,
    key: 'complaints',
    path: '/complaints',
    label: 'Complaints',
    icon: 'fa-solid fa-triangle-exclamation',
    permission: 'Collection Center Manager',
  },
  {
    id: 9,
    key: 'cch-complaints',
    path: '/cch-complaints',
    label: 'Complaints',
    icon: 'fa-solid fa-triangle-exclamation',
    permission: 'Collection Center Head',
  },
];

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent {
  isCollapsed = false;
  role: string | null = null;
  isSelectTab: string = 'dashboard';
  menuItems = MENU_ITEMS;

  get filteredMenuItems() {
    return this.menuItems.filter(
      (item) => !item.permission || item.permission === this.role
    );
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private themeService: ThemeService,
    private router: Router,
    private tokenSrv: TokenServiceService,
    private toastSrv: ToastAlertService
  ) {
    this.role = tokenSrv.getUserDetails().role;
    this.setActiveTabFromRoute();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setActiveTabFromRoute();
      }
    });
  }

  private setActiveTabFromRoute(): void {
    const currentPath = this.router.url.split('?')[0];
    
    // Find the menu item with the longest path that matches the current route
    const activeItem = this.menuItems
      .filter(item => currentPath.startsWith(item.path))
      .sort((a, b) => b.path.length - a.path.length)[0];

    if (activeItem) {
      this.isSelectTab = activeItem.key;
    } else {
      this.selectIdealTab();
    }
  }

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
    this.router.navigate([path]).then(() => {
      this.setActiveTabFromRoute();
    });
  }

  isTabSelected(tab: string): boolean {
    return this.isSelectTab === tab;
  }

  logOut(): void {
    if (isPlatformBrowser(this.platformId)) {
      Swal.fire({
        icon: 'warning',
        title: 'Logged Out',
        text: 'Are you sure, you want to logged out.',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.tokenSrv.clearLoginDetails();
          this.router.navigate(['login']);
          this.toastSrv.success(`<b>Logout !`);
        }
      });
    }
  }

  selectIdealTab() {
    if (this.role === 'Collection Center Manager') {
      this.isSelectTab = 'dashboard';
    } else {
      this.isSelectTab = 'centers';
    }
  }
}
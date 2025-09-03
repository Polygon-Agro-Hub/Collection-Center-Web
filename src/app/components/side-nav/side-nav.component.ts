import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
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
    permission: ['Collection Center Manager'],
  },
  {
    id: 2,
    key: 'target',
    path: '/target',
    label: 'Centre Target',
    icon: 'fa-solid fa-bullseye',
    permission: ['Collection Center Manager'],
  },
  {
    id: 3,
    key: 'officer-target',
    path: '/officer-target',
    label: 'Officer Target',
    icon: 'fa-solid fa-user-plus',
    permission: ['Collection Center Manager'],
  },
  {
    id: 4,
    key: 'centers',
    path: '/centers',
    label: 'Centres',
    icon: 'fa-solid fa-bullseye',
    permission: ['Collection Center Head'],
  },
  {
    id: 5,
    key: 'price-list',
    path: '/price-list',
    label: 'Price List',
    icon: 'fa-solid fa-tag',
    permission: ['Collection Center Manager'],
  },
  {
    id: 6,
    key: 'price-request',
    path: '/price-request',
    label: 'Price Requests',
    icon: 'fas fa-hand-holding-usd',
    permission: ['Collection Center Manager'],
  },
  {
    id: 7,
    key: 'reports',
    path: '/reports',
    label: 'Reports',
    icon: 'fa-solid fa-chart-pie',
    permission: ['Collection Center Manager', 'Collection Center Head'],

  },
  {
    id: 8,
    key: 'manage-officers',
    path: '/manage-officers',
    label: 'Manage Officers',
    icon: 'fas fa-user-cog',
    permission: ['Collection Center Manager', 'Collection Center Head'],

  },
  {
    id: 9,
    key: 'complaints',
    path: '/complaints',
    label: 'Complaints',
    icon: 'fa-solid fa-triangle-exclamation',
    permission: ['Collection Center Manager'],
  },
  {
    id: 10,
    key: 'cch-complaints',
    path: '/cch-complaints',
    label: 'Complaints',
    icon: 'fa-solid fa-triangle-exclamation',
    permission: ['Collection Center Head'],
  },

  // ----------------------------------------- Distribution Center part ------------------------------------------

  {
    id: 11,
    key: 'distribution-center-dashboard',
    path: '/distribution-center-dashboard',
    label: 'Dashboard',
    icon: 'fas fa-th-large',
    permission: ['Distribution Center Manager'],
  },
  {
    id: 12,
    key: 'distribution-center',
    path: '/distribution-center',
    label: 'Centres',
    icon: 'fa-solid fa-bullseye',
    permission: ['Distribution Center Head'],
  },


  {
    id: 13,
    key: 'target-progress',
    path: '/target-progress',
    label: 'Target Progress',
    icon: 'fa-solid fa-bullseye',
    permission: ['Distribution Center Manager'],
  },

  {
    id: 14,
    key: 'assign-targets',
    path: '/assign-targets',
    label: 'Assign Targets',
    icon: 'fa-regular fa-calendar-check',
    permission: ['Distribution Center Manager'],
  },

  {
    id: 15,
    key: 'officer-targets',
    path: '/officer-targets',
    label: 'Officer Targets',
    icon: 'fa-solid fa-user-plus',
    permission: ['Distribution Center Manager'],
  },


  {
    id: 16,
    key: 'requests',
    path: '/requests',
    label: 'Requests',
    icon: 'fa-solid fa-arrow-right-arrow-left',
    permission: ['Distribution Center Manager'],
  },

  {
    id: 17,
    key: 'reports',
    path: '/reports',
    label: 'Reports',
    icon: 'fa-solid fa-chart-pie',
    permission: ['Distribution Center Manager'],
  },

  {
    id: 18,
    key: 'distribution-officers',
    path: '/distribution-officers',
    label: 'Manage Officers',
    icon: 'fas fa-user-cog',
    permission: ['Distribution Center Head', 'Distribution Center Manager'],
  },

  {
    id: 19,
    key: 'dch-complaints',
    path: '/dch-complaints',
    label: 'Complaints',
    icon: 'fa-solid fa-triangle-exclamation',
    permission: ['Distribution Center Head'],
  },

  {
    id: 20,
    key: 'dcm-complaints',
    path: '/dcm-complaints',
    label: 'Complaints',
    icon: 'fa-solid fa-triangle-exclamation',
    permission: ['Distribution Center Manager'],
  },



  // {
  //   id: 19,
  //   key: 'dcm-manage-officers',
  //   path: '/dcm-manage-officers',
  //   label: 'Manage Officers',
  //   icon: 'fas fa-user-cog',
  //   permission: ['Distribution Center Manager'],
  // },

  // <i class="fa-solid fa-file-circle-check"></i>

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

  logOutView = false;
  companyLogo: string = '';
  companyFavicon: string = '';

  get filteredMenuItems() {
    return this.menuItems.filter(
      (item) => !item.permission || item.permission.includes(this.role!)
    );
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private themeService: ThemeService,
    private router: Router,
    private tokenSrv: TokenServiceService,
    private toastSrv: ToastAlertService,
    @Inject(DOCUMENT) private document: Document

  ) {
    this.role = tokenSrv.getUserDetails().role;
    this.companyLogo = tokenSrv.getUserDetails().logo;
    this.companyFavicon = tokenSrv.getUserDetails().favicon;
    this.setActiveTabFromRoute();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setActiveTabFromRoute();
      }
    });

    if (this.companyFavicon !== '') {
      this.changeFavicon(this.companyFavicon);
    }
  }

  private setActiveTabFromRoute(): void {
    const currentPath = this.router.url.split('?')[0];

    if (currentPath === '/profile') {
      this.isSelectTab = '';
      return;
    }

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
      this.logOutView = !this.logOutView;
    }
  }

  confirmLogOut() {
    this.logOutView = !this.logOutView;
    this.tokenSrv.clearLoginDetails();
    this.router.navigate(['login']);
    this.toastSrv.success(`<b>Logout !`);
  }

  cancelLogOut() {
    this.logOutView = !this.logOutView;
  }

  selectIdealTab() {
    if (this.role === 'Collection Center Manager') {
      this.isSelectTab = 'dashboard';
    } else if (this.role === 'Collection Center Head') {
      this.isSelectTab = 'centers';
    } else {
      this.isSelectTab = 'distribution-center';
    }
  }

  changeFavicon(iconUrl: string) {
    const link: HTMLLinkElement = this.document.querySelector("link[rel*='icon']") || this.document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = iconUrl;
    this.document.getElementsByTagName('head')[0].appendChild(link);
  }
}
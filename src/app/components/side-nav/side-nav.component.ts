import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ThemeService } from '../../theme.service';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent {
  isCollapsed = false;
  role:string | null = localStorage.getItem('role:')
  isSelectTab:string = 'dashboard'

  constructor(
    private themeService: ThemeService,
    private router: Router
  ) {}

  

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleTheme() {
    this.themeService.toggleTheme(); // Call ThemeService to toggle dark/light mode
  }

  isDarkTheme(): boolean {
    return this.themeService.getActiveTheme() === 'dark';
  }

  navigate(path:string, selectTab:string){
    this.isSelectTab = selectTab;
    console.log(this.isSelectTab);
    this.router.navigate([`${path}`])
  }

  isTabSelected(tab: string): boolean {
    return this.isSelectTab === tab;
  }
}

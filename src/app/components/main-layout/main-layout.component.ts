import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SideNavComponent } from '../side-nav/side-nav.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [HeaderComponent, SideNavComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}

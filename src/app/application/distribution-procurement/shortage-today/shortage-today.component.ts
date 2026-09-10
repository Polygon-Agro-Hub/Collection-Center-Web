import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewChecked,
  OnInit,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { DistributionProcurementService } from '../../../services/disribution-procuement-service/distribution-procurement.service';
import { LoadingSpinnerComponent } from "../../../components/loading-spinner/loading-spinner.component";
import lottie from 'lottie-web';

interface AssignmentRecord {
  qty: number;
  centreLabel: string;
  ceiling: number;
}

interface ShortageItem {
  id: number;
  name: string;
  image: string;
  shortageQty: number;
  assignedQty: number;
  marketPrice: number;
  assignments: AssignmentRecord[];
}

@Component({
  selector: 'app-shortage-today',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './shortage-today.component.html',
  styleUrl: './shortage-today.component.css',
})
export class ShortageTodayComponent
  implements OnInit, AfterViewChecked {
  shortages: ShortageItem[] = [];

  availableDate: Date = new Date('2026-06-23T18:00:00');
  isWaiting = true;
  isLoading = false;

  loadingOptions: any = {
    path: '/assets/json/blue%20loading.json',
    loop: true,
    autoplay: true,
  };

  currentTime!: Date;
  afterSixPm!: boolean;
  hasData: boolean = false;

  @ViewChild('shortageNoDataAnim') shortageNoDataAnim!: ElementRef;
  private noDataAnimInstance: any = null;
  private noDataAnimLoaded: boolean = false;

  constructor(
    private location: Location,
    private router: Router,
    private procurementsService: DistributionProcurementService,
  ) { }

  get shortageCount(): number {
    return this.shortages.length;
  }

  ngOnInit(): void {
    const now = new Date().getTime();
    const target = this.availableDate.getTime();

    this.currentTime = new Date()
    this.afterSixPm = this.currentTime.getHours() >= 18;

    if (now >= target) {
      this.isWaiting = false;
      this.fetchShortageDetails();
    }
    //  else {
    //   this.isWaiting = true;
    //   this.waitTimer = setTimeout(() => {
    //     this.isWaiting = false;
    //     this.animationItem?.destroy();
    //     this.fetchShortageDetails();
    //   }, target - now);
    // }
  }

  fetchShortageDetails(): void {
    this.isLoading = true;
    this.procurementsService.getShortageDetails().subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res : res?.data || [];
        this.shortages = data.map((item: any) => ({
          id: item.id,
          name: item.displayName,
          image: item.image,
          shortageQty: item.shortageQty,
          assignedQty: item.totalAssignedQty,
          unit: item.unitType || 'kg',
          marketPrice: item.buyPrice,
          assignments: [],
        }));
        this.isLoading = false;
        this.hasData = this.shortages.length > 0
      },
      error: (err) => {
        console.error('Error fetching shortage details:', err);
        this.isLoading = false;
      },
    });
  }

  ngAfterViewChecked(): void {
    if (!this.afterSixPm && !this.noDataAnimLoaded) {
      const container = this.shortageNoDataAnim?.nativeElement;
      if (container) {
        this.loadShortageNoDataAnimation();
        this.noDataAnimLoaded = true;
      }
    }
  }

  private loadShortageNoDataAnimation() {
    try {
      if (this.noDataAnimInstance) {
        this.noDataAnimInstance.destroy();
        this.noDataAnimInstance = null;
      }
      const container = this.shortageNoDataAnim?.nativeElement;
      if (!container) return;
      this.noDataAnimInstance = lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/json/blue%20loading.json'
      });
    } catch (err) {
      console.error('Failed to load Lottie animation', err);
    }
  }

  goBack(): void {
    this.location.back();
  }

  onView(item: ShortageItem): void {
    this.router.navigate(['distribution-procurement/shortage-assign', item.id]);
  }

  get formattedTime(): string {
    return this.availableDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  get formattedDate(): string {
    const day = this.availableDate.getDate();
    const month = this.availableDate.toLocaleString('en-US', { month: 'long' });
    const year = this.availableDate.getFullYear();
    const suffix = this.getDaySuffix(day);
    return `${day}${suffix} ${month} ${year}`;
  }

  private getDaySuffix(day: number): string {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  formatNumber(value: number): string {
    // Convert to string and remove trailing zeros
    return value.toString().replace(/\.?0+$/, '');
  }
}
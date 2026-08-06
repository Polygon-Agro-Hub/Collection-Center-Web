import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DistributionServiceService } from '../../../../services/Distribution-Service/distribution-service.service'
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-view-out-for-deivery-order-details',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './view-out-for-deivery-order-details.component.html',
  styleUrl: './view-out-for-deivery-order-details.component.css'
})
export class ViewOutForDeiveryOrderDetailsComponent implements OnInit {
  poId!: number;
  isLoading: boolean = false;
  hasData: boolean = true;

  order: OrderDetails = DUMMY_ORDER;
  itemPacks: ItemPack[] = DUMMY_ITEM_PACKS;
  orderJourney: OrderJourney = DUMMY_ORDER_JOURNEY;

  constructor(
    private location: Location,
    private DistributionSrv: DistributionServiceService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.poId = params['poId'];
    });

    this.fetchOutForDeliveryOrderDetails();
  }

  fetchOutForDeliveryOrderDetails() {
    this.isLoading = true;
    this.DistributionSrv.getOutForDeliveryOrderDeatils(this.poId).subscribe(
      {
        next: (res) => {
          this.order = res.order;
          this.itemPacks = res.itemPacks || [];
          this.orderJourney = res.orderJourney;
          // this.hasData = !!res.order;
          this.isLoading = false;
        },
        error: () => {
          // keep the dummy data on screen if the API isn't ready yet
          this.isLoading = false;
        }
      }
    )
  }

  goBack() {
    this.location.back();
  }
}

class OrderDetails {
  orderId!: string;
  type!: string;
  scheduledDate!: string;
  timeSlot!: string;
  qcDoneBy!: string;
  outTime!: string;
}

class PackItem {
  itemName!: string;
  imageUrl!: string;
  qty!: number;
  unit!: string;
  packedBy!: string;
  time!: string;
}

class ItemPack {
  packName!: string;
  items!: PackItem[];
}

class OrderJourney {
  qrPrintedBy!: string;
  qrPrintedTime!: string;
  qcDoneBy!: string;
  qcDoneTime!: string;
}

function emojiImage(emoji: string, bg: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="32" fill="${bg}"/><text x="32" y="42" font-size="30" text-anchor="middle">${emoji}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const AVOCADO_IMG = emojiImage('🥑', '#E8F5E9');
const CANTALOUP_IMG = emojiImage('🍈', '#FFF3E0');
const BATANA_IMG = emojiImage('🫘', '#FBEFE4');
const PEPPER_IMG = emojiImage('🫑', '#FDECEA');

const DUMMY_ORDER: OrderDetails = {
  orderId: '2506200003',
  type: 'Pickup',
  scheduledDate: '23rd July 2026',
  timeSlot: '12:00 PM - 04:00 PM',
  qcDoneBy: 'DCM00001',
  outTime: '04:00 PM on 23rd July 2026',
};

const DUMMY_ITEM_PACKS: ItemPack[] = [
  {
    packName: 'Fruity Pack',
    items: [
      { itemName: 'Avocado', imageUrl: AVOCADO_IMG, qty: 0.5, unit: 'kg', packedBy: 'DIO00008', time: '03:01 PM' },
      { itemName: 'Cantaloup', imageUrl: CANTALOUP_IMG, qty: 0.5, unit: 'kg', packedBy: 'DIO00009', time: '03:02 PM' },
    ],
  },
  {
    packName: 'Veggie Pack',
    items: [
      { itemName: 'Batana', imageUrl: BATANA_IMG, qty: 0.5, unit: 'kg', packedBy: 'DIO00010', time: '03:03 PM' },
      { itemName: 'Premium Bell Pepper Red', imageUrl: PEPPER_IMG, qty: 0.5, unit: 'kg', packedBy: 'DIO00011', time: '03:04 PM' },
    ],
  },
  {
    packName: 'Ala Carte Items',
    items: [
      { itemName: 'Avocado', imageUrl: AVOCADO_IMG, qty: 1.5, unit: 'kg', packedBy: 'DIO00008', time: '03:08 PM' },
      { itemName: 'Cantaloup', imageUrl: CANTALOUP_IMG, qty: 1.5, unit: 'kg', packedBy: 'DIO00009', time: '03:09 PM' },
    ],
  },
];

const DUMMY_ORDER_JOURNEY: OrderJourney = {
  qrPrintedBy: 'DIO00001',
  qrPrintedTime: '03:00 PM on 23rd July 2026',
  qcDoneBy: 'DCM00001',
  qcDoneTime: '04:00 PM on 23rd July 2026',
};

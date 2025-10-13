import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoadingSpinnerComponent } from '../../../../components/loading-spinner/loading-spinner.component';
import { SerchableDropdownComponent } from '../../../../components/serchable-dropdown/serchable-dropdown.component';
import { DistributionServiceService } from '../../../../services/Distribution-Service/distribution-service.service';

@Component({
  selector: 'app-assign-cities',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    LoadingSpinnerComponent,
    SerchableDropdownComponent

  ],
  templateUrl: './assign-cities.component.html',
  styleUrl: './assign-cities.component.css'
})
export class AssignCitiesComponent implements OnInit {

  selectProvince: string = '';
  selectDistrict: string = '';
  provinces: any[] = [];
  citiesArr: Cities[] = [];
  centersArr: Centers[] = [];
  
  // Store assignments (cityId -> centerId)
  assignments: Map<number, number> = new Map();
  
  itemId1: number | null = null;
  itemId2: number | null = null;
  provinceItems = [
      { value: 'Western', label: 'Western' },
      { value: 'Central', label: 'Central' },
      { value: 'Southern', label: 'Southern' },
      { value: 'Northern', label: 'Northern' },
      { value: 'Eastern', label: 'Eastern' },
      { value: 'North Western', label: 'North Western' },
      { value: 'North Central', label: 'North Central' },
      { value: 'Uva', label: 'Uva' },
      { value: 'Sabaragamuwa', label: 'Sabaragamuwa' }
    ];
  // Define all districts with their provinces
  allDistricts = [
      { name: 'Ampara', province: 'Eastern' },
      { name: 'Anuradhapura', province: 'North Central' },
      { name: 'Badulla', province: 'Uva' },
      { name: 'Batticaloa', province: 'Eastern' },
      { name: 'Colombo', province: 'Western' },
      { name: 'Galle', province: 'Southern' },
      { name: 'Gampaha', province: 'Western' },
      { name: 'Hambantota', province: 'Southern' },
      { name: 'Jaffna', province: 'Northern' },
      { name: 'Kalutara', province: 'Western' },
      { name: 'Kandy', province: 'Central' },
      { name: 'Kegalle', province: 'Sabaragamuwa' },
      { name: 'Kilinochchi', province: 'Northern' },
      { name: 'Kurunegala', province: 'North Western' },
      { name: 'Mannar', province: 'Northern' },
      { name: 'Matale', province: 'Central' },
      { name: 'Matara', province: 'Southern' },
      { name: 'Monaragala', province: 'Uva' },
      { name: 'Mullaitivu', province: 'Northern' },
      { name: 'Nuwara Eliya', province: 'Central' },
      { name: 'Polonnaruwa', province: 'North Central' },
      { name: 'Puttalam', province: 'North Western' },
      { name: 'Rathnapura', province: 'Sabaragamuwa' },
      { name: 'Trincomalee', province: 'Eastern' },
      { name: 'Vavuniya', province: 'Northern' },
  ];
 
  filteredDistricts: { name: string, province: string }[] = [];
  districtItems = this.filteredDistricts.map(d => ({ value: d.name, label: d.name }));

  isLoading: boolean = false;
  hasData: boolean = false;

  constructor(
    private router: Router,
    private distributionSrv: DistributionServiceService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    // Convert provinces to objects for PrimeNG dropdown
    this.updateFilteredDistricts();

    this.fetchData();
  }

  fetchData() {
    this.isLoading = true;
    this.hasData = false;

    
    this.distributionSrv.getAssignForCityes(this.selectProvince, this.selectDistrict).subscribe(
      (res) => {
        console.log(res);
        this.citiesArr = res.cities;
        
        // Filter out duplicate centers by id
        this.centersArr = this.removeDuplicateCenters(res.centers);
        
        this.isLoading = false;
        this.hasData = true;
        
        this.initializeAssignments();
      },
      (error) => {
        console.error('Error fetching data:', error);
        this.isLoading = false;
        this.hasData = false;
      }
    );
  }

  filterDistrict(districtName: string | null) {
    if (this.itemId1 !== null) {
        this.selectDistrict = ''
        
    } // keep your original guard

    const selected = this.allDistricts.find(d => d.name === districtName || '');
    this.selectProvince = selected ? selected.province : '';
    console.log('selectProvince', this.selectProvince)
    console.log('selectDistrict', this.selectDistrict)

    
  }

  filterProvince(provinceName: string | null) {
    if (this.itemId2 !== null) {
        this.selectProvince = ''
        
    }; // keep your original guard

    const selected = this.provinceItems.find(p => p.value === provinceName || '');
    this.updateFilteredDistricts(); 
    // this.selectProvince = selected ? selected.province : '';
    console.log('selectProvince', this.selectProvince)
    console.log('selectDistrict', this.selectDistrict)

   
  }

  removeDuplicateCenters(centers: Centers[]): Centers[] {
    const uniqueCenters = new Map<number, Centers>();
    
    centers.forEach(center => {
      if (!uniqueCenters.has(center.id)) {
        uniqueCenters.set(center.id, center);
      }
    });
    
    return Array.from(uniqueCenters.values());
  }

  updateFilteredDistricts() {
    if (this.selectProvince) {
        this.filteredDistricts = this.allDistricts.filter(d => d.province === this.selectProvince);
       this.districtItems = this.filteredDistricts.map(d => ({ value: d.name, label: d.name }));
    } else {
        this.filteredDistricts = this.allDistricts;
        console.log('filteredDistricts', this.filteredDistricts)
        this.districtItems = this.filteredDistricts.map(d => ({ value: d.name, label: d.name }));
    }
}

  initializeAssignments(): void {
    this.assignments.clear();
    
    this.citiesArr.forEach(city => {
      this.assignments.set(city.id, -1);
    });
    
    this.centersArr.forEach(center => {
      if (center.ownCityId) {
        const cityId = parseInt(center.ownCityId, 10);
        if (!isNaN(cityId) && this.assignments.has(cityId)) {
          this.assignments.set(cityId, center.id);
        }
      }
    });
    
    console.log('Initialized assignments:', this.assignments);
  }

  isCityAssignedToCenter(cityId: number, centerId: number): boolean {
    return this.assignments.get(cityId) === centerId;
  }

  isToggleDisabled(cityId: number, centerId: number): boolean {
    const assignedCenterId = this.assignments.get(cityId);
    return assignedCenterId !== -1 && assignedCenterId !== centerId;
  }

  toggleAssignment(cityId: number, centerId: number, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const previousCenterId = this.assignments.get(cityId);
    
    if (isChecked) {
      this.assignments.set(cityId, centerId);
      this.saveAssignment(cityId, centerId);
    } else {
      this.assignments.set(cityId, -1);
      this.removeAssignment(cityId, previousCenterId as any);
    }
    
    console.log('Updated assignments:', this.assignments);
  }

  saveAssignment(cityId: number, centerId: number): void {
    this.isLoading = true;
    
    const assignmentToSave = { cityId, centerId };
    
    console.log('Saving assignment:', assignmentToSave);
    
    this.distributionSrv.AssigCityToDistributedCenter(assignmentToSave).subscribe(
      (res) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Success',
          text: 'City assigned to centre successfully!',
          icon: 'success',
          customClass: {
            popup: 'bg-tileLight dark:bg-tileBlack text-black dark:text-white',
            title: 'font-semibold',
          },
        });
      },
      (error) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Error',
          text: 'Failed to assign city to centre',
          icon: 'error',
          customClass: {
            popup: 'bg-tileLight dark:bg-tileBlack text-black dark:text-white',
            title: 'font-semibold',
          },
        });
        this.assignments.set(cityId, -1);
      }
    );
  }

  removeAssignment(cityId: number, centerId: number): void {
    this.isLoading = true;
    
    const assignmentToRemove = { cityId, centerId };
    
    console.log('Removing assignment:', assignmentToRemove);
    
    this.distributionSrv.removeAssigCityToDistributedCenter(assignmentToRemove).subscribe(
      (res) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Success',
          text: 'City removed from centre successfully!',
          icon: 'success',
          customClass: {
            popup: 'bg-tileLight dark:bg-tileBlack text-black dark:text-white',
            title: 'font-semibold',
          },
        });
      },
      (error) => {
        this.isLoading = false;
        Swal.fire({
          title: 'Error',
          text: 'Failed to remove city from centre',
          icon: 'error',
          customClass: {
            popup: 'bg-tileLight dark:bg-tileBlack text-black dark:text-white',
            title: 'font-semibold',
          },
        });
        this.assignments.set(cityId, centerId);
      }
    );
  }

  selectStatusChange(){
    this.hasData = false;
  }

  clearDistrictFilter(event?: MouseEvent) {
    if (event) {
        event.stopPropagation(); // Prevent triggering the dropdown toggle
    }
    this.selectDistrict = '';
   
}
}

interface Cities {
  id: number;
  city: string;
}

interface Centers {
  id: number;
  regCode: string;
  ownCityId: string;
}

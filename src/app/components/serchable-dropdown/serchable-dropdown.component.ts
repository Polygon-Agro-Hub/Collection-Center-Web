import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output, HostListener, ElementRef  } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
interface DropdownItem {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-searchable-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './serchable-dropdown.component.html',
  styleUrl: './serchable-dropdown.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SerchableDropdownComponent),
      multi: true
    }
  ]
})
export class SerchableDropdownComponent {
  @Input() items: DropdownItem[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() searchPlaceholder: string = 'Search...';
  @Input() disabled: boolean = false;
  @Input() clearable: boolean = true;
  @Input() showSelected: boolean = true;
  @Output() selectionChange = new EventEmitter<any>();

  isOpen: boolean = false;
  searchTerm: string = '';
  selectedItem: DropdownItem | null = null;

  private onChange: (value: any) => void = () => { };
  private onTouched: () => void = () => { };

  constructor(private eRef: ElementRef) {}

  get filteredItems(): DropdownItem[] {
    if (!this.searchTerm) return this.items;
    return this.items.filter(item =>
      item.label.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (this.isOpen && this.eRef.nativeElement && !this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  toggleDropdown(): void {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.searchTerm = '';
    }
  }

  selectItem(item: DropdownItem): void {
    if (item.disabled) return;

    this.selectedItem = item;
    this.isOpen = false;
    this.searchTerm = '';

    this.onChange(item.value);
    this.onTouched();
    this.selectionChange.emit(item.value);
  }

  clearSelection(event: Event): void {
    event.stopPropagation();
    this.selectedItem = null;
    this.onChange(null);
    this.onTouched();
    this.selectionChange.emit(null);
  }

  onSearchInput(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    if (value === null || value === undefined) {
      this.selectedItem = null;
      return;
    }

    const foundItem = this.items.find(item => item.value === value);
    this.selectedItem = foundItem || null;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
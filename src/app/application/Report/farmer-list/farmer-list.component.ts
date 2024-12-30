import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-farmer-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './farmer-list.component.html',
  styleUrl: './farmer-list.component.css'
})
export class FarmerListComponent implements OnInit{

  hasData: boolean = true;

  searchText: string = '';

  constructor() { }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onSearch(){
    throw new Error('Method not implemented.');
  }

  offSearch(){}

  onPageChange(event: number) {
    // this.page = event;
    // this.fetchAllOfficers(this.page, this.itemsPerPage);
  }


}

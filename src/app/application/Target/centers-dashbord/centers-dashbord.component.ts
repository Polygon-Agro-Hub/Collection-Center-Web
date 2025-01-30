import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-centers-dashbord',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './centers-dashbord.component.html',
  styleUrl: './centers-dashbord.component.css'
})
export class CentersDashbordComponent implements OnInit {
  selectTable: string = 'collection';
  centerId!: number;


  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.centerId = this.route.snapshot.params['id'];
  }

  chooseTable(table: string) {
    this.selectTable = table;
  }

  navigatePath(path: string) {
    this.router.navigate([path]);
  }



}

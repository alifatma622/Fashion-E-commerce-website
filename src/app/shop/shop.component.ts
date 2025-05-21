import { ShopService } from './shop.service';
import { Component, OnInit } from '@angular/core';
import { IProduct } from '../shared/Models/Product';
import { ICategory } from '../shared/Models/Category';

@Component({
  selector: 'app-shop',
  standalone: false,
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  visibleCategories: ICategory[] = [];
  currentStart = 0;
  hoveredCat: ICategory | null = null;
  categories: ICategory[] = [];

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.getAllCategories();
  }

  // slider part
  updateVisibleCategories() {
    this.visibleCategories = this.categories.slice(this.currentStart, this.currentStart + 4);
  }

  nextSlide() {
    if (this.currentStart + 4 < this.categories.length) {
      this.currentStart++;
      this.updateVisibleCategories();
    }
  }

  prevSlide() {
    if (this.currentStart > 0) {
      this.currentStart--;
      this.updateVisibleCategories();
    }
  }

  getAllCategories() {
    this.shopService.getCategories().subscribe({
      next: (value: ICategory[]) => {
        this.categories = value;
        // Update visible categories after data is loaded
        this.updateVisibleCategories();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('Categories loaded successfully');
      }
    });
  }
}

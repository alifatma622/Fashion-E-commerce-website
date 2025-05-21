import { ShopService } from './shop.service';
import { Component, OnInit } from '@angular/core';
import { IProduct } from '../shared/Models/Product';
import { ICategory } from '../shared/Models/Category';
import { Ipagination } from '../shared/Models/Pagination';

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

  // Products
  
  selectedCategoryId: number | null = null;
  minPrice: number = 20;
  maxPrice: number = 250;
  selectedMinPrice: number = 20;
  selectedMaxPrice: number = 250;
  filterParms: any = {};
  products: IProduct[] = [];


  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllCategories();
    this.loadProducts();
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

// Category
  getAllCategories() {
    this.shopService.getCategories().subscribe({
      next: (value: ICategory[]) => {
        this.categories = value;
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

  // Products
   getAllProducts() {
  
    this.shopService.getProducts(this.filterParms).subscribe({
      next: (value: Ipagination) => {
        this.products = value.data;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  loadProducts(): void {
    this.shopService.getProductsWithoutFilter().subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error fetching products', error);
      }
    );
  }

  filterByCategory(cat: ICategory) {
    this.selectedCategoryId = cat.id;
    this.filterParms.CategoryId = cat.id;
    this.getAllProducts();
  }


  onPriceChange() {
    this.filterParms.MinPrice = this.selectedMinPrice;
    this.filterParms.MaxPrice = this.selectedMaxPrice;
    this.getAllProducts();
  }

  clearFilters() {
    this.selectedCategoryId = null;
    this.selectedMinPrice = this.minPrice;
    this.selectedMaxPrice = this.maxPrice;
    this.filterParms = {};
    this.getAllProducts();
  }
}

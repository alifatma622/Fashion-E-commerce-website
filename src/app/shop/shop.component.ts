import { Component, OnInit } from '@angular/core';
import { ShopService } from './shop.service';
import { IProduct } from '../shared/Models/Product';
import { ICategory } from '../shared/Models/Category';
import { Ipagination } from '../shared/Models/Pagination';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  standalone: false
})
export class ShopComponent implements OnInit {
  // Categories
  visibleCategories: ICategory[] = [];
  currentStart = 0;
  hoveredCat: ICategory | null = null;
  categories: ICategory[] = [];

  // Products
  selectedCategoryId: number | null = null;
  minPrice: number = 0;
  maxPrice: number = 1000;
  selectedMinPrice: number = 0;
  selectedMaxPrice: number = 1000;
  products: IProduct[] = [];
  filteredProducts: IProduct[] = [];
  pagination?: Ipagination;
  pageNumber = 1; // Current page number
  pageSize = 6;   // Number of products per page

  // Search
  searchQuery: string = '';

  // View options
  viewMode: 'grid' | 'list' | 'large-grid' | 'four-grid' = 'grid';

  // Sorting
  sortOption: string = 'default';

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.getAllCategories();
    this.loadProducts();
  }

  // Slider functionality
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

  // Category methods
  getAllCategories() {
    this.shopService.getCategories().subscribe({
      next: (value: ICategory[]) => {
        this.categories = value;
        this.updateVisibleCategories();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  // Products methods
  loadProducts(): void {
    this.shopService.getProducts(this.getFilterParams()).subscribe({
      next: (response: Ipagination) => {
        this.products = response.data;
        this.pagination = response;
        this.filteredProducts = [...this.products];
        this.applyAllFilters();
      },
      error: (error) => {
        console.error('Error fetching products', error);
      }
    });
  }

  // Helper method to get filter parameters
  private getFilterParams() {
    const params: any = {};

    params.pageNumber = this.pageNumber;
    params.pageSize = this.pageSize;

    if (this.selectedCategoryId) {
      params.categoryId = this.selectedCategoryId;
    }

    if (this.selectedMinPrice !== this.minPrice || this.selectedMaxPrice !== this.maxPrice) {
      params.minPrice = this.selectedMinPrice;
      params.maxPrice = this.selectedMaxPrice;
    }

    if (this.searchQuery.trim()) {
      params.search = this.searchQuery.trim();
    }

    return params;
  }

  // Filter methods
  filterByCategory(cat: ICategory | null) {
    this.selectedCategoryId = cat ? cat.id : null;
    this.loadProducts();
  }

  onPriceChange() {
    this.loadProducts();
  }

  clearFilters() {
    this.selectedCategoryId = null;
    this.selectedMinPrice = this.minPrice;
    this.selectedMaxPrice = this.maxPrice;
    this.searchQuery = '';
    this.sortOption = 'default';
    this.loadProducts();
  }

  // Search functionality
  onSearchChange() {
    this.loadProducts();
  }

  // Apply all filters and sorting
  applyAllFilters() {
    this.filteredProducts = this.products.filter(product => {
      const inPriceRange = product.newPrice >= this.selectedMinPrice && product.newPrice <= this.selectedMaxPrice;
      const matchesSearch = this.searchQuery.trim() ?
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchQuery.toLowerCase()) : true;

      return inPriceRange && matchesSearch;
    });

    this.applySorting(); // Apply sorting after filtering
  }

  // View mode functionality
  setViewMode(mode: 'grid' | 'list' | 'large-grid' | 'four-grid') {
    this.viewMode = mode;
  }

  // Sorting functionality
  onSortChange() {
    this.applySorting();
  }

  applySorting() {
    switch (this.sortOption) {
      case 'price-low-high':
        this.filteredProducts.sort((a, b) => a.newPrice - b.newPrice);
        break;
      case 'price-high-low':
        this.filteredProducts.sort((a, b) => b.newPrice - a.newPrice);
        break;
      case 'name-asc':
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Keep original order (server-side order)
        break;
    }
  }

  // أضف هذه الدالة إلى المكون
  getCategoryCount(categoryId: number): number {
    if (!categoryId) return this.products.length;
    return this.products.filter(p => p.categoryId === categoryId).length;
  }

  // Method to handle page changes
  onPageChange(newPage: number) {
    this.pageNumber = newPage;
    this.loadProducts();
  }
}

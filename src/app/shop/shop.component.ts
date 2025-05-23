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
    allProducts: IProduct[] = []; // Store all products for client-side operations
    pagination?: Ipagination;
    pageNumber = 1;
    pageSize = 6;
    searchQuery: string = '';
    viewMode: 'grid' | 'list' | 'large-grid' | 'four-grid' = 'grid';
    sortOption: string = 'default';
    currentPage = 1;
    totalPages = 1;
    totalCount = 0;

    constructor(private shopService: ShopService) { }

    ngOnInit(): void {
        this.getAllCategories();
        this.loadAllProducts(); // Load all products first
    }

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
                this.updateVisibleCategories();
            },
            error: (error) => {
                console.log(error);
            }
        });
    }

    // Load all products without pagination for client-side operations
    loadAllProducts(): void {
        // Load with a large page size to get all products
        const allProductsParams = {
            pageNumber: 1,
            pageSize: 1000 // Large number to get all products
        };

        this.shopService.getProducts(allProductsParams).subscribe({
            next: (response: Ipagination) => {
                this.allProducts = response.data;
                this.applyAllFilters(); // Apply filters after loading all products
            },
            error: (error) => {
                console.error('Error fetching all products', error);
            }
        });
    }

    private getFilterParams() {
        const params: any = {};
        params.pageNumber = this.pageNumber;
        params.pageSize = this.getPageSize();

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

    filterByCategory(cat: ICategory | null) {
        this.selectedCategoryId = cat ? cat.id : null;
        this.currentPage = 1; // Reset to first page
        this.applyAllFilters();
    }

    onPriceChange() {
        this.currentPage = 1; // Reset to first page
        this.applyAllFilters();
    }

    clearFilters() {
        this.selectedCategoryId = null;
        this.selectedMinPrice = this.minPrice;
        this.selectedMaxPrice = this.maxPrice;
        this.searchQuery = '';
        this.sortOption = 'default';
        this.currentPage = 1;
        this.applyAllFilters();
    }

    onSearchChange() {
        this.currentPage = 1;
        this.applyAllFilters();
    }

    applyAllFilters() {
        // Start with all products
        let filtered = [...this.allProducts];

        // Apply category filter
        if (this.selectedCategoryId) {
            filtered = filtered.filter(product => product.categoryId === this.selectedCategoryId);
        }

        // Apply price filter
        filtered = filtered.filter(product =>
            product.newPrice >= this.selectedMinPrice && product.newPrice <= this.selectedMaxPrice
        );

        // Apply search filter
        if (this.searchQuery.trim()) {
            const searchTerm = this.searchQuery.toLowerCase();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
        }

        // Apply sorting
        this.applySortingToArray(filtered);

        // Update total count and pages
        this.totalCount = filtered.length;
        this.totalPages = Math.ceil(this.totalCount / this.getPageSize());

        // Apply pagination (client-side)
        const startIndex = (this.currentPage - 1) * this.getPageSize();
        const endIndex = startIndex + this.getPageSize();
        this.filteredProducts = filtered.slice(startIndex, endIndex);

        // Update products array for display
        this.products = this.filteredProducts;
    }

    applySortingToArray(products: IProduct[]) {
        switch (this.sortOption) {
            case 'price-low-high':
                products.sort((a, b) => a.newPrice - b.newPrice);
                break;
            case 'price-high-low':
                products.sort((a, b) => b.newPrice - a.newPrice);
                break;
            case 'name-asc':
                products.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                products.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                break;
        }
    }

    setViewMode(mode: 'grid' | 'list' | 'large-grid' | 'four-grid') {
        this.viewMode = mode;
        // Recalculate pagination based on new page size
        this.totalPages = Math.ceil(this.totalCount / this.getPageSize());
        if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages || 1;
        }
        this.applyAllFilters();
    }

    onSortChange() {
        this.applyAllFilters();
    }

    getCategoryCount(categoryId: number): number {
        if (!categoryId) return this.allProducts.length;
        return this.allProducts.filter(p => p.categoryId === categoryId).length;
    }

    onPageChange(newPage: number) {
        this.currentPage = newPage;
        this.applyAllFilters();
    }

    getResultsText(): string {
        if (this.totalCount === 0) return 'No results found';

        const start = ((this.currentPage - 1) * this.getPageSize()) + 1;
        const end = Math.min(this.currentPage * this.getPageSize(), this.totalCount);

        return `Showing ${start}-${end} of ${this.totalCount} results`;
    }

    // Product actions
    quickView(product: IProduct) {
        console.log('Quick view for product:', product);
    }

    addToWishlist(product: IProduct) {
        console.log('Added to wishlist:', product);
    }

    addToCompare(product: IProduct) {
        console.log('Added to compare:', product);
    }

    addToCart(product: IProduct) {
        console.log('Added to cart:', product);
    }

    // Pagination methods
    getPageNumbers(): number[] {
        const pages: number[] = [];
        const maxPagesToShow = 5;

        let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow && endPage === this.totalPages) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    }

    goToPage(page: number) {
        this.currentPage = page;
        this.applyAllFilters();
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.applyAllFilters();
        }
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.applyAllFilters();
        }
    }

    resetFilters() {
        this.clearFilters();
    }

    getPageSize(): number {
        return this.viewMode === 'four-grid' ? 8 : 6;
    }
}

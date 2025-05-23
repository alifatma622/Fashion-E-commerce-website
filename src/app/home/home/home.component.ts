import { Component, OnInit, OnDestroy } from '@angular/core';
import { ICategory } from '../../shared/Models/Category';
import { IProduct } from '../../shared/Models/Product';
import { ShopService } from "../../shop/shop.service";
import { Router } from '@angular/router';

// بيانات المراجعة
export interface Testimonial {
  id: number;
  name: string;
  title: string;
  text: string;
  avatar: string;
  rating: number;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [ShopService]
})

export class HomeComponent implements OnInit, OnDestroy {
    categories: ICategory[] = [];
    productsByCategory: { [key: number]: IProduct[] } = {};

    // المتغيرات الأساسية
    currentSlide = 0; // الشريحة الحالية (بتبدأ من 0)
    isAutoplayActive = false; // التشغيل التلقائي شغال؟
    autoplayTimer: any; // المؤقت للتشغيل التلقائي

    // بيانات المراجعات
    testimonials: Testimonial[] = [
        {
            id: 1,
            name: 'Luca Moretti',
            title: 'Designer',
            text: 'If You\'re Looking For Luxury Products And Professional Service, Look No Further. I Had A Great Experience While Purchasing My IWC Luxury Watch.',
            avatar: 'assets/l8.jpg',
            rating: 5
        },
        {
            id: 2,
            name: 'Sarah Johnson',
            title: 'Fashion Blogger',
            text: 'Absolutely stunning quality and exceptional customer service. The attention to detail in every product is remarkable.',
            avatar: 'assets/l7.jpg',
            rating: 5
        },
        {
            id: 3,
            name: 'Michael Chen',
            title: 'Business Owner',
            text: 'Premium products with premium service. The team went above and beyond to ensure I found exactly what I was looking for.',
            avatar: 'assets/l5.jpg',
            rating: 4
        }
    ];

    // Placeholder for authentication status
    isLoggedIn: boolean = false;

    constructor(private shopService: ShopService, private router: Router) { }

    ngOnInit(): void {
        this.loadCategories();
        // Simulate authentication check
        if (this.isLoggedIn) {
            this.router.navigate(['/shop']);
        }
        this.startAutoplay();
    }

    ngOnDestroy(): void {
        // إيقاف التشغيل التلقائي لما المكون يتشال من الصفحة
        this.stopAutoplay();
    }

    loadCategories(): void {
        this.shopService.getCategories().subscribe({
            next: (categories: ICategory[]) => {
                this.categories = categories;
            },
            error: (error: any) => {
                console.error('Error fetching categories', error);
            }
        });
    }

    // الذهاب لشريحة معينة (لما أدوس على النقط)
    goToSlide(slideIndex: number): void {
        this.currentSlide = slideIndex;
        this.restartAutoplay(); // إعادة تشغيل العداد التلقائي
    }

    // الذهاب للشريحة اللي بعدها
    nextSlide(): void {
        // لو وصلت لآخر شريحة، ارجع للأولى
        if (this.currentSlide < this.testimonials.length - 1) {
            this.currentSlide++;
        } else {
            this.currentSlide = 0;
        }
    }

    // الذهاب للشريحة اللي قبلها
    previousSlide(): void {
        // لو في الشريحة الأولى، اذهب للأخيرة
        if (this.currentSlide > 0) {
            this.currentSlide--;
        } else {
            this.currentSlide = this.testimonials.length - 1;
        }
    }

    // بدء التشغيل التلقائي
    startAutoplay(): void {
        this.isAutoplayActive = true;

        // كل 5 ثوان اعمل nextSlide
        this.autoplayTimer = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    // إيقاف التشغيل التلقائي
    stopAutoplay(): void {
        this.isAutoplayActive = false;

        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
    }

    // تشغيل/إيقاف التشغيل التلقائي
    toggleAutoplay(): void {
        if (this.isAutoplayActive) {
            this.stopAutoplay();
        } else {
            this.startAutoplay();
        }
    }

    // إعادة تشغيل العداد التلقائي (لما المستخدم يتفاعل مع الslider)
    restartAutoplay(): void {
        this.stopAutoplay();

        // استنى ثانية واحدة وبعدين اشتغل تاني
        setTimeout(() => {
            this.startAutoplay();
        }, 1000);
    }

    // عمل مصفوفة من الأرقام عشان النجوم (1,2,3,4,5)
    getStarsArray(rating: number): number[] {
        return [1, 2, 3, 4, 5];
    }

 // hero-section.component.ts
  onShopNow(): void {
   this.router.navigate(['/shop']);
  }
}

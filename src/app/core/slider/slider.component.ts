import { Component, AfterViewInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import Swiper from 'swiper';
import { Autoplay, Navigation, EffectFade } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';

// Register Swiper modules
Swiper.use([Autoplay, Navigation, EffectFade]);


@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class SliderComponent implements AfterViewInit, OnDestroy {
  private swiper?: Swiper;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initSwiper();
    }
  }

  ngOnDestroy(): void {
    if (this.swiper) {
      this.swiper.destroy(true, true);
    }
  }

  private initSwiper(): void {
    const swiperOptions: SwiperOptions = {
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      loop: true,
      speed: 1000,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
    };

    this.swiper = new Swiper('.swiper', swiperOptions);
  }
}

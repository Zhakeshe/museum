(function($) {
    'use strict';
    
    $(document).ready(function() {
        
        // Инициализация Swiper - КАРУСЕЛЬ
        if (typeof Swiper !== 'undefined' && $('.news-gallery-swiper').length) {
            $('.news-gallery-swiper').each(function() {
                var $this = $(this);
                var $counter = $this.closest('.news-gallery-wrapper').find('.news-gallery-current');
                
                new Swiper(this, {
                    slidesPerView: 1,
                    spaceBetween: 15,
                    loop: false, // УБРАЛИ loop чтобы не было дублирования
                    navigation: {
                        nextEl: $this.find('.news-gallery-next')[0],
                        prevEl: $this.find('.news-gallery-prev')[0],
                    },
                    pagination: {
                        el: $this.find('.news-gallery-pagination')[0],
                        clickable: true,
                    },
                    breakpoints: {
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 15,
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 15,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 20,
                        },
                    },
                    on: {
                        slideChange: function() {
                            // realIndex для обычного режима (без loop)
                            $counter.text(this.activeIndex + 1);
                        }
                    }
                });
            });
        }
        
        // Инициализация Fancybox ПОСЛЕ Swiper
        if (typeof Fancybox !== 'undefined') {
            Fancybox.bind('[data-fancybox^="news-gallery"]', {
                Thumbs: {
                    type: 'classic',
                },
                Toolbar: {
                    display: {
                        left: ['infobar'],
                        middle: [],
                        right: ['zoomIn', 'zoomOut', 'close'],
                    },
                },
            });
        }
        
    });
    
})(jQuery);
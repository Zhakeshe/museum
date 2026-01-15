/**
 * JavaScript для карточки музея
 * Файл: js/museum-card.js
 */

(function($) {
    'use strict';

    // Переменные для автопроигрывания
    var autoplayInterval = null;
    var autoplayDelay = 5000; // 5 секунд
    var currentIndex = 0;
    var totalImages = 0;
    var thumbsSwiper = null;

    $(document).ready(function() {
        initMuseumGallery();
        initMuseumCarousels();
        initFancybox();
        initViewAllLinks();
    });

    /**
     * Обработка ссылок "Посмотреть все" - запись museum ID в cookie
     */
    function initViewAllLinks() {
        const viewAllLinks = document.querySelectorAll('.museum-view-all');
        
        viewAllLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const museumId = this.dataset.museumId;
                const filterType = this.dataset.filterType;
                
                if (museumId && filterType) {
                    // Записываем в cookie (живёт 1 минуту - достаточно для перехода)
                    document.cookie = filterType + '_museum_filter=' + museumId + '; path=/; max-age=60';
                }
            });
        });
    }

    /**
     * Инициализация галереи изображений
     */
    function initMuseumGallery() {
        const thumbsContainer = document.querySelector('.museum-thumbs-swiper');
        const thumbs = document.querySelectorAll('.museum-thumb');
        const mainImg = document.getElementById('museum-main-img');
        const mainLink = document.querySelector('.museum-main-image');
        const counter = document.querySelector('.museum-gallery-counter .current');
        const galleryMain = document.querySelector('.museum-gallery-main');

        if (!mainImg) return;

        totalImages = thumbs.length || 1;

        // Swiper для превью
        if (thumbsContainer) {
            thumbsSwiper = new Swiper('.museum-thumbs-swiper', {
                slidesPerView: 'auto',
                spaceBetween: 10,
                freeMode: true,
                watchSlidesProgress: true,
                navigation: {
                    nextEl: '.museum-thumbs-next',
                    prevEl: '.museum-thumbs-prev',
                },
                breakpoints: {
                    320: { slidesPerView: 4 },
                    480: { slidesPerView: 5 },
                    768: { slidesPerView: 6 },
                    1024: { slidesPerView: 8 }
                }
            });
        }

        /**
         * Смена изображения с анимацией
         */
        function changeImage(index, animate) {
            if (index < 0 || index >= totalImages) return;
            if (!thumbs[index]) return;

            const fullUrl = thumbs[index].dataset.full;
            currentIndex = index;

            if (animate) {
                // Анимация fade out
                mainImg.classList.add('fade-out');
                mainImg.classList.remove('fade-in');

                setTimeout(function() {
                    mainImg.src = fullUrl;
                    if (mainLink) mainLink.href = fullUrl;

                    // Анимация fade in
                    mainImg.classList.remove('fade-out');
                    mainImg.classList.add('fade-in');
                }, 300);
            } else {
                mainImg.src = fullUrl;
                if (mainLink) mainLink.href = fullUrl;
            }

            // Обновляем активный класс
            thumbs.forEach(t => t.classList.remove('active'));
            thumbs[index].classList.add('active');

            // Обновляем счётчик
            if (counter) {
                counter.textContent = index + 1;
            }

            // Прокручиваем превью к активному
            if (thumbsSwiper) {
                thumbsSwiper.slideTo(Math.max(0, index - 2));
            }
        }

        /**
         * Следующее изображение
         */
        function nextImage() {
            var next = (currentIndex + 1) % totalImages;
            changeImage(next, true);
        }

        /**
         * Запуск автопроигрывания
         */
        function startAutoplay() {
            stopAutoplay();
            if (totalImages > 1) {
                autoplayInterval = setInterval(nextImage, autoplayDelay);
            }
        }

        /**
         * Остановка автопроигрывания
         */
        function stopAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
                autoplayInterval = null;
            }
        }

        // Клик по превью
        thumbs.forEach(function(thumb, index) {
            thumb.addEventListener('click', function() {
                changeImage(index, true);
                // Перезапуск автопроигрывания после ручного выбора
                startAutoplay();
            });
        });

        // Пауза при наведении на галерею
        if (galleryMain) {
            galleryMain.addEventListener('mouseenter', stopAutoplay);
            galleryMain.addEventListener('mouseleave', startAutoplay);
        }

        // Пауза при наведении на превью
        if (thumbsContainer) {
            thumbsContainer.addEventListener('mouseenter', stopAutoplay);
            thumbsContainer.addEventListener('mouseleave', startAutoplay);
        }

        // Запуск автопроигрывания
        startAutoplay();

        // Остановка при открытии Fancybox
        document.addEventListener('click', function(e) {
            if (e.target.closest('[data-fancybox="museum-gallery"]')) {
                stopAutoplay();
            }
        });

        // ВАЖНО: Синхронизация с Fancybox
        // Когда пользователь листает в Fancybox, обновляем превью
        window.fancyboxChangeCallback = function(fancyboxIndex) {
            changeImage(fancyboxIndex, false);
        };
    }

    /**
     * Инициализация каруселей экспонатов, моделей, новостей
     */
    function initMuseumCarousels() {
        
        // Карусель экспонатов
        if (document.querySelector('.museum-exhibits-swiper')) {
            new Swiper('.museum-exhibits-swiper', {
                slidesPerView: 1,
                spaceBetween: 20,
                navigation: {
                    nextEl: '.museum-exhibits-next',
                    prevEl: '.museum-exhibits-prev',
                },
                breakpoints: {
                    480: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 }
                }
            });
        }

        // Карусель 3D моделей
        if (document.querySelector('.museum-models-swiper')) {
            new Swiper('.museum-models-swiper', {
                slidesPerView: 1,
                spaceBetween: 20,
                navigation: {
                    nextEl: '.museum-models-next',
                    prevEl: '.museum-models-prev',
                },
                breakpoints: {
                    480: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 }
                }
            });
        }

        // Карусель новостей
        if (document.querySelector('.museum-news-swiper')) {
            new Swiper('.museum-news-swiper', {
                slidesPerView: 1,
                spaceBetween: 20,
                navigation: {
                    nextEl: '.museum-news-next',
                    prevEl: '.museum-news-prev',
                },
                breakpoints: {
                    480: { slidesPerView: 2 },
                    768: { slidesPerView: 3 }
                }
            });
        }
    }

    /**
     * Инициализация Fancybox
     */
    function initFancybox() {
        if (typeof Fancybox !== 'undefined') {
            
            // Галерея изображений музея
            Fancybox.bind('[data-fancybox="museum-gallery"]', {
                Thumbs: {
                    type: 'classic',
                },
                Toolbar: {
                    display: {
                        left: ['infobar'],
                        middle: [],
                        right: ['close'],
                    },
                },
                // ВАЖНО: Отслеживаем смену слайда в Fancybox
                on: {
                    change: (fancybox, slide) => {
                        const currentIndex = slide.index;
                        // Вызываем callback для обновления превью
                        if (window.fancyboxChangeCallback) {
                            window.fancyboxChangeCallback(currentIndex);
                        }
                    }
                }
            });

            // Виртуальный тур (iframe)
            Fancybox.bind('[data-fancybox="tours"]', {
                type: 'iframe',
                iframe: {
                    css: {
                        width: '1200px',
                        height: '500px'
                    },
                    preload: false
                },
                Toolbar: {
                    display: {
                        left: [],
                        middle: [],
                        right: ['close'],
                    },
                }
            });
        }
    }

})(jQuery);
/**
 * Fallback для изображений экспонатов
 * Файл: js/exhibit-img-fallback.js
 */

(function($) {
    'use strict';
    
    // Глобальная инициализация
    window.initImageFallbacks = function(container) {
        const $container = container ? $(container) : $(document);
        
        $container.find('img.exhibit-fallback-img[data-fallback-images]').each(function() {
            const $img = $(this);
            setupImageFallback($img);
        });
    };
    
    $(document).ready(function() {
        window.initImageFallbacks();
    });
    
    /**
     * Настройка fallback для одного изображения
     */
    function setupImageFallback($img) {
        // Проверяем что обработчик еще не установлен
        if ($img.data('fallback-setup')) {
            return;
        }
        $img.data('fallback-setup', true);
        
        const fallbackData = $img.attr('data-fallback-images');
        
        let imageUrls = [];
        try {
            imageUrls = JSON.parse(fallbackData);
        } catch(e) {
            return;
        }
        
        if (!imageUrls || imageUrls.length <= 1) {
            return; // Нет fallback вариантов
        }
        
        // Убираем старый обработчик если был
        $img.off('error.fallback');
        
        // Новый обработчик
        $img.on('error.fallback', function() {
            tryNextImage($img, imageUrls);
        });
        
        // Проверяем что первое изображение вообще начало загружаться
        checkImageLoaded($img, imageUrls);
    }
    
    /**
     * Проверка что изображение начало загружаться
     */
    function checkImageLoaded($img, imageUrls) {
        // Если изображение уже загружено - всё ок
        if ($img[0].complete && $img[0].naturalHeight !== 0) {
            return;
        }
        
        // Если изображение не загрузилось за 5 секунд - пробуем следующее
        setTimeout(function() {
            if (!$img[0].complete || $img[0].naturalHeight === 0) {
                console.log('Image not loaded after 5s, trying next');
                tryNextImage($img, imageUrls);
            }
        }, 5000);
    }
    
    /**
     * Попытка загрузить следующее изображение
     */
    function tryNextImage($img, imageUrls) {
        let currentIndex = parseInt($img.attr('data-fallback-index') || 0);
        currentIndex++;
        
        if (currentIndex < imageUrls.length) {
            console.log('Trying fallback image', currentIndex + 1, 'of', imageUrls.length);
            
            $img.attr('data-fallback-index', currentIndex);
            $img.attr('src', imageUrls[currentIndex]);
        } else {
            // Все изображения не загрузились
            console.log('All images failed, showing placeholder');
            
            const noPhotoUrl = 'https://placehold.co/400x300/e5e7eb/9ca3af?text=No+photo';
            $img.attr('src', noPhotoUrl);
            $img.off('error.fallback'); // Убираем обработчик
        }
    }
    
    // Для Elementor Loop - повторная инициализация
    $(window).on('elementor/frontend/init', function() {
        if (typeof elementorFrontend !== 'undefined') {
            elementorFrontend.hooks.addAction('frontend/element_ready/widget', function($scope) {
                setTimeout(function() {
                    window.initImageFallbacks($scope);
                }, 100);
            });
        }
    });
    
    // Для Swiper - инициализация при смене слайда
    $(document).on('click', '.swiper-button-next, .swiper-button-prev, .swiper-pagination-bullet', function() {
        setTimeout(function() {
            window.initImageFallbacks();
        }, 300);
    });
    
    // MutationObserver для динамически добавленных элементов
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                            const $node = $(node);
                            if ($node.find('.exhibit-fallback-img').length > 0) {
                                setTimeout(function() {
                                    window.initImageFallbacks($node);
                                }, 100);
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
})(jQuery);
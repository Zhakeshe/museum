(function($) {
    'use strict';
    
    $(document).ready(function() {
        initExhibitGallery();
        initFancybox();
    });
    
    /**
     * Инициализация галереи экспоната
     */
    function initExhibitGallery() {
        const $container = $('.exhibit-image-column[data-images]');
        if (!$container.length) return;
        
        const imagesData = $container.attr('data-images');
        const noPhotoText = $container.attr('data-no-photo-text') || 'No photo';
        const postTitle = $container.attr('data-post-title') || '';
        
        let imageUrls = [];
        try {
            imageUrls = JSON.parse(imagesData);
        } catch(e) {
            console.error('Error parsing images data:', e);
            showNoImage($container, noPhotoText);
            return;
        }
        
        if (!imageUrls || imageUrls.length === 0) {
            showNoImage($container, noPhotoText);
            return;
        }
        
        // Асинхронная проверка изображений
        checkImagesAsync(imageUrls, function(validImages) {
            if (validImages.length === 0) {
                showNoImage($container, noPhotoText);
            } else {
                buildGallery($container, validImages, postTitle);
            }
        });
    }
    
    /**
     * Асинхронная проверка массива изображений
     */
    function checkImagesAsync(urls, callback) {
        const validImages = [];
        let checkedCount = 0;
        
        urls.forEach(function(url, index) {
            const img = new Image();
            
            img.onload = function() {
                validImages.push({
                    url: url,
                    index: index
                });
                checkComplete();
            };
            
            img.onerror = function() {
                checkComplete();
            };
            
            // Timeout на случай зависших запросов
            setTimeout(function() {
                if (!img.complete) {
                    img.src = ''; // Отменяем загрузку
                    checkComplete();
                }
            }, 5000); // 5 секунд на изображение
            
            img.src = url;
        });
        
        function checkComplete() {
            checkedCount++;
            if (checkedCount === urls.length) {
                // Сортируем по исходному индексу
                validImages.sort((a, b) => a.index - b.index);
                callback(validImages.map(item => item.url));
            }
        }
    }
    
    /**
     * Построение галереи из валидных изображений
     */
    function buildGallery($container, images, postTitle) {
        const $loader = $container.find('.exhibit-image-loader');
        const $mainContainer = $container.find('#exhibit-main-image-container');
        const $galleryLinks = $container.find('#exhibit-gallery-links');
        
        // Главное изображение
        const mainImageHtml = `
            <a href="${escapeHtml(images[0])}" 
               data-fancybox="exhibit-gallery" 
               data-elementor-open-lightbox="no" 
               class="exhibit-main-image">
                <img src="${escapeHtml(images[0])}" alt="${escapeHtml(postTitle)}">
                <span class="zoom-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.3-4.3"/>
                        <path d="M11 8v6M8 11h6"/>
                    </svg>
                </span>
            </a>
        `;
        
        $mainContainer.html(mainImageHtml);
        
        // Скрытые ссылки для галереи
        if (images.length > 1) {
            let galleryHtml = '';
            for (let i = 1; i < images.length; i++) {
                galleryHtml += `
                    <a href="${escapeHtml(images[i])}" 
                       data-fancybox="exhibit-gallery" 
                       data-elementor-open-lightbox="no" 
                       style="display:none;"></a>
                `;
            }
            $galleryLinks.html(galleryHtml);
        }
        
        // Убираем loader
        $loader.fadeOut(300);
        
        // Показываем галерею
        $mainContainer.fadeIn(300);
    }
    
    /**
     * Показать placeholder если нет изображений
     */
    function showNoImage($container, noPhotoText) {
        const $loader = $container.find('.exhibit-image-loader');
        const $mainContainer = $container.find('#exhibit-main-image-container');
        
        const placeholderUrl = `https://placehold.co/600x400/e5e7eb/9ca3af?text=${encodeURIComponent(noPhotoText)}`;
        
        const noImageHtml = `
            <div class="exhibit-no-image">
                <img src="${escapeHtml(placeholderUrl)}" alt="${escapeHtml(noPhotoText)}">
            </div>
        `;
        
        $mainContainer.html(noImageHtml);
        $loader.fadeOut(300);
        $mainContainer.fadeIn(300);
    }
    
    /**
     * Инициализация Fancybox
     */
    function initFancybox() {
        if (typeof Fancybox !== 'undefined') {
            Fancybox.bind('[data-fancybox="exhibit-gallery"]', {
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
    }
    
    /**
     * Экранирование HTML
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
})(jQuery);
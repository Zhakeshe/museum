(function($) {
    'use strict';
    
    // Глобальная функция для инициализации (доступна извне)
    window.initExhibitCards = function(container) {
        const $container = container ? $(container) : $(document);
        
        $container.find('.exhibit-card[data-exhibit-images]').each(function() {
            const $card = $(this);
            
            // Пропускаем уже инициализированные карточки
            if ($card.data('exhibit-initialized')) {
                return;
            }
            $card.data('exhibit-initialized', true);
            
            checkAndLoadImage($card);
        });
    };
    
    $(document).ready(function() {
        window.initExhibitCards();
    });
    
    /**
     * Проверка и загрузка изображения для карточки
     */
    function checkAndLoadImage($card) {
        const imagesData = $card.attr('data-exhibit-images');
        const noPhotoText = $card.attr('data-no-photo') || 'No+photo';
        
        let imageUrls = [];
        try {
            imageUrls = JSON.parse(imagesData);
        } catch(e) {
            showPlaceholder($card, noPhotoText);
            return;
        }
        
        if (!imageUrls || imageUrls.length === 0) {
            showPlaceholder($card, noPhotoText);
            return;
        }
        
        // Проверяем изображения по порядку
        checkImagesSequentially(imageUrls, 0, function(validUrl) {
            if (validUrl) {
                showImage($card, validUrl);
            } else {
                showPlaceholder($card, noPhotoText);
            }
        });
    }
    
    /**
     * Последовательная проверка изображений (первое рабочее)
     */
    function checkImagesSequentially(urls, index, callback) {
        if (index >= urls.length) {
            callback(null); // Нет рабочих изображений
            return;
        }
        
        const img = new Image();
        const timeout = setTimeout(function() {
            img.src = ''; // Отменяем загрузку
            checkImagesSequentially(urls, index + 1, callback); // Пробуем следующее
        }, 12000); // 3 секунды на каждое изображение
        
        img.onload = function() {
            clearTimeout(timeout);
            callback(urls[index]); // Нашли рабочее!
        };
        
        img.onerror = function() {
            clearTimeout(timeout);
            checkImagesSequentially(urls, index + 1, callback); // Пробуем следующее
        };
        
        img.src = urls[index];
    }
    
    /**
     * Показать изображение
     */
    function showImage($card, imageUrl) {
        const $loader = $card.find('.exhibit-card-loader');
        const $container = $card.find('.exhibit-card-image-container');
        
        const imgHtml = `<img src="${escapeHtml(imageUrl)}" alt="">`;
        $container.html(imgHtml);
        
        $loader.fadeOut(200);
        $container.fadeIn(300);
    }
    
    /**
     * Показать placeholder
     */
    function showPlaceholder($card, noPhotoText) {
        const $loader = $card.find('.exhibit-card-loader');
        const $container = $card.find('.exhibit-card-image-container');
        
        const placeholderUrl = `https://placehold.co/400x300/e5e7eb/9ca3af?text=📸`;
        const imgHtml = `<img src="${escapeHtml(placeholderUrl)}" alt="${noPhotoText}">`;
        
        $container.html(imgHtml);
        $loader.fadeOut(200);
        $container.fadeIn(300);
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



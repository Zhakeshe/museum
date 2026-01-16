/**
 * JavaScript для интерактивной карты музеев Казахстана
 * Файл: js/kz-museums-map.js
 */

(function($) {
    'use strict';

    // Переменные карусели
    let kzCurrentSlide = 0;
    let kzCurrentRegionId = null;
    let kzVisibleCards = 4;
    let kzMuseumsCache = {};
    let kzTargetMuseumId = null; // ID музея для скролла

    // Ждём загрузки DOM
    $(document).ready(function() {
        checkMuseumReturnCookie(); // НОВОЕ: Проверяем cookie
        loadSvgMap();
        initKzMuseumsCarousel();
        initMobileSelect();
    });

    /**
     * НОВАЯ ФУНКЦИЯ: Проверка cookie при возврате из breadcrumbs
     */
    function checkMuseumReturnCookie() {
        const cookie = getCookie('kz_museum_return');
        
        if (!cookie) return;
        
        // Удаляем cookie сразу (работает только один раз)
        deleteCookie('kz_museum_return');
        
        // Парсим cookie: museumId|regionCode
        const parts = cookie.split('|');
        if (parts.length !== 2) return;
        
        const museumId = parts[0];
        const regionCode = parts[1];
        
        if (!regionCode) return;
        
        // Сохраняем ID музея для скролла
        kzTargetMuseumId = museumId;
        
        // Активируем регион и открываем карусель после загрузки карты
        setTimeout(function() {
            if (typeof window.updateRegionInfo === 'function') {
                window.updateRegionInfo(regionCode);
                
                // Открываем карусель после небольшой задержки
                setTimeout(function() {
                    showKzMapDetails();
                }, 300);
            }
        }, 500);
    }

    /**
     * ВСПОМОГАТЕЛЬНАЯ: Получить cookie
     */
    function getCookie(name) {
        const matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : null;
    }

    /**
     * ВСПОМОГАТЕЛЬНАЯ: Удалить cookie
     */
    function deleteCookie(name) {
        document.cookie = name + '=; path=/; max-age=0';
    }

    /**
     * Загрузка SVG карты
     */
    function loadSvgMap() {
        if (typeof kzMapSvgPath === 'undefined') return;
        
        fetch(kzMapSvgPath)
            .then(response => response.text())
            .then(svgCode => {
                const container = document.getElementById('kz-map-container');
                if (container) {
                    container.innerHTML = svgCode;
                    // Инициализация карты после загрузки SVG
                    setTimeout(initKzMap, 100);
                }
            })
            .catch(error => {
                console.error('Ошибка загрузки SVG карты:', error);
            });
    }

    /**
     * Инициализация мобильного выпадающего списка
     */
    function initMobileSelect() {
        const select = document.getElementById('kzMobileRegionSelect');
        if (!select) return;

        select.addEventListener('change', function() {
            const regionId = this.value;
            if (regionId) {
                updateRegionInfo(regionId);
            }
        });
    }

    /**
     * Инициализация карты и списка регионов
     */
    function initKzMap() {
        const infoPanel = document.getElementById('kzRegionInfo');
        if (!infoPanel) {
            setTimeout(initKzMap, 100);
            return;
        }

        const allRegions = document.querySelectorAll('#features path, #features circle');
        const allLabels = document.querySelectorAll('#kz-map-labels text');
        const allListItems = document.querySelectorAll('.kz-region-item');
        
        const regionNameEl = infoPanel.querySelector('.kz-map-region-name');
        const regionDescEl = infoPanel.querySelector('.kz-map-region-desc');
        const museumsCountEl = infoPanel.querySelector('.kz-map-count-number');
        const detailsBtn = document.getElementById('kzDetailsBtn');

        /**
         * Обновление информации о регионе
         */
        window.updateRegionInfo = function(regionId) {
            if (typeof kzRegionsData === 'undefined') return;
            
            const data = kzRegionsData[regionId];
            if (!data) return;

            kzCurrentRegionId = regionId;

            // Убираем активные классы
            allRegions.forEach(r => r.classList.remove('kz-map-region-active'));
            allLabels.forEach(l => l.classList.remove('kz-map-text-active'));
            allListItems.forEach(item => item.classList.remove('kz-region-item--active'));

            // Активируем регион на карте
            const selectedRegion = document.getElementById(regionId);
            if (selectedRegion) {
                selectedRegion.classList.add('kz-map-region-active');
            }

            // Активируем текстовую метку
            const selectedLabel = document.querySelector('#kz-map-labels [data-region-id="' + regionId + '"]');
            if (selectedLabel) {
                selectedLabel.classList.add('kz-map-text-active');
            }

            // Активируем элемент в списке
            const selectedListItem = document.querySelector('.kz-region-item[data-region="' + regionId + '"]');
            if (selectedListItem) {
                selectedListItem.classList.add('kz-region-item--active');
            }

            // Синхронизация с мобильным select
            const mobileSelect = document.getElementById('kzMobileRegionSelect');
            if (mobileSelect && mobileSelect.value !== regionId) {
                mobileSelect.value = regionId;
            }

            // Обновляем информацию
            if (regionNameEl) regionNameEl.textContent = data.name;
            if (regionDescEl) regionDescEl.textContent = data.description;
            if (museumsCountEl) museumsCountEl.textContent = data.museums;

            // Показываем/скрываем кнопку
            if (detailsBtn) {
                detailsBtn.style.display = data.museums > 0 ? 'inline-block' : 'none';
            }

            // Показываем панель
            if (infoPanel) infoPanel.classList.add('kz-map-active');
        }

        // Обработчики для регионов на карте
        allRegions.forEach(region => {
            const regionId = region.getAttribute('id');
            
            region.addEventListener('click', function() {
                updateRegionInfo(regionId);
            });

            // Hover эффекты
            region.addEventListener('mouseenter', function() {
                const listItem = document.querySelector('.kz-region-item[data-region="' + regionId + '"]');
                if (listItem) listItem.classList.add('kz-region-item--hover');
            });

            region.addEventListener('mouseleave', function() {
                const listItem = document.querySelector('.kz-region-item[data-region="' + regionId + '"]');
                if (listItem) listItem.classList.remove('kz-region-item--hover');
            });

            // Tooltip
            if (typeof kzRegionsData !== 'undefined' && kzRegionsData[regionId]) {
                region.setAttribute('title', kzRegionsData[regionId].name);
            }
        });

        // Обработчики для текстовых меток
        allLabels.forEach(label => {
            const regionId = label.getAttribute('data-region-id');
            
            label.addEventListener('click', function() {
                updateRegionInfo(regionId);
            });

            label.addEventListener('mouseenter', function() {
                const listItem = document.querySelector('.kz-region-item[data-region="' + regionId + '"]');
                if (listItem) listItem.classList.add('kz-region-item--hover');
            });

            label.addEventListener('mouseleave', function() {
                const listItem = document.querySelector('.kz-region-item[data-region="' + regionId + '"]');
                if (listItem) listItem.classList.remove('kz-region-item--hover');
            });
        });

        // Обработчики для списка регионов
        allListItems.forEach(item => {
            const regionId = item.getAttribute('data-region');
            
            item.addEventListener('click', function() {
                updateRegionInfo(regionId);
            });

            // Hover на карте при наведении на список
            item.addEventListener('mouseenter', function() {
                const mapRegion = document.getElementById(regionId);
                if (mapRegion) mapRegion.classList.add('kz-map-region-hover');
                
                const mapLabel = document.querySelector('#kz-map-labels [data-region-id="' + regionId + '"]');
                if (mapLabel) mapLabel.classList.add('kz-map-text-hover');
            });

            item.addEventListener('mouseleave', function() {
                const mapRegion = document.getElementById(regionId);
                if (mapRegion) mapRegion.classList.remove('kz-map-region-hover');
                
                const mapLabel = document.querySelector('#kz-map-labels [data-region-id="' + regionId + '"]');
                if (mapLabel) mapLabel.classList.remove('kz-map-text-hover');
            });
        });

        // Обработчик кнопки "Подробнее"
        if (detailsBtn) {
            detailsBtn.addEventListener('click', showKzMapDetails);
        }

        // Активируем первый регион при загрузке (если есть музеи)
        const firstRegionWithMuseums = Object.keys(kzRegionsData).find(key => kzRegionsData[key].museums > 0);
        if (firstRegionWithMuseums) {
            updateRegionInfo(firstRegionWithMuseums);
        }
    }

    /**
     * Инициализация карусели
     */
    function initKzMuseumsCarousel() {
        const carousel = document.getElementById('kzMuseumsCarousel');
        const closeBtn = document.getElementById('kzCarouselClose');
        const prevBtn = document.getElementById('kzCarouselPrev');
        const nextBtn = document.getElementById('kzCarouselNext');

        if (!carousel) return;

        // Закрытие
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                carousel.classList.remove('kz-museums-carousel--active');
            });
        }

        // Закрытие по клику вне карусели
        document.addEventListener('click', function(e) {
            if (carousel.classList.contains('kz-museums-carousel--active')) {
                if (!carousel.contains(e.target) && 
                    !e.target.closest('#kzDetailsBtn')) {
                    carousel.classList.remove('kz-museums-carousel--active');
                }
            }
        });

        // Стрелки
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                if (kzCurrentSlide > 0) {
                    kzCurrentSlide--;
                    updateKzCarouselPosition();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                const museums = kzMuseumsCache[kzCurrentRegionId] || [];
                const maxSlide = Math.max(0, museums.length - kzVisibleCards);
                if (kzCurrentSlide < maxSlide) {
                    kzCurrentSlide++;
                    updateKzCarouselPosition();
                }
            });
        }

        // Обновление при ресайзе
        window.addEventListener('resize', updateKzVisibleCards);
        updateKzVisibleCards();

        // Свайп для мобильных
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    // Свайп влево - следующий слайд
                    nextBtn.click();
                } else {
                    // Свайп вправо - предыдущий слайд
                    prevBtn.click();
                }
            }
        }
    }

    /**
     * Обновление количества видимых карточек
     */
    function updateKzVisibleCards() {
        const width = window.innerWidth;
        if (width <= 480) {
            kzVisibleCards = 1;
        } else if (width <= 768) {
            kzVisibleCards = 2;
        } else if (width <= 1200) {
            kzVisibleCards = 3;
        } else {
            kzVisibleCards = 4;
        }
    }

    /**
     * Генерация заглушек музеев для статичного зеркала
     */
    function getFallbackMuseums(regionId) {
        if (typeof kzRegionsData === 'undefined' || !kzRegionsData[regionId]) {
            return [];
        }

        const region = kzRegionsData[regionId];
        const count = Math.max(0, Number(region.museums) || 0);
        const placeholderImage =
            'data:image/svg+xml;utf8,' +
            encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200">' +
                    '<rect width="100%" height="100%" fill="#e2e8f0"/>' +
                    '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#475569" font-family="Arial" font-size="16">' +
                        'Музей' +
                    '</text>' +
                '</svg>'
            );

        return Array.from({ length: count }, function(_, index) {
            return {
                id: regionId + '-' + (index + 1),
                title: region.name + ' — Музей ' + (index + 1),
                url: '#',
                image: placeholderImage
            };
        });
    }

    /**
     * Показать карусель с музеями
     */
    function showKzMapDetails() {
        if (!kzCurrentRegionId) return;

        const carousel = document.getElementById('kzMuseumsCarousel');
        const loader = document.getElementById('kzCarouselLoader');
        const track = document.getElementById('kzCarouselTrack');
        
        if (!carousel) return;

        // Показываем карусель с лоадером
        carousel.classList.add('kz-museums-carousel--active');
        if (loader) loader.style.display = 'flex';
        if (track) track.innerHTML = '';

        // Проверяем кэш
        if (kzMuseumsCache[kzCurrentRegionId]) {
            renderMuseumsCarousel(kzMuseumsCache[kzCurrentRegionId]);
            return;
        }

        // Если админ-ajax на другом домене, используем заглушки без запроса
        if (typeof kzMuseumsMapAjax !== 'undefined' && kzMuseumsMapAjax.ajaxurl) {
            try {
                const ajaxOrigin = new URL(kzMuseumsMapAjax.ajaxurl, window.location.href).origin;
                if (ajaxOrigin !== window.location.origin) {
                    const fallbackMuseums = getFallbackMuseums(kzCurrentRegionId);

                    if (fallbackMuseums.length > 0) {
                        kzMuseumsCache[kzCurrentRegionId] = fallbackMuseums;
                        kzMuseumsCache[kzCurrentRegionId + '_name'] = kzRegionsData[kzCurrentRegionId].name;
                        if (loader) loader.style.display = 'none';
                        renderMuseumsCarousel(fallbackMuseums, kzRegionsData[kzCurrentRegionId].name);
                        return;
                    }
                }
            } catch (error) {
                // Если URL некорректный, продолжаем с AJAX-запросом
            }
        }

        // AJAX запрос
        $.ajax({
            url: kzMuseumsMapAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'kz_get_region_museums',
                nonce: kzMuseumsMapAjax.nonce,
                region_code: kzCurrentRegionId,
                lang: kzMuseumsMapAjax.lang
            },
            success: function(response) {
                if (loader) loader.style.display = 'none';

                if (response && response.success && response.data && Array.isArray(response.data.museums) && response.data.museums.length > 0) {
                    // Кэшируем
                    kzMuseumsCache[kzCurrentRegionId] = response.data.museums;
                    kzMuseumsCache[kzCurrentRegionId + '_name'] = response.data.region_name;
                    
                    renderMuseumsCarousel(response.data.museums, response.data.region_name);
                } else {
                    const fallbackMuseums = getFallbackMuseums(kzCurrentRegionId);

                    if (fallbackMuseums.length > 0) {
                        kzMuseumsCache[kzCurrentRegionId] = fallbackMuseums;
                        kzMuseumsCache[kzCurrentRegionId + '_name'] = kzRegionsData[kzCurrentRegionId].name;
                        renderMuseumsCarousel(fallbackMuseums, kzRegionsData[kzCurrentRegionId].name);
                    } else {
                        track.innerHTML = '<div class="kz-no-museums">' + kzMapTranslations.no_museums + '</div>';
                    }
                }
            },
            error: function() {
                if (loader) loader.style.display = 'none';
                const fallbackMuseums = getFallbackMuseums(kzCurrentRegionId);

                if (fallbackMuseums.length > 0) {
                    kzMuseumsCache[kzCurrentRegionId] = fallbackMuseums;
                    kzMuseumsCache[kzCurrentRegionId + '_name'] = kzRegionsData[kzCurrentRegionId].name;
                    renderMuseumsCarousel(fallbackMuseums, kzRegionsData[kzCurrentRegionId].name);
                } else {
                    track.innerHTML = '<div class="kz-no-museums">' + kzMapTranslations.error_loading + '</div>';
                }
            }
        });
    }

    /**
     * Рендер карусели с музеями (ОБНОВЛЕНО: добавлен скролл к музею)
     */
    function renderMuseumsCarousel(museums, regionName) {
        const track = document.getElementById('kzCarouselTrack');
        const dotsContainer = document.getElementById('kzCarouselDots');
        const regionNameSpan = document.getElementById('kzCarouselRegionName');
        const loader = document.getElementById('kzCarouselLoader');

        if (loader) loader.style.display = 'none';

        // Название региона
        if (regionNameSpan) {
            regionNameSpan.textContent = regionName || kzMuseumsCache[kzCurrentRegionId + '_name'] || 
                                          (kzRegionsData[kzCurrentRegionId] ? kzRegionsData[kzCurrentRegionId].name : 'Регион');
        }

        // НОВОЕ: Находим индекс целевого музея
        let targetIndex = 0;
        if (kzTargetMuseumId) {
            const foundIndex = museums.findIndex(m => m.id == kzTargetMuseumId);
            if (foundIndex !== -1) {
                targetIndex = foundIndex;
            }
            kzTargetMuseumId = null; // Сбрасываем после использования
        }

        // Генерация карточек
        function decodeHtml(html) {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

function prepareTitle(title) {
    // Декодируем HTML entities
    var decoded = decodeHtml(title);
    // Заменяем длинное тире на обычное
    decoded = decoded.replace(/—/g, '-');  // Длинное тире на дефис
    decoded = decoded.replace(/–/g, '-');  // Среднее тире на дефис
    // Экранируем для безопасности
    return escapeHtml(decoded);
}

if (track) {
    var cards = '';
    museums.forEach(function(museum) {
        var safeTitle = prepareTitle(museum.title);
        
        cards += '<a href="' + museum.url + '" class="kz-museum-card">';
        cards += '<img src="' + museum.image + '" ';
        cards += 'alt="' + safeTitle + '" ';
        cards += 'class="kz-museum-card-image" ';
        cards += 'loading="lazy" ';
        cards += 'onerror="this.src=\'/wp-content/uploads/sites/11/museums/placeholder.jpg\'">';
        cards += '<div class="kz-museum-card-content">';
        cards += '<h4 class="kz-museum-card-title">' + safeTitle + '</h4>';
        cards += '</div>';
        cards += '</a>';
    });
    track.innerHTML = cards;
}

        // Генерация точек пагинации
        if (dotsContainer) {
            updateKzVisibleCards();
            const totalDots = Math.max(1, museums.length - kzVisibleCards + 1);
            dotsContainer.innerHTML = '';
            
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('button');
                dot.className = 'kz-museums-carousel-dot' + (i === 0 ? ' kz-museums-carousel-dot--active' : '');
                dot.setAttribute('aria-label', 'Слайд ' + (i + 1));
                dot.addEventListener('click', function() {
                    kzCurrentSlide = i;
                    updateKzCarouselPosition();
                });
                dotsContainer.appendChild(dot);
            }
        }

        // НОВОЕ: Устанавливаем позицию на целевой музей
        kzCurrentSlide = targetIndex;
        updateKzCarouselPosition();
    }

    /**
     * Обновление позиции карусели
     */
    function updateKzCarouselPosition() {
        const track = document.getElementById('kzCarouselTrack');
        const prevBtn = document.getElementById('kzCarouselPrev');
        const nextBtn = document.getElementById('kzCarouselNext');
        const dots = document.querySelectorAll('.kz-museums-carousel-dot');
        
        if (!track) return;
        
        // Получаем первую карточку для определения ширины
        const firstCard = track.querySelector('.kz-museum-card');
        if (!firstCard) return;
        
        // Получаем реальную ширину карточки с учетом gap
        const cardWidth = firstCard.offsetWidth;
        const trackStyle = window.getComputedStyle(track);
        const gap = parseFloat(trackStyle.gap) || 20;
        const totalCardWidth = cardWidth + gap;
        
        // ПРОКРУЧИВАЕМ ПО ОДНОЙ КАРТОЧКЕ
        track.style.transform = 'translateX(-' + (kzCurrentSlide * totalCardWidth) + 'px)';
        
        // Состояние кнопок
        const museums = kzMuseumsCache[kzCurrentRegionId] || [];
        const maxSlide = Math.max(0, museums.length - kzVisibleCards);
        
        if (prevBtn) prevBtn.disabled = kzCurrentSlide === 0;
        if (nextBtn) nextBtn.disabled = kzCurrentSlide >= maxSlide;
        
        // Обновление точек
        dots.forEach(function(dot, index) {
            if (index === kzCurrentSlide) {
                dot.classList.add('kz-museums-carousel-dot--active');
            } else {
                dot.classList.remove('kz-museums-carousel-dot--active');
            }
        });
    }

    /**
     * Экранирование HTML
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Глобальная функция для обратной совместимости
    window.showKzMapDetails = showKzMapDetails;

})(jQuery);

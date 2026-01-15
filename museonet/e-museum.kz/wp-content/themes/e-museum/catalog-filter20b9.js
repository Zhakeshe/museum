(function($) {
    'use strict';
    
    var ajaxurl = catalogFilter.ajaxurl;
    var lang = catalogFilter.lang;
    var i18n = catalogFilter.i18n;
    var searchTimer;
    
    /**
     * Получить значение cookie по имени
     */
    function getCookie(name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : null;
    }
    
    /**
     * Удалить cookie
     */
    function deleteCookie(name) {
        document.cookie = name + '=; path=/; max-age=0';
    }
    
    $(document).ready(function() {
        
        // Тексты для Select2 в зависимости от языка
        var select2Texts = {
            'ru': {
                placeholder: 'Выберите...',
                noResults: 'Ничего не найдено',
                searching: 'Поиск...'
            },
            'kk': {
                placeholder: 'Таңдаңыз...',
                noResults: 'Ештеңе табылмады',
                searching: 'Іздеу...'
            },
            'en': {
                placeholder: 'Select...',
                noResults: 'Nothing found',
                searching: 'Searching...'
            }
        };
        
        var s2text = select2Texts[lang] || select2Texts['ru'];
        
        // Инициализация Select2
        $('.select2-filter').select2({
            placeholder: function() {
                return $(this).data('placeholder') || s2text.placeholder;
            },
            allowClear: true,
            width: '100%',
            language: {
                noResults: function() {
                    return s2text.noResults;
                },
                searching: function() {
                    return s2text.searching;
                }
            }
        });
        
        // Проверяем cookie (приоритет над sessionStorage)
        var cookieMuseum = getCookie('catalog_museum_filter');
        
        // Восстанавливаем фильтры
        var savedSearch = sessionStorage.getItem('catalog_search') || '';
        var savedMuseum = cookieMuseum || sessionStorage.getItem('catalog_museum') || '';
        var savedCategory = sessionStorage.getItem('catalog_category') || '';
        
        // Если есть cookie - очищаем остальные фильтры
        if (cookieMuseum) {
            savedSearch = '';
            savedCategory = '';
            sessionStorage.setItem('catalog_museum', cookieMuseum);
            sessionStorage.removeItem('catalog_search');
            sessionStorage.removeItem('catalog_category');
            
            // Удаляем cookie после использования
            deleteCookie('catalog_museum_filter');
        }
        
        $('#filter-search').val(savedSearch);
        $('#filter-museum').val(savedMuseum).trigger('change.select2');
        $('#filter-category').val(savedCategory).trigger('change.select2');
        
        // Загрузка при старте
        filterExhibits();
        
        // Отправка формы
        $('#catalog-filter').on('submit', function(e) {
            e.preventDefault();
            saveFilters();
            filterExhibits();
        });
        
        // Изменение селектов (Select2 использует свой event)
        $('#filter-museum, #filter-category').on('change', function() {
            saveFilters();
            filterExhibits();
        });
        
        // Поиск с задержкой
        $('#filter-search').on('keyup', function() {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(function() {
                saveFilters();
                filterExhibits();
            }, 500);
        });
        
        // Сброс фильтров
        $('#filter-reset').on('click', function() {
            $('#filter-search').val('');
            $('#filter-museum').val('').trigger('change.select2');
            $('#filter-category').val('').trigger('change.select2');
            sessionStorage.removeItem('catalog_search');
            sessionStorage.removeItem('catalog_museum');
            sessionStorage.removeItem('catalog_category');
            filterExhibits();
        });
        
        // Загрузить ещё
        $(document).on('click', '.load-more', function() {
            var $btn = $(this);
            var page = parseInt($btn.data('page'));
            var maxPages = parseInt($btn.data('max'));
            
            $btn.text(i18n.loading).prop('disabled', true);
            
            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'filter_exhibits',
                    lang: lang,
                    search: $('#filter-search').val(),
                    museum: $('#filter-museum').val(),
                    category: $('#filter-category').val(),
                    paged: page,
                    append: true
                },
                success: function(response) {
                    $('.exhibits-grid').append(response);
                    
                    // ВАЖНО: Инициализируем проверку изображений для новых карточек
                    if (typeof window.initExhibitCards === 'function') {
                        window.initExhibitCards('.exhibits-grid');
                    }
                    
                    var shown = $('.exhibit-card').length;
                    $('#shown-count').text(shown);
                    
                    if (page >= maxPages) {
                        $btn.remove();
                    } else {
                        $btn.data('page', page + 1);
                        $btn.text(i18n.load_more).prop('disabled', false);
                    }
                },
                error: function(xhr, status, error) {
                    console.log('Load more error:', error, xhr.responseText);
                    
                    var errorText = {
                        'ru': 'Ошибка',
                        'kk': 'Қате',
                        'en': 'Error'
                    };
                    
                    $btn.text(errorText[lang] || 'Error').prop('disabled', false);
                }
            });
        });
    });
    
    function saveFilters() {
        sessionStorage.setItem('catalog_search', $('#filter-search').val());
        sessionStorage.setItem('catalog_museum', $('#filter-museum').val());
        sessionStorage.setItem('catalog_category', $('#filter-category').val());
    }
    
    function filterExhibits() {
        var $results = $('#catalog-results');
        var $loading = $('#catalog-loading');
        
        $results.hide();
        $loading.show();
        
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'filter_exhibits',
                lang: lang,
                search: $('#filter-search').val(),
                museum: $('#filter-museum').val(),
                category: $('#filter-category').val(),
                paged: 1
            },
            success: function(response) {
                $loading.hide();
                $results.html(response).fadeIn();
                
                // ВАЖНО: Инициализируем проверку изображений для новых карточек
                if (typeof window.initExhibitCards === 'function') {
                    window.initExhibitCards('#catalog-results');
                }
            },
            error: function(xhr, status, error) {
                $loading.hide();
                console.log('Filter error:', error, xhr.responseText);
                $results.html('<p class="no-results">' + i18n.error_loading + '</p>').show();
            }
        });
    }
    
})(jQuery);
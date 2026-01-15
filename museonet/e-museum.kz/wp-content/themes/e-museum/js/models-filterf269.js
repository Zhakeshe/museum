(function($) {
    'use strict';
    
    var ajaxurl = modelsFilter.ajaxurl;
    var lang = modelsFilter.lang;
    var i18n = modelsFilter.i18n;
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
                placeholder: 'Выберите музей',
                noResults: 'Ничего не найдено',
                searching: 'Поиск...'
            },
            'kk': {
                placeholder: 'Музейді таңдаңыз',
                noResults: 'Ештеңе табылмады',
                searching: 'Іздеу...'
            },
            'en': {
                placeholder: 'Select museum',
                noResults: 'Nothing found',
                searching: 'Searching...'
            }
        };
        
        var s2text = select2Texts[lang] || select2Texts['ru'];
        
        // Инициализация Select2
        $('.select2-models').select2({
            placeholder: s2text.placeholder,
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
        var cookieMuseum = getCookie('models_museum_filter');
        
        // Восстанавливаем фильтры
        var savedSearch = sessionStorage.getItem('models_search') || '';
        var savedMuseum = cookieMuseum || sessionStorage.getItem('models_museum') || '';
        
        // Если есть cookie - очищаем поиск
        if (cookieMuseum) {
            savedSearch = '';
            sessionStorage.setItem('models_museum', cookieMuseum);
            sessionStorage.removeItem('models_search');
            
            // Удаляем cookie после использования
            deleteCookie('models_museum_filter');
        }
        
        $('#models-search').val(savedSearch);
        $('#models-museum').val(savedMuseum).trigger('change.select2');
        
        // Загрузка при старте
        filterModels();
        
        // Отправка формы
        $('#models-filter').on('submit', function(e) {
            e.preventDefault();
            saveFilters();
            filterModels();
        });
        
        // Изменение селекта
        $('#models-museum').on('change', function() {
            saveFilters();
            filterModels();
        });
        
        // Поиск с задержкой
        $('#models-search').on('keyup', function() {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(function() {
                saveFilters();
                filterModels();
            }, 500);
        });
        
        // Сброс фильтров
        $('#models-reset').on('click', function() {
            $('#models-search').val('');
            $('#models-museum').val('').trigger('change.select2');
            sessionStorage.removeItem('models_search');
            sessionStorage.removeItem('models_museum');
            filterModels();
        });
        
        // Загрузить ещё
        $(document).on('click', '.models-load-more', function() {
            var $btn = $(this);
            var page = parseInt($btn.data('page'));
            var maxPages = parseInt($btn.data('max'));
            
            $btn.text(i18n.loading).prop('disabled', true);
            
            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'filter_models',
                    lang: lang,
                    search: $('#models-search').val(),
                    museum: $('#models-museum').val(),
                    paged: page,
                    append: true
                },
                success: function(response) {
                    $('.models-grid').append(response);
                    
                    var shown = $('.model-card').length;
                    $('#models-shown-count').text(shown);
                    
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
        sessionStorage.setItem('models_search', $('#models-search').val());
        sessionStorage.setItem('models_museum', $('#models-museum').val());
    }
    
    function filterModels() {
        var $results = $('#models-results');
        var $loading = $('#models-loading');
        
        $results.hide();
        $loading.show();
        
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'filter_models',
                lang: lang,
                search: $('#models-search').val(),
                museum: $('#models-museum').val(),
                paged: 1
            },
            success: function(response) {
                $loading.hide();
                $results.html(response).fadeIn();
            },
            error: function(xhr, status, error) {
                $loading.hide();
                console.log('Filter error:', error, xhr.responseText);
                
                var errorTexts = {
                    'ru': 'Ошибка загрузки',
                    'kk': 'Жүктеу қатесі',
                    'en': 'Loading error'
                };
                
                $results.html('<p class="no-results">' + (errorTexts[lang] || 'Error') + '</p>').show();
            }
        });
    }
    
})(jQuery);
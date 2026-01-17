(function($) {
    'use strict';
    
    var ajaxurl = newsFilter.ajaxurl;
    var lang = newsFilter.lang;
    var i18n = newsFilter.i18n;
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
        
        var hasSelect2 = $.fn.select2;
        if (hasSelect2) {
            // Инициализация Select2
            $('.select2-news').select2({
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
        }
        
        // Проверяем cookie (приоритет над sessionStorage)
        var cookieMuseum = getCookie('news_museum_filter');
        
        // Восстанавливаем фильтры
        var savedSearch = sessionStorage.getItem('news_search') || '';
        var savedMuseum = cookieMuseum || sessionStorage.getItem('news_museum') || '';
        
        // Если есть cookie - очищаем поиск и применяем музей
        if (cookieMuseum) {
            savedSearch = '';
            sessionStorage.setItem('news_museum', cookieMuseum);
            sessionStorage.removeItem('news_search');
            
            // Удаляем cookie после использования
            deleteCookie('news_museum_filter');
        }
        
        $('#news-search').val(savedSearch);
        $('#news-museum').val(savedMuseum).trigger(hasSelect2 ? 'change.select2' : 'change');
        
        // Загрузка при старте
        filterNews();
        
        // Отправка формы
        $('#news-filter').on('submit', function(e) {
            e.preventDefault();
            saveFilters();
            filterNews();
        });
        
        // Изменение селекта
        $('#news-museum').on('change', function() {
            saveFilters();
            filterNews();
        });
        
        // Поиск с задержкой
        $('#news-search').on('keyup', function() {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(function() {
                saveFilters();
                filterNews();
            }, 500);
        });
        
        // Сброс фильтров
        $('#news-reset').on('click', function() {
            $('#news-search').val('');
            $('#news-museum').val('').trigger(hasSelect2 ? 'change.select2' : 'change');
            sessionStorage.removeItem('news_search');
            sessionStorage.removeItem('news_museum');
            filterNews();
        });
        
        // Загрузить ещё
        $(document).on('click', '.news-load-more', function() {
            var $btn = $(this);
            var page = parseInt($btn.data('page'));
            var maxPages = parseInt($btn.data('max'));
            
            $btn.text(i18n.loading).prop('disabled', true);
            
            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'filter_news',
                    lang: lang,
                    search: $('#news-search').val(),
                    museum: $('#news-museum').val(),
                    paged: page,
                    append: true
                },
                success: function(response) {
                    $('.news-grid').append(response);
                    
                    var shown = $('.news-card').length;
                    $('#news-shown-count').text(shown);
                    
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
        sessionStorage.setItem('news_search', $('#news-search').val());
        sessionStorage.setItem('news_museum', $('#news-museum').val());
    }
    
    function filterNews() {
        var $results = $('#news-results');
        var $loading = $('#news-loading');
        
        $results.hide();
        $loading.show();
        
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'filter_news',
                lang: lang,
                search: $('#news-search').val(),
                museum: $('#news-museum').val(),
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

$('document').ready(function() {

    var timer;
    var secondTimer;

    var userInfo = $('.content-upper-header .user-info');
    var cancelButton = $('.content-upper-header .cancel');
    var sidebarMenu = $('.sidebar.menu');
    var contentMainHeader = $('.content-main-header');

    userInfo.addClass('hidden');

    $('.main-img, .header-arrow').click(function(e) {
        userInfo.removeClass('hidden');

        e.stopPropagation();

    });

    cancelButton.click(function(e) {
       userInfo.addClass('hidden');
    });


    userInfo.click(function(e){
        e.stopPropagation();
    });

    $(document).click(function(){
        userInfo.addClass('hidden');
    });

    $('body').click(function(event) {
        // if(!event.target.closest('.user-info') && event.target != $('.main-img').get(0)) {
        //     userInfo.addClass('hidden');
        // }

        if(!event.target.closest('.application-list') && !( $('.application-list').hasClass('hidden')) && !event.target.closest('.application-buttons')) {
            $('.application-list').addClass('hidden');
        }

    });

    // Flexible main-content

    $('.header-actions').click(function(e) {

        if(sidebarMenu.hasClass('collapsed')) {
            contentMainHeader.css('transition', 'padding-left 150ms ease');
            contentMainHeader.css('padding-left', '0');
            setTimeout(function(event) {
                $('.header-logo').removeClass('hidden');
            }, 200);       // Hide innerLogo
        }
        else {
            contentMainHeader.css('transition', 'padding-left 395ms ease');
            contentMainHeader.css('padding-left', '');
            $('.header-logo').addClass('hidden');           // Show innerLogo
        }

    });

    // Slim scroll initiation

    $('.panel-body.ss').slimScroll({
        height: '725px',
    });

    // Hints show

    $('.operations.dropdown-toggle').mouseenter(function() {

        var td = $(this).closest('td');
        var popover = td.find('.popover');
        popover.show();

        $(this).click(function(e) {
            popover.hide();
        });

    });

    // Hints hide

    $('.operations.dropdown-toggle').mouseleave(function() {
        var td = $(this).closest('td');
        var popover = td.find('.popover');
        popover.hide();
    });


    //Application buttons

    $('.application-buttons').on('click', function(e) {
        if(e.target.closest('a')) {
            $(this).find('.application-list').toggleClass('hidden');
        }
    });

});
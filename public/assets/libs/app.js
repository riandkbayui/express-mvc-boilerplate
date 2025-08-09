function exitFullscreen() {
    if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        $("body").removeClass("fullscreen-enable");
    }
}

$("#side-menu").metisMenu();
$("#vertical-menu-btn").on("click", function (e) {
    e.preventDefault();
    $("body").toggleClass("sidebar-enable");
    if ($(window).width() >= 992) {
        $("body").toggleClass("vertical-collpsed");
    } else {
        $("body").removeClass("vertical-collpsed");
    }
});

$("#sidebar-menu a").each(function () {
    var pageUrl = window.location.href.split(/[?#]/)[0];
    if (this.href === pageUrl) {
        $(this).addClass("active");
        $(this).parent().addClass("mm-active");
        $(this).parent().parent().addClass("mm-show");
        $(this).parent().parent().prev().addClass("mm-active");
        $(this).parent().parent().parent().addClass("mm-active");
        $(this).parent().parent().parent().parent().addClass("mm-show");
        $(this).parent().parent().parent().parent().parent().addClass("mm-active");
    }
});

$(document).ready(function () {
    if ($("#sidebar-menu").length && $("#sidebar-menu .mm-active .active").length) {
        var activeElementOffset = $("#sidebar-menu .mm-active .active").offset().top;
        if (activeElementOffset > 300) {
            activeElementOffset -= 300;
            $(".vertical-menu .simplebar-content-wrapper").animate({ scrollTop: activeElementOffset }, "slow");
        }
    }
});

$(".navbar-nav a").each(function () {
    var pageUrl = window.location.href.split(/[?#]/)[0];
    if (this.href === pageUrl) {
        $(this).addClass("active");
        $(this).parent().addClass("active");
        $(this).parent().parent().addClass("active");
        $(this).parent().parent().parent().addClass("active");
        $(this).parent().parent().parent().parent().addClass("active");
        $(this).parent().parent().parent().parent().parent().addClass("active");
        $(this).parent().parent().parent().parent().parent().parent().addClass("active");
    }
});

$('[data-bs-toggle="fullscreen"]').on("click", function (e) {
    e.preventDefault();
    $("body").toggleClass("fullscreen-enable");
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }
});

document.addEventListener("fullscreenchange", exitFullscreen);
document.addEventListener("webkitfullscreenchange", exitFullscreen);
document.addEventListener("mozfullscreenchange", exitFullscreen);

Waves.init();
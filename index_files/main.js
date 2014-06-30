var prestaAnimEc = false;
var slider;
$(document).ready(function () {
    if (intro) {
        $.pageLoader()
    } else {
        if (transition) {
            $("body").css("overflow", "hidden");
            $("#transition").animate({
                top: "-=" + $(window).height()
            }, 1000, function () {
                $("body").css("overflow", "auto")
            })
        }
    }
    $("a.transition").click(function (b) {
        b.preventDefault();
        var c = $(this);
        $("body").css("overflow", "hidden").append("<div id='transition' style='height:" + $(window).height() + "px;top:-" + $(window).height() + "px;'></div>");
        $("#transition").animate({
            top: "+=" + $(window).height()
        }, 1000, function () {
            location.href = c.attr("href")
        })
    });
    $("a.popup").click(function (b) {
        b.preventDefault();
        window.open($(this).attr("href"), "popup", "width=" + $(this).attr("data-popup-width") + ",height=" + $(this).attr("data-popup-height") + ",left=30,top=20")
    });
    if ($(".pres_full_screen").length > 0) {
        slider = $(".bxslider").bxSlider({
            responsive: false
        })
    } else {
        $(".projet").height($(".projet").width());
        init_background();
        move_background();
        creation_menu();
        maj_pos_menu();
        $("*[data-id]").each(function () {
            if ($("#" + $(this).attr("data-id")).length > 0) {
                var b = $("#" + $(this).attr("data-id")).offset().top;
                if ($(this).hasClass("inverse")) {
                    b -= $(window).height() - $("#" + $(this).attr("data-id")).outerHeight()
                }
                $(this).click(function () {
                    scroll_to(b)
                })
            }
        });
        $(window).scroll(function () {
            maj_pos_menu();
            move_background();
            if (prestaAnimEc === false) {
                if ($(window).scrollTop() + $(window).height() >= $("#prestations").offset().top + 1) {
                    prestaAnimEc = true;
                    $("#presta1").animate({
                        marginTop: "25px",
                        opacity: 1
                    }, 1000);
                    setTimeout(function () {
                        $("#presta2").animate({
                            marginTop: "25px",
                            opacity: 1
                        }, 1000)
                    }, 500);
                    setTimeout(function () {
                        $("#presta3").animate({
                            marginTop: "25px",
                            opacity: 1
                        }, 1000, function () {
                            prestaAnimEc = false
                        })
                    }, 1000)
                } else {
                    if ($("#presta1").css("margin-top") == "25px" && $(window).scrollTop() < $("#prestations").offset().top) {
                        prestaAnimEc = false;
                        $("#presta1,#presta2,#presta3").stop().css({
                            marginTop: "165px",
                            opacity: "1"
                        })
                    }
                }
            }
        });
        $(window).resize(function () {
            init_background();
            move_background();
            $(".projet").height($(".projet").width());
            creation_menu();
            maj_pos_menu()
        });
        formulaire_placeholder($("#formulaire_contact"));
        $("#formulaire_submit").click(function () {
            $("#bouton_submit").click()
        });
        $("#formulaire_contact").submit(function (b) {
            b.preventDefault();
            $("#formulaire_contact").find("input[required], textarea[required]").each(function () {
                if ($(this).val() === "") {
                    $(this).focus();
                    return false
                }
            });
            $.ajax({
                url: "/index.php?ajax=true",
                data: $(this).serialize(),
                type: "post",
                async: false
            }).done(function () {
                $("#formulaire_validation_message").animate({
                    opacity: 1
                }, 1000);
                $("#formulaire_submit").animate({
                    opacity: 0
                }, 1000)
            });
            return false
        });
        var a = getParamGetInUrl("scrollTo");
        if (a) {
            scroll_to($("#" + a).offset().top)
        }
    }
});

function creation_menu() {
    $("#menu_contenu .menu_rubrique, #menu_contenu .menu_sous_rubrique").each(function () {
        $(this).attr("data-pos-top", $("#" + $(this).attr("data-id")).offset().top)
    })
}

function maj_pos_menu() {
    var a = $(window).scrollTop() + $(window).height() - 1;
    $("#menu_contenu .menu_rubrique, #menu_contenu .menu_sous_rubrique").removeClass("menu_actif");
    $("#menu_contenu .menu_rubrique, #menu_contenu .menu_sous_rubrique").reverse().each(function () {
        if (a > $(this).attr("data-pos-top")) {
            $(this).toggleClass("menu_actif");
            return false
        }
    })
}

function init_background() {
    if ($(window).width() > 400) {
        var a = $(window).height();
        $("body>article").each(function () {
            if ($(this).outerHeight() < a) {
                $(this).css("min-height", a)
            }
            if ($(this).hasClass("full_contenu")) {
                $(this).css("min-height", $(this).children(".conteneur").outerHeight() + 20 + $(this).children(".full_plus").outerHeight());
                $(this).children(".full_plus").css("top", $(this).children(".conteneur").outerHeight() + 20)
            }
            if ($(this).hasClass("full_ecran")) {
                $(this).css("min-height", $(window).height() + $(this).children(".full_plus").outerHeight());
                $(this).children(".full_plus").css("top", $(window).outerHeight() + "px")
            }
            $(this).css("background-position", "center " + ($(this).offset().top / 2) + "px").attr("data-initial-background", $(this).offset().top / 2)
        })
    }
}

function move_background() {
    if ($(window).width() > 400) {
        $("body>article").each(function () {
            $(this).css("background-position", "center " + ($(this).attr("data-initial-background") - ($(window).scrollTop() / 2)) + "px")
        })
    }
}

function scroll_to(a) {
    $("html, body").stop().animate({
        scrollTop: a
    }, 1300)
}

function formulaire_placeholder(a) {
    a.find("input, textarea").filter("[placeholder]").each(function () {
        $(this).data("placeholder-init", $(this).attr("placeholder"));
        $(this).focus(function () {
            $(this).attr("placeholder", null)
        }).blur(function () {
            if ($(this).val() === "") {
                $(this).attr("placeholder", $(this).data("placeholder-init"))
            }
        })
    })
}

function getParamGetInUrl(d) {
    if ($(location).attr("href").indexOf("?") !== -1 && $(location).attr("href").indexOf(d + "=") !== -1) {
        var e = $(location).attr("href").split("?");
        var b = e[1].split("&");
        for (var a in b) {
            var c = b[a].split("=");
            if (c[0] === d) {
                return c[1]
            }
        }
    }
    return null
};
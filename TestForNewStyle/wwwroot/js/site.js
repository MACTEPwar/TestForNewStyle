$(document).ready(function () {
    $(".navbar-nav li a").click((e) => {
        //$(this).parent().addClass('active');
        e.currentTarget.parentNode.classList.add('active');
        //$(this).css("color", "red");
        //console.log($e.css("color", "red"));
        //alert(123);
    });
});

$('.hamburger-menu').on('click', function () {
  $('.bar').toggleClass('animate');
  $('.mobile-menu').toggleClass('active');
});

$('.has-children').on('click', function () {
  $(this).children('ul').slideToggle('slow', 'swing');
  $(this).children('.icon-arrow').toggleClass('open');
});

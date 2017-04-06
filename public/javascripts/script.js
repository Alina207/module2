$(document).ready(function() {
  console.log($);
// $("#menu-toggle").click(function (e) {
//   e.preventDefault();
//   $("dashboard").toggleClass("menuDisplayed");
// });
$('#menu-toggle').click(function () {
  let sidebar = $('.sidebar');

  if (sidebar.hasClass('active')) {
      sidebar.removeClass('active');
    }
    else {
      sidebar.addClass('active');

    }
});

});

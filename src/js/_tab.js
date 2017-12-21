//----------------------------------------------------
// Tab
//----------------------------------------------------

$(function(){
  $('.js-tab').on('click', function(){
    if ($(this).not('is-active')) {
      $(this).addClass('is-active').siblings('.js-tab').removeClass('is-active');
      const index = $('.js-tab').index(this);
      $('.js-tab-content').eq(index).addClass('is-active').siblings('.js-tab-content').removeClass('is-active');
    }
  });
});
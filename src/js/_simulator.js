//----------------------------------------------------
// Simulator
//----------------------------------------------------

$(function(){
  $('.simulator-tab').click(function(){

    // Reset
    if($(this).not('is-active')){
      $(this).addClass('is-active').siblings().removeClass('is-active');
    }
    if($(this).is('.is-switch-font-family')){
      $('.texts.is-before,.texts.is-after').removeClass(function(index, className){
        return (className.match(/\bis-font-\S+/g) || []).join(' ');
      });
    }
    if($(this).is('.is-switch-font-weight')){
      $('.texts.is-before,.texts.is-after').removeClass(function(index, className){
        return (className.match(/\bis-weight-\S+/g) || []).join(' ');
      });
    }
    if($(this).is('.is-switch-font-size')){
      $('.texts.is-before,.texts.is-after').removeClass(function(index, className){
        return (className.match(/\bis-size-\S+/g) || []).join(' ');
      });
    }

    // None label
    if($(this).is('.is-switch-gothic')){
      $('.simulator-tab.is-switch-hiragino, .simulator-tab.is-switch-yu, .simulator-tab.is-switch-noto, .simulator-tab.is-switch-meiryo').removeClass('is-disable');
      $('.simulator-tab.is-switch-w200').removeClass('is-disable');
      $('.simulator-tab.is-switch-w800').addClass('is-disable');
    }
    if($(this).is('.is-switch-mincho')){
      $('.simulator-tab.is-switch-hiragino, .simulator-tab.is-switch-yu').removeClass('is-disable');
      $('.simulator-tab.is-switch-noto, .simulator-tab.is-switch-meiryo').addClass('is-disable');
      $('.simulator-tab.is-switch-w200').removeClass('is-disable');
      $('.simulator-tab.is-switch-w800').addClass('is-disable');
    }
    if($(this).is('.is-switch-round')){
      $('.simulator-tab.is-switch-hiragino, .simulator-tab.is-switch-yu, .simulator-tab.is-switch-noto, .simulator-tab.is-switch-meiryo').addClass('is-disable');
      $('.simulator-tab.is-switch-w800').removeClass('is-disable');
      $('.simulator-tab.is-switch-w200').addClass('is-disable');
    }

    // Gothic full
    if($('.is-switch-gothic').hasClass('is-active')&&
    $('.is-switch-full').hasClass('is-active')&&
    $('.is-switch-hiragino').hasClass('is-active')){
      $('.texts.is-before').addClass('is-font-sans-hiragino');
      $('.texts.is-after').addClass('is-font-sans-hiragino-yakuhanjp');
    }
    if($('.is-switch-gothic').hasClass('is-active')&&
    $('.is-switch-full').hasClass('is-active')&&
    $('.is-switch-yu').hasClass('is-active')){
      $('.texts.is-before').addClass('is-font-sans-yugo');
      $('.texts.is-after').addClass('is-font-sans-yugo-yakuhanjp');
    }
    if($('.is-switch-gothic').hasClass('is-active')&&
    $('.is-switch-full').hasClass('is-active')&&
    $('.is-switch-noto').hasClass('is-active')){
      $('.texts.is-before').addClass('is-font-sans-noto');
      $('.texts.is-after').addClass('is-font-sans-noto-yakuhanjp');
    }
    if($('.is-switch-gothic').hasClass('is-active')&&
    $('.is-switch-full').hasClass('is-active')&&
    $('.is-switch-meiryo').hasClass('is-active')){
      $('.texts.is-before').addClass('is-font-sans-meiryo');
      $('.texts.is-after').addClass('is-font-sans-meiryo-yakuhanjp');
    }

    // Gothic small
    if($('.is-switch-gothic').hasClass('is-active')&&
    $('.is-switch-small').hasClass('is-active')&&
    $('.is-switch-hiragino').hasClass('is-active')){
      $('.texts.is-before').addClass('is-font-sans-hiragino');
      $('.texts.is-after').addClass('is-font-sans-hiragino-yakuhanjps');
    }
    if($('.is-switch-gothic').hasClass('is-active')&&
    $('.is-switch-small').hasClass('is-active')&&
    $('.is-switch-yu').hasClass('is-active')){
      $('.texts.is-before').addClass('is-font-sans-yugo');
      $('.texts.is-after').addClass('is-font-sans-yugo-yakuhanjps');
    }
    if($('.is-switch-gothic').hasClass('is-active')&&
    $('.is-switch-small').hasClass('is-active')&&
    $('.is-switch-noto').hasClass('is-active')){
      $('.texts.is-before').addClass('is-font-sans-noto');
      $('.texts.is-after').addClass('is-font-sans-noto-yakuhanjps');
    }
    if($('.is-switch-gothic').hasClass('is-active')&&
    $('.is-switch-small').hasClass('is-active')&&
    $('.is-switch-meiryo').hasClass('is-active')){
      $('.texts.is-before').addClass('is-font-sans-meiryo');
      $('.texts.is-after').addClass('is-font-sans-meiryo-yakuhanjps');
    }

    // Mincho full
    if($('.is-switch-mincho').hasClass('is-active')&&
    $('.is-switch-full').hasClass('is-active')&&
    $('.is-switch-hiragino').hasClass('is-active')){
      $('.texts.is-before').addClass('is-font-serif-hiragino');
      $('.texts.is-after').addClass('is-font-serif-hiragino-yakuhanmp');
    }
    if($('.is-switch-mincho').hasClass('is-active')&&
    $('.is-switch-full').hasClass('is-active')&&
    $('.is-switch-yu').hasClass('is-active')){
      $('.texts.is-before').addClass('is-font-serif-yumi');
      $('.texts.is-after').addClass('is-font-serif-yumi-yakuhanmp');
    }
    if($('.is-switch-mincho').hasClass('is-active')&&
    $('.is-switch-full').hasClass('is-active')&&
    $('.is-switch-noto').hasClass('is-active')){
      $('.texts.is-before').addClass('is-font-serif-noto');
      $('.texts.is-after').addClass('is-font-serif-noto-yakuhanmp');
    }
    if($('.is-switch-mincho').hasClass('is-active')&&
    $('.is-switch-full').hasClass('is-active')&&
    $('.is-switch-meiryo').hasClass('is-active')){
      $('.texts.is-before').addClass('is-font-serif-meiryo');
      $('.texts.is-after').addClass('is-font-serif-meiryo-yakuhanmp');
    }

    // Mincho small
    if($('.is-switch-mincho').hasClass('is-active')&&
    $('.is-switch-small').hasClass('is-active')&&
    $('.is-switch-hiragino').hasClass('is-active')){
      $('.texts.is-before').addClass('is-font-serif-hiragino');
      $('.texts.is-after').addClass('is-font-serif-hiragino-yakuhanmps');
    }
    if($('.is-switch-mincho').hasClass('is-active')&&
    $('.is-switch-small').hasClass('is-active')&&
    $('.is-switch-yu').hasClass('is-active')){
      $('.texts.is-before').addClass('is-font-serif-yumi');
      $('.texts.is-after').addClass('is-font-serif-yumi-yakuhanmps');
    }
    if($('.is-switch-mincho').hasClass('is-active')&&
    $('.is-switch-small').hasClass('is-active')&&
    $('.is-switch-noto').hasClass('is-active')){
      $('.texts.is-before').addClass('is-font-serif-noto');
      $('.texts.is-after').addClass('is-font-serif-noto-yakuhanmps');
    }
    if($('.is-switch-mincho').hasClass('is-active')&&
    $('.is-switch-small').hasClass('is-active')&&
    $('.is-switch-meiryo').hasClass('is-active')){
      $('.texts.is-before').addClass('is-font-serif-meiryo');
      $('.texts.is-after').addClass('is-font-serif-meiryo-yakuhanmps');
    }

    // Round full
    if($('.is-switch-round').hasClass('is-active')&&
    $('.is-switch-full').hasClass('is-active')&&
    $('.is-switch-hiragino').hasClass('is-active')){
      $('.texts.is-before').addClass('is-font-round-hiragino');
      $('.texts.is-after').addClass('is-font-round-hiragino-yakuhanrp');
    }
    if($('.is-switch-round').hasClass('is-active')&&
    $('.is-switch-full').hasClass('is-active')&&
    $('.is-switch-yu').hasClass('is-active')){
      $('.texts.is-before').addClass('is-font-round-yugo');
      $('.texts.is-after').addClass('is-font-round-yugo-yakuhanrp');
    }
    if($('.is-switch-round').hasClass('is-active')&&
    $('.is-switch-full').hasClass('is-active')&&
    $('.is-switch-noto').hasClass('is-active')){
      $('.texts.is-before').addClass('is-font-round-noto');
      $('.texts.is-after').addClass('is-font-round-noto-yakuhanrp');
    }
    if($('.is-switch-round').hasClass('is-active')&&
    $('.is-switch-full').hasClass('is-active')&&
    $('.is-switch-meiryo').hasClass('is-active')){
      $('.texts.is-before').addClass('is-font-round-meiryo');
      $('.texts.is-after').addClass('is-font-round-meiryo-yakuhanrp');
    }

    // Round small
    if($('.is-switch-round').hasClass('is-active')&&
    $('.is-switch-small').hasClass('is-active')&&
    $('.is-switch-hiragino').hasClass('is-active')){
      $('.texts.is-before').addClass('is-font-round-hiragino');
      $('.texts.is-after').addClass('is-font-round-hiragino-yakuhanrps');
    }
    if($('.is-switch-round').hasClass('is-active')&&
    $('.is-switch-small').hasClass('is-active')&&
    $('.is-switch-yu').hasClass('is-active')){
      $('.texts.is-before').addClass('is-font-round-yugo');
      $('.texts.is-after').addClass('is-font-round-yugo-yakuhanrps');
    }
    if($('.is-switch-round').hasClass('is-active')&&
    $('.is-switch-small').hasClass('is-active')&&
    $('.is-switch-noto').hasClass('is-active')){
      $('.texts.is-before').addClass('is-font-round-noto');
      $('.texts.is-after').addClass('is-font-round-noto-yakuhanrps');
    }
    if($('.is-switch-round').hasClass('is-active')&&
    $('.is-switch-small').hasClass('is-active')&&
    $('.is-switch-meiryo').hasClass('is-active')){
      $('.texts.is-before').addClass('is-font-round-meiryo');
      $('.texts.is-after').addClass('is-font-round-meiryo-yakuhanrps');
    }

    // Weight
    if($('.is-switch-w100').hasClass('is-active')){
      $('.texts.is-before,.texts.is-after').addClass('is-weight-100');
    }
    if($('.is-switch-w200').hasClass('is-active')){
      $('.texts.is-before,.texts.is-after').addClass('is-weight-200');
    }
    if($('.is-switch-w300').hasClass('is-active')){
      $('.texts.is-before,.texts.is-after').addClass('is-weight-300');
    }
    if($('.is-switch-w400').hasClass('is-active')){
      $('.texts.is-before,.texts.is-after').addClass('is-weight-400');
    }
    if($('.is-switch-w500').hasClass('is-active')){
      $('.texts.is-before,.texts.is-after').addClass('is-weight-500');
    }
    if($('.is-switch-w700').hasClass('is-active')){
      $('.texts.is-before,.texts.is-after').addClass('is-weight-700');
    }
    if($('.is-switch-w800').hasClass('is-active')){
      $('.texts.is-before,.texts.is-after').addClass('is-weight-800');
    }
    if($('.is-switch-w900').hasClass('is-active')){
      $('.texts.is-before,.texts.is-after').addClass('is-weight-900');
    }

    // Size
    if($('.is-switch-xxs').hasClass('is-active')){
      $('.texts.is-before,.texts.is-after').addClass('is-size-xxs');
    }
    if($('.is-switch-xs').hasClass('is-active')){
      $('.texts.is-before,.texts.is-after').addClass('is-size-xs');
    }
    if($('.is-switch-sm').hasClass('is-active')){
      $('.texts.is-before,.texts.is-after').addClass('is-size-sm');
    }
    if($('.is-switch-md').hasClass('is-active')){
      $('.texts.is-before,.texts.is-after').addClass('is-size-md');
    }
    if($('.is-switch-lg').hasClass('is-active')){
      $('.texts.is-before,.texts.is-after').addClass('is-size-lg');
    }
    if($('.is-switch-xl').hasClass('is-active')){
      $('.texts.is-before,.texts.is-after').addClass('is-size-xl');
    }
    if($('.is-switch-xxl').hasClass('is-active')){
      $('.texts.is-before,.texts.is-after').addClass('is-size-xxl');
    }

  });
});
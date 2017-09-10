var revealPanel = function(buttonReveal, panel, buttonClose){
  $(document).ready(function(){
    //reveal panel
    $(buttonReveal).on('click', function() {
      $(panel).toggleClass('toggle-open');
    });

    $(buttonClose).on('click', function () {
      $(panel).removeClass('toggle-open');
    });
  });
}

revealPanel('.toggle-nav', '.menu-nav-container', '.close-toggle')

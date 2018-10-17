$(function() {
    var b = $("#comment-button");
    var w = $("#comment-wrapper");
    var l = $("#disqus_thread");
    
    w.height(l.outerHeight(true));
  
    b.click(function() {
    
      if(w.hasClass('open')) {
        w.removeClass('open');
        w.height(0);
      } else {
        w.addClass('open');
        w.height(l.outerHeight(true));
      }
    
    });
  });
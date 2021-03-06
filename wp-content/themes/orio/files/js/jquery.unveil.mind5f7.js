/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 */

;(function($) {

  $.fn.unveil = function(threshold, callback) {
	
	
    var $w = $(window),
        th = threshold || 0,
        retina = window.devicePixelRatio > 1,
        attrib = retina? "data-src-retina" : "data-src",
        images = this,
        loaded;
		
	// BY SPAB RICE
	if (!images.parent('.lazy-img').length) {	
		images.wrap( '<span class="lazy-wrapper"><span class="lazy-img"></span></span>' );
		images.parents(".lazy-wrapper").append( '<span class="lazy-icon"><span></span></span>' );
		images.each(function(){
			var wrapperHeight = 400;
			if (typeof jQuery(this).attr("height") !== typeof undefined && jQuery(this).attr("height") !== false) {
				var originalHeight = parseInt(jQuery(this).attr("height"),10);
				var originalWidth = parseInt(jQuery(this).attr("width"),10);
				jQuery(this).parents(".lazy-wrapper").css("max-width",originalWidth+"px");
				if (jQuery(this).closest(".isotope-grid").data("ratio")) { jQuery(this).parents(".lazy-wrapper").css("max-width","100%"); }
				// if closest added for isotope grid with double sized element (always take the full width)
				var iRatio = originalWidth/originalHeight;
				var wrapperWidth = parseInt(jQuery(this).parents(".lazy-wrapper").width(),10);
				wrapperHeight = parseInt(wrapperWidth / iRatio,10);
			}
			jQuery(this).parents(".lazy-wrapper").css({"min-height": wrapperHeight+"px"});
		});
	}
	// BY SPAB RICE	
	
    this.one("unveil", function() {
	  var source = this.getAttribute(attrib);
      source = source || this.getAttribute("data-src");
      if (source) {
        this.setAttribute("src", source);
		if (this.getAttribute("data-srcset")) { this.setAttribute("srcset", this.getAttribute("data-srcset")); }
		// BY SPAB RICE	
		jQuery(this).addClass("lazy-loaded");
		jQuery(this).parents(".lazy-wrapper").addClass("loaded");
        if (typeof callback === "function") callback.call(this);
      }
    });

    function unveil() {
      var inview = images.filter(function() {
        var $e = $(this);
        if ($e.is(":hidden")) return;

        var wt = $w.scrollTop(),
            wb = wt + $w.height(),
            et = $e.offset().top,
            eb = et + $e.height();

        return eb >= wt - th && et <= wb + th;
      });
		
      loaded = inview.trigger("unveil");
      images = images.not(loaded);
    }

    $w.on("scroll.unveil resize.unveil lookup.unveil", unveil);

    // add setTimeout to unveil the first visible images after rest has been loaded 
	// unveil();
    setTimeout(function(){ unveil(); },1000);
	  
    return this;

  };

})(window.jQuery || window.Zepto);
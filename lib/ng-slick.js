var angular = require('angular');
var $ = require('jquery');

require('slick-carousel');
require('slick-carousel/slick/slick.css');
//require('slick-carousel/slick/slick-theme.css');
require('./ng-slick.less');

angular.module('ngSlick', []).directive('ngSlick', ['$timeout', function(timeout) {
  return {
    require: '?ngModel',
    restrict : 'E',
    link: function (scope, element, attrs) {
      /*var zooming = (function() {
        var current;
        var duration = +attrs.zooming || 15000;
        
        return function(slide) {
          if( current ) current.stop();
          current = $(slide)
          .css('border-spacing', '0')
          .stop().animate({
            borderSpacing: 0.15
          }, {
            step: function(now, fx) {
              now = 1 + now;
              $(this).css('transform', 'matrix(' + now + ', 0, 0, ' + now + ', 0, 0) rotate(0.02deg)');
            },
            duration: duration
          }, 'ease-in');
        };
      })();
      */
      var lastslide;
      var slider = $(element)
      .on('init', function(event, slick) {
        var slide = slick.$slides[slick.slickCurrentSlide()];
        if( slide && 'zooming' in attrs ) {
          $(slide).addClass('slick-slide-zooming');
        }
        
        if( attrs.ngSlickInit ) 
          scope.$eval(attrs.ngSlickInit, {$event: event, $slick: slick});
      })
      .on('beforeChange', function(event, slick, currentSlide, nextSlide) {
        lastslide = slick.$slides[currentSlide];
        
        var slide = slick.$slides[nextSlide];
        if( slide && 'zooming' in attrs ) {
          $(slide).addClass('slick-slide-zooming');
        }
        
        if( attrs.ngSlickBeforeChange ) 
          scope.$eval(attrs.ngSlickBeforeChange, {$event: event, $slick: slick, $currentSlide: currentSlide, $nextSlide: nextSlide});
      })
      .on('afterChange', function(event, slick, currentSlide) {
        if( lastslide ) $(lastslide).removeClass('slick-slide-zooming');
        
        if( attrs.ngSlickAfterChange ) 
          scope.$eval(attrs.ngSlickAfterChange, {$event: event, $slick: slick, $currentSlide: currentSlide});
      })
      .on('breakpoint', function(event, slick, breakpoint) {
        if( attrs.ngSlickBreakpoint ) 
          scope.$eval(attrs.ngSlickBreakpoint, {$event: event, $slick: slick, $breakpoint: breakpoint});
      })
      .on('destroy', function(event, slick) {
        if( attrs.ngSlickDestroy ) 
          scope.$eval(attrs.ngSlickDestroy, {$event: event, $slick: slick});
      })
      .on('edge', function(event, slick, direction) {
        if( attrs.ngSlickEdge ) 
          scope.$eval(attrs.ngSlickEdge, {$event: event, $slick: slick, $direction: direction});
      })
      .on('reInit', function(event, slick) {
        if( attrs.ngSlickReInit ) 
          scope.$eval(attrs.ngSlickReInit, {$event: event, $slick: slick});
      })
      .on('setPosition', function(event, slick) {
        if( attrs.ngSlickSetPosition ) 
          scope.$eval(attrs.ngSlickSetPosition, {$event: event, $slick: slick});
      })
      .on('swipe', function(event, slick, direction) {
        if( attrs.ngSlickSwipe ) 
          scope.$eval(attrs.ngSlickSwipe, {$event: event, $slick: slick, $direction: direction});
      })
      .on('lazyLoaded', function(event, slick, image, src) {
        if( attrs.ngSlickLazyLoaded ) 
          scope.$eval(attrs.ngSlickLazyLoaded, {$event: event, $slick: slick, $image: image, $src: src});
      })
      .on('lazyLoadError', function(event, slick, direction) {
        if( attrs.ngSlickLazyLoadError ) 
          scope.$eval(attrs.ngSlickLazyLoadError, {$event: event, $slick: slick, $image: image, $src: src});
      });
      
      var options = {
        cssEase: attrs.cssEase || 'linear',
        fade: 'fade' in attrs,
        focusOnSelect: 'focusOnSelect' in attrs,
        lazyLoad: attrs.lazyLoad == 'true',
        draggable: attrs.draggable !== 'false',
        easing: attrs.easing || 'linear',
        centerMode: 'centerMode' in attrs,
        centerPadding: attrs.centerPadding || '50px',
        accessibility: attrs.accessibility !== 'false',
        adaptiveHeight: 'adaptiveHeight' in attrs,
        arrows: attrs.arrows !== 'false',
        pauseOnHover: attrs.pauseOnHover !== 'false',
        responsive: attrs.responsive && scope.$eval(attrs.responsive),
        rtl: attrs.rtl === 'true',
        touchMove: scope.touchMove !== 'false',
        touchThreshold: +attrs.touchThreshold || 5,
        useCSS: attrs.useCSS !== 'false',
        variableWidth: 'variableWidth' in attrs,
        vertical: 'vertical' in attrs,
        infinite: attrs.infinite !== 'false',
        speed: +attrs.speed || 350,
        slidesToShow: +attrs.slidesToShow || 1,
        swipeToSlide: true,
        dots: attrs.dots !== 'false',
        autoplay: 'autoplay' in attrs,
        autoplaySpeed: +attrs.autoplaySpeed || 2000,
        zIndex: attrs.zIndex || 100
      };
      
      var init = false;
      var update = function () {
        if( init ) return slider.slick('removeSlide', null, null, true).slick('unslick').slick(options);
        init = true;
        slider.slick(options);
      };
      
      scope.$watch(attrs.ngModel, function(value) {
        timeout(update);
      });
    }
  };
}]);

// ref: http://plnkr.co/edit/WCEWwgNcIEC0rseaZIO6?p=preview
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
      
      var buildoptions = function() {
        var o = {};
        
        if( 'cssEase' in attrs ) o.cssEase = attrs.cssEase;
        if( 'fade' in attrs ) o.fade = attrs.fade !== 'false';
        if( 'focusOnSelect' in attrs ) o.focusOnSelect = attrs.focusOnSelect;
        if( 'lazyLoad' in attrs ) o.lazyLoad = attrs.lazyLoad == 'true';
        if( 'draggable' in attrs ) o.draggable = attrs.draggable !== 'false';
        if( 'easing' in attrs ) o.easing = attrs.easing;
        if( 'centerMode' in attrs ) o.centerMode = attrs.centerMode;
        if( 'centerPadding' in attrs ) o.centerPadding = attrs.centerPadding;
        if( 'accessibility' in attrs ) o.accessibility = attrs.accessibility !== 'false';
        if( 'centerPadding' in attrs ) o.centerPadding = attrs.centerPadding;
        if( 'adaptiveHeight' in attrs ) o.adaptiveHeight = attrs.adaptiveHeight !== 'false';
        if( 'arrows' in attrs ) o.arrows = attrs.arrows !== 'false';
        if( 'pauseOnHover' in attrs ) o.pauseOnHover = attrs.pauseOnHover !== 'false';
        if( 'responsive' in attrs ) o.responsive = attrs.responsive && scope.$eval(attrs.responsive);
        if( 'rtl' in attrs ) o.rtl = attrs.rtl === 'true';
        if( 'touchMove' in attrs ) o.touchMove = attrs.touchMove !== 'false';
        if( 'touchThreshold' in attrs ) o.touchThreshold = +attrs.touchThreshold || 5;
        if( 'useCSS' in attrs ) o.useCSS = attrs.useCSS !== 'false';
        if( 'variableWidth' in attrs ) o.variableWidth = attrs.variableWidth !== 'false';
        if( 'vertical' in attrs ) o.vertical = attrs.vertical !== 'false';
        if( 'infinite' in attrs ) o.infinite = attrs.infinite !== 'false';
        if( 'speed' in attrs ) o.speed = +attrs.speed || 350;
        if( 'slidesToShow' in attrs ) o.slidesToShow = +attrs.slidesToShow || 1;
        if( 'swipeToSlide' in attrs ) o.swipeToSlide = attrs.swipeToSlide !== 'false';
        if( 'autoplay' in attrs ) o.autoplay = attrs.autoplay !== 'false';
        if( 'autoplaySpeed' in attrs ) o.autoplaySpeed = +attrs.autoplaySpeed || 2000;
        if( 'zIndex' in attrs ) o.zIndex = +attrs.zIndex || 100;
        
        return o;
      };
      
      var init = false;
      var update = function () {
        if( init ) return slider.slick('removeSlide', null, null, true).slick('unslick').slick(buildoptions()).slick('setPosition');
        init = true;
        slider.slick(buildoptions()).slick('setPosition').slick('slickPlay');
      };
      
      scope.$watch(attrs.ngModel, function(value) {
        timeout(update, 100);
      });
    }
  };
}]);

// ref: http://plnkr.co/edit/WCEWwgNcIEC0rseaZIO6?p=preview
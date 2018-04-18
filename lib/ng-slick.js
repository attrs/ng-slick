var angular = require('angular');
var $ = require('jquery');

require('slick-carousel');
require('slick-carousel/slick/slick.css');
//require('slick-carousel/slick/slick-theme.css');
require('./ng-slick.less');

angular.module('ngSlick', []).directive('ngSlick', ['$timeout', function(timeout) {
  return {
    replace: false,
    scope: {
      ngSlickOptions: '='
    },
    restrict: 'E',
    link: function (scope, element, attrs) {
      var lastslide;
      var slider = $(element)
      .css('opacity', 0)
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
        var o = scope.ngSlickOptions;
        if( o && typeof o == 'object' ) return o;
        
        o = {};
        o.dots = attrs.dots === 'false' ? false : true;
        
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
      
      var init = function() {
        if( slider.hasClass('slick-initialized') ) return;
        slider.css('opacity', 1).slick(buildoptions()).slick('setPosition').slick('slickGoTo', 0).slick('slickPlay');
      };
      
      var destroy = function() {
        if( !slider.hasClass('slick-initialized') ) return;
        slider.remove('slick-list').slick('unslick');
      };
      
      var refresh = function () {
        destroy();
        init();
      };
      
      scope.$on('$destroy', function() {
        destroy();
      });
      
      scope.$watch('ngSlickOptions', function() {
        var o = scope.ngSlickOptions;
        if( o && typeof o == 'object' ) timeout(refresh);
      }, true);
      
      scope.refresh = element[0].refresh = function() {
        timeout(refresh);
      };
      
      return timeout(init);
    }
  };
}]);

// ref: http://plnkr.co/edit/WCEWwgNcIEC0rseaZIO6?p=preview
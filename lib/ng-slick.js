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
      var slider = $(element)
      .on('afterChange', function(event, slick, currentSlide) {
        if( attrs.ngSlickAfterChange ) 
          scope.$eval(attrs.ngSlickAfterChange, {$event: event, $slick: slick, $currentSlide: currentSlide});
      })
      .on('beforeChange', function(event, slick, currentSlide, nextSlide) {
        if( attrs.ngSlickBeforeChange ) 
          scope.$eval(attrs.ngSlickBeforeChange, {$event: event, $slick: slick, $currentSlide: currentSlide, $nextSlide: nextSlide});
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
      .on('init', function(event, slick) {
        if( attrs.ngSlickInit ) 
          scope.$eval(attrs.ngSlickInit, {$event: event, $slick: slick});
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
        fade: 'fade' in attrs,
        focusOnSelect: 'focusOnSelect' in attrs,
        lazyLoad: attrs.lazyLoad || 'ondemand',
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
      };
      
      var init = false;
      var update = function () {
        if( init ) return slider.slick('unslick').slick(options);
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
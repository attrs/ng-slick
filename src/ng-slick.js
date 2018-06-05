import angular from 'angular';
import $ from 'jquery';
import {} from 'slick-carousel';
import {} from 'slick-carousel/slick/slick.css';
import {} from './ng-slick.less';
//require('slick-carousel/slick/slick-theme.css');

angular.module('ngSlick', []).directive('ngSlick', ['$timeout', function(timeout) {
  return {
    scope: {
      ngSlickOptions: '='
    },
    restrict: 'AE',
    link(scope, element, attrs) {
      let lastslide;

      const slider = $(element)
        .addClass('ng-slick')
        .css('opacity', 0)
        .on('init', (event, slick) => {
          const slide = slick.$slides[slick.slickCurrentSlide()];
          if( slide && attrs.zooming === 'true' ) {
            $(slide).addClass('slick-slide-zooming');
          }

          if( attrs.ngSlickInit )
            scope.$parent.$eval(attrs.ngSlickInit, {$event: event, $slick: slick});
        })
        .on('beforeChange', (event, slick, currentSlide, nextSlide) => {
          lastslide = slick.$slides[currentSlide];

          const slide = slick.$slides[nextSlide];
          if( slide && attrs.zooming === 'true' ) {
            $(slide).addClass('slick-slide-zooming');
          }

          if( attrs.ngSlickBeforeChange )
            scope.$parent.$eval(attrs.ngSlickBeforeChange, {$event: event, $slick: slick, $currentSlide: currentSlide, $nextSlide: nextSlide});
        })
        .on('afterChange', (event, slick, currentSlide) => {
          if( lastslide ) $(lastslide).removeClass('slick-slide-zooming');

          if( attrs.ngSlickAfterChange )
            scope.$parent.$eval(attrs.ngSlickAfterChange, {$event: event, $slick: slick, $currentSlide: currentSlide});
        })
        .on('breakpoint', (event, slick, breakpoint) => {
          if( attrs.ngSlickBreakpoint )
            scope.$parent.$eval(attrs.ngSlickBreakpoint, {$event: event, $slick: slick, $breakpoint: breakpoint});
        })
        .on('destroy', (event, slick) => {
          if( attrs.ngSlickDestroy )
            scope.$parent.$eval(attrs.ngSlickDestroy, {$event: event, $slick: slick});
        })
        .on('edge', (event, slick, direction) => {
          if( attrs.ngSlickEdge )
            scope.$parent.$eval(attrs.ngSlickEdge, {$event: event, $slick: slick, $direction: direction});
        })
        .on('reInit', (event, slick) => {
          if( attrs.ngSlickReInit )
            scope.$parent.$eval(attrs.ngSlickReInit, {$event: event, $slick: slick});
        })
        .on('setPosition', (event, slick) => {
          if( attrs.ngSlickSetPosition )
            scope.$parent.$eval(attrs.ngSlickSetPosition, {$event: event, $slick: slick});
        })
        .on('swipe', (event, slick, direction) => {
          if( attrs.ngSlickSwipe )
            scope.$parent.$eval(attrs.ngSlickSwipe, {$event: event, $slick: slick, $direction: direction});
        })
        .on('lazyLoaded', (event, slick, image, imageSource) => {
          if( attrs.ngSlickLazyLoaded )
            scope.$parent.$eval(attrs.ngSlickLazyLoaded, {$event: event, $slick: slick, $image: image, $src: imageSource, $imageSource: imageSource});
        })
        .on('lazyLoadError', (event, slick, image, imageSource) => {
          if( attrs.ngSlickLazyLoadError )
            scope.$parent.$eval(attrs.ngSlickLazyLoadError, {$event: event, $slick: slick, $image: image, $src: imageSource, $imageSource: imageSource});
        });

      const buildoptions = () => {
        const o = scope.ngSlickOptions || {};

        if( 'dots' in attrs ) o.dots = attrs.dots !== 'false';
        if( 'cssEase' in attrs ) o.cssEase = attrs.cssEase;
        if( 'fade' in attrs ) o.fade = attrs.fade === 'true';
        if( 'focusOnSelect' in attrs ) o.focusOnSelect = attrs.focusOnSelect;
        if( 'lazyLoad' in attrs ) o.lazyLoad = attrs.lazyLoad === 'true';
        if( 'draggable' in attrs ) o.draggable = attrs.draggable !== 'false';
        if( 'easing' in attrs ) o.easing = attrs.easing;
        if( 'centerMode' in attrs ) o.centerMode = attrs.centerMode;
        if( 'centerPadding' in attrs ) o.centerPadding = attrs.centerPadding;
        if( 'accessibility' in attrs ) o.accessibility = attrs.accessibility !== 'false';
        if( 'centerPadding' in attrs ) o.centerPadding = attrs.centerPadding;
        if( 'adaptiveHeight' in attrs ) o.adaptiveHeight = attrs.adaptiveHeight !== 'false';
        if( 'arrows' in attrs ) o.arrows = attrs.arrows !== 'false';
        if( 'pauseOnHover' in attrs ) o.pauseOnHover = attrs.pauseOnHover !== 'false';
        if( 'responsive' in attrs ) o.responsive = attrs.responsive && scope.$parent.$eval(attrs.responsive);
        if( 'rtl' in attrs ) o.rtl = attrs.rtl === 'true';
        if( 'touchMove' in attrs ) o.touchMove = attrs.touchMove !== 'false';
        if( 'touchThreshold' in attrs && +attrs.touchThreshold ) o.touchThreshold = +attrs.touchThreshold;
        if( 'useCSS' in attrs ) o.useCSS = attrs.useCSS !== 'false';
        if( 'variableWidth' in attrs ) o.variableWidth = attrs.variableWidth !== 'false';
        if( 'vertical' in attrs ) o.vertical = attrs.vertical !== 'false';
        if( 'infinite' in attrs ) o.infinite = attrs.infinite !== 'false';
        if( 'speed' in attrs && +attrs.speed ) o.speed = +attrs.speed;
        if( 'slidesToShow' in attrs && +attrs.slidesToShow ) o.slidesToShow = +attrs.slidesToShow;
        if( 'swipeToSlide' in attrs ) o.swipeToSlide = attrs.swipeToSlide !== 'false';
        if( 'autoplay' in attrs ) o.autoplay = attrs.autoplay !== 'false';
        if( 'autoplaySpeed' in attrs && +attrs.autoplaySpeed ) o.autoplaySpeed = +attrs.autoplaySpeed;
        if( 'zIndex' in attrs && +attrs.zIndex ) o.zIndex = +attrs.zIndex;

        return o;
      };

      const init = () => {
        if( !slider.hasClass('slick-initialized') )
          slider.css('opacity', 1).slick(buildoptions()).slick('setPosition').slick('slickGoTo', 0).slick('slickPlay');
      };

      const destroy = () => {
        if( slider.hasClass('slick-initialized') )
          slider.remove('slick-list').slick('unslick');
      };

      const refresh =  () => {
        destroy();
        init();
      };

      scope.$on('$destroy', () => {
        destroy();
      });

      scope.$watch('ngSlickOptions', () => {
        const o = scope.ngSlickOptions;
        if( o && typeof o === 'object' ) timeout(refresh);
      }, true);

      scope.refresh = element[0].refresh = () => timeout(refresh);

      return timeout(init);
    }
  };
}]);

// ref: http://plnkr.co/edit/WCEWwgNcIEC0rseaZIO6?p=preview

/* ng-infinite-scroll - v1.0.0 - 2013-02-23 */
var mod;

mod = angular.module('infinite-scroll', []);

mod.directive('infiniteScroll', [
    '$rootScope', '$window', '$timeout', function ($rootScope, $window, $timeout) {
        return {
            link: function (scope, elem, attrs) {
                var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
                $window = angular.element($window);
                scrollDistance = 0;
                if (attrs.infiniteScrollDistance != null) {
                    scope.$watch(attrs.infiniteScrollDistance, function (value) {
                        return scrollDistance = parseInt(value, 10);
                    });
                }
                scrollEnabled = true;
                checkWhenEnabled = false;
                if (attrs.infiniteScrollDisabled != null) {
                    scope.$watch(attrs.infiniteScrollDisabled, function (value) {
                        scrollEnabled = !value;
                        if (scrollEnabled && checkWhenEnabled) {
                            checkWhenEnabled = false;
                            return handler();
                        }
                    });
                }

                handler = function () {
                    var elementBottom, remaining, shouldScroll, windowBottom;
                    windowBottom = elem.get(0).scrollHeight;
                    elementBottom = elem.scrollTop() + elem.height() ;

                    remaining = windowBottom-elementBottom;

                    shouldScroll = remaining <= elem.height() * scrollDistance;
                    if (shouldScroll && scrollEnabled) {
                        if ($rootScope.$$phase) {
                            return scope.$eval(attrs.infiniteScroll);
                        } else {
                            scope.$apply(attrs.infiniteScroll);

                            $timeout(function(){
                                var totalHeight = 0;
                                elem.children().each(function(){
                                    totalHeight += $(this).height();
                                });

                                if(totalHeight<elem.get(0).scrollHeight){
                                    handler();
                                }
                            },1000);
                        }
                    } else if (shouldScroll) {
                        return checkWhenEnabled = true;
                    }
                };

                angular.element(elem).on('scroll', handler);
                scope.$on('$destroy', function () {
                    return angular.element(elem).off('scroll', handler);
                });

                return $timeout((function () {
                    if (attrs.infiniteScrollImmediateCheck) {
                        if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
                            return handler();
                        }
                    } else {
                        return handler();
                    }
                }), 0);
            }
        };
    }
]);

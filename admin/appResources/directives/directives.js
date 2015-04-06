define(["angular", "services"], function (angular, services) {
    var app = angular.module("petooRamDirectives", []);

    /* This directive aims at fade in animation for the tabbed content.
     * The directive should be applied on the top of ul of tabbed elements.
     * The source represents className of the ul.
     * The target represents the parent of tabbed Content.
     */
    app.directive('petooTab', function(){
        return {
            restrict : 'A',
            scope : {
                source : '@',
                target : '@'
            },
            link : function( scope, element, attrs){

                /*We need a back up. If clicked element in a instead of an li.
                 */
                var tabsChildHref = element.find('a');
                var tabsChildLi = element.find( 'li' );

                /*We retrieved all the li element in here.*/
                var listItems = element.children().eq(0).children();

                /*And retrieved the target div child. These are the one where active class would be applied.*/
                var targetItems = angular.element( document.querySelector( '.' + scope.target )).children();

                /*We need to perform magic on click.*/
                element.on( 'click', function($event){
                    removeActiveClassFromTabs(searchForClickedElement($event.toElement));
                });

                /*In this method we find the index of the clicked element.*/
                var searchForClickedElement = function( ele ){
                    var toSearchIn = null;

                    if( ele.nodeName.toLowerCase() === 'li' ){
                        toSearchIn = tabsChildLi;
                    } else {
                        toSearchIn = tabsChildHref;
                    }
                    for( var i=0; i<toSearchIn.length; i++){
                        if( ele === toSearchIn[i])
                            return i;
                    }
                };

                /* In this method, we remove active class from the previous tabs and move it to the clicked one.
                 * Same happens for the tabbed content divs.
                 */
                var removeActiveClassFromTabs = function( index ){
                    listItems.removeClass(' active' );
                    targetItems.removeClass( 'active' );

                    listItems.eq( index).addClass( 'active' );
                    targetItems.eq( index).addClass( 'active' );
                };
            }
        }
    });

    /* This directive aims at expanding of sidebar when hovered.
     */
    app.directive('petooSideBarTab', function () {
        return {
            restrict: 'A',
            scope: {
                target: '@',
                active: '@'
            },
            link: function (scope, element) {
                if (scope.active) {
                    element.addClass('active');
                }

                var sideBar = angular.element(document.querySelector('.sidebar'));
                var targetElement = angular.element(document.querySelector('.' + scope.target));

                var firstChild = element.parent().children().eq(0).find('span').eq(0)[0];

                /*On click, we need to expand the sidebar's width*/
                element.on('click', function ($event) {

                    if ($event.toElement === firstChild) {

                        var replaceAbleContent = angular.element(document.querySelector('#ngViewContent'));

                        sideBar.removeClass('expanded');

                        targetElement.parent().children().removeClass('active');
                        replaceAbleContent.css('left', '0');

                        element.parent().children().removeClass('active');
                        element.addClass('active');

                        return;
                    }

                    var replaceAbleContent = angular.element(document.querySelector('#ngViewContent'));

                    sideBar.addClass('expanded');

                    /*Handling active class Transfer*/
                    element.parent().children().removeClass('active');
                    element.addClass('active');

                    targetElement.parent().children().removeClass('active');
                    targetElement.addClass('active');

                    replaceAbleContent.css('left', '250px');

                    $event.stopPropagation();
                });

                scope.$on('closeSideBar', function ($event) {
                    var replaceAbleContent = angular.element(document.querySelector('#ngViewContent'));

                    sideBar.removeClass('expanded');

                    targetElement.parent().children().removeClass('active');
                    replaceAbleContent.css('left', '0');
                });
            }

        }
    });

    app.directive('circularProgress', function ($interval) {
        return {
            restrict: 'A',
            scope: {
                obj: '='
            },
            link: function (scope, element, attrs) {

                /*Directive Utilities*/
                var getDuration = function () {
                    return parseInt(scope.obj.details.duration) * 60;
                };

                var getChangeInValue = function () {
                    return scope.obj.details.to - scope.obj.details.from;
                };

                var getInitialValue = function () {
                    return scope.obj.details.from;
                };

                var getCircleWidth = function () {
                    return scope.obj.circ.width;
                };

                var getColor = function (type) {
                    return scope.obj[type].color;
                };

                var getFontSize = function (type) {
                    return scope.obj[type].size;
                };

                var getOffset = function (type) {
                    var offset = scope.obj[type].offset;

                    return typeof offset === 'undefined' ? 0 : offset;
                };

                var getSuffix = function () {
                    var suffix = scope.obj.status.suffix;

                    return typeof suffix === 'undefined' ? '' : ' ' + suffix;
                };

                var getSubheadingText = function () {
                    return scope.obj.subHeading.text;
                };

                function easeInOutQuad(currentIteration, startValue, changeInValue, totalIterations) {
                    if ((currentIteration /= totalIterations / 2) < 1) {
                        return changeInValue / 2 * currentIteration * currentIteration + startValue;
                    }
                    return -changeInValue / 2 * ((--currentIteration) * (currentIteration - 2) - 1) + startValue;
                }

                var computeValueInSameRatio = function (currentValue, totalValue, partOf) {
                    return partOf * ( currentValue / totalValue );
                };

                /*Creating and configuring canvas element to be added to element.*/
                var canvas = document.createElement('canvas');
                canvas.id = scope.obj.id;

                canvas.width = 500;
                canvas.height = 500;

                canvas.style.width = '100%';

                element.append(canvas);

                /*Retrieving canvas element and calculating required details for drawing.*/
                var context = canvas.getContext('2d');

                var centerX = canvas.width / 2;
                var centerY = canvas.height / 2;

                var radius = canvas.width / 3;

                /*Animation Related constants.*/


                scope.drawInCanvas = function () {

                    /*Clearing existing drawing*/
                    context.clearRect(0, 0, canvas.width, canvas.height);

                    context.beginPath();

                    /*Creating arc*/
                    context.lineWidth = getCircleWidth();
                    context.strokeStyle = getColor('circ');
                    context.lineCap = 'round'

                    var currentValue = easeInOutQuad(scope.currentIteration++, scope.startValue, scope.changeInValue, scope.totalIterations);
                    var till = computeValueInSameRatio(currentValue, scope.changeInValue, 2 * Math.PI);

                    context.arc(centerX, centerY, radius, 0, till);
                    context.stroke();

                    /*Drawing status text.*/
                    context.beginPath();
                    context.font = getFontSize('status') + ' Bree';
                    context.fillStyle = getColor('status');
                    context.textAlign = "center";
                    context.textBaseline = "middle";


                    context.fillText(Math.ceil(currentValue) + getSuffix(), canvas.width / 2, canvas.height / 2 + getOffset('status'));

                    /*Drawing subHeading*/
                    context.beginPath();
                    context.font = getFontSize('subHeading') + ' Bree';
                    context.fillStyle = getColor('subHeading');
                    context.textAlign = "center";
                    context.textBaseline = "middle";
                    context.fillText(getSubheadingText(), canvas.width / 2, canvas.height / 2 + getOffset('subHeading'));


                    if (scope.currentIteration >= scope.totalIterations) {
                        $interval.cancel(scope.stopPromise);
                    }
                };

                /*We would prefer a manual trigger over the design.*/
                scope.$on('startRenderingCanvas', function ($event) {
                    scope.totalIterations = getDuration();
                    scope.changeInValue = getChangeInValue();
                    scope.currentIteration = 1;
                    scope.startValue = getInitialValue();

                    scope.startDrawing();
                });

                scope.startDrawing = function () {
                    scope.stopPromise = $interval(function () {
                        scope.drawInCanvas();
                    }, 10);
                };
            }
        }
    });
});
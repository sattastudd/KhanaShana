define(["angular", "services"], function(angular, services) {
    var app = angular.module("petooRamDirectives", []);

    /* This directive aims at fade in animation for the tabbed content.
     * The directive should be applied on the top of ul of tabbed elements.
     * The source represents className of the ul.
     * The target represents the parent of tabbed Content.
     */
    /* This directive aims at fade in animation for the tabbed content.
     * The directive should be applied on the top of ul of tabbed elements.
     * The source represents className of the ul.
     * The target represents the parent of tabbed Content.
     */
    app.directive('petooTab', function( $timeout ){
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

                    removeActiveClassFromTabs(searchForClickedElement($event.srcElement));
                });

                /*In this method we find the index of the clicked element.*/
                var searchForClickedElement = function( ele ){
                    var toSearchIn = null;

                    var isControlDisabled = false;

                    if( ele.nodeName.toLowerCase() === 'li' ){
                        isControlDisabled = angular.element(ele).prop( 'disabled' );
                        toSearchIn = tabsChildLi;
                    } else {
                        isControlDisabled = angular.element(ele).parent().prop( 'disabled' );
                        toSearchIn = tabsChildHref;
                    }

                    if( !isControlDisabled ) {
                        for( var i=0; i<toSearchIn.length; i++){

                            if( ele === toSearchIn[i])
                                return i;
                        }
                    } else {
                        return null;
                    }
                };

                /* In this method, we remove active class from the previous tabs and move it to the clicked one.
                 * Same happens for the tabbed content divs.
                 */
                var removeActiveClassFromTabs = function( index ){

                    if( index != null ) {
                        listItems.removeClass(' active');
                        targetItems.removeClass('active');

                        listItems.eq(index).addClass('active');
                        targetItems.eq(index).addClass('active');
                    }
                };

                /* In case we need to do move things around */
                scope.$on( 'moveToPetooTab', function( $event, args ) {
                    var indexToMove = parseInt( args, 10);

                    $timeout( function() {
                        removeActiveClassFromTabs( indexToMove );
                    }, 500 );
                });
            }
        }
    });
});
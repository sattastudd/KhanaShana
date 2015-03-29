define(["angular", "services"], function(angular, services) {
    var app = angular.module("petooRamDirectives", []);

    /* This directive aims at expanding of sidebar when hovered.
      */
    app.directive('petooSideBarTab', function(DataStore){
       return {
           restrict : 'A',
           scope : {
               target : '@',
               active : '@'
           },
           link: function( scope, element, attrs ){
               if( scope.active ) {
                   element.addClass('active');
               }

               var sideBar = angular.element( document.querySelector('.sidebar'));
               var targetElement = angular.element( document.querySelector('.' + scope.target ));

               /*On click, we need to expand the sidebar's width*/
               element.on( 'click', function ($event) {

                   sideBar.addClass( 'expanded' );

                   /*Handling active class Transfer*/
                   element.parent().children().removeClass('active');
                   element.addClass('active');

                   targetElement.parent().children().removeClass( 'active' );
                   targetElement.addClass( 'active' );

                   $event.stopPropagation();
               });

               scope.$on( 'closeSideBar', function( $event ){

                   sideBar.removeClass( 'expanded' );

                   targetElement.parent().children().removeClass( 'active' );
               });
           }

       }
    });
});
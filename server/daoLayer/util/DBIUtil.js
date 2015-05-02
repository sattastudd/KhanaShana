/* This util file may contain similar code as Service Layer DBI.
 * The main intension of creating this file is to create DB helping utils.
 * Like case-insenstive regex creattion.
 */

/* Public method to generate case insensitive Regex.
 */
var createCaseInSensitiveRegexString = function( value ) {
    return new RegExp( '^' + value + '$', 'i');
};

/* Public Method to create case insensitive 'like' search string. */
var createCaseInsensitiveLikeString = function( value ) {
    return new RegExp( '' +   value, 'i' );
};


/*                          Public Valition Like Methods.                   */
/* Public Method to check if a field is empty. */

var isFieldEmpty = function( value ) {
    if( value === '' || value == null || typeof value === 'undefined' ){
        return true;
    }

    return false;
};

exports.createCaseInSensitiveRegexString = createCaseInSensitiveRegexString;
exports.createCaseInsensitiveLikeString = createCaseInsensitiveLikeString;

exports.isFieldEmpty = isFieldEmpty;
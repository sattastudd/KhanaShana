/* This module would act as RegEx Provider.
 * All RegEx to be used in server side would be defined in here.
 */

var RegExProvider = {
    name: /^[a-zA-Z ]{1,}$/,
    email: /^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/,
    contactNumber : /^[1-9][0-9]{1,10}$/
};

exports.RegExProvider = RegExProvider;
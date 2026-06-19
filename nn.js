$(function() {
    // Bootstrap popover
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
      return new bootstrap.Popover(popoverTriggerEl, {trigger: 'hover'})
    })
    
    

    // start common functions
    var get = function(args) {
        var self = args.self;
        delete args.self;
        var local = 'local' in args ? args.local : {};
        delete args.local;
/*
        if ('eventEl' in local) {
            $('#' + args.method + 'Error').remove();
            local.eventEl.attr('disabled','disabled');
            if ($(local.eventEl).next().hasClass('msgContainer')) {
                local.msgContainer = $(local.eventEl).next();
            }
            else {
                local.msgContainer = $('<span class="msgContainer"></span>').insertAfter(local.eventEl);
            }
            local.waitSpinnerEl = $('<div class="waitSpinner" style="display: none"></div>').appendTo( local.msgContainer ).fadeIn(400);
        }
*/

// alert('url: ' + 'index.html?action=data&method=' + args.method + '&' + $.param( args.postData ) );

        $.ajax({
//            url         : 'index.html?action=data&method=' + args.method,
//            type        : 'post',
//            data        : args.postData,
            url         :'index.html?action=data',
            type        : 'POST',
            data        : JSON.stringify(Object.assign({},{action:'data',method:args.method},args.postData),(key,value)=> value === undefined ? '' :value),
            cache       : false,
            contentType : "application/json;charset=UTF-8",
            dataType    : 'json',
            success     : function(responseData){

                if (responseData.errors && responseData.errors instanceof Array && responseData.errors.length > 0 ) {
                    args.fail({
                        request         : args,
                        local           : local,
                        responseData    : responseData,
                        self            : self
                    });
                    return;
                }

                if (responseData.warnings && responseData.warnings instanceof Array && responseData.warnings.length > 0 ) {
                    callFail({
                        request         : args,
                        local           : local,
                        responseData    : responseData,
                        self            : self
                    });
                }
                args.done(self, args, responseData);

                if ('eventEl' in local) {
                    $(local.eventEl).removeAttr('disabled');
                }
                if ('waitSpinnerEl' in local) {
                    $(local.waitSpinnerEl).fadeOut(400, function() { $(this).remove(); });
                }

            },
            error       : function(responseData){
// alert('in error');
                args.fail({
                    request         : args,
                    local           : local,
                    responseData    : responseData,
                    self            : self
                });
            }

       });
    };

    var callFail = function(args) {
// console.log(args);
        if (!args.responseData.errors) {
            alert('An error has occured.\n\nPlease try to re-login to CMI or restart your browser.');
            return;
        }
        if ($.inArray(args.responseData.errors[0].message, ['no_session','no_customer_id','invalid_customer_id']) != -1) {
            alert('Your session has timed out.');
            location = '?action=logout';
            return;
        }
        if (args.responseData.errors[0].code < 0) {
	    alert('An error has occured.\n\nPlease try to re-login to CMI or restart your browser.\n\n');
	    return;
        }
        alert(args.responseData.errors[0].message);
    };
/*
    var callFail = function(args) {
        var errorString;
        var errors = [];
        if (args.responseData.status && args.responseData.status != 200) {
            if (args.responseData.responseJSON && args.responseData.responseJSON.error) {
                var err = $.parseJSON( args.responseData.responseJSON.error );
                errorString = JSON.stringify( err, null, 4 );
            }
            else {
                errorString = args.responseData.responseText;
            }
        }
        else {
            if (args.responseData.responseText) {
                errorString = args.responseData.responseText;
            }
            else {
                if (args.responseData.errors && args.responseData.errors instanceof Array && args.responseData.errors.length > 0 ) {
                    errors = args.responseData.errors;
                }
                if (args.responseData.warnings && args.responseData.warnings instanceof Array && args.responseData.warnings.length > 0 ) {
                    errors = errors.concat(args.responseData.warnings);
                }
                errorString = JSON.stringify( errors, null, 4 );
            }
        }
        errorString = '<b>Request</b><br>' + JSON.stringify( args.request, null, 4 ) + '<br><b>Errors</b><br>' + errorString;
        $('#' + args.request.method + 'Error').fadeIn(400);
        $('#' + args.request.method + 'Error').data('errorString', errorString);

        if ($.inArray(args.request.method, ['dial_connection_data','dsl_connection_data','service']) > -1) {
            $('#' + args.request.method + 'RefreshLabel').fadeIn(400);
        };

        if ('local' in args) {
            if ('eventEl' in args.local) {
                $(args.local.eventEl).removeAttr('disabled');
            }
            if ('waitSpinnerEl' in args.local) {
                $(args.local.waitSpinnerEl).fadeOut(400, function() { $(this).remove(); });
            }
            if ('msgContainer' in args.local) {
                $('#' + args.request.method + 'Error').remove();
                var errorLabelEl = $('#errorLabelTemplate').clone().appendTo( args.local.msgContainer );
                $(errorLabelEl).data('method', args.request.method);
                $(errorLabelEl).data('errorString', errorString);
                $(errorLabelEl).prop('id', args.request.method + 'Error');
                $(errorLabelEl).removeClass('right');
                $(errorLabelEl).bind('click', function(event){ displayError(event); });
                $(errorLabelEl).fadeIn(400);
            }
        }
        $('#' + args.request.method + 'WaitImg').hide();
    };

    var displayError = function (event) {
        var e = this.$(event.target);

        if ($('#errorDisplayContainer').data('method') == e.data('method')){
            $('#errorDisplayContainer').fadeOut(400);
            $('#errorDisplayContainer pre').html();
            $('#errorDisplayContainer').data('method', '');
        }
        else {
            $('#errorDisplayContainer').data( 'method', e.data('method') );
            $('#errorDisplayContainer').hide();
            $('#errorDisplayContainer pre').html( e.data('errorString') );
            $('#errorDisplayContainer').fadeIn(400);
        }
    };
 */

    var ntoa = function( n ) {
        if (n == null || n == '') {
            return '';
        }
        var myN = n;

        if ( myN < 0 ) { //Try saving JavaScript from itself. Yay crappy Javascript bitwise operators!
            myN = ((myN>>>1)*2) + (myN&1);
        }

        if ( myN < 0 || myN > 256*256*256*256 ) {
            alert( "Bad ntoa call with '" + myN + "'." );
            return false;
        }

        //The last Math.floor isn't strictly necessary, but it saves us from getting non-integers as inputs.
        return Math.floor(myN/256/256/256) + "." + Math.floor((myN/256/256)%256) + "." + Math.floor((myN/256)%256) + "." + Math.floor(myN%256);
    };

    var aton = function( a ) {
        if (a == null || a == '') {
            return '';
        }
        var base = 0;
        var i = 0;
        var mult = 256 * 256 * 256;
        var n = 0;

        for ( i=0; i < a.length; i++ ) {
            if ( a.charAt(i) == '.' ) {
                if ( i - base <= 0 ) {
                    alert( "Failed to convert '" + a + "' to a useable IP address." );
                    return -1; //Here's hoping you have some smarts; otherwise, this'll put in 255.255.255.255.
                }

// alert( "Converting section '" + a.substring(base,i) + "' to " + (mult * a.substring(base,i)) + "." );
                n += mult * (a.substring(base,i)*1);
                mult /= 256;

                if ( mult < 1 ) {
                    alert( "Failed to convert '" + a + "' to a useable IP address (stop dots)." );
                    return -1;
                }

                base = i+1; //+1 = skip the "."
// alert( n );
            }
        }

        n += (a.substring(base,a.length)*1); //Explicitly not multiplied by "mult"; see inet_aton(3). "* 1" = "cast to int".

// alert(n);
        return n;
    }

    var debug = function(n, v) {
        if (!document.all) {
            console.log(n + ': ' + JSON.stringify(v));
        }
    }


    // end common functions

    var LoginView = Backbone.View.extend({
        el: $('body'),

        events: {
            'change input[name=\'auth_type\']' : 'setAuthLabel',
	    'change input[name=\'auth_type_forgot\']' : 'setAuthLabel_forgot',
	    'click      a#forgot_link'                      : 'showHide',
	    'click      input#cancel_forgot'                : 'logout',
	    'click	input#forgot_pass_otp'		    : 'forgotSendOtp',
	    'click	input#reset_password'		    : 'forgotResetPassword',
	    'click	input#generate_otp'		    : 'mfaGenerateOtp',
	    'click	input#cancel_login'		    : 'logout',
        },

        initialize: function() {
            this.setAuthLabel();

            if (window.PIE) {
                $('.rounded').each(function() {
                    PIE.attach(this);
                });
            }

        },

        setAuthLabel: function() {
            $('#authTypeLabel').text( $('input[name=\'auth_type\']:checked').val() );
            $('#authTypeLabel_forgot').text($('.auth_type_forgot:checked').val() );
            /*if ($('#authTypeLabel').length) {
                $('#authTypeLabel').text( $('input[name=\'auth_type\']:checked').val() );
            }
            if ($('#authTypeLabel_forgot').length) {
                $('#authTypeLabel_forgot').text( $('input[name=\'auth_type\']:checked').val() );
            }*/
        },
	setAuthLabel_forgot: function() {
            //$('#authTypeLabel_forgot').text( $('input[name=\'auth_type_forgot\']:checked').val() );
            $('#authTypeLabel_forgot').text($('.auth_type_forgot:checked').val());
        },
	showHide: function(event) {
	    event.preventDefault();
            $("#forgot_password").toggle();$("#login_password").toggle();
	    $('#forgot_pass_otp').prop('disabled', false);
	    $('#reset_password').prop('disabled', true);
	    $('#forgot_user_token').val('').prop('disabled', true);
	    $('#new_password').val('').prop('disabled', true);
	    $('#confirm_password').val('').prop('disabled', true);
	    $('#forgot_username').val('').prop('readonly',false);
	    $('#error_msg').empty();

        },
        forgotSendOtp: function(event){
	    event.preventDefault();
	    // validate username and delivery method is set before submit
	    if($('#forgot_username').val().trim().length < 1 || ('input[name="otp_mobile"]:checked').length < 1)
            {
                alert("Username cannot be blank, please enter in your CMI Admin Account Username to proceed.");
                return false;
            }
            if(('input[name="auth_type_for"]:checked').length < 1 )
            {
               alert("Please select the Authentication type");
               return false;
            }
            if($('#authlabeltype_forgot').val().trim().length < 1 )
            {
            	alert("APN/Realm cannot be blank, please enter in your CMI Admin Account APN/Realm to proceed.");
            	return false;
            }
     	    const tempInput = $('<input>', {
                type: 'hidden',
                name: $("#forgot_pass_otp").attr('name'),
                value:$("#forgot_pass_otp").val()
            });

            $('#forgot_pass_form').append(tempInput).submit(); 
            tempInput.remove(); 
	},
	logout: function() {
            location = '?action=logout';
        },
	forgotResetPassword: function(){
	    event.preventDefault();
	    if($('#forgot_username').val().trim().length < 1 || ('input[name="otp_mobile"]:checked').length < 1 )
        {
            alert("Username cannot be blank, please enter in your CMI Admin Account Username to proceed.");
            return false;
        }
        if(('input[name="auth_type_for"]:checked').length < 1 )
        {
            alert("Please select the Authentication type");
            return false;
        }
        if($('#authlabeltype_forgot').val().trim().length < 1 )
        {
            alert("APN/Realm cannot be blank, please enter in your CMI Admin Account APN/Realm to proceed.");
            return false;
        }
        if($('#forgot_user_token').val().trim().length < 1 || $('#new_password').val().trim().length < 1 ||  $('#new_password').val() != $('#confirm_password').val() )
        {
            alert("The entered New Password and Confirm New Password do not match, please ensure both inputs match before proceeding");
            return false;
        }
        const disAllowedPass = ['welcome','optus','abcd','guest','test','root','default','system','secret','access','password1','password1234','qwerty123','12345678','987654321','baseball','football','hockey','michael','jordan','shadow','buster','ginger','charlie','sparkle','tinkerbell','princess','dolphin','tiger','flower','purple','cheese','peanut','banana','sunflower','rainbow','pencil','summer2025','winter2025','admin', 'summer', 'winter', 'autumn', 'spring','sunday','monday','tuesday','wednesday','thrusday','friday','saturday','january','febuary','march','april','may','june','july','august','september','october','november','december','singtel','admin','macquarie'];
        p1= $('#new_password').val();
        p2= $('#confirm_password').val();
        if (p1.length < 12) {
            alert("The entered New Password does not meet system Password requirements. Please ensure the new password is between 12 and 32 characters in length, must not be a common password or dictionary word and it must also have at least one lowercase letter, uppercase letter, numeric and special character" );
            return false;
        }
        if (p1.length > 32) {
            alert("The entered New Password does not meet system Password requirements. Please ensure the new password is between 12 and 32 characters in length, must not be a common password or dictionary word and it must also have at least one lowercase letter, uppercase letter, numeric and special character" );
            return false;
        }
        var grps = 0;
        if (/[A-Z]/.test(p1)) {
            grps++;
        }
        if (/[a-z]/.test(p1)) {
            grps++;
        }
        if (/[0-9]/.test(p1)) {
            grps++;
        }
        if(/[!@#$%^&*]/.test(p1)){
            grps++;
        }
	
	const forbiddenEnding = /(@1|@123|123|123\$|@123\$)$/;
  	if (forbiddenEnding.test(p1)) {
    	    alert('Password must not end with @1, @123, 123, 123$, or @123$.');
	    return false;
  	}

  	// Check for repeated alphabetic characters (e.g., "aa", "bb", "cc", ...)
  	// Matches any ASCII letter appearing twice in a row.
  	const repeatedAlpha = /([a-zA-Z])\1/;
  	if (repeatedAlpha.test(p1)) {
    	    alert('Password must not have any characters that appear consecutively more than once.');
            return false;
  	}

        if (grps < 4) {
            alert("Password is not secure enough.\n\nUse more differing character types (ie. upper/lower case, digits,special characters such as '!@#$%^&*')." );
            return false;
        }
        pl = p1.toLowerCase();
        if(disAllowedPass.some(word=>pl.includes(word))){
            alert("The use of commonly used words in passwords is not allowed.");
            return false;
        }
        const tempInput = $('<input>', {
            type: 'hidden',
            name: $("#reset_password").attr('name'),
            value:$("#reset_password").val()
        });

        $('#forgot_pass_form').append(tempInput).submit(); 
        tempInput.remove();
	},
	mfaGenerateOtp: function(event){
        event.preventDefault();
        //input and validate email and phone before submit
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('#mfa_email').val()) || $('#mfa_email').val().length < 6){
            alert('The entered Email Address is invalid or blank, please correct before proceeding.');
            return false;
        }
        if ($('#phoneNumber').val().length > 1) {
            if(!/^04\d{8}$/.test($('#phoneNumber').val())){
                alert('The entered Mobile Number is invalid, please correct before proceeding.');
                return false;
            }    
        }
        const tempInput = $('<input>', {
            type: 'hidden',
            name: $("#generate_otp").attr('name'),
            value:$("#generate_otp").val()
        });

        $('#mfa_generate_otp').append(tempInput).submit(); 
        tempInput.remove();   

    }
    });
    var CustomersView = Backbone.View.extend({
        el: $('body'),
        events: {
            'click      a.addCustomerLink'              : 'showAddCustomerForm',
            'submit     form#customerForm'              : 'addCustomer',
            'click      table#customersList > tbody'    : 'editCustomer',

            'click      a.auditLink'                    : 'showAuditForm',
            'submit     form#auditForm'                 : 'getAudit',
            'click      input.auditButtons'             : 'getAudit'
        },

        initialize: function() {
// !!! move to common class
            var now         = new Date( $('#init_utc'   ).val() * 1000 );
            this.is_admin   = $('#init_is_admin'        ).val() == '1' ? true : false;
debug('is_admin', this.is_admin);

            if (this.is_admin) {
                $('.adminOnly').show();
            }
            else {
                $('.adminOnly').hide();
            }


            var yesterday = new Date( now.getTime() );
            yesterday.setDate(yesterday.getDate() - 1);
            var tomorrow = new Date( now.getTime() );
            tomorrow.setDate(tomorrow.getDate() + 1);

            $('#audit_from').datepicker({ dateFormat: "yy-mm-dd" });
            $('#audit_from').datepicker('setDate', now);
            $('#audit_to').datepicker({ dateFormat: "yy-mm-dd" });
            $('#audit_to').datepicker('setDate', tomorrow);

            if (window.PIE) {
                $('.rounded').each(function() {
                    PIE.attach(this);
                });
            }
        },

//*******************
//      New Customer
//*******************

        showAddCustomerForm: function() {
            $('input#addCustomerLink').hide();
            $('div#newCustomerPanel').show();
            $('#e_customer_name').focus();
            $('html, body').animate({ scrollTop: $('div#newCustomerPanel').offset().top }, 500);
        },

        addCustomer: function(event) {
            $('#e_customer_name').val( $('#e_customer_name').val().replace(/^\s+|\s+$/g,'') );
            if ($('#e_customer_name').val() == '') {
                alert('Please enter Customer Name.');
                return false;
            }

            if ($('#e_cust_type').val() == '') {
                alert('Please select Customer Type.');
                return false;
            }

            if ($('#e_access_level').val() == '') {
                alert('Please select Access Level.');
                return false;
            }

            get({
                method      : 'addCustomer',
                postData    : {
                    name        : $('#e_customer_name').val(),
                    cust_type   : $('#e_cust_type').val(),
                    access_level: $('#e_access_level').val(),
                },
                self    : this,
                done    : this.addCustomerDone,
                fail    : callFail
            });
            return false;
        },

        addCustomerDone: function(self, args, responseData) {
            location = '?edit=1&customer_id=' + responseData.customer_id;
        },

        editCustomer: function(event) {
            var e = this.$(event.target);
            this.customer_id = e.parent().data('customer_id');
            location = '?edit=1&customer_id=' + this.customer_id;
        },

//***************
//      Audit
//***************

        showAuditForm: function() {
            $('input#auditLink').hide();
            $('div#auditPanel').show();
            $('html, body').animate({ scrollTop: $('div#auditPanel').offset().top }, 500);
        },

        getAudit: function(event) {

            var e = this.$(event.target);

            var type = 'page';
            if (e.prop('tagName') == 'INPUT') {
                type = e.data('type');
            }
            var postData = {
                type        : type
            };

            $('#auditForm [id^=audit_]').each(function() {
                var name = $(this).prop('id').replace( 'audit_', '' );
                postData[name] = $(this).val();
            });


            $('#audit').hide();
            if (type == 'page') {
                get({
                    method      : 'getAudit',
                    postData    : postData,
                    self        : this,
                    done        : this.getAuditDone,
                    fail        : callFail
                });
                return false;
            }

            //var action = 'index.html?action=data&method=getAudit&' + $.param( postData );
            var action = 'index.html?action=data';
            $('form#exportForm').attr('action', action);
            // Add the postData as hidden inputs to the form
	        for (var key in postData) {
                if (postData.hasOwnProperty(key)) {
                    // Append hidden input fields for each item in postData
                    var existingInput = $('form#exportForm input[name="' + key + '"]');
                    if (existingInput.length) {
                        // If the hidden input already exists, update its value
                        existingInput.val(postData[key]);
                    }
                    else{
                        $('form#exportForm').append('<input type="hidden" name="' + key + '" value="' + postData[key] + '" />');
                    }

                }
            }
	        var existingMethod = $('form#exportForm input[name="method"]');
            if (existingMethod.length) {
                // If the hidden input already exists, update its value
                existingMethod.val('getAudit');
            }
            else{
                $('form#exportForm').append('<input type="hidden" name="method" value="getAudit" />');
            }
            $('form#exportForm')[0].submit();
            $('form#exportForm input[type="hidden"]').remove();
            return false;
        },


        getAuditDone: function(self, args, responseData) {
            responseData.bDestroy = true;
            responseData.oLanguage = {
                sSearch     : 'Filter records ',
                sLengthMenu : 'Records p.p. _MENU_ '
            };
            //responseData.sDom = 'rt<"bottom"flp"><"clear"><"bottom"i"><"clear">';
	    responseData.sDom = '<"top">rt<"bottom"flp><"clear"><"bottom-footer"i><"clear">';
            responseData.aaSorting = [2, 'desc'];
            if (typeof self.auditTable != 'undefined') {
                self.auditTable.fnClearTable();
                self.auditTable.fnDestroy();
                $('#audit').empty();
            }
            $('#audit').show().DataTable( responseData );
            self.auditTable = $('#audit').dataTable();
        },


    }); // end CustomersView

    var MainView = Backbone.View.extend({
        el: $('body'),
/*
        getURLParameter: function(name) {
            return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
        },
*/

        events: {
            'click      a#logoutButton'                     : 'logout',
            'click      a.deleteSubItemLink'                : 'deleteSubItem',

            'click      table.hi > tbody > tr'              : 'edit',
            'change     form'                               : 'formChanged',
            'click      a.cancelEdit'                       : 'cancelEdit',
            'submit     form'                               : 'submitForm',

            'click      a#deleteCustomerLink'               : 'deleteCustomer',

            'click      a#addVRFLink'                       : 'addVRF',
            'click      a#deleteVRFLink'                    : 'deleteVRF',
            'change     select#e_vrf_apn_type'              : 'setVRFControls',
            'click      a#addIPRangeLink'                   : 'addIPRange',
            'change     select#e_vrf_network_connectivity'  : 'setVRFControls',
            'change     select#e_vrf_static'                : 'checkIPRanges',

            'click      a#addAPNLink'                       : 'addAPN',
            'click      a.updateAPNLink'                    : 'updateAPN',
            'click      a.deleteAPNLink'                    : 'deleteAPN',

            'click      a#addDeviceLink'                    : 'addDevice',
            'click      a#deleteDeviceLink'                 : 'deleteDevice',
            'click      a#addLanLink'                       : 'addLan',
            'change     select#e_device_framed'             : 'toggleLans',

            'click      a#maintainAdminsLink'               : 'getAdmins',
            'click      a#addAdminLink'                     : 'addAdmin',
            'click      a#deleteAdminLink'                  : 'deleteAdmin',

            'click      a#runTestLink'                      : 'runTestByDeviceId',
            'click      a#getDevices_Page'                  : 'getDevices_Page',
            'change     select#getDevices_Page'             : 'getDevices_Page',
            

            'click      a#reportLink'                       : 'showReportForm',
            'change     input[name=\'reportName\']'         : 'switchReport',
            'submit     form#reportForm'                    : 'getReport',
            'click      input.reportButtons'                : 'getReport',

            'click      a.showBulkPanelLink'                : 'showBulkPanel',
            'click      a.openBulkTemplateLink'             : 'openBulkTemplate',
            'change     .btn-file :file'                    : 'fileSelected',
            'click     a.unlock_user_form'                 : 'unlock_user',
        },

        initialize: function() {
            $('.glyphicon-info-sign').popover();

            // Fix dataTables.bootstrap
            $('#viewDevice_wrapper').removeClass('form-inline');
            $('#viewDevice_wrapper').css('width', '100%');
            $('#viewDevice_length, #viewDevice_filter').addClass('form-inline');
            $('#viewDevice_length, #viewDevice_filter').css('width', 'auto');

            this.customer_id    = $('#init_customer_id' ).val();
            this.issuper        = $('#init_issuper'     ).val() == '1' ? true : false;
            this.usertype       = $('#init_usertype'    ).val();
            this.selected_VRF_id = 0;
            this.vrf = {};

            this.getCustomer();
            this.getVRFs();

            this.validationMsg = '\n\nPlease rectify the issue and try again.';

            var now = new Date( $('#init_utc').val() * 1000 );
            var yesterday = new Date( now.getTime() );
            yesterday.setDate(yesterday.getDate() - 1);
            var tomorrow = new Date( now.getTime() );
            tomorrow.setDate(tomorrow.getDate() + 1);

            $('#authDetail_from').datepicker({ dateFormat: "yy-mm-dd" });
            $('#authDetail_from').datepicker('setDate', now);
            $('#authDetail_to').datepicker({ dateFormat: "yy-mm-dd" });
            $('#authDetail_to').datepicker('setDate', tomorrow);

            $('#authSummary_from').datepicker({ dateFormat: "yy-mm-dd" });
            $('#authSummary_from').datepicker('setDate', now);
            $('#authSummary_to').datepicker({ dateFormat: "yy-mm-dd" });
            $('#authSummary_to').datepicker('setDate', tomorrow);

            $('#accDetail_ss_from').datepicker({ dateFormat: "yy-mm-dd" });
            $('#accDetail_ss_from').datepicker('setDate', yesterday);
            $('#accDetail_ss_to').datepicker({ dateFormat: "yy-mm-dd" });
            $('#accDetail_ss_to').datepicker('setDate', now);
            $('#accDetail_se_from').datepicker({ dateFormat: "yy-mm-dd" });
            $('#accDetail_se_from').datepicker('setDate', now);
            $('#accDetail_se_to').datepicker({ dateFormat: "yy-mm-dd" });
            $('#accDetail_se_to').datepicker('setDate', tomorrow);
            $('#accSummary_from').datepicker({ dateFormat: "yy-mm-dd" });
            $('#accSummary_from').datepicker('setDate', now);
            $('#accSummary_to').datepicker({ dateFormat: "yy-mm-dd" });
            $('#accSummary_to').datepicker('setDate', tomorrow);

            this.entities = ['Customer','Admin','VRF','Device'];
            this.abandonChangesPrompt = 'It appears you have made changes in the form.\n\nDo you wish to abandon the changes?\n\n';
            this.selectedReport = 'authDetail';

            if (window.PIE) {
                $('.rounded').each(function() {
                    PIE.attach(this);
                });
            }

        }, // end initialize

        logout: function() {
            location = '?action=logout';
        },
	
        deleteSubItem: function(event) {
            var e = this.$(event.target);
            $(e).closest('.panel').find('input[type="submit"]').prop('disabled', false);
            var f = e.closest('form');
            f.data('modified', true);

//console.log('table: ' + $(e).closest('table').prop('id'));
            if ($(e).closest('table').prop('id') == 'ipRanges') {
                this.checkIPRanges();
                $(e).parent().parent().remove();
                this.checkIPRanges();
                return;
            }
            $(e).parent().parent().remove();
        },

        edit: function(event) {
            if (this.$(event.target).hasClass('dataTables_empty')) {
                return;
            }
            var t = this.$(event.target).closest('table');
            if (!/^view/.test(t.prop('id'))) {
                return;
            }
            var entityName = t.prop('id').replace('view', '');
            if ($.inArray(entityName, this.entities) == -1) {
                return;
            }

            if (entityName == 'Device' && this.usertype == 'OB' && /-mgmt$/.test(this.vrf.vrf)) {
                return;
            }

            var f = $('form#' + entityName + 'Form').first();

            var selectedEl = this.$(event.target).parent();

            if ($('#edit' + entityName).is(":visible") || this['selected_' + entityName + '_id']) {

                if (this['selected_' + entityName + '_id'] != this.$(event.target).parent().data('id')) {
                    return;
                }

                if (f.data('modified') && !confirm(this.abandonChangesPrompt)) {
                    return;
                }
// alert('in edit 1');
                this.itemUnselected(this, entityName);

                selectedEl.addClass('hover');

                return;
            }

            if (!this.is_admin && entityName == 'Customer') {
                return;
            }

            selectedEl.parent().find('td').off( 'mouseenter mouseleave' );
            selectedEl.addClass( 'selected' );
            selectedEl.parent().find('tr').removeClass( 'hover' );


            if (entityName == 'VRF') {
                this.selected_VRF_id = selectedEl.data('id');
                this.vrf = this.vrfs[this.selected_VRF_id];
                this.vrf.managed = /-mgmt$/.test(this.vrf.vrf)
                this.getAPNs();
                if (this.vrf.apns) {
                    this.getDevices();
                }
                if (!this.is_admin) {
                    this.selected_VRF_id = selectedEl.data('id');
                    return;
                }
            }

            $('input[type="submit"]', f).prop('disabled', 'disabled');

            f.trigger('reset');

            switch (entityName) {
                case 'Customer':
                    this.selected_Customer_id = selectedEl.data('id');
                    $('#editCustomer').show();
                    this.getCustomer();
                    break;
                case 'Admin':
                    this.selected_Admin_id = selectedEl.data('id');
                    $('a#addAdminLink').hide();
                    $('#deleteAdminLink').show();
                    $('#editAdmin').show();
                    $("#e_admin_email").prop("disabled", false).closest("td").show();
                    $("#e_admin_phone").prop("disabled", false).closest("td").show();
                    this.getAdmin(this.selected_Admin_id);
                    break;
                case 'VRF':
                    $('#APNs > tbody > tr').remove();
                    $('#ipRanges > tbody > tr').remove();
                    $('a#addVRFLink').hide();
                    $('#deleteVRFLink').show();
                    $('#editVRF').show();
                    this.getVRF();
                    break;
                case 'Device':
                    this.selected_Device_id = selectedEl.data('id');
                    $('#lansDiv').hide();
                    $('#lans > tbody > tr').remove();
                    $('a#addDeviceLink').hide();
                    $('#deleteDeviceLink').show();

                    $('tr#editDeviceEl').detach().insertAfter(selectedEl);

                    $('#editDevice').show();
                    this.getDevice(this.selected_Device_id);
                    $('div#viewDevice_paginate').hide();
                    $('div#device_group').hide();
                    $('[aria-controls="viewDevice"]').prop('disabled', true).css('cursor', 'not-allowed');
                    $('#devicesHeader').hide();
                    $('#devicesDummyHeader').show();

//                    $('#viewDevice').dataTable({'bSort': false});

//                    var t = $('#viewDevice').DataTable();
//                    $('#viewDevice thead th').addClass('no-sort');

//                    var oTable = $('#viewDevice').DataTable();
//                    var oSettings = oTable.fnSettings();
////                    var len = oTable.fnGetData(0).length;
//                    var len = 8;
//
//                    for (var i = 0; i < len; i++) {
//                        oSettings.aoColumns[i].bSortable = false;
//                    }


//var x = $._data($('#viewDevice thead th').first().get(0), "events")
//console.log(JSON.stringify(x));

                    break;
            }
            if ($('#edit' + entityName).length) {
                $('html, body').animate({ scrollTop: $('#edit' + entityName).offset().top }, 500);
            }
        },

        formChanged: function(event) {
            var f = this.$(event.target).closest('form');
            var entityName = f.prop('id').replace('Form', '');
            if ($.inArray(entityName, this.entities) == -1) {
                return;
            }
            $('input[type="submit"]', f).prop('disabled', false);
            f.data('modified', true);
        },

        cancelEdit: function(event) {
            var f = this.$(event.target).closest('form');
            var entityName = f.prop('id').replace('Form', '');
            if ($.inArray(entityName, this.entities) == -1) {
                return;
            }
            if (f.data('modified') && !confirm(this.abandonChangesPrompt)) {
                return;
            }
            this.itemUnselected(this, entityName);
            $('html, body').animate({ scrollTop: $('#' + entityName + 'Panel').offset().top }, 500);
            //("#e_admin_email").show();
            //("#e_admin_phone").show();
	     $("#e_admin_email").prop("disabled", false).closest("td").show();
	     $("#e_admin_phone").prop("disabled", false).closest("td").show();
        },

        submitForm: function(event) {
            var f = this.$(event.target).closest('form');

            if (f.prop('id') == 'testForm') {
                $('#authTestResult').empty();
                get({
                    method      : 'runTest',
                    postData    : {
                        device_id           : this.selected_Device_id,
                        customer_id         : this.customer_id,
                        calling_station_id  : $('#test_calling_station_id').val(),
                        user                : $('#test_user').val(),
                        password            : $('#test_password').val(),
                        called_station_id   : $('#test_called_station_id').val()
                    },
                    self    : this,
                    done    : this.runTestByDeviceIdDone,
                    fail    : callFail
                });
                return false;
            }

            if (f.prop('id') == 'bulkForm') {
//                $('div#bulkPanel').data('bulk_type', bulkType);
// alert('?action=bulkactivate&apn_id=' + $('div#bulkPanel').data('apn_id'));
                f.prop( 'action', '?action=bulk' + $('div#bulkPanel').data('bulk_type') + '&apn_id=' + $('div#bulkPanel').data('apn_id') );
                return true;
            }

            var entityName = f.prop('id').replace('Form', '');
            if ($.inArray(entityName, this.entities) == -1) {
                return false;
            }
            if (f.data('modified')) {
                this['save' + entityName]();
            }
            return false;
        },

        itemUnselected: function(self, entityName){
            if ($.inArray(entityName, self.entities) == -1) {
                return;
            }
// alert('self.usertype: ' + self.usertype);
            if (entityName == 'Customer' && !self.is_admin) {
                return;
            }

            if (entityName == 'Device' && self.usertype == 'OB' && /-mgmt$/.test(self.vrf.vrf)) {
                return;
            }

            self['selected_' + entityName + '_id'] = 0;

            var f = $('form#' + entityName + 'Form');
            f.data('modified', false);
            $('input,select',f).prop('disabled', false);

            f.trigger('reset');

            $('#edit' + entityName).hide();

            switch (entityName) {
                case 'Admin':
                    if (!self.adminsLimitReached) {
                        $('a#addAdminLink').show();
                    }
                case 'VRF':
                    self.itemUnselected(self, 'Device');
                    $('div#bulkPanel').hide();
                    $('div#APNPanel').hide();
                    $('div#DevicePanel').hide();
//                    $('#authTestResult').empty().hide();
                    if (self.is_admin) {
                        $('a#addVRFLink').show();
                    }
                    break;
                case 'Device':
                    $('#testResultPanel').hide();
                    $('div#viewDevice_paginate').show();
                    $('div#device_group').show();
                    $('[aria-controls="viewDevice"]').prop('disabled', false).css('cursor', 'auto');
                    $('#devicesDummyHeader').hide();
                    $('#devicesHeader').show();
                    $('tr#editDeviceEl').detach().appendTo( $('table#editDeviceElHolder') );

//debug('self.devicesLimitReached', self.devicesLimitReached);
                    $('span#allocatedDevicesLimitReached').hide();
                    if (typeof self.devicesLimitReached == 'undefined' || self.devicesLimitReached) {
                        $('a#addDeviceLink').hide();
                        if (self.devicesLimitReached) {
                            $('span#allocatedDevicesLimitReached').show();
                        }
                        break;
                    }
                    if (self.usertype == 'OB' && self.vrf.managed) {
                        $('a#addDeviceLink').hide();
                        break;
                    }
                    $('a#addDeviceLink').show();
                    break;
            }

            $('#view' + entityName + ' > tbody > tr').removeClass( 'selected' );
            $('#view' + entityName + ' > tbody > tr').find('td:not(.dataTables_empty)').hover(
                function() { $(this).parent().addClass( 'hover' ); },
                function() { $(this).parent().removeClass( 'hover' ); }
            );

        },

        getNetmaskOptions: function(start, end, netmask) {
            var options = '';
/*
            if (netmask == '') {
                options += '<option value="" selected="">&lt; select netmask &gt;</option>';
            }
*/
            for (i = start; i <= end; i++) {
                options += '<option value="' + i + '"' + (netmask != '' && netmask == i ? ' selected=""' : '') + '>' + i + '</option>';
            }
            return options;
        },

        checkPassworddevice: function(p1, p2) {
	    const disAllowedPass = ['welcome','optus','abcd','guest','test','root','default','system','secret','access','password1','password1234','qwerty123','12345678','987654321','baseball','football','hockey','michael','jordan','shadow','buster','ginger','charlie','sparkle','tinkerbell','princess','dolphin','tiger','flower','purple','cheese','peanut','banana','sunflower','rainbow','pencil','summer2025','winter2025','admin', 'summer', 'winter', 'autumn', 'spring','sunday','monday','tuesday','wednesday','thrusday','friday','saturday','january','febuary','march','april','may','june','july','august','september','october','november','december','singtel','admin','macquarie'];
            if (p1 != p2) {
                alert("Passwords don't match." + this.validationMsg);
                return false;
            }
            if (p1 == 'xxxxxxxx') {
                return true;
            }
	    /*if (p1.length < 12) {
                alert("Password has to be at least 12 characters long." + this.validationMsg);
                return false;
            }*/
            if (p1.length > 32) {
                alert("Password cannot be longer than 32 characters." + this.validationMsg);
                return false;
            }
            var grps = 0;
            if (/[A-Z]/.test(p1)) {
                grps++;
            }
            if (/[a-z]/.test(p1)) {
                grps++;
            }
            if (/[0-9]/.test(p1)) {
                grps++;
            }
	    /*if(/[!@#$%^&*]/.test(p1)){
                grps++;
            }*/
            if (grps < 1) {
                alert("Device Password is not secure enough.\n\nUse more differing character types (ie. upper/lower case, digits)." + this.validationMsg);
                return false;
            }
 	    /*pl = p1.toLowerCase();
            if(disAllowedPass.some(word=>pl.includes(word))){
                alert("Usage of commonly used passwords is not permitted");
                return false;
            }*/
            return true;
        },


        checkPassword: function(p1, p2) {
            const disAllowedPass = ['welcome','optus','abcd','guest','test','root','default','system','secret','access','password1','password1234','qwerty123','12345678','987654321','baseball','football','hockey','michael','jordan','shadow','buster','ginger','charlie','sparkle','tinkerbell','princess','dolphin','tiger','flower','purple','cheese','peanut','banana','sunflower','rainbow','pencil','summer2025','winter2025','admin', 'summer', 'winter', 'autumn', 'spring','sunday','monday','tuesday','wednesday','thrusday','friday','saturday','january','febuary','march','april','may','june','july','august','september','october','november','december','singtel','admin','macquarie'];
            if (p1 != p2) {
                alert("Passwords don't match." + this.validationMsg);
                return false;
            }
            if (p1 == 'xxxxxxxx') {
                return true;
            }
            if (p1.length < 12) {
                alert("Password has to be at least 12 characters long." + this.validationMsg);
                return false;
            }
            if (p1.length > 32) {
                alert("Password cannot be longer than 32 characters." + this.validationMsg);
                return false;
            }
            var grps = 0;
            if (/[A-Z]/.test(p1)) {
                grps++;
            }
            if (/[a-z]/.test(p1)) {
                grps++;
            }
            if (/[0-9]/.test(p1)) {
                grps++;
            }
            if(/[!@#$%^&*]/.test(p1)){
                grps++;
            }
            if (grps < 4) {
                alert("Password is not secure enough.\n\nUse more differing character types (ie. upper/lower case, digits,special characters such as '!@#$%^&*')." + this.validationMsg);
                return false;
            }
            pl = p1.toLowerCase();
            if(disAllowedPass.some(word=>pl.includes(word))){
                alert("The use of commonly used words in passwords is not allowed.");
                return false;
            }

            return true;
        },

        checkIP: function(ip) {
            if (ip == '') {
                return true;
            }
            if (!/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)) {
                return false;
            }
            return true;
        },

// ****************
//     Customer
// ****************

        getCustomer: function() {
            get({
                method      : 'getCustomer',
                postData    : {
                    customer_id:    this.customer_id,
                },
                self    : this,
                done    : this.getCustomerDone,
                fail    : callFail
            });
        },

        getCustomerDone: function(self, args, responseData) {

            var d = responseData.customer;
            $.each(d, function( id, v ) {
                switch(id) {
                    case 'active':
                        $('#customer_' + id).html(v == 'Y' ? 'Active' : 'Suspended');
                        break;
                    default:
                       $('#customer_' + id).html(v);
                }
                $('#e_customer_' + id).val(v);
            });

            self.is_admin = responseData.is_admin == '1' ? true : false;

            if (self.is_admin) {
                $('.adminOnly').show();
            }
            else {
                $('.adminOnly').hide();
            }

            if (!self.is_admin) {
                $('html').addClass('ob');
            }
debug('is_admin', self.is_admin);

            if (d.cust_type == 'SMB') {
                //alert("Inside SMB true");
                $('#e_customer_segment').val('SMB').prop('disabled', 'disabled');
                $('a#maintainAdminsLink').show();
            }
            else {
                $('#e_customer_segment option[value=SMB]').remove();

                //alert ("Inside SMB else : " + self.is_admin + ":" + self.issuper);
                if (self.is_admin || self.issuper) {
                    $('a#maintainAdminsLink').show();
                }
            }
            if (!$('#editCustomer').is(":visible")) {
                self.itemUnselected(self, 'Customer');
            }
            self.selected_customer_id = self.customer_id;
            $('#viewCustomer > tbody > tr:first').data('id', self.customer_id);
            self.cust_type = d.cust_type;
            self.max_admins = +d.max_admins;
            self.max_devices = +d.max_devices;

            self.adminsLimitReached = +d.used_admins_count >= +d.max_admins;
            self.devicesLimitReached = +d.used_devices_count >= +d.max_devices;

            self.report_apns = responseData.report_apns;
	    	
        },

        saveCustomer: function() {
            $('#e_customer_name').val( $('#e_customer_name').val().replace(/^\s+|\s+$/g,'') );
            if ($('#e_customer_name').val() == '') {
                alert('Customer Name cannot be empty.' + this.validationMsg);
                return false;
            }
            $('#e_customer_max_devices').val( $('#e_customer_max_devices').val().replace(/\D/g,'') );
            if ($('#e_customer_max_devices').val() == '') {
                alert('End Users/Devices Allocated field cannot be empty.' + this.validationMsg);
                return false;
            }
            if ($('#e_customer_max_devices').val() < 1) {
                alert('End Users/Devices Allocated has to be greater than zero.' + this.validationMsg);
                return false;
            }
            $('#e_customer_max_admins').val( $('#e_customer_max_admins').val().replace(/\D/g,'') );
            if ($('#e_customer_max_admins').val() == '') {
                alert('Administrators Allocated field cannot be empty.' + this.validationMsg);
                return false;
            }
            if ($('#e_customer_max_admins').val() < 1) {
                alert('There has to be at least one admin.' + this.validationMsg);
                return false;
            }
            if ($('#e_customer_max_admins').val() > 256) {
                alert('There cannot be more than 256 admins.' + this.validationMsg);
                return false;
            }


            get({
                method      : 'saveCustomer',
                postData    : {
                    customer_id     : this.customer_id,
                    name            : $('#e_customer_name').val(),
                    comment         : $('#e_customer_comment').val(),
                    active          : $('#e_customer_active').val(),
                    company_id      : $('#e_customer_company_id').val(),
                    segment         : $('#e_customer_segment').val(),
                    access_level    : $('#e_customer_access_level').val(),
                    max_devices     : $('#e_customer_max_devices').val(),
                    max_admins      : $('#e_customer_max_admins').val(),
                },
                self    : this,
                done    : this.saveCustomerDone,
                fail    : callFail
            });
            return false;
        },

        saveCustomerDone: function(self, args, responseData) {
            self.itemUnselected(self, 'Customer');
            self.getCustomer();
            $('html, body').animate({ scrollTop: $('#CustomerPanel').offset().top }, 500);
        },

        deleteCustomer: function() {
            if (!confirm("All vrfs, devices, apns, ip_ranges and lans related to this Customer will be deleted.\n\nAre you sure you want to proceed?")) {
                return;
            }
            get({
                method      : 'deleteCustomer',
                postData    : {
                    customer_id : this.customer_id
                },
                self    : this,
                done    : this.deleteCustomerDone,
                fail    : callFail
            });
            return false;
        },

        deleteCustomerDone: function(self, args, responseData) {
            location = '?action=logout';
        },

// ***********
//     VRF
// ***********


        getVRFs: function() {
            $('#authTestResult').empty().hide();
            get({
                method      : 'getVRFs',
                postData    : {
                    customer_id:    this.customer_id,
                },
                self    : this,
                done    : this.getVRFsDone,
                fail    : callFail
            });
        },

        getVRFsDone: function(self, args, responseData) {
            self.vrfs = {};
            $('#viewVRF > tbody > tr').remove();
            var d = responseData.vrfs;
            $.each(d, function( i, row ) {
                $.each(row, function( n, v ) {
                    if (v == null) {
                        row[n] = '';
                    }
                });
                self.vrfs[row.vrf_id] = row;

                var vrf = row.vrf;
                var managedBy = 'Customer';
                if (/-aw-mgmt$/.test(row.vrf)) {
                    managedBy = 'Alphawest';
                    vrf = row.vrf.replace(/^(.*)-aw-mgmt$/, '$1');
                }
                else if (/-mgmt$/.test(row.vrf)) {
                    managedBy = 'Optus';
                    vrf = row.vrf.replace(/^(.*)-mgmt$/, '$1');
                }

                $('#viewVRF > tbody:last').append(
                    '<tr data-id="' + row.vrf_id + '">' +
                        '<td>' + (row.active == 'Y' ? 'Active' : 'Suspended')   + '</td>' +
                        '<td>' + vrf                                            + '</td>' +
                        '<td>' + managedBy                                      + '</td>' +
                        '<td>' + row.apns                                       + '</td>' +
                        '<td class="OBHide">' + row.apn_type                    + '</td>' +
                        '<td>' + row.realm                                      + '</td>' +
                        '<td>' + (row.authmethod == 'M' ? 'MSISDN' : row.authmethod == 'UP' ? 'U / P' : 'MSISDN / U / P') + '</td>' +
                        '<td>' + (row.static == 'Y' ? 'Yes' : 'No')             + '</td>' +
                        '<td>' + row.ip_ranges                                  + '</td>' +
                        '<td>' + row.used_hosts + ' / ' + row.available_hosts   + '</td>' +
                        '<td>' + row.product_type                               + '</td>' +
                        '<td>' + row.mobile_network                             + '</td>' +
                        '<td>' + row.network_connectivity                       + '</td>' +
                        '<td class="OBHide">' + (row.port_speed == '' ? 'NA' : row.port_speed)  + '</td>' +
                        '<td>' + ntoa(row.dns1) + ' ' + ntoa(row.dns2)          + '</td>' +
                        '<td>' + ntoa(row.wins1) + ' ' + ntoa(row.wins2)        + '</td>' +
                    '</tr>'
                );
            });
            self.itemUnselected(self, 'VRF');

            self.ip_ranges = {};
            $.each(responseData.ip_ranges, function( i, row ) {
                if (typeof self.ip_ranges[row.vrf_id] == 'undefined' ){
                    self.ip_ranges[row.vrf_id] = [];
                }
                self.ip_ranges[row.vrf_id].push(row);
            });
//console.log('self.ip_ranges: ' + JSON.stringify(self.ip_ranges));
        },

        getVRF: function() {
            get({
                method      : 'getVRF',
                postData    : {
                    vrf_id:         this.selected_VRF_id,
                    customer_id:    this.customer_id
                },
                self    : this,
                done    : this.getVRFDone,
                fail    : callFail
            });
        },

        getVRFDone: function(self, args, responseData) {
            $.each(responseData.vrf, function( id, v ) {
                switch(id) {
                    case 'vrf':
                        if (/-aw-mgmt$/.test(v)) {
                            $('#e_vrf_vrf').val( v.replace(/^(.*)-aw-mgmt$/, '$1') );
                            $('#e_vrf_managed_by').val( 'alphawest' );
                            break;
                        }
                        if (/-mgmt$/.test(v)) {
                            $('#e_vrf_vrf').val( v.replace(/^(.*)-mgmt$/, '$1') );
                            $('#e_vrf_managed_by').val( 'optus' );
                            break
                        }
                        $('#e_vrf_vrf').val( v );
                        break;
                    case 'dns1': case 'dns2': case 'wins1': case 'wins2':
                        $('#e_vrf_' + id).val(ntoa(v));
                        break;
                    case 'port_speed':
                        $('#e_vrf_' + id).val(v == null ? 'NA' : v);
                        break;
                    default:
                        $('#e_vrf_' + id).val(v == null ? '' : v);
                }
            });
            $.each(responseData.ip_ranges, function( i, row ) {
                $('#ipRanges > tbody:last').append(
                    '<tr>' +
                        '<td><input type="text" value="' + ntoa(row.subnet) + '" maxlength="15" class="form-control ipRange_subnet"></td>' +
                        '<td><select class="form-control ipRange_netmask">' + self.getNetmaskOptions( 16, 30, row.netmask ) + '</select> </td>' +
                        '<td><a class="deleteSubItemLink" href="javascript:void(0)">Delete</a></td>' +
                    '</tr>'
                );
            });

            self.setVRFControls();
        },

        checkIPRanges: function() {
           // if ($('#ipRanges > tbody > tr').length >= 8) {
           //     $("#ipRanges > tbody").find("tr:gt(7)").remove();
           //     $('#addIPRangeLink').hide();
           //     return;
           // }
            if ($('#e_vrf_static').val() == 'N' && $('#ipRanges > tbody > tr').length > 0) {
                $('#addIPRangeLink').hide();
                $("#ipRanges > tbody").find("tr:gt(0)").remove();
                return;
            }
            $('#addIPRangeLink').show();
        },

        addIPRange: function() {
            $('#ipRanges > tbody:last').append(
                '<tr>' +
                    '<td><input type="text" maxlength="15" class="form-control ipRange_subnet"></td>' +
                    '<td><select class="form-control ipRange_netmask">' + this.getNetmaskOptions( 16, 30, 24 ) + '</select></td>' +
                    '<td><a class="deleteSubItemLink" href="javascript:void(0)">Delete</a></td>' +
                '</tr>'
            );
            this.checkIPRanges();
        },

        addVRF: function() {
            this.selected_VRF_id = 0;
            $('#APNs > tbody > tr').remove();
            $('#ipRanges > tbody > tr').remove();
            $("#VRFForm")[0].reset();
            $('#deleteVRFLink').hide();
            $('a#addVRFLink').hide();
            $('#editVRF').show();
            $('#viewVRF td').off( 'mouseenter mouseleave' );
            this.setVRFControls();
            $('form#VRFForm input[type="submit"]').prop('disabled', 'disabled');
            $('html, body').animate({ scrollTop: $('#editVRF').offset().top }, 500);
        },

        setVRFControls: function() {
            var apn_type = $('#e_vrf_apn_type').val();
            if (apn_type == 'shared') {
                $('#e_vrf_realm'                ).prop('disabled', false);
                $('#e_vrf_managed_by'           ).prop('disabled', false);
                $('#e_vrf_network_connectivity' ).val('Evolve IP VPN'           ).prop('disabled', 'disabled');
//                $('#e_vrf_authmethod'           ).val('M,UP'                    ).prop('disabled', 'disabled');
                $('#m_auth_option'              ).hide();
                $('#e_vrf_static'               ).val('Y'                       ).prop('disabled', 'disabled');
                $('#e_vrf_product_type'         ).val('Wireless IP VPN Plus'    ).prop('disabled', 'disabled');
            }
            if (apn_type == 'private') {
                $('#e_vrf_realm'                ).val(''                        ).prop('disabled', 'disabled');
                $('#e_vrf_managed_by'           ).val('customer'                ).prop('disabled', 'disabled');
                $('#e_vrf_network_connectivity' ).prop('disabled', false);
//                $('#e_vrf_authmethod'           ).prop('disabled', false);
                $('#m_auth_option'              ).show();
                $('#e_vrf_static'               ).prop('disabled', false);
                $('#e_vrf_product_type'         ).prop('disabled', false);
            }

            var connectivity = $('#e_vrf_network_connectivity').val();
            if ($.inArray(connectivity, ['Evolve IP VPN', 'OPI', 'Frame Relay']) == -1) {
                $('#e_vrf_port_speed').val('NA').prop('disabled', true);
            }
            else {
                $('#e_vrf_port_speed').prop('disabled', false);
            }

            this.checkIPRanges();
        },

        saveVRF: function() {
            if ($('#e_vrf_apn_type').val() == '') {
                alert('APN Type hasn\'t been seleted.' + this.validationMsg);
                return false;
            }
            if ($('#e_vrf_mobile_network').val() == '') {
                alert('Mobile Network hasn\'t been seleted.' + this.validationMsg);
                return false;
            }
            if ($('#e_vrf_network_connectivity').val() == '') {
                alert('Network Connectivity hasn\'t been seleted.' + this.validationMsg);
                return false;
            }
            if ($('#e_vrf_authmethod').val() == '') {
                alert('Auth Method hasn\'t been seleted.' + this.validationMsg);
                return false;
            }
            if ($('#e_vrf_static').val() == '') {
                alert('Static IP option hasn\'t been seleted.' + this.validationMsg);
                return false;
            }
            if ($('#e_vrf_product_type').val() == '') {
                alert('Product Type hasn\'t been seleted.' + this.validationMsg);
                return false;
            }
            if (!/^[0-9]+$/.test( $('#e_vrf_loopback').val() )) {
                alert('Loopback has to be an integer.' + this.validationMsg);
                return false;
            }
            if ($('#e_vrf_apn_type').val() == 'shared') {
                var realm = $('#e_vrf_realm').val();
                if (realm == '') {
                    alert('If APN Type is "shared", "Realm" cannot be empty.' + this.validationMsg);
                    return false;
                }
                if (realm.length < 3) {
                    alert('Realm is too short. It has to be longer than 2 characters.' + this.validationMsg);
                    return false;
                }
                if (!/^[a-zA-Z0-9-]+$/.test(realm)) {
                    alert('Realm format is incorrect. It can only contain alphanumeric characters and hyphens (-).' + this.validationMsg);
                    return false;
                }
                if (!/^[a-zA-Z0-9]/.test(realm)) {
                    alert('Realm format is incorrect. It has to start with an alphanumeric character.' + this.validationMsg);
                    return;
                }
                if (!/[a-zA-Z0-9]$/.test(realm)) {
                    alert('Realm format is incorrect. It has to end with an alphanumeric character.' + this.validationMsg);
                    return false;
                }
                if ($('#e_vrf_loopback').val() == 0) {
                    alert('If APN Type is "shared", "Loopback" has to be greater than 0.' + this.validationMsg);
                    return false;
                }
            }
            $('#e_vrf_vrf').val( $('#e_vrf_vrf').val().replace(/^\s+|\s+$/g,'') );
            if ($('#e_vrf_vrf').val() == '') {
                alert('VRF cannot be empty.' + this.validationMsg);
                return false;
            }
            if (/-mgmt$/.test($('#e_vrf_vrf').val())) {
                alert('VRF cannot end in -mgmt.' + this.validationMsg);
                return false;
            }
            if (/-aw$/.test($('#e_vrf_vrf').val())) {
                alert('VRF cannot end in -aw.' + this.validationMsg);
                return false;
            }
            if (!this.checkIP( $('#e_vrf_dns1').val() )) {
                alert("DNS1 has to be a valid IP address or empty." + this.validationMsg);
                return false;
            }
            if (!this.checkIP( $('#e_vrf_dns2').val() )) {
                alert("DNS2 has to be a valid IP address or empty." + this.validationMsg);
                return false;
            }
            if (!this.checkIP( $('#e_vrf_wins1').val() )) {
                alert("WINS1 has to be a valid IP address or empty." + this.validationMsg);
                return false;
            }
            if (!this.checkIP( $('#e_vrf_wins2').val() )) {
                alert("WINS2 has to be a valid IP address or empty." + this.validationMsg);
                return false;
            }

            var ipRanges = [];
            var self = this;
            var ok = true;
            $('#ipRanges > tbody > tr').each(function() {
                var subnet = $(this).find('.ipRange_subnet').first().val();
                var netmask = $(this).find('.ipRange_netmask').first().val();
                if (subnet == '') {
                    alert('Subnet cannot be empty.' + self.validationMsg);
                    ok = false;
                    return false;
                }
                if (!self.checkIP( subnet )) {
                    alert("Subnet has to be a valid IP address." + self.validationMsg);
                    ok = false;
                    return false;
                }
                if (netmask == '') {
                    alert('Please select a netmask.' + self.validationMsg);
                    ok = false;
                    return false;
                }
                ipRanges.push( {subnet: aton(subnet), netmask: netmask} );
            });
            if (!ok) {
                return false;
            }
            if (ipRanges.length == 0) {
                alert('No IP Range has been specified.' + self.validationMsg);
                return false;
            }

            var vrf = $('#e_vrf_vrf').val();
            if ($('#e_vrf_managed_by').val() == 'optus') {
                vrf += '-mgmt';
            }
            if ($('#e_vrf_managed_by').val() == 'alphawest') {
                vrf += '-aw-mgmt';
            }

            get({
                method      : 'saveVRF',
                postData    : {
                    customer_id             : this.customer_id,
                    vrf_id                  : this.selected_VRF_id,
                    active                  : $('#e_vrf_active').val(),
                    vrf                     : vrf,
                    apn_type                : $('#e_vrf_apn_type').val(),
                    realm                   : $('#e_vrf_realm').val(),
                    authmethod              : $('#e_vrf_authmethod').val(),
                    static                  : $('#e_vrf_static').val(),
                    product_type            : $('#e_vrf_product_type').val(),
                    order_number            : $('#e_vrf_order_number').val(),
                    mobile_network          : $('#e_vrf_mobile_network').val(),
                    network_connectivity    : $('#e_vrf_network_connectivity').val(),
                    port_speed              : ( $('#e_vrf_port_speed').val() == 'NA' ? '' : $('#e_vrf_port_speed').val() ),
                    loopback                : $('#e_vrf_loopback').val(),
                    wins1                   : aton($('#e_vrf_wins1').val()),
                    wins2                   : aton($('#e_vrf_wins2').val()),
                    dns1                    : aton($('#e_vrf_dns1').val()),
                    dns2                    : aton($('#e_vrf_dns2').val()),
                    acl_in                  : $('#e_vrf_acl_in').val(),
                    acl_out                 : $('#e_vrf_acl_out').val(),
                    custom                  : $('#e_vrf_custom').val(),
                    comment                 : $('#e_vrf_comment').val(),
                    ip_ranges               : JSON.stringify(ipRanges)
                },
                self    : this,
                done    : this.modifyVRFDone,
                fail    : callFail
            });
            return false;
        },

        deleteVRF: function() {
            if (!confirm("All devices, apns, ip_ranges and lans related to this VRF will be deleted.\n\nThe VRF will be deleted instantly and all unsaved changes in the Device form will be lost.\n\nAre you sure you want to proceed?")) {
                return;
            }
            get({
                method      : 'deleteVRF',
                postData    : {
                    vrf_id      : this.selected_VRF_id,
                    customer_id : this.customer_id
                },
                self    : this,
                done    : this.modifyVRFDone,
                fail    : callFail
            });
            return false;
        },

        modifyVRFDone: function(self, args, responseData) {
            self.itemUnselected(self, 'VRF');
            self.getVRFs();
            $('html, body').animate({ scrollTop: $('#VRFPanel').offset().top }, 500);
        },



// ***************
//      APN
// ***************

        getAPNs: function() {
            get({
                method      : 'getAPNs',
                postData    : {
                    vrf_id:         this.selected_VRF_id,
                    customer_id:    this.customer_id
                },

                self    : this,
                done    : this.getAPNsDone,
                fail    : callFail
            });
        },

        getAPNsDone: function(self, args, responseData) {

            $('#APNs > tbody > tr').remove();

            $.each(responseData.apns, function( i, row ) {
                $('#APNs > tbody:last').append(
                    '<tr data-apn_id="' + row.apn_id + '">' +
                        '<td><input type="text" value="' + row.apn + '" maxlength="64" class="form-control apn OBDisable"></td>' +
                        '<td><a class="updateAPNLink OBHide" href="javascript:void(0)">Update</a> &nbsp; <a class="deleteAPNLink OBHide" href="javascript:void(0)">Delete</a></td>' +
                        '<td>' + (row.last_used == null ? '' : row.last_used) + '</td>' +
                        '<td><a data-bulk_type="activate" class="showBulkPanelLink" href="javascript:void(0)">Bulk Activate</a> &nbsp; &nbsp;<a data-bulk_type="replace" class="showBulkPanelLink" href="javascript:void(0)">Bulk Replace</a></td>' +
                    '</tr>'
                );
            });
            if (!self.is_admin) {
                $('.OBDisable').prop( 'disabled', true ).css('cursor', 'not-allowed');
            }
            $('div#APNPanel').show();
        },

        addAPN: function() {
            $('#APNs > tbody:last').append(
                '<tr data-apn_id="0">' +
                    '<td><input type="text" maxlength="64" class="form-control apn OBDisable"></td>' +
                    '<td><a class="updateAPNLink OBHide" href="javascript:void(0)">Save</a> &nbsp; <a class="deleteAPNLink OBHide" href="javascript:void(0)">Delete</a></td>' +
                    '<td></td>' +
                    '<td></td>' +
                '</tr>'
            );
        },

        updateAPN: function(event) {

            var eRow = this.$(event.target).closest('tr');
            var apn_id = eRow.data('apn_id');
            var apnEl = $(eRow).find('.apn').first();
            apnEl.val( apnEl.val().replace(/^\s+|\s+$/g,'') );
            var apn = apnEl.val();

            if (apn.length < 3) {
                alert('APN is too short. It has to be longer than 2 characters.' + this.validationMsg);
                return false;
            }
            if (!/^[a-zA-Z0-9.-]+$/.test(apn)) {
                alert('APN format is incorrect. It can only contain alphanumeric characters, full stops and hyphens (-).' + this.validationMsg);
                return false;
            }
            if (/\.{2,}/.test(apn)) {
                alert('APN format is incorrect. Consecutive full stops are not allowed.' + this.validationMsg);
                return false;
            }
            var ok = true;
            var validationMsg = this.validationMsg;
            $.each(apn.split('.'), function( i, label ) {
                if (!/^[a-zA-Z0-9]/.test(label)) {
                    alert('APN format is incorrect. Each label has to start with an alphanumeric character.' + validationMsg);
                    ok = false;
                    return;
                }
                if (!/[a-zA-Z0-9]$/.test(label)) {
                    alert('APN format is incorrect. Each label has to end with an alphanumeric character.' + validationMsg);
                    ok = false;
                    return false;
                }
            });
            if(!ok) {
                return false;
            }

            if (!confirm("The APN will be saved instantly and all unsaved changes in the VRF and Device forms will be lost.\n\nAre you sure you want to proceed?")) {
                return;
            }
            if (apn_id == 0) {
                get({
                    method      : 'insertAPN',
                    postData    : {
                        vrf_id      : this.selected_VRF_id,
                        customer_id : this.customer_id,
                        apn         : apn
                    },
                    self    : this,
                    done    : this.modifyAPNDone,
                    fail    : callFail
                });

            }
            else {
                get({
                    method      : 'updateAPN',
                    postData    : {
                        apn_id      : apn_id,
                        customer_id : this.customer_id,
                        apn         : apn
                    },
                    self    : this,
                    done    : this.modifyAPNDone,
                    fail    : callFail
                });
            }
        },

        deleteAPN: function(event) {
            var eRow = this.$(event.target).parent().parent();
            var apn_id = eRow.data('apn_id');
            if (apn_id == 0) {
                eRow.remove();
            }
            else {
                if (!confirm("All devices attached to this APN will be deleted.\n\nThe APN will be deleted instantly and all unsaved changes in the VRF and Device forms will be lost.\n\nAre you sure you want to proceed?")) {
                    return;
                }
                get({
                    method      : 'deleteAPN',
                    postData    : {
                        apn_id      : apn_id,
                        customer_id : this.customer_id
                    },
                    self    : this,
                    done    : this.modifyAPNDone,
                    fail    : callFail
                });
            }
        },

        modifyAPNDone: function(self, args, responseData) {
            self.getVRFs();
            self.getDevices();
            $('#editVRF').hide();
            $('#editDevice').hide();
//            $('html, body').animate({ scrollTop: $('#APNPanel').offset().top }, 500);
            $('html, body').animate({ scrollTop: $('#VRFPanel').offset().top }, 500);
        },

// ***************
//      Device
// ***************

        
        getDevices_Page: function(event, self, args) {

            //var eRow = this.$(event.target).closest('a');
            //var page_id = eRow.data('page_id');
            $("body").addClass("loading");
            var page_id = $('#getDevices_Page').val();
            $('#load_device_page').val(page_id);
            get({
                method      : 'getDevices',
                postData    : {
                    vrf_id      : this.selected_VRF_id,
                    customer_id : this.customer_id,
                    load_device_page : page_id
                },
                self    : this,
                done    : this.getDevicesDone,
                fail    : callFail
            });          
        },

        getDevices: function() {
            $('div#DevicePanel').show();
            $('#authTestResult').empty().hide();
            get({
                method      : 'getDevices',
                postData    : {
                    vrf_id      : this.selected_VRF_id,
                    customer_id : this.customer_id,
                    load_device_page : this.load_device_page
                },
                self    : this,
                done    : this.getDevicesDone,
                fail    : callFail
            });
        },

        getDevicesDone: function(self, args, responseData) {
            $('#viewDevice > thead > tr').remove();
            $('#viewDevice > tbody > tr').remove();

            responseData.devices.bDestroy = true;            
            responseData.devices.oLanguage = {
                sSearch:        'Filter records ',
                sLengthMenu:    'Records p.p. _MENU_ '
            };
	    responseData.devices.sDom='<"top"i>rt<"bottom"flp><"clear">';
            //responseData.devices.sDom = 'rt<"bottom"flp"><"clear"><"bottom"i"><"clear">';
	    //responseData.sDom = '<"top">rt<"bottom"flp><"clear"><"bottom-footer"i><"clear">';
            //console.log(responseData.devices);
            var total_devices = responseData.total_devices;
            var plimit = 5000;
            if (total_devices <= plimit * 2) {
                plimit = total_devices + 1;
            }

            var cpage = responseData.current_page;
            if(total_devices > plimit) {
                var pages = Math.ceil(total_devices/plimit);
                //alert(pages);
                var page_content = "";
                var pfrom, pto;
                var load_page;
                var u = 0;   
                page_content += '<div class="col-sm-4"></div><div class="col-sm-4"><select id="getDevices_Page" class="form-control">';             
                for(u=0; u < pages; u++) {
                    pfrom =  u*plimit;
                    pto = pfrom + plimit;
                    load_page = (u+1);                     
                    if(pto >= total_devices) { pto = total_devices; }
                    
                    if((cpage-1) == u)  {
                        //page_content += '<a data-page_id="'+load_page+'" id="getDevices_Page" href="javascript:void(0)" class="btn btn-info" disabled="disabled">Displaying '+pfrom+' to '+pto+' Devices</a>';
                        page_content += '<option value="'+load_page+'" selected >Displaying Devices from '+pfrom+' to '+pto+'</option>';
                    }
                    else
                    {
                        //page_content += '<a data-page_id="'+load_page+'" id="getDevices_Page" href="javascript:void(0)" class="btn btn-success">'+pfrom+' to '+pto+' </a>';
                        page_content += '<option value="'+load_page+'">Select to Load Devices from '+pfrom+' to '+pto+'</option>';
                    }                   
                } 
                page_content += '</select></div><div class="col-sm-4"></div>';               
                $('#device_group').html(page_content);
                $('#device_group').show();
            }
            $("body").removeClass("loading");
            $('#viewDevice').show().DataTable( responseData.devices );

            $('#viewDevice thead tr')
                .prop('id', 'devicesHeader')
                .clone()
                .appendTo( $('#viewDevice thead') )
                .prop('id', 'devicesDummyHeader')
                .hide();

            $('#devicesDummyHeader th')
                .removeClass('sorting_asc')
                .removeClass('sorting_desc')
                .addClass('sorting');


            $('select#e_device_apn_id > option').remove();
            $.each(responseData.vrf_apns, function( i, row ) {
                $('select#e_device_apn_id:last').append(
                    '<option value="' + row.apn_id +'">' + row.apn +'</option>'
                );
            });

            $('select#e_device_wan_ip > option').remove();
            $('select#e_device_wan_ip:last').append( '<option></option>' );
            $.each(responseData.freeips, function( i, ip ) {
                $('select#e_device_wan_ip:last').append(
                    '<option value="' + ip +'">' + ip +'</option>'
                );
            });

            self.itemUnselected(self, 'Device');
            $('#viewDevice_wrapper').removeClass('form-inline');
        },

        getDevice: function() {
            get({
                method      : 'getDevice',
                postData    : {
                    device_id:      this.selected_Device_id,
                    customer_id:    this.customer_id
                },
                self    : this,
                done    : this.getDeviceDone,
                fail    : callFail
            });
        },

        getDeviceDone: function(self, args, responseData) {
            var d = responseData.device;
            if (d.framed == 'Y') {
                var lans = responseData.lans;
                $.each(lans, function( i, row ) {
                    $('#lans > tbody:last').append(
                        '<tr>' +
                            '<td><input type="text" value="' + ntoa(row.subnet) + '" maxlength="15" class="form-control lan_subnet"></td>' +
                            '<td><select class="form-control lan_netmask">' + self.getNetmaskOptions( 16, 32, row.netmask ) + '</select></td>' +
                            '<td><input type="text" value="' + (row.metric == null ? '' : row.metric) + '" maxlength="15" class="form-control lan_metric"></td>' +
                            '<td><a class="deleteSubItemLink" href="javascript:void(0)">Delete</a></td>' +
                        '</tr>'
                    );
                });
                $('#lansDiv').show();
            }
            else {
                $('#lansDiv').hide();
            }
            $.each(d, function( id, v ) {
                switch(id) {
                    case 'wan_ip':
                        $('#e_device_wan_ip').children('option:first').val( ntoa(v) ).text( ntoa(v) );
                        $('#e_device_wan_ip').val(ntoa(v));
                        break;
                    default:
                        $('#e_device_' + id).val(v);
                }
            });
            $('#e_device_password').val('xxxxxxxx');
            $('#e_device_password_confirm').val('xxxxxxxx');

            if (self.usertype == 'OB' && self.vrf.managed) {
                self.setDeviceControls(self);
                $('#editDevice :input').prop('disabled', 'disabled');
                $('#editDevice a, #editDevice tfoot').hide();
            }
            else {
                $('#editDevice :input').prop('disabled', false);
                $('form#DeviceForm input[type="submit"]').prop('disabled', 'disabled');
                $('#editDevice a, #editDevice tfoot').show();
                self.setDeviceControls(self);
            }


        },

        toggleLans: function() {
            if ($('#e_device_framed').val() == 'Y') {
                $('#lansDiv').show();
            }
            else {
                $('#lansDiv').hide();
            }
        },

        addLan: function() {
            $('#lans > tbody:last').append(
                '<tr>' +
                    '<td><input type="text" maxlength="15" class="form-control lan_subnet"></td>' +
                    '<td><select class="form-control lan_netmask">' + this.getNetmaskOptions( 16, 32, 24 ) + '</select></td>' +
                    '<td><input type="text" maxlength="15" class="form-control lan_metric" value="210"></td>' +
                    '<td><a class="deleteSubItemLink" href="javascript:void(0)">Delete</a></td>' +
                '</tr>'
            );
        },

        addDevice: function() {
            this.selected_Device_id = 0;
            $('#lansDiv').hide();
            $('#lans > tbody > tr').remove();
            $("#DeviceForm")[0].reset();
            $('a#addDeviceLink').hide();
            $('#deleteDeviceLink').hide();
            $('#editDevice').show();
            $('#viewDevice td').off( 'mouseenter mouseleave' );
            $('#editDevice :input').prop('disabled', false);
            $('form#DeviceForm input[type="submit"]').prop('disabled', 'disabled');
            $('#editDevice a, #editDevice tfoot').show();
            this.setDeviceControls(this);
            $('#e_device_wan_ip').children('option:first').val( '' ).text( '' );
            $('#e_device_wan_ip').val( '' );
            $('html, body').animate({ scrollTop: $('#editDevice').offset().top }, 500);
        },

        setDeviceControls: function(self) {
            if (!self.is_admin) {
                $('.OBDisable').prop( 'disabled', true ).css('cursor', 'not-allowed');
            }
            if (self.vrf.authmethod == 'M') {
                $('#e_device_username').prop('disabled', 'disabled').val('');
                $('#e_device_password').prop('disabled', 'disabled').val('');
                $('#e_device_password_confirm').prop('disabled', 'disabled').val('');
            }
            else {
                $('#e_device_username').prop('disabled', false);
                $('#e_device_password').prop('disabled', false);
                $('#e_device_password_confirm').prop('disabled', false);
            }
            if (self.vrf.authmethod == 'UP') {
                $('#e_device_msisdn').prop('disabled', 'disabled').val('');
            }
            else {
                $('#e_device_msisdn').prop('disabled', false);
            }
            if (self.vrf.static == 'N') {
                $('#e_device_wan_ip').prop('disabled', 'disabled').val('');
                $('#e_device_wan_netmask').prop('disabled', 'disabled').val('');
                $('#e_device_framed').prop('disabled', 'disabled').val('N');
                $('#lansDiv').hide();
            }
        },

        saveDevice: function() {

            $('#e_device_username').val( $('#e_device_username').val().replace(/^\s+|\s+$/g,'') );
            $('#e_device_msisdn').val( $('#e_device_msisdn').val().replace(/^\s+|\s+$/g,'') );
            $('#e_device_wan_ip').val( $('#e_device_wan_ip').val().replace(/^\s+|\s+$/g,'') );
            $('#e_device_wan_netmask').val( $('#e_device_wan_netmask').val().replace(/^\s+|\s+$/g,'') );

            if (this.vrf.authmethod != 'UP') {
                if (!/^61\d{9}$/.test($('#e_device_msisdn').val())) {
					if (!/^65\d{12}$/.test($('#e_device_msisdn').val())) {
						alert('MSISDN has to be 11/14 digits long and has to start with 61 or 65.' + this.validationMsg);
						return false;
					}
                }
            }
            if (this.vrf.authmethod != 'M') {
                if ($('#e_device_username').val().length < 3) {
                    alert('Username is too short. It has to be longer than 2 characters.' + this.validationMsg);
                    return false;
                }
                if (!/^[a-zA-Z0-9._-]+$/.test( $('#e_device_username').val()) ) {
                    alert('Username format is incorrect. It can only contain alphanumeric characters, fullstops, hyphens (-) and underscores (_).' + this.validationMsg);
                    return false;
                }
                /*if (!this.checkPassworddevice( $('#e_device_password').val(), $('#e_device_password_confirm').val() )) {
                    return false;
                }*/
            }

            if (this.vrf.static == 'Y') {
                var ip_a = $('#e_device_wan_ip').val();
                if (ip_a == '') {
                    alert("WAN-IP cannot be empty." + this.validationMsg);
                    return false;
                }
                if (!this.checkIP( ip_a )) {
                    alert("WAN-IP has to be a valid IP address." + this.validationMsg);
                    return false;
                }

                var isInSubnet = false;

                if (this.ip_ranges[this.selected_VRF_id]) {

                    var start, count, end, ip;

                    var ip_n = aton( ip_a );
    //console.log('this.ip_ranges[this.selected_VRF_id]: ' + JSON.stringify(this.ip_ranges[this.selected_VRF_id]));

                    $.each(this.ip_ranges[this.selected_VRF_id], function( i, ipRange ) {

    //console.log('Math.pow(2, 32 - ipRange.netmask): ' + Math.pow(2, 32 - ipRange.netmask));

                        start = +ipRange.subnet + 1;
                        count = Math.pow(2, 32 - ipRange.netmask) - 2;
                        end  = start + count;

    //console.log('start: ' + start + ', count: ' + count + ', end: ' + end + ', ip: ' + ip_n);

                        if (ip_n >= start && ip_n <= end) {
                            isInSubnet = true;
                        }

                    });
                }
                if (!isInSubnet) {
                    alert('WAN-IP is not in specified IP Range(s)');
                    return false;
                }
                var t = $('#viewDevice').DataTable();
                var ipUsed = false;
                var selected_Device_id = this.selected_Device_id;

                $.each(t.data(), function(i, row) {
//console.log('i: ' + i + ', row[4]: ' + row['4'] + ', this.selected_Device_id: ' + selected_Device_id + ', row[DT_RowData][id]: ' + row['DT_RowData']['id'] + ', row: ' + JSON.stringify(row));
                    if (ip_a == row['4'] && selected_Device_id != row['DT_RowData']['id']) {
                        ipUsed = true;
                    }
                });

                if (ipUsed) {
                    alert('WAN-IP is already used.');
                    return false;
                }
            }

            var self = this;
            var ok = true;
            var lans = [];
            $('#lans > tbody > tr').each(function() {

                var subnet = $(this).find('.lan_subnet').first().val();
                var netmask = $(this).find('.lan_netmask').first().val();
                var metric = $(this).find('.lan_metric').first().val();
                if (subnet == '') {
                    alert('Subnet cannot be empty.' + self.validationMsg);
                    ok = false;
                    return false;
                }
                if (!self.checkIP( subnet )) {
                    alert("Subnet has to be a valid IP address." + self.validationMsg);
                    ok = false;
                    return false;
                }
                if (netmask == '') {
                    alert('Please select a netmask.' + self.validationMsg);
                    ok = false;
                    return false;
                }
                if (!/^[0-9]*$/.test( metric )) {
                    alert('Metric can only be empty or an integer.' + self.validationMsg);
                    ok = false;
                    return false;
                }
                if (metric > 255) {
                    alert('Metric has to be lower than 256.' + self.validationMsg);
                    ok = false;
                    return false;
                }
                lans.push({
                    subnet  : aton(subnet),
                    netmask : netmask,
                    metric  : metric
                });
            });
            if (!ok) {
                return false;
            }

            get({
                method      : 'saveDevice',
                postData    : {
                    customer_id : this.customer_id,
                    device_id   : this.selected_Device_id,
                    apn_id      : $('#e_device_apn_id').val(),
                    active      : $('#e_device_active').val(),
                    msisdn      : $('#e_device_msisdn').val(),
                    username    : $('#e_device_username').val(),
                    password    : $('#e_device_password').val(),
                    wan_ip      : aton($('#e_device_wan_ip').val()),
                    wan_netmask : $('#e_device_wan_netmask').val(),
                    framed      : $('#e_device_framed').val(),
                    comment     : $('#e_device_comment').val(),
                    form_token  : $('#e_device_form_token').val(),
                    lans        : JSON.stringify(lans)
                },
                self    : this,
                done    : this.modifyDeviceDone,
                fail    : callFail
            });
            return false;
        },

        deleteDevice: function() {
            get({
                method      : 'deleteDevice',
                postData    : {
                    customer_id : this.customer_id,
                    device_id   : this.selected_Device_id
                },
                self    : this,
                done    : this.modifyDeviceDone,
                fail    : callFail
            });
            return false;
        },

        modifyDeviceDone: function(self, args, responseData) {
            self.devicesLimitReached = responseData.used_devices_count >= self.max_devices;

            if (args.method == 'saveDevice' && args.postData.device_id > 0) {
                var t = $('#viewDevice').DataTable();
                var r = $('#viewDevice tr.selected').first();
                var d = t.row( r ).data();
                t.row( r ).data( responseData.device );
            }
            else {
                self.getDevices();
            }
            $('#lans > tbody > tr').remove();
            self.itemUnselected(self, 'Device');
            $('html, body').animate({ scrollTop: $('#DevicePanel').offset().top }, 500);
        },

// ***************
//      Admin
// ***************

        getAdmins: function() {
            // $('#maintainAdminsLink').hide(); 
            $('div#AdminPanel').show();
            get({
                method      : 'getAdmins',
                postData    : {
                    customer_id : this.customer_id
                },
                self    : this,
                done    : this.getAdminsDone,
                fail    : callFail
            });
        },

        getAdminsDone: function(self, args, responseData) {
            $('#viewAdmin > tbody > tr').remove();
            $('#LockedAdmin > tbody > tr').remove();
            var adminTypeMap = {
                    Y   : 'Super User',
                    N   : 'Admin',
                    AW  : 'Alphawest'
            };
	    let lockedAdminIds = new Set();
            $.each(responseData.admins, function( i, row ) {
                $.each(row, function( i, v ) {
                    if (v == null) {
                        row[i] = '';
                    }
                });
                if (self.is_admin || row['super'] != 'AW') {
			if (row['lock_user'] < '7') {
			$('#viewAdmin > tbody:last').append( 
                        '<tr data-id="' + row.admin_id + '">' +  
                            '<td>' + row.username                   + '</td>' +
                            '<td>' + adminTypeMap[ row['super'] ]   + '</td>' +
                            '<td>' + row.last_login                 + '</td>' +
                            //'<td>' + row.comment                    + '</td>' +
                        '</tr>'
                        );
			} else {
			    
			    if (!lockedAdminIds.has(row.admin_id)) {
                		lockedAdminIds.add(row.admin_id); 

			$('#LockedAdmin > tbody:last').append(
                        '<tr data-id="' + row.admin_id + '">' +
                            '<td style="pointer-events: none">' + row.username                   + '</td>' +
                            '<td style="pointer-events: none">' + adminTypeMap[ row['super'] ]   + '</td>' +
                            '<td style="pointer-events: none">' + row.last_login                 + '</td>' +
                            //'<td style="pointer-events: none">' + row.comment                    + '</td>' +
			    '<td><a data-bulk_type="'+ row.username +'" class="unlock_user_form" href="javascript:void(0)"><i class="fa fa-unlock-alt"></i></a></td>' +
//                            '<td><form class="unlock_user_form" id="'+ row.admin_id +'"method="post"><div><input id="customer_unlocked" value="'+ row.username +'"><button type="submit"><i class="fa fa-unlock-alt"></i></button></div></form></td>' +
                        '</tr>'
			);
			}
		    }
                }
            });
            self.itemUnselected(self, 'Admin');
            $('html, body').animate({ scrollTop: $('#AdminPanel').offset().top }, 500);
        },

        getAdmin: function() {
            get({
                method      : 'getAdmin',
                postData    : {
                    admin_id    : this.selected_Admin_id,
                    customer_id : this.customer_id
                },
                self    : this,
                done    : this.getAdminDone,
                fail    : callFail
            });
            $('#alphawest_admin').hide();
        },

        getAdminDone: function(self, args, responseData) {
            var d = responseData.admin;
            $('#e_admin_super').prop( 'disabled', d['super'] == 'AW' ? 'disabled' : false );
            $.each(d, function( id, v ) {
		if (id === "lock_user") {
		  if (v === "1") {
	                $('#e_admin_' + id).val(v);
		  }
		} else {
		    $('#e_admin_' + id).val(v);
		}
                if (id === "username") {
		    $('#e_admin_unlock' + id).val(v);
		} 
            });
            $('#e_admin_password').val('xxxxxxxx');
            $('#e_admin_password_confirm').val('xxxxxxxx');
        },

        addAdmin: function() {
            this.selected_Admin_id = 0;
            $("#AdminForm")[0].reset();
            $('a#addAdminLink').hide();
            $('#deleteAdminLink').hide();
            $('#editAdmin').show();
            $('#viewAdmin td').off( 'mouseenter mouseleave' );
            if (this.is_admin) {
                $('#alphawest_admin').show();
            }
            else {
                $('#alphawest_admin').hide();
            }
            $('html, body').animate({ scrollTop: $('#editAdmin').offset().top }, 500);
            //$("#e_admin_email").hide();
	    //$("#e_admin_email").prop("disabled", true).closest("td").hide();
	    //$("#e_admin_phone").prop("disabled", true).closest("td").hide();
            //$("#e_admin_phone").hide();
        },

        saveAdmin: function() {
            $('#e_admin_username').val( $('#e_admin_username').val().replace(/^\s+|\s+$/g,'') );
            if ($('#e_admin_username').val().length < 3) {
                alert('Username is too short. It has to be longer than 2 characters.' + this.validationMsg);
                return false;
            }
            //if (this.selected_Admin_id != 0) {
                if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('#e_admin_email').val()) || $('#e_admin_email').val().length < 6){
                    alert('Email Address is invalid' + this.validationMsg);
                    return false;
                }    
            
            	if ($('#e_admin_phone').val().length > 1) {
                   if(!/^04\d{8}$/.test($('#e_admin_phone').val())){
                	alert('Mobile number is invalid' + this.validationMsg);
                    	return false;
                    }    
            	}
	    //}
            if (!/^[a-zA-Z0-9@._-]+$/.test( $('#e_admin_username').val()) ) {
                alert('Username format is incorrect. It can only contain alphanumeric characters, full stops, hyphens (-), at characters (@) and underscores (_).' + this.validationMsg);
                return false;
            }
            if (!this.checkPassword( $('#e_admin_password').val(), $('#e_admin_password_confirm').val() )) {
                return false;
            }

            get({
                method      : 'saveAdmin',
                postData    : {
                    customer_id : this.customer_id,
                    admin_id    : this.selected_Admin_id,
                    username    : $('#e_admin_username').val(),
                    password    : $('#e_admin_password').val(),
                    super_user  : $('#e_admin_super').val(),
                    comment     : $('#e_admin_comment').val(),
                    email       : $('#e_admin_email').val(), 
                    phone       : $('#e_admin_phone').val(),
                    form_token  : $('#e_admin_form_token').val(),
                },
                self    : this,
                done    : this.modifyAdminDone,
                fail    : callFail
            });
            return false;
        },

        deleteAdmin: function() {
	    if (!confirm("Are you sure you want to delete the Admin?")) {
                return;
            }
            get({
                method      : 'deleteAdmin',
                postData    : {
                    admin_id    : this.selected_Admin_id,
                    customer_id : this.customer_id
                },
                self    : this,
                done    : this.modifyAdminDone,
                fail    : callFail
            });
            return false;
        },
//***************************
//      Unlock User
//***************************

	unlock_user: function(event) {
            var e = this.$(event.target);
            var bulkType = e.data('bulk_type');
            var e = e.closest('tr');
            var admin_id = e.data('id');
            if (confirm("Click on OK to unlock user")) {
 	        var id = $('.unlock_user_form').attr('data-id');
                var username = $('.unlock_user_form').attr('data-bulk_type');
                
                get({
                    method      : 'unlockUser',
                    postData    : {
                        username : $('.unlock_user_form').attr('data-bulk_type'),
                        admin_id : e.data('id'),
                        customer_id : this.customer_id
                    },
                    self    : this,
                    done    : location.reload(),
                    fail    : callFail
                });
	      } 
           },

        modifyAdminDone: function(self, args, responseData) {
            self.adminsLimitReached = responseData.used_admins_count >= self.max_admins;
            self.getAdmins();
            self.itemUnselected(self, 'Admin');
            $('html, body').animate({ scrollTop: $('#AdminPanel').offset().top }, 500);
        },
//***************
//  Test Auth
//***************

        runTestByDeviceId: function() {
            $('#authTestResult').empty();
            get({
                method      : 'runTestByDeviceId',
                postData    : {
                    device_id       : this.selected_Device_id,
                    customer_id     : this.customer_id
                },
                self    : this,
                done    : this.runTestByDeviceIdDone,
                fail    : callFail
            });
            return false;
        },

        runTestByDeviceIdDone: function(self, args, responseData) {
            $('#authTestResult').empty().show().text( responseData.testResult );
            $('#testResultPanel').show();
            $('html, body').animate({ scrollTop: $('div#testResultPanel').offset().top }, 500);


            $.each(responseData.testParams, function( i, v ) {
//console.log('i: ' + i + ' v: ' + v);
                $('form#testForm input#test_' + i).val(v);
            });

        },


//***************
//    Reports
//***************

        showReportForm: function() {

            $.each(this.report_apns, function( id, v ) {
//                $('#reportForm select[id$=_apn]:last').append(
                $('#reportForm select[id$=_apn]').append(
                    '<option value="' + v +'">' + v +'</option>'
                );
            });

            $('input#reportLink').hide();
            $('div#reportPanel').show();
            $('html, body').animate({ scrollTop: $('div#reportPanel').offset().top }, 500);
        },

        switchReport: function(event) {
            var e = this.$(event.target);
            this.selectedReport = e.prop('id').replace('Radio', '');
//            $('form#reportForm tbody').hide();
            $('form#reportForm tbody#' + this.selectedReport + 'Tbody').show().siblings('tbody').hide();


            if (typeof this.oTable != 'undefined') {
                //this.oTable.fnClearTable();
                //this.oTable.fnDestroy();
                $('#report').DataTable().clear();
                $('#report').DataTable().destroy();
                $('#report').empty();
            }


        },

        getReport: function(event) {

            var e = this.$(event.target);

            var type = 'page';
            if (e.prop('tagName') == 'INPUT') {
                type = e.data('type');
            }
            var postData = {
                report      : this.selectedReport,
                type        : type,
                customer_id : this.customer_id
            };

            var tmp = this.selectedReport + '_';

            $('[id^=' + this.selectedReport + '_]').each(function() {
                var name = $(this).prop('id').replace( tmp, '' );
                postData[name] = $(this).val();
            });

            if (this.selectedReport == 'accSummary'){
                var accSummary_fields = [];
                $('[name=accSummary_field]').each(function() {
                    if ($(this).prop('checked')) {
                        accSummary_fields.push( $(this).val() );
                    }
                });
                postData['fields'] = accSummary_fields.join();
            }

            if (type == 'page') {
                $('#report').hide();
                get({
                    method      : 'getReport',
                    postData    : postData,
                    self        : this,
                    done        : this.getReportDone,
                    fail        : callFail
                });
                return false;
            }

            //var action = 'index.html?action=data&method=getReport&' + $.param( postData );
            var action = 'index.html?action=data';
            $('form#exportForm').attr('action', action);
	    // Add the postData as hidden inputs to the form
	    for (var key in postData) {
    		if (postData.hasOwnProperty(key)) {
        	// Append hidden input fields for each item in postData
		   var existingInput = $('form#exportForm input[name="' + key + '"]');
                   if (existingInput.length) {
                       // If the hidden input already exists, update its value
                       existingInput.val(postData[key]);
                   }
		   else{
		       $('form#exportForm').append('<input type="hidden" name="' + key + '" value="' + postData[key] + '" />');
		   }

	    	}
            }
	    var existingMethod = $('form#exportForm input[name="method"]');
            if (existingMethod.length) {
                // If the hidden input already exists, update its value
                existingMethod.val('getReport');
            }
	    else{
		$('form#exportForm').append('<input type="hidden" name="method" value="getReport" />');
	    }
            $('form#exportForm')[0].submit();
	    $('form#exportForm input[type="hidden"]').remove();

        },


        getReportDone: function(self, args, responseData) {
            responseData.bDestroy = true;

            responseData.oLanguage = {
                sSearch:        'Filter records ',
                sLengthMenu:    'Records p.p. _MENU_ '
            };
            //responseData.sDom = 'rt<"bottom"flp"><"clear"><"bottom"i"><"clear">';
	        responseData.sDom = '<"top">rt<"bottom"flp><"clear"><"bottom-footer"i><"clear">';

// debug('args', args);
            if (args.postData.report == 'authDetail') {
                var ord = {
                    timestamp   : 0,
                    success     : 1,
                    username    : 2,
                    msisdn      : 3
                };
// debug('ord', ord);
                responseData.aaSorting = [[ord[args.postData.sortby], args.postData.sortorder]];
            }
            if (args.postData.report == 'accDetail') {
                var ord = {
                    ss_timestamp    : 0,
                    se_timestamp    : 1,
                    duration        : 2,
                    username        : 4,
                    msisdn          : 5,
                    usage_total     : 7
                };
// debug('ord', ord);
               responseData.aaSorting = [[ord[args.postData.sortby], args.postData.sortorder]];
           }
           
            $('#report').show().DataTable( responseData );

            self.oTable = $('#report').dataTable();

        },

//***************************
//      Bulk operations
//***************************

        showBulkPanel: function(event) {
            var e = this.$(event.target);
            var bulkType = e.data('bulk_type');
            var e = e.closest('tr');
            var apn_id = e.data('apn_id');
//alert('apn_id: ' + apn_id);
            $('div#bulkPanel').data('apn_id', apn_id);
            $('div#bulkPanel').data('bulk_type', bulkType);

            if (bulkType == 'activate') {
                $('.bulkActivate').show();
                $('.bulkReplace').hide();
            }
            else {
                $('.bulkActivate').hide();
                $('.bulkReplace').show();
            }
            $('div#bulkPanel').show();

            $('html, body').animate({ scrollTop: $('#bulkPanel').offset().top }, 500);
        },

        openBulkTemplate: function(event) {
            var e = this.$(event.target);
            var bulkType = e.data('bulk_type');

//alert( $('div#bulkPanel').data('apn_id') );

            var link = '?action=' + (bulkType == 'activate' ? 'enddevicetemplate' : 'enddevicefulllist') + '&apn_id=' + $('div#bulkPanel').data('apn_id');

//alert( link );

            location = link;
        },

        fileSelected: function(event) {
            var
                input       = this.$(event.target),
                numFiles    = input.get(0).files ? input.get(0).files.length : 1,
                label       = input.val().replace(/\\/g, '/').replace(/.*\//, '');


//console.log('input.files: ' + JSON.stringify(input.files));
//console.log('input.files[0]: ' + JSON.stringify(input.files[0]));


            $('#fileNameLabel').val(label);

//            alert('numFiles: ' + numFiles);
//            alert('label: ' + label);

        }

    });  // end MainView



//    var TestView = Backbone.View.extend({
//        el: $('div#testView'),
////        events: {
////            'click      a#showAuthTestLink' : 'showAuthTest',
////            'submit     form#testForm'      : 'runTest',
////        },
//        events: {
//            'click      a#runTestLink' : 'runTestByDeviceId'
//        },
//        initialize: function() {
//            this.customer_id    = $('#init_customer_id').val();
//        },



//        showAuthTest: function() {
//alert(MainView.selected_Device_id);
//            $('#test_device_id').val(MainView.selected_Device_id);
//            $('a#showAuthTestLink').hide();
//            $('form#testForm').show();
//            $('#test_calling_station_id').focus();
//
//            $('#test_calling_station_id'    ).val( $('#e_device_msisdn').val() );
//            $('#test_user'                  ).val(  );
//            $('#test_called_station_id'     ).val( $('#e_device_apn_id').val() );
//
//            this.runTest;
//        },
//
//        runTest: function(event) {
//            $('#authTestResult').empty();
//            get({
//                method      : 'runTest',
//                postData    : {
//                    device_id           : $('#test_device_id').val(),
//                    customer_id         : this.customer_id,
//                    calling_station_id  : $('#test_calling_station_id').val(),
//                    user                : $('#test_user').val(),
//                    password            : $('#test_password').val(),
//                    called_station_id   : $('#test_called_station_id').val()
//                },
//                self    : this,
//                done    : this.runTestDone,
//                fail    : callFail
//            });
//            return false;
//        },




//        runTestByDeviceId: function(event) {
//alert('here');
//alert(MainView.selected_Device_id);
//            $('div#testView').show();
//            $('#authTestResult').empty();
//            get({
//                method      : 'runTestByDeviceId',
//                postData    : {
//                    device_id       : MainView.selected_Device_id,
//                    customer_id     : this.customer_id
//                },
//                self    : this,
//                done    : this.runTestDone,
//                fail    : callFail
//            });
//            return false;
//        },
//
//        runTestByDeviceIdDone: function(self, args, responseData) {
//            $('#authTestResult').text( responseData.testResult );
//        }
//
//    });   // end TestView




//    if (/mainmenu/.test(location)) {
    if ($('#customersView').length > 0) {
        var customersView = new CustomersView();
	}
    if ($('#mainView').length > 0) {
        var mainView = new MainView();
    }
    if ($('#loginView').length > 0) {
        var loginView = new LoginView();
    }
//    if ($('#testView').length > 0) {
//        var testView = new TestView();
//    }


});
var uuid = ''; 
var pass = ''; 
var email = '';
var username = '';
var logged = '';

//-------------------------------------------------------------------------------------
// STATE

var bb_cookie_user = "bb-user";
var bb_cookie_user_hash = "bb-user-hash";
var bb_cookie_user_uuid = "bb-user-uuid";
var bb_cookie_user_email = "bb-user-email";
var bb_cookie_user_logged = "bb-user-logged";

function set_cookies(uuid, username, password, email, logged){
    $.cookie(bb_cookie_user, username, { expires: 720, path: '/' });
    $.cookie(bb_cookie_user_hash, password, { expires: 720, path: '/' });
    $.cookie(bb_cookie_user_uuid, uuid, { expires: 720, path: '/' });
    $.cookie(bb_cookie_user_email, email, { expires: 720, path: '/' });
    $.cookie(bb_cookie_user_logged, logged, { expires: 720, path: '/' });
}						
						
function sync_state(){
    var _username = $.cookie(bb_cookie_user);
    var _pass = $.cookie(bb_cookie_user_hash);
    var _email = $.cookie(bb_cookie_user_email);
    var _uuid = $.cookie(bb_cookie_user_uuid);
    var _logged = $.cookie(bb_cookie_user_logged);
    
    if(_username != null && _username != ""){
        username = _username;
    }
        
    if(_email != null && _email != ""){
        email = _email;
    }
        
    if(_uuid != null && _uuid != ""){
        uuid = _uuid;
    }
    
    if(_logged != null && _logged != ""){
        logged = _logged;
    }
    
    if(_pass != null && _pass != ""){
        pass = _pass;
    }
}

sync_state();

// required for device to read

function get_user(){
    sync_state();
    return username;
}

function get_user_email(){
    sync_state();
    return email;
}

function get_user_uuid(){
    sync_state();
    return uuid;
}

function get_user_pass(){
    sync_state();
    return pass;
}

function get_user_logged(){
    sync_state();
    return logged;
}

function get_test(){
    return 'test';
}

//-------------------------------------------------------------------------------------

function show_message(msg){
    $("#message").html(msg);
    $("#message").show();
}

function hide_message(){
    $("#message").hide();
}

function is_context(path){
    href = document.location.href;
    if(href.indexOf(path) > -1)
        return true;
    return false;
}

//-------------------------------------------------------------------------------------
// REGISTER


function registration_handler() {
    
    completed = $("#form-registration").validationEngine({ returnIsValid: true });
    if (completed) {
    
        // get existing if user signed up
        // else just make one
        
        uuid = Math.uuid();
        
        var profile_api = new bb.rewards.profile();
        // CALL REG SERVICE 
        profile_api.set_profile_by_uuid
        (
            '', //status
            $("#username").val(), 
            $("#address1").val(), 
            $("#address2").val(), 
            true, // active
            b64_sha1($("#password").val()), 
            $("#state_province").val(), 
            $("#city").val(), 
            uuid, 
            $("#zip").val(), 
            get_current_date(), 
            $("#dob").val(), 
            $("#gender").val(), 
            $("#twittername").val(), 
            '', 
            get_current_date(), 
            $("#country").val(), 
            $("#email").val(),
            profile_api.set_profile_by_uuid_callback
        );
    }
}

function handle_set_profile_by_uuid(data){
    _log("data:");
    _log(data);
    
    if(data.data)
    {
        _log("data logged in");
        _log("bb-username: ", $("#username").val());
        _log("bb-email: ", $("#email").val());
        _log("bb-pass: ", b64_sha1($("#password").val()));
        _log("bb-uuid: ", uuid);
        _log("bb-user-logged: ",1);
        
        set_cookies(uuid, $("#username").val(), b64_sha1($("#password").val()), $("#email").val(), 1);
        
        sync_state();
        
        // If successful redirect to questions
        var url = '/device/iphone/profile/questions';
        url = url + '/c/' + webutil.get_url_param_value("c");
        url = url + '/a/' + webutil.get_url_param_value("a");
        url = url + '/uuid/' + uuid;
        url = url + '/user/' + $("#username").val();
        url = url + '/email/' + $("#email").val();

        splashFadeIn();
        document.location = url;
     }
     else{
         $.validationEngine.buildPrompt('#username', 'Error creating profile, please try again.', 'error');
         _log("no data");
     }
 }

function error_set_profile_by_uuid(data){
    show_message("Error setting profile:" + data.message);
}

//-------------------------------------------------------------------------------------
// LOGIN

function login_handler() {
    completed = $("#form-profile-login").validationEngine({ returnIsValid: true });
    if (completed) {

        var profile_api = new bb.rewards.profile();
        // CALL REG SERVICE 
        profile_api.get_profile_list_by_username_list_by_password
         (
            $("#username").val(),
            b64_sha1($("#password").val()),
            profile_api.get_profile_list_by_username_list_by_password_callback
         );
    }
}

function handle_get_profile_list_by_username_list_by_password(data){
    _log("data:");
    _log(data);
    
    if(data.data.length > 0)
    {
        _log("data logged in");
        _log("bb-user: ",data.data[0].username);
        _log("bb-user-logged: ",1);
        
        set_cookies(data.data[0].uuid, data.data[0].username, data.data[0].password, data.data[0].email, 1);
                
        sync_state();
        
        // If successful redirect to questions
        var url = '/device/iphone/profile/questions';
        url = url + '/c/' + webutil.get_url_param_value("c");
        url = url + '/a/' + webutil.get_url_param_value("a");
        url = url + '/uuid/' + data.data[0].uuid;
        url = url + '/user/' + data.data[0].username;
        url = url + '/email/' + data.data[0].email;

        splashFadeIn();
        document.location = url;        
     }
     else{
         $.validationEngine.buildPrompt('#username', 'Username and password not found, please try again.', 'error');
        _log("no data");
     }

 }

function error_get_profile_list_by_username_list_by_password(data){
    show_message("Error getting profile by username:" + data.message);
}

//-------------------------------------------------------------------------------------
function footest(){
    return "footest";
}

function is_null_or_empty(obj) {
    if (obj == null)
        return true;
    if (obj == "")
        return true;
    if (obj == undefined)
        return true;
    return false;
}

//-------------------------------------------------------------------------------------
$(document).ready(function() {
    sync_state();
    complete_form_page();

    href = document.location.href;
    gamer = webutil.get_url_param_value(href, 'gamer');
    
});

//-------------------------------------------------------------------------------------
 
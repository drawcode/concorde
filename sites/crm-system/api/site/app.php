<?php 

/* API SITE */

Flight::route('/api/api*', function(){
    echo 'api';
});

Flight::route('/api/api/*', function(){
    echo 'api';
});

/* SITE */

Flight::route('POST /api/login', function(){
    
    $username = WebApp::GetParam('username');
    $password = WebApp::GetParam('password');
    
    $msg = "Incorrect authentication information, please try again";
    
    if($username == Auth::$adminUser
       && $password == Auth::$adminPass) {
        // TODO move this to user system
        Auth::setAdminLoggedIn();
        Urls::redirect('/api/');
    }
    else {
        Flight::view()->assign('msg', $msg);
        Flight::view()->display('login.tpl');
    }
});

Flight::route('GET /api/login', function(){
    
    $msg = "Enter your username and password to access.";
    Flight::view()->assign('msg', $msg);
    Flight::view()->display('login.tpl');
});

Flight::route('/api/logout', function(){
    Auth::setAdminLoggedOut();
    Urls::redirect('/api/');
});

Flight::route('/', function(){
    if(Auth::validateAuthorizationFlight()) {
        Flight::view()->display('index.tpl');
    }
});

/* WILDCARD - ALL */

Flight::route('*', function(){
    
    if(Auth::validateAuthorizationFlight()) {
        Flight::view()->display('index.tpl');
    }
});

?>
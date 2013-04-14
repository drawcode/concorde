<?php

class Auth {
    
    public static $adminUser = 'admin';
    public static $adminPass = 'TODOHOOKUPTODB';
    public static $loginRoute = '/api/login';
    public static $logoutRoute = '/api/logout';
    
    public static function getAdminCookieName() {
        $adminCookie = Contents::shortCode(AppSettings::$SITE_ROOT.'-admin');
        return $adminCookie;
    }
    
    public static function getAdminCookieAuthValue() {
        $authValue = Contents::shortCode(AppSettings::$SITE_ROOT.'-auth');
        return $authValue;
    }
    
    public static function checkAdminAuthenticated() {
        $adminCookie = Auth::getAdminCookieName();
        if(Cookie::Exists($adminCookie)) {
            // Just an admin check
            // TODO make this secure
            if(Cookie::Get($adminCookie)
               == Auth::getAdminCookieAuthValue()) {
                return true;
            }
        }
        return false;
    }
    
    public static function setAdminLoggedIn() {
        $adminCookie = Auth::getAdminCookieName();
        $authValue = Auth::getAdminCookieAuthValue();
        Cookie::Delete($adminCookie, '/', '.'.Urls::getUrlTLD());
        Cookie::Set($adminCookie, $authValue, Cookie::Lifetime, '/', '.'.Urls::getUrlTLD());
    }
    
    public static function setAdminLoggedOut() {
        $adminCookie = Auth::getAdminCookieName();
        Cookie::Delete($adminCookie, '/', '.'.Urls::getUrlTLD());
    }
    
    public static function validateAuthorizion($loginurl = "/api/login") {
        if(!Auth::checkAdminAuthenticated()) {
            // redirect to login
            Urls::redirect($loginurl);
            return false;
        }
        return true;
    }
    
    public static function validateAuthorizationFlight() {
        if(!Auth::checkAdminAuthenticated()) {    
            //Flight::redirect(Auth::$loginRoute);
            Urls::redirect(Auth::$loginRoute);
            Flight::stop();
            return false;
        }
        return true;        
    }
    
    public static function setUuid() {        
        Cookie::Set('uuid', UUID::v4(), Cookie::Lifetime, '/', '.'.Urls::getUrlTLD());
    }
    
    public static function getUuid() {        
        return Cookie::Get('uuid','');
    }
}

?>
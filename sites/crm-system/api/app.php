<?php
ini_set('display_errors',1); 
error_reporting(E_ALL);
date_default_timezone_set('America/Los_Angeles');

$script_tz = date_default_timezone_get();

/* SETTINGS */
require_once 'platform/libs/AppSettings.php';
$docroot = $_SERVER['DOCUMENT_ROOT'];
AppSettings::$TEMPLATE_PATH = $docroot.'/api/templates/crm-system/';
AppSettings::$CACHE_PATH = $docroot.'/api/cache/crm-system/';
AppSettings::$DB_PATH = $docroot.'/api/data/';
AppSettings::$DB_NAME = 'crm-system.db';      
AppSettings::$CONNECTION_STRING = "sqlite:".AppSettings::$DB_PATH.AppSettings::$DB_NAME;
AppSettings::$SITE_ROOT = "example.com";


/* LIBS */
require_once 'libs/php/flight/Flight.php'; // routes - http://flightphp.com/
require_once 'libs/php/idiorm/idiorm.php'; // db - basic orm - http://j4mie.github.com/idiormandparis/
require_once 'libs/php/paris/paris.php'; //models - http://j4mie.github.com/idiormandparis/
require_once 'libs/php/smarty/Smarty.class.php'; //templating - http://www.smarty.net/
//

/* PLATFORM */
require_once 'platform/libs/UUID.php';
require_once 'platform/libs/Urls.php';
require_once 'platform/libs/Contents.php';
require_once 'platform/libs/Cookie.php';
require_once 'platform/libs/Cache.php';
require_once 'platform/libs/Utils.php';
require_once 'platform/libs/Auth.php';
require_once 'platform/libs/WebApp.php';

/* SETUP */
ORM::configure(AppSettings::$CONNECTION_STRING);
//Model::$auto_prefix_models = '\\db\\';
//ORM::configure('logging', true);

Flight::register('view', 'Smarty', array(), function($smarty){
    $smartyPath = AppSettings::$TEMPLATE_PATH;
    $smarty->template_dir = $smartyPath.'templates\\';
    $smarty->compile_dir = $smartyPath.'templates_c\\';
    $smarty->config_dir = $smartyPath.'config\\';
    $smarty->cache_dir = $smartyPath.'cache\\';
});

/* APPS */
require_once 'platform/libs/CRM.php';

/* SERVICES */
require_once 'services/crm.php';

/* ADMIN */
require_once 'admin/app.php';

/* DEFAULT SITE */
require_once 'site/app.php';

/* INIT */
Flight::start();

?>
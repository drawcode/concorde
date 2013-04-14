<?php 

require_once 'libs/php/jsmin.php';

/* TOOLS SITE */

Flight::route('/api/tools/jsmin/*', function($file){
    
    $path = $_SERVER["REQUEST_URI"];
    $path = str_replace("services/","api/", $path);
    
    echo $path;
    
});

Flight::route('/api/tools/*', function(){
    echo 'api';
    //Flight::view()->assign($data);
    //Flight::view()->display('index.tpl'); 
});

?>
<?php

Flight::route('GET /api/api/crm/crm-number-campaign-meta/referrer/@referrer/?', function($referrer){
    $crm = new CRMNumberCampaignMetaData();
    
    $code = '0';
    $error = 0;
    $msg = 'Success item';
    $info = NULL;
    $data = NULL;
    $name = 'crm-number-campaign-meta';
    
    $count = $crm->countByReferrer($referrer);
   
    if($count > 0) {       
        $data = $crm->getByReferrer($referrer);
    }  
    
    $output = WebApp::GetWrapper($code, $data, $msg, $error, $name, $info);        

    
    echo $output;
});

Flight::route('GET /api/api/crm/crm-number-campaign-meta/code/@shortCode/?', function($shortCode){
    $crm = new CRMNumberCampaignMetaData();
    $code = '0';
    $error = 0;
    $msg = 'Success item';
    $info = NULL;
    $data = NULL;
    $name = 'crm-number-campaign-meta';
    
    $count = $crm->countByCode($shortCode);
   
    if($count > 0) {       
        $data = $crm->getByCode($shortCode);
    }  
    
    $output = WebApp::GetWrapper($code, $data, $msg, $error, $name, $info);
    
    echo $output;
});

Flight::route('GET /api/api/crm/crm-number-campaign-meta/@id/?', function($id){
    $crm = new CRMNumberCampaignMetaData();
    
    $code = '0';
    $error = 0;
    $msg = 'Success item';
    $info = NULL;
    $data = NULL;
    $name = 'crm-number-campaign-meta';
    
    $count = $crm->countById($id);
   
    if($count > 0) {       
        $data = $crm->getById($id);
    }   
    
    $output = WebApp::GetWrapper($code, $data, $msg, $error, $name, $info);
    
    echo $output;
});

Flight::route('POST /api/api/crm/crm-number-campaign-meta/@id/@action/?', function($id, $action){

    $crm = new CRMNumberCampaignMetaData();    
    
    $code = '0';
    $error = 0;    
    $data = false;
    $msg = 'Success remove item';
    $info = NULL;
    $name = 'crm-number-campaign-meta';
    
    $auth = WebApp::GetParam('auth');
    $shortCode = WebApp::GetParam('shortCode');
    $shortCodeCheck = Contents::shortCode($auth.'-'.$id.'-'.$action.'-crmauth');
    
    //echo '<p>auth'.$auth;
    //echo '<p>shortCode'.$shortCode;
    ///echo '<p>shortCodeCheck'.$shortCodeCheck;
    //echo '<p>';

    if($shortCode == $shortCodeCheck) {
        
    //echo '<p>eq'.true;
    //echo '<p>action'.$action;
        
        if($action == "delete") {    
            $count = $crm->countById($id);  
    //echo '<p>count'.$count; 
            if($count > 0) {
                $data = $crm->deleteById($id);
            }
        }
    }
    else {
        $code = '1';
        $msg = 'Error deleting ';
    }
    
    
    $output = WebApp::GetWrapper($code, $data, $msg, $error, $name, $info);
    
    echo $output;
});

Flight::route('POST /api/api/crm/crm-number-campaign-meta/@id/?', function($id){
    $crm = new CRMNumberCampaignMetaData();
    
    $count = $crm->countById($id);
    
 
    if($count > 0) {
        $item = $crm->getById($id);
        $item->date_updated = date('Y-m-d H:i:s');
        $item->status = 'u';
    }
    else {        
        $item = new CRMNumberCampaignMetaData();
        $item->id = UUID::v4();
        $item->date_created = date('Y-m-d H:i:s');
        $item->date_updated = date('Y-m-d H:i:s');
        $item->status = 'a';
    }
    
    if($item->date_created == '') {
        $item->date_created = date('Y-m-d H:i:s');
        $item->date_updated = date('Y-m-d H:i:s');    
    }
    
    $number = WebApp::GetParam('number');
    $referrer = WebApp::GetParam('referrer');
    $display_name = WebApp::GetParam('display_name');
    $active = WebApp::GetParam('active');

    if(isset($referrer) && $referrer != "") {
        $item->referrer = $referrer;
        $item->code = Contents::shortCode($item->referrer);
    }
    if(isset($number) && $number != "") {
        $item->number = $number;
    }
    
    if(isset($active) && $active != "") {
        $item->active = $active;
    }
    if(isset($display_name) && $display_name != "") {
        $item->display_name = $display_name;
    }
    
    
    $item->id = $id;
        
    $success = $item->setObject();//->save;//$crm->setModel($item); // insert or update

    if($success) {
        $code = '0';
        $error = 0;
        $msg = "Success"; 
    }
    else {
        $code = '1';
        $error = 1;
        $msg = "Failed save";      
    }
    
    $data = $item;
    $info = NULL;
    $name = 'crm-number-campaign-meta';
    
    $output = WebApp::GetWrapper($code, $data, $msg, $error, $name, $info);
    
    echo $output;
});

Flight::route('GET /api/api/crm/crm-number-campaign-meta/', function(){
    $crm = new CRMNumberCampaignMetaData();
    $code = '0';
    $data = $crm->getAll();
    $error = 0;
    $msg = 'Success';
    $info = NULL;
    $name = 'crm-number-campaign-meta';
    
    $output = WebApp::GetWrapper($code, $data, $msg, $error, $name, $info);
    
    echo $output;
});

Flight::route('/api/api/crm', function(){
    $apis = array();
    array_push($apis,
                       '/api/api/crm/crm-number-campaign-meta/',
                       '/api/api/crm/crm-number-campaign-meta/[code]/');
    
    $code = '0';
    $data = $apis;
    $error = 0;
    $msg = 'Success';
    $info = NULL;
    $name = 'crm-apis';
    
    $output = WebApp::GetWrapper($code, $data, $msg, $error, $name, $info);
    
    echo $output;
    
});

?>
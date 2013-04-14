<?php

Flight::route('/api/admin/api', function(){
    if(Auth::validateAuthorizationFlight()) {
        Flight::view()->display('admin-api.tpl');
    }
});

Flight::route('/api/admin/crm', function(){
    if(Auth::validateAuthorizationFlight()) {
        Flight::view()->display('admin-crm.tpl');
    }
});

Flight::route('/api/admin/test', function(){
    if(Auth::validateAuthorizationFlight()) {
        Flight::view()->display('admin-crm-test.tpl');
    }
});

Flight::route('/api/admin/setup/@code/', function($code){
    if(Auth::validateAuthorizationFlight()) {
        
        $output = '';
        $output.="<p>setting up:".$code;
    
        if(isset($code)) {
            if($code == "crm-number-campaign-meta") {
                
                $path = $_SERVER['DOCUMENT_ROOT']."/api/admin/data/".$code.".json";
                
                $output.="<p>path:".$path;
                
                $data = Contents::getFileContents($path);
                
                $output.="<p>data:".$data;
                
                if(isset($data)) {
                    $jsonData = json_decode($data, true);
                    foreach ($jsonData as $value) {
                        $itemData = $value;                    
                        //$crmItem = new CRMNumberCampaignMeta();
                        //$crmItem->from_dict($itemData);
                        $crmData = new CRMNumberCampaignMetaData();
                        $crmData->setArray($itemData);
                        $crmData->code = Contents::shortCode($crmData->code);
                        $crmData->setObject();
                        //foreach ($itemData as $key => $value) {
                            
                        //}
                        $output.="<p> item imported:".$crmData->referrer." code:".$crmData->code;
                    }  
                }
             
                
                
            }
        }
        echo $output;
        
        //Flight::view()->display('index.tpl');
    }
});



Flight::route('/api/admin/*', function(){
    if(Auth::validateAuthorizationFlight()) {
        Flight::view()->display('index.tpl');
    }
});


?>
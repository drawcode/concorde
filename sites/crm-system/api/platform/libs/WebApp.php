<?php

class BaseData {
    
    public $name = "";
    public $code = "";
    public $msg = "";
    public $error = "";
    public $data = NULL;
    
    public function __construct(){
        $this->name = "";
        $this->code = "";
        $this->msg = "";
        $this->error = "";
        $this->data = NULL;
    }
    
    public function toJSON() {
        return json_encode(get_object_vars($this));
    }    
}

class WebApp {
  
  static public function GetWrapper($code, $data, $msg, $error, $name, $info) {
    
    $callback = WebApp::GetParam('callback');
    $format = WebApp::GetParam('format');

    $wrapper = new BaseData();
    $wrapper->code = $code;
    $wrapper->data = $data;
    $wrapper->msg = $msg;
    $wrapper->error = $error;
    $wrapper->name = $name;
    $wrapper->info = $info;
    $output = json_encode($wrapper);   
    
    if(isset($callback)) {
      if($callback != "") {
       $output  = $callback."(".$output.");"; 
      }
    }
    
    return str_replace('\\', '', $output);
  }
  
  static public function GetParam($name) {
    $val = '';
    if(isset($_REQUEST[$name])) {
      $val = $_REQUEST[$name];
    }
    return $val;
  }
  
  static public function CreateUUID() {   
    return UUID::v4();
  }    
}
?>
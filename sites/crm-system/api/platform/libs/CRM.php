<?php

class BaseModel extends Model{
    public function set_object_vars(array $vars, $clear) {
        $has = get_object_vars($this);
        foreach ($has as $name => $oldValue) {
            if(isset($vars[$name])) {
                $this->$name = $vars[$name];
            }
            else {
                if($clear) {
                    $this->$name = NULL;
                }
            }
        }
    }
    
    public function from_dict(array $vars) {
        $this->set_object_vars($vars, TRUE);
    }
    
    public function from_dict_append_updated(array $vars) {
        $this->set_object_vars($vars, FALSE);
    }
    
    public function to_dict() {
        return get_object_vars($this);
    }
}


class CRMNumberCampaignMeta extends BaseModel {    
    
}

class CRMNumberCampaignMetaData  {
        
    public $id = '';
    public $code = '';
    public $referrer = '';
    public $number = '';
    public $display_name = '';
    public $date_created = '';
    public $date_updated = '';
    public $status = '';
    public $active = TRUE;
    
    public function __construct() {
        
    }
    
    public function setArray($data) {
        $this->id = $data['id'];
        $this->code = $data['code'];
        $this->referrer = $data['referrer'];
        $this->number = $data['number'];
        $this->display_name = $data['display_name'];
        $this->date_created = $data['date_created'];
        $this->date_updated = $data['date_updated'];
        $this->status = $data['status'];
        $this->active = $data['active'];
    }
    
    public function createObject() {
        $table_name = 'CRMNumberCampaignMeta';
        $obj = Model::factory($table_name)->create();
        $obj->id = $this->id;
        $obj->code = $this->code;
        $obj->referrer = $this->referrer;
        $obj->number = $this->number;
        $obj->display_name = $this->display_name;
        $obj->date_created = $this->date_created;
        $obj->date_updated = $this->date_updated;
        $obj->status = $this->status;
        $obj->active = $this->active;
        return $obj->save();
    }
    
    public function setModel($obj) {
        $table_name = 'CRMNumberCampaignMeta';
        $obj = Model::factory($table_name)->find_one($obj->id);
        if(!isset($obj)) {
            $obj = Model::factory($table_name)->create();
        }
        $this->fillObject($obj);
        return $this->saveObject($obj);
    }
    
    public function setData($obj) {
        $this->fillObject($obj);
        //return $this->setObject();
        return $obj->save();
    }
    
    public function setObject() {
        $table_name = 'CRMNumberCampaignMeta';
        
        $count = $this->countById($this->id);
        if($count > 0) {
            $obj = Model::factory($table_name)->find_one($this->id);
        }
        else {
            $obj = Model::factory($table_name)->create();
        }
            
        $obj->id = $this->id;
        $obj->code = $this->code;
        $obj->referrer = $this->referrer;
        $obj->number = $this->number;
        $obj->display_name = $this->display_name;
        $obj->date_created = $this->date_created;
        $obj->date_updated = $this->date_updated;
        $obj->status = $this->status;
        $obj->active = $this->active;  
        $this->fillObject($obj);
        
        return $this->saveObject($obj);
    }
    
    public function saveObject($obj) {
        
        // clear caches and reset
        if(isset($obj)) {
            $this->clearCache($obj);            
            return $obj->save();
        }
        else {
            return false;
        }
    }
    
    public function clearCache($obj) {
        if(isset($obj)) {
            $cacheKeyGetAll = $this->getCacheKey("getAll","");
            
            $cacheKeyGetByReferrer = $this->getCacheKey("getByReferrer",$obj->referrer);
            $cacheKeyGetById = $this->getCacheKey("getById",$obj->id);
            $cacheKeyGetByCode = $this->getCacheKey("getByCode",$obj->code);
            
            $cacheKeyCountByReferrer = $this->getCacheKey("countByReferrer",$obj->referrer);
            $cacheKeyCountById = $this->getCacheKey("countById",$obj->id);
            $cacheKeyCountByCode = $this->getCacheKey("countByCode",$obj->code);       
            
            // clear cache
            Cacher::clear($cacheKeyGetAll);
            Cacher::clear($cacheKeyGetByReferrer);
            Cacher::clear($cacheKeyGetById);
            Cacher::clear($cacheKeyGetByCode);
            Cacher::clear($cacheKeyCountByReferrer);
            Cacher::clear($cacheKeyCountById);
            Cacher::clear($cacheKeyCountByCode);
            
            // pre-cache
            //$this->getAll();
            
            //$this->getByReferrer($obj->referrer);
            //$this->getById($obj->id);
            //$this->getByCode($obj->code);
            
            //$this->countByReferrer($obj->referrer);
            //$this->countById($obj->id);
            //$this->countByCode($obj->code);
        }
    }
    
     public function fillModel($obj) {
        
        if(isset($obj) && isset($this)) { 
            $obj->id = $this->id;
            $obj->code = $this->code;
            $obj->referrer = $this->referrer;
            $obj->number = $this->number;
            $obj->display_name = $this->display_name;
            $obj->date_created = $this->date_created;
            $obj->date_updated = $this->date_updated;
            $obj->status = $this->status;
            $obj->active = $this->active;
        }
    }
    
    public function fillObject($obj) {
        if(isset($obj) && isset($this)) {            
            $this->id = $obj->id;
            $this->code = $obj->code;
            $this->referrer = $obj->referrer;
            $this->number = $obj->number;
            $this->display_name = $obj->display_name;
            $this->date_created = $obj->date_created;
            $this->date_updated = $obj->date_updated;
            $this->status = $obj->status;
            $this->active = $obj->active;  
        }       
    }
    
    public function getAll() {
        $objsFilled = array();
        
        $cacheKey = $this->getCacheKey("getAll","");
        if(Cacher::has($cacheKey)) {
            $objsFilled = Cacher::get($cacheKey);
        }
        else {
            $objs = Model::factory('CRMNumberCampaignMeta')->find_many();
            $i = 0;
            foreach ($objs as &$value) {
                $obj = new CRMNumberCampaignMetaData();
                $obj->fillObject($value);
                array_push($objsFilled, $obj);
            }
            Cacher::set($cacheKey, $objsFilled);
            //echo 'success'.
        }   
        
        return $objsFilled;
    }
    
    public function getById($id) {
        $cacheKey = $this->getCacheKey("getById",$id);
        $obj = NULL;
        if(Cacher::has($cacheKey)) {
            $obj = Cacher::get($cacheKey);
        }
        else {
            $obj = Model::factory('CRMNumberCampaignMeta')->find_one($id);
            if(isset($obj)) {
                Cacher::set($cacheKey, $obj);
            }
        } 
        
        if(isset($obj) && isset($this)) {
            $this->fillObject($obj);
        }
        return $this;
    }
    
    public function countById($id) {
        $cacheKey = $this->getCacheKey("countById",$id);
        if(Cacher::has($cacheKey)) {
            $count = Cacher::get($cacheKey);
        }
        else {
            
            $count = Model::factory('CRMNumberCampaignMeta')
                ->select_expr('COUNT(*)', 'count')
                ->where('id', $id)
                ->count();
            if(isset($count)) {
                Cacher::set($cacheKey, $count);
            }
        } 
        
        return $count;
    }
    
    public function countByReferrer($referrer) {
        $cacheKey = $this->getCacheKey("countByReferrer",$referrer);
        if(Cacher::has($cacheKey)) {
            $count = Cacher::get($cacheKey);
        }
        else {
            
            $count = Model::factory('CRMNumberCampaignMeta')
                ->select_expr('COUNT(*)', 'count')
                ->where('referrer', $referrer)
                ->count();
            if(isset($count)) {
                Cacher::set($cacheKey, $count);
            }
        } 
        return $count;
    }
    
    public function countByCode($code) {
        $cacheKey = $this->getCacheKey("countByCode",$code);
        if(Cacher::has($cacheKey)) {
            $count = Cacher::get($cacheKey);
        }
        else {
            
            $count = Model::factory('CRMNumberCampaignMeta')
                ->select_expr('COUNT(*)', 'count')
                ->where('code', $code)
                ->count();
            if(isset($count)) {
                Cacher::set($cacheKey, $count);
            }
        } 
        return $count;
    }
    
    public function deleteById($id) {
        
        $item = Model::factory('CRMNumberCampaignMeta')->where('id', $id)->find_one();
        
        if(isset($item)) {
            $this->clearCache($item);             
            return $item->delete();
        }
        else {
            return false;
        }
    }
       
    public function getByReferrer($referrer) {
        
        $cacheKey = $this->getCacheKey("getByReferrer",$referrer);
        if(Cacher::has($cacheKey)) {
            $obj = Cacher::get($cacheKey);
        }
        else {
            $obj = Model::factory('CRMNumberCampaignMeta')->where_equal('referrer', $referrer)->find_one();
            if(isset($obj)) {
                Cacher::set($cacheKey, $obj);
            }
        }
        
        if(isset($obj)) {
            $this->fillObject($obj);
        }
            
        return $this;
    }
    
    public function getByCode($code) {
        $cacheKey = $this->getCacheKey("getByCode",$code);
        if(Cacher::has($cacheKey)) {
            $obj = Cacher::get($cacheKey);
        }
        else {
            $obj = Model::factory('CRMNumberCampaignMeta')->where_equal('code', $code)->find_one();
            if(isset($obj)) {
                Cacher::set($cacheKey, $obj);
            }
        }        
        
        if(isset($obj)) {
            $this->fillObject($obj);
        }
        
        return $this;
    }
    
    public function toJSON() {
        return json_encode(get_object_vars($this));
    }
    
    public function toJSONObject($obj) {
        return json_encode(get_object_vars($obj));
    }
    
    public function getCacheKey($code, $params) {
        return 'crm-number-campaign-meta-'.$code.'-'.$params;
    }
}


class CRM {

    public $crmNumberCampaignMetaData = NULL;
    
    public function __construct() {
        $this->crmNumberCampaignMetaData = new CRMNumberCampaignMetaData();
    }
}

?>
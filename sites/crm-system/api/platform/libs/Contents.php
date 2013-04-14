<?php
class Contents {
    
  static public function shorten($n) {
    //echo "<br>shorten 1: " . $n;    
    //$codeset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    $codeset = "0123456789abcdefghijklmnopqrstuvwxyz"; // base 36
    $base = strlen($codeset);
    $converted = "";
    while ($n > 0) {
      $converted = substr($codeset, ($n % $base), 1) . $converted;
      $n = floor($n/$base);
    }
    //echo "<br>shorten converted: " . $converted;
    return $converted;
  }
  
  static public function unshorten($converted) {
    //$codeset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    $codeset = "0123456789abcdefghijklmnopqrstuvwxyz"; // base 36
    $base = strlen($codeset);
    $c = 0;
    for ($i = strlen($converted); $i; $i--) {
      $c += strpos($codeset, substr($converted, (-1 * ( $i - strlen($converted) )),1)) 
                    * pow($base,$i-1);
    }
    return $c;
  }
  
  static public function base36Encode($base10){
    return base_convert($base10,10,36);
  }
   
  static public function base36Decode($base36){
    return base_convert($base36,36,10);
  }
  
  static public function base64Encode($val){
    return base64_encode($val);
  }
   
  static public function base64Decode($val){
    return base64_decode($val);
  }
  
  static public function base64UrlEncode($input) {
    return strtr(base64_encode($input), '+/=', '-_,');
  }

  static public function base64_url_decode($input) {
    return base64_decode(strtr($input, '-_,', '+/=')); 
  }
  
  static public function hashEncodeSha1($val) {
    return sha1($val, true);
  }
  
  static public function  base64EncodeSha1($val) {
    return Contents::base64Encode(Contents::hashEncodeSha1($val));
  }
  
  static public function checksumCrc32($val) {  
    return sprintf("%u", crc32($val));    
  }
  
  static public function shortCode($val) {  
    return Contents::base36Encode(Contents::checksumCrc32(Contents::base64EncodeSha1($val))); 
    //return Contents::checksumCrc32(Contents::base64EncodeSha1($val));    
  }
  
  static public function getCDNEndpoint($url, $domain) {
    $shortenedUrl = $this->base36_encode($url);
    $cdnPrefixHashLetter = substr($shortenedUrl, 0, 1);		
    $cdnEndpoint = "cdn.".$cdnPrefixHashLetter.$domain;
    return $cdnEndpoint;
  }
  
  static public function getFileContents($url) {
    if(Contents::checkFileExists($url)) {
        return file_get_contents($url);
    }    
  }
  
  static public function setFileContents($url, $data) {
    file_put_contents($file, $current);
  }
  
  static public function checkFileExists($url) {
    //if (preg_match("/(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»\"\"'']))/", $url)) {
    if (preg_match("%^((https?://)|(www\.))([a-z0-9-].?)+(:[0-9]+)?(/.*)?$%i", $url)) {
      //echo "Checking web file exists:" . $url;
      return Contents::checkFileExistsWeb($url);
    }
    else {
      return Contents::checkFileExistsLocal($url);
    }
  }	
  
  static public function checkFileExistsWeb($url) {
    $handle = curl_init($url);
    curl_setopt($handle,  CURLOPT_RETURNTRANSFER, TRUE);

    /* Get the HTML or whatever is linked in $url. */
    $response = curl_exec($handle);

    /* Check for 404 (file not found). */
    $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
    curl_close($handle);
    
    //echo "Checking web file exists httpCode:" . $httpCode;

    /* If the document has loaded successfully without any redirection or error */
    if ($httpCode >= 200 && $httpCode < 300) {
      return true;
    } 
    else {
      return false;
    }
  }
  
  static public function checkFileExistsLocal($file) {
    if (file_exists($file)) {
      return true;
    } 
    else {
      return false;
    }	
  }  
}
?>
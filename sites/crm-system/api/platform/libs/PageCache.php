<?php

require_once('Cache.php');

class PageCache
{
	
	public $cachePath = null;
	public $cache = null;

	public function __construct()
	{
		$this->cachePath = realpath("cache-pages/");
		_log("cache_status_path:", $this->cachePath);
		
		$this->cache = new Cache($this->cachePath);
	}
	
	public function checkFileExists($url) {
		//if (preg_match("/(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»\"\"'']))/", $url)) {
		if (preg_match("%^((https?://)|(www\.))([a-z0-9-].?)+(:[0-9]+)?(/.*)?$%i", $url)) {
			//echo "Checking web file exists:" . $url;
			return $this->checkFileExistsWeb($url);
		}
		else {
			return $this->checkFileExistsLocal($url);
		}
	}	
	
	public function checkFileExistsWeb($url) {
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
	
	/*
	public function checkFileExistsOrRedirectWeb( $link )
    {        
        $url_parts = @parse_url( $link );

        if ( empty( $url_parts["host"] ) ) return( false );

        if ( !empty( $url_parts["path"] ) )
        {
            $documentpath = $url_parts["path"];
        }
        else
        {
            $documentpath = "/";
        }

        if ( !empty( $url_parts["query"] ) )
        {
            $documentpath .= "?" . $url_parts["query"];
        }

        $host = $url_parts["host"];
        $port = $url_parts["port"];
        // Now (HTTP-)GET $documentpath at $host";

        if (empty( $port ) ) $port = "80";
        $socket = @fsockopen( $host, $port, $errno, $errstr, 30 );
        if (!$socket)
        {
            return(false);
        }
        else
        {
            fwrite ($socket, "HEAD ".$documentpath." HTTP/1.0\r\nHost: $host\r\n\r\n");
            $http_response = fgets( $socket, 22 );
            
            if ( ereg("200 OK", $http_response, $regs ) )
            {
                return(true);
                fclose( $socket );
            } else
            {
//                echo "HTTP-Response: $http_response<br>";
                return(false);
            }
        }
    } 
	*/
	
	public function checkFileExistsOrRedirectWeb($url) {
		
			//echo "<!--\r\n<br>checkFileExistsOrRedirectWeb: " . $url . "\n-->";
			
		$handle = curl_init($url);
		curl_setopt($handle,  CURLOPT_RETURNTRANSFER, TRUE);
	
		// Get the HTML or whatever is linked in $url. //
		$response = curl_exec($handle);
	
		// Check for 404 (file not found). //
		$httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
		curl_close($handle);
		
			//echo "<!--\r\n<br>httpCode: " . $httpCode . "\n-->";
			
			file_get_contents($url);
			//echo "<!--\r\n<br>http_response_header: " . $http_response_header[0] . "\n-->";
		
		//echo "Checking web file exists httpCode:" . $httpCode;
	
		// If the document has loaded successfully without any redirection or error //
		if ($httpCode >= 200 && $httpCode < 305) {
			return true;
		} 
		else {
			$headers = get_headers($url, 1);
			$headers_value = $headers[0];
			$status   = '200';
			$pos = strpos($headers_value, $status);
			
			// The !== operator can also be used.  Using != would not work as expected
			// because the position of 'a' is 0. The statement (0 != false) evaluates 
			// to false.
			if ($pos !== false) {
				 // found
				 return true;
			} else {
				// not found$status   = '200';
				$status   = '301';
				$pos = strpos($headers_value, $status);
				
				// The !== operator can also be used.  Using != would not work as expected
				// because the position of 'a' is 0. The statement (0 != false) evaluates 
				// to false.
				if ($pos !== false) {
					 // found
					 return true;
				} else {
					// not found$status   = '200';
					$status   = '302';
					$pos = strpos($headers_value, $status);
					
					// The !== operator can also be used.  Using != would not work as expected
					// because the position of 'a' is 0. The statement (0 != false) evaluates 
					// to false.
					if ($pos !== false) {
						 // found
						 return true;
					} else {
					}
				}
			}			
			
			
			return false;
		}
	}
	
	public function checkFileExistsLocal($file) {
		if (file_exists($file)) {
			return true;
		} 
		else {
			return false;
		}	
	}
	
	public function shorten($n) {

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
	
	public function unshorten($converted) {
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
	
	public function base36_encode($base10){
    	return base_convert($base10,10,36);
	}
	 
	public function base36_decode($base36){
		return base_convert($base36,36,10);
	}
	
		
	public function _log($key, $value) {
		
		echo "<!-- \r\n<br>".$key.": ".$value."-->";
	}
	
	public function get_current_url() {
		$pageURL = 'http';
		//if ($_SERVER["HTTPS"] == "on") {
		//	$pageURL .= "s";
		//}
		$pageURL .= "://";
		if ($_SERVER["SERVER_PORT"] != "80") {
			$pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
		} 
		else {
			$pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
		}
		return $pageURL;
	}
	
	public function get_current_page() {
		return substr($_SERVER["SCRIPT_NAME"],strrpos($_SERVER["SCRIPT_NAME"],"/")+1);
	}
	
	public function check_cached($key) {
		// Check cache for content else show the drupal render output wiht 2/3s hit
		
		$url_key = "pagecontent-".$key;
		$url_meta = "pagemeta-".$key;
		
		$data = $this->cache->get($url_meta);  
		
		//_log("data-cached:", $data);			  
		//echo "<!--\r\n<br>data: " . $data . "\n-->";
		if ($data === FALSE)  { 
			return FALSE;
			//$page_cache->set($url_key, $data);
		}
		else {
			return TRUE;
		}
	}
	
	public function clear_cached($key) {
		// Check cache for content else show the drupal render output wiht 2/3s hit
		
		$url_key = "pagecontent-".$key;
		$url_meta = "pagemeta-".$key;
		
		$data = $this->cache->clear($url_meta);
		$data = $this->cache->clear($url_key);
	}
	
	public function check_if_should_cache($url) {
		///^(?:[^f]+|f(?!oo))*$/;   # Matches strings not containing 'foo'.

    //    /^(?:(?!PATTERN).)*$/;    # Matches strings not containing PATTERN
		//if (preg_match("/(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»\"\"'']))/", $url)) {
		if (preg_match("%/inspiration/(?:(?!architecture)(?!car-design)(?!fashion-design)(?!graphic-design)(?!illustration)(?!industrial-design)(?!interface-design)(?!interior-design)(?!packaging-design)(?!photography)(?!typography)(?!web-design).)*$%i", $url)
		|| preg_match("%/blog/\d*[a-z0-9].*%i", $url)) {
			//echo "Checking web file exists:" . $url;
			return TRUE;
		}
		else {
			return FALSE;
		}
	}	
	
	public function get_cached($key) {
		$url_key = "pagecontent-".$key;
		$url_meta = "pagemeta-".$key;
		
		return $this->cache->get($url_key);  
	}
	
	
	public function set_cached($key, $val) {
		$url_key = "pagecontent-".$key;
		$url_meta = "pagemeta-".$key;
		
		$this->cache->set($url_key, $val);  
		$this->cache->set($url_meta, TRUE);  
	}
	
}

?>
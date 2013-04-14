<?php
	
include_once 'aws-sdk/sdk-1.4.8.1/sdk.class.php';
include_once 'aws-sdk/sdk-1.4.8.1/api/s3.class.php';
require_once('Cache.php');

// defines
//$awsAccessKey = 'key';
//$awsSecretKey = 'secret';
//$domain = $_SERVER['HTTP_HOST'];
//$domain_bucket = str_replace('.', '-', $domain);
//$awsBucketName = $domain_bucket;

//$cdn = new CDN($awsAccessKeyy, $awsSecretKey);
//$s3 = new AmazonS3($awsAccessKey, $awsSecretKey);

function _log($key, $value) {
	
	//echo "<!-- \r\n<br>".$key.": ".$value."-->";
}

function get_file_extension($file_name)
{
  return substr(strrchr($file_name,'.'),1);
}


function get_content_type($file_name)
{
  $ext = get_file_extension($file_name);
  if($ext == "jpg") {
  	return "image/jpeg";
  }
  else if($ext == "png") {
  	return "image/png";
  }
  else if($ext == "gif") {
  	return "image/gif";
  }
  
  return "image/png";
}

class CDN
{
	public $accessKey = null; // AWS Access key
	public $secretKey = null; // AWS Secret key
	public $sslKey = null;
	
	public $cdnApi = null;
	
	public $domainHost = null;
	public $domainBucket = null;
	public $fileHashedBucket = null;
	
	public $cachePath = null;
	public $cache = null;

	public function __construct($domainHost = null, $accessKey = null, $secretKey = null)
	{
		// Init with just AmazonS3 for now...
		$this->cdnApi = new AmazonS3($accessKey, $secretKey);
		
		$this->accessKey = $accessKey;
		$this->secretKey = $secretKey;
		$this->domainHost = $domainHost;
		$this->domainBucket = str_replace('.', '-', $domainHost);
				
		$this->cachePath = realpath("cache/");
		_log("cache_status_path:", $this->cachePath);
		
		$this->cache = new Cache($this->cachePath);
	}
	
	public function listKeys() {
		return $this->cdnApi->listBuckets(false);
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
	
	function base36_encode($base10){
    	return base_convert($base10,10,36);
	}
	 
	function base36_decode($base36){
		return base_convert($base36,36,10);
	}
	
	public function getCDNEndpoint($url, $domain) {
		$shortenedUrl = $this->base36_encode($url);
		$cdnPrefixHashLetter = substr($shortenedUrl, 0, 1);		
		$cdnEndpoint = "cdn.".$cdnPrefixHashLetter.$domain;//.$domain;
		return $cdnEndpoint;
	}
	
	public function clearImageCache($keyPath) {
		$verified_path_key = "verified-".$keyPath;
		$data = $this->cache->get($keyPath);  
		$data_verified = $this->cache->get($verified_path_key);
		
		if ($data === TRUE || $data_verified === TRUE)  { 
			$data = FALSE; 
			$this->cache->set($keyPath, $data);
			$data_verified = FALSE;				
			$this->cache->set($verified_path_key, $data_verified); 
		}
	}
	
	public function handleCDNPathsInMarkup($output) {
		// This takes the output of markup engines (drupal for instance) 
		// and allows the system to act as an atomic operation to do it's 
		// normal thing, then take the output and put in correct cdn paths.
		
		// This also syncs the files to amazon before render so S3 and CDN 
		// generation and syncing is automatic.
		$pattern = '(http://.*/sites/default/files/imagecache/(.*).*) ';
		
			//echo "<br>pattern: " . $pattern . "\n";
		preg_match_all($pattern, $output, $matches, PREG_SET_ORDER);
		
			//echo "<!--<br>matches: " . $matches . "\n-->";
		foreach ($matches as $val) {
			//echo "<!-- \r\nmatched: " . $val[0] . "\n";
			//echo "\r\npart 1: " . $val[1] . "\n";
			//echo "\r\npart 2: " . $val[2] . "\n-->";
			
			if(isset($val[0])) {
				$url = $val[0];
				$urls = explode('"', $url);
				$url = $urls[0];
				//echo "<!--\r\nurl 1: " . $url . "\n-->";
				if(isset($val[1])) {					
					$keyPath = $val[1];
					$keyPaths = explode('"', $keyPath);
					$keyPath = $keyPaths[0];
					//echo "<!--\r\nkeyPath 2: " . $keyPath . "\n-->";
					
					$verified_path_key = "verified-".$keyPath;
					$data = $this->cache->get($keyPath);  
					$data_verified = $this->cache->get($verified_path_key);
					
					_log("data-cached:", $data);	
					_log("data-data_verified:", $data_verified);	
					$fileExists = TRUE;			
						  
					//echo "<!--\r\n<br>data: " . $data . "\n-->";
					if ($data === FALSE || $data_verified === FALSE)  {  
						$imagepath = "imagecache/".$keyPath;
						//$fileExists = $this->checkFileExistsOrRedirectWeb($url);
						$this->syncFileInline($imagepath, TRUE);
						//echo "<!--\r\n<br>fileExists: " . $fileExists . "\n-->";
						//if($fileExists) {
							$data = TRUE; 
							$this->cache->set($keyPath, $data); 
							$fileExists = TRUE;
							//echo "<!--\r\n<br>data: " . $data . "\n-->";
						//} 
						//$fileExists = TRUE;
					}
									
					if($fileExists) {
						$cdnUrlEndpoint = $this->getCDNEndpoint($imagepath, $this->domainHost);
						$newCDNUrl = "http://".$cdnUrlEndpoint."/".$imagepath;
						
						$fileWebExists = TRUE;
						if($data_verified === FALSE) {
							// verify the file made it to amazon
							$fileWebExists = $this->checkFileExists($newCDNUrl);
						}
						if($fileWebExists) {	
							$data_verified = TRUE;				
							//echo "<!--\r\n<br>cdnUrlEndpoint: " . $cdnUrlEndpoint . "\n-->";
							//echo "<!--\r\n<br>newCDNUrl: " . $newCDNUrl . "\n-->";
							$this->cache->set($verified_path_key, $data_verified); 
							$output = str_replace($url, $newCDNUrl, $output); 
						}
						
						//$output = preg_replace($url, $newCDNUrl, $output);
					}
				}
			}
		}
		
		return $output;
	}
	
	
	public function syncFileInline($path, $direct) {
		
		// This class is for cdn for different buckets at amazon currently including
		// the imagecache for drupal.  
		// Process
		// 1) Request comes in and forwards the path to this page/class.
		// 2) Check if current file is cached and available on CDN
		// 3) If Yes, serves from CND, if No
		// 		1) Serve local version
		//		2) Upload the image to CDN
		//		3) Update cache to use uploaded cdn file if available
		// Cache can check for 404 from amazon for s3 file or non 200 OK
		
		// implementation
		//$cdn = new CDN($awsAccessKey, $awsSecretKey);
		//$s3 = new S3($awsAccessKey, $awsSecretKey);
		
		$current_dir = getcwd();
		$imagecache_path = "sites/default/files/";
		$imagecache_system_path = $current_dir."/".$imagecache_path;
		$imagecache_system_path_file = realpath($imagecache_system_path);
		$imagecache_system_path_full = $imagecache_system_path_file."/".$path;
		
		$bucket_filename = explode(DIRECTORY_SEPARATOR, $path);
		$bucket_filename = array_pop($bucket_filename);
		$bucket_path = substr(str_replace($bucket_filename, '', $path), 0, -1);
		
		$this->fileHashedBucket = $this->getCDNEndpoint($path, $this->domainHost);
		//$url_s3 = "http://".$this->domainBucket.".s3.amazonaws.com/";
		//$url_s3 = "http://".$this->fileHashedBucket.".s3.amazonaws.com/";
		$url_s3 = "http://".$this->fileHashedBucket."/";
		$final_url = $url_s3.$path;		
		
		_log("bucket_filename:", $bucket_filename);
		_log("bucket_path:", $bucket_path);
		_log("current_dir:", $current_dir);
		_log("url_s3:", $url_s3);
		_log("imagecache_path:", $imagecache_path);
		_log("imagecache_system_path:", $imagecache_system_path);
		_log("path:", $path);
		_log("imagecache_system_path_file:", $imagecache_system_path_file);
		_log("imagecache_system_path_file:", $imagecache_system_path_full);
		_log("final_url:", $final_url);
		
		_log("Cache initialized", TRUE);
		  
		$verified_path_key = "verified-".$path;
		$data = $this->cache->get($path);  
		$data_verified = $this->cache->get($verified_path_key);
		
		_log("data-cached:", $data);

			  
		if ($data === FALSE || $data_verified === FALSE)  {  

			$file_local_exists = $this->checkFileExists($imagecache_system_path_full);
			
			_log("file_local_exists:", $file_local_exists);
			
			if($file_local_exists) {
			
				// Check if file exists on amazon already
				$file_web_exists = $this->checkFileExists($final_url);
				
				_log("final_url on amazon:", $final_url);
				_log("file_web_exists on amazon:", $file_web_exists);
				
				// TODO add file size check every day or so for changed files
				// or purge cache/file check with preemptive check
				if(!$file_web_exists) {
									
						// AMAZON HANDLING
					
						$bucket_name = $this->fileHashedBucket; //."/".$bucket_path;
						$file_to_upload = $imagecache_system_path_full;
					
					if (!$this->cdnApi->if_bucket_exists($bucket_name)){
						$response = $this->cdnApi->create_bucket($bucket_name, AmazonS3::REGION_US_E1, AmazonS3::ACL_PUBLIC);
					}
					else {			
						_log("bucket already exists...", TRUE);
					}
					// This returns a "CFResponse"
					$r = $this->cdnApi->create_object(
						$bucket_name,
						$path,
							array(
							// Filename of the thing we're uploading
								'fileUpload' => ($file_to_upload),
								'acl' => AmazonS3::ACL_PUBLIC,
								'contentType' => get_content_type($bucket_filename),
								'length' => filesize($file_to_upload)
							)
					);
					//_log("Worked: ", var_dump($r->isOK()));
					//_log("Status: ", var_dump($r->status));
					_log("URL: ", $this->cdnApi->get_object_url($bucket_name, $path));
										
					$data = TRUE; 
					$this->cache->set($path, $data);  
					_log("data-tocache:", $data);
					
					// verify upload 
					
					// Check if file exists on amazon after upload
					$file_web_exists = $this->checkFileExists($final_url);
					if($file_web_exists) {	
						$data_verified = TRUE;				
						$this->cache->set($verified_path_key, $data_verified);  
					}
					
					if($direct) {
						//header("Location: "."/local-temp/".$path);
					}
				}
				else {
					if($direct) {
						//header("HTTP/1.1 301 Moved Permanently"); 
						//header("Location: ".$final_url); 
					}
				}
			}
			else {
				if($direct) {
					//header("HTTP/1.1 404 Not Found");
				}
			}
		}
		else {		
			if($direct) {	
				//header("HTTP/1.1 301 Moved Permanently"); 
				//header("Location: ".$final_url); 
			}
		}
		return $final_url;
		
	}
	
	public function syncFile($path) {
		
		// This class is for cdn for different buckets at amazon currently including
		// the imagecache for drupal.  
		// Process
		// 1) Request comes in and forwards the path to this page/class.
		// 2) Check if current file is cached and available on CDN
		// 3) If Yes, serves from CND, if No
		// 		1) Serve local version
		//		2) Upload the image to CDN
		//		3) Update cache to use uploaded cdn file if available
		// Cache can check for 404 from amazon for s3 file or non 200 OK
		
		// implementation
		//$cdn = new CDN($awsAccessKey, $awsSecretKey);
		//$s3 = new S3($awsAccessKey, $awsSecretKey);
		
		$current_dir = getcwd();
		$imagecache_path = "../sites/default/files/";
		$imagecache_system_path = $current_dir."/".$imagecache_path;
		$imagecache_system_path_file = realpath($imagecache_system_path);
		$imagecache_system_path_full = $imagecache_system_path_file."/".$path;
		
		$bucket_filename = explode(DIRECTORY_SEPARATOR, $path);
		$bucket_filename = array_pop($bucket_filename);
		$bucket_path = substr(str_replace($bucket_filename, '', $path), 0, -1);
		
		$this->fileHashedBucket = $this->getCDNEndpoint($path, $this->domainHost);
		//$url_s3 = "http://".$this->domainBucket.".s3.amazonaws.com/";
		//$url_s3 = "http://".$this->fileHashedBucket.".s3.amazonaws.com/";
		$url_s3 = "http://".$this->fileHashedBucket."/";
		$final_url = $url_s3.$path;		
		
		_log("bucket_filename:", $bucket_filename);
		_log("bucket_path:", $bucket_path);
		_log("current_dir:", $current_dir);
		_log("url_s3:", $url_s3);
		_log("imagecache_path:", $imagecache_path);
		_log("imagecache_system_path:", $imagecache_system_path);
		_log("path:", $path);
		_log("imagecache_system_path_file:", $imagecache_system_path_file);
		_log("imagecache_system_path_file:", $imagecache_system_path_full);
		_log("final_url:", $final_url);
		
		_log("Cache initialized", TRUE);
		  
		$data = $this->cache->get($path);  
		
		_log("data-cached:", $data);

			  
		if ($data === FALSE)  {  

			$file_local_exists = $this->checkFileExists($imagecache_system_path_full);
			
			_log("file_local_exists:", $file_local_exists);
			
			if($file_local_exists) {
			
				// Check if file exists on amazon already
				$file_web_exists = $this->checkFileExists($final_url);
				
				_log("final_url on amazon:", $final_url);
				_log("file_web_exists on amazon:", $file_web_exists);
				
				// TODO add file size check every day or so for changed files
				// or purge cache/file check with preemptive check
				if(!$file_web_exists) {
									
						// AMAZON HANDLING
					
						$bucket_name = $this->fileHashedBucket; //."/".$bucket_path;
						$file_to_upload = $imagecache_system_path_full;
					
					if (!$this->cdnApi->if_bucket_exists($bucket_name)){
						$response = $this->cdnApi->create_bucket($bucket_name, AmazonS3::REGION_US_E1, AmazonS3::ACL_PUBLIC);
					}
					else {			
						_log("bucket already exists...", TRUE);
					}
					// This returns a "CFResponse"
					$r = $this->cdnApi->create_object(
						$bucket_name,
						$path,
							array(
							// Filename of the thing we're uploading
								'fileUpload' => ($file_to_upload),
								'acl' => AmazonS3::ACL_PUBLIC,
								'contentType' => get_content_type($bucket_filename),
								'length' => filesize($file_to_upload)
							)
					);
					_log("Worked: ", var_dump($r->isOK()));
					_log("Status: ", var_dump($r->status));
					_log("URL: ", $this->cdnApi->get_object_url($bucket_name, $path));
										
					$data = TRUE; 
					$this->cache->set($path, $data);  
					_log("data-tocache:", $data);
					
					header("Location: "."/local-temp/".$path);
				}
				else {
					header("HTTP/1.1 301 Moved Permanently"); 
					header("Location: ".$final_url); 
				}
			}
			else {
				header("HTTP/1.1 404 Not Found");
			}
		}
		else {			
			header("HTTP/1.1 301 Moved Permanently"); 
			header("Location: ".$final_url); 
		}
		
		
	}
}

?>
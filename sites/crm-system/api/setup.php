<?php
ini_set('display_errors',1); 
error_reporting(E_ALL);
date_default_timezone_set('America/Los_Angeles');

require_once 'platform/libs/AppSettings.php';
$docroot = $_SERVER['DOCUMENT_ROOT'];
AppSettings::$TEMPLATE_PATH = $docroot.'/api/templates/crm-system/';
AppSettings::$CACHE_PATH = $docroot.'/api/cache/crm-system/';
AppSettings::$DB_PATH = $docroot.'/api/data/';
AppSettings::$DB_NAME = 'crm-system.db';      
AppSettings::$CONNECTION_STRING = "sqlite:".AppSettings::$DB_PATH.AppSettings::$DB_NAME;
AppSettings::$SITE_ROOT = "example.com";

$connectstring = AppSettings::$CONNECTION_STRING;

// Create (connect to) SQLite database in file
$file_db = new PDO($connectstring);
// Set errormode to exceptions
$file_db->setAttribute(PDO::ATTR_ERRMODE, 
                        PDO::ERRMODE_EXCEPTION);

function list_tables($file_db= NULL, $like = NULL) {
    if (is_string($like)) {
        // Search for user level table names
        $result = $file_db->query('SELECT name '
            .'FROM sqlite_master '
            .'WHERE type=\'table\' AND name NOT LIKE \'sqlite_%\' '
                .'AND name LIKE '.$file_db->quote($like).' '
            .'ORDER BY name');
    }
    else {
        // Find all user level table names
        $result = $file_db->query('SELECT name '
            .'FROM sqlite_master '
            .'WHERE type=\'table\' AND name NOT LIKE \'sqlite_%\' '
            .'ORDER BY name');
    }

    $tables = array();
    foreach ($result as $row) {
        // Get the table name from the results
        $tables[] = current($row);
    }

    return $tables;
}

function list_columns($file_db = NULL, $table, $like = NULL) {
    // Quote the table name
    $table = $file_db->quote_identifier($table);

    // Find all column names
    $result = $file_db->query('PRAGMA table_info('.$table.')');

    $columns = array();

    if (is_string($like)) {
        $like = '/^'.preg_replace(array('/^%/', '/%$/'), '.*', $like).'$/';
        foreach ($result as $row) {
            if (preg_match($like, $row['name'])) {
                // Get the column name from the filtered results
                $columns[] = $row['name'];
            }
        }
    }
    else {
        foreach ($result as $row){
            // Get the column name from the results
            $columns[] = $row['name'];
        }
    }

    return $columns;
}


/**************************************
* Create tables                       *
**************************************/

// Create table messages
//$file_db->exec("DROP TABLE crmnumber_campaign_meta");
$file_db->exec("CREATE TABLE IF NOT EXISTS crmnumber_campaign_meta (
                id UUID PRIMARY KEY, 
                code TEXT, 
                display_name TEXT, 
                number TEXT, 
                referrer TEXT,
                date_created DATETIME,
                date_updated DATETIME,
                status TEXT,
                active BOOL
                )");

$tables = list_tables($file_db,NULL); 

echo json_encode($tables);

 ?>
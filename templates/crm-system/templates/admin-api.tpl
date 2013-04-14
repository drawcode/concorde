{extends 'base.tpl'}

{block name=csscustom}{/block}    

{block name=navtitle}CRM{/block}

{block name=navitems}
                <li><a href="/api/">Home</a></li>
                <li><a href="/api/admin/crm/">Manage</a></li>
                <li class="active"><a href="/api/admin/api">API</a></li>
                <li><a href="/api/admin/test/">Test</a></li>
                <!--
                <li class="dropdown">
                  <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown <b class="caret"></b></a>
                  <ul class="dropdown-menu">
                    <li><a href="#">Action</a></li>
                    <li><a href="#">Another action</a></li>
                    <li><a href="#">Something else here</a></li>
                    <li class="divider"></li>
                    <li class="nav-header">Nav header</li>
                    <li><a href="#">Separated link</a></li>
                    <li><a href="#">One more separated link</a></li>
                  </ul>
                </li>
                -->
{/block}

{block name=maincontent}
        <div class="page-header">
          <h1>Dynamic Number + Campaign Manager</h1>
        </div>
        <p class="lead">
            View API + Script Usage To Use On Sites
        </p>
        
        <div class="span4">
          <ul>
            <li>
              Embed the scripts to access the numbers from the campaign stored in the tracking cookie.
            </li>
            <li>
              This script should be placed on every page as it captures the campaign on first view.
            </li>
            <li>
              When the phone number
          is needed another method can be called to replace the phone number according to the stored cookie.
            </li>
          </ul>
        </div>
        
        <div class="span7">
            <pre class="prettyprint">
&lt;script src=&quot;//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js&quot;&gt;&lt;/script&gt;
&lt;script src=&quot;http://code.jquery.com/jquery-migrate-1.1.0.min.js&quot;&gt;&lt;/script&gt;
&lt;script type=&quot;application/javascript&quot; src=&quot;/apis/api.js?v1.0.0&quot;&gt;&lt;/script&gt;

&lt;script&gt;
  
  $(function () {
    // init - place after google analytics tracker for google event tracking
    var serviceApi = new ServiceAPI();
    var numberPlaceholders = [&#39;#phonenumber&#39;]; // list of jquery html tags to fill and replace with number
    serviceApi.updateCRMNumberCampaigns(numberPlaceholders);
  });
  
&lt;/script&gt;
        </pre>
        </div>
        <!--
        <table class="table table-hover">
            <tr>
                <th>Referrer</th><th>Campaign</th><th>Number</th><th>Code</th>
            </tr>
            <tr>
                <td>...</td><td>...</td><td>...</td><td>...</td>
            </tr>
            <tr>
                <td>...</td><td>...</td><td>...</td><td>...</td>
            </tr>
            <tr>
                <td>...</td><td>...</td><td>...</td><td>...</td>
            </tr>
        </table>
        -->
  
        <div class="span12"><p></p>
          <p class="lead">
            
              Select another option
          </p>
          
          <ul>
            <li><a href="/api/admin/crm/" class="lead">Manage Numbers + Campaign Relationships for Tracking</a></li>
            <li><a href="/api/admin/test/" class="lead">Test Dynamic Numbers</a></li>   
          </ul>
        </div>

{/block}

{block name=jscustom}{/block}



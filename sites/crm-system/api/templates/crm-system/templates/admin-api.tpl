{extends 'base.tpl'}

{block name=csscustom}{/block}    

{block name=navtitle}CRM{/block}

{block name=navitems}
                <li><a href="/api/">Home</a></li>
                <li><a href="/api/admin/crm/">Manage</a></li>
                <li class="active"><a href="/api/admin/api">API</a></li>
                <li><a href="/api/admin/test/">Test</a></li>
                <li class="dropdown">
                  <a href="#" class="dropdown-toggle" data-toggle="dropdown">Admin <b class="caret"></b></a>
                  <ul class="dropdown-menu">
                    <li><a href="/api/logout">Logout</a></li>
                    <li class="divider"></li>
                  </ul>
                </li>
{/block}

{block name=maincontent}
        <div class="page-header">
          <h1>Dynamic Number + Campaign Manager</h1>
        </div>
        <p class="lead">
            View API + Script Usage To Use On Sites
        </p>
                
        <div class="span12">
              Embed the scripts to access the numbers from the campaign stored in the tracking cookie.
              This script should be placed on every page as it captures the campaign on first view from the campaign urls.
              When the phone number
          is needed the placeholders are replaced with the customer campaign entry or specific number.  </div>
        
        <div class="span12">
<script src="https://gist.github.com/drawcode/ffa6b5a3e1d88dec79b6.js"></script>
        </div>
        
        <div class="span12">
          <h1>1</h1>
          <h3>How To Place + Initialize the Javascript Service API</h3>
          <p>
          Add api script for api to page under google analytics script at the bottom of the page.</p>
          <p>Include the api script and call the crm() method.</p>
          <p>This method will look for classes on elements to markup and fade in the number.</p>
          
          <p>Cookies will be created from the last campaign and stored for marking up the dynamic number.
  
          <script src="https://gist.github.com/drawcode/2a95365e65fd191e5c34.js"></script>
        
        </div>
  <div class="span12">
     
    
          <h1>2</h1>
          <h3>Shows how to enable using html markup for default behavior, overrides and turning it off for a section.</h3>
          <h4>Default Behavior</h4>
          <p>This span will be marked up with dynamic number campaigns and default behavior, 
  if a campaign cookie lands or exists from previous visit or page, it will dynamically change the number 
  to the campaign number for active campaigns.</p>
          <script src="https://gist.github.com/drawcode/76e5505f3d3f4f13b799.js"></script>
          
          <div class="well">
            <h5>Sample</h5>
            <h6>Using default from previous or current cookie value. If no cookie, it keeps default</h6>
            <h2 class="crm-number" data-crm-type="dynamic">888-555-9000</h2>
            <code>
              &lt;span class=&quot;someotherclass&quot;&gt;888-555-9000&lt;/span&gt;
            </code>
          </div>
          
          <h4>Turn off Dynamic Behavior</h4>
          <p>This span will not be marked up with dynamic number campaigns, this is one 
  way inner sections can turn off dynamic content</p>
          <script src="https://gist.github.com/drawcode/4d9ab76d150366ef55ef.js"></script>
          
          <div class="well">
            <h5>Sample</h5>
            <h6>Not Using 'crm-number' class</h6>
            <h2 class="someclass">888-555-9000</h2>
            <code>
              &lt;span class=&quot;someotherclass&quot;&gt;888-555-9000&lt;/span&gt;
            </code>
            <h6>Using 'crm-number' with 'data-crm-type' set to 'override'</h6>
            <h2 class="crm-number" data-crm-type="override">888-555-9000</h2>
            <code>
              &lt;span class=&quot;crm-number&quot; data-crm-type=&quot;override&quot; &gt;888-555-9000&lt;/span&gt;
            </code>
          </div>
          
          <h4>Override and Get Specific Code/Number</h4>
          <p>This span will be updated but not using the default from cookie/campaign method.  
  This span passes the 'crm-code-[code]' class that can be used to specifically call an campaign for dynamic numbers 
  that may or may not have a current google campaign.  Allows numbers to be changed specifically.  The 'code' 
  is the short codes you will find in the Dynamic Number + Campaign Manger class.</p>
          
          
          <script src="https://gist.github.com/drawcode/1a64a1defd0add668066.js"></script>
          

          <div class="well">
          <h5>Sample</h5>
          <h6>Using 'crm-number' class, 'data-crm-type' as 'override' and 'data-crm-code' as '1fvt8kn' (socialmedia)</h6>
          <h2 class="crm-number" data-crm-type="override" data-crm-code="1fvt8kn">888-555-9000</h2>
          <code>
            &lt;span class=&quot;crm-number&quot; data-crm-type=&quot;override&quot; data-crm-code=&quot;1fvt8kn&quot; &gt;888-555-9000&lt;/span&gt;
          </code>
          <h6>Using 'crm-number' class, 'data-crm-type' as 'override' and 'data-crm-referrer' as 'socialmedia'</h6>
          <h2 class="crm-number" data-crm-type="override" data-crm-referrer="socialmedia">888-555-9000</h2>
          <code>
            &lt;span class=&quot;crm-number&quot; data-crm-type=&quot;override&quot; data-crm-referrer=&quot;socialmedia&quot; &gt;888-555-9000&lt;/span&gt;
          </code>
          </div>
        </div>
          
 
        <div class="well clearboth">
          <p class="lead">
            
              Select another option
          </p>
          
          <ul>
            <li><a href="/api/admin/crm/" class="lead">Manage Numbers + Campaign Relationships for Tracking</a></li>
            <li><a href="/api/admin/test/" class="lead">Test Dynamic Numbers</a></li>   
          </ul>
        </div>

{/block}

{block name=jscustom}

<script src="/api/crm.js?v.1.0"></script>

{/block}



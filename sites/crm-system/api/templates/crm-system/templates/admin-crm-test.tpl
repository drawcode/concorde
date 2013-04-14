{extends 'base.tpl'}

{block name=csscustom}{/block}
    

{block name=navtitle}CRM{/block}


{block name=navitems}
      <li><a href="/api/">Home</a></li>
      <li><a href="/api/admin/crm/">Manage</a></li>
      <li><a href="/api/admin/api">API</a></li>
      <li class="active"><a href="/api/admin/test/">Test</a></li>
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
            Test + Validate Number + Campaign Flows
        </p>

        
        <p>The 'utm_content' param passed in simulates google landing from campaigns. Refresh the page to or click on 'Test' navigation again at the top to see the last number from the last campaign remains.</p>
        
        <p><a href="/api/admin/test/">Click to check without 'utm_content'</a> and how it remembers your last customer profile and shows correct number.
        <p>Close and reopen your browser to this url without the 'utm_content' param to see it remember as long as the cookie exists.</p>
        <p><a href="/api/admin/crm/">Go to the manager</a> to try another code.</p>
  </p>
        
          <h4>Default Behavior</h4>          

          <div class="well">
            <h5>Sample</h5>
            <h6>Using default from previous or current cookie value. If no cookie, it keeps default</h6>
            <h2 class="crm-number" data-crm-type="dynamic">888-555-9000</h2>
            <code>
              &lt;span class=&quot;crm-number&quot;&gt;888-555-9000&lt;/span&gt;
            </code>
          </div>
          
          <h4>Turn off Dynamic Behavior</h4>

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
        
        <div class="well clearboth">
          <p class="lead">            
              Select another option
          </p>
          
          <ul>
          <li><a href="/api/admin/crm/" class="lead">Manage Numbers + Campaign Relationships for Tracking</a></li>
          <li><a href="/api/admin/api/" class="lead">View API + Script Usage To Use On Sites</a></li>          
          </ul>
        </div>

{/block}

{block name=jscustom}

<script src="/api/crm.js?v.1.0"></script>

{/block}



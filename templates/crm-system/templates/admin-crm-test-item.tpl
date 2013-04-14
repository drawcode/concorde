{extends 'base.tpl'}

{block name=csscustom}{/block}
    

{block name=navtitle}CRM{/block}


{block name=navitems}
                <li><a href="/api/">Home</a></li>
                <li><a href="/api/admin/crm/">Manage</a></li>
                <li><a href="/api/admin/api">API</a></li>
                <li class="active"><a href="/api/admin/test/">Test</a></li>
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
            Test + Validate Number + Campaign Flows
        </p>

        <a id="cookies-clear" class="btn btn-danger">Clear All Test Cookies</a>
        <a id="cookies-clear" class="btn btn-info">Launch Test as </a>
  
        <div class="span12"><p></p>
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

$(function() {
  $("#cookies-clear").on("click", function(event){
    //$.cookie();
  });
});



{/block}



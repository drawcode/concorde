{extends 'base.tpl'}

{block name=csscustom}{/block}
    

{block name=navtitle}CRM{/block}


{block name=navitems}
                <li><a href="/api/">Home</a></li>
                <li class="active"><a href="/api/admin/crm/">Manage</a></li>
                <li><a href="/api/admin/api">API</a></li>
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
            Manage Numbers + Campaign Relationships for Tracking
        </p>
        <p>Double click to edit. Upon change, it auto saves and updates cache for latest numbers/campaigns.</p>
        <div id="crm-number-campaign-meta"><img src="/api/base/img/load.gif"></div>
  
        <div clas="span12"><p></p>
          <p class="lead">
              Select another option
          </p>
          
          <ul>
            <li><a href="/api/admin/api/" class="lead">View API + Script Usage To Use On Sites</a></li>          
            <li><a href="/api/admin/test/" class="lead">Test Dynamic Numbers</a></li>   
          </ul>
        </div>

{/block}

{block name=jscustom}
<script>  
  
$(function () {
    serviceApi = new ServiceAPI();
    
    href = document.location.href;
    
    
    crmNumberCampaignMetaFilter = {
      div: '#crm-number-campaign-meta', 
      code: '', 
      rangeType: 'all',
      page: 1,
      pageSize: 25
    };
    ServiceAPI.Instance.services.crmService.getCRMNumberCampaignMeta(crmNumberCampaignMetaFilter, '');
    
    
});
</script>

{/block}



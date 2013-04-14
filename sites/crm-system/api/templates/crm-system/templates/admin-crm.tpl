{extends 'base.tpl'}

{block name=csscustom}{/block}
    

{block name=navtitle}CRM{/block}


{block name=navitems}
                <li><a href="/api/">Home</a></li>
                <li class="active"><a href="/api/admin/crm/">Manage</a></li>
                <li><a href="/api/admin/api">API</a></li>
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
        <span class="pull-right"><a href="javascript:void(0);" id="crm-number-campaign-meta-add" class="btn btn-large btn-success">Add New</a></span>
        <p class="lead">
            Manage Numbers + Campaign Relationships for Tracking
        </p>
        <div id="crm-number-campaign-meta"><img src="/api/base/img/load.gif"></div>
  
        <div class="well clearboth">
          <p class="lead">
              Select another option
          </p>
          
          <ul>
            <li><a href="/api/admin/api/" class="lead">View API + Script Usage To Use On Sites</a></li>          
            <li><a href="/api/admin/test/" class="lead">Test Dynamic Numbers</a></li>   
          </ul>
        </div>
        
        <!-- Modal -->
<div id="modalDelete" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="modalDeleteLabel" aria-hidden="true">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">X</button>
    <h3 id="modalDeleteLabel">Delete Number Campaign</h3>
  </div>
  <div class="modal-body">
    <p>Are you sure you want to delete this number campaign?</p>
  </div>
  <div class="modal-footer">
    <button class="btn" data-dismiss="modal" aria-hidden="true">Cancel</button>
    <button id="modal-delete-confirm" data-dismiss="modal" class="btn btn-primary">Delete</button>
  </div>
</div>

{/block}

{block name=jscustom}

<script src="/api/crm.js?v.1.0"></script>
<script>
  $(function() {
    crm.crmAdmin();
  });
</script>

{/block}



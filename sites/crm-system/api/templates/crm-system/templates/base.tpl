
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>{block name=title}CRM CRM - Number + Campaign Manager{/block}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- CSS -->
    <link href="/api/base/css/bootstrap.css" rel="stylesheet">
    <style type="text/css">

      /* Sticky footer styles
      -------------------------------------------------- */

      html,
      body {
        height: 100%;
        /* The html and body elements cannot have any padding or margin. */
      }

      /* Wrapper for page content to push down footer */
      #wrap {
        min-height: 100%;
        height: auto !important;
        height: 100%;
        /* Negative indent footer by it's height */
        margin: 0 auto -60px;
      }

      /* Set the fixed height of the footer here */
      #push,
      #footer {
        height: 60px;
      }
      #footer {
        background-color: #f5f5f5;
      }

      /* Lastly, apply responsive CSS fixes as necessary */
      @media (max-width: 767px) {
        #footer {
          margin-left: -20px;
          margin-right: -20px;
          padding-left: 20px;
          padding-right: 20px;
        }
      }



      /* Custom page CSS
      -------------------------------------------------- */
      /* Not required for template or sticky footer method. */

      #wrap > .container {
        padding-top: 60px;
      }
      .container .credit {
        margin: 20px 0;
      }

      code {
        font-size: 80%;
      }

    </style>
    <link href="/api/base/css/bootstrap-responsive.css" rel="stylesheet">
    <link href="/api/base/css/base.css" rel="stylesheet">
      
    {block name=csscustom}<!-- CUSTOM STYLES -->{/block}

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="/api/base/js/html5shiv.js"></script>
    <![endif]-->

    <!-- Fav and touch icons -->
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="../assets/ico/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="../assets/ico/apple-touch-icon-114-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="../assets/ico/apple-touch-icon-72-precomposed.png">
    <link rel="apple-touch-icon-precomposed" href="../assets/ico/apple-touch-icon-57-precomposed.png">
    <link rel="shortcut icon" href="../assets/ico/favicon.png">
    {block name=csscustom}{/block}
  </head>

  <body>


    <!-- Part 1: Wrap all page content here -->
    <div id="wrap">

      <!-- Fixed navbar -->
      <div class="navbar navbar-fixed-top">
        <div class="navbar-inner">
          <div class="container">
            <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <a class="brand" href="#">{block name=navtitle}CRM{/block}</a>
            <div class="nav-collapse collapse">
              <ul class="nav">
                {block name=navitems}
                <li class="active"><a href="/api/">Home</a></li>
                <li><a href="/api/admin/crm/">CRM</a></li>
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
              </ul>
            </div><!--/.nav-collapse -->
          </div>
        </div>
      </div>

      <!-- Begin page content -->
      <div class="container">
        {block name=maincontent}
        <div class="page-header">
          <h1>Number + Campaign Manager</h1>
        </div>
        <p class="lead">
            Manage number + campaign relationship...
        </p>
        
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
      {/block}
      </div>

      <div id="push"></div>
    </div>

    <div id="footer">
      <div class="container">
        <p class="muted credit">{block name=footercontent}CRM CRM Manager - Developed at Drawbackwards{/block}</p>
      </div>
    </div>
{literal}
  <script>
    <!--
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  
    ga('create', 'UA-39816938-1', 'crm.crm.drawcode.com');
    ga('send', 'pageview');
  -->
  </script>
  {/literal}

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script src="http://code.jquery.com/jquery-migrate-1.1.0.min.js"></script>
    <script src="/api/base/js/bootstrap.min.js"></script>
    <script src="/api/base/js/base.js"></script>
    <script src="/api/api.js?v.1.0"></script>
    <script src="/api/admin/api-admin.js?v.1.0"></script>
    {block name=jscustom}{/block}

  </body>
</html>

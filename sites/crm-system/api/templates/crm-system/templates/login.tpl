{extends 'base.tpl'}


{block name=csscustom} 
  <link href="/api/base/css/login.css" rel="stylesheet">
{/block}
    

{block name=navtitle}CRM{/block}


{block name=navitems} 
{/block}


{block name=maincontent}
<form class="form-signin" method="post">
        <h2 class="form-signin-heading">Please sign in</h2>
        <p>{$msg}</p>
        <input name="username" type="text" class="input-block-level" placeholder="Username">
        <input name="password" type="password" class="input-block-level" placeholder="Password">
        <button class="btn btn-large btn-primary" type="submit">Sign in</button>
      </form>

{/block}

{block name=jscustom}{/block}



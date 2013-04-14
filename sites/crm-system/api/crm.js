// CRM SERVICES -- Must be after Google Analytics
(function() {
  if(window.crm) {
    window.crm.crm();
  }
  else {
    if(window.console){
      window.console.log('crm', 'load failed');
    }
  }
}());

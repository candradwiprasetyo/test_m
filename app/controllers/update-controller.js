(function() {
'use strict';

  angular
    .module('app')
    .controller('UpdateController', UpdateController);

  UpdateController.$inject = ['CiayoService','$cookieStore'];
  function UpdateController(CiayoService, $cookieStore) {
    var vm = this;

    vm.getUpdate = getUpdate;
    function getUpdate() {
      var lang = $cookieStore.get('language');
      var c={
          data:{
              page_id:10,
              language_id:lang
          }
      }
      CiayoService.Api('page/detail', c, function(response) {
          if(response.status == 200) {
              vm.content = response.data.c.data.content.content;
          } else {
              window.alert('error');
          }
      });
    }

    vm.getUpdate();
  }
})();
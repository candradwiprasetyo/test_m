(function() {
'use strict';

  angular
    .module('app')
    .factory('welcomeConnector', welcomeConnector);

  welcomeConnector.$inject = ['CiayoService'];
  function welcomeConnector(CiayoService) {
    var welcomeConnector = {
      register: register,
      login: login,
      forgotPassword: forgotPassword,
      resetPassword: resetPassword
    };

    return welcomeConnector;

    ////////////////

    function register(type, email, phone, pass, info, ref) {
      if(type==="email") {
        var data = {
          email: email,
          password: pass,
          info: info,
          referral_id: ref
        }
      } else {
        var data = {
          phone: phone,
          password: pass,
          info: info,
          referral_id: ref
        }
      }

      return CiayoService.get('register', data).then(
        function(data){
          return data;
        },
        function(response){
          return response;
        }
      );
    }
    
    function login(type, email, phone, pass) {
      if(type==="email") {
        var data = {
          email: email,
          password: pass
        }
      } else {
        var data = {
          phone: phone,
          password: pass
        }
      }

      return CiayoService.get('login', data).then(
        function(data){
          return data;
        },
        function(response){
          return response;
        }
      );
    }
    
    function forgotPassword(type, email, phone) { 
      if(type==="email") {
        var data = {
          email: email
        }
      } else {
        var data = {
          phone: phone
        }
      }

      return CiayoService.get('password', data).then(
        function(data){
          return data;
        },
        function(response){
          return response;
        }
      );
    }
    
    function resetPassword() { }
  }
})();
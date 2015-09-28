/*
 *
 *  FACTORY PLAY/ATG
 *
 *  - initialize():
 *  - getMenu():
 *  - getPage():
 *  - getContents():
 *  - getIds():
 *  - getSearch():
 *  - getLimit():
 *  - getProgram():
 *  - formatText():
 *  - formatPicture():
 *  - isTag():
 *
 */

define(function (require) {
  "use strict";
  var $                   = require('jquery'),
      _                   = require('underscore'),
      Backbone            = require('backbone');

  return Backbone.View.extend({

 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                              *
 *  Factory Play - Vars                                                                         *
 *                                                                                              *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    urlGet: {
      g5 : {
        csat  : 'http://secure-g5-snl.canal-plus.com/GNCPF/vod/cplusod/ctx/json/g5r7t/',
        cplus : 'http://secure-g5-snl.canal-plus.com/GNCPF/vod/cplusod/ctx/json/g5r7t/',
      },
      g6 : {
        csat  : 'http://10.0.1.210/GNCPF/vod/cplusod/ctx/json/g5r7t/',
        cplus : 'http://10.0.1.210/GNCPF/vod/cplusod/ctx/json/g5r7t/',
      },
      miami: {
        csat  : 'http://secure-csat-miami-ws.canal-plus.com/ctx/json/miami/',
        cplus : 'http://secure-cplus-miami-ws.canal-plus.com/ctx/json/miami/'
      },
      samsung: {
        csat  : 'http://secure-csat-directtv-ws.canal-plus.com/ctx/json/d2tv/',
        cplus : 'http://secure-cplus-directtv-ws.canal-plus.com/ctx/json/d2tv/'
      }
    },
    urlMedia: {
      g5 : {
        cplus : 'http://image.canal-plus.com',
        csat  : 'http://image.canal-plus.com',
      },
      g6 : {
        cplus : 'http://10.0.1.210',
        csat  : 'http://10.0.1.210',
      },
      miami: {
        csat  : 'http://image.canal-plus.com',
        cplus : 'http://image.canal-plus.com'
      },
      samsung: {
        csat  : 'http://image.canal-plus.com',
        cplus : 'http://image.canal-plus.com'
      }
    },
    urlChannel  : 'http://image.canal-plus.com',
    data        : {},
    menu        : {},
    filter      : {},
    contents    : [],
    alerts      : {},
    channelName : 0,

    getUrlbyTarget: function(type, basket) {
      if (!basket) {
        basket = 'csat';
      }
      if (this[type][App.config.platform]) {
        return this[type][App.config.platform][basket];
      }
      return this[type][App.config.target][basket];
    },

    initialize: function(opts) {
      var self = this;

      switch(App.config.service) {
        case 'csat':
          this.urlGet[App.config.env] = this.getUrlbyTarget('urlGet', 'csat') + 'csatod' + '/xtc/ws';
          App.pageUrlHome             = this.urlGet[App.config.env] + '/page/csatald_selection';
          break;
        case 'cplus':
          this.urlGet[App.config.env] = this.getUrlbyTarget('urlGet','cplus') + 'cplusod' + '/xtc/ws';
          App.pageUrlHome             = this.urlGet[App.config.env] + '/page/homecplus';
          break;
        case 'm6replay':
          this.urlGet[App.config.env] = this.getUrlbyTarget('urlGet', 'csat') + 'm6replay' + '/xtc/ws';
          App.pageUrlHome             = this.urlGet[App.config.env] + '/page/default/6Play_chaine_M6';
          break;
        case 'passSeries':
          this.urlGet[App.config.env] = this.getUrlbyTarget('urlGet', 'csat') + 'csatod' + '/xtc/ws';
          App.pageUrlHome             = this.urlGet[App.config.env] + '/page/default/csatald_chaine_passSeries_selection';
          break;
        case 'passxxl':
          this.urlGet[App.config.env] = this.getUrlbyTarget('urlGet', 'csat') + 'csatod' + '/xtc/ws';
          App.pageUrlHome             = this.urlGet[App.config.env] + '/page/default/csatald_chaine_passxxl_selection';
          break;
        case 'passpinkx':
          this.urlGet[App.config.env] = this.getUrlbyTarget('urlGet', 'csat') + 'csatod' + '/xtc/ws';
          App.pageUrlHome             = this.urlGet[App.config.env] + '/page/default/csatald_chaine_passpinkx_selection';
          break;
        default:
          this.urlGet[App.config.env] = this.getUrlbyTarget('urlGet', 'csat') + 'csatod' + '/xtc/ws';
          App.pageUrlHome             = this.urlGet[App.config.env] + '/page/default/csatald_chaine_' + App.config.service;
          break;
      }

      this.alerts = this.getAlerts();

      if(App.config.type == "portal" || App.config.type == "widget") {
        App.getUserInfos(function() {
          if((App.config.service == 'csat'       && App.user.abo.csat) ||
             (App.config.service == 'cplus'      && App.user.abo.cplus) ||
             (App.config.service == 'm6replay'   && (App.user.abo.csat || App.user.abo.cplus || App.user.abo.m6)) ||
             (App.config.service == 'passSeries' && App.user.abo.passSeries) ||
             (App.config.service == 'passpinkx'  && App.user.abo.passpinkx) ||
             (App.config.service == 'passxxl'    && App.user.abo.passxxl) ||
             (App.config.service != 'cplus'      && App.user.abo.csat && App.config.type == "widget")) {

            App.showPrehome();
            self.getPage(App.pageUrlHome, 1, function(data) {

              if(App.config.type != "widget") {
                App.activeModule('mosaic');
              }
              App.data = data;
              if(App.config.type == "widget") {
                App.data.page.url = App.pageUrlHome = data.contents[0].url;
              }

              App.mosaic.render();
              App.mosaic.focus(0);

              if(App.data.navigation.menu) {
                App.factory.getMenu(App.data.navigation.menu.url, function(menuData){
                  App.data.navigation.menu = menuData;
                  App.navigation.create('menu');
                  if(App.config.type == 'widget') {
                    App.navigation.show('menu');
                  }
                });
              } else {
                if(App.config.type == 'widget') {
                  App.activeModule('mosaic');
                }
              }
              if(App.config.type == "widget") {
                if(App.config.service == 'cplus') {
                  document.getElementById('logo').src = 'assets/images/_logos/canalplus-widget.png';
                } else {
                  var channel = App.config.service.split('_');
                  document.getElementById('logo').src = 'assets/images/_channels/'+channel[0]+'.png';
                }
              }

              //alert
              if(App.data.page.alert) {

                App.alert.render();
                App.activeModule('alert');

              }


            });
          } else {
            App.hidePrehome();

            if(App.config.type == 'widget') {
              $('#wrapper').hide();
            } else {
              App.data = {
                page : {
                  url: App.pageUrlHome,
                  alert: self.alerts['subscribe'+App.config.service.substring(0,1).toUpperCase() + App.config.service.substring(1)]
                }
              };
              App.mosaic.render();
              App.alert.render();
              App.activeModule('alert');

              // log omniture
              App.log('omniture', {
                channel   : 'R7',
                eVar11    : App.user.msd,
                eVar17    : 'TNT',
                eVar19    : '', // error
                pageName  : App.config.service + "ALD R7 - Prospect",
                prop4     : App.config.service + "ALD R7"
              });
            }
          }
        });
      }
    },


 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                              *
 *  Factory Play - Get Alerts                                                                   *
 *                                                                                              *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    getAlerts: function() {
      return {
        error: {
          id        : 'error',
          type      : 'alert',
          title     : 'Houston, <br/>Nous avons un problème',
          subtitle  : 'L\'application ne parvient pas à se connecter à la plateforme vidéo.',
          btns      : [{
            label : "Relancer",
            url   : App.pageUrlHome
          }]
        },
        errorEureka : {
          id        : 'errorEureka',
          type      : 'alert',
          title     : 'Euréka est indisponible',
          subtitle  : 'Désolé, Euréka n\'est pas disponible. <br/>'+
                      'Peut-être n\'avez-vous pas activé le service ou n\'avez-vous '+
                      'pas regardé suffisamment de programmes pour que nous '+
                      'puissions vous proposer des recommandations personnalisées',
          btns      : [{
            label : "Fermer",
            url   : App.pageUrlHome
          }]
        },
        adultDisclaimer : {
          id        : 'adultDisclaimer',
          type      : 'alert',
          title     : 'Interdit aux moins de 18 ans',
          subtitle  : 'Le fait par tout adulte, de proposer ou d’imposer à la vue d’un mineur, à des fins immorales, '+
                      'les films ou émissions de cette rubrique, est passible d’une peine de 5 à 7 ans '+
                      'd\'emprisonnement et de 75 000 à 100 000 euros d’amende.<br/><br/>'+
                      '<span>Appuyez sur OK pour saisir votre code parental.</span>',
          btns      : [{
            label : "Ok",
            url   : "parental_auth"
          },
          {
            label : "Annuler",
            url   : App.pageUrlHome
          }]
        },
        adultBan : {
          id        : 'adultBan',
          type      : 'alert',
          title     : 'La catégorie adulte est verrouillée',
          subtitle  : 'Vous avez effectué cinq saisies de code perso erronées.'+
                      '<br/>Par mesure de sécurité, votre accès à la rubrique adulte est bloqué pendant quelques minutes.'+
                      '<br/>Veuillez réessayer ultérieurement.',
          btns      : [{
            label : "Fermer",
            url   : App.pageUrlHome
          }]
        },
        adultCharme : {
          id        : 'adultCharme',
          type      : 'alert',
          title     : 'Vos programmes <br/>ne sont pas disponibles',
          subtitle  : 'Retrouvez les programmes de la rubrique CHARME <br/>chaque jour de 22h30 à 5h00.',
          btns      : [{
            label : "Fermer",
            url   : App.pageUrlHome
          }]
        },
        subscribeCsat : {
          id        : 'subscribeCsat',
          type      : 'alert',
          title     : 'La plus grande bibliothèque <br/>à la demande jamais proposée',
          subtitle  : 'Choisissez à tout instant le programme qui vous plaît vraiment. ' +
                      '<br/>65 chaînes, plus de 7000 programmes à regarder quand ' +
                      '<br/>vous voulez. Service gratuit et inclus dans votre abonnement ' +
                      '<br/>aux chaînes CANALSAT.',
          btns      : [{
            label : 'Je m\'abonne',
            url   : 'subscribeCsat'
          }]
        },
        subscribeCplus : {
          id        : 'subscribeCplus',
          type      : 'alert',
          title     : 'Les programmes vous attendent <br/>pour commencer',
          subtitle  : 'Choisissez de regarder les programmes de CANAL+'+
                      '<br/>quand vous voulez. Service gratuit et inclus dans votre'+
                      '<br/>abonnement aux chaînes CANAL+.',
          btns      : [{
            label : 'Je m\'abonne',
            url   : 'subscribeCplus'
          }]
        },
        linkPortalCsat : {
          id        : 'linkPortalCsat',
          type      : 'alert',
          title     : '<img src="assets/images/_logos/csat-vod.png" alt="">',
          subtitle  : 'Appuyez sur ok pour accéder au service et Profiter'+
                      '<br/>quand vous voulez des programmes de CANALSAT',
          btns      : [{
            label : 'Ouvrir',
            url   : 'portalCsat'
          }]
        },
        linkPortalCplus : {
          id        : 'linkPortalCplus',
          type      : 'alert',
          title     : '<img src="assets/images/_logos/cplus-vod.png" alt="">',
          subtitle  : 'Appuyez sur ok pour accéder au service et Profiter'+
                      '<br/>quand vous voulez des programmes de CANAL+',
          btns      : [{
            label : 'Ouvrir',
            url   : 'portalCplus'
          }]
        }
      };
    },


 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                              *
 *  Factory Play - Get Menu                                                                     *
 *                                                                                              *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    getMenu: function(url, callback) {
      var self    = this;

      App.proxy.request({
        url       : url,
        method    : 'POST',
        body      : {
          'type'    : 'menu',
          'itemType': 'options',
          'depth'   : 4,
          'mode'    : 'menu',
          'filters' : [],
          'range'   : {
            'itemType': 'range',
            'start'   : 1,
            'size'    : 100
          }
        },
        callback  : function(data) {
          data = self.clean(data);
          if(data.menu) {
            var defaultTrigger = 'Tous les programmes';
            if(App.config.service == 'm6replay') defaultTrigger = 'Programmes 6play M6';

            self.menu = {
              id       : data.id,
              url      : self.urlGet[App.config.env] + data.url,
              type     : 'menu',
              trigger  : (App[App.config.type].channelTemp && App[App.config.type].channelTemp.name) ? 'Programmes '+ App[App.config.type].channelTemp.name : defaultTrigger,
              back     : 'Retour',
              children : []
            };
            for (var i = 0; i < data.menu.length; i++) {
              var menuItem = self.cleanMenuItem(data.menu[i]);
              if(menuItem)
                self.menu.children[i] = menuItem;
              if(data.menu[i].menu) {
                self.menu.children[i].children = [];
                for (var j = 0; j < data.menu[i].menu.length; j++) {
                  var menuItem = self.cleanMenuItem(data.menu[i].menu[j]);
                  if(menuItem)
                    self.menu.children[i].children[j] = menuItem;
                  if(data.menu[i].menu[j].menu) {
                    self.menu.children[i].children[j].children = [];
                    for (var k = 0; k < data.menu[i].menu[j].menu.length; k++) {
                      var menuItem = self.cleanMenuItem(data.menu[i].menu[j].menu[k]);
                      if(menuItem)
                        self.menu.children[i].children[j].children[k] = menuItem;
                    };
                  }
                };
              }
            };

            if(App.config.type == 'portal') {
              if(self.menu.url.indexOf('/content/cplusald') != -1 || self.menu.url.indexOf('/content/csatald_selection') != -1) {
                var eureka = {
                  id: "csatald_eureka",
                  url: self.urlGet[App.config.env]+"/page/eureka",
                  title: "Recommandé pour vous"
                };
                if(App.config.service == 'cplus')
                  self.menu.children.push(eureka);
                if(App.config.service == 'csat')
                  self.menu.children.unshift(eureka);
              }
            }

            if(App.config.type == 'widget') {
              // selection
              var selection = {
                  "id": "selection",
                  "url": self.data.contents[0].url,
                  "title": "Nouveautés"
              };
              self.menu.children.unshift(selection);
              // portal
              var portal = {
                  "id": "link-portal",
                  "url": "link-portal",
                  "title": "Accès au portail"
              };
              self.menu.children.push(portal);
            }

            callback(self.menu);
          } else {
            callback(data);
          }
        }
      });
    },

    cleanMenuItem: function(data) {
      // Widget hack :
      // - put url content instead of url page
      // - remove link and internalLink

      if(App.config.type == 'widget' && (data.itemType == 'link' || data.itemType == 'internalLink'))
        return 0;

      var output = {
        id: data.id,
        url: (data.itemType == 'list' && App.config.type != 'widget') ? this.urlGet[App.config.env] + '/page/default/' +data.id : this.urlGet[App.config.env]+data.url,
        title: data.title
      };

      return output;
    },


 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                              *
 *  Factory Play - Get Page & contents                                                          *
 *                                                                                              *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    getPage: function(url, page, callback) {
      var self    = this,
          params  = App.getParamsFromUrl(url),
          classes = this.getClasses(url);

      if(params.url != App.getParamsFromUrl(App.data.page.url, 'url')) {
        // fix transition quickly
        $('.mosaic').css('backgroundImage', 'none').attr('class', 'mosaic ' + classes);
        $('.mosaic--pager').removeClass('mosaic--pager');
        $('.mosaic-title, .mosaic-subtitle').remove();
        App.navigation.remove('filter');

        App.proxy.request({
          url       : params.url,
          method    : 'GET',
          body      : {
            'type'    : 'page'
          },
          callback: function(data){
            data = self.clean(data);
            if(data.itemType == 'page') {
              self.data = {
                page: {
                  url       : url,
                  type      : self.getType(url),
                  title     : data.name,
                  template  : {
                    grid    : (App.config.type == 'widget') ? '5' : data.data.grid,
                    classes : classes,
                    background: (data.background) ? data.background : 0
                  },
                  prehome   : (data.data.prehomeActive) ? {
                    timeout : data.data.prehomeTimeout,
                    picture : data.data.prehomeURL
                  } : 0
                },
                navigation: {
                  menu    : 0,
                  filter  : 0
                },
                contents : []
              };

              // parent url for channel-level2
              if(self.data.page.type == 'channel-level2') {
                var thematicPos     = self.data.page.url.indexOf('_', self.data.page.url.indexOf("csatald_chaine_") + 15);
                self.data.page.parentUrl = self.data.page.url.substring(0, thematicPos) + '_selection';
              }

              var menuUrl     = (data.data.menu) ? self.urlGet[App.config.env] + data.data.menu : 0,
                  contentsUrl = (data.zones && data.zones[0] && data.zones[0].data && data.zones[0].data.url)
                                ? self.urlGet[App.config.env] + data.zones[0].data.url : 0;
              if(menuUrl) {
                if(App.data.navigation && App.data.navigation.menu && App.data.navigation.menu.url && App.data.navigation.menu.url == menuUrl) {
                  self.data.navigation.menu = self.menu;
                } else {
                  self.data.navigation.menu = {
                    url: menuUrl
                  };
                }
              }

              if(params.filter)
                contentsUrl = contentsUrl + '?' + params.filter;

              if(contentsUrl) {
                self.getContents(contentsUrl, page, function() {
                  callback(self.data);
                });
              } else {
                callback(self.data);
              }

            } else {
              callback(data);
            }
          }
        });
      } else {
        if(params.filter) {
          this.data.page.url         = url;
          this.data.contents[0].url  = App.getParamsFromUrl(this.data.contents[0].url, 'url') + '?' + params.filter;
        }
        this.getContents(this.data.contents[0].url, page, function() {
          callback(self.data);
        });
      }

    },

    getContent: function(url, callback) {
      var self = this,
          mode = 'full',
          filters = [];
      App.proxy.request({
        url       : url,
        method    : 'POST',
        body      : {
          type: 'contents',
          depth: 3,
          filters: [],
          itemType: 'options',
          mode: 'full',
          offers: {
            adult: true,
            itemType: 'offers',
            showAll: true,
            subOffers: ['RALD_PANO']
          },
          range: {
            itemType: 'range',
            size: 100,
            start: 1
          },
          sort: {
            itemType: 'sortElement',
            sortKey: 'title',
            sortOrder: 'asc'
          }
        },
        callback: function(data) {
          data = self.clean(data);
          callback(self.cleanContent(data));
        }
      });
    },

    getContents: function(url, page, callback) {
      var self    = this,
          params  = App.getParamsFromUrl(url),
          filters = [],
          limit   = this.getLimit(this.data.page.template.grid),
          mode    = 'full';
          //mode    = 'short-r7';

      if(url == this.urlGet[App.config.env] + 'csatod/xtc/ws/perso') {
        mode = 'vm-services';
      }

      if(params.filter) {
        var filterTab = params.filter.split('=');
        if(filterTab[1] != '*')
          filters = [{
            "itemType": "filterElement",
            "filterKey": filterTab[0]+":\""+filterTab[1]+"\""
          }];
      }

      App.proxy.request({
        url       : params.url,
        method    : 'POST',
        body      : {
          'type': 'contents',
          'itemType': 'options',
          'depth': 1,
          'mode': mode,
          'filters': filters,
          'range': {
            'itemType': 'range',
            'start': (page-1) * limit + 1,
            'size': limit
          },
          'offers': {
              'itemType': 'offers',
              'adult': 'true',
              'showAll': false
          }
        },
        callback: function(data){
          data = self.clean(data);

          if(data.type == "alert") {
            self.data.page.alert = data;
          }


          self.contents[0] = {
            url      : url,
            title    : data.title,
            subtitle : (App.config.type == 'portal' && App.portal.channelTemp.name && self.data.page.type != 'channels') ? App.portal.channelTemp.name : 0,
            grid     : self.data.page.template.grid,
            children : [],
            paging   : {
              page            : (data.range && data.range.page)       ? data.range.page       : 1,
              pageTotal       : (data.range && data.range.nbPage)     ? data.range.nbPage     : 1,
              contentPerPage  : (data.range && data.range.sizePage)   ? data.range.sizePage   : 1,
              contentTotal    : (data.range && data.range.nbResults)  ? data.range.nbResults  : 1
            }
          };

          if(filterTab && filterTab[1] && filterTab[1] != '*') self.contents[0].title = data.title + ' - ' + filterTab[1];

          // hack for Portal & Campus homepages
          if((App.config.type == 'portal' && (self.data.page.url == App.pageUrlHome || self.data.page.url.indexOf('_selection') != -1)) || (App.context.module=='campusSubjectList')) {
            self.contents[0].paging.pageTotal = 1;
          }

          // grid for homepage
          if(!self.contents[0].grid || self.contents[0].grid === '') {
            var contentsTotal = (data.contents && data.contents.length) ? data.contents.length : 0;
            if(contentsTotal) {
              var firstHasSelection   = self.isTag(data.contents[0], 'display', 'selection'),
                  secondHasSelection  = self.isTag(data.contents[1], 'display', 'selection'),
                  contentsStop,
                  grid;
              if(firstHasSelection && secondHasSelection) {
                grid = '24';
                contentsStop = 6;
              } else if(firstHasSelection) {
                grid = '34';
                contentsStop = 7;
              } else {
                grid = '44';
                contentsStop = 8;
              }
              if(contentsTotal > contentsStop) {
                  data.contents.splice(contentsStop, contentsTotal-contentsStop);
              }
              self.contents[0].grid = grid;
            }
          }

          // contents
          var children = [];
          if(data.result && data.result.contents) {
            children = data.result.contents;
          } else if(data.contents) {
            children = data.contents;
          }

          for(var i = 0; i < children.length; i++) {
            var size = App.mosaic.grid[self.contents[0].grid].size[i];
            self.contents[0].children[i] = self.cleanContent(children[i], size);
          }

          self.data.contents[0] = self.contents[0];

          // error eureka
          if(url.indexOf('/perso') != -1 && !self.data.contents[0].children.length) {
            self.data.page.alert = self.alerts.errorEureka;

            // log omniture
            App.log('omniture', {
              channel   : 'R7',
              eVar11    : App.user.msd,
              eVar17    : 'TNT',
              eVar19    : self.data.page.alert.subtitle, // error
              pageName  : App.config.service + "ALD R7 - Eureka",
              prop4     : App.config.service + "ALD R7"
            });
          }

          // adult disclaimer and ban
          if(data.ratingCSA == 5 && self.data.page.type != 'channels') {
            if(App.context.isAdultBan)
              self.data.page.alert = self.alerts.adultBan;
            else if(!App.context.isAdultOK)
              self.data.page.alert = self.alerts.adultDisclaimer;
          } else {
            App.context.isAdultOK = 0;
          }

          // filters
          var pageUrl = App.getParamsFromUrl(self.data.page.url, 'url');

          if(data.filters && data.filters.length && App.config.service != 'cplus') {
            if(self.data.navigation.filter.url != pageUrl) {
              self.filter = {
                url       : pageUrl,
                trigger   : 'Filtre',
                back      : '',
                children  : []
              };
              for (var i = 0; i < data.filters.length; i++) {
                if(data.filters[i].filterElements && data.filters[i].filterElements.length){
                  for (var j = 0; j < data.filters[i].filterElements.length; j++) {
                    self.filter.children.push({
                      id: data.filters[i].filterElements[j].id,
                      url: pageUrl+'?'+data.filters[i].filterElements[j].filterKey+'='+data.filters[i].filterElements[j].filterValue,
                      title: data.filters[i].filterElements[j].displayName,
                      type: 'list'
                    });
                  }
                }
              }
              self.data.navigation.filter = self.filter;
            }
          } else {
            self.data.navigation.filter = 0;
          }

          callback(self.data);

        }
      });
    },

    cleanContent: function(data, size) {
      var output = {tags: {}};
      if(data.id) {
        output.id        = (data.contents) ? data.contents[data.contents.length-1].id : data.id;
        output.idKey     = (data.contents) ? data.contents[data.contents.length-1].idKey : data.idKey;
        output.contentUrl = this.urlGet[App.config.env] + (data.contents ? data.contents[data.contents.length-1].url : data.url);
        if(data.itemType) {
          output.type    = data.itemType;
          if(output.type == 'channel' || output.type == 'externalChannel' || output.type == 'advanceChannel') {
            output.type     = 'channel';
            output.epgId    = (data.epgId) ? data.epgId : 15;
            output.disabled = (!data.visible) ? 1 : 0;
            output.banner   = this.formatPicture(data.picture, 'default', 'banner', 'jpg');
            output.url      = (output.disabled)
                              ? App.getArpu() + 'IdEPG='+output.epgId
                              : this.urlGet[App.config.env] + '/page/default/csatald_chaine_'+ App.proxy.getChannelID(output.id);
          } else {
            if(output.type == 'list') {
              output.url   = '/page/default/';
            } else {
              output.url   = '';
            }

            output.url     = (App.config.type == 'widget' && output.type == 'list' && data.url)
                             ? this.urlGet[App.config.env] + data.url
                             : this.urlGet[App.config.env] + output.url + output.id;
          }
        }
      }
      if(size)
        output.size      = size;
      if(data.displayTitle)
        output.title     = this.formatText(data.displayTitle, data, App.mosaic.titleSize[size]);
      if(data.displaySubTitle)
        output.subtitle  = (data.itemType && data.itemType != "list") ? this.formatText(data.displaySubTitle, data) : '';
      if(data.picture) {
        var ext = (output.type && (output.type == 'channel' || output.type == 'externalChannel' || output.type == 'advanceChannel')) ? 'png' : 'jpg';
        output.picture   = this.formatPicture(data.picture, 'default', size, ext);
      }
      if(data.channel) {
        output.tags.channel           = {};
        if(data.channel.id)
          output.tags.channel.id      = data.channel.id;
        if(data.channel.name)
          output.tags.channel.name    = data.channel.name;
        if(data.channel.epgId)
          output.tags.channel.epgId   = data.channel.epgId;
        if(data.channel.picture)
          output.tags.channel.picture = this.formatPicture(data.channel.picture, 'black', '98_73', 'png');
      }
      if(data.ratingCSA)
        output.tags.csa  = data.ratingCSA;
      if(this.contents[0].url.indexOf('/perso') != -1 || this.isTag(data, 'Eureka')) {
        output.tags.eureka = 1;
      }
      if(this.isTag(data, 'sticker', 'EXCLUSIF')) {
        output.tags.sticker = 'enPlus';
      } //console.log(output)
      return output;
    },

    getClasses: function(url) {
        var id      = url.substring(url.indexOf('/ws')+3),
            classes = '';

        // clean the id
        if(id.indexOf("/page/default/") === 0){
            id = id.substring(14);
        }
        // channels
        if(id.indexOf("csatald_chaine_") === 0) {
            var channelPageID   = id.substring(15);
            var thematicPos     = channelPageID.indexOf('_');
            if(thematicPos > 0 && channelPageID.substring(thematicPos) != '_selection') {
                var channelClasses = 'tpl--channel-'+channelPageID.substring(0, thematicPos)+' tpl--channel-'+channelPageID+' tpl--channel-level2';
            } else if(thematicPos > 0) {
                var channelClasses = 'tpl--channel-'+channelPageID.substring(0, thematicPos)+' tpl--channel-'+channelPageID+' tpl--channel-level1';
            } else {
                var channelClasses = 'tpl--channel-'+channelPageID + ' tpl--channel-level1';
            }
            classes = classes + 'tpl--channel '+channelClasses+' ';
        } else if(id == App.pageUrlHome){
            // home
            classes = 'tpl--' + this.ald;
        } else {
            // default
            if(id.indexOf("/page/") === 0){
                id = id.substring(6);
            }
            var breadcrumb = id.split('_');
            for (var i = 0; i < breadcrumb.length; i++) {
                var bread = '';
                for (var j = 0; j <= i; j++) {
                    bread = bread + '_'+breadcrumb[j];
                };
                classes = classes + 'tpl--' + bread.substring(1) +' ';
            };
        }
        return classes;
    },

    getType: function(url) {
        var id      = url.substring(url.indexOf('/ws')+3),
            classes = '';

        // clean the id
        if(id.indexOf("/page/default/") === 0){
          id = id.substring(14);
        }
        if(id.indexOf("/page/") === 0){
          id = id.substring(6);
        }

        // channels
        if(url == App.pageUrlHome){
          return 'home';
        } else if(App[App.config.type].folderTemp && App[App.config.type].folderTemp.url && App[App.config.type].folderTemp.back == 0) {
          return 'folder';
        } else if(id.indexOf("csatald_chaines_") === 0) {
          return 'channels';
        } else if(id.indexOf("csatald_chaine_") === 0) {
          var channelPageID   = id.substring(15);
          var thematicPos     = channelPageID.indexOf('_');
          if(thematicPos > 0 && channelPageID.substring(thematicPos) != '_selection' && channelPageID != 'pere_noel') {
            return 'channel-level2';
          } else {
            return 'channel-level1';
          }
        } else {
          // default
          switch(id) {
            case 'search':
            case 'search_csat':
              return 'search';
              break;
            default:
              return 'thematic';
              break;
          }
        }
    },

 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                              *
 *  Factory Play - Get IDs                                                                      *
 *                                                                                              *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    getIds: function(opts, callback) {
      var url      = (typeof opts === 'object') ? opts.contentsUrl : opts,
          params   = App.getParamsFromUrl(url);

      var minimizeArray = function(contents) {
        return contents.reduce(function(extIds, content) {
          var _content = Array.isArray(content.contents) ? content.contents[content.contents.length - 1] : content;
          if (_content.type !== 'list') { extIds.push(_content.id); }
          return extIds;
        }, []);
      };

      if ((!this.data.extIds || this.data.extIds.url !== params.url) && this.data.contents[0].paging.pageTotal === 1) {
        this.data.extIds = {
          url : url,
          list: minimizeArray(this.data.contents[0].children)
        };
      }

      if (this.data.extIds && this.data.extIds.url === url ) {
        callback(this.data.extIds);
        return;
      }

      var filters = [];
      if (params.filter) {
        var filterTab = params.filter.split('=');
        if (filterTab[1] !== '*') {
          filters.push({
            itemType: "filterElement",
            filterKey: filterTab[0] + ":\"" + filterTab[1] + "\""
          });
        }
      }

      var reqUrl, reqBody;
      if (params.protocol) {
        var filters = [];
        if (params.filter) {
          var filterTab = params.filter.split('=');
          if (filterTab[1] !== '*') {
            filters.push({
              itemType: "filterElement",
              filterKey: filterTab[0] + ":\"" + filterTab[1] + "\""
            });
          }
        }

        reqUrl  = url;
        reqBody = {
          type:     'ids',
          itemType: 'options',
          depth:    1,
          mode:    'vm-minimal',
          filters: filters,
          range: {
            itemType: 'range',
            start:    1,
            size:     999
          },
          offers: {
            itemType: 'offers',
            adult:    'true',
            showAll:  false
          }
        };
      } else {
        reqUrl = this.urlGet[App.config.env] + '/search';
        reqBody = {
          type:     'search',
          itemType: 'searchOptions',
          depth:    1,
          mode:     'vm-minimal',
          filters:  [],
          request: {
            itemType: 'searchRequest',
            query:    'ratingCSA:[1 TO 4] AND (itemType:movie OR itemType:season OR itemType:show) AND title:' + params.url + '*'
          },
          range: {
            itemType: 'range',
            start:    1,
            size:     999
          },
          sort: {
            itemType:  'sortElement',
            sortKey:   'title',
            sortOrder: 'asc'
          },
          offers: {
            itemType: 'offers',
            adult:    'true',
            showAll:   false
          }
        };
      }

      var self = this;
      App.proxy.request({
        url       : reqUrl,
        method    : 'POST',
        body      : reqBody,
        callback  : function(data) {
          var list     = JSON.parse(data),
              contents = (list.result && list.result.contents) ? list.result.contents : list.contents;
          self.data.extIds = {
            url  : url,
            list : minimizeArray(contents)
          }
          callback(self.data.extIds);
        }
      });
    },

 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                              *
 *  Factory Play - Get Search                                                                   *
 *                                                                                              *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    getSearch: function(query, page, callback) {
      var self = this;

      App.proxy.request({
        url       : self.urlGet[App.config.env] + '/search',
        method    : 'POST',
        body      : {
          'type': 'search',
          'itemType': 'searchOptions',
          'depth': 1,
          'mode': 'short',
          'filters': [],
          'request': {
            'itemType': 'searchRequest',
            'query': 'ratingCSA:[1 TO 4] AND (itemType:movie OR itemType:season OR itemType:show) AND title:' + query + '*'
          },
          'range': {
            'itemType': 'range',
            'start': (page-1) * 5 + 1,
            'size': 5
          },
          'sort': {
            'itemType':'sortElement',
            'sortKey':'title',
            'sortOrder':'asc'
          },
          'offers': {
              'itemType': 'offers',
              'adult': 'true',
              'showAll': false
          }
        },
        callback: function(data){
          data = self.clean(data);
          //console.log(data)
          self.data = {
            page      : {},
            contents  : []
          };

          if(data.type == "alert") {
            self.data.page.alert = data;
          }

          if(data.result && data.result.contents) {
            var children = [];
            data.result.contents.forEach( function(content) {
              children.push(self.cleanContent(content, 'fifth'));
            });

            self.data.contents[0] = {
              url      : query,
              title    : query,
              grid     : '5',
              children : children,
              paging   : {
                page            : (data.range && data.range.page)       ? data.range.page       : 1,
                pageTotal       : (data.range && data.range.nbPage)     ? data.range.nbPage     : 1,
                contentPerPage  : (data.range && data.range.sizePage)   ? data.range.sizePage   : 1,
                contentTotal    : (data.range && data.range.nbResults)  ? data.range.nbResults  : 1
              }
            }
          }

          callback(self.data);
        }
      });
    },


 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                              *
 *  Factory Play - Helpers                                                                      *
 *                                                                                              *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    getLimit: function(grid) {
      var limit = 0;
      if(grid == '') return 8;
      limit = (grid.substr(0, 1) != '') ? limit + parseInt(grid.substr(0, 1)) : limit + 0;
      limit = (grid.substr(1, 1) != '') ? limit + parseInt(grid.substr(1, 1)) : limit + 0;
      limit = (grid.substr(2, 1) != '') ? limit + parseInt(grid.substr(2, 1)) : limit + 0;
      return limit;
    },

    clean: function(data) {
      var output = {};
      switch(data.substr(0,1)) {
        case '{':
          data = JSON.parse(data);
          if(data.code && data.code != 'SEARCH') {
            output = this.getError(data);
          } else {
            output = data;
          }
          break;
        case '[': // playlist, history
          contents = JSON.parse(xobj.responseText);
          output = {
            itemType: 'list',
            title: '',
            range: {
              itemType: 'range',
              page: 1,
              sizePage: 15,
              nbPage: 1,
              nbResults: contents.length
            },
            contents: contents
          };
          break;
        default: // error
          output = this.getError(data);
      }
      return output;
    },

    getError: function(data) {
      if(data) {
        if(data.message) {
          if(data.message.indexOf('not in access period') != -1) {
            var output = this.alerts.adultCharme;
          } else {
            var output = this.alerts.error;
                output.subtitle = data.message;
          }
        } else {
          var output = this.alerts.error;
              output.subtitle = data;
        }
      } else {
        var output = this.alerts.error;
      }

      // log omniture
      if(output.id == "error") {
        App.log('omniture', {
          channel   : 'R7',
          eVar11    : App.user.msd,
          eVar17    : 'TNT',
          eVar19    : output.subtitle, // error
          pageName  : App.config.service + "ALD R7 - Error",
          prop4     : App.config.service + "ALD R7"
        });
      }

      return output;
    },

    formatText: function(tpl, vars, limit) {
      if(vars.title)                              tpl = tpl.replace('${title}', vars.title);
      if(vars.parentSerie &&
         vars.parentSerie.title)                  tpl = tpl.replace('${parentSerie.title}', vars.parentSerie.title);
      if(vars.parentSeason &&
         vars.parentSeason.title)                 tpl = tpl.replace('${parentSeason.title}', vars.parentSeason.title);
      if(vars.diffusionDate) {
        var diffusionDate = vars.diffusionDate.substr(8,2) + '/' + vars.diffusionDate.substr(5,2);
        tpl = tpl.replace('${diffusionDate}', diffusionDate);
      }
      if(vars.minDiffusionDate) {
        var diffusionDate = vars.minDiffusionDate.substr(8,2) + '/' + vars.minDiffusionDate.substr(5,2);
        tpl = tpl.replace('${minDiffusionDate}', diffusionDate);
      }
      if(vars.maxDiffusionDate) {
        var diffusionDate = vars.maxDiffusionDate.substr(8,2) + '/' + vars.maxDiffusionDate.substr(5,2);
        tpl = tpl.replace('${maxDiffusionDate}', diffusionDate);
      }
      if(vars.channel && vars.channel.name) {
        tpl = tpl.replace('${channel.name}', vars.channel.name);
      }
      if(vars.numSeason ||
         vars.numSeason == 0)                     tpl = tpl.replace('${numSeason}', vars.numSeason);
      if(vars.numEpisode ||
         vars.numEpisode == 0)                    tpl = tpl.replace('${numEpisode}', vars.numEpisode);
      if(vars.tagsByType &&
         vars.tagsByType['6ème'] &&
         vars.tagsByType['6ème'][0].displayName)  tpl = tpl.replace('${tags.6ème}', vars.tagsByType['6ème'][0].displayName);
      if(vars.tagsByType &&
         vars.tagsByType['5ème'] &&
         vars.tagsByType['5ème'][0].displayName)  tpl = tpl.replace('${tags.5ème}', vars.tagsByType['5ème'][0].displayName);
      if(vars.tagsByType &&
         vars.tagsByType['4ème'] &&
         vars.tagsByType['4ème'][0].displayName)  tpl = tpl.replace('${tags.4ème}', vars.tagsByType['4ème'][0].displayName);
      if(vars.tagsByType &&
         vars.tagsByType['3ème'] &&
         vars.tagsByType['3ème'][0].displayName)  tpl = tpl.replace('${tags.3ème}', vars.tagsByType['3ème'][0].displayName);
      if(vars.tagsByType &&
         vars.tagsByType['2nde'] &&
         vars.tagsByType['2nde'][0].displayName)  tpl = tpl.replace('${tags.2nde}', vars.tagsByType['2nde'][0].displayName);
      if(vars.tagsByType &&
         vars.tagsByType['1ère'] &&
         vars.tagsByType['1ère'][0].displayName)  tpl = tpl.replace('${tags.1re}', vars.tagsByType['1ère'][0].displayName);
      if(vars.tagsByType &&
         vars.tagsByType['Terminale'] &&
         vars.tagsByType['Terminale'][0].displayName)  tpl = tpl.replace('${tags.Terminale}', vars.tagsByType['Terminale'][0].displayName);
      if(vars.tagsByType &&
         vars.tagsByType.genre &&
         vars.tagsByType.genre[0].displayName)    tpl = tpl.replace('${tags.genre}', vars.tagsByType.genre[0].displayName);
      if(vars.tagsByType &&
         vars.tagsByType.CAMPUS &&
         vars.tagsByType.CAMPUS[0].displayName)   tpl = tpl.replace('${tags.CAMPUS}', vars.tagsByType.CAMPUS[0].displayName);
      else                                        tpl = tpl.replace('${tags.genre}', '');
      if(vars.tagsByType &&
         vars.tagsByType.SOUS_GENRE_CANAL &&
         vars.tagsByType.SOUS_GENRE_CANAL[0].displayName)
                                                  tpl = tpl.replace('${tags.SOUS_GENRE_CANAL}', vars.tagsByType.SOUS_GENRE_CANAL[0].displayName);
      else                                        tpl = tpl.replace('${tags.SOUS_GENRE_CANAL}', '');
      if(vars.tagsByType &&
         vars.tagsByType.GENRE_CANAL &&
         vars.tagsByType.GENRE_CANAL[0].displayName)
                                                  tpl = tpl.replace('${tags.GENRE_CANAL}', vars.tagsByType.GENRE_CANAL[0].displayName);
      else                                        tpl = tpl.replace('${tags.GENRE_CANAL}', '');
      if(vars.accroche)                           tpl = tpl.replace('${accroche}', vars.accroche);
      else                                        tpl = tpl.replace('${accroche}', '');

      // ultimate clean :s
      tpl = tpl.replace(/\$\{([a-zA-Z._0-9]+)\}/g, '');

      var crochetFirst    = tpl.indexOf('[');
      var crochetLast     = tpl.indexOf(']');
      var crochetString   = tpl.substring(crochetFirst+1, crochetLast);
      var crochetMax      = limit - ( tpl.length - ( (crochetLast - crochetFirst) + 1) );

      if(crochetString.length > crochetMax)
        crochetString   = crochetString.substr(0, crochetMax-3) + '...';

      return tpl.substring(0,crochetFirst) + crochetString + tpl.substring(crochetLast+1);
    },

    formatPicture: function(tpl, variant, size, ext) {
      var serverIMG = (ext=='jpg') ? this.getUrlbyTarget('urlMedia') : this.urlChannel;
          serverIMG = (tpl.indexOf('assets') != -1) ? '' : serverIMG;

      switch(size){
        case 'half':
          var type = '640_283';
          //type = '501_220';
          break;
        case 'fourth':
          var type = '280_157';
          break;
        case 'fifth':
          var type = (ext=='jpg') ? '188_105' : '140_105';
          break;
        case 'banner':
          var type = '1024_210';
          break;
        default: // fifth
          var type = size;
          break;
      }

      // match
      tpl = tpl.replace('externalChannel', 'channel');
      tpl = tpl.replace('advanceChannel', 'channel');
      tpl = tpl.replace(/\{variant\}/g, variant);
      tpl = tpl.replace(/\{type\}/g, type);
      tpl = tpl.replace(/\{ext\}/g, ext);

      return serverIMG + tpl;
    },

    isTag: function(variable, key, value) {
      var tag = 0;
      if(variable && variable.tagsByType && variable.tagsByType[key]) {
        if(value) {
          var tagLength = variable.tagsByType[key].length;
          for (var i = 0; i < tagLength; i++) {
            if(variable.tagsByType[key][i].displayName == value) {
              tag = 1;
            }
          };
        } else {
          if(variable.tagsByType[key][0] && variable.tagsByType[key][0].displayName)
            tag = variable.tagsByType[key][0].displayName;
        }
      }
      return tag;
    }

  });
});

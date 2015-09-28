/*
 *
 *  APP COMMONS
 *
 *  - default vars
 *  - initialize():
 *  - grabkeys():
 *  - getUserInfos():
 *  - activeModule():
 *  - loading
 *  - prehome
 *  - log
 *  - helpers
 *
 */

CallChain = function () {
    var cs = [];
    this.add = function (call) {
        cs.push(call);
    };
    this.execute = function (endCall) {
        var wrap = function (call, callback) {
            return function () {
                call(callback);
            };
        };
        for (var i = cs.length-1; i > -1; i--) {
            cs[i] = wrap( cs[i], i < cs.length - 1 ? cs[i + 1] : endCall);
        }
        cs[0]();
    };
};

Application = function(){};

Application.prototype = {

 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                              *
 *  Application - Defaults Vars                                                                 *
 *                                                                                              *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  config  : {
    type              : 'portal', // (portal, zapping, campus, widget, etc)
    service           : 'cplay',  // (cplus, csat, cplay, d8, tnt, etc)
    source            : 'hubee',  // (play, pushvod, r7, hubee, etc)
    env               : 'prod',   // (dev, preprod, prod, r1, r2, etc)
    platform          : 'g6',     // (g5, g6, iptv)
    target            : 'tnt'     // (tnt, sat, fibre, miami, samsung, freebox)
  },
  context : {
    module            : 0, // current module
    subModule         : 0, // current submodule
    moduleTemp        : 0, // previous module
    subModuleTemp     : 0, // previous submodule
    isPrehome         : 0,
    isAdultOK         : 0,
    isAdultBan        : 0,
    isOmniture        : 0
  },
  user : {
    msd               : '', // msd
    abo               : {   // abo rights
      cplus           : 1,
      csat            : 1,
      cplay           : 1,
      m6              : 1
    },
    isBox             : (isBox) ? 1 : 0 // app launched in a box or directly in a browser ?
  },
  data              : {
    page            : {}, // screen templates
    contents        : {}  // contents
  },
  urls               : {
    g6: {
      tnt : {
        arpu : 'http://secure-stb.canal-plus.com/GNCPF/fpi/ARPU_G6T/vec/Conteneur/javascript_g5r7/top.html',
        espaceClient : 'http://secure-stb.canal-plus.com/GNCPF/fpi/EC_G6T/vec/Conteneur/javascript_g5r7/top.html'
      }
    },
    g5: {
      tnt : {
        arpu : 'http://secure-stb.canal-plus.com/GNCPF/fpi/ARPU/vec/Conteneur/javascript_g5r7/top.html',
        espaceClient : 'http://secure-stb.canal-plus.com/GNCPF/fpi/EC/vec/Conteneur/javascript_g5r7/top.html'
      },
      fibre : {
        arpu : 'http://secure-stb.canal-plus.com/GFCPF/fpi/ARPU/vec/Conteneur/javascript_g5r7/top.html',
        espaceClient : 'http://secure-stb.canal-plus.com/GFCPF/fpi/EC/vec/Conteneur/javascript_g5r7/top.html'
      },
      sat : {
        arpu : 'http://secure-stb.canal-plus.com/GSCPF/fpi/ARPU/vec/Conteneur/javascript_g5r7/top.html',
        espaceClient : 'http://secure-stb.canal-plus.com/GSCPF/fpi/EC/vec/Conteneur/javascript_g5r7/top.html'
      }
    },
    iptv: {
      miami : {
        arpu : 'http://secure-partdevice.canal-plus.com/BACPF/fpi/ARPU/vec/Conteneur/javascript_miami/top.html',
        espaceClient : 'http://secure-partdevice.canal-plus.com/BACPF/fpi/EC/vec/Conteneur/javascript_miami/top.html'
      },
      samsung : {
        arpu : 'http://secure-partdevice.canal-plus.com/SACPF/fpi/ARPU/vec/Conteneur/javascript_samsung/top.html',
        espaceClient : 'http://secure-partdevice.canal-plus.com/SACPF/fpi/EC/vec/Conteneur/javascript_samsung/top.html'
      },
      freebox : {
        arpu : 'http://172.18.2.100/FECPF/fpi/ARPU/vec/Conteneur/javascript_free/top.html',
        espaceClient : 'http://172.18.2.100/FECPF/fpi/EC/vec/Conteneur/javascript_free/top.html'
      }
    },

  },
  arpu : false,
  espaceClient : false,

 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                              *
 *  Application - Initialize                                                                    *
 *                                                                                              *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */



  initialize : function() {
    // get the hash for setting the app config
    var chains = new CallChain();
    hash    = window.location.hash;
    if(hash) {
      hash    = hash.substr(1);
      if(hash.indexOf('/') != -1)
        params  = hash.split('/');
      else
        params  = hash.split('_');
      if(params[0]) this.config.type      = params[0];
      if(params[1]) this.config.service   = params[1];
      if(params[2]) this.config.source    = params[2];
      if(params[3]) this.config.env       = params[3];
    };

    if (this.user.isBox && this.config.source === 'play') {
      this.redirectIfOffline();
    }

    document.getElementsByTagName('title')[0].innerHTML = this.config.type.toUpperCase() + ' ' + this.config.service.toUpperCase();

    chains.add(this.R7TargetInfos);
    chains.add(this.R7EspaceClient);
    chains.add(this.R7Arpu);
    chains.execute(function(){});

  },

  /**
   * Redirect to pushvod if not connected
   */
  redirectIfOffline: function() {
    R7('isConnected', function(__, isConnected) {
      R7('isPushVodActive', function(__, isPushVodActive) {
        if (!isConnected && isPushVodActive) {
          this.config.source = 'pushvod';
          this.config.type = 'portal';
        }
      }, this)
    }, this)
  },

 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                              *
 *  Application - Grab keys                                                                     *
 *                                                                                              *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  grabKeys : function(keys) {
    var self = this;
    // key events R7
    _.forEach(keys, function(speed, key){
      var touch      = {};
          touch[key] = speed;
      R7.grabKey(touch, function() {
        self[self.context.module]['onKey'+key]();
      });
    });

    // keyboard events for browser
    window.addEventListener("keydown", function(e) {
      if ( e.keyCode == 37 ) self[self.context.module].onKeyLeft();
      if ( e.keyCode == 38 ) self[self.context.module].onKeyUp();
      if ( e.keyCode == 39 ) self[self.context.module].onKeyRight();
      if ( e.keyCode == 40 ) self[self.context.module].onKeyDown();
      if ( e.keyCode == 13 ) self[self.context.module].onKeyEnter();
      if ( e.keyCode == 27 ) self[self.context.module].onKeyBack();
      if ( e.keyCode == 33 ) self[self.context.module].onKeyRewind();
      if ( e.keyCode == 34 ) self[self.context.module].onKeyForward();
      if ( e.keyCode == 77 ) self[self.context.module].onKeyMenu();
      if ( e.keyCode == 71 ) self[self.context.module].onKeyGuide();
    });
  },


 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                              *
 *  Application - Get user infos                                                                *
 *                                                                                              *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  getUserInfos: function(callback){
    if(!this.user.isBox) {
      this.user.msd              = (App.config.service == 'cplay') ? '02492575529313' : 'DEDR7 DEV';
      this.user.device           = 'g5';
      this.user.abo.cplus        = 1;
      this.user.abo.csat         = 1;
      this.user.abo.passSeries   = 1;
      this.user.abo.m6           = 1;
      this.user.abo.passpinkx    = 1;
      this.user.abo.passxxl      = 1;
      if(callback) callback();
    } else {
      var chains = new CallChain();
      chains.add(this.R7Cas);
      chains.add(this.R7Profile);
      chains.execute(callback);
    }
  },

  R7Cas: function(callback){
    R7('getCAS', function(err, cas) {
      if (!err) {
        this.user.msd = cas.casparams.msd.replace(/[ ,.]/g, ''); // format MSD for Pass
      }
      callback();
    }, App);
  },

  R7Profile: function(callback) {
    // R7('getProfile', function(err, profile) {
    //   if (!err && profile && profile.Data && profile.Data.AppMacro) {
    //     this.user.abo.cplus       = (profile.Data.AppMacro.indexOf("ALD_CP") !== -1) ? 1 : 0;
    //     this.user.abo.csat        = (profile.Data.AppMacro.indexOf("ALD_CS") !== -1) ? 1 : 0;
    //     this.user.abo.passSeries  = (profile.Data.AppRules.ALD_CS && (profile.Data.AppRules.ALD_CS.indexOf("RALD_PSERIE") !== -1 || profile.Data.AppRules.ALD_CS.indexOf("RALD_PSERIE_AX") !== -1)) ? 1 : 0;
    //     this.user.abo.m6          = (profile.Data.AppRules.ALD_TVGRAT && profile.Data.AppRules.ALD_TVGRAT.indexOf("RALD_M6") !== -1) ? 1 : 0;
    //     this.user.abo.passpinkx   = (profile.Data.AppRules.ALD_CS && profile.Data.AppRules.ALD_CS.indexOf("RALD_PPINKX") !== -1) ? 1 : 0;
    //     this.user.abo.passxxl     = (profile.Data.AppRules.ALD_CS && profile.Data.AppRules.ALD_CS.indexOf("RALD_PASS_DX") !== -1) ? 1 : 0;
    //   }
      if(callback) callback();
    // }, App);
  },

  R7Arpu: function(callback) {
    R7('getWebservice', 'arpu', function(err, arpu) {
      if(!err) {
        this.arpu = arpu;
      }
      callback();
    }, App);
  },

  R7EspaceClient: function(callback) {
    R7('getWebservice', 'espaceclient', function(err, espaceClient) {
      if(!err) {
        this.espaceClient = espaceClient;
      }
      callback();
    }, App);
  },

  R7TargetInfos: function(callback) {
    R7('getTargetInfos', function(err, infos) {
      if(!err) {
        console.log(infos.target);
        this.config.target = infos.target;
        this.config.platform = infos.platform;
      }
      callback();
    }, App);
  },

  getArpu : function(epgId) {
    var arpu = this.arpu ? this.arpu : this.urls[this.config.platform][this.config.target].arpu;
    if (typeof epgId !== undefined) {
      arpu += (arpu.indexOf('?') === -1 ? '?':'&') + 'IdEPG=' + epgId;
    }
    return arpu;
  },

  getEspaceClient : function() {
    return this.espaceClient ? this.espaceClient : this.urls[this.config.platform][this.config.target].espaceClient;
  },
 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                              *
 *  Application - Active Module                                                                 *
 *                                                                                              *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  activeModule : function(module, submodule, moduleTemp, submoduleTemp) {
    if(!submodule) submodule = module;
    if(module != this.context.module) {
      this.context.moduleTemp     = (moduleTemp) ? moduleTemp : this.context.module;
      this.context.module         = module;
      this.context.subModuleTemp  = (submoduleTemp) ? submoduleTemp : this.context.subModule;
    }
    this.context.subModule        = submodule;

    var classes =
      'app--'+ this.config.type +
      ' service--'+ this.config.service +
      ' module--'+this.context.module+
      ' moduleTemp--'+this.context.moduleTemp+
      ' submodule--'+this.context.subModule;
    if(App.data && App.data.page && App.data.page.type)
      classes   = classes + ' page--'+ App.data.page.type;
    document.body.className       = classes;
  },


 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                              *
 *  Application - Loading management                                                            *
 *                                                                                              *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  showLoading: function(type) {
    App.context.isLoading = 1;
    var classes = (typeof type != "undefined") ? 'app--isLoading app--'+type : 'app--isLoading';
    $('body').addClass(classes);
  },

  hideLoading: function() {
    App.context.isLoading = 0;
    $('body').removeClass('app--isLoading app--isPlaying app--isBacking app--isTeasing app--isDownloading');
  },


 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                              *
 *  Application - Prehome management                                                            *
 *                                                                                              *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  showPrehome: function(){
    var prehome = {
      portalcsat : {
        picture : 'http://10.0.1.210/media_cpa/img/prehome/prehome_csat_ontv_169.jpg',
        timeout : 10,
        miami: {
          picture : 'http://image.canal-plus.com/media_cpa/img/prehome/prehome_csat_ontv_169.jpg'
        },
        samsung: {
          picture : 'http://image.canal-plus.com/media_cpa/img/prehome/prehome_csat_ontv_169.jpg'
        }
      },
      portalcplus : {
        picture : 'http://10.0.1.210/media_cpa/img/prehome/prehome_cplus_ontv_169.jpg',
        timeout : 10,
        miami: {
          picture : 'http://image.canal-plus.com/media_cpa/img/prehome/prehome_cplus_ontv_169.jpg'
        },
        samsung: {
          picture : 'http://image.canal-plus.com/media_cpa/img/prehome/prehome_cplus_ontv_169.jpg'
        }
      },
      portalcplay : {
        picture : 'assets/images/portal/cplay/prehome.png',
        timeout : 0,
        miami: {
          picture : 'assets/images/portal/cplay/prehome.png'
        },
        samsung: {
          picture : 'assets/images/portal/cplay/prehome.png'
        }
      }
    };
    if(prehome[this.config.type + this.config.service]) {
      var thePrehome = (['samsung','miami'].indexOf(this.config.target) >= 0) ?
            prehome[this.config.type + this.config.service][this.config.target]:prehome[this.config.type + this.config.service];
      var prehome = document.getElementById('prehome');
      prehome.style.backgroundImage = 'url('+ thePrehome.picture +')';
      prehome.style.opacity = 1;
      if(thePrehome.timeout > 0) {
        setTimeout(function() {
            App.hidePrehome();
        }, thePrehome.timeout*1000);
      }
      this.context.isPrehome = 1;
    } else {
      this.hidePrehome();
    }
  },

  hidePrehome: function(){
    var prehome = document.getElementById('prehome');
    if(prehome) {
      prehome.style.opacity = 0;
      this.context.isPrehome = 0;
    }
  },


 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                              *
 *  Application - Log                                                                           *
 *                                                                                              *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  log: function(target, opts) {
    if(target == 'omniture') {
      this.logOmniture(opts);
    } else if (target == 'r7') {
      R7('collecte', opts);
    } else if(target == 'switchPlus') {
      this.logSwitchPlus(opts);
    }
  },

  logOmniture : function(opts) {
    var self        = this;

    s.channel   = 'R7';
    s.eVar11    = (opts.eVar11)   ? opts.eVar11   : '';
    s.eVar12    = (opts.eVar12)   ? opts.eVar12   : '';
    s.eVar13    = (opts.eVar13)   ? opts.eVar13   : '';
    s.eVar14    = (opts.eVar14)   ? opts.eVar14   : '';
    s.eVar16    = (opts.eVar16)   ? opts.eVar16   : '';
    s.eVar17    = (opts.eVar17)   ? opts.eVar17   : '';
    s.eVar19    = (opts.eVar19)   ? opts.eVar19   : ''; // error
    s.eVar45    = (opts.eVar45)   ? opts.eVar45   : '';
    s.pageName  = (opts.pageName) ? opts.pageName : '';
    s.prop4     = (opts.prop4)    ? opts.prop4    : '';
    s.prop5     = (opts.prop5)    ? opts.prop5    : '';
    s.prop6     = (opts.prop6)    ? opts.prop6    : '';
    s.prop7     = (opts.prop7)    ? opts.prop7    : '';

    if(!self.context.isOmniture) {
      var s_code = s.t();
      if(s_code)
        document.write(s_code);
      self.context.isOmniture = 1;
    } else {
      s.t();
    }
  },


 /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                              *
 *  Application - Helpers                                                                       *
 *                                                                                              *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  includeStyle : function(filename) {
    var ss      = document.createElement("link");
        ss.type = "text/css";
        ss.rel  = "stylesheet";
        ss.href = "assets/css/" + filename + ".css";
    document.getElementsByTagName("head")[0].appendChild(ss);
  },

  getParamsFromUrl : function(url, param) {
    if(typeof url == 'undefined') return 0;
    if(typeof url == 'number') url = url + '';
    var queryString = url.indexOf('?');
    var protocol    = url.indexOf('://');
    if(param) {
      switch(param) {
        case 'protocol':
          if(protocol != -1)
            return url.substring(0, protocol);
          else
            return 0;
          break;
        case 'url':
          if(queryString != -1)
            return url.substring(0, queryString);
          else
            return url;
          break;
        case 'filter':
          if(queryString != -1)
            return url.substring(queryString+1);
          else
            return 0;
          break;
      }
    } else {
      return {
        protocol  : (protocol != -1)    ? url.substring(0, protocol) : 0,
        url       : (queryString != -1) ? url.substring(0, queryString) : url,
        filter    : (queryString != -1) ? url.substring(queryString+1)  : 0
      };
    }
  },

  encodeBase64 : function(str) {
    if (!_.isString(str)) { return ''; }
    for (var h = [], i = 0; i < str.length; i += 2) {
      h.push(String.fromCharCode(parseInt(str.substr(i, 2), 16)));
    }
    return btoa(h.join(''));
  }

};

App = new Application();
App.initialize();

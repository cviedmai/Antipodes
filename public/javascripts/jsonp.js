/*  jsonp.js for Protototype
 *  
 *  Copyright (c) 2009 Tobie Langel (http://tobielangel.com)
 *
 *  jsonp.js is freely distributable under the terms of an MIT-style license.
 *--------------------------------------------------------------------------
 Requires: Prototype >= 1.6
 Usage:
  new Ajax.JSONRequest('http://api.flickr.com/services/feeds/photos_public.gne', {
    onComplete: function(json) {
      console.log(json)
    },
  
    callbackName: 'jsoncallback',
  
    parameters: {
      tags: 'cat',
      tagmode: 'any',
      format: 'json'
    }
  });
*/

Ajax.JSONRequest = Class.create(Ajax.Base, (function() {
  var id = 0, head = document.getElementsByTagName('head')[0];
  return {
    initialize: function($super, url, options) {
      $super(options);
      if (!this.options.callbackName) {
        this.options.callbackName = 'callback';
      }
      this.request(url);
    },
  
    request: function(url) {
      var callbackName = '_prototypeJSONPCallback_' + (id++),
          self         = this,
          script;

      this.options.parameters[this.options.callbackName] = callbackName;
      url += (url.include('?') ? '&' : '?') + Object.toQueryString(this.options.parameters);
      
      window[callbackName] = function(json) {
        script.remove();
        script = null;
        window[callbackName] = undefined;
        if (self.options.onComplete) {
          self.options.onComplete.call(self, json);
        }
      }
      script = new Element('script', {
        type: 'text/javascript',
        src: url
      });
      head.appendChild(script);
    }
  };
})());

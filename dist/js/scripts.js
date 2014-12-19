"use strict";angular.module("myApp",["ngRoute","myApp.HomePageController","myApp.AboutPageController","myApp.NavigationBarDirective","myApp.RouteController","myApp.StockService","myApp.StockListDirective","myApp.StockListController","myApp.StockListItemDirective","myApp.StockListItemController"]).config(["$routeProvider",function(e){e.when("/",{templateUrl:"views/home-page.html",controller:"HomePageController"}).when("/about",{templateUrl:"views/about-page.html",controller:"AboutPageController"}).otherwise({redirectTo:"/"})}]),angular.module("myApp.AboutPageController",[]).controller("AboutPageController",["$scope",function(e){e.controllerVersion="0.0.1"}]),angular.module("myApp.HomePageController",[]).controller("HomePageController",["$scope",function(e){e.controllerVersion="0.0.1"}]),angular.module("myApp.RouteController",[]).controller("RouteController",["$scope","$route","$location",function(e,t){e.$on("$routeChangeSuccess",function(){e.controller=t.current.controller})}]),angular.module("myApp.StockListController",[]).controller("StockListController",["$scope","stockService",function(e,t){var o=[{symbol:"T",exchange:"TSE",interval:900,period:"1d"},{symbol:"FTS",exchange:"TSE",interval:900,period:"1d"}];e.stockQuotes=o;var r="T",a="TSE",l=900,n="1d",i=function(){var o=t.getLiveData(r,a,l,n);o.then(function(t){e.liveQuotes=t})};i()}]),angular.module("myApp.StockListItemController",[]).controller("StockListItemController",["$scope","stockService",function(e,t){var o="T",r="TSE",a=900,l="1d",n=function(){var n=t.getLiveData(o,r,a,l);n.then(function(t){e.liveQuotes=t})};n()}]),angular.module("myApp.NavigationBarDirective",[]).directive("navigationBar",function(){return{restrict:"E",templateUrl:"views/navigationBar-partial.html",controller:"RouteController"}}),angular.module("myApp.StockListDirective",[]).directive("stockList",function(){return{restrict:"E",templateUrl:"views/stockList-partial.html",controller:"StockListController"}}),angular.module("myApp.StockListItemDirective",[]).directive("stockListItem",function(){return{restrict:"A",scope:{quote:"="},templateUrl:"views/stockListItem-partial.html",controller:"StockListItemController"}}),angular.module("myApp.StockService",[]).factory("stockService",["$q","$http",function(e,t){var o=function(o,r,a){var l=e.defer(),n="&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=JSON_CALLBACK",i='select * from yahoo.finance.historicaldata where symbol = "'+o+'" and startDate = "'+r+'" and endDate = "'+a+'"',s="http://query.yahooapis.com/v1/public/yql?q="+encodeURIComponent(i)+n;return t.jsonp(s).success(function(e){var t=[];e.query.count>0&&(t=e.query.results.quote),l.resolve(t)}),l.promise},r=function(o,r,a,l){var n=e.defer(),i=0,s="http://www.google.com/finance/getprices?q="+o+"&x="+r+"&i="+a+"&p="+l+"&f=d,c,v,k,o,h,l&df=cpct&auto=0&ei=Ef6XUYDfCqSTiAKEMg",c='SELECT * FROM csv WHERE url="'+s+'"',u="http://query.yahooapis.com/v1/public/yql?q="+encodeURIComponent(c)+"&format=json&callback=JSON_CALLBACK";return t.jsonp(u).success(function(e){var t=[],o=new Date;if(e.query&&e.query.count>0)for(var r=parseInt(e.query.results.row[6].col0.replace("TIMEZONE_OFFSET=",""),10),l=parseInt(e.query.results.row[7].col0.replace("a",""),10)+60*r,s=0,c=7;c<e.query.count;c++){"a"===e.query.results.row[c].col0[0]?(l=parseInt(e.query.results.row[c].col0.replace("a",""),10)+60*r,s=0):s=parseInt(e.query.results.row[c].col0,10);var u=new Date(1e3*(l+s*a+60*o.getTimezoneOffset()));if(u>i){var p=parseFloat(e.query.results.row[c].col1),d=[u,p];i=u,t.push(d)}}n.resolve(t)}),n.promise};return{getHistoricalData:o,getLiveData:r}}]),angular.module("myApp").run(["$templateCache",function(e){e.put("views/about-page.html","<h1>About</h1><div>About Page for <em>Angular StockWatcher</em> (Controller v.{{ controllerVersion }})</div>"),e.put("views/home-page.html","<h1>Home</h1><div>Home Page for <em>Angular StockWatcher</em> (Controller v.{{ controllerVersion }})</div><div><stock-list></stock-list></div>"),e.put("views/navigationBar-partial.html",'<nav class="navbar navbar-inverse navbar-fixed-top" role="navigation"><div class="container"><div class="navbar-header"><button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar"><span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span></button> <a class="navbar-brand" href="#">Angular StockWatcher</a></div><div id="navbar" class="navbar-collapse collapse"><ul class="nav navbar-nav"><li ng-class="{active: controller == \'HomePageController\'}"><a href="#/home">Home</a></li><li ng-class="{active: controller == \'AboutPageController\'}"><a href="#/about">About</a></li><li><a href="#contact">Contact</a></li><li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Dropdown <span class="caret"></span></a><ul class="dropdown-menu" role="menu"><li><a href="#">Action</a></li><li><a href="#">Another action</a></li><li><a href="#">Something else here</a></li><li class="divider"></li><li class="dropdown-header">Nav header</li><li><a href="#">Separated link</a></li><li><a href="#">One more separated link</a></li></ul></li></ul></div></div></nav>'),e.put("views/stockList-partial.html",'<div class="page-header"><h2>Stock List Partial</h2></div><div class="row"><table class="table table-striped"><thead><tr><th>Symbol</th><th>Exchange</th><th>Refresh Interval (sec.)</th><th>Period (days)</th></tr></thead><tbody><tr stock-list-item ng-repeat="quote in stockQuotes" quote="quote"></tr></tbody></table></div><div class="row"><table class="table table-striped"><thead><tr><th>Date</th><th>Value</th></tr></thead><tbody><tr ng-repeat="quote in liveQuotes"><td>{{ quote[0] | date:"MM/dd/yyyy @ hh:mma" }}</td><td>{{ quote[1] | currency }}</td></tr></tbody></table></div>'),e.put("views/stockListItem-partial.html","<td>{{ quote.symbol }}</td><td>{{ quote.exchange }}</td><td>{{ quote.interval }}</td><td>{{ quote.period }}</td>")}]);
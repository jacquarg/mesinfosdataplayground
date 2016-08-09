!function(){"use strict";var e="undefined"==typeof window?global:window;if("function"!=typeof e.require){var t={},i={},n={},s={}.hasOwnProperty,o=/^\.\.?(\/|$)/,r=function(e,t){for(var i,n=[],s=(o.test(t)?e+"/"+t:t).split("/"),r=0,a=s.length;r<a;r++)i=s[r],".."===i?n.pop():"."!==i&&""!==i&&n.push(i);return n.join("/")},a=function(e){return e.split("/").slice(0,-1).join("/")},u=function(t){return function(i){var n=r(a(t),i);return e.require(n,t)}},c=function(e,t){var n=null;n=v&&v.createHot(e);var s={id:e,exports:{},hot:n};return i[e]=s,t(s.exports,u(e),s),s.exports},d=function(e){return n[e]?d(n[e]):e},l=function(e,t){return d(r(a(e),t))},p=function(e,n){null==n&&(n="/");var o=d(e);if(s.call(i,o))return i[o].exports;if(s.call(t,o))return c(o,t[o]);throw new Error("Cannot find module '"+e+"' from '"+n+"'")};p.alias=function(e,t){n[t]=e};var f=/\.[^.\/]+$/,h=/\/index(\.[^\/]+)?$/,m=function(e){if(f.test(e)){var t=e.replace(f,"");s.call(n,t)&&n[t].replace(f,"")!==t+"/index"||(n[t]=e)}if(h.test(e)){var i=e.replace(h,"");s.call(n,i)||(n[i]=e)}};p.register=p.define=function(e,n){if("object"==typeof e)for(var o in e)s.call(e,o)&&p.register(o,e[o]);else t[e]=n,delete i[e],m(e)},p.list=function(){var e=[];for(var i in t)s.call(t,i)&&e.push(i);return e};var v=e._hmr&&new e._hmr(l,p,t,i);p._cache=i,p.hmr=v&&v.wrap,p.brunch=!0,e.require=p}}(),function(){window;require.register("application.js",function(e,t,i){var n=t("router"),s=t("views/app_layout"),o=t("collections/documents"),r=t("collections/subsets"),a=t("collections/dsviews"),u=t("models/properties");t("views/behaviors");var c=Mn.Application.extend({initialize:function(){this.properties=u},prepare:function(){return Promise.resolve($.getJSON("data/list_data.json")).then(this._parseMetadata.bind(this))},prepareInBackground:function(){return this.properties.fetch(),this._defineViews()},_parseMetadata:function(e){var t=e["export"];this.subsets=new r(t.filter(function(e){return"Subset"===e.Nature})),this.docTypes=new Backbone.Collection(t.filter(function(e){return"Doctype"===e.Nature})),this.fields=t.filter(function(e){return"Subset"!==e.Nature&&"Doctype"!==e.Nature})},_defineViews:function(){return this.subsets.reduce(function(e,t){return e.then(t.updateDSView())},Promise.resolve())},onBeforeStart:function(){this.layout=new s,this.router=new n,this.documents=new o,this.dsViews=new a,this.dsViews.fetch(),"function"==typeof Object.freeze&&Object.freeze(this)},onStart:function(){this.layout.render(),Backbone.history&&Backbone.history.start({pushState:!1})}}),d=new c;i.exports=d,document.addEventListener("DOMContentLoaded",function(){d.prepare().then(function(){d.prepareInBackground()}).then(d.start.bind(d))})}),require.register("collections/documents.js",function(e,t,i){var n=void 0;i.exports=Backbone.Collection.extend({initialize:function(){n=t("application"),this.listenTo(n,"documents:fetch",this.fetchDSView)},fetchDSView:function(e){this.setDSView(e),this.fetch({reset:!0})},setDSView:function(e){this.dsView=e},parse:function(e,t){return e.map(this._generateFields)},_generateFields:function(e){var t=e.doc,i=n.fields.filter(function(e){return e.DocType.toLowerCase()===t.docType.toLowerCase()}),s={},o=i.reduce(function(e,i){if(!t[i.Nom])return e;s[i.Nom]=!0;var n=$.extend({},i);return n.value=t[i.Nom],e.push(n),e},[]);for(var r in t)r in s||o.push({Nom:r,value:t[r]});return o.sort(function(e,t){return"Metadata"===e.Nature&&"Metadata"!==t.Nature?1:"Metadata"!==e.Nature&&"Metadata"===t.Nature?-1:e.Nom>t.Nom?1:-1}),t.fields=o,t},sync:function(e,t,i){return"read"!==e?(console.error("Only read is available on this collection."),void(i.error&&i.error("Only read is available on this collection."))):void cozysdk.run(this.dsView.getDocType(),this.dsView.getName(),{include_docs:!0,limit:10},function(e,t){return e?void(i.error&&i.error(e)):void i.success(t)})}})}),require.register("collections/dsviews.js",function(e,t,i){var n=t("models/dsview");i.exports=Backbone.Collection.extend({model:n,sync:function(e,t,i){if("read"!==e)return console.error("Only read is available on this collection."),void(i.error&&i.error("Only read is available on this collection."));var n=(new this.model).docType.toLowerCase();cozysdk.run(n,"all",{include_docs:!0},function(e,t){return e?i.error(e):i.success(t.map(function(e){return e.doc}))})}})}),require.register("collections/subsets.js",function(e,t,i){var n=null;i.exports=Backbone.Collection.extend({model:t("models/subset"),initialize:function(){n=t("application"),this.listenTo(n.properties,"change",this.updateSynthSetsStatus)},updateSynthSetsStatus:function(){synthSetProperty=n.properties.get("synthSets"),this.forEach(function(e){e.getSynthSetName()in synthSetProperty&&e.set("synthSetIds",synthSetProperty[e.getSynthSetName()])})}})}),require.register("lib/groupbyprojection.js",function(e,t,i){var n=BackboneProjections.Filtered,s=BackboneProjections.Sorted;i.exports=function(e,t){var i=e.groupBy(t.groupBy),o={};for(var r in i)o[r]=new n(e,{filter:function(e){return i[r].indexOf(e)!==-1}}),t.comparator&&(o[r]=new s(o[r],{comparator:t.comparator}));return o}}),require.register("lib/groupsview.js",function(e,t,i){var n=t("lib/groupbyprojection");i.exports=Mn.ItemView.extend({template:function(){return""},childView:void 0,childViewContainer:void 0,groupBy:void 0,comparator:void 0,initialize:function(){this.listenTo(this.collection,"sync remove add change",this.render)},onRender:function(){this.groups=n(this.collection,{groupBy:this.groupBy,comparator:this.comparator}),Object.keys(this.groups).forEach(this._appendGroup,this)},_appendGroup:function(e){var t=new this.childView({collection:this.groups[e],model:new Backbone.Model({groupTitle:e})});t.render();var i=this.childViewContainer?this.$el.find(this.childViewContainer):this.$el;i.append(t.$el)}})}),require.register("lib/utils.js",function(e,t,i){i.exports={slugify:function(e){return e.toLowerCase().replace(/[^\w-]+/g,"")},test2MapFunction:function(e){return"function(doc) {\n  "+e+"\n}"},appNameNVersion:function(){return"mesinfosdataplayground-0.0.1"}}}),require.register("models/dsview.js",function(e,t,i){var n=t("lib/utils").appNameNVersion;i.exports=Backbone.Model.extend({docType:"DSView",defaults:{docTypeVersion:n()},initialize:function(){},getDocType:function(){return this.get("docTypeOfView")},getName:function(){return this.get("name")},getMapFunction:function(){return this.get("mapFunction")},updateDSView:function(){var e=this;return cozysdk.defineView(this.getDocType(),this.getName(),this.getMapFunction()).then(function(t){cozysdk.run(e.getDocType(),e.getName(),{limit:1})})},parse:function(e){return e.id=e._id,e},sync:function(e,t,i){var n=function(e,t){return e?i.error(e):void i.success(t)};return"create"===e?cozysdk.create("DSView",t.attributes,n):"update"===e||"patch"===e?cozysdk.updateAttributes("DSView",t.attributes._id,t.attributes,n):"delete"===e?cozysdk.destroy("DSView",t.attributes._id,n):"read"===e?cozysdk.find("DSView",t.attributes._id,n):void 0}})}),require.register("models/properties.js",function(e,t,i){var n=t("lib/utils").appNameNVersion,s=Backbone.Model.extend({docType:"MesInfosDataPlaygroundProperties".toLowerCase(),defaults:{docTypeVersion:n(),synthSets:{}},parse:function(e){return e.id=e._id,e},sync:function(e,t,i){var n=function(e,t){return e?i.error(e):void i.success(t)};return"create"===e?cozysdk.create(this.docType,t.attributes,n):"update"===e||"patch"===e?cozysdk.updateAttributes(this.docType,t.attributes._id,t.attributes,n):"delete"===e?cozysdk.destroy(this.docType,t.attributes._id,n):"read"===e?t.isNew()?cozysdk.defineView(s.prototype.docType,"all","function(doc) { emit(doc._id);}").then(function(){return cozysdk.queryView(s.prototype.docType,"all",{limit:1,include_docs:!0})}).then(function(e){return e&&0!==e.length?e[0].doc:{}}).then(i.success,i.error):cozysdk.find(this.docType,t.attributes._id).then(i.success,i.error):void 0},_promiseSave:function(e){return new Promise(function(t,i){this.save(e,{success:t,error:i})}.bind(this))},addSynthSetIds:function(e,t){var i=this.get("synthSets")[e];i=i?i.concat(t):t;var n=this.get("synthSets");return n[e]=i,this._promiseSave({synthSets:n})},cleanSynthSetIds:function(e){var t=this.get("synthSets");return delete t[e],this._promiseSave({synthSets:t})}});i.exports=new s}),require.register("models/subset.js",function(e,t,i){var n=t("models/dsview"),s=t("lib/utils");i.exports=n.extend({getDocType:function(){return this.get("DocType")},getName:function(){return s.slugify(this.get("Nom"))},getMapFunction:function(){return s.test2MapFunction(this.get("Format"))},save:function(e){return e.success()},synthSetAvailable:function(){var e=this.getSynthSetName();return e&&""!==e},getSynthSetName:function(){return this.get("Exemple")},insertSynthSet:function(){var e=this;return this.synthSetAvailable()?Promise.resolve($.getJSON("data/"+e.getSynthSetName()+".json")).then(function(t){return Promise.all(t.map(e._insertOneSynthDoc,e))}).then(function(i){i=i.map(function(e){return e._id});var n=t("application");return n.properties.addSynthSetIds(e.getSynthSetName(),i)}):Promise.resolve(!1)},_insertOneSynthDoc:function(e){return delete e._id,delete e.id,cozysdk.create(this.getDocType(),e)},cleanSynthSet:function(){var e=this;return Promise.all(e.get("synthSetIds").map(function(t){return cozysdk.destroy(e.getDocType(),t)})).then(console.log)["catch"](console.log).then(function(i){var n=t("application");n.properties.cleanSynthSetIds(e.getSynthSetName())})},synthSetInDS:function(){return this.has("synthSetIds")}})}),require.register("router.js",function(e,t,i){var n=void 0;i.exports=Backbone.Router.extend({routes:{"":"index"},initialize:function(){n=t("application")}})}),require.register("views/app_layout.js",function(e,t,i){var n=t("views/message"),s=t("views/groupsdsviews"),o=t("views/formrequest"),r=t("views/documents"),a=t("views/typologies"),u=t("models/dsview"),c=void 0;i.exports=Mn.LayoutView.extend({template:t("views/templates/app_layout"),el:'[role="application"]',behaviors:{},regions:{dsViewsList:".dsviewshistory",typologies:"aside .typologies",documents:".documents",requestForm:".requestform",message:".message"},initialize:function(){c=t("application")},onRender:function(){this.message.show(new n),this.dsViewsList.show(new s({collection:c.dsViews})),this.typologies.show(new a({collection:c.subsets})),this.requestForm.show(new o({model:new u})),this.documents.show(new r({collection:c.documents}))}})}),require.register("views/behaviors/destroy.js",function(e,t,i){i.exports=Mn.Behavior.extend({events:{"click .delete":"destroyObject"},destroyObject:function(){this.options.onDestroy?this.view[this.options.onDestroy]():this.view.model.destroy()}})}),require.register("views/behaviors/index.js",function(e,t,i){Mn.Behaviors.behaviorsLookup=function(){return window.Behaviors},window.Behaviors={Toggle:t("views/behaviors/toggle"),Destroy:t("views/behaviors/destroy")}}),require.register("views/behaviors/toggle.js",function(e,t,i){i.exports=Mn.Behavior.extend({events:{"click .toggle":"toggleExpand"},toggleExpand:function(){this.$el.toggleClass("compact"),this.$el.toggleClass("expanded")},onRender:function(){this.$el.addClass("compact")}})}),require.register("views/documentfields.js",function(e,t,i){i.exports=Mn.CompositeView.extend({tagName:"li",className:"doctype",template:t("views/templates/document"),childView:t("views/field"),childViewContainer:".fields",initialize:function(){this.collection=new Backbone.Collection(this.model.get("fields"))}})}),require.register("views/documents.js",function(e,t,i){i.exports=Mn.CollectionView.extend({tagName:"ul",childView:t("views/documentfields")})}),require.register("views/dsview.js",function(e,t,i){i.exports=Mn.CompositeView.extend({tagName:"li",template:t("views/templates/dsview"),childView:t("views/dsviewhistoryitem"),childViewContainer:"ul.history",ui:{name:"h4",toHide:"ul.history"},events:{"click @ui.name":"setDSView"},behaviors:{Toggle:{},Destroy:{onDestroy:"onDestroyAll"}},setDSView:function(){t("application").trigger("requestform:setView",this.collection.first())},serializeModel:function(){return Mn.CompositeView.prototype.serializeModel(this.collection.first())},onDestroyAll:function(){this.collection.toArray().forEach(function(e){e.destroy()})}})}),require.register("views/dsviewhistoryitem.js",function(e,t,i){i.exports=Mn.ItemView.extend({tagName:"li",template:t("views/templates/dsviewhistoryitem"),events:{"click *":"setDSView"},behaviors:{Destroy:{}},setDSView:function(){t("application").trigger("requestform:setView",this.model)}})}),require.register("views/field.js",function(e,t,i){i.exports=Mn.ItemView.extend({tagName:"div",className:function(){return"field compact "+this.model.get("Nature")},template:t("views/templates/field"),behaviors:{Toggle:{}}})}),require.register("views/formrequest.js",function(e,t,i){var n=void 0,s=t("models/dsview");i.exports=Mn.ItemView.extend({tagName:"div",template:t("views/templates/formrequest"),ui:{name:"#inputname",mapFunction:"#inputmap",docType:"#inputdoctype"},events:{"change @ui.name":"setParams","change @ui.mapFunction":"setParams","change @ui.docType":"setParams","click #inputsend":"send"},initialize:function(){n=t("application"),this.listenTo(n,"requestform:setView",this.setDSView)},setDSView:function(e){this.model=e,this.ui.name.val(this.model.getName()),this.ui.docType.val(this.model.getDocType()),this.ui.mapFunction.val(this.model.getMapFunction())},setParams:function(){this.model=new s({name:this.ui.name.val(),mapFunction:this.ui.mapFunction.val(),docTypeOfView:this.ui.docType.val(),createdAt:(new Date).toISOString()}),this.model.updateDSView()},send:function(){var e=this.model;new Promise(function(i,s){return e instanceof t("models/subset")||!e.isNew()?i():void n.dsViews.create(e,{success:i,error:s})}).then(function(){n.trigger("message:display","Creation de la vue "+e.getName())}).then(e.updateDSView.bind(e)).then(function(){n.trigger("message:hide"),n.trigger("documents:fetch",e)})}})}),require.register("views/groupsdsviews.js",function(e,t,i){var n=t("lib/groupsview");i.exports=n.extend({template:t("views/templates/groupsdsviews"),childViewContainer:".dsviewslist>ul",groupBy:"name",comparator:function(e,t){return e.get("createdAt")<t.get("createdAt")?1:-1},childView:t("views/dsview")})}),require.register("views/message.js",function(e,t,i){var n=null;i.exports=Mn.ItemView.extend({tagName:"div",template:t("views/templates/message"),ui:{message:".display"},events:{},initialize:function(){n=t("application"),this.listenTo(n,"message:display",this.onDisplay),this.listenTo(n,"message:hide",this.onHide)},onDisplay:function(e){console.log("display"),console.log(arguments),this.ui.message.text(e)},onHide:function(){console.log("hide"),this.ui.message.empty()}})}),require.register("views/subsetitem.js",function(e,t,i){i.exports=Mn.ItemView.extend({tagName:"li",template:t("views/templates/subsetitem"),events:{"click h4":"setDSView","click .insert":"insertSynthSet"},behaviors:{Destroy:{onDestroy:"destroySynthSet"}},serializeModel:function(e){var t=$.extend({},e.attributes);return t.synthSetInsertable=e.synthSetAvailable(),t.synthSetInDS=e.synthSetInDS(),t},setDSView:function(){console.log("here!"),t("application").trigger("requestform:setView",this.model)},insertSynthSet:function(){this.model.insertSynthSet()},destroySynthSet:function(){this.model.cleanSynthSet()}})}),require.register("views/templates/app_layout.jade",function(e,t,i){var n=function(e){var t=[];return t.push('<div class="header"><div class="requestform"></div></div><div class="dsviewshistory"></div><div class="message"></div><div class="documents"></div><aside class="typologies"><h2>Les données du pilote MesInfos<div class="subTitle">Jeux de synthèse</div></h2><div class="typologies"></div></aside>'),t.join("")};"function"==typeof define&&define.amd?define([],function(){return n}):"object"==typeof i&&i&&i.exports&&(i.exports=n)}),require.register("views/templates/document.jade",function(e,t,i){var n=function(e){var t=[];return t.push('<span class="openBrace">{</span><div class="fields"></div><span class="closeBrace">},</span>'),t.join("")};"function"==typeof define&&define.amd?define([],function(){return n}):"object"==typeof i&&i&&i.exports&&(i.exports=n)}),require.register("views/templates/dsview.jade",function(e,t,i){var n=function(e){var t,i=[],n=e||{};return function(e){i.push("<h4>"+jade.escape(null==(t=e)?"":t)+'<span class="toggle">&nbsp;</span></h4><div class="delete">Supprimer cet historique &nbsp;<span title="Supprimer du Cozy" class="iconicstroke-trash-stroke"></span></div><ul class="history"></ul>')}.call(this,"name"in n?n.name:"undefined"!=typeof name?name:void 0),i.join("")};"function"==typeof define&&define.amd?define([],function(){return n}):"object"==typeof i&&i&&i.exports&&(i.exports=n)}),require.register("views/templates/dsviewhistoryitem.jade",function(e,t,i){var n=function(e){var t,i=[],n=e||{};return function(e){i.push("<span"+jade.attr("title",e,!0,!1)+">"+jade.escape(null==(t=moment(e).fromNow())?"":t)+'</span><span title="Supprimer du Cozy" class="iconicstroke-trash-stroke delete"></span>')}.call(this,"createdAt"in n?n.createdAt:"undefined"!=typeof createdAt?createdAt:void 0),i.join("")};"function"==typeof define&&define.amd?define([],function(){return n}):"object"==typeof i&&i&&i.exports&&(i.exports=n)}),require.register("views/templates/field.jade",function(e,t,i){var n=function(e){var t,i=[],n=e||{};return function(e,n,s,o,r,a){i.push('<span class="name">'+jade.escape(null==(t=r)?"":t)+"</span>:&nbsp;<span"+jade.cls(["value",typeof a],[null,!0])+">"+jade.escape(null==(t=o.stringify(a))?"":t)+'</span><span class="toggle">,</span>'),e&&i.push('<span class="caution">//&nbsp;\n= Attention</span>'),i.push('<ul class="details"><li><b>Description :&nbsp;</b>'+jade.escape(null==(t=n)?"":t)+"</li><li><b>Format :&nbsp;</b>"+jade.escape(null==(t=s)?"":t)+"</li></ul>")}.call(this,"Attention"in n?n.Attention:"undefined"!=typeof Attention?Attention:void 0,"Description"in n?n.Description:"undefined"!=typeof Description?Description:void 0,"Format"in n?n.Format:"undefined"!=typeof Format?Format:void 0,"JSON"in n?n.JSON:"undefined"!=typeof JSON?JSON:void 0,"Nom"in n?n.Nom:"undefined"!=typeof Nom?Nom:void 0,"value"in n?n.value:"undefined"!=typeof value?value:void 0),i.join("")};"function"==typeof define&&define.amd?define([],function(){return n}):"object"==typeof i&&i&&i.exports&&(i.exports=n)}),require.register("views/templates/formrequest.jade",function(e,t,i){var n=function(e){var t=[];return t.push('<h2>Requêtes au datasystem</h2><div class="defineview"><div class="method">cozysdk.<b>defineView</b>(</div><ul><li><input id="inputdoctype" type="text" placeholder="DocType" name="doctype" value="Event" class="param"/><span>,</span></li><li><input id="inputname" type="text" placeholder="Name" name="name" value="MyRequest" class="param"/><span>,</span></li><li><textarea id="inputmap" placeholder="" row="5">function(doc) {\n  emit(doc._id);\n}</textarea><span>");</span></li></ul></div><div class="queryview"></div><button id="inputsend">Envoyer</button>'),t.join("")};"function"==typeof define&&define.amd?define([],function(){return n}):"object"==typeof i&&i&&i.exports&&(i.exports=n)}),require.register("views/templates/groupsdsviews.jade",function(e,t,i){var n=function(e){var t=[];return t.push('<h3>Historique</h3><div class="dsviewslist"><ul></ul></div>'),t.join("")};"function"==typeof define&&define.amd?define([],function(){return n}):"object"==typeof i&&i&&i.exports&&(i.exports=n)}),require.register("views/templates/message.jade",function(e,t,i){var n=function(e){var t=[];return t.push('<span class="display"></span>'),t.join("")};"function"==typeof define&&define.amd?define([],function(){return n}):"object"==typeof i&&i&&i.exports&&(i.exports=n)}),require.register("views/templates/subsetitem.jade",function(e,t,i){var n=function(e){var t,i=[],n=e||{};return function(e,n,s,o){i.push('<h4 class="subset"><span class="name">'+jade.escape(null==(t=n)?"":t)+"</span><img"+jade.attr("src","img/holders/logo_"+e.toLowerCase()+".png",!0,!1)+jade.attr("title",e,!0,!1)+"/>"),o&&i.push('<span title="Insérer dans le Cozy" class="iconicstroke-cloud-upload insert"></span>'),s&&i.push('<span title="Supprimer du Cozy" class="iconicstroke-trash-stroke delete"></span>'),i.push("</h4>")}.call(this,"Détenteur"in n?n.Détenteur:"undefined"!=typeof Détenteur?Détenteur:void 0,"Nom"in n?n.Nom:"undefined"!=typeof Nom?Nom:void 0,"synthSetInDS"in n?n.synthSetInDS:"undefined"!=typeof synthSetInDS?synthSetInDS:void 0,"synthSetInsertable"in n?n.synthSetInsertable:"undefined"!=typeof synthSetInsertable?synthSetInsertable:void 0),i.join("")};"function"==typeof define&&define.amd?define([],function(){return n}):"object"==typeof i&&i&&i.exports&&(i.exports=n)}),require.register("views/templates/typology.jade",function(e,t,i){var n=function(e){var t,i=[],n=e||{};return function(e){i.push("<h3>"+jade.escape(null==(t=e)?"":t)+"</h3><ul></ul>")}.call(this,"groupTitle"in n?n.groupTitle:"undefined"!=typeof groupTitle?groupTitle:void 0),i.join("")};"function"==typeof define&&define.amd?define([],function(){return n}):"object"==typeof i&&i&&i.exports&&(i.exports=n)}),require.register("views/typologies.js",function(e,t,i){var n=t("lib/groupsview");i.exports=n.extend({tagName:"ul",groupBy:"Typologie",comparator:"Nom",childView:Mn.CompositeView.extend({tagName:"li",template:t("views/templates/typology"),childViewContainer:"ul",childView:t("views/subsetitem")})})}),require.register("___globals___",function(e,t,i){})}(),require("___globals___");
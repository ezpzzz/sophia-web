(function(t,e){"object"===typeof exports&&"object"===typeof module?module.exports=e():"function"===typeof define&&define.amd?define([],e):"object"===typeof exports?exports["SophosicChat"]=e():t["SophosicChat"]=e()})(self,(()=>(()=>{var t={6647:(t,e,o)=>{var r=o(7724)["default"],i=o(7362)["default"],n=o(1109)["default"],a=o(772)["default"],c=o(2220)["default"];o(3792),o(3362),o(9085),o(9391),o(6918),o(3288),o(6099),o(8781),o(375),o(6031);var s=function(t){"use strict";function e(){var t;if(r(this,e),t=n(this,e),!t.shadowRoot){t.attachShadow({mode:"open"});var o=document.createElement("div");o.id="sophosic-chat-container-"+Math.random().toString(36).substr(2,9),t.containerId=o.id,t.shadowRoot.appendChild(o)}return t}return a(e,t),i(e,[{key:"connectedCallback",value:function(){window.CHAT_CONFIG={apiUrl:this.getAttribute("api-url")||"https://n8n.sophosic.ai/webhook/e60704a9-52c1-47eb-9037-2344d6b56c21/chat",theme:{primary:this.getAttribute("primary-color")||"#5423E7",secondary:this.getAttribute("secondary-color")||"#1E1B3C"}},this.initializeChat()}},{key:"initializeChat",value:function(){var t=this;window.SophosicChat&&this.containerId?window.SophosicChat.mount("#"+this.containerId):setTimeout((function(){return t.initializeChat()}),100)}}],[{key:"observedAttributes",get:function(){return["api-url","primary-color","secondary-color"]}}])}(c(HTMLElement));(function(){var t="sophosic-chat-widget";customElements.get(t)||customElements.define(t,s)})()}},e={};function o(r){var i=e[r];if(void 0!==i)return i.exports;var n=e[r]={exports:{}};return t[r].call(n.exports,n,n.exports,o),n.exports}o.m=t,(()=>{var t=[];o.O=(e,r,i,n)=>{if(!r){var a=1/0;for(h=0;h<t.length;h++){for(var[r,i,n]=t[h],c=!0,s=0;s<r.length;s++)(!1&n||a>=n)&&Object.keys(o.O).every((t=>o.O[t](r[s])))?r.splice(s--,1):(c=!1,n<a&&(a=n));if(c){t.splice(h--,1);var u=i();void 0!==u&&(e=u)}}return e}n=n||0;for(var h=t.length;h>0&&t[h-1][2]>n;h--)t[h]=t[h-1];t[h]=[r,i,n]}})(),(()=>{o.n=t=>{var e=t&&t.__esModule?()=>t["default"]:()=>t;return o.d(e,{a:e}),e}})(),(()=>{o.d=(t,e)=>{for(var r in e)o.o(e,r)&&!o.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})}})(),(()=>{o.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"===typeof window)return window}}()})(),(()=>{o.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e)})(),(()=>{o.j=851})(),(()=>{var t={851:0};o.O.j=e=>0===t[e];var e=(e,r)=>{var i,n,[a,c,s]=r,u=0;if(a.some((e=>0!==t[e]))){for(i in c)o.o(c,i)&&(o.m[i]=c[i]);if(s)var h=s(o)}for(e&&e(r);u<a.length;u++)n=a[u],o.o(t,n)&&t[n]&&t[n][0](),t[n]=0;return o.O(h)},r=self["webpackChunkSophosicChat"]=self["webpackChunkSophosicChat"]||[];r.forEach(e.bind(null,0)),r.push=e.bind(null,r.push.bind(r))})();var r=o.O(void 0,[504],(()=>o(6647)));return r=o.O(r),r=r["default"],r})()));
//# sourceMappingURL=wix-loader.js.map
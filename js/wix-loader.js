(function(e,t){"object"===typeof exports&&"object"===typeof module?module.exports=t():"function"===typeof define&&define.amd?define([],t):"object"===typeof exports?exports["SophosicChat"]=t():e["SophosicChat"]=t()})("undefined"!==typeof self?self:this,(()=>(()=>{var e={6647:(e,t,o)=>{var r=o(2118)["default"],n=o(1998)["default"],i=o(7724)["default"],a=o(7362)["default"],c=o(1109)["default"],s=o(772)["default"],u=o(2220)["default"];o(3792),o(3362),o(9085),o(9391),o(6918),o(3288),o(6099),o(8781),o(375),o(6031);var d=function(e){"use strict";function t(){var e;return i(this,t),e=c(this,t),e.attachShadow({mode:"open"}),e}return s(t,e),a(t,[{key:"connectedCallback",value:function(){var e=n(r().mark((function e(){var t,o;return r().wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t=document.createElement("div"),t.id="sophosic-chat-container-"+Math.random().toString(36).substr(2,9),this.shadowRoot.appendChild(t),o={apiUrl:this.getAttribute("api-url")||"https://n8n.sophosic.ai/webhook/e60704a9-52c1-47eb-9037-2344d6b56c21/chat",theme:{primary:this.getAttribute("primary-color")||"#5423E7",secondary:this.getAttribute("secondary-color")||"#1E1B3C"}},e.prev=4,e.next=7,this.loadScript("/sophia-web/js/app.js");case 7:setTimeout((function(){var e=window.SophosicChat;null!==e&&void 0!==e&&e.mountWidget?e.mountWidget("#"+t.id,o):console.error("SophosicChat mountWidget function not found",e)}),100),e.next=13;break;case 10:e.prev=10,e.t0=e["catch"](4),console.error("Failed to load chat widget:",e.t0);case 13:case"end":return e.stop()}}),e,this,[[4,10]])})));function t(){return e.apply(this,arguments)}return t}()},{key:"loadScript",value:function(e){return new Promise((function(t,o){if(document.querySelector('script[src="'.concat(e,'"]')))t();else{var r=document.createElement("script");r.src=e,r.onload=t,r.onerror=o,document.head.appendChild(r)}}))}}])}(u(HTMLElement));customElements.get("sophosic-chat-widget")||customElements.define("sophosic-chat-widget",d)}},t={};function o(r){var n=t[r];if(void 0!==n)return n.exports;var i=t[r]={exports:{}};return e[r].call(i.exports,i,i.exports,o),i.exports}o.m=e,(()=>{var e=[];o.O=(t,r,n,i)=>{if(!r){var a=1/0;for(d=0;d<e.length;d++){for(var[r,n,i]=e[d],c=!0,s=0;s<r.length;s++)(!1&i||a>=i)&&Object.keys(o.O).every((e=>o.O[e](r[s])))?r.splice(s--,1):(c=!1,i<a&&(a=i));if(c){e.splice(d--,1);var u=n();void 0!==u&&(t=u)}}return t}i=i||0;for(var d=e.length;d>0&&e[d-1][2]>i;d--)e[d]=e[d-1];e[d]=[r,n,i]}})(),(()=>{o.n=e=>{var t=e&&e.__esModule?()=>e["default"]:()=>e;return o.d(t,{a:t}),t}})(),(()=>{o.d=(e,t)=>{for(var r in t)o.o(t,r)&&!o.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}})(),(()=>{o.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()})(),(()=>{o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t)})(),(()=>{o.j=851})(),(()=>{var e={851:0};o.O.j=t=>0===e[t];var t=(t,r)=>{var n,i,[a,c,s]=r,u=0;if(a.some((t=>0!==e[t]))){for(n in c)o.o(c,n)&&(o.m[n]=c[n]);if(s)var d=s(o)}for(t&&t(r);u<a.length;u++)i=a[u],o.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return o.O(d)},r=Object("undefined"!==typeof self?self:this)["webpackChunkSophosicChat"]=Object("undefined"!==typeof self?self:this)["webpackChunkSophosicChat"]||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})();var r=o.O(void 0,[504],(()=>o(6647)));return r=o.O(r),r})()));
//# sourceMappingURL=wix-loader.js.map
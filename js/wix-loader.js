(function(e,t){"object"===typeof exports&&"object"===typeof module?module.exports=t():"function"===typeof define&&define.amd?define([],t):"object"===typeof exports?exports["SophosicChat"]=t():e["SophosicChat"]=t()})(self,(()=>(()=>{var e={6647:(e,t,o)=>{var r=o(7724)["default"],n=o(7362)["default"],a=o(1109)["default"],i=o(772)["default"],c=o(2220)["default"];o(3792),o(3362),o(9085),o(9391);var s=function(e){"use strict";function t(){var e;return r(this,t),e=a(this,t),e.attachShadow({mode:"open"}),e}return i(t,e),n(t,[{key:"connectedCallback",value:function(){var e=document.createElement("div");e.id="chat-container",this.shadowRoot.appendChild(e),window.CHAT_CONFIG={apiUrl:this.getAttribute("api-url")||"https://n8n.sophosic.ai/webhook/e60704a9-52c1-47eb-9037-2344d6b56c21/chat",theme:{primary:this.getAttribute("primary-color")||"#5423E7",secondary:this.getAttribute("secondary-color")||"#1E1B3C"}},window.SophosicChat&&window.SophosicChat.mount("#chat-container")}}])}(c(HTMLElement));customElements.get("sophosic-chat")||customElements.define("sophosic-chat",s)}},t={};function o(r){var n=t[r];if(void 0!==n)return n.exports;var a=t[r]={exports:{}};return e[r].call(a.exports,a,a.exports,o),a.exports}o.m=e,(()=>{var e=[];o.O=(t,r,n,a)=>{if(!r){var i=1/0;for(u=0;u<e.length;u++){for(var[r,n,a]=e[u],c=!0,s=0;s<r.length;s++)(!1&a||i>=a)&&Object.keys(o.O).every((e=>o.O[e](r[s])))?r.splice(s--,1):(c=!1,a<i&&(i=a));if(c){e.splice(u--,1);var h=n();void 0!==h&&(t=h)}}return t}a=a||0;for(var u=e.length;u>0&&e[u-1][2]>a;u--)e[u]=e[u-1];e[u]=[r,n,a]}})(),(()=>{o.n=e=>{var t=e&&e.__esModule?()=>e["default"]:()=>e;return o.d(t,{a:t}),t}})(),(()=>{o.d=(e,t)=>{for(var r in t)o.o(t,r)&&!o.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}})(),(()=>{o.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()})(),(()=>{o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t)})(),(()=>{o.j=851})(),(()=>{var e={851:0};o.O.j=t=>0===e[t];var t=(t,r)=>{var n,a,[i,c,s]=r,h=0;if(i.some((t=>0!==e[t]))){for(n in c)o.o(c,n)&&(o.m[n]=c[n]);if(s)var u=s(o)}for(t&&t(r);h<i.length;h++)a=i[h],o.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return o.O(u)},r=self["webpackChunkSophosicChat"]=self["webpackChunkSophosicChat"]||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})();var r=o.O(void 0,[504],(()=>o(6647)));return r=o.O(r),r=r["default"],r})()));
//# sourceMappingURL=wix-loader.js.map
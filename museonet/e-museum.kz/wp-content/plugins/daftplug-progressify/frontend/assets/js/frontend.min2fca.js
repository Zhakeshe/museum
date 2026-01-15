(()=>{var __defProp=Object.defineProperty,__getOwnPropNames=Object.getOwnPropertyNames,__esm=(fn,res)=>function(){return fn&&(res=(0,fn[__getOwnPropNames(fn)[0]])(fn=0)),res},__export=(target,all)=>{for(var name in all)__defProp(target,name,{get:all[name],enumerable:!0})},isPwa,getContrastTextColor,isReturningVisitor,urlBase64ToUint8Array,hasUrlParam,addParamToUrl,removeParamFromUrl,setCookie,getCookie,init_utils=__esm({"frontend/assets/js/dev/components/utils.js"(){isPwa=()=>{const isPwaDisplayMode=window.matchMedia("(display-mode: standalone)").matches||window.matchMedia("(display-mode: fullscreen)").matches||window.matchMedia("(display-mode: minimal-ui)").matches||window.navigator.standalone,isTwa=document.referrer.startsWith("android-app://"),isPwaParam=hasUrlParam("isPwa","true"),pwaSession=sessionStorage.getItem("isPwa");return isPwaDisplayMode||isTwa||isPwaParam||pwaSession},getContrastTextColor=backgroundColor=>{const temp=document.createElement("div");temp.style.backgroundColor=backgroundColor,temp.style.display="none",document.body.appendChild(temp);const computedColor=window.getComputedStyle(temp).backgroundColor;document.body.removeChild(temp);const[r,g,b]=computedColor.match(/\d+/g).map(Number);return(.299*r+.587*g+.114*b)/255>.5?"#000000":"#ffffff"},isReturningVisitor=()=>localStorage.getItem("pwa_has_visited")?!sessionStorage.getItem("pwa_first_session"):(localStorage.setItem("pwa_has_visited","true"),sessionStorage.setItem("pwa_first_session","true"),!1),urlBase64ToUint8Array=base64String=>{const padding="=".repeat((4-base64String.length%4)%4),base64=(base64String+padding).replace(/\-/g,"+").replace(/_/g,"/"),rawData=window.atob(base64),outputArray=new Uint8Array(rawData.length);for(let i=0;i<rawData.length;++i)outputArray[i]=rawData.charCodeAt(i);return outputArray},hasUrlParam=(paramName,paramValue="",url=window.location.href)=>{const urlObject=new URL(url);return paramValue?urlObject.searchParams.get(paramName)===paramValue:urlObject.searchParams.has(paramName)},addParamToUrl=(paramName,paramValue="",url=window.location.href)=>{const urlObject=new URL(url);return paramValue===""?(urlObject.searchParams.append(paramName,""),urlObject.href.replace(`${paramName}=`,paramName)):(urlObject.searchParams.set(paramName,paramValue),urlObject.href)},removeParamFromUrl=(paramName,url=window.location.href)=>{const urlObject=new URL(url);return urlObject.searchParams.delete(paramName),urlObject.href},setCookie=(name,value,days)=>{var expires="";if(days){var date=new Date;date.setTime(date.getTime()+days*24*60*60*1e3),expires="; expires="+date.toUTCString()}document.cookie=name+"="+(value||"")+expires+"; path=/"},getCookie=name=>{for(var nameEQ=name+"=",ca=document.cookie.split(";"),i=0;i<ca.length;i++){for(var c=ca[i];c.charAt(0)==" ";)c=c.substring(1,c.length);if(c.indexOf(nameEQ)==0)return c.substring(nameEQ.length,c.length)}return null}}}),PushNotificationsSubscriptionManager,pushNotificationsSubscription,pushNotificationsSubscription_default,init_pushNotificationsSubscription=__esm({"frontend/assets/js/dev/components/pushNotificationsSubscription.js"(){init_frontend(),init_utils(),PushNotificationsSubscriptionManager=class{constructor(){this.subscribers=new Set,this.currentState=this.determineInitialState(),this.initialize()}determineInitialState(){return!("serviceWorker"in navigator)||!("PushManager"in window)?"blocked":"unsubscribed"}async initialize(){try{if(Notification.permission==="denied"){this.updateState("blocked");return}const state=await this.getSubscriptionState();this.updateState(state)}catch(error){console.error("Error initializing push notifications:",error),this.updateState("blocked")}}subscribe(callback){return this.subscribers.add(callback),callback(this.currentState),()=>this.subscribers.delete(callback)}updateState(newState){if(!["loading","subscribed","unsubscribed","blocked"].includes(newState)){console.error("Invalid state:",newState);return}this.currentState!==newState&&(this.currentState=newState,this.notifySubscribers())}notifySubscribers(){this.subscribers.forEach(callback=>callback(this.currentState))}async getSubscriptionState(){if(Notification.permission==="denied")return"blocked";try{return await(await navigator.serviceWorker.ready).pushManager.getSubscription()?"subscribed":"unsubscribed"}catch(error){return console.error("Error getting subscription state:",error),"blocked"}}async addSubscription(){if(this.currentState!=="loading"){this.updateState("loading");try{if(Notification.permission==="default"){const permission=await Notification.requestPermission();if(permission==="denied"){this.updateState("blocked");return}if(permission!=="granted"){this.updateState("unsubscribed");return}}const subscription=await(await navigator.serviceWorker.ready).pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:urlBase64ToUint8Array(config.jsVars.vapidPublicKey)}),response=await fetch(`${config.jsVars.restUrl}${config.jsVars.slug}/addSubscription`,{method:"POST",credentials:"include",headers:{"X-WP-Nonce":config.jsVars.restNonce,"Content-Type":"application/json"},body:JSON.stringify({endpoint:subscription.endpoint,authKey:subscription.getKey("auth")?btoa(String.fromCharCode.apply(null,new Uint8Array(subscription.getKey("auth")))):null,p256dhKey:subscription.getKey("p256dh")?btoa(String.fromCharCode.apply(null,new Uint8Array(subscription.getKey("p256dh")))):null,contentEncoding:(PushManager.supportedContentEncodings||["aesgcm"])[0]})});if(!response.ok)throw new Error(await response.text()||"Subscription failed");return this.updateState("subscribed"),subscription}catch(error){throw console.error("Subscription error:",error),this.updateState(Notification.permission==="denied"?"blocked":"unsubscribed"),error}}}async removeSubscription(){if(this.currentState!=="loading"){this.updateState("loading");try{const subscription=await(await navigator.serviceWorker.ready).pushManager.getSubscription();if(!subscription){this.updateState("unsubscribed");return}const response=await fetch(`${config.jsVars.restUrl}${config.jsVars.slug}/removeSubscription`,{method:"DELETE",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({endpoint:subscription.endpoint})}),responseData=await response.json();if(!response.ok||responseData.status!=="success")throw new Error(responseData.message||"Failed to remove subscription");await subscription.unsubscribe(),this.updateState("unsubscribed")}catch(error){throw console.error("Unsubscribe error:",error),this.updateState("subscribed"),error}}}},pushNotificationsSubscription=new PushNotificationsSubscriptionManager,pushNotificationsSubscription_default=pushNotificationsSubscription}});async function gatherClientData(){const parts=[];return parts.push(navigator.userAgent||""),parts.push(navigator.language||""),parts.push(navigator.languages?navigator.languages.join(","):""),parts.push(screen.width||""),parts.push(screen.height||""),parts.push(screen.colorDepth||""),parts.push(new Date().getTimezoneOffset()),parts.push(navigator.hardwareConcurrency||""),parts.push(navigator.maxTouchPoints||""),parts.push(navigator.platform||""),parts.push(navigator.doNotTrack||""),parts.push(navigator.deviceMemory||""),parts.push(getWebGLInfo()),parts.push(getCanvasFingerprint()),parts.join("###")}function stringToUint8Array(str){return new TextEncoder().encode(str)}async function computeHash(data){if(window.crypto&&window.crypto.subtle)try{const encoded=stringToUint8Array(data),hashBuffer=await window.crypto.subtle.digest("SHA-256",encoded);return Array.from(new Uint8Array(hashBuffer)).map(b=>b.toString(16).padStart(2,"0")).join("")}catch{return fallbackHash(data)}else return fallbackHash(data)}function fallbackHash(str){let hash=0;for(let i=0;i<str.length;i++)hash=Math.imul(31,hash)+str.charCodeAt(i)|0;return"fallback_"+Math.abs(hash)}function getWebGLInfo(){try{const canvas=document.createElement("canvas"),gl=canvas.getContext("webgl")||canvas.getContext("experimental-webgl");if(!gl)return"";const debugInfo=gl.getExtension("WEBGL_debug_renderer_info");if(debugInfo){const vendor=gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),renderer=gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);return`${vendor}###${renderer}`}}catch{}return""}function getCanvasFingerprint(){try{const canvas=document.createElement("canvas"),ctx=canvas.getContext("2d");return ctx.textBaseline="top",ctx.font="14px 'Arial'",ctx.fillStyle="#f60",ctx.fillRect(100,1,80,20),ctx.fillStyle="#069",ctx.fillText("Hello!",2,15),canvas.toDataURL()}catch{return""}}async function getOrCreatePwaUserId(){const STORAGE_KEY="pwaUserId";let existing=localStorage.getItem(STORAGE_KEY);if(existing)return existing;const data=await gatherClientData(),hash=await computeHash(data);return localStorage.setItem(STORAGE_KEY,hash),hash}var init_pwaUserId=__esm({"frontend/assets/js/dev/components/pwaUserId.js"(){}}),pwaTracker_exports={};__export(pwaTracker_exports,{initPwaTracker:()=>initPwaTracker});function setPwaSession(){sessionStorage.setItem("isPwa","true"),document.body.classList.add("isPwa")}async function sendPwaUsageEventToServer(retries=3){for(let i=0;i<retries;i++)try{const pwaUserId=await getOrCreatePwaUserId(),response=await fetch(`${config.jsVars.restUrl}${config.jsVars.slug}/upsertPwaUser`,{method:"PUT",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({pwaUserId})});if(!response.ok)throw new Error(`HTTP error! status: ${response.status}`);return await response.json()}catch(error){if(i===retries-1)throw console.error("Failed to send tracking data after retries:",error),error;await new Promise(resolve=>setTimeout(resolve,1e3*(i+1)))}}async function initPwaTracker(){try{setPwaSession(),await sendPwaUsageEventToServer()}catch(error){console.error("Failed to track PWA session:",error)}}var init_pwaTracker=__esm({"frontend/assets/js/dev/modules/pwaTracker.js"(){init_frontend(),init_pwaUserId()}}),pwaCustomCssAndJs_exports={};__export(pwaCustomCssAndJs_exports,{initPwaCustomCssAndJs:()=>initPwaCustomCssAndJs});async function initPwaCustomCssAndJs(){const style=document.createElement("style"),script=document.createElement("script");style.textContent=config.jsVars.settings.uiComponents.pwaCustomCssAndJs.css||"",script.textContent=config.jsVars.settings.uiComponents.pwaCustomCssAndJs.js||"",document.head.appendChild(style),document.body.appendChild(script)}var init_pwaCustomCssAndJs=__esm({"frontend/assets/js/dev/modules/pwaCustomCssAndJs.js"(){init_frontend()}});function performInstallation(){const existingPrompt=document.querySelector("pwa-install-prompt");existingPrompt&&existingPrompt.remove(),customElements.get("pwa-install-prompt")||customElements.define("pwa-install-prompt",PwaInstallPrompt),PwaInstallPrompt.show()}var deferredInstallPrompt,svg,PwaInstallPrompt,init_installPrompt=__esm({"frontend/assets/js/dev/components/installPrompt.js"(){init_frontend(),init_utils(),deferredInstallPrompt=null,window.addEventListener("beforeinstallprompt",e=>{e.preventDefault(),deferredInstallPrompt=e}),window.addEventListener("appinstalled",()=>{deferredInstallPrompt=null}),svg={vertThreeDots:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/></svg>',horizThreeDots:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"/></svg>',iosShare:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M240-40q-33 0-56.5-23.5T160-120v-440q0-33 23.5-56.5T240-640h80q17 0 28.5 11.5T360-600q0 17-11.5 28.5T320-560h-80v440h480v-440h-80q-17 0-28.5-11.5T600-600q0-17 11.5-28.5T640-640h80q33 0 56.5 23.5T800-560v440q0 33-23.5 56.5T720-40H240Zm200-727-36 36q-12 12-28 11.5T348-732q-11-12-11.5-28t11.5-28l104-104q12-12 28-12t28 12l104 104q11 11 11 27.5T612-732q-12 12-28.5 12T555-732l-35-35v407q0 17-11.5 28.5T480-320q-17 0-28.5-11.5T440-360v-407Z"/></svg>',plusInBox:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M440-440v120q0 17 11.5 28.5T480-280q17 0 28.5-11.5T520-320v-120h120q17 0 28.5-11.5T680-480q0-17-11.5-28.5T640-520H520v-120q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640v120H320q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440h120ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>',tapFinger:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M419-80q-28 0-52.5-12T325-126L124-381q-8-9-7-21.5t9-20.5q20-21 48-25t52 11l74 45v-328q0-17 11.5-28.5T340-760q17 0 29 11.5t12 28.5v400q0 23-20.5 34.5T320-286l-36-22 104 133q6 7 14 11t17 4h221q33 0 56.5-23.5T720-240v-160q0-17-11.5-28.5T680-440H501q-17 0-28.5-11.5T461-480q0-17 11.5-28.5T501-520h179q50 0 85 35t35 85v160q0 66-47 113T640-80H419Zm83-260Zm-23-260q-17 0-28.5-11.5T439-640q0-2 5-20 8-14 12-28.5t4-31.5q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 17 4 31.5t12 28.5q3 5 4 10t1 10q0 17-11 28.5T202-600q-11 0-20.5-6T167-621q-13-22-20-47t-7-52q0-83 58.5-141.5T340-920q83 0 141.5 58.5T540-720q0 27-7 52t-20 47q-5 9-14 15t-20 6Z"/></svg>',hamburgerMenu:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M160-240q-17 0-28.5-11.5T120-280q0-17 11.5-28.5T160-320h640q17 0 28.5 11.5T840-280q0 17-11.5 28.5T800-240H160Zm0-200q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520h640q17 0 28.5 11.5T840-480q0 17-11.5 28.5T800-440H160Zm0-200q-17 0-28.5-11.5T120-680q0-17 11.5-28.5T160-720h640q17 0 28.5 11.5T840-680q0 17-11.5 28.5T800-640H160Z"/></svg>',upload:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M240-160q-33 0-56.5-23.5T160-240v-80q0-17 11.5-28.5T200-360q17 0 28.5 11.5T240-320v80h480v-80q0-17 11.5-28.5T760-360q17 0 28.5 11.5T800-320v80q0 33-23.5 56.5T720-160H240Zm200-486-75 75q-12 12-28.5 11.5T308-572q-11-12-11.5-28t11.5-28l144-144q6-6 13-8.5t15-2.5q8 0 15 2.5t13 8.5l144 144q12 12 11.5 28T652-572q-12 12-28.5 12.5T595-571l-75-75v286q0 17-11.5 28.5T480-320q-17 0-28.5-11.5T440-360v-286Z"/></svg>',safari:'<svg style="width:1.5rem;height:1.5rem;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5120 5120"><linearGradient x2="0" y2="100%" id="a"><stop offset="0" stop-color="#19d7ff"/><stop offset="1" stop-color="#1e64f0"/></linearGradient><circle cx="2560" cy="2560" r="2240" fill="url(#a)"/><path fill="red" d="M4090 1020 2370 2370l4e2 4e2z"/><path fill="#fff" d="M1020 4090l1350-1720 4e2 4e2z"/><path stroke="#fff" stroke-width="30" d="M2560 540v330m0 3370v330m350-4e3-57 325m-586 3318-57 327M3250 662l-113 310M1984 4138l-113 310m339-3878 57 325m586 3318 57 327M1870 662l113 310m1152 3166 113 310M1552 810l166 286m1685 2918 165 286M1265 1010l212 253m2166 2582 212 253M1015 1258l253 212m2582 2168 253 212M813 1548l286 165m2920 1685 286 165M665 1866l310 113m3166 1150 310 113M574 2202l326 58m3320 588 325 57M545 2555h330m3370 0h330M575 2905l325-57m3320-586 325-57M668 3245l310-113m3165-1152 310-113M815 3563l286-165m2920-1685 286-165M1016 3850l253-212m2580-2166 253-212M1262 41e2l212-253m2166-2582 212-253M1552 43e2l166-286m1685-2918 165-286M2384 548l16 180m320 3656 16 180M2038 610l47 174m950 3544 47 174M1708 730l76 163m1550 3326 77 163M1404 904l103 148m2106 3006 103 148M1135 1130l127 127m2596 2596 127 127M910 14e2l148 103m3006 2107 146 1e2M734 1703l163 76m3326 1550 163 77M614 2033l174 47m3544 950 174 47M553 2380l180 16m3656 320 180 16m-4014 0 180-16m3656-320 180-16M614 3077l174-47m3544-950 174-47M734 3407l163-76m3326-1550 163-76M910 3710l148-103m3006-2107 146-1e2M1404 4206l103-148m2105-3006 104-148M1708 4380l77-163M3335 890l77-163M2038 45e2l47-174m950-3544 47-174m-698 3952 16-180m320-3656 16-180"/></svg>',googleChrome:'<svg style="width:1.5rem;height:1.5rem;" xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 276 276"><linearGradient id="a" x1="145" x2="34" y1="253" y2="61" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1e8e3e"/><stop offset="1" stop-color="#34a853"/></linearGradient><linearGradient id="b" x1="111" x2="222" y1="254" y2="62" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fcc934"/><stop offset="1" stop-color="#fbbc04"/></linearGradient><linearGradient id="c" x1="17" x2="239" y1="80" y2="80" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#d93025"/><stop offset="1" stop-color="#ea4335"/></linearGradient><circle cx="128" cy="128" r="64" fill="#fff"/><path fill="url(#a)" d="M96 183.4A63.7 63.7 0 0 1 72.6 160L17.2 64A128 128 0 0 0 128 256l55.4-96A64 64 0 0 1 96 183.4Z"/><path fill="url(#b)" d="M192 128a63.7 63.7 0 0 1-8.6 32L128 256A128 128 0 0 0 238.9 64h-111a64 64 0 0 1 64 64Z"/><circle cx="128" cy="128" r="52" fill="#1a73e8"/><path fill="url(#c)" d="M96 72.6a63.7 63.7 0 0 1 32-8.6h110.8a128 128 0 0 0-221.7 0l55.5 96A64 64 0 0 1 96 72.6Z"/></svg>',copy:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-520q0-17 11.5-28.5T160-720q17 0 28.5 11.5T200-680v520h400q17 0 28.5 11.5T640-120q0 17-11.5 28.5T600-80H200Zm160-240v-480 480Z"/></svg>',pasteGo:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M727-240H520q-17 0-28.5-11.5T480-280q0-17 11.5-28.5T520-320h207l-36-36q-11-11-11-27.5t12-28.5q11-11 28-11t28 11l104 104q12 12 12 28t-12 28L748-148q-12 12-28 11.5T692-149q-11-12-11.5-28t11.5-28l35-35ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h167q11-35 43-57.5t70-22.5q40 0 71.5 22.5T594-840h166q33 0 56.5 23.5T840-760v200q0 17-11.5 28.5T800-520q-17 0-28.5-11.5T760-560v-200h-80v80q0 17-11.5 28.5T640-640H320q-17 0-28.5-11.5T280-680v-80h-80v560h160q17 0 28.5 11.5T400-160q0 17-11.5 28.5T360-120H200Zm280-640q17 0 28.5-11.5T520-800q0-17-11.5-28.5T480-840q-17 0-28.5 11.5T440-800q0 17 11.5 28.5T480-760Z"/></svg>',installDesktop:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M320-160v-40H160q-33 0-56.5-23.5T80-280v-480q0-33 23.5-56.5T160-840h280q17 0 28.5 11.5T480-800q0 17-11.5 28.5T440-760H160v480h640v-80q0-17 11.5-28.5T840-400q17 0 28.5 11.5T880-360v80q0 33-23.5 56.5T800-200H640v40q0 17-11.5 28.5T600-120H360q-17 0-28.5-11.5T320-160Zm320-393v-247q0-17 11.5-28.5T680-840q17 0 28.5 11.5T720-800v247l76-75q11-11 27.5-11.5T852-628q11 11 11 28t-11 28L708-428q-12 12-28 12t-28-12L508-572q-11-11-11.5-27.5T508-628q11-11 28-11t28 11l76 75Z"/></svg>',installMobile:'<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M280-40q-33 0-56.5-23.5T200-120v-720q0-33 23.5-56.5T280-920h240q17 0 28.5 11.5T560-880q0 17-11.5 28.5T520-840H280v40h240q17 0 28.5 11.5T560-760q0 17-11.5 28.5T520-720H280v480h400v-40q0-17 11.5-28.5T720-320q17 0 28.5 11.5T760-280v160q0 33-23.5 56.5T680-40H280Zm0-120v40h400v-40H280Zm400-392v-248q0-17 11.5-28.5T720-840q17 0 28.5 11.5T760-800v248l76-76q11-11 28-11t28 11q11 11 11 28t-11 28L748-428q-12 12-28 12t-28-12L548-572q-11-11-11-28t11-28q11-11 28-11t28 11l76 76ZM280-800v-40 40Zm0 640v40-40Z"/></svg>',fileSave:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="m680-272-36-36q-11-11-28-11t-28 11q-11 11-11 28t11 28l104 104q12 12 28 12t28-12l104-104q11-11 11-28t-11-28q-11-11-28-11t-28 11l-36 36v-127q0-17-11.5-28.5T720-439q-17 0-28.5 11.5T680-399v127ZM600-80h240q17 0 28.5 11.5T880-40q0 17-11.5 28.5T840 0H600q-17 0-28.5-11.5T560-40q0-17 11.5-28.5T600-80Zm-360-80q-33 0-56.5-23.5T160-240v-560q0-33 23.5-56.5T240-880h247q16 0 30.5 6t25.5 17l194 194q11 11 17 25.5t6 30.5v48q0 17-11.5 28.5T720-519q-17 0-28.5-11.5T680-559v-41H540q-25 0-42.5-17.5T480-660v-140H240v560h200q17 0 28.5 11.5T480-200q0 17-11.5 28.5T440-160H240Zm0-80v-560 560Z"/></svg>',mouseClick:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M120-560h40q17 0 28.5 11.5T200-520q0 17-11.5 28.5T160-480h-40q-17 0-28.5-11.5T80-520q0-17 11.5-28.5T120-560Zm68 216 28-28q12-12 28-11.5t28 11.5q12 12 12.5 28.5T273-315l-28 28q-12 12-28.5 11.5T188-288q-11-12-11.5-28t11.5-28Zm28-324-28-28q-12-12-11.5-28t11.5-28q12-12 28.5-12.5T245-753l28 28q12 12 11.5 28.5T272-668q-12 11-28 11.5T216-668Zm476 480L530-350l-30 90q-2 7-7.5 10.5T481-246q-6 0-11.5-4t-7.5-11l-86-286q-2-8 .5-16t7.5-13q5-5 13-7.5t16-.5l288 86q7 2 10.5 7.5T715-479q0 6-3 11.5t-10 7.5l-90 32 160 160q12 12 12 28t-12 28l-24 24q-12 12-28 12t-28-12ZM400-760v-40q0-17 11.5-28.5T440-840q17 0 28.5 11.5T480-800v40q0 17-11.5 28.5T440-720q-17 0-28.5-11.5T400-760Zm207 35 29-29q11-11 27.5-11.5T692-754q11 11 11.5 27.5T693-698l-29 30q-11 12-27.5 11.5T608-668q-12-12-12.5-28.5T607-725Z"/></svg>',appsGrid:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M638-468 468-638q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l170-170q6-6 13-8.5t15-2.5q8 0 15 2.5t13 8.5l170 170q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L694-468q-6 6-13 8.5t-15 2.5q-8 0-15-2.5t-13-8.5Zm-518-92v-240q0-17 11.5-28.5T160-840h240q17 0 28.5 11.5T440-800v240q0 17-11.5 28.5T400-520H160q-17 0-28.5-11.5T120-560Zm400 400v-240q0-17 11.5-28.5T560-440h240q17 0 28.5 11.5T840-400v240q0 17-11.5 28.5T800-120H560q-17 0-28.5-11.5T520-160Zm-400 0v-240q0-17 11.5-28.5T160-440h240q17 0 28.5 11.5T440-400v240q0 17-11.5 28.5T400-120H160q-17 0-28.5-11.5T120-160Zm80-440h160v-160H200v160Zm467 48 113-113-113-113-113 113 113 113Zm-67 352h160v-160H600v160Zm-400 0h160v-160H200v160Zm160-400Zm194-65ZM360-360Zm240 0Z"/></svg>',directionDown:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M200-120q-17 0-28.5-11.5T160-160q0-17 11.5-28.5T200-200h560q17 0 28.5 11.5T800-160q0 17-11.5 28.5T760-120H200Zm280-177q-8 0-15-2.5t-13-8.5L308-452q-11-11-11-28t11-28q11-11 28-11t28 11l76 76v-368q0-17 11.5-28.5T480-840q17 0 28.5 11.5T520-800v368l76-76q11-11 28-11t28 11q11 11 11 28t-11 28L508-308q-6 6-13 8.5t-15 2.5Z"/></svg>',addToHomeScreen:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M320-40q-33 0-56.5-23.5T240-120v-120q0-17 11.5-28.5T280-280q17 0 28.5 11.5T320-240h400v-480H320q0 17-11.5 28.5T280-680q-17 0-28.5-11.5T240-720v-120q0-33 23.5-56.5T320-920h400q33 0 56.5 23.5T800-840v720q0 33-23.5 56.5T720-40H320Zm0-120v40h400v-40H320Zm80-344L204-308q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196H240q-17 0-28.5-11.5T200-600q0-17 11.5-28.5T240-640h200q17 0 28.5 11.5T480-600v200q0 17-11.5 28.5T440-360q-17 0-28.5-11.5T400-400v-104Zm-80-296h400v-40H320v40Zm0 0v-40 40Zm0 640v40-40Z"/></svg>',noInstallSupport:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor"><path d="M792-56 56-792q-11-11-11-28t11-28q11-11 28-11t28 11l736 736q11 11 11 28t-11 28q-11 11-28 11t-28-11ZM200-703l80 80v383h384l96 96v24q0 33-23.5 56.5T680-40H280q-33 0-56.5-23.5T200-120v-583Zm80 543v40h400v-40H280Zm0 0v40-40Zm79-560q-17 0-28-11.5T320-760q0-17 11.5-28.5T360-800h320v-40H260q-17 0-28.5-11.5T220-880q0-17 11.5-28.5T260-920h420q33 0 56.5 23.5T760-840v480q0 17-11.5 28.5T720-320q-17 0-28.5-11.5T680-360v-360H359Zm98-80Z"/></svg>'},PwaInstallPrompt=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.styles=new Set}async connectedCallback(){this.render(),this.handleRemove(),this.handleClipboard(),this.handleNativeInstall(),this.hasAttribute("loaded")||(await this.handleCheckInstallCapabilities(),this.setAttribute("loaded",""),this.handleUpdateContent())}static show(){let prompt=document.querySelector("pwa-install-prompt");return prompt||(prompt=document.createElement("pwa-install-prompt"),document.body.appendChild(prompt),requestAnimationFrame(()=>{const installPrompt=prompt.shadowRoot.querySelector(".install-prompt");document.documentElement.style.paddingRight=`${window.innerWidth-document.documentElement.offsetWidth}px`,document.documentElement.style.overflow="hidden",installPrompt.classList.add("visible")})),prompt}injectStyles(css){this.styles.add(css)}handleRemove(){const closeIcon=this.shadowRoot.querySelector(".install-prompt-close"),closeButton=this.shadowRoot.querySelector(".install-prompt-footer_close"),backdrop=this.shadowRoot.querySelector(".install-prompt"),handleClose=()=>{backdrop.classList.remove("visible"),backdrop.addEventListener("transitionend",()=>{document.documentElement.style.removeProperty("overflow"),document.documentElement.style.paddingRight="",this.remove()},{once:!0})};closeIcon.addEventListener("click",handleClose),closeButton.addEventListener("click",handleClose),backdrop.addEventListener("click",e=>{e.target===backdrop&&handleClose()})}handleClipboard(){this.shadowRoot.querySelectorAll("[data-clipboard-content]").forEach(button=>{button.addEventListener("click",async()=>{const content=button.getAttribute("data-clipboard-content"),defaultIcon=button.querySelector(".clipboard-default"),successIcon=button.querySelector(".clipboard-success"),tooltip=button.querySelector(".tooltip");try{await navigator.clipboard.writeText(content),defaultIcon.style.display="none",successIcon.style.display="block",tooltip.classList.add("visible"),button.disabled=!0,setTimeout(()=>{defaultIcon.style.display="block",successIcon.style.display="none",tooltip.classList.remove("visible"),button.disabled=!1},2e3)}catch(err){console.error("Failed to copy:",err)}})})}async handleCheckInstallCapabilities(){return new Promise(resolve=>{if(deferredInstallPrompt){resolve(!0);return}const timeout=setTimeout(()=>resolve(!1),1700);window.addEventListener("beforeinstallprompt",e=>{e.preventDefault(),clearTimeout(timeout),deferredInstallPrompt=e,resolve(!0)},{once:!0})})}handleUpdateContent(){const contentContainer=this.shadowRoot.querySelector(".install-prompt-body");if(contentContainer){contentContainer.innerHTML=this.renderContent();const styleTag=this.shadowRoot.querySelector("style");styleTag.textContent=Array.from(this.styles).join(`
`),this.handleClipboard(),this.handleNativeInstall()}}handleNativeInstall(){const nativeButton=this.shadowRoot.querySelector("#native-install-btn");nativeButton&&deferredInstallPrompt&&nativeButton.addEventListener("click",async()=>{try{await deferredInstallPrompt.prompt();const result=await deferredInstallPrompt.userChoice;deferredInstallPrompt=null,result.outcome==="accepted"&&this.remove()}catch(error){console.error("Native installation failed:",error),this.handleUpdateContent()}})}renderAppIcon(){if(!config.jsVars.iconUrl)return"";this.injectStyles(`
      .install-prompt-body-appinfo_icon {
        border-radius: 9999px;
        border: 1px solid #e5e7eb;
        -ms-flex-negative: 0;
            flex-shrink: 0;
        height: 55px;
        width: 55px;
        display: inline-block;
      }
    `);const appName=config.jsVars.settings.webAppManifest.appIdentity.appName;return`
      <img 
        class="install-prompt-body-appinfo_icon" 
        src="${config.jsVars.iconUrl}" 
        alt="${appName}"
        onerror="this.style.display='none'"
      >
    `}renderAppName(){this.injectStyles(`
      .install-prompt-body-appinfo_appname {
        font-size: 1rem;
        line-height: 1.5rem;
        font-weight: 500;
        color: #1f2937;
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
    `);const appName=config.jsVars.settings.webAppManifest.appIdentity.appName;return appName?`
      <div class="install-prompt-body-appinfo_appname">${appName}</div>
    `:""}renderAppDescription(){this.injectStyles(`
      .install-prompt-body-appinfo_description {
        font-size: 0.75rem;
        line-height: 1rem;
        font-weight: 400;
        color: #6b7280;
        margin-top: 0.12rem;
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
    `);const description=config.jsVars.settings.webAppManifest.appIdentity.description;return description?`
      <div class="install-prompt-body-appinfo_description">${description}</div>
    `:""}renderAppInfo(){return this.injectStyles(`
      .install-prompt-body-appinfo {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        background: #f3f4f6;
        padding: 0.5rem;
        border-radius: 0.5rem;
        border: 1px solid #e5e7eb;
      }

      .install-prompt-body-appinfo_texts {
        padding-left: 0.5rem;
      }
    `),`
      <div class="install-prompt-body-appinfo">
        ${this.renderAppIcon()}
        <div class="install-prompt-body-appinfo_texts">
          ${this.renderAppName()}
          ${this.renderAppDescription()}
        </div>
      </div>
    `}renderCopyInstallUrlButton(){var _a;this.injectStyles(`
      .install-prompt-body-instructions_step_copy {
        position: relative;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        -webkit-column-gap: 0.5rem;
           -moz-column-gap: 0.5rem;
                column-gap: 0.5rem;
        font-size: 0.875rem;
        line-height: 0.875rem;
        padding: 10px 13px;
        border-radius: 0.5rem;
        border: 1px solid #e5e7eb;
        background-color: #ffffff;
        color: #1f2937;
        -webkit-box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
                box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        outline: none;
        -webkit-transition: all .1s ease;
        -o-transition: all .1s ease;
        transition: all .1s ease;
        cursor: pointer;
        margin-top: 0.5rem;
      }

      .install-prompt-body-instructions_step_copy:hover,
      .install-prompt-body-instructions_step_copy:focus {
        background-color: #f9fafb;
      }

      .install-prompt-body-instructions_step_copy_url {
        -o-text-overflow: ellipsis;
           text-overflow: ellipsis;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        max-width: 15rem;
      }

      .install-prompt-body-instructions_step_copy_icons {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        border-left: 1px solid #e5e7eb;
        -webkit-padding-start: 0.75rem;
                padding-inline-start: 0.75rem;
      }

      .install-prompt-body-instructions_step_copy_svg {
        width: 1rem;
        height: 1rem;
      }

      .install-prompt-body-instructions_step_copy_svg.clipboard-success {
        display: none;
        width: 1rem;
        height: 1rem;
        color: #2563eb;
      }

      .install-prompt-body-instructions_step_copy_tooltip {
        display: none;
        opacity: 0;
        visibility: hidden;
        position: absolute;
        top: -2rem;
        -webkit-transition: all 0.1s ease;
        -o-transition: all 0.1s ease;
        transition: all 0.1s ease;
        z-index: 10;
        padding: 0.25rem 0.5rem;
        background-color: #111827;
        font-size: 0.75rem;
        line-height: 1rem;
        font-weight: 500;
        color: #ffffff;
        border-radius: 0.5rem;
        -webkit-box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
                box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        cursor: default;
      }

      .install-prompt-body-instructions_step_copy_tooltip.visible {
        visibility: visible;
        opacity: 1;
      }
    `);const startPagePath=(_a=config.jsVars.settings.webAppManifest.displaySettings)==null?void 0:_a.startPagePath;return startPagePath?`
      <button type="button" class="install-prompt-body-instructions_step_copy" data-clipboard-content="${addParamToUrl("performInstallation","true",config.jsVars.homeUrl+startPagePath)}">
        <span class="install-prompt-body-instructions_step_copy_url">
          ${config.jsVars.homeUrl+startPagePath}
        </span>
        <span class="install-prompt-body-instructions_step_copy_icons">
          <svg class="install-prompt-body-instructions_step_copy_svg clipboard-default" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          </svg>
          <svg class="install-prompt-body-instructions_step_copy_svg clipboard-success" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
        <span class="install-prompt-body-instructions_step_copy_tooltip" role="tooltip">
          ${wp.i18n.__("Copied",config.jsVars.slug)}
        </span>
      </button>
    `:""}renderLoadingInstallCheck(){return this.injectStyles(`
      .install-prompt-loading {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
            -ms-flex-direction: column;
                flex-direction: column;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
      }

      .install-prompt-loading-spinner {
        width: 2rem;
        height: 2rem;
        border: 3px solid #f3f4f6;
        border-top-color: #1f2937;
        border-radius: 50%;
        -webkit-animation: spinner 0.6s linear infinite;
                animation: spinner 0.6s linear infinite;
      }

      @-webkit-keyframes spinner {
        to {
          -webkit-transform: rotate(360deg);
                  transform: rotate(360deg);
        }
      }

      @keyframes spinner {
        to {
          -webkit-transform: rotate(360deg);
                  transform: rotate(360deg);
        }
      }

      .install-prompt-loading-text {
        margin-top: 1rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: #374151;
      }
    `),`
      <div class="install-prompt-loading">
        <div class="install-prompt-loading-spinner"></div>
        <div class="install-prompt-loading-text">${wp.i18n.__("Checking installation capabilities...",config.jsVars.slug)}</div>
      </div>
    `}renderNativeInstallButton(){var _a,_b,_c;const themeColor=(_c=(_b=(_a=config.jsVars.settings.webAppManifest)==null?void 0:_a.appearance)==null?void 0:_b.themeColor)!=null?_c:"#000000",textColor=getContrastTextColor(themeColor);this.injectStyles(`
      .install-prompt-native-button {
        width: 100%;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        font-weight: 500;
        font-size: 0.875rem;
        line-height: 1.25rem;
        border-radius: 0.5rem;
        color: ${textColor};
        background-color: ${themeColor};
        -webkit-transition: all 0.1s ease;
        -o-transition: all 0.1s ease;
        transition: all 0.1s ease;
        cursor: pointer;
        outline: none;
        border: none;
        margin-top: 1.5rem;
      }

      .install-prompt-native-button:hover {
        opacity: 0.8;
      }

      .install-prompt-native-button:focus {
        outline: 2px solid #60a5fa;
        outline-offset: 2px;
      }

      .install-prompt-native-button svg {
        width: 1.25rem;
        height: 1.25rem;
      }
    `);const{device,os,browser}=config.jsVars.userData;let btnIconSvg="",btnIconText=wp.i18n.__("Click to Install",config.jsVars.slug);return device.isSmartphone||device.isTablet?(btnIconSvg=svg.installMobile,btnIconText=wp.i18n.__("Tap to Install",config.jsVars.slug)):device.isDesktop&&(btnIconSvg=svg.installDesktop),`
      <button type="button" class="install-prompt-native-button" id="native-install-btn">
        ${btnIconSvg}
        ${btnIconText}
      </button>
    `}renderContent(){return this.hasAttribute("loaded")?deferredInstallPrompt?`
        ${this.renderAppInfo()}
        ${this.renderNativeInstallButton()}
      `:`
        ${this.renderAppInfo()}
        ${this.renderManualInstallInstructions()}
      `:`
        ${this.renderLoadingInstallCheck()}
      `}renderStep(stepNumber,title="",description="",icon="",extraHtml=""){return this.injectStyles(`
      .install-prompt-body-instructions_step {
        position: relative;
        -webkit-padding-start: 2.8rem;
                padding-inline-start: 2.8rem;
        padding-bottom: 2.2rem;
        counter-increment: step 1;
      }

      .install-prompt-body-instructions_step:last-child {
        padding-bottom: 0px;
      }

      .install-prompt-body-instructions_step-icon {
        position: absolute;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        inset-inline-start: 0px;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        width: 2rem;
        height: 2rem;
        color: #1f2937;
        border-radius: 9999px;
        background-color: #f3f4f6;
      }

      .install-prompt-body-instructions_step-icon svg {
        width: 1.25rem;
        height: 1.25rem;
        -ms-flex-negative: 0;
            flex-shrink: 0;
      }

      .install-prompt-body-instructions_step-icon:empty::before {
        content: counter(step);
        font-size: 0.75rem;
        line-height: 1rem;
        font-weight: 600;
      }

      .install-prompt-body-instructions_step {
        counter-increment: step;
      }

      .install-prompt-body-instructions_step:last-child::after {
        display: none;
      }

      .install-prompt-body-instructions_step::after {
        content: '';
        position: absolute;
        top: 2.5rem;
        bottom: 0.5rem;
        inset-inline-start: 0.95rem;
        width: 1px;
        -webkit-transform: translateX(0.5px);
            -ms-transform: translateX(0.5px);
                transform: translateX(0.5px);
        background-color: #e5e7eb;
      }

      .install-prompt-body-instructions_step_title {
        display: block;
        font-weight: 600;
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: #1f2937;
      }

      .install-prompt-body-instructions_step_description {
        font-size: 0.8rem;
        color: #6b7280;
        line-height: 1.1rem;
        margin: 0;
        padding: 0;
        margin-top: 0.2rem;
      }
    `),`
      <li class="install-prompt-body-instructions_step">
        ${icon?`<div class="install-prompt-body-instructions_step-icon">${icon}</div>`:'<div class="install-prompt-body-instructions_step-icon"></div>'}
        <span class="install-prompt-body-instructions_step_title">
           ${stepNumber}. ${title}
        </span>
        <p class="install-prompt-body-instructions_step_description">
          ${description}
        </p>
        ${extraHtml}
      </li> 
    `}renderManualInstallInstructions(){this.injectStyles(`
      .install-prompt-body-instructions {
        list-style: none;
        margin: 0;
        margin-top: 1.5rem;
        padding: 0;
      }
    `);const{device,os,browser}=config.jsVars.userData;let steps=[],stepNumber=1;const renderStep=(...args)=>{steps.push(this.renderStep(stepNumber,...args)),stepNumber++};return device.isSmartphone||device.isTablet?os.isAndroid?browser.isChrome?(renderStep(wp.i18n.__("Tap the Menu Icon",config.jsVars.slug),wp.i18n.__("Tap the menu icon (three dots), located at the top-right of your screen.",config.jsVars.slug),svg.vertThreeDots),renderStep(wp.i18n.__('Select "Add to Home Screen"',config.jsVars.slug),wp.i18n.__('Tap the "Add to Home Screen" option from the menu.',config.jsVars.slug),svg.addToHomeScreen),renderStep(wp.i18n.__('Confirm by Tapping "Add"',config.jsVars.slug),wp.i18n.__('Tap the "Add" text on the browser installation dialog.',config.jsVars.slug),svg.tapFinger)):browser.isFirefox?(renderStep(wp.i18n.__("Tap the Menu Icon",config.jsVars.slug),wp.i18n.__("Tap the menu icon (three dots), located at the top-right of your screen.",config.jsVars.slug),svg.vertThreeDots),renderStep(wp.i18n.__('Select "Install"',config.jsVars.slug),wp.i18n.__('Tap the "Install" option from the menu.',config.jsVars.slug),svg.addToHomeScreen),renderStep(wp.i18n.__('Confirm by Tapping "Add to Home Screen"',config.jsVars.slug),wp.i18n.__('Tap the "Add to Home Screen" button on the browser installation dialog.',config.jsVars.slug),svg.tapFinger)):browser.isOpera?(renderStep(wp.i18n.__("Tap the Menu Icon",config.jsVars.slug),wp.i18n.__("Tap the menu icon (three dots), located at the top-right of your screen.",config.jsVars.slug),svg.vertThreeDots),renderStep(wp.i18n.__('Select "Home Screen"',config.jsVars.slug),wp.i18n.__('Tap the "Install" option from the menu.',config.jsVars.slug),svg.installMobile),renderStep(wp.i18n.__('Confirm by Tapping "Add"',config.jsVars.slug),wp.i18n.__('Tap the "Add" text on the browser installation dialog.',config.jsVars.slug),svg.tapFinger)):browser.isEdge?(renderStep(wp.i18n.__("Tap the Menu Icon",config.jsVars.slug),wp.i18n.__("Tap the menu icon (three horizontal lines) located at the bottom-right of your screen.",config.jsVars.slug),svg.hamburgerMenu),renderStep(wp.i18n.__('Select "Add to Phone"',config.jsVars.slug),wp.i18n.__('Tap the "Add to Phone" option from the menu',config.jsVars.slug),svg.installMobile),renderStep(wp.i18n.__('Confirm by Tapping "Install"',config.jsVars.slug),wp.i18n.__('Tap the "Install" text on the browser installation dialog.',config.jsVars.slug),svg.tapFinger)):(renderStep(wp.i18n.__("Copy the Page URL",config.jsVars.slug),wp.i18n.__("Click the button below to copy the page's URL.",config.jsVars.slug),svg.copy,this.renderCopyInstallUrlButton()),renderStep(wp.i18n.__("Open the Google Chrome Browser",config.jsVars.slug),wp.i18n.__("Launch the Google Chrome web browser from your home screen.",config.jsVars.slug),svg.googleChrome),renderStep(wp.i18n.__("Paste and Open the URL",config.jsVars.slug),wp.i18n.__("Paste the copied URL into Google Chrome's address bar and open the page.",config.jsVars.slug),svg.pasteGo)):os.isIos?browser.isSafari?(renderStep(wp.i18n.__("Tap the Menu button",config.jsVars.slug),wp.i18n.__("Open Safari menu (three horizontal dots) located at the bottom-right of the address bar.",config.jsVars.slug),svg.horizThreeDots),renderStep(wp.i18n.__('Select "Share"',config.jsVars.slug),wp.i18n.__('Tap the "Share" option, which is the first item in the menu at the top-center of your screen.',config.jsVars.slug),svg.iosShare),renderStep(wp.i18n.__("Tap the More button",config.jsVars.slug),wp.i18n.__('Tap the "More" button (three horizontal dots) located at the bottom-right of the share dialog.',config.jsVars.slug),svg.horizThreeDots),renderStep(wp.i18n.__('Select "Add to Home Screen"',config.jsVars.slug),wp.i18n.__('Tap the "Add to Home Screen" option, represented by the plus [+] icon.',config.jsVars.slug),svg.plusInBox),renderStep(wp.i18n.__('Confirm by Tapping "Add"',config.jsVars.slug),wp.i18n.__('Tap the "Add" button at the top-right corner of your screen.',config.jsVars.slug),svg.tapFinger)):browser.isChrome?(renderStep(wp.i18n.__("Tap the Share Icon",config.jsVars.slug),wp.i18n.__("Tap the share icon located at the top-right of your browser address bar.",config.jsVars.slug),svg.iosShare),renderStep(wp.i18n.__("Tap the More button",config.jsVars.slug),wp.i18n.__('Tap the "More" button (three horizontal dots) located at the bottom-right of the share dialog.',config.jsVars.slug),svg.horizThreeDots),renderStep(wp.i18n.__('Select "Add to Home Screen"',config.jsVars.slug),wp.i18n.__('Tap the "Add to Home Screen" option, represented by the plus [+] icon.',config.jsVars.slug),svg.plusInBox),renderStep(wp.i18n.__('Confirm by Tapping "Add"',config.jsVars.slug),wp.i18n.__('Tap the "Add" button at the top-right corner of your screen.',config.jsVars.slug),svg.tapFinger)):browser.isFirefox?(renderStep(wp.i18n.__("Tap the Menu Icon",config.jsVars.slug),wp.i18n.__("Tap the menu icon (three horizontal lines) located at the bottom-right of your screen.",config.jsVars.slug),svg.hamburgerMenu),renderStep(wp.i18n.__("Tap the Share Icon",config.jsVars.slug),wp.i18n.__("Tap the share icon in the dialog overlay that the browser opens.",config.jsVars.slug),svg.iosShare),renderStep(wp.i18n.__("Tap the More button",config.jsVars.slug),wp.i18n.__('Tap the "More" button (three horizontal dots) located at the bottom-right of the share dialog.',config.jsVars.slug),svg.horizThreeDots),renderStep(wp.i18n.__('Select "Add to Home Screen"',config.jsVars.slug),wp.i18n.__('Tap the "Add to Home Screen" option, represented by the plus [+] icon.',config.jsVars.slug),svg.plusInBox),renderStep(wp.i18n.__('Confirm by Tapping "Add"',config.jsVars.slug),wp.i18n.__('Tap the "Add" button at the top-right corner of your screen.',config.jsVars.slug),svg.tapFinger)):browser.isOpera?(renderStep(wp.i18n.__("Tap the Menu Icon",config.jsVars.slug),wp.i18n.__("Tap the menu icon (three dots), located at the bottom-right of your screen.",config.jsVars.slug),svg.vertThreeDots),renderStep(wp.i18n.__("Tap the Share Icon",config.jsVars.slug),wp.i18n.__("Tap the share icon located at the top of the dialog overlay that browser opens.",config.jsVars.slug),svg.upload),renderStep(wp.i18n.__("Tap the More button",config.jsVars.slug),wp.i18n.__('Tap the "More" button (three horizontal dots) located at the bottom-right of the share dialog.',config.jsVars.slug),svg.horizThreeDots),renderStep(wp.i18n.__('Select "Add to Home Screen"',config.jsVars.slug),wp.i18n.__('Tap the "Add to Home Screen" option, represented by the plus [+] icon.',config.jsVars.slug),svg.plusInBox),renderStep(wp.i18n.__('Confirm by Tapping "Add"',config.jsVars.slug),wp.i18n.__('Tap the "Add" button at the top-right corner of your screen.',config.jsVars.slug),svg.tapFinger)):browser.isEdge?(renderStep(wp.i18n.__("Tap the Menu Icon",config.jsVars.slug),wp.i18n.__("Tap the menu icon (three horizontal lines) located at the bottom-right of your screen.",config.jsVars.slug),svg.hamburgerMenu),renderStep(wp.i18n.__("Tap the Share Icon",config.jsVars.slug),wp.i18n.__("Tap the share icon in the dialog overlay that the browser opens.",config.jsVars.slug),svg.upload),renderStep(wp.i18n.__("Tap the More button",config.jsVars.slug),wp.i18n.__('Tap the "More" button (three horizontal dots) located at the bottom-right of the share dialog.',config.jsVars.slug),svg.horizThreeDots),renderStep(wp.i18n.__('Select "Add to Home Screen"',config.jsVars.slug),wp.i18n.__('Tap the "Add to Home Screen" option, represented by the plus [+] icon.',config.jsVars.slug),svg.plusInBox),renderStep(wp.i18n.__('Confirm by Tapping "Add"',config.jsVars.slug),wp.i18n.__('Tap the "Add" button at the top-right corner of your screen.',config.jsVars.slug),svg.tapFinger)):browser.isDuckduckgo?(renderStep(wp.i18n.__("Tap the Share Icon",config.jsVars.slug),wp.i18n.__("Tap the share icon located at the right side of the browser's address bar.",config.jsVars.slug),svg.upload),renderStep(wp.i18n.__("Tap the More button",config.jsVars.slug),wp.i18n.__('Tap the "More" button (three horizontal dots) located at the bottom-right of the share dialog.',config.jsVars.slug),svg.horizThreeDots),renderStep(wp.i18n.__('Select "Add to Home Screen"',config.jsVars.slug),wp.i18n.__('Tap the "Add to Home Screen" option, represented by the plus [+] icon.',config.jsVars.slug),svg.plusInBox),renderStep(wp.i18n.__('Confirm by Tapping "Add"',config.jsVars.slug),wp.i18n.__('Tap the "Add" button at the top-right corner of your screen.',config.jsVars.slug),svg.tapFinger)):(renderStep(wp.i18n.__("Copy the Page URL",config.jsVars.slug),wp.i18n.__("Click the button below to copy the page's URL.",config.jsVars.slug),svg.copy,this.renderCopyInstallUrlButton()),renderStep(wp.i18n.__("Open the Safari Browser",config.jsVars.slug),wp.i18n.__("Launch the Safari web browser from your home screen.",config.jsVars.slug),svg.safari),renderStep(wp.i18n.__("Paste and Open the URL",config.jsVars.slug),wp.i18n.__("Paste the copied URL into Safari's address bar and open the page.",config.jsVars.slug),svg.pasteGo)):renderStep(wp.i18n.__("Installation Not Supported",config.jsVars.slug),wp.i18n.__("Your operating system does not support web app installation. Please try accessing the website on an Android or iOS mobile device.",config.jsVars.slug),svg.noInstallSupport):device.isDesktop?browser.isChrome?(renderStep(wp.i18n.__("Tap the Menu Icon",config.jsVars.slug),wp.i18n.__("Tap the menu icon (three dots) in the top-right corner of your browser window.",config.jsVars.slug),svg.vertThreeDots),renderStep(wp.i18n.__('Expand "Cast, save and share"',config.jsVars.slug),wp.i18n.__('Hover over the "Cast, Save, and Share" menu item to expand its options.',config.jsVars.slug),svg.fileSave),renderStep(wp.i18n.__('Select "Install page as app..."',config.jsVars.slug),wp.i18n.__('Click on "Install page as app..." from the menu.',config.jsVars.slug),svg.installDesktop),renderStep(wp.i18n.__('Confirm by Clicking "Install"',config.jsVars.slug),wp.i18n.__(`Click the "Install" button in the browser's installation dialog.`,config.jsVars.slug),svg.mouseClick)):browser.isEdge?(renderStep(wp.i18n.__("Tap the Menu Icon",config.jsVars.slug),wp.i18n.__("Tap the menu icon (three dots) in the top-right corner of your browser window.",config.jsVars.slug),svg.horizThreeDots),renderStep(wp.i18n.__('Expand "Apps"',config.jsVars.slug),wp.i18n.__('Hover over the "Apps" menu item to expand its options.',config.jsVars.slug),svg.appsGrid),renderStep(wp.i18n.__('Select "Install this site as app"',config.jsVars.slug),wp.i18n.__('Click on "Install this site as app" from the menu.',config.jsVars.slug),svg.directionDown),renderStep(wp.i18n.__('Confirm by Clicking "Install"',config.jsVars.slug),wp.i18n.__(`Click the "Install" button in the browser's installation dialog.`,config.jsVars.slug),svg.mouseClick)):(renderStep(wp.i18n.__("Copy the Page URL",config.jsVars.slug),wp.i18n.__("Click the button below to copy the page's URL.",config.jsVars.slug),svg.copy,this.renderCopyInstallUrlButton()),renderStep(wp.i18n.__("Open the Google Chrome Browser",config.jsVars.slug),wp.i18n.__("Launch the Google Chrome web browser from your start menu.",config.jsVars.slug),svg.googleChrome),renderStep(wp.i18n.__("Paste and Open the URL",config.jsVars.slug),wp.i18n.__("Paste the copied URL into Google Chrome's address bar and open the page.",config.jsVars.slug),svg.pasteGo)):renderStep(wp.i18n.__("Installation Not Supported",config.jsVars.slug),wp.i18n.__("Your device does not support web app installation. Please try accessing the website on a mobile or desktop device.",config.jsVars.slug),svg.noInstallSupport),steps.length?`<ul class="install-prompt-body-instructions">${steps.join("")}</ul>`:""}render(){var _a,_b,_c;this.injectStyles(`
      .install-prompt {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 99999999999999999999;
        background: rgba(0, 0, 0, 0);
        -webkit-backdrop-filter: blur(0px);
                backdrop-filter: blur(0px);
        -webkit-transition: all 0.2s ease-out;
        -o-transition: all 0.2s ease-out;
        transition: all 0.2s ease-out;
        opacity: 0;
        visibility: hidden;
      }

      .install-prompt.visible {      
        background: rgba(0, 0, 0, 0.7);
        -webkit-backdrop-filter: blur(5px);
                backdrop-filter: blur(5px);
        opacity: 1;
        visibility: visible;
      }

      .install-prompt-container {
        position: fixed;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, calc(-50% + 20px));
            -ms-transform: translate(-50%, calc(-50% + 20px));
                transform: translate(-50%, calc(-50% + 20px));
        background: white;
        border-radius: 10px;
        -webkit-box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        max-width: 32rem;
        width: 95%;
        overflow: hidden;
        opacity: 0;
        -webkit-transition: all 0.15s ease-out;
        -o-transition: all 0.15s ease-out;
        transition: all 0.15s ease-out;
        z-index: 999999999999999999999;
      }

      .install-prompt.visible .install-prompt-container {
        -webkit-transform: translate(-50%, -50%);
            -ms-transform: translate(-50%, -50%);
                transform: translate(-50%, -50%);
        opacity: 1;
      }

      .install-prompt-header {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        padding: 0.75rem 1rem;
        gap: 1.5rem;
        -webkit-box-pack: justify;
            -ms-flex-pack: justify;
                justify-content: space-between;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        border-bottom: 1px solid #e5e7eb;
      }

      .install-prompt-header-texts_title {
        font-size: 1rem;
        line-height: 1.5rem;
        font-weight: 500;
        color: #1f2937;
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }

      .install-prompt-close {
        display: -webkit-inline-box;
        display: -ms-inline-flexbox;
        display: inline-flex;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        width: 2rem;
        height: 2rem;
        color: #1f2937;
        background: #f3f4f6;
        border-radius: 9999px;
        outline: none;
        border: none;
        cursor: pointer;
        -webkit-transition: all 0.1s ease;
        -o-transition: all 0.1s ease;
        transition: all 0.1s ease;
        -ms-flex-negative: 0;
            flex-shrink: 0;
      }

      .install-prompt-close:hover {
        background: #e5e7eb;
      }

      .install-prompt-close-icon {
        display: block;
        width: 1rem;
        height: 1rem;
        -ms-flex-negative: 0;
            flex-shrink: 0;
        vertical-align: middle;
      }

      .install-prompt-body {
        padding: 1.5rem 1rem;
        overflow-y: auto;
        max-height: 34rem;
      }

      .install-prompt-body::-webkit-scrollbar {
        width: .5rem;
      }

      .install-prompt-body::-webkit-scrollbar-thumb {
        background-color: rgb(209 213 219 / 1);
        border-radius: 9999px;
      }

      .install-prompt-body::-webkit-scrollbar-track {
        background-color: rgb(243 244 246 / 1);
      }

      .install-prompt-footer {
        display: none;
        padding: 0.25rem;
        border-top: 1px solid #e5e7eb;
      }

      .install-prompt-footer_close {
        width: 100%;
        display: -webkit-inline-box;
        display: -ms-inline-flexbox;
        display: inline-flex;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        -webkit-column-gap: 0.375rem;
           -moz-column-gap: 0.375rem;
                column-gap: 0.375rem;
        padding: 0.75rem 1rem;
        font-weight: 500;
        font-size: 0.75rem;
        line-height: 1rem;
        border-radius: 0.5rem;
        background-color: #ffffff;
        color: #1f2937;
        -webkit-transition: all 0.1s ease;
        -o-transition: all 0.1s ease;
        transition: all 0.1s ease;
        cursor: pointer;
        outline: none;
        border: none;
      }

      .install-prompt-footer_close:hover {
        background-color: #f3f4f6;
      }
        
      .install-prompt-footer_close:focus {
        outline: none;
        border: none;
        background-color: #f3f4f6;
      }

      @media (max-width: 700px) {
       .install-prompt-container {
          width: 100%;
          max-width: 100%;
          top: unset;
          bottom: 0;
          left: 0;
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
          -webkit-box-shadow: none;
                  box-shadow: none;
          opacity: 1;
          -webkit-transform: translateY(100%);
              -ms-transform: translateY(100%);
                  transform: translateY(100%);
        } 

        .install-prompt.visible .install-prompt-container {
          -webkit-transform: translateY(0);
              -ms-transform: translateY(0);
                  transform: translateY(0);
        }
      }
    `);const content=this.renderContent(),promptTitle=(_c=(_b=(_a=config.jsVars.settings.installation)==null?void 0:_a.prompts)==null?void 0:_b.text)!=null?_c:wp.i18n.__("Install Web App",config.jsVars.slug),combinedStyles=Array.from(this.styles).join(`
`);this.shadowRoot.innerHTML=`
      <style>${combinedStyles}</style>
      <div class="install-prompt">
        <div class="install-prompt-container">
          <div class="install-prompt-header">
            <div class="install-prompt-header-texts">
              <div class="install-prompt-header-texts_title">${promptTitle}</div>
            </div>
            <button type="button" class="install-prompt-close" aria-label="Close">
              <svg class="install-prompt-close-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
            </button>
          </div>
          <div class="install-prompt-body">
            ${content}
          </div>
          <div class="install-prompt-footer">
            <button type="button" class="install-prompt-footer_close">
              ${wp.i18n.__("Close Dialog",config.jsVars.slug)}
            </button>
          </div>
        </div>
      </div>
    `}}}}),installUrl_exports={};__export(installUrl_exports,{initInstallUrl:()=>initInstallUrl});async function initInstallUrl(){hasUrlParam("performInstallation","true")&&(performInstallation(),removeParamFromUrl("performInstallation"))}var init_installUrl=__esm({"frontend/assets/js/dev/modules/installUrl.js"(){init_installPrompt(),init_utils()}}),installButton_exports={};__export(installButton_exports,{initInstallButton:()=>initInstallButton});async function initInstallButton(){customElements.get("pwa-install-button")||customElements.define("pwa-install-button",PwaInstallButton)}var PwaInstallButton,init_installButton=__esm({"frontend/assets/js/dev/modules/installButton.js"(){init_frontend(),init_installPrompt(),init_utils(),PwaInstallButton=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.styles=new Set}connectedCallback(){this.render(),this.handleClick()}injectStyles(css){this.styles.add(css)}handleClick(){this.shadowRoot.querySelector(".pwa-install-button").addEventListener("click",()=>{performInstallation()})}render(){var _a,_b,_c,_d,_e,_f;const themeColor=(_c=(_b=(_a=config.jsVars.settings.webAppManifest)==null?void 0:_a.appearance)==null?void 0:_b.themeColor)!=null?_c:"#000000",textColor=getContrastTextColor(themeColor),buttonText=(_f=(_e=(_d=config.jsVars.settings.installation)==null?void 0:_d.prompts)==null?void 0:_e.text)!=null?_f:wp.i18n.__("Install Web App",config.jsVars.slug);this.injectStyles(`
      :host(:active),
      :host(:focus) {
        outline: transparent;
        border: none;
      }

      .pwa-install-button {
        display: inline-block;
        background-color: ${themeColor};
        color: ${textColor};
        vertical-align: middle;
        text-decoration: none;
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border: none;
        outline: none;
        border-radius: 9999px;
        cursor: pointer;
      }

      .pwa-install-button:hover {
        opacity: 0.8;
      }
    `);const combinedStyles=Array.from(this.styles).join(`
`);this.shadowRoot.innerHTML=`
      <style>${combinedStyles}</style>
      <button class="pwa-install-button">${buttonText}</button>
    `}}}}),installOverlayHeaderBanner_exports={};__export(installOverlayHeaderBanner_exports,{initInstallOverlayHeaderBanner:()=>initInstallOverlayHeaderBanner});async function initInstallOverlayHeaderBanner(){customElements.get("pwa-install-overlay-header-banner")||customElements.define("pwa-install-overlay-header-banner",PwaInstallOverlayHeaderBanner),PwaInstallOverlayHeaderBanner.show()}var PwaInstallOverlayHeaderBanner,init_installOverlayHeaderBanner=__esm({"frontend/assets/js/dev/modules/installOverlayHeaderBanner.js"(){init_frontend(),init_installPrompt(),init_utils(),PwaInstallOverlayHeaderBanner=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.styles=new Set}connectedCallback(){this.render(),this.handleRemove(),this.handlePerformInstallation()}static show(){let banner=document.querySelector("pwa-install-overlay-header-banner");return banner||(banner=document.createElement("pwa-install-overlay-header-banner"),document.body.appendChild(banner),requestAnimationFrame(()=>{banner.shadowRoot.querySelector(".header-banner-overlay").classList.add("visible")})),banner}injectStyles(css){this.styles.add(css)}handleRemove(){const headerBanner=this.shadowRoot.querySelector(".header-banner-overlay"),closeButton=this.shadowRoot.querySelector(".header-banner-overlay-button_close"),handleClose=()=>{headerBanner.classList.remove("visible"),setTimeout(()=>this.remove(),300)};closeButton.addEventListener("click",handleClose)}handlePerformInstallation(){this.shadowRoot.querySelector(".header-banner-overlay-button_install").addEventListener("click",()=>{performInstallation()})}render(){var _a,_b,_c,_d,_e,_f,_g,_h,_i,_j,_k,_l;const appName=(_a=config.jsVars.settings.webAppManifest.appIdentity.appName)!=null?_a:"",themeColor=(_d=(_c=(_b=config.jsVars.settings.webAppManifest)==null?void 0:_b.appearance)==null?void 0:_c.themeColor)!=null?_d:"#000000",textColor=getContrastTextColor(themeColor),title=(_g=(_f=(_e=config.jsVars.settings.installation)==null?void 0:_e.prompts)==null?void 0:_f.text)!=null?_g:wp.i18n.__("Install Web App",config.jsVars.slug),message=(_l=(_k=(_j=(_i=(_h=config.jsVars.settings.installation)==null?void 0:_h.prompts)==null?void 0:_i.types)==null?void 0:_j.headerBanner)==null?void 0:_k.message)!=null?_l:wp.i18n.__("Get our web app. It won't take up space on your device.",config.jsVars.slug),appIconHtml=config.jsVars.iconUrl?`<img class="header-banner-overlay-appinfo_icon" src="${config.jsVars.iconUrl}" alt="${appName}" onerror="this.style.display='none'"></img>`:"";this.injectStyles(`
      .header-banner-overlay {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        z-index: 99999;
        padding: 0.75rem;
        background-color: ${themeColor};
        color: ${textColor};
        box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        -webkit-transition: all 0.2s ease-out;
        -o-transition: all 0.2s ease-out;
        transition: all 0.2s ease-out;
        opacity: 0;
        visibility: hidden;
      }

      .header-banner-overlay.visible {
        opacity: 1;
        visibility: visible;
      }

      .header-banner-overlay-appinfo {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        gap: 0.75rem;
      }

      .header-banner-overlay-appinfo_icon {
        border-radius: 9999px;
        border: 1px solid #e5e7eb;
        -ms-flex-negative: 0;
            flex-shrink: 0;
        height: 50px;
        width: 50px;
        display: inline-block;
      }

      .header-banner-overlay-appinfo_title {
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-weight: 500;
        color: ${textColor};
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }

      .header-banner-overlay-appinfo_description {
        font-size: 0.75rem;
        line-height: 1rem;
        font-weight: 400;
        color: ${textColor}cc;
        margin-top: 0.12rem;
        text-wrap: balance;
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }

      .header-banner-overlay-buttons {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-shrink: 0;
      }

      .header-banner-overlay-button_install {
        display: inline-block;
        background-color: ${textColor};
        color: ${themeColor};
        vertical-align: middle;
        text-decoration: none;
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-weight: 600;
        padding: 0.375rem 0.875rem;
        border: none;
        outline: none;
        border-radius: 9999px;
        cursor: pointer;
      }

      .header-banner-overlay-button_install:hover {
        opacity: 0.8;
      }

      .header-banner-overlay-button_close {
        display: inline-flex;
        background-color: transparent;
        color: ${textColor}cc;
        padding: 0;
        border-radius: 0.5rem;
        cursor: pointer;
        outline: none;
        border: none;
      }

      .header-banner-overlay-button_close:hover {
        background-color: ${textColor}1a;
      }

      .header-banner-overlay-button_close svg {
        width: 1rem;
        height: 1rem;
      }

      @media (min-width: 400px) {
        .header-banner-overlay-appinfo_icon {
          height: 45px;
          width: 45px;
        }
      }

      @media (min-width: 1200px) {
        .header-banner-overlay {
          justify-content: center;
          gap: 5rem;
        }

        .header-banner-overlay-button_close {
          padding: 0.375rem;
        }
      }
    `);const combinedStyles=Array.from(this.styles).join(`
`);this.shadowRoot.innerHTML=`
      <style>${combinedStyles}</style>
      <div class="header-banner-overlay">
        <div class="header-banner-overlay-appinfo">
          ${appIconHtml}
          <div class="header-banner-overlay-appinfo_texts">
            <div class="header-banner-overlay-appinfo_title">${title}</div>
            <div class="header-banner-overlay-appinfo_description">${message}</div>
          </div>
        </div>
        <div class="header-banner-overlay-buttons">
          <button type="button" class="header-banner-overlay-button_install">
            ${wp.i18n.__("Install Now",config.jsVars.slug)}
          </button>
          <button type="button" class="header-banner-overlay-button_close" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
          </button>
        </div>
      </div>
    `}}}}),installOverlaySnackbar_exports={};__export(installOverlaySnackbar_exports,{initInstallOverlaySnackbar:()=>initInstallOverlaySnackbar});async function initInstallOverlaySnackbar(){let hasTriggered=!1;const scrollPercentTrigger=30;customElements.get("pwa-install-overlay-snackbar")||customElements.define("pwa-install-overlay-snackbar",PwaInstallOverlaySnackbar),window.addEventListener("scroll",()=>{if(hasTriggered)return;window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100>=scrollPercentTrigger&&(PwaInstallOverlaySnackbar.show(),hasTriggered=!0)})}var PwaInstallOverlaySnackbar,init_installOverlaySnackbar=__esm({"frontend/assets/js/dev/modules/installOverlaySnackbar.js"(){init_frontend(),init_installPrompt(),init_utils(),PwaInstallOverlaySnackbar=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.styles=new Set,this.displayDuration=7e3}connectedCallback(){this.render(),this.setupInstallHandler()}static show(){let snackbar=document.querySelector("pwa-install-overlay-snackbar");return snackbar||(snackbar=document.createElement("pwa-install-overlay-snackbar"),document.body.appendChild(snackbar),requestAnimationFrame(()=>{snackbar.shadowRoot.querySelector(".snackbar-overlay").classList.add("visible"),snackbar.startProgressBar(),snackbar.setupAutoHide()})),snackbar}injectStyles(css){this.styles.add(css)}startProgressBar(){const progressBar=this.shadowRoot.querySelector(".snackbar-overlay-progressbar_inner");progressBar.style.width="100%",progressBar.offsetHeight,requestAnimationFrame(()=>{progressBar.style.width="0%"})}setupAutoHide(){this._hideTimeout&&clearTimeout(this._hideTimeout),this._hideTimeout=setTimeout(()=>{const snackbar=this.shadowRoot.querySelector(".snackbar-overlay");snackbar.classList.remove("visible"),snackbar.addEventListener("transitionend",()=>{this.remove()},{once:!0})},this.displayDuration)}setupInstallHandler(){this.shadowRoot.querySelector(".snackbar-overlay-button_install").addEventListener("click",()=>{performInstallation()})}render(){var _a,_b,_c,_d,_e,_f,_g,_h,_i,_j,_k;const themeColor=(_c=(_b=(_a=config.jsVars.settings.webAppManifest)==null?void 0:_a.appearance)==null?void 0:_b.themeColor)!=null?_c:"#000000",textColor=getContrastTextColor(themeColor),title=(_f=(_e=(_d=config.jsVars.settings.installation)==null?void 0:_d.prompts)==null?void 0:_e.text)!=null?_f:wp.i18n.__("Install Web App",config.jsVars.slug),message=(_k=(_j=(_i=(_h=(_g=config.jsVars.settings.installation)==null?void 0:_g.prompts)==null?void 0:_h.types)==null?void 0:_i.snackbar)==null?void 0:_j.message)!=null?_k:wp.i18n.__("Installing uses no storage and offers a quick way back to our web app.",config.jsVars.slug);this.injectStyles(`
      .snackbar-overlay {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        position: fixed;
        right: 1rem;
        left: 1rem;
        bottom: 1rem;
        border-radius: 0.5rem;
        z-index: 9999999999;
        padding: 1rem;
        background-color: ${themeColor};
        color: ${textColor};
        box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        transition: all 0.2s ease-out;
        opacity: 0;
        visibility: hidden;
        overflow: hidden;
      }

      .snackbar-overlay.visible {
        opacity: 1;
        visibility: visible;
      }

      .snackbar-overlay-appinfo_title {
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-weight: 500;
        color: ${textColor};
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }

      .snackbar-overlay-appinfo_description {
        font-size: 0.75rem;
        line-height: 1rem;
        font-weight: 400;
        color: ${textColor}cc;
        margin-top: 0.12rem;
        text-wrap: balance;
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }

      .snackbar-overlay-button_install {
        display: inline-block;
        flex-shrink: 0;
        background-color: ${textColor};
        color: ${themeColor};
        vertical-align: middle;
        text-decoration: none;
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-weight: 600;
        padding: 0.375rem 0.875rem;
        border: none;
        outline: none;
        border-radius: 9999px;
        cursor: pointer;
      }

      .snackbar-overlay-progressbar {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 0.25rem;
        background-color: ${themeColor};
        overflow: hidden;
      }

      .snackbar-overlay-progressbar_inner {
        width: 100%;
        height: 100%;
        background-color: ${textColor}80;
        transition: width ${this.displayDuration}ms linear;
      }
    `);const combinedStyles=Array.from(this.styles).join(`
`);this.shadowRoot.innerHTML=`
      <style>${combinedStyles}</style>
      <div class="snackbar-overlay">
        <div class="snackbar-overlay-appinfo">
          <div class="snackbar-overlay-appinfo_title">${title}</div>
          <div class="snackbar-overlay-appinfo_description">${message}</div>
        </div>
        <button type="button" class="snackbar-overlay-button_install">
          ${wp.i18n.__("Install Now",config.jsVars.slug)}
        </button>
        <div class="snackbar-overlay-progressbar">
          <div class="snackbar-overlay-progressbar_inner"></div>
        </div>
      </div>
    `}}}}),installOverlayBlogPopup_exports={};__export(installOverlayBlogPopup_exports,{initInstallOverlayBlogPopup:()=>initInstallOverlayBlogPopup});async function initInstallOverlayBlogPopup(){let hasTriggered=!1;const scrollPercentTrigger=10;customElements.get("pwa-install-overlay-blog-popup")||customElements.define("pwa-install-overlay-blog-popup",PwaInstallOverlayBlogPopup),window.addEventListener("scroll",()=>{if(hasTriggered)return;window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100>=scrollPercentTrigger&&(PwaInstallOverlayBlogPopup.show(),hasTriggered=!0)})}var PwaInstallOverlayBlogPopup,init_installOverlayBlogPopup=__esm({"frontend/assets/js/dev/modules/installOverlayBlogPopup.js"(){init_frontend(),init_installPrompt(),init_utils(),PwaInstallOverlayBlogPopup=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.styles=new Set}connectedCallback(){this.render(),this.handleRemove(),this.handlePerformInstallation()}static show(){let popup=document.querySelector("pwa-install-overlay-blog-popup");return popup||(popup=document.createElement("pwa-install-overlay-blog-popup"),document.body.appendChild(popup),requestAnimationFrame(()=>{const blogPopup=popup.shadowRoot.querySelector(".blog-popup-overlay");document.documentElement.style.paddingRight=`${window.innerWidth-document.documentElement.offsetWidth}px`,document.documentElement.style.overflow="hidden",blogPopup.classList.add("visible")})),popup}injectStyles(css){this.styles.add(css)}handleRemove(){const continueButton=this.shadowRoot.querySelector(".blog-popup-overlay-button.-continue"),backdrop=this.shadowRoot.querySelector(".blog-popup-overlay"),handleClose=()=>{backdrop.classList.remove("visible"),backdrop.addEventListener("transitionend",()=>{document.documentElement.style.removeProperty("overflow"),document.documentElement.style.paddingRight="",this.remove()},{once:!0})};continueButton.addEventListener("click",handleClose),backdrop.addEventListener("click",e=>{e.target===backdrop&&handleClose()})}handlePerformInstallation(){this.shadowRoot.querySelector(".blog-popup-overlay-button.-install").addEventListener("click",()=>{performInstallation()})}render(){var _a,_b,_c,_d;const{device,os,browser}=config.jsVars.userData,appName=(_a=config.jsVars.settings.webAppManifest.appIdentity.appName)!=null?_a:"",themeColor=(_d=(_c=(_b=config.jsVars.settings.webAppManifest)==null?void 0:_b.appearance)==null?void 0:_c.themeColor)!=null?_d:"#000000",textColor=getContrastTextColor(themeColor),appIconHtml=config.jsVars.iconUrl?`<img class="blog-popup-overlay-appinfo_icon" src="${config.jsVars.iconUrl}" alt="${appName}" onerror="this.style.display='none'"></img>`:"";let browserTitle,browserIcon;switch(!0){case browser.isChrome:browserTitle="Chrome",browserIcon=config.jsVars.pluginsData.dirUrl+"/frontend/assets/media/icons/browsers/chrome.png";break;case browser.isSafari:browserTitle="Safari",browserIcon=config.jsVars.pluginsData.dirUrl+"/frontend/assets/media/icons/browsers/safari.png";break;case browser.isFirefox:browserTitle="Firefox",browserIcon=config.jsVars.pluginsData.dirUrl+"/frontend/assets/media/icons/browsers/firefox.png";break;case browser.isOpera:browserTitle="Opera",browserIcon=config.jsVars.pluginsData.dirUrl+"/frontend/assets/media/icons/browsers/opera.png";break;case browser.isEdge:browserTitle="Edge",browserIcon=config.jsVars.pluginsData.dirUrl+"/frontend/assets/media/icons/browsers/edge.png";break;case browser.isSamsung:browserTitle="Samsung Browser",browserIcon=config.jsVars.pluginsData.dirUrl+"/frontend/assets/media/icons/browsers/samsung.png";break;case browser.isYandex:browserTitle="Yandex Browser",browserIcon=config.jsVars.pluginsData.dirUrl+"/frontend/assets/media/icons/browsers/yandex.png";break;case browser.isDuckduckgo:browserTitle="DuckDuckGo",browserIcon=config.jsVars.pluginsData.dirUrl+"/frontend/assets/media/icons/browsers/duckduckgo.png";break;case browser.isBrave:browserTitle="Brave",browserIcon=config.jsVars.pluginsData.dirUrl+"/frontend/assets/media/icons/browsers/brave.png";break;case browser.isQq:browserTitle="QQ Browser",browserIcon=config.jsVars.pluginsData.dirUrl+"/frontend/assets/media/icons/browsers/qq.png";break;case browser.isUc:browserTitle="UC Browser",browserIcon=config.jsVars.pluginsData.dirUrl+"/frontend/assets/media/icons/browsers/uc.png";break;default:browserTitle="Browser",browserIcon=config.jsVars.pluginsData.dirUrl+"/frontend/assets/media/icons/unknown.png";break}this.injectStyles(`
      .blog-popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999999999;
        background: rgba(0, 0, 0, 0);
        -webkit-backdrop-filter: blur(0px);
                backdrop-filter: blur(0px);
        -webkit-transition: all 0.2s ease-out;
        -o-transition: all 0.2s ease-out;
        transition: all 0.2s ease-out;
        opacity: 0;
        visibility: hidden;
      }

      .blog-popup-overlay.visible {
        background: rgba(0, 0, 0, 0.7);
        -webkit-backdrop-filter: blur(5px);
                backdrop-filter: blur(5px);
        opacity: 1;
        visibility: visible;
      }

      .blog-popup-overlay-container {
        position: fixed;
        width: 100%;
        bottom: 0;
        left: 0;
        background-color: #fff;
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        -webkit-transition: all 0.15s ease-out;
             -o-transition: all 0.15s ease-out;
                transition: all 0.15s ease-out;
        z-index: 9999999999;
        -webkit-transform: translateY(100%);
            -ms-transform: translateY(100%);
                transform: translateY(100%);
      }

      .blog-popup-overlay.visible .blog-popup-overlay-container {
        -webkit-transform: translateY(0);
            -ms-transform: translateY(0);
                transform: translateY(0);
      }

      .blog-popup-overlay-header {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        padding: 0.75rem 1rem;
        gap: 1.5rem;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        border-bottom: 1px solid #e5e7eb;
      }

      .blog-popup-overlay-header_title {
        font-size: 1rem;
        line-height: 1.5rem;
        font-weight: 500;
        color: #1f2937;
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }

      .blog-popup-overlay-body {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
            -ms-flex-direction: column;
                flex-direction: column;
        gap: 1.25rem;
        padding: 1.5rem;
        overflow-y: auto;
      }

      .blog-popup-overlay-body::-webkit-scrollbar {
        width: .5rem;
      }

      .blog-popup-overlay-body::-webkit-scrollbar-thumb {
        background-color: rgb(209 213 219 / 1);
        border-radius: 9999px;
      }

      .blog-popup-overlay-body::-webkit-scrollbar-track {
        background-color: rgb(243 244 246 / 1);
      }

      .blog-popup-overlay-appinfo,
      .blog-popup-overlay-browserinfo {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
            -ms-flex-pack: justify;
                justify-content: space-between;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        gap: 1rem;        
      }

      .blog-popup-overlay-appinfo_media,
      .blog-popup-overlay-browserinfo_media {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        gap: 0.5rem;
      }

      .blog-popup-overlay-appinfo_icon,
      .blog-popup-overlay-browserinfo_icon {
        border-radius: 9999px;
        -ms-flex-negative: 0;
            flex-shrink: 0;
        height: 48px;
        width: 48px;
        display: inline-block;
      }

      .blog-popup-overlay-appinfo_appname,
      .blog-popup-overlay-browserinfo_title {
        font-size: 1rem;
        line-height: 1.5rem;
        font-weight: 500;
        color: #1f2937;
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }

      .blog-popup-overlay-button {
        border-radius: 9999px;
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-weight: 700;
        height: 2.5rem;
        border: none;
        outline: none;
        padding: 0;
        text-align: center;
        text-transform: capitalize;
        width: 6rem;
      }

      .blog-popup-overlay-button.-install {
        background-color: ${themeColor};
        color: ${textColor};
      }

      .blog-popup-overlay-button.-continue {
        background-color: #d9dee2;
        color: #787c7e;
        border: 1px solid #d3d6da;
      }
    `);const combinedStyles=Array.from(this.styles).join(`
`);this.shadowRoot.innerHTML=`
      <style>${combinedStyles}</style>
      <div class="blog-popup-overlay">
        <div class="blog-popup-overlay-container">
          <div class="blog-popup-overlay-header">
            <div class="blog-popup-overlay-header_title">${wp.i18n.__("Read this article in our web app",config.jsVars.slug)}</div>
          </div>
          <div class="blog-popup-overlay-body">
            <div class="blog-popup-overlay-appinfo">
              <div class="blog-popup-overlay-appinfo_media">
                ${appIconHtml}
                <div class="blog-popup-overlay-appinfo_appname">${appName}</div>
              </div>
              <button type="button" class="blog-popup-overlay-button -install">
                ${wp.i18n.__("Open",config.jsVars.slug)}
              </button>
            </div>
            <div class="blog-popup-overlay-browserinfo">
              <div class="blog-popup-overlay-browserinfo_media">
                <img class="blog-popup-overlay-browserinfo_icon" src="${browserIcon}" alt="${browserTitle}" onerror="this.style.display='none'"></img>
                <div class="blog-popup-overlay-browserinfo_title">${browserTitle}</div>
              </div>
              <button type="button" class="blog-popup-overlay-button -continue">
                ${wp.i18n.__("Continue",config.jsVars.slug)}
              </button>
            </div>     
          </div>
        </div>
      </div>
    `}}}}),installOverlayNavigationMenu_exports={};__export(installOverlayNavigationMenu_exports,{initInstallOverlayNavigationMenu:()=>initInstallOverlayNavigationMenu});async function initInstallOverlayNavigationMenu(){customElements.get("pwa-install-overlay-navigation-menu")||customElements.define("pwa-install-overlay-navigation-menu",PwaInstallOverlayNavigationMenu),PwaInstallOverlayNavigationMenu.show(),setTimeout(()=>{PwaInstallOverlayNavigationMenu.show()},1e3)}var PwaInstallOverlayNavigationMenu,init_installOverlayNavigationMenu=__esm({"frontend/assets/js/dev/modules/installOverlayNavigationMenu.js"(){init_frontend(),init_installPrompt(),init_utils(),PwaInstallOverlayNavigationMenu=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.styles=new Set}connectedCallback(){this.render(),this.handlePerformInstallation()}static findVisibleMenuElement(element){if(element.tagName.toLowerCase()==="ul"&&window.getComputedStyle(element).display!=="none"&&element.querySelector("li"))return element;for(const child of element.children){const found=this.findVisibleMenuElement(child);if(found)return found}return null}static findMobileMenu(){const mobileMenuSelectors=[".wp-block-navigation","#ast-mobile-header","#mobile-menu",".mobile-menu",".mobile-navigation",'[class*="mobile-header"]','[id*="mobile-header"]','[class*="mobile-menu"]','[id*="mobile-menu"]',"nav","header"];for(const selector of mobileMenuSelectors){const elements=document.querySelectorAll(selector);for(const element of elements)if(window.getComputedStyle(element).display!=="none"){const menuElement=this.findVisibleMenuElement(element);if(menuElement)return{container:element,menu:menuElement}}}return null}static show(){let overlay=document.querySelector("pwa-install-overlay-navigation-menu");if(!overlay){const menuData=this.findMobileMenu();if(menuData?.menu){overlay=document.createElement("pwa-install-overlay-navigation-menu");const menuItem=document.createElement("li");menuItem.className="menu-item pwa-install-menu-item";const existingMenuItem=menuData.menu.querySelector("li");if(existingMenuItem){const classesToCopy=Array.from(existingMenuItem.classList).filter(cls=>!cls.includes("current")&&!cls.includes("active"));menuItem.classList.add(...classesToCopy)}menuItem.appendChild(overlay),menuData.menu.appendChild(menuItem)}}return overlay}injectStyles(css){this.styles.add(css)}handlePerformInstallation(){const installButton=this.shadowRoot.querySelector(".navigation-menu-overlay-button_install");installButton?.addEventListener("click",()=>{performInstallation()})}render(){var _a,_b,_c,_d,_e,_f,_g,_h,_i,_j,_k,_l;const appName=(_a=config.jsVars.settings.webAppManifest.appIdentity.appName)!=null?_a:"",themeColor=(_d=(_c=(_b=config.jsVars.settings.webAppManifest)==null?void 0:_b.appearance)==null?void 0:_c.themeColor)!=null?_d:"#000000",textColor=getContrastTextColor(themeColor),title=(_g=(_f=(_e=config.jsVars.settings.installation)==null?void 0:_e.prompts)==null?void 0:_f.text)!=null?_g:wp.i18n.__("Install Web App",config.jsVars.slug),message=(_l=(_k=(_j=(_i=(_h=config.jsVars.settings.installation)==null?void 0:_h.prompts)==null?void 0:_i.types)==null?void 0:_j.navigationMenu)==null?void 0:_k.message)!=null?_l:wp.i18n.__("Find what you need faster by installing our web app!",config.jsVars.slug),appIconHtml=config.jsVars.iconUrl?`<img class="navigation-menu-overlay-appinfo_icon" src="${config.jsVars.iconUrl}" alt="${appName}" onerror="this.style.display='none'"/>`:"";this.injectStyles(`
      .navigation-menu-overlay {
        position: relative;
        border-radius: 0.5rem;
        padding: 1rem;
        background-color: ${themeColor};
        color: ${textColor};
        box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        -webkit-transition: all 0.2s ease-out;
        -o-transition: all 0.2s ease-out;
        transition: all 0.2s ease-out;
        overflow: hidden;
        text-transform: none;
      }

      .navigation-menu-overlay-appinfo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex: 1;
      }

      .navigation-menu-overlay-appinfo_icon {
        border-radius: 9999px;
        border: 1px solid #e5e7eb;
        flex-shrink: 0;
        height: 50px;
        width: 50px;
        display: inline-block;
      }

      .navigation-menu-overlay-appinfo_texts {
        flex: 1;
        min-width: 0;
      }

      .navigation-menu-overlay-appinfo_title {
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-weight: 500;
        color: ${textColor};
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }

      .navigation-menu-overlay-appinfo_description {
        font-size: 0.75rem;
        line-height: 1rem;
        font-weight: 400;
        color: ${textColor}cc;
        margin-top: 0.12rem;
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }

      .navigation-menu-overlay-button_install {
        display: block;
        background-color: ${textColor};
        color: ${themeColor};
        vertical-align: middle;
        text-decoration: none;
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-weight: 600;
        padding: 0.375rem 0.875rem;
        margin-left: auto;
        margin-top: 1rem;
        border: none;
        outline: none;
        border-radius: 9999px;
        cursor: pointer;
      }
    `);const combinedStyles=Array.from(this.styles).join(`
`);this.shadowRoot.innerHTML=`
      <style>${combinedStyles}</style>
      <div class="navigation-menu-overlay">
        <div class="navigation-menu-overlay-appinfo">
          ${appIconHtml}
          <div class="navigation-menu-overlay-appinfo_texts">
            <div class="navigation-menu-overlay-appinfo_title">${title}</div>
            <div class="navigation-menu-overlay-appinfo_description">${message}</div>
          </div>
        </div>
        <button type="button" class="navigation-menu-overlay-button_install">
          ${wp.i18n.__("Install Now",config.jsVars.slug)}
        </button>
      </div>
    `}}}}),installOverlayInFeed_exports={};__export(installOverlayInFeed_exports,{initInstallOverlayInFeed:()=>initInstallOverlayInFeed});async function initInstallOverlayInFeed(){customElements.get("pwa-install-overlay-in-feed")||customElements.define("pwa-install-overlay-in-feed",PwaInstallOverlayInFeed),PwaInstallOverlayInFeed.show(),setTimeout(()=>{PwaInstallOverlayInFeed.show()},1e3)}var PwaInstallOverlayInFeed,init_installOverlayInFeed=__esm({"frontend/assets/js/dev/modules/installOverlayInFeed.js"(){init_frontend(),init_installPrompt(),init_utils(),PwaInstallOverlayInFeed=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.styles=new Set}connectedCallback(){this.render(),this.handlePerformInstallation()}static async findFeedContainer(){const feedSelectors=[".post-list",".posts",".post-loop",".blog-posts",".content-area",".site-main","#main","#content","main",".entry-content"],feedItemSelectors=[".post",".entry",".article",".blog-post",".hentry","article"];let feedContainer=null;for(const selector of feedSelectors){const element=document.querySelector(selector);if(element){feedContainer=element;break}}if(!feedContainer)return null;let feedItems=null;for(const selector of feedItemSelectors){const items=feedContainer.querySelectorAll(selector);if(items.length>0){feedItems=items;break}}return{feedContainer,feedItems}}static async show(){var _a;let overlay=document.querySelector("pwa-install-overlay-in-feed");if(!overlay){overlay=document.createElement("pwa-install-overlay-in-feed");const feed=await this.findFeedContainer();if(feed&&((_a=feed.feedItems)==null?void 0:_a.length)>=4){const targetItem=feed.feedItems[3],overlayWrapper=document.createElement("div");overlayWrapper.className="pwa-install-overlay-wrapper",overlayWrapper.appendChild(overlay),targetItem.parentNode.insertBefore(overlayWrapper,targetItem.nextSibling)}}return overlay}injectStyles(css){this.styles.add(css)}handlePerformInstallation(){const installButton=this.shadowRoot.querySelector(".in-feed-overlay-button_install");installButton?.addEventListener("click",()=>{performInstallation()})}render(){var _a,_b,_c,_d,_e,_f,_g,_h,_i,_j,_k,_l;const appName=(_a=config.jsVars.settings.webAppManifest.appIdentity.appName)!=null?_a:"",themeColor=(_d=(_c=(_b=config.jsVars.settings.webAppManifest)==null?void 0:_b.appearance)==null?void 0:_c.themeColor)!=null?_d:"#000000",textColor=getContrastTextColor(themeColor),title=(_g=(_f=(_e=config.jsVars.settings.installation)==null?void 0:_e.prompts)==null?void 0:_f.text)!=null?_g:wp.i18n.__("Install Web App",config.jsVars.slug),message=(_l=(_k=(_j=(_i=(_h=config.jsVars.settings.installation)==null?void 0:_h.prompts)==null?void 0:_i.types)==null?void 0:_j.inFeed)==null?void 0:_k.message)!=null?_l:wp.i18n.__("Keep reading, even when you're on the train!",config.jsVars.slug),appIconHtml=config.jsVars.iconUrl?`<img class="in-feed-overlay-appinfo_icon" src="${config.jsVars.iconUrl}" alt="${appName}" onerror="this.style.display='none'"/>`:"";this.injectStyles(`
      .in-feed-overlay {
        position: relative;
        border-radius: 0.5rem;
        padding: 1rem;
        background-color: ${themeColor};
        color: ${textColor};
        box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        -webkit-transition: all 0.2s ease-out;
        -o-transition: all 0.2s ease-out;
        transition: all 0.2s ease-out;
        overflow: hidden;
        text-transform: none;
      }

      .in-feed-overlay-appinfo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex: 1;
      }

      .in-feed-overlay-appinfo_icon {
        border-radius: 9999px;
        border: 1px solid #e5e7eb;
        flex-shrink: 0;
        height: 50px;
        width: 50px;
        display: inline-block;
      }

      .in-feed-overlay-appinfo_texts {
        flex: 1;
        min-width: 0;
      }

      .in-feed-overlay-appinfo_title {
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-weight: 500;
        color: ${textColor};
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }

      .in-feed-overlay-appinfo_description {
        font-size: 0.75rem;
        line-height: 1rem;
        font-weight: 400;
        color: ${textColor}cc;
        margin-top: 0.12rem;
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }

      .in-feed-overlay-button_install {
        display: block;
        background-color: ${textColor};
        color: ${themeColor};
        vertical-align: middle;
        text-decoration: none;
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-weight: 600;
        padding: 0.375rem 0.875rem;
        margin-left: auto;
        margin-top: 1rem;
        border: none;
        outline: none;
        border-radius: 9999px;
        cursor: pointer;
      }
    `);const combinedStyles=Array.from(this.styles).join(`
`);this.shadowRoot.innerHTML=`
      <style>${combinedStyles}</style>
      <div class="in-feed-overlay">
        <div class="in-feed-overlay-appinfo">
          ${appIconHtml}
          <div class="in-feed-overlay-appinfo_texts">
            <div class="in-feed-overlay-appinfo_title">${title}</div>
            <div class="in-feed-overlay-appinfo_description">${message}</div>
          </div>
        </div>
        <button type="button" class="in-feed-overlay-button_install">
          ${wp.i18n.__("Install Now",config.jsVars.slug)}
        </button>
      </div>
    `}}}}),installOverlayWoocommerceCheckout_exports={};__export(installOverlayWoocommerceCheckout_exports,{initInstallOverlayWoocommerceCheckout:()=>initInstallOverlayWoocommerceCheckout});async function initInstallOverlayWoocommerceCheckout(){customElements.get("pwa-install-overlay-woocommerce-checkout")||customElements.define("pwa-install-overlay-woocommerce-checkout",PwaInstallOverlayWoocommerceCheckout),PwaInstallOverlayWoocommerceCheckout.show(),setTimeout(()=>{PwaInstallOverlayWoocommerceCheckout.show()},1e3)}var PwaInstallOverlayWoocommerceCheckout,init_installOverlayWoocommerceCheckout=__esm({"frontend/assets/js/dev/modules/installOverlayWoocommerceCheckout.js"(){init_frontend(),init_installPrompt(),init_utils(),PwaInstallOverlayWoocommerceCheckout=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.styles=new Set}connectedCallback(){this.render(),this.handlePerformInstallation()}static findCheckoutForm(){const checkoutFormSelectors=["form.wc-block-checkout__form","form.woocommerce-checkout"];for(const selector of checkoutFormSelectors){const form=document.querySelector(selector);if(form)return form}return null}static show(){let overlay=document.querySelector("pwa-install-overlay-woocommerce-checkout");if(!overlay){const checkoutForm=this.findCheckoutForm();checkoutForm&&(overlay=document.createElement("pwa-install-overlay-woocommerce-checkout"),checkoutForm.parentNode.insertBefore(overlay,checkoutForm.nextSibling))}return overlay}injectStyles(css){this.styles.add(css)}handlePerformInstallation(){const installButton=this.shadowRoot.querySelector(".woocommerce-checkout-overlay-button_install");installButton?.addEventListener("click",()=>{performInstallation()})}render(){var _a,_b,_c,_d,_e,_f,_g,_h,_i,_j,_k,_l;const appName=(_a=config.jsVars.settings.webAppManifest.appIdentity.appName)!=null?_a:"",themeColor=(_d=(_c=(_b=config.jsVars.settings.webAppManifest)==null?void 0:_b.appearance)==null?void 0:_c.themeColor)!=null?_d:"#000000",textColor=getContrastTextColor(themeColor),title=(_g=(_f=(_e=config.jsVars.settings.installation)==null?void 0:_e.prompts)==null?void 0:_f.text)!=null?_g:wp.i18n.__("Install Web App",config.jsVars.slug),message=(_l=(_k=(_j=(_i=(_h=config.jsVars.settings.installation)==null?void 0:_h.prompts)==null?void 0:_i.types)==null?void 0:_j.woocommerceCheckout)==null?void 0:_k.message)!=null?_l:wp.i18n.__("Keep track of your orders. Our web app is fast, small and works offline.",config.jsVars.slug),appIconHtml=config.jsVars.iconUrl?`<img class="woocommerce-checkout-overlay-appinfo_icon" src="${config.jsVars.iconUrl}" alt="${appName}" onerror="this.style.display='none'"/>`:"";this.injectStyles(`
      .woocommerce-checkout-overlay {
        position: relative;
        border-radius: 0.5rem;
        padding: 1rem;
        margin-top: 2rem;
        background-color: ${themeColor};
        color: ${textColor};
        box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        -webkit-transition: all 0.2s ease-out;
        -o-transition: all 0.2s ease-out;
        transition: all 0.2s ease-out;
        overflow: hidden;
        text-transform: none;
      }

      .woocommerce-checkout-overlay-appinfo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex: 1;
      }

      .woocommerce-checkout-overlay-appinfo_icon {
        border-radius: 9999px;
        border: 1px solid #e5e7eb;
        flex-shrink: 0;
        height: 50px;
        width: 50px;
        display: inline-block;
      }

      .woocommerce-checkout-overlay-appinfo_texts {
        flex: 1;
        min-width: 0;
      }

      .woocommerce-checkout-overlay-appinfo_title {
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-weight: 500;
        color: ${textColor};
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }

      .woocommerce-checkout-overlay-appinfo_description {
        font-size: 0.75rem;
        line-height: 1rem;
        font-weight: 400;
        color: ${textColor}cc;
        margin-top: 0.12rem;
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }

      .woocommerce-checkout-overlay-button_install {
        display: block;
        background-color: ${textColor};
        color: ${themeColor};
        vertical-align: middle;
        text-decoration: none;
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-weight: 600;
        padding: 0.375rem 0.875rem;
        margin-left: auto;
        margin-top: 1rem;
        border: none;
        outline: none;
        border-radius: 9999px;
        cursor: pointer;
      }
    `);const combinedStyles=Array.from(this.styles).join(`
`);this.shadowRoot.innerHTML=`
      <style>${combinedStyles}</style>
      <div class="woocommerce-checkout-overlay">
        <div class="woocommerce-checkout-overlay-appinfo">
          ${appIconHtml}
          <div class="woocommerce-checkout-overlay-appinfo_texts">
            <div class="woocommerce-checkout-overlay-appinfo_title">${title}</div>
            <div class="woocommerce-checkout-overlay-appinfo_description">${message}</div>
          </div>
        </div>
        <button type="button" class="woocommerce-checkout-overlay-button_install">
          ${wp.i18n.__("Install Now",config.jsVars.slug)}
        </button>
      </div>
    `}}}}),pageLoader_exports={};__export(pageLoader_exports,{initPageLoader:()=>initPageLoader});async function initPageLoader(){customElements.get("pwa-page-loader")||customElements.define("pwa-page-loader",PwaPageLoader),PwaPageLoader.show()}var PwaPageLoader,init_pageLoader=__esm({"frontend/assets/js/dev/modules/pageLoader.js"(){init_frontend(),init_utils(),PwaPageLoader=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.styles=new Set,this.type=config.jsVars.settings.uiComponents.pageLoader.type,this.performanceData={startTime:performance.now(),estimatedDuration:2e3,loadHistory:[],current:0,target:90,isLoading:!1},this.updateProgress=this.updateProgress.bind(this),this.onResourceLoad=this.onResourceLoad.bind(this),this.resourcesTotal=0,this.resourcesLoaded=0}connectedCallback(){this.render(),this.initialShow(),this.setupNavigationHandlers()}injectStyles(css){this.styles.add(css)}static show(){let pageLoader=document.querySelector("pwa-page-loader");return pageLoader||(pageLoader=document.createElement("pwa-page-loader"),document.body.appendChild(pageLoader)),pageLoader}setupNavigationHandlers(){window.addEventListener("beforeunload",()=>{this.showPageLoaderBeforeUnload()}),document.readyState==="complete"?this.hidePageLoader():window.addEventListener("load",()=>{this.hidePageLoader()})}initialShow(){const pageLoader=this.shadowRoot.querySelector(".pageLoader");pageLoader&&(this.type==="skeleton"?this.showSkeletonPageLoader():(document.documentElement.style.paddingRight=`${window.innerWidth-document.documentElement.offsetWidth}px`,document.documentElement.style.overflow="hidden",pageLoader.classList.add("visible"),pageLoader.classList.add("no-transition"),requestAnimationFrame(()=>{pageLoader.classList.remove("no-transition")}),this.type==="percent"&&this.startProgressTracking()))}showPageLoaderBeforeUnload(){const pageLoader=this.shadowRoot.querySelector(".pageLoader");pageLoader&&(this.type==="percent"&&this.resetProgress(),requestAnimationFrame(()=>{document.documentElement.style.paddingRight=`${window.innerWidth-document.documentElement.offsetWidth}px`,document.documentElement.style.overflow="hidden",pageLoader.classList.add("visible")}))}hidePageLoader(){const pageLoader=this.shadowRoot.querySelector(".pageLoader");pageLoader&&(this.type==="skeleton"?this.removeSkeletonPageLoader():this.type==="percent"?(this.performanceData.isLoading=!1,this.updateProgress(100),setTimeout(()=>this.fadeOutPageLoader(pageLoader),200)):this.fadeOutPageLoader(pageLoader))}fadeOutPageLoader(pageLoader){pageLoader.offsetHeight,pageLoader.style.display="flex";const handleTransitionEnd=()=>{document.documentElement.style.removeProperty("overflow"),document.documentElement.style.paddingRight="",pageLoader.style.display="none",pageLoader.removeEventListener("transitionend",handleTransitionEnd)};pageLoader.addEventListener("transitionend",handleTransitionEnd),requestAnimationFrame(()=>{pageLoader.classList.remove("visible")})}startProgressTracking(){if(this.performanceData.isLoading)return;this.performanceData.isLoading=!0,this.performanceData.startTime=performance.now(),this.resourcesTotal=0,this.resourcesLoaded=0,this.startResourceTracking();let lastUpdate=performance.now();const animate=()=>{if(!this.performanceData.isLoading)return;const now=performance.now(),delta=now-lastUpdate;lastUpdate=now;const progress=this.calculateProgress();this.updateProgress(progress),progress<100&&requestAnimationFrame(animate)};requestAnimationFrame(animate)}resetProgress(){if(this.type!=="percent")return;const progressBar=this.shadowRoot.querySelector(".pageLoader_progress-fill"),counter=this.shadowRoot.querySelector(".pageLoader_counter");progressBar&&counter&&(progressBar.style.transition="none",progressBar.style.width="0%",counter.textContent="0%",progressBar.offsetHeight,progressBar.style.transition="width 0.05s ease-out")}startResourceTracking(){const resources=performance.getEntriesByType("resource");this.resourcesTotal=resources.length,new PerformanceObserver(list=>{for(const entry of list.getEntries())entry.entryType==="resource"&&(this.resourcesTotal++,this.onResourceLoad())}).observe({entryTypes:["resource"]}),document.readyState==="loading"&&document.addEventListener("DOMContentLoaded",()=>{this.resourcesLoaded=this.resourcesTotal,this.updateEstimatedDuration()})}onResourceLoad(){this.resourcesLoaded++,this.updateEstimatedDuration()}updateEstimatedDuration(){const elapsed=performance.now()-this.performanceData.startTime;this.performanceData.loadHistory.push(elapsed),this.performanceData.loadHistory.length>5&&this.performanceData.loadHistory.shift();const avgLoadTime=this.performanceData.loadHistory.reduce((a,b)=>a+b,0)/this.performanceData.loadHistory.length;this.performanceData.estimatedDuration=Math.max(avgLoadTime,2e3)}calculateProgress(){const elapsed=performance.now()-this.performanceData.startTime,resourceProgress=this.resourcesTotal?this.resourcesLoaded/this.resourcesTotal*100:0,timeProgress=Math.min(100,elapsed/this.performanceData.estimatedDuration*this.performanceData.target),progress=Math.max(timeProgress,resourceProgress);return Math.min(progress,this.performanceData.target)}updateProgress(progress){if(this.type!=="percent")return;const progressBar=this.shadowRoot.querySelector(".pageLoader_progress-fill"),counter=this.shadowRoot.querySelector(".pageLoader_counter");progressBar&&counter&&(progressBar.style.width=`${progress}%`,counter.textContent=`${Math.round(progress)}%`)}showSkeletonPageLoader(){document.documentElement.classList.add("skeleton");const styleSheet=document.createElement("style");styleSheet.textContent=`
      :root.skeleton:-webkit-input-placeholder {
          pointer-events: none!important;
          border: none!important;
          -webkit-box-shadow: none!important;
                  box-shadow: none!important;
          text-decoration: none!important;
          color: transparent!important;
          background-color: #e6e9ef!important;
          background-image: -webkit-gradient(linear, left top, right top, from(rgba(255, 255, 255, 0)), color-stop(rgba(255, 255, 255, 0.6)), to(rgba(255, 255, 255, 0)));
          background-image: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0));
          background-size: 500px 100%!important;
          background-repeat: no-repeat!important;
          border-radius: 4px!important;
          -webkit-animation: skeletonLoad 1s ease-in-out infinite!important;
          animation: skeletonLoad 1s ease-in-out infinite!important;
      }

      :root.skeleton::-moz-placeholder {
          pointer-events: none!important;
          border: none!important;
          box-shadow: none!important;
          text-decoration: none!important;
          color: transparent!important;
          background-color: #e6e9ef!important;
          background-image: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0));
          background-size: 500px 100%!important;
          background-repeat: no-repeat!important;
          border-radius: 4px!important;
          -webkit-animation: skeletonLoad 1s ease-in-out infinite!important;
          animation: skeletonLoad 1s ease-in-out infinite!important;
      }

      :root.skeleton:-ms-input-placeholder {
          pointer-events: none!important;
          border: none!important;
          box-shadow: none!important;
          text-decoration: none!important;
          color: transparent!important;
          background-color: #e6e9ef!important;
          background-image: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0));
          background-size: 500px 100%!important;
          background-repeat: no-repeat!important;
          border-radius: 4px!important;
          -webkit-animation: skeletonLoad 1s ease-in-out infinite!important;
          animation: skeletonLoad 1s ease-in-out infinite!important;
      }

      :root.skeleton::-ms-input-placeholder {
          pointer-events: none!important;
          border: none!important;
          box-shadow: none!important;
          text-decoration: none!important;
          color: transparent!important;
          background-color: #e6e9ef!important;
          background-image: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0));
          background-size: 500px 100%!important;
          background-repeat: no-repeat!important;
          border-radius: 4px!important;
          -webkit-animation: skeletonLoad 1s ease-in-out infinite!important;
          animation: skeletonLoad 1s ease-in-out infinite!important;
      }

      :root.skeleton *:not(script):not(style):not(link):not(meta):not(pwa-page-loader),
      :root.skeleton::placeholder,
      :root.skeleton::before,
      :root.skeleton::after {
          pointer-events: none!important;
          border: none!important;
          -webkit-box-shadow: none!important;
                  box-shadow: none!important;
          text-decoration: none!important;
          color: transparent!important;
          background-color: #e6e9ef!important;
          background-image: -webkit-gradient(linear, left top, right top, from(rgba(255, 255, 255, 0)), color-stop(rgba(255, 255, 255, 0.6)), to(rgba(255, 255, 255, 0)));
          background-image: -o-linear-gradient(left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0));
          background-image: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0));
          background-size: 500px 100%!important;
          background-repeat: no-repeat!important;
          border-radius: 4px!important;
          -webkit-animation: skeletonLoad 1s ease-in-out infinite!important;
          animation: skeletonLoad 1s ease-in-out infinite!important;
      }

      @-webkit-keyframes skeletonLoad {
        from {
          background-position: -500px 0;
        }
        to {
          background-position: calc(500px + 100%) 0;
        }
      }

      @keyframes skeletonLoad {
        from {
          background-position: -500px 0;
        }
        to {
          background-position: calc(500px + 100%) 0;
        }
      }
    `,document.head.appendChild(styleSheet),this.skeletonStyleSheet=styleSheet,document.querySelectorAll("*:not(script):not(style):not(link):not(meta):not(pwa-page-loader)").forEach(element=>{if(element.matches("img, video, iframe")){const wrapper=document.createElement("div");wrapper.className="skeleton-media",wrapper.style.width=`${element.offsetWidth||element.getAttribute("width")||300}px`,wrapper.style.height=`${element.offsetHeight||element.getAttribute("height")||200}px`,element.parentNode.insertBefore(wrapper,element),wrapper.appendChild(element)}})}removeSkeletonPageLoader(){document.documentElement.classList.remove("skeleton"),this.skeletonStyleSheet&&this.skeletonStyleSheet.remove(),document.querySelectorAll(".skeleton-media").forEach(wrapper=>{const element=wrapper.firstElementChild;wrapper.parentNode.insertBefore(element,wrapper),wrapper.remove()})}renderDefaultPageLoader(){var _a,_b,_c,_d;const backgroundColor=(_c=(_b=(_a=config.jsVars.settings.webAppManifest)==null?void 0:_a.appearance)==null?void 0:_b.backgroundColor)!=null?_c:"#ffffff",appIcon=(_d=config.jsVars.iconUrl)!=null?_d:"";return this.injectStyles(`
      .pageLoader.-default {
        background-color: ${backgroundColor};
      }

      .pageLoader_icon {
          width: 150px;
          height: 150px;
          background: url(${appIcon}) no-repeat center;
          background-size: contain;
          -webkit-animation: bounce .4s infinite alternate;
                  animation: bounce .4s infinite alternate;
      }

      @-webkit-keyframes bounce {
          to { 
              -webkit-transform: scale(1.07); 
                      transform: scale(1.07); 
          }
      }

      @keyframes bounce {
          to { 
              -webkit-transform: scale(1.07); 
                      transform: scale(1.07); 
          }
      }
    `),`
      <div class="pageLoader -default">
				<div class="pageLoader_icon"></div>
			</div>
    `}renderSkeletonPageLoader(){var _a,_b,_c;const backgroundColor=(_c=(_b=(_a=config.jsVars.settings.webAppManifest)==null?void 0:_a.appearance)==null?void 0:_b.backgroundColor)!=null?_c:"#ffffff";return this.injectStyles(`
      .pageLoader.-skeleton {
        background-color: ${backgroundColor};
      }
    `),`
      <div class="pageLoader -skeleton" style="background-color: ${backgroundColor}"></div>
    `}renderSpinnerPageLoader(){var _a,_b,_c;const backgroundColor=(_c=(_b=(_a=config.jsVars.settings.webAppManifest)==null?void 0:_a.appearance)==null?void 0:_b.backgroundColor)!=null?_c:"#ffffff",spinnerColor=getContrastTextColor(backgroundColor);return this.injectStyles(`
      .pageLoader.-spinner {
        background-color: ${backgroundColor};
      }
  
      .pageLoader_svg {
        -webkit-animation: rotate 2s linear infinite;
                animation: rotate 2s linear infinite;
        z-index: 2;
        position: absolute;
        width: 70px;
        height: 70px;
      }
  
      .pageLoader_svg circle {
        stroke: ${spinnerColor};
        stroke-linecap: round;
        -webkit-animation: dash 1.5s ease-in-out infinite;
                animation: dash 1.5s ease-in-out infinite;
      }

      @-webkit-keyframes rotate {
        100% {
          transform: rotate(360deg);
        }
      }

      @keyframes rotate {
        100% {
          transform: rotate(360deg);
        }
      }

      @-webkit-keyframes dash {
        0% {
          stroke-dasharray: 1, 150;
          stroke-dashoffset: 0;
        }
        50% {
          stroke-dasharray: 90, 150;
          stroke-dashoffset: -35;
        }
        100% {
          stroke-dasharray: 90, 150;
          stroke-dashoffset: -124;
        }
      }

      @keyframes dash {
        0% {
          stroke-dasharray: 1, 150;
          stroke-dashoffset: 0;
        }
        50% {
          stroke-dasharray: 90, 150;
          stroke-dashoffset: -35;
        }
        100% {
          stroke-dasharray: 90, 150;
          stroke-dashoffset: -124;
        }
      }
    `),`
      <div class="pageLoader -spinner">
        <svg class="pageLoader_svg" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
        </svg>
      </div>
    `}renderRedirectPageLoader(){return this.injectStyles(`
      .pageLoader.-redirect {
        background-color: #f1c40f;
      }
  
      .pageLoader_body {
        position: absolute;
        top: 50%;
        margin-left: -50px;
        left: 50%;
        -webkit-animation: speeder .4s linear infinite;
                animation: speeder .4s linear infinite;
      }

      .pageLoader_body > span {
        height: 5px;
        width: 35px;
        background: #000;
        position: absolute;
        top: -19px;
        left: 60px;
        border-radius: 2px 10px 1px 0;
      }

      .pageLoader_base span {
        position: absolute;
        width: 0;
        height: 0;
        border-top: 6px solid transparent;
        border-right: 100px solid #000;
        border-bottom: 6px solid transparent;
      }

      .pageLoader_base span::before {
        content: "";
        height: 22px;
        width: 22px;
        border-radius: 50%;
        background: #000;
        position: absolute;
        right: -110px;
        top: -16px;
      }

      .pageLoader_base span::after {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        border-top: 0 solid transparent;
        border-right: 55px solid #000;
        border-bottom: 16px solid transparent;
        top: -16px;
        right: -98px;
      }

      .pageLoader_face {
        position: absolute;
        height: 12px;
        width: 20px;
        background: #000;
        border-radius: 20px 20px 0 0;
        -webkit-transform: rotate(-40deg);
            -ms-transform: rotate(-40deg);
                transform: rotate(-40deg);
        right: -125px;
        top: -15px;
      }

      .pageLoader_face::after {
        content: "";
        height: 12px;
        width: 12px;
        background: #000;
        right: 4px;
        top: 7px;
        position: absolute;
        -webkit-transform: rotate(40deg);
            -ms-transform: rotate(40deg);
                transform: rotate(40deg);
        -webkit-transform-origin: 50% 50%;
            -ms-transform-origin: 50% 50%;
                transform-origin: 50% 50%;
        border-radius: 0 0 0 2px;
      }

      .pageLoader_body > span > span:nth-child(1),
      .pageLoader_body > span > span:nth-child(2),
      .pageLoader_body > span > span:nth-child(3),
      .pageLoader_body > span > span:nth-child(4) {
        width: 30px;
        height: 1px;
        background: #000;
        position: absolute;
        -webkit-animation: fazer1 .2s linear infinite;
                animation: fazer1 .2s linear infinite;
      }

      .pageLoader_body > span > span:nth-child(2) {
        top: 3px;
        -webkit-animation: fazer2 .4s linear infinite;
                animation: fazer2 .4s linear infinite;
      }

      .pageLoader_body > span > span:nth-child(3) {
        top: 1px;
        -webkit-animation: fazer3 .4s linear infinite;
                animation: fazer3 .4s linear infinite;
        -webkit-animation-delay: -1s;
                animation-delay: -1s;
      }

      .pageLoader_body > span > span:nth-child(4) {
        top: 4px;
        -webkit-animation: fazer4 1s linear infinite;
                animation: fazer4 1s linear infinite;
        -webkit-animation-delay: -1s;
                animation-delay: -1s;
      }

      .pageLoader_fazers {
        position: absolute;
        width: 100%;
        height: 100%;
      }

      .pageLoader_fazers span {
        position: absolute;
        height: 2px;
        width: 20%;
        background: #000;
      }

      .pageLoader_fazers span:nth-child(1) {
        top: 20%;
        -webkit-animation: fazers1 .6s linear infinite;
                animation: fazers1 .6s linear infinite;
        -webkit-animation-delay: -5s;
                animation-delay: -5s;
      }

      .pageLoader_fazers span:nth-child(2) {
        top: 40%;
        -webkit-animation: fazers2 .8s linear infinite;
                animation: fazers2 .8s linear infinite;
        -webkit-animation-delay: -1s;
                animation-delay: -1s;
      }

      .pageLoader_fazers span:nth-child(3) {
        top: 60%;
        -webkit-animation: fazers3 .6s linear infinite;
                animation: fazers3 .6s linear infinite;
      }

      .pageLoader_fazers span:nth-child(4) {
        top: 80%;
        -webkit-animation: fazers4 .5s linear infinite;
                animation: fazers4 .5s linear infinite;
        -webkit-animation-delay: -3s;
                animation-delay: -3s;
      }
  
      @-webkit-keyframes fazers1 {
        0% {
          left: 200%;
        }
        100% {
          left: -200%;
          opacity: 0;
        }
      }

      @keyframes fazers1 {
        0% {
          left: 200%;
        }
        100% {
          left: -200%;
          opacity: 0;
        }
      }

      @-webkit-keyframes fazers2 {
        0% {
          left: 200%;
        }
        100% {
          left: -200%;
          opacity: 0;
        }
      }

      @keyframes fazers2 {
        0% {
          left: 200%;
        }
        100% {
          left: -200%;
          opacity: 0;
        }
      }

      @-webkit-keyframes fazers3 {
        0% {
          left: 200%;
        }
        100% {
          left: -100%;
          opacity: 0;
        }
      }

      @keyframes fazers3 {
        0% {
          left: 200%;
        }
        100% {
          left: -100%;
          opacity: 0;
        }
      }

      @-webkit-keyframes fazers4 {
        0% {
          left: 200%;
        }
        100% {
          left: -100%;
          opacity: 0;
        }
      }

      @keyframes fazers4 {
        0% {
          left: 200%;
        }
        100% {
          left: -100%;
          opacity: 0;
        }
      }

      @-webkit-keyframes fazer1 {
        0% {
          left: 0;
        }
        100% {
          left: -80px;
          opacity: 0;
        }
      }

      @keyframes fazer1 {
        0% {
          left: 0;
        }
        100% {
          left: -80px;
          opacity: 0;
        }
      }

      @-webkit-keyframes fazer2 {
        0% {
          left: 0;
        }
        100% {
          left: -100px;
          opacity: 0;
        }
      }

      @keyframes fazer2 {
        0% {
          left: 0;
        }
        100% {
          left: -100px;
          opacity: 0;
        }
      }

      @-webkit-keyframes fazer3 {
        0% {
          left: 0;
        }
        100% {
          left: -50px;
          opacity: 0;
        }
      }

      @keyframes fazer3 {
        0% {
          left: 0;
        }
        100% {
          left: -50px;
          opacity: 0;
        }
      }

      @-webkit-keyframes fazer4 {
        0% {
          left: 0;
        }
        100% {
          left: -150px;
          opacity: 0;
        }
      }

      @keyframes fazer4 {
        0% {
          left: 0;
        }
        100% {
          left: -150px;
          opacity: 0;
        }
      }

      @-webkit-keyframes speeder {
        0% {
          -webkit-transform: translate(2px, 1px) rotate(0deg);
                  transform: translate(2px, 1px) rotate(0deg);
        }
        10% {
          -webkit-transform: translate(-1px, -3px) rotate(-1deg);
                  transform: translate(-1px, -3px) rotate(-1deg);
        }
        20% {
          -webkit-transform: translate(-2px, 0px) rotate(1deg);
                  transform: translate(-2px, 0px) rotate(1deg);
        }
        30% {
          -webkit-transform: translate(1px, 2px) rotate(0deg);
                  transform: translate(1px, 2px) rotate(0deg);
        }
        40% {
          -webkit-transform: translate(1px, -1px) rotate(1deg);
                  transform: translate(1px, -1px) rotate(1deg);
        }
        50% {
          -webkit-transform: translate(-1px, 3px) rotate(-1deg);
                  transform: translate(-1px, 3px) rotate(-1deg);
        }
        60% {
          -webkit-transform: translate(-1px, 1px) rotate(0deg);
                  transform: translate(-1px, 1px) rotate(0deg);
        }
        70% {
          -webkit-transform: translate(3px, 1px) rotate(-1deg);
                  transform: translate(3px, 1px) rotate(-1deg);
        }
        80% {
          -webkit-transform: translate(-2px, -1px) rotate(1deg);
                  transform: translate(-2px, -1px) rotate(1deg);
        }
        90% {
          -webkit-transform: translate(2px, 1px) rotate(0deg);
                  transform: translate(2px, 1px) rotate(0deg);
        }
        100% {
          -webkit-transform: translate(1px, -2px) rotate(-1deg);
                  transform: translate(1px, -2px) rotate(-1deg);
        }
      }

      @keyframes speeder {
        0% {
          -webkit-transform: translate(2px, 1px) rotate(0deg);
                  transform: translate(2px, 1px) rotate(0deg);
        }
        10% {
          -webkit-transform: translate(-1px, -3px) rotate(-1deg);
                  transform: translate(-1px, -3px) rotate(-1deg);
        }
        20% {
          -webkit-transform: translate(-2px, 0px) rotate(1deg);
                  transform: translate(-2px, 0px) rotate(1deg);
        }
        30% {
          -webkit-transform: translate(1px, 2px) rotate(0deg);
                  transform: translate(1px, 2px) rotate(0deg);
        }
        40% {
          -webkit-transform: translate(1px, -1px) rotate(1deg);
                  transform: translate(1px, -1px) rotate(1deg);
        }
        50% {
          -webkit-transform: translate(-1px, 3px) rotate(-1deg);
                  transform: translate(-1px, 3px) rotate(-1deg);
        }
        60% {
          -webkit-transform: translate(-1px, 1px) rotate(0deg);
                  transform: translate(-1px, 1px) rotate(0deg);
        }
        70% {
          -webkit-transform: translate(3px, 1px) rotate(-1deg);
                  transform: translate(3px, 1px) rotate(-1deg);
        }
        80% {
          -webkit-transform: translate(-2px, -1px) rotate(1deg);
                  transform: translate(-2px, -1px) rotate(1deg);
        }
        90% {
          -webkit-transform: translate(2px, 1px) rotate(0deg);
                  transform: translate(2px, 1px) rotate(0deg);
        }
        100% {
          -webkit-transform: translate(1px, -2px) rotate(-1deg);
                  transform: translate(1px, -2px) rotate(-1deg);
        }
      }
    `),`
      <div class="pageLoader -redirect">
        <div class="pageLoader_body">
          <span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </span>
          <div class="pageLoader_base">
            <span></span>
            <div class="pageLoader_face"></div>
          </div>
        </div>
        <div class="pageLoader_fazers">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `}renderPercentPageLoader(){var _a,_b,_c;const backgroundColor=(_c=(_b=(_a=config.jsVars.settings.webAppManifest)==null?void 0:_a.appearance)==null?void 0:_b.backgroundColor)!=null?_c:"#ffffff",percentColor=getContrastTextColor(backgroundColor);return this.injectStyles(`
      .pageLoader.-percent {
        background-color: ${backgroundColor};
        flex-direction: column;
      }
  
      .pageLoader_counter {
        font-size: 38px;
        color: ${percentColor};
        margin-bottom: 20px;
      }
  
      .pageLoader_progress {
        width: 400px;
        max-width: 85vw;
        height: 4px;
        position: relative;
        border-radius: 4px;
        background: ${percentColor}80;
        overflow: hidden;
      }
  
      .pageLoader_progress-fill {
        display: block;
        width: 0;
        height: 100%;
        background: ${percentColor};
        transition: width 0.05s ease-out;
      }
    `),`
      <div class="pageLoader -percent">
        <span class="pageLoader_counter">0%</span>
        <div class="pageLoader_progress">
          <span class="pageLoader_progress-fill"></span>
        </div>
      </div>
    `}renderFadePageLoader(){var _a,_b,_c;const backgroundColor=(_c=(_b=(_a=config.jsVars.settings.webAppManifest)==null?void 0:_a.appearance)==null?void 0:_b.backgroundColor)!=null?_c:"#ffffff";return this.injectStyles(`
      .pageLoader.-fade {
        background-color: ${backgroundColor};
      }
    `),'<div class="pageLoader -fade"></div>'}render(){this.injectStyles(`
      .pageLoader {
        display: none;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
        z-index: 9999999999999999;
        transition: opacity 0.3s ease-out;
      }

      .pageLoader.no-transition {
        transition: none !important;
      }

      .pageLoader.visible {
        opacity: 1;
        visibility: visible;
        display: flex !important;
      }
    `);let pageLoaderContent;switch(this.type){case"default":pageLoaderContent=this.renderDefaultPageLoader();break;case"skeleton":pageLoaderContent=this.renderSkeletonPageLoader();break;case"spinner":pageLoaderContent=this.renderSpinnerPageLoader();break;case"redirect":pageLoaderContent=this.renderRedirectPageLoader();break;case"percent":pageLoaderContent=this.renderPercentPageLoader();break;case"fade":pageLoaderContent=this.renderFadePageLoader();break;default:break}const combinedStyles=Array.from(this.styles).join(`
`);this.shadowRoot.innerHTML=`
      <style>
        ${combinedStyles}
      </style>
      ${pageLoaderContent}
    `}}}}),orientationLock_exports={};__export(orientationLock_exports,{initOrientationLock:()=>initOrientationLock});function applyCssOrientationLock(targetOrientation){const existingStyle=document.getElementById("orientation-lock-style");if(existingStyle&&existingStyle.remove(),targetOrientation==="portrait"||targetOrientation==="landscape"){const oppositeOrientation=targetOrientation==="portrait"?"landscape":"portrait",style=document.createElement("style");style.id="orientation-lock-style",targetOrientation==="portrait"?style.textContent=`
        @media screen and (min-width: 320px) and (max-width: 767px) and (orientation: ${oppositeOrientation}) {
          html {
            transform: rotate(-90deg);
            transform-origin: left top;
            width: 100vh;
            overflow-x: hidden;
            position: absolute;
            top: 100%;
            left: 0;
          }
        }
      `:style.textContent=`
        @media screen and (min-width: 320px) and (max-width: 767px) and (orientation: ${oppositeOrientation}) {
          html {
            transform: rotate(90deg);
            transform-origin: right top;
            width: 100vh;
            overflow-x: hidden;
            position: absolute;
            top: 0;
            right: 0;
          }
        }
      `,document.head.appendChild(style)}}async function initOrientationLock(){const orientation=config.jsVars.settings.webAppManifest.displaySettings.orientation;if(orientation!=="any")try{window.screen&&window.screen.orientation&&window.screen.orientation.lock?await window.screen.orientation.lock(orientation):applyCssOrientationLock(orientation)}catch(error){console.warn("Orientation lock failed:",error.message),applyCssOrientationLock(orientation)}}var init_orientationLock=__esm({"frontend/assets/js/dev/modules/orientationLock.js"(){init_frontend()}}),toastMessages_exports={};__export(toastMessages_exports,{initToastMessages:()=>initToastMessages});async function initToastMessages(){customElements.get("pwa-toast-messages")||customElements.define("pwa-toast-messages",PwaToastMessages),PwaToastMessages.show()}var PwaToastMessages,init_toastMessages=__esm({"frontend/assets/js/dev/modules/toastMessages.js"(){init_frontend(),init_utils(),PwaToastMessages=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.styles=new Set}connectedCallback(){this.render()}injectStyles(css){this.styles.add(css)}static show(){let toastMessages=document.querySelector("pwa-toast-messages");return toastMessages||(toastMessages=document.createElement("pwa-toast-messages"),document.body.appendChild(toastMessages)),requestAnimationFrame(()=>{const toastMessage=toastMessages.shadowRoot.querySelector(".toast-message");setTimeout(()=>{toastMessage.classList.add("visible")},300),setTimeout(()=>{toastMessage.classList.remove("visible"),toastMessage.addEventListener("transitionend",()=>{toastMessages.remove()},{once:!0})},2800)}),toastMessages}render(){var _a,_b,_c;const themeColor=(_c=(_b=(_a=config.jsVars.settings.webAppManifest)==null?void 0:_a.appearance)==null?void 0:_b.themeColor)!=null?_c:"#000000",backgroundColor=getContrastTextColor(themeColor),textColor=getContrastTextColor(backgroundColor);this.injectStyles(`
      .toast-message {
        position: fixed;
        bottom: 0;
        left: 50%;
        -webkit-transform: translateX(-50%) translateY(100%);
            -ms-transform: translateX(-50%) translateY(100%);
                transform: translateX(-50%) translateY(100%);
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        padding: 0.75rem 1rem;
        gap: 0.75rem;
        width: auto;
        max-width: 85%;
        background-color: ${backgroundColor};
        color: ${textColor};
        border: 1px solid ${textColor}15;
        border-radius: 0.75rem;
        -webkit-box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
                box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        z-index: 99999999999999999999999999;
        -webkit-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        -o-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0;
      }

      .toast-message.visible {
        opacity: 1;
        -webkit-transform: translateX(-50%) translateY(-1rem);
            -ms-transform: translateX(-50%) translateY(-1rem);
                transform: translateX(-50%) translateY(-1rem);
      }

      .toast-message_text {
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-weight: 500;
      }
    `);let message;switch(!0){case config.jsVars.pageData.type.isHome:message=wp.i18n.__("Homepage Opened",config.jsVars.slug);break;case config.jsVars.pageData.type.is404:message=wp.i18n.__("Page Not Found",config.jsVars.slug);break;case config.jsVars.pageData.type.isSearch:message=wp.i18n.__("Search Results",config.jsVars.slug);break;case config.jsVars.pageData.type.isBlogPost:message=wp.i18n.__("Article Opened",config.jsVars.slug);break;case config.jsVars.pageData.type.isWooShop:message=wp.i18n.__("Shop Opened",config.jsVars.slug);break;case config.jsVars.pageData.type.isWooProduct:message=wp.i18n.__("Product Opened",config.jsVars.slug);break;default:message=wp.i18n.__("Page Opened",config.jsVars.slug);break}const combinedStyles=Array.from(this.styles).join(`
`);this.shadowRoot.innerHTML=`
      <style>${combinedStyles}</style>
      <div class="toast-message" role="alert" tabindex="-1">
        <span class="toast-message_text">
          ${message}
        </span>
      </div>
    `}}}}),navigationTabBar_exports={};__export(navigationTabBar_exports,{initNavigationTabBar:()=>initNavigationTabBar});async function initNavigationTabBar(){customElements.get("pwa-navigation-tab-bar")||customElements.define("pwa-navigation-tab-bar",PwaNavigationTabBar),PwaNavigationTabBar.show()}var PwaNavigationTabBar,init_navigationTabBar=__esm({"frontend/assets/js/dev/modules/navigationTabBar.js"(){init_frontend(),init_utils(),PwaNavigationTabBar=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.styles=new Set}connectedCallback(){this.render()}static show(){let navigationTabBar=document.querySelector("pwa-navigation-tab-bar");return navigationTabBar||(navigationTabBar=document.createElement("pwa-navigation-tab-bar"),document.body.appendChild(navigationTabBar)),navigationTabBar}injectStyles(css){this.styles.add(css)}async renderTabBarItems(){const navigationItems=config.jsVars.settings.uiComponents.navigationTabBar.navigationItems||[],currentUrl=new URL(window.location.href),cleanCurrentUrl=currentUrl.origin+currentUrl.pathname;return(await Promise.all(navigationItems.map(async item=>{const{icon,label,page}=item;let svgContent="";try{svgContent=await(await fetch(icon)).text()}catch(e){console.error(`Failed to load SVG from ${icon}`,e)}return`
          <li class="navigation-tab-bar_item ${cleanCurrentUrl===page?"-active":""}">
            <a class="navigation-tab-bar_link" href="${page}">
              <span class="navigation-tab-bar_icon">
                ${svgContent}
              </span>
              <span class="navigation-tab-bar_label">${label}</span>
            </a>
          </li>
        `}))).join("")}async render(){var _a,_b,_c;const themeColor=(_c=(_b=(_a=config.jsVars.settings.webAppManifest)==null?void 0:_a.appearance)==null?void 0:_b.themeColor)!=null?_c:"#000000",backgroundColor=getContrastTextColor(themeColor),textColor=getContrastTextColor(backgroundColor),borderColor=backgroundColor==="#ffffff"?"#e5e7eb":"#404040";parseInt(getComputedStyle(document.body).paddingBottom)<57&&(document.body.style.paddingBottom="57px"),this.injectStyles(`
      .navigation-tab-bar {
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0;
        padding: 0;
        padding-bottom: env(safe-area-inset-bottom);
        transition: padding-bottom 250ms cubic-bezier(0.42, 0, 0.58, 1);
        touch-action: none;
        user-select: none;
        width: 100%;
        z-index: 999999999;
        height: 3.5rem;
        background-color: ${backgroundColor};
        border-top: 1px solid ${borderColor};
      }

      .navigation-tab-bar_list {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-around;
        list-style: none;
        width: 95%;
        height: 100%;
        margin: 0;
        padding: 0;
      }

      .navigation-tab-bar_item {
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        flex: 1 1 0;
        width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .navigation-tab-bar_link {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0.5rem;
        text-decoration: none;
        transition: all 0.2s ease;
      }

      .navigation-tab-bar_icon {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.125rem;
      }

      .navigation-tab-bar_icon svg {
        width: 1.25rem;
        height: 1.25rem;
        color: ${textColor}99;
      }

      .navigation-tab-bar_label {
        display: block;
        font-size: 0.75rem;
        line-height: 1rem;
        font-weight: 500;
        text-align: center;
        color: ${textColor}99;
      }

      .navigation-tab-bar_item.-active .navigation-tab-bar_icon svg {
        color: ${themeColor};
        stroke-width: 2.25;
      }

      .navigation-tab-bar_item.-active .navigation-tab-bar_label {
        font-weight: 700;
        color: ${themeColor};
      }
    `);const combinedStyles=Array.from(this.styles).join(`
`),itemsHtml=await this.renderTabBarItems();this.shadowRoot.innerHTML=`
      <style>${combinedStyles}</style>
      <nav class="navigation-tab-bar">
        <ul class="navigation-tab-bar_list">
          ${itemsHtml}
        </ul>
      </nav>
    `}}}}),scrollProgressBar_exports={};__export(scrollProgressBar_exports,{initScrollProgressBar:()=>initScrollProgressBar});async function initScrollProgressBar(){customElements.get("pwa-scroll-progress-bar")||customElements.define("pwa-scroll-progress-bar",PwaScrollProgressBar),PwaScrollProgressBar.show()}var PwaScrollProgressBar,init_scrollProgressBar=__esm({"frontend/assets/js/dev/modules/scrollProgressBar.js"(){init_frontend(),PwaScrollProgressBar=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.styles=new Set}connectedCallback(){this.render(),this.handleScrollProgress()}static show(){let scrollProgressBar=document.querySelector("pwa-scroll-progress-bar");return scrollProgressBar||(scrollProgressBar=document.createElement("pwa-scroll-progress-bar"),document.body.appendChild(scrollProgressBar)),scrollProgressBar}injectStyles(css){this.styles.add(css)}handleScrollProgress(){const progressBarFill=this.shadowRoot.querySelector(".scroll-progress-bar_fill");let ticking=!1;const updateProgress=()=>{const pixelsFromTop=window.scrollY||window.pageYOffset,pageHeight=document.documentElement.scrollHeight-window.innerHeight,progress=pixelsFromTop/pageHeight*100;progressBarFill.style.width=`${progress}%`,ticking=!1};document.addEventListener("scroll",()=>{ticking||(window.requestAnimationFrame(()=>{updateProgress()}),ticking=!0)}),updateProgress()}render(){var _a,_b,_c;const themeColor=(_c=(_b=(_a=config.jsVars.settings.webAppManifest)==null?void 0:_a.appearance)==null?void 0:_b.themeColor)!=null?_c:"#000000";this.injectStyles(`
      .scroll-progress-bar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 0.25rem;
          background-color: #ccc;
          z-index: 999999999;
          padding-top: env(safe-area-inset-top);
      }

      .scroll-progress-bar_fill {
          width: 100%;
          height: 100%;
          background-color: ${themeColor};
          transition: width 0.01s ease-out;
      }
    `);const combinedStyles=Array.from(this.styles).join(`
`);this.shadowRoot.innerHTML=`
      <style>${combinedStyles}</style>
      <div class="scroll-progress-bar">
        <div class="scroll-progress-bar_fill"></div>
      </div>
    `}}}}),darkMode_exports={};__export(darkMode_exports,{initDarkMode:()=>initDarkMode});async function initDarkMode(){customElements.get("pwa-dark-mode")||customElements.define("pwa-dark-mode",PwaDarkMode),PwaDarkMode.show(),setTimeout(()=>{PwaDarkMode.show()},1e3)}var PwaDarkMode,init_darkMode=__esm({"frontend/assets/js/dev/modules/darkMode.js"(){init_frontend(),PwaDarkMode=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.styles=new Set,this.darkMode=localStorage.getItem("darkMode")==="enabled",this.switchType=config.jsVars.settings.uiComponents.darkMode.type,this.icons={light:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',dark:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>'},this.darkColorScheme={background:"#1c1c1c",surface:"#2d2d2d",surfaceLighter:"#404040",text:"#ffffff",textSecondary:"#e0e0e0",border:"#404040",link:"#66b3ff",linkVisited:"#b366ff",input:"#2d2d2d"}}connectedCallback(){this.injectGlobalStyles(),this.render(),this.handleModeChange(),this.checkSystemPreference(),this.checkBatteryLevel()}injectStyles(css){this.styles.add(css)}injectGlobalStyles(){const styleSheet=document.createElement("style");styleSheet.textContent=`
      /* Dark mode CSS variables */
      :root.dark {
        ${Object.entries(this.darkColorScheme).map(([key,value])=>`--dm-${key}: ${value};`).join(`
`)}
      }

      :root.dark * {
        background-color: var(--dm-background) !important;
        color: var(--dm-text) !important;
      }

      /* Element specific styles */
      :root.dark img:not([src*=".svg"]),
      :root.dark video,
      :root.dark iframe {
        opacity: 0.8 !important;
        -webkit-filter: brightness(0.9) !important;
                filter: brightness(0.9) !important;
      }

      :root.dark img[src*=".svg"] {
        -webkit-filter: brightness(0.9) invert(1) !important;
                filter: brightness(0.9) invert(1) !important;
      }

      :root.dark input,
      :root.dark textarea,
      :root.dark select {
        background-color: var(--dm-input) !important;
        color: var(--dm-text) !important;
        border-color: var(--dm-border) !important;
      }

      :root.dark a:not([class]) {
        color: var(--dm-link) !important;
      }

      :root.dark a:not([class]):visited {
        color: var(--dm-linkVisited) !important;
      }

      :root.dark [class*="shadow"],
      :root.dark [class*="Shadow"] {
        -webkit-box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3) !important;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3) !important;
      }

      :root.dark pre,
      :root.dark code {
        background-color: var(--dm-surfaceLighter) !important;
      }

      :root.dark table,
      :root.dark th,
      :root.dark td {
        border-color: var(--dm-border) !important;
      }

      :root.dark th {
        background-color: var(--dm-surface) !important;
      }

      :root.dark tr:nth-child(even) {
        background-color: var(--dm-surfaceLighter) !important;
      }

      :root.dark blockquote {
        background-color: var(--dm-surface) !important;
        border-left-color: var(--dm-border) !important;
      }

      /* Handle common components and frameworks */
      :root.dark header,
      :root.dark nav,
      :root.dark footer {
        background-color: var(--dm-surface) !important;
      }

      :root.dark [class*="card"],
      :root.dark [class*="panel"],
      :root.dark [class*="box"] {
        background-color: var(--dm-surface) !important;
        border-color: var(--dm-border) !important;
      }

      /* Handle WordPress specific elements */
      :root.dark .wp-block-button__link {
        background-color: var(--dm-surface) !important;
        color: var(--dm-text) !important;
      }

      :root.dark .wp-block-quote {
        border-color: var(--dm-border) !important;
      }
    `,document.head.appendChild(styleSheet)}static findMenuElement(element){const menuSelectors=["ul.menu","ul.nav-menu",".wp-block-navigation__container",".main-navigation ul",".primary-menu",".menu-primary"];for(const selector of menuSelectors){const menu=element.querySelector(selector);if(menu&&window.getComputedStyle(menu).display!=="none"&&menu.querySelector("li"))return menu}for(const child of element.children){if(child.tagName.toLowerCase()==="ul"&&window.getComputedStyle(child).display!=="none"&&child.querySelector("li"))return child;const found=this.findMenuElement(child);if(found)return found}return null}static findHeader(){const headerSelectors=[".site-header","#masthead",".main-header","#site-header","#ast-mobile-header","#mobile-menu",".mobile-menu",".mobile-navigation",'[class*="header"]','[id*="header"]',"header","nav"];for(const selector of headerSelectors){const elements=document.querySelectorAll(selector);for(const element of elements)if(window.getComputedStyle(element).display!=="none"){const menuElement=this.findMenuElement(element);if(menuElement)return{container:element,menu:menuElement}}}return null}static show(){let darkModeSwitch=document.querySelector("pwa-dark-mode");const switchType=config.jsVars.settings.uiComponents.darkMode.type;if(!darkModeSwitch)if(darkModeSwitch=document.createElement("pwa-dark-mode"),switchType==="menu-switch"){const headerData=this.findHeader();if(headerData?.menu){const menuItem=document.createElement("li");menuItem.className="menu-item pwa-dark-mode-item";const existingMenuItem=headerData.menu.querySelector("li");if(existingMenuItem){const classesToCopy=Array.from(existingMenuItem.classList).filter(cls=>!cls.includes("current")&&!cls.includes("active"));menuItem.classList.add(...classesToCopy)}menuItem.appendChild(darkModeSwitch),headerData.menu.appendChild(menuItem)}}else document.body.appendChild(darkModeSwitch);return darkModeSwitch}async checkBatteryLevel(){if(config.jsVars.settings.uiComponents.darkMode.batteryLow==="on"&&"getBattery"in navigator)try{const battery=await navigator.getBattery();battery.level<.1&&this.enableDarkMode(),battery.addEventListener("levelchange",()=>{battery.level<.1&&this.enableDarkMode()})}catch(error){console.warn("Battery status check failed:",error)}}checkSystemPreference(){if(config.jsVars.settings.uiComponents.darkMode.osAware==="on"){const metaTag=document.createElement("meta");metaTag.setAttribute("name","color-scheme"),metaTag.setAttribute("content","dark light"),document.head.appendChild(metaTag),window.matchMedia("(prefers-color-scheme: dark)").matches&&this.enableDarkMode(),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",e=>{e.matches?this.enableDarkMode():this.disableDarkMode()})}}enableDarkMode(){document.documentElement.classList.add("dark"),localStorage.setItem("darkMode","enabled"),this.shadowRoot.querySelector(".dark-mode-floating, .dark-mode-menu").classList.add("-dark"),this.darkMode=!0,this.updateIcon(),this.dispatchEvent(new CustomEvent("darkModeChange",{detail:{enabled:!0},bubbles:!0}))}disableDarkMode(){document.documentElement.classList.remove("dark"),localStorage.setItem("darkMode","disabled"),this.shadowRoot.querySelector(".dark-mode-floating, .dark-mode-menu").classList.remove("-dark"),this.darkMode=!1,this.updateIcon(),this.dispatchEvent(new CustomEvent("darkModeChange",{detail:{enabled:!1},bubbles:!0}))}updateIcon(){const iconElement=this.shadowRoot.querySelector(".dark-mode-floating-icon, .dark-mode-menu-icon");iconElement&&(iconElement.innerHTML=this.darkMode?this.icons.dark:this.icons.light)}handleModeChange(){const button=this.shadowRoot.querySelector(".dark-mode-floating, .dark-mode-menu");button&&button.addEventListener("click",e=>{this.darkMode?this.disableDarkMode():this.enableDarkMode()}),localStorage.getItem("darkMode")==="enabled"&&this.enableDarkMode()}renderMenuSwitch(){return this.injectStyles(`
      .dark-mode-menu {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        position: relative;
        border-radius: 9999px;
        width: 40px;
        height: 22px;
        -ms-flex-negative: 0;
            flex-shrink: 0;
        border: 1px solid #c2c2c4;
        background-color: #eff0f3;
        outline: none;
        cursor: pointer;
      }

      .dark-mode-menu.-dark {
        border: 1px solid #3c3f44;
        background-color: #272a2f;
      }
  
      .dark-mode-menu-icon {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        position: absolute;
        left: 1px;
        width: 12px;
        height: 12px;
        padding: 4px;
        border-radius: 50%;
        color: #48484e;
        background-color: #ffffff;
        -webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, .04), 0 1px 2px rgba(0, 0, 0, .06);
                box-shadow: 0 1px 2px rgba(0, 0, 0, .04), 0 1px 2px rgba(0, 0, 0, .06);
        -webkit-transition: -webkit-transform .25s !important;
        transition: -webkit-transform .25s !important;
        -o-transition: transform .25s !important;
        transition: transform .25s !important;
        transition: transform .25s, -webkit-transform .25s !important;
      }

      .dark-mode-menu.-dark .dark-mode-menu-icon {
        background-color: #000000;
        color: #ffffff;
        -webkit-transform: translate(18px);
            -ms-transform: translate(18px);
                transform: translate(18px);
      }
    `),`
      <div class="dark-mode-menu ${this.darkMode?"-dark":""}" aria-label="${wp.i18n.__("Toggle dark mode")}">
        <span class="dark-mode-menu-icon">
          ${this.darkMode?this.icons.dark:this.icons.light}
        </span>
      </div>
    `}renderFloatingButton(){return this.injectStyles(`
      .dark-mode-floating {
        position: fixed;
        bottom: ${document.querySelector("pwa-navigation-tab-bar")?"70px":"20px"};
        right: 20px;
        z-index: 999;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        width: 50px;
        height: 50px;
        background: #eff0f3;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }

      .dark-mode-floating.-dark {
        background: #000000;
      }
  
      .dark-mode-floating-icon {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        width: 18px;
        height: 18px;
        color: #48484e;
      }

      .dark-mode-floating.-dark .dark-mode-floating-icon {
        color: #ffffff;
      }
    `),`
      <div class="dark-mode-floating" aria-label="${wp.i18n.__("Toggle dark mode")}">
        <span class="dark-mode-floating-icon">
          ${this.darkMode?this.icons.dark:this.icons.light}
        </span>
      </div>
    `}render(){let switchContent;switch(this.switchType){case"menu-switch":switchContent=this.renderMenuSwitch();break;case"floating-button":switchContent=this.renderFloatingButton();break;default:break}const combinedStyles=Array.from(this.styles).join(`
`);this.shadowRoot.innerHTML=`
      <style>
        ${combinedStyles}
      </style>
      ${switchContent}
    `}}}}),shareButton_exports={};__export(shareButton_exports,{initShareButton:()=>initShareButton});async function initShareButton(){customElements.get("pwa-share-button")||customElements.define("pwa-share-button",PwaShareButton),PwaShareButton.show()}var PwaShareButton,init_shareButton=__esm({"frontend/assets/js/dev/modules/shareButton.js"(){init_frontend(),init_utils(),PwaShareButton=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.styles=new Set,this.position=config.jsVars.settings.uiComponents.shareButton.position}async connectedCallback(){this.render(),this.handleShare()}static show(){let shareButton=document.querySelector("pwa-share-button");return shareButton||(shareButton=document.createElement("pwa-share-button"),document.body.appendChild(shareButton)),shareButton}injectStyles(css){this.styles.add(css)}handleShare(){this.shadowRoot.querySelector(".share-button").addEventListener("click",async()=>{try{await navigator.share({title:document.title,url:document.querySelector("link[rel=canonical]")?document.querySelector("link[rel=canonical]").href:document.location.href})}catch(error){console.error(error)}})}render(){var _a,_b,_c;const themeColor=(_c=(_b=(_a=config.jsVars.settings.webAppManifest)==null?void 0:_a.appearance)==null?void 0:_b.themeColor)!=null?_c:"#000000",iconColor=getContrastTextColor(themeColor),positionStyles={"bottom-right":document.querySelector("pwa-navigation-tab-bar")?"bottom: 70px; right: 20px;":"bottom: 20px; right: 20px;","bottom-left":document.querySelector("pwa-navigation-tab-bar")?"bottom: 70px; left: 20px;":"bottom: 20px; left: 20px;","top-right":"top: 20px; right: 20px;","top-left":"top: 20px; left: 20px;"}[this.position];this.injectStyles(`
      .share-button {
        position: fixed;
        ${positionStyles}
        z-index: 999;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        width: 50px;
        height: 50px;
        background: ${themeColor};
        border: none;
        border-radius: 50%;
        cursor: pointer;
        -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }

      .share-button:hover {
        opacity: 0.8;
      }
  
      .share-button_icon {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        width: 1.25rem;
        height: 1.25rem;
        color: ${iconColor};
      }
    `);const combinedStyles=Array.from(this.styles).join(`
`);this.shadowRoot.innerHTML=`
      <style>${combinedStyles}</style>
      <div class="share-button" aria-label="${wp.i18n.__("Share")}">
        <span class="share-button_icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v13"/><path d="m16 6-4-4-4 4"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/></svg>
        </span>
      </div>
    `}}}}),swup_exports={};__export(swup_exports,{initSwup:()=>initSwup,initSwupFadeTheme:()=>initSwupFadeTheme,initSwupHeadPlugin:()=>initSwupHeadPlugin,initSwupProgressBarPlugin:()=>initSwupProgressBarPlugin,initSwupScriptsPlugin:()=>initSwupScriptsPlugin,initSwupSlideTheme:()=>initSwupSlideTheme});function initSwup(){(function(t,e){typeof exports=="object"&&typeof module<"u"?module.exports=e():typeof define=="function"&&define.amd?define(e):(t||self).Swup=e()})(this,function(){const t=new WeakMap;function e(e2,n2,o2,i2){var _a,_b;if(!e2&&!t.has(n2))return!1;const r2=(_a=t.get(n2))!=null?_a:new WeakMap;t.set(n2,r2);const s2=(_b=r2.get(o2))!=null?_b:new Set;r2.set(o2,s2);const a2=s2.has(i2);return e2?s2.add(i2):s2.delete(i2),a2&&e2}const n=(t2,e2)=>String(t2).toLowerCase().replace(/[\s/_.]+/g,"-").replace(/[^\w-]+/g,"").replace(/--+/g,"-").replace(/^-+|-+$/g,"")||e2||"",o=function(t2){let{hash:e2}=t2===void 0?{}:t2;return window.location.pathname+window.location.search+(e2?window.location.hash:"")},i=function(t2,e2){t2===void 0&&(t2=null),e2===void 0&&(e2={}),t2=t2||o({hash:!0});const n2={...window.history.state||{},url:t2,random:Math.random(),source:"swup",...e2};window.history.replaceState(n2,"",t2)},r=(t2,n2,o2,i2)=>{const r2=new AbortController;return function(t3,n3,o3,i3={}){const{signal:r3,base:s2=document}=i3;if(r3?.aborted)return;const{once:a2,...c2}=i3,l2=s2 instanceof Document?s2.documentElement:s2,h2=!!(typeof i3=="object"?i3.capture:i3),u2=i4=>{const r4=function(t4,e2){let n4=t4.target;if(n4 instanceof Text&&(n4=n4.parentElement),n4 instanceof Element&&t4.currentTarget instanceof Element){const o4=n4.closest(e2);if(o4&&t4.currentTarget.contains(o4))return o4}}(i4,String(t3));if(r4){const t4=Object.assign(i4,{delegateTarget:r4});o3.call(l2,t4),a2&&(l2.removeEventListener(n3,u2,c2),e(!1,l2,o3,d2))}},d2=JSON.stringify({selector:t3,type:n3,capture:h2});e(!0,l2,o3,d2)||l2.addEventListener(n3,u2,c2),r3?.addEventListener("abort",()=>{e(!1,l2,o3,d2)})}(t2,n2,o2,i2={...i2,signal:r2.signal}),{destroy:()=>r2.abort()}};class s extends URL{constructor(t2,e2){e2===void 0&&(e2=document.baseURI),super(t2.toString(),e2),Object.setPrototypeOf(this,s.prototype)}get url(){return this.pathname+this.search}static fromElement(t2){const e2=t2.getAttribute("href")||t2.getAttribute("xlink:href")||"";return new s(e2)}static fromUrl(t2){return new s(t2)}}const a=function(t2,e2){var _a;e2===void 0&&(e2={});try{let n2=function(n3){const{status:r3,url:a3}=u2;return Promise.resolve(u2.text()).then(function(n4){if(r3===500)throw o2.hooks.call("fetch:error",i2,{status:r3,response:u2,url:a3}),new c(`Server error: ${a3}`,{status:r3,url:a3});if(!n4)throw new c(`Empty response: ${a3}`,{status:r3,url:a3});const{url:l3}=s.fromUrl(a3),h3={url:l3,html:n4};return!i2.cache.write||e2.method&&e2.method!=="GET"||t2!==l3||o2.cache.set(h3.url,h3),h3})};const o2=this;t2=s.fromUrl(t2).url;const{visit:i2=o2.visit}=e2,r2={...o2.options.requestHeaders,...e2.headers},a2=(_a=e2.timeout)!=null?_a:o2.options.timeout,l2=new AbortController,{signal:h2}=l2;e2={...e2,headers:r2,signal:h2};let u2,d2=!1,f2=null;a2&&a2>0&&(f2=setTimeout(()=>{d2=!0,l2.abort("timeout")},a2));const m2=function(n3,r3){try{var s2=Promise.resolve(o2.hooks.call("fetch:request",i2,{url:t2,options:e2},(t3,e3)=>{let{url:n4,options:o3}=e3;return fetch(n4,o3)})).then(function(t3){u2=t3,f2&&clearTimeout(f2)})}catch(t3){return r3(t3)}return s2&&s2.then?s2.then(void 0,r3):s2}(0,function(e3){throw d2?(o2.hooks.call("fetch:timeout",i2,{url:t2}),new c(`Request timed out: ${t2}`,{url:t2,timedOut:d2})):e3?.name==="AbortError"||h2.aborted?new c(`Request aborted: ${t2}`,{url:t2,aborted:!0}):e3});return Promise.resolve(m2&&m2.then?m2.then(n2):n2())}catch(p2){return Promise.reject(p2)}};class c extends Error{constructor(t2,e2){super(t2),this.url=void 0,this.status=void 0,this.aborted=void 0,this.timedOut=void 0,this.name="FetchError",this.url=e2.url,this.status=e2.status,this.aborted=e2.aborted||!1,this.timedOut=e2.timedOut||!1}}class l{constructor(t2){this.swup=void 0,this.pages=new Map,this.swup=t2}get size(){return this.pages.size}get all(){const t2=new Map;return this.pages.forEach((e2,n2)=>{t2.set(n2,{...e2})}),t2}has(t2){return this.pages.has(this.resolve(t2))}get(t2){const e2=this.pages.get(this.resolve(t2));return e2&&{...e2}}set(t2,e2){t2=this.resolve(t2),e2={...e2,url:t2},this.pages.set(t2,e2),this.swup.hooks.callSync("cache:set",void 0,{page:e2})}update(t2,e2){t2=this.resolve(t2);const n2={...this.get(t2),...e2,url:t2};this.pages.set(t2,n2)}delete(t2){this.pages.delete(this.resolve(t2))}clear(){this.pages.clear(),this.swup.hooks.callSync("cache:clear",void 0,void 0)}prune(t2){this.pages.forEach((e2,n2)=>{t2(n2,e2)&&this.delete(n2)})}resolve(t2){const{url:e2}=s.fromUrl(t2);return this.swup.resolveUrl(e2)}}const h=function(t2,e2){return e2===void 0&&(e2=document),e2.querySelector(t2)},u=function(t2,e2){return e2===void 0&&(e2=document),Array.from(e2.querySelectorAll(t2))},d=()=>new Promise(t2=>{requestAnimationFrame(()=>{requestAnimationFrame(()=>{t2()})})});function f(t2){return!!t2&&(typeof t2=="object"||typeof t2=="function")&&typeof t2.then=="function"}function m(t2,e2){const n2=t2?.closest(`[${e2}]`);return n2?.hasAttribute(e2)?n2?.getAttribute(e2)||!0:void 0}class p{constructor(t2){this.swup=void 0,this.swupClasses=["to-","is-changing","is-rendering","is-popstate","is-animating","is-leaving"],this.swup=t2}get selectors(){const{scope:t2}=this.swup.visit.animation;return t2==="containers"?this.swup.visit.containers:t2==="html"?["html"]:Array.isArray(t2)?t2:[]}get selector(){return this.selectors.join(",")}get targets(){return this.selector.trim()?u(this.selector):[]}add(){this.targets.forEach(t2=>t2.classList.add(...[].slice.call(arguments)))}remove(){this.targets.forEach(t2=>t2.classList.remove(...[].slice.call(arguments)))}clear(){this.targets.forEach(t2=>{const e2=t2.className.split(" ").filter(t3=>this.isSwupClass(t3));t2.classList.remove(...e2)})}isSwupClass(t2){return this.swupClasses.some(e2=>t2.startsWith(e2))}}class v{constructor(t2,e2){this.id=void 0,this.state=void 0,this.from=void 0,this.to=void 0,this.containers=void 0,this.animation=void 0,this.trigger=void 0,this.cache=void 0,this.history=void 0,this.scroll=void 0,this.meta=void 0;const{to:n2,from:o2,hash:i2,el:r2,event:s2}=e2;this.id=Math.random(),this.state=1,this.from={url:o2??t2.location.url,hash:t2.location.hash},this.to={url:n2,hash:i2},this.containers=t2.options.containers,this.animation={animate:!0,wait:!1,name:void 0,native:t2.options.native,scope:t2.options.animationScope,selector:t2.options.animationSelector},this.trigger={el:r2,event:s2},this.cache={read:t2.options.cache,write:t2.options.cache},this.history={action:"push",popstate:!1,direction:void 0},this.scroll={reset:!0,target:void 0},this.meta={}}advance(t2){this.state<t2&&(this.state=t2)}abort(){this.state=8}get done(){return this.state>=7}}function g(t2){return new v(this,t2)}const w=typeof Symbol<"u"?Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator")):"@@iterator";function y(t2,e2,n2){if(!t2.s){if(n2 instanceof k){if(!n2.s)return void(n2.o=y.bind(null,t2,e2));1&e2&&(e2=n2.s),n2=n2.v}if(n2&&n2.then)return void n2.then(y.bind(null,t2,e2),y.bind(null,t2,2));t2.s=e2,t2.v=n2;const o2=t2.o;o2&&o2(t2)}}const k=function(){function t2(){}return t2.prototype.then=function(e2,n2){const o2=new t2,i2=this.s;if(i2){const t3=1&i2?e2:n2;if(t3){try{y(o2,1,t3(this.v))}catch(t4){y(o2,2,t4)}return o2}return this}return this.o=function(t3){try{const i3=t3.v;1&t3.s?y(o2,1,e2?e2(i3):i3):n2?y(o2,1,n2(i3)):y(o2,2,i3)}catch(t4){y(o2,2,t4)}},o2},t2}();function P(t2){return t2 instanceof k&&1&t2.s}class b{constructor(t2){this.swup=void 0,this.registry=new Map,this.hooks=["animation:out:start","animation:out:await","animation:out:end","animation:in:start","animation:in:await","animation:in:end","animation:skip","cache:clear","cache:set","content:replace","content:scroll","enable","disable","fetch:request","fetch:error","fetch:timeout","history:popstate","link:click","link:self","link:anchor","link:newtab","page:load","page:view","scroll:top","scroll:anchor","visit:start","visit:transition","visit:abort","visit:end"],this.swup=t2,this.init()}init(){this.hooks.forEach(t2=>this.create(t2))}create(t2){this.registry.has(t2)||this.registry.set(t2,new Map)}exists(t2){return this.registry.has(t2)}get(t2){const e2=this.registry.get(t2);if(e2)return e2;console.error(`Unknown hook '${t2}'`)}clear(){this.registry.forEach(t2=>t2.clear())}on(t2,e2,n2){n2===void 0&&(n2={});const o2=this.get(t2);if(!o2)return console.warn(`Hook '${t2}' not found.`),()=>{};const i2=o2.size+1,r2={...n2,id:i2,hook:t2,handler:e2};return o2.set(e2,r2),()=>this.off(t2,e2)}before(t2,e2,n2){return n2===void 0&&(n2={}),this.on(t2,e2,{...n2,before:!0})}replace(t2,e2,n2){return n2===void 0&&(n2={}),this.on(t2,e2,{...n2,replace:!0})}once(t2,e2,n2){return n2===void 0&&(n2={}),this.on(t2,e2,{...n2,once:!0})}off(t2,e2){const n2=this.get(t2);n2&&e2?n2.delete(e2)||console.warn(`Handler for hook '${t2}' not found.`):n2&&n2.clear()}call(t2,e2,n2,o2){try{const i2=this,[r2,s2,a2]=i2.parseCallArgs(t2,e2,n2,o2),{before:c2,handler:l2,after:h2}=i2.getHandlers(t2,a2);return Promise.resolve(i2.run(c2,r2,s2)).then(function(){return Promise.resolve(i2.run(l2,r2,s2,!0)).then(function(e3){let[n3]=e3;return Promise.resolve(i2.run(h2,r2,s2)).then(function(){return i2.dispatchDomEvent(t2,r2,s2),n3})})})}catch(t3){return Promise.reject(t3)}}callSync(t2,e2,n2,o2){const[i2,r2,s2]=this.parseCallArgs(t2,e2,n2,o2),{before:a2,handler:c2,after:l2}=this.getHandlers(t2,s2);this.runSync(a2,i2,r2);const[h2]=this.runSync(c2,i2,r2,!0);return this.runSync(l2,i2,r2),this.dispatchDomEvent(t2,i2,r2),h2}parseCallArgs(t2,e2,n2,o2){return e2 instanceof v||typeof e2!="object"&&typeof n2!="function"?[e2,n2,o2]:[void 0,e2,n2]}run(t2,e2,n2,o2){o2===void 0&&(o2=!1);try{let i2;const r2=this;e2===void 0&&(e2=r2.swup.visit);const s2=[],a2=function(t3,e3,n3){if(typeof t3[w]=="function"){var o3,i3,r3,s3=t3[w]();if(function t4(a4){try{for(;!((o3=s3.next()).done||n3&&n3());)if((a4=e3(o3.value))&&a4.then){if(!P(a4))return void a4.then(t4,r3||(r3=y.bind(null,i3=new k,2)));a4=a4.v}i3?y(i3,1,a4):i3=a4}catch(t5){y(i3||(i3=new k),2,t5)}}(),s3.return){var a3=function(t4){try{o3.done||s3.return()}catch{}return t4};if(i3&&i3.then)return i3.then(a3,function(t4){throw a3(t4)});a3()}return i3}if(!("length"in t3))throw new TypeError("Object is not iterable");for(var c2=[],l2=0;l2<t3.length;l2++)c2.push(t3[l2]);return function(t4,e4,n4){var o4,i4,r4=-1;return function s4(a4){try{for(;++r4<t4.length&&(!n4||!n4());)if((a4=e4(r4))&&a4.then){if(!P(a4))return void a4.then(s4,i4||(i4=y.bind(null,o4=new k,2)));a4=a4.v}o4?y(o4,1,a4):o4=a4}catch(t5){y(o4||(o4=new k),2,t5)}}(),o4}(c2,function(t4){return e3(c2[t4])},n3)}(t2,function(t3){let{hook:i3,handler:a3,defaultHandler:c2,once:l2}=t3;if(!e2?.done)return l2&&r2.off(i3,a3),function(t4,o3){try{var i4=Promise.resolve(function(t5,e3){return e3===void 0&&(e3=[]),new Promise((n3,o4)=>{const i5=t5(...e3);f(i5)?i5.then(n3,o4):n3(i5)})}(a3,[e2,n2,c2])).then(function(t5){s2.push(t5)})}catch(t5){return o3(t5)}return i4&&i4.then?i4.then(void 0,o3):i4}(0,function(t4){if(o2)throw t4;console.error(`Error in hook '${i3}':`,t4)})},function(){return i2});return Promise.resolve(a2&&a2.then?a2.then(function(t3){return i2?t3:s2}):i2?a2:s2)}catch(t3){return Promise.reject(t3)}}runSync(t2,e2,n2,o2){e2===void 0&&(e2=this.swup.visit),o2===void 0&&(o2=!1);const i2=[];for(const{hook:r2,handler:s2,defaultHandler:a2,once:c2}of t2)if(!e2?.done){c2&&this.off(r2,s2);try{const t3=s2(e2,n2,a2);i2.push(t3),f(t3)&&console.warn(`Swup will not await Promises in handler for synchronous hook '${r2}'.`)}catch(t3){if(o2)throw t3;console.error(`Error in hook '${r2}':`,t3)}}return i2}getHandlers(t2,e2){const n2=this.get(t2);if(!n2)return{found:!1,before:[],handler:[],after:[],replaced:!1};const o2=Array.from(n2.values()),i2=this.sortRegistrations,r2=o2.filter(t3=>{let{before:e3,replace:n3}=t3;return e3&&!n3}).sort(i2),s2=o2.filter(t3=>{let{replace:e3}=t3;return e3}).filter(t3=>!0).sort(i2),a2=o2.filter(t3=>{let{before:e3,replace:n3}=t3;return!e3&&!n3}).sort(i2),c2=s2.length>0;let l2=[];if(e2&&(l2=[{id:0,hook:t2,handler:e2}],c2)){const n3=s2.length-1,{handler:o3,once:i3}=s2[n3],r3=t3=>{const n4=s2[t3-1];return n4?(e3,o4)=>n4.handler(e3,o4,r3(t3-1)):e2};l2=[{id:0,hook:t2,once:i3,handler:o3,defaultHandler:r3(n3)}]}return{found:!0,before:r2,handler:l2,after:a2,replaced:c2}}sortRegistrations(t2,e2){var _a,_b2;return((_a=t2.priority)!=null?_a:0)-((_b2=e2.priority)!=null?_b2:0)||t2.id-e2.id||0}dispatchDomEvent(t2,e2,n2){if(e2?.done)return;const o2={hook:t2,args:n2,visit:e2||this.swup.visit};document.dispatchEvent(new CustomEvent("swup:any",{detail:o2,bubbles:!0})),document.dispatchEvent(new CustomEvent(`swup:${t2}`,{detail:o2,bubbles:!0}))}parseName(t2){const[e2,...n2]=t2.split(".");return[e2,n2.reduce((t3,e3)=>({...t3,[e3]:!0}),{})]}}const S=t2=>{if(t2&&t2.charAt(0)==="#"&&(t2=t2.substring(1)),!t2)return null;const e2=decodeURIComponent(t2);let n2=document.getElementById(t2)||document.getElementById(e2)||h(`a[name='${CSS.escape(t2)}']`)||h(`a[name='${CSS.escape(e2)}']`);return n2||t2!=="top"||(n2=document.body),n2},E=function(t2){let{selector:e2,elements:n2}=t2;try{if(e2===!1&&!n2)return Promise.resolve();let t3=[];if(n2)t3=Array.from(n2);else if(e2&&(t3=u(e2,document.body),!t3.length))return console.warn(`[swup] No elements found matching animationSelector \`${e2}\``),Promise.resolve();const o2=t3.map(t4=>function(t5){const{type:e3,timeout:n3,propCount:o3}=function(t6){const e4=window.getComputedStyle(t6),n4=x(e4,`${C}Delay`),o4=x(e4,`${C}Duration`),i2=$(n4,o4),r2=x(e4,`${U}Delay`),s2=x(e4,`${U}Duration`),a2=$(r2,s2),c2=Math.max(i2,a2),l2=c2>0?i2>a2?C:U:null;return{type:l2,timeout:c2,propCount:l2?l2===C?o4.length:s2.length:0}}(t5);return!(!e3||!n3)&&new Promise(i2=>{const r2=`${e3}end`,s2=performance.now();let a2=0;const c2=()=>{t5.removeEventListener(r2,l2),i2()},l2=e4=>{e4.target===t5&&((performance.now()-s2)/1e3<e4.elapsedTime||++a2>=o3&&c2())};setTimeout(()=>{a2<o3&&c2()},n3+1),t5.addEventListener(r2,l2)})}(t4));return o2.filter(Boolean).length>0?Promise.resolve(Promise.all(o2)).then(function(){}):(e2&&console.warn(`[swup] No CSS animation duration defined on elements matching \`${e2}\``),Promise.resolve())}catch(t3){return Promise.reject(t3)}},C="transition",U="animation";function x(t2,e2){return(t2[e2]||"").split(", ")}function $(t2,e2){for(;t2.length<e2.length;)t2=t2.concat(t2);return Math.max(...e2.map((e3,n2)=>A(e3)+A(t2[n2])))}function A(t2){return 1e3*parseFloat(t2)}const H=function(t2,e2){e2===void 0&&(e2={});try{let r2=function(r3){var _a,_b;if(a2)return r3;c2.navigating=!0,c2.visit=t2;const{el:l3}=t2.trigger;e2.referrer=e2.referrer||c2.location.url,e2.animate===!1&&(t2.animation.animate=!1),t2.animation.animate||c2.classes.clear();const h2=e2.history||m(l3,"data-swup-history");typeof h2=="string"&&["push","replace"].includes(h2)&&(t2.history.action=h2);const u2=e2.animation||m(l3,"data-swup-animation");return typeof u2=="string"&&(t2.animation.name=u2),t2.meta=e2.meta||{},typeof e2.cache=="object"?(t2.cache.read=(_a=e2.cache.read)!=null?_a:t2.cache.read,t2.cache.write=(_b=e2.cache.write)!=null?_b:t2.cache.write):e2.cache!==void 0&&(t2.cache={read:!!e2.cache,write:!!e2.cache}),delete e2.cache,function(r4,a3){try{var l4=function(r5,a4){try{var l5=Promise.resolve(c2.hooks.call("visit:start",t2,void 0)).then(function(){function r6(){if(!t2.done)return Promise.resolve(c2.hooks.call("visit:transition",t2,void 0,function(){try{let e3=function(e4){return n2?e4:(t2.advance(4),Promise.resolve(c2.animatePageOut(t2)).then(function(){function e5(){return Promise.resolve(c2.animatePageIn(t2)).then(function(){})}const n3=function(){if(t2.animation.native&&document.startViewTransition)return Promise.resolve(document.startViewTransition(function(){try{const e6=c2.renderPage;return Promise.resolve(a5).then(function(n4){return Promise.resolve(e6.call(c2,t2,n4))})}catch(t3){return Promise.reject(t3)}}).finished).then(function(){});{const e6=c2.renderPage;return Promise.resolve(a5).then(function(n4){return Promise.resolve(e6.call(c2,t2,n4)).then(function(){})})}}();return n3&&n3.then?n3.then(e5):e5()}))},n2;const o2=function(){if(!t2.animation.animate)return Promise.resolve(c2.hooks.call("animation:skip",void 0)).then(function(){const e4=c2.renderPage;return Promise.resolve(a5).then(function(o3){return Promise.resolve(e4.call(c2,t2,o3)).then(function(){n2=1})})})}();return Promise.resolve(o2&&o2.then?o2.then(e3):e3(o2))}catch(i2){return Promise.reject(i2)}})).then(function(){if(!t2.done)return Promise.resolve(c2.hooks.call("visit:end",t2,void 0,()=>c2.classes.clear())).then(function(){t2.state=7,c2.navigating=!1,c2.onVisitEnd&&(c2.onVisitEnd(),c2.onVisitEnd=void 0)})})}t2.state=3;const a5=c2.hooks.call("page:load",t2,{options:e2},function(t3,e3){try{let n2=function(t4){return e3.page=t4,e3.cache=!!o2,e3.page},o2;return t3.cache.read&&(o2=c2.cache.get(t3.to.url)),Promise.resolve(o2?n2(o2):Promise.resolve(c2.fetchPage(t3.to.url,e3.options)).then(n2))}catch(i2){return Promise.reject(i2)}});a5.then(e3=>{let{html:n2}=e3;t2.advance(5),t2.to.html=n2,t2.to.document=new DOMParser().parseFromString(n2,"text/html")});const l6=t2.to.url+t2.to.hash;t2.history.popstate||(t2.history.action==="replace"||t2.to.url===c2.location.url?i(l6):(c2.currentHistoryIndex++,function(t3,e3){e3===void 0&&(e3={});const n2={url:t3=t3||o({hash:!0}),random:Math.random(),source:"swup",...e3};window.history.pushState(n2,"",t3)}(l6,{index:c2.currentHistoryIndex}))),c2.location=s.fromUrl(l6),t2.history.popstate&&c2.classes.add("is-popstate"),t2.animation.name&&c2.classes.add(`to-${n(t2.animation.name)}`);const h3=function(){if(t2.animation.wait)return Promise.resolve(a5).then(function(){})}();return h3&&h3.then?h3.then(r6):r6()})}catch(t3){return a4(t3)}return l5&&l5.then?l5.then(void 0,a4):l5}(0,function(e3){e3&&!e3?.aborted?(t2.state=9,console.error(e3),c2.options.skipPopStateHandling=()=>(window.location.assign(t2.to.url+t2.to.hash),!0),window.history.back()):t2.state=8})}catch(t3){return a3(!0,t3)}return l4&&l4.then?l4.then(a3.bind(null,!1),a3.bind(null,!0)):a3(!1,l4)}(0,function(e3,n2){if(delete t2.to.document,e3)throw n2;return n2})},a2;const c2=this,l2=function(){if(c2.navigating)return function(){if(!(c2.visit.state>=6))return Promise.resolve(c2.hooks.call("visit:abort",c2.visit,void 0)).then(function(){delete c2.visit.to.document,c2.visit.state=8});t2.state=2,c2.onVisitEnd=()=>c2.performNavigation(t2,e2),a2=1}()}();return Promise.resolve(l2&&l2.then?l2.then(r2):r2(l2))}catch(h2){return Promise.reject(h2)}};function T(t2,e2,n2){if(e2===void 0&&(e2={}),n2===void 0&&(n2={}),typeof t2!="string")throw new Error("swup.navigate() requires a URL parameter");if(this.shouldIgnoreVisit(t2,{el:n2.el,event:n2.event}))return void window.location.assign(t2);const{url:o2,hash:i2}=s.fromUrl(t2),r2=this.createVisit({...n2,to:o2,hash:i2});this.performNavigation(r2,e2)}const j=function(t2){try{const e2=this;return Promise.resolve(e2.hooks.call("animation:out:start",t2,void 0,()=>{e2.classes.add("is-changing","is-animating","is-leaving")})).then(function(){return Promise.resolve(e2.hooks.call("animation:out:await",t2,{skip:!1},(t3,n2)=>{let{skip:o2}=n2;if(!o2)return e2.awaitAnimations({selector:t3.animation.selector})})).then(function(){return Promise.resolve(e2.hooks.call("animation:out:end",t2,void 0)).then(function(){})})})}catch(t3){return Promise.reject(t3)}},L=function(t2){var _a;const e2=t2.to.document;if(!e2)return!1;const n2=((_a=e2.querySelector("title"))==null?void 0:_a.innerText)||"";document.title=n2;const o2=u('[data-swup-persist]:not([data-swup-persist=""])'),i2=t2.containers.map(t3=>{const n3=document.querySelector(t3),o3=e2.querySelector(t3);return n3&&o3?(n3.replaceWith(o3.cloneNode(!0)),!0):(n3||console.warn(`[swup] Container missing in current document: ${t3}`),o3||console.warn(`[swup] Container missing in incoming document: ${t3}`),!1)}).filter(Boolean);return o2.forEach(t3=>{const e3=t3.getAttribute("data-swup-persist"),n3=h(`[data-swup-persist="${e3}"]`);n3&&n3!==t3&&n3.replaceWith(t3)}),i2.length===t2.containers.length},V=function(t2){const e2={behavior:"auto"},{target:n2,reset:o2}=t2.scroll,i2=n2??t2.to.hash;let r2=!1;return i2&&(r2=this.hooks.callSync("scroll:anchor",t2,{hash:i2,options:e2},(t3,e3)=>{let{hash:n3,options:o3}=e3;const i3=this.getAnchorElement(n3);return i3&&i3.scrollIntoView(o3),!!i3})),o2&&!r2&&(r2=this.hooks.callSync("scroll:top",t2,{options:e2},(t3,e3)=>{let{options:n3}=e3;return window.scrollTo({top:0,left:0,...n3}),!0})),r2},I=function(t2){try{const e2=this;if(t2.done)return Promise.resolve();const n2=e2.hooks.call("animation:in:await",t2,{skip:!1},(t3,n3)=>{let{skip:o2}=n3;if(!o2)return e2.awaitAnimations({selector:t3.animation.selector})});return Promise.resolve(d()).then(function(){return Promise.resolve(e2.hooks.call("animation:in:start",t2,void 0,()=>{e2.classes.remove("is-animating")})).then(function(){return Promise.resolve(n2).then(function(){return Promise.resolve(e2.hooks.call("animation:in:end",t2,void 0)).then(function(){})})})})}catch(t3){return Promise.reject(t3)}},q=function(t2,e2){try{const r2=this;if(t2.done)return Promise.resolve();t2.advance(6);const{url:a2}=e2;return r2.isSameResolvedUrl(o(),a2)||(i(a2),r2.location=s.fromUrl(a2),t2.to.url=r2.location.url,t2.to.hash=r2.location.hash),Promise.resolve(r2.hooks.call("content:replace",t2,{page:e2},(t3,e3)=>{if(r2.classes.remove("is-leaving"),t3.animation.animate&&r2.classes.add("is-rendering"),!r2.replaceContent(t3))throw new Error("[swup] Container mismatch, aborting");t3.animation.animate&&(r2.classes.add("is-changing","is-animating","is-rendering"),t3.animation.name&&r2.classes.add(`to-${n(t3.animation.name)}`))})).then(function(){return Promise.resolve(r2.hooks.call("content:scroll",t2,void 0,()=>r2.scrollToContent(t2))).then(function(){return Promise.resolve(r2.hooks.call("page:view",t2,{url:r2.location.url,title:document.title})).then(function(){})})})}catch(t3){return Promise.reject(t3)}},N=function(t2){var e2;if(e2=t2,!!e2?.isSwupPlugin){if(t2.swup=this,!t2._checkRequirements||t2._checkRequirements())return t2._beforeMount&&t2._beforeMount(),t2.mount(),this.plugins.push(t2),this.plugins}else console.error("Not a swup plugin instance",t2)};function R(t2){const e2=this.findPlugin(t2);if(e2)return e2.unmount(),e2._afterUnmount&&e2._afterUnmount(),this.plugins=this.plugins.filter(t3=>t3!==e2),this.plugins;console.error("No such plugin",e2)}function O(t2){return this.plugins.find(e2=>e2===t2||e2.name===t2||e2.name===`Swup${String(t2)}`)}function D(t2){if(typeof this.options.resolveUrl!="function")return console.warn("[swup] options.resolveUrl expects a callback function."),t2;const e2=this.options.resolveUrl(t2);return e2&&typeof e2=="string"?e2.startsWith("//")||e2.startsWith("http")?(console.warn("[swup] options.resolveUrl needs to return a relative url"),t2):e2:(console.warn("[swup] options.resolveUrl needs to return a url"),t2)}function M(t2,e2){return this.resolveUrl(t2)===this.resolveUrl(e2)}const W={animateHistoryBrowsing:!1,animationSelector:'[class*="transition-"]',animationScope:"html",cache:!0,containers:["#swup"],hooks:{},ignoreVisit:function(t2,e2){let{el:n2}=e2===void 0?{}:e2;return!!n2?.closest("[data-no-swup]")},linkSelector:"a[href]",linkToSelf:"scroll",native:!1,plugins:[],resolveUrl:t2=>t2,requestHeaders:{"X-Requested-With":"swup",Accept:"text/html, application/xhtml+xml"},skipPopStateHandling:t2=>{var _a;return((_a=t2.state)==null?void 0:_a.source)!=="swup"},timeout:0};return class{get currentPageUrl(){return this.location.url}constructor(t2){var _a,_b;t2===void 0&&(t2={}),this.version="4.8.1",this.options=void 0,this.defaults=W,this.plugins=[],this.visit=void 0,this.cache=void 0,this.hooks=void 0,this.classes=void 0,this.location=s.fromUrl(window.location.href),this.currentHistoryIndex=void 0,this.clickDelegate=void 0,this.navigating=!1,this.onVisitEnd=void 0,this.use=N,this.unuse=R,this.findPlugin=O,this.log=()=>{},this.navigate=T,this.performNavigation=H,this.createVisit=g,this.delegateEvent=r,this.fetchPage=a,this.awaitAnimations=E,this.renderPage=q,this.replaceContent=L,this.animatePageIn=I,this.animatePageOut=j,this.scrollToContent=V,this.getAnchorElement=S,this.getCurrentUrl=o,this.resolveUrl=D,this.isSameResolvedUrl=M,this.options={...this.defaults,...t2},this.handleLinkClick=this.handleLinkClick.bind(this),this.handlePopState=this.handlePopState.bind(this),this.cache=new l(this),this.classes=new p(this),this.hooks=new b(this),this.visit=this.createVisit({to:""}),this.currentHistoryIndex=(_b=(_a=window.history.state)==null?void 0:_a.index)!=null?_b:1,this.enable()}enable(){var _a;try{const t2=this,{linkSelector:e2}=t2.options;t2.clickDelegate=t2.delegateEvent(e2,"click",t2.handleLinkClick),window.addEventListener("popstate",t2.handlePopState),t2.options.animateHistoryBrowsing&&(window.history.scrollRestoration="manual"),t2.options.native=t2.options.native&&!!document.startViewTransition,t2.options.plugins.forEach(e3=>t2.use(e3));for(const[e3,n2]of Object.entries(t2.options.hooks)){const[o2,i2]=t2.hooks.parseName(e3);t2.hooks.on(o2,n2,i2)}return((_a=window.history.state)==null?void 0:_a.source)!=="swup"&&i(null,{index:t2.currentHistoryIndex}),Promise.resolve(d()).then(function(){return Promise.resolve(t2.hooks.call("enable",void 0,void 0,()=>{const e3=document.documentElement;e3.classList.add("swup-enabled"),e3.classList.toggle("swup-native",t2.options.native)})).then(function(){})})}catch(t2){return Promise.reject(t2)}}destroy(){try{const t2=this;return t2.clickDelegate.destroy(),window.removeEventListener("popstate",t2.handlePopState),t2.cache.clear(),t2.options.plugins.forEach(e2=>t2.unuse(e2)),Promise.resolve(t2.hooks.call("disable",void 0,void 0,()=>{const t3=document.documentElement;t3.classList.remove("swup-enabled"),t3.classList.remove("swup-native")})).then(function(){t2.hooks.clear()})}catch(t2){return Promise.reject(t2)}}shouldIgnoreVisit(t2,e2){let{el:n2,event:o2}=e2===void 0?{}:e2;const{origin:i2,url:r2,hash:a2}=s.fromUrl(t2);return i2!==window.location.origin||!(!n2||!this.triggerWillOpenNewWindow(n2))||!!this.options.ignoreVisit(r2+a2,{el:n2,event:o2})}handleLinkClick(t2){const e2=t2.delegateTarget,{href:n2,url:o2,hash:r2}=s.fromElement(e2);if(this.shouldIgnoreVisit(n2,{el:e2,event:t2}))return;if(this.navigating&&o2===this.visit.to.url)return void t2.preventDefault();const a2=this.createVisit({to:o2,hash:r2,el:e2,event:t2});t2.metaKey||t2.ctrlKey||t2.shiftKey||t2.altKey?this.hooks.callSync("link:newtab",a2,{href:n2}):t2.button===0&&this.hooks.callSync("link:click",a2,{el:e2,event:t2},()=>{var _a;const e3=(_a=a2.from.url)!=null?_a:"";t2.preventDefault(),o2&&o2!==e3?this.isSameResolvedUrl(o2,e3)||this.performNavigation(a2):r2?this.hooks.callSync("link:anchor",a2,{hash:r2},()=>{i(o2+r2),this.scrollToContent(a2)}):this.hooks.callSync("link:self",a2,void 0,()=>{this.options.linkToSelf==="navigate"?this.performNavigation(a2):(i(o2),this.scrollToContent(a2))})})}handlePopState(t2){var _a,_b,_c,_d;const e2=(_b=(_a=t2.state)==null?void 0:_a.url)!=null?_b:window.location.href;if(this.options.skipPopStateHandling(t2)||this.isSameResolvedUrl(o(),this.location.url))return;const{url:n2,hash:i2}=s.fromUrl(e2),r2=this.createVisit({to:n2,hash:i2,event:t2});r2.history.popstate=!0;const a2=(_d=(_c=t2.state)==null?void 0:_c.index)!=null?_d:0;a2&&a2!==this.currentHistoryIndex&&(r2.history.direction=a2-this.currentHistoryIndex>0?"forwards":"backwards",this.currentHistoryIndex=a2),r2.animation.animate=!1,r2.scroll.reset=!1,r2.scroll.target=!1,this.options.animateHistoryBrowsing&&(r2.animation.animate=!0,r2.scroll.reset=!0),this.hooks.callSync("history:popstate",r2,{event:t2},()=>{this.performNavigation(r2)})}triggerWillOpenNewWindow(t2){return!!t2.matches('[download], [target="_blank"]')}}})}function initSwupScriptsPlugin(){(function(t,e){typeof exports=="object"&&typeof module<"u"?module.exports=e():typeof define=="function"&&define.amd?define(e):(t||self).SwupScriptsPlugin=e()})(this,function(){function t(){return t=Object.assign?Object.assign.bind():function(t2){for(var e2=1;e2<arguments.length;e2++){var n2=arguments[e2];for(var r in n2)Object.prototype.hasOwnProperty.call(n2,r)&&(t2[r]=n2[r])}return t2},t.apply(this,arguments)}const e=t2=>String(t2).split(".").map(t3=>String(parseInt(t3||"0",10))).concat(["0","0"]).slice(0,3).join(".");class n{constructor(){this.isSwupPlugin=!0,this.swup=void 0,this.version=void 0,this.requires={},this.handlersToUnregister=[]}mount(){}unmount(){this.handlersToUnregister.forEach(t2=>t2()),this.handlersToUnregister=[]}_beforeMount(){if(!this.name)throw new Error("You must define a name of plugin when creating a class.")}_afterUnmount(){}_checkRequirements(){return typeof this.requires!="object"||Object.entries(this.requires).forEach(([t2,n2])=>{if(!function(t3,n3,r){const o=function(t4,e2){var n4;if(t4==="swup")return(n4=e2.version)!=null?n4:"";{var r2;const n5=e2.findPlugin(t4);return(r2=n5?.version)!=null?r2:""}}(t3,r);return!!o&&((t4,n4)=>n4.every(n5=>{const[,r2,o2]=n5.match(/^([\D]+)?(.*)$/)||[];var s,i;return((t5,e2)=>{const n6={"":t6=>t6===0,">":t6=>t6>0,">=":t6=>t6>=0,"<":t6=>t6<0,"<=":t6=>t6<=0};return(n6[e2]||n6[""])(t5)})((i=o2,s=e(s=t4),i=e(i),s.localeCompare(i,void 0,{numeric:!0})),r2||">=")}))(o,n3)}(t2,n2=Array.isArray(n2)?n2:[n2],this.swup)){const e2=`${t2} ${n2.join(", ")}`;throw new Error(`Plugin version mismatch: ${this.name} requires ${e2}`)}}),!0}on(t2,e2,n2={}){var r;e2=!(r=e2).name.startsWith("bound ")||r.hasOwnProperty("prototype")?e2.bind(this):e2;const o=this.swup.hooks.on(t2,e2,n2);return this.handlersToUnregister.push(o),o}once(e2,n2,r={}){return this.on(e2,n2,t({},r,{once:!0}))}before(e2,n2,r={}){return this.on(e2,n2,t({},r,{before:!0}))}replace(e2,n2,r={}){return this.on(e2,n2,t({},r,{replace:!0}))}off(t2,e2){return this.swup.hooks.off(t2,e2)}}return class extends n{constructor(t2){t2===void 0&&(t2={}),super(),this.name="SwupScriptsPlugin",this.requires={swup:">=4"},this.defaults={head:!0,body:!0,optin:!1},this.options=void 0,this.options={...this.defaults,...t2}}mount(){this.on("content:replace",this.runScripts)}runScripts(){const{head:t2,body:e2,optin:n2}=this.options,r=this.getScope({head:t2,body:e2});if(!r)return;const o=Array.from(r.querySelectorAll(n2?"script[data-swup-reload-script]":"script:not([data-swup-ignore-script])"));o.forEach(t3=>this.runScript(t3)),this.swup.log(`Executed ${o.length} scripts.`)}runScript(t2){const e2=document.createElement("script");for(const{name:n2,value:r}of t2.attributes)e2.setAttribute(n2,r);return e2.textContent=t2.textContent,t2.replaceWith(e2),e2}getScope(t2){let{head:e2,body:n2}=t2;return e2&&n2?document:e2?document.head:n2?document.body:null}}})}function initSwupHeadPlugin(){(function(e,t){typeof exports=="object"&&typeof module<"u"?module.exports=t():typeof define=="function"&&define.amd?define(t):(e||self).SwupHeadPlugin=t()})(this,function(){function e(){return e=Object.assign?Object.assign.bind():function(e2){for(var t2=1;t2<arguments.length;t2++){var n2=arguments[t2];for(var r2 in n2)Object.prototype.hasOwnProperty.call(n2,r2)&&(e2[r2]=n2[r2])}return e2},e.apply(this,arguments)}const t=e2=>String(e2).split(".").map(e3=>String(parseInt(e3||"0",10))).concat(["0","0"]).slice(0,3).join(".");class n{constructor(){this.isSwupPlugin=!0,this.swup=void 0,this.version=void 0,this.requires={},this.handlersToUnregister=[]}mount(){}unmount(){this.handlersToUnregister.forEach(e2=>e2()),this.handlersToUnregister=[]}_beforeMount(){if(!this.name)throw new Error("You must define a name of plugin when creating a class.")}_afterUnmount(){}_checkRequirements(){return typeof this.requires!="object"||Object.entries(this.requires).forEach(([e2,n2])=>{if(!function(e3,n3,r2){const s2=function(e4,t2){var n4;if(e4==="swup")return(n4=t2.version)!=null?n4:"";{var r3;const n5=t2.findPlugin(e4);return(r3=n5?.version)!=null?r3:""}}(e3,r2);return!!s2&&((e4,n4)=>n4.every(n5=>{const[,r3,s3]=n5.match(/^([\D]+)?(.*)$/)||[];var o2,i2;return((e5,t2)=>{const n6={"":e6=>e6===0,">":e6=>e6>0,">=":e6=>e6>=0,"<":e6=>e6<0,"<=":e6=>e6<=0};return(n6[t2]||n6[""])(e5)})((i2=s3,o2=t(o2=e4),i2=t(i2),o2.localeCompare(i2,void 0,{numeric:!0})),r3||">=")}))(s2,n3)}(e2,n2=Array.isArray(n2)?n2:[n2],this.swup)){const t2=`${e2} ${n2.join(", ")}`;throw new Error(`Plugin version mismatch: ${this.name} requires ${t2}`)}}),!0}on(e2,t2,n2={}){var r2;t2=!(r2=t2).name.startsWith("bound ")||r2.hasOwnProperty("prototype")?t2.bind(this):t2;const s2=this.swup.hooks.on(e2,t2,n2);return this.handlersToUnregister.push(s2),s2}once(t2,n2,r2={}){return this.on(t2,n2,e({},r2,{once:!0}))}before(t2,n2,r2={}){return this.on(t2,n2,e({},r2,{before:!0}))}replace(t2,n2,r2={}){return this.on(t2,n2,e({},r2,{replace:!0}))}off(e2,t2){return this.swup.hooks.off(e2,t2)}}function r(e2){return e2.localName!=="title"&&!e2.matches("[data-swup-theme]")}function s(e2,t2){return e2.outerHTML===t2.outerHTML}function o(e2,t2){t2===void 0&&(t2=[]);const n2=Array.from(e2.attributes);return t2.length?n2.filter(e3=>{let{name:n3}=e3;return t2.some(e4=>e4 instanceof RegExp?e4.test(n3):n3===e4)}):n2}function i(e2){return e2.matches("link[rel=stylesheet][href]")}return class extends n{constructor(e2){e2===void 0&&(e2={}),super();const t2=this;this.name="SwupHeadPlugin",this.requires={swup:">=4.6"},this.defaults={persistTags:!1,persistAssets:!1,awaitAssets:!1,attributes:["lang","dir"],timeout:3e3},this.options=void 0,this.updateHead=function(e3,n2){try{const{awaitAssets:n3,attributes:u,timeout:a}=t2.options,l=e3.to.document,{removed:c,added:h}=function(e4,t3,n4){let{shouldPersist:o2=()=>!1}=n4===void 0?{}:n4;const i2=Array.from(e4.children),u2=Array.from(t3.children),a2=(l2=i2,u2.reduce((e5,t4,n5)=>(l2.some(e6=>s(t4,e6))||e5.push({el:t4,index:n5}),e5),[]));var l2;const c2=function(e5,t4){return e5.reduce((e6,n5)=>(t4.some(e7=>s(n5,e7))||e6.push({el:n5}),e6),[])}(i2,u2);c2.reverse().filter(e5=>{let{el:t4}=e5;return r(t4)}).filter(e5=>{let{el:t4}=e5;return!o2(t4)}).forEach(t4=>{let{el:n5}=t4;return e4.removeChild(n5)});const h2=a2.filter(e5=>{let{el:t4}=e5;return r(t4)}).map(t4=>{let n5=t4.el.cloneNode(!0);return e4.insertBefore(n5,e4.children[(t4.index||0)+1]||null),{...t4,el:n5}});return{removed:c2.map(e5=>{let{el:t4}=e5;return t4}),added:h2.map(e5=>{let{el:t4}=e5;return t4})}}(document.head,l.head,{shouldPersist:e4=>t2.isPersistentTag(e4)});t2.swup.log(`Removed ${c.length} / added ${h.length} tags in head`),u?.length&&function(e4,t3,n4){n4===void 0&&(n4=[]);const r2=new Set;for(const{name:s2,value:i2}of o(t3,n4))e4.setAttribute(s2,i2),r2.add(s2);for(const{name:t4}of o(e4,n4))r2.has(t4)||e4.removeAttribute(t4)}(document.documentElement,l.documentElement,u);const d=function(){if(n3){const n4=((e4=a)===void 0&&(e4=0),h.filter(i).map(t3=>function(e5,t4){let n5;t4===void 0&&(t4=0);const r3=t5=>{e5.sheet?t5():n5=setTimeout(()=>r3(t5),10)};return new Promise(s2=>{r3(()=>s2(e5)),t4>0&&setTimeout(()=>{n5&&clearTimeout(n5),s2(e5)},t4)})}(t3,e4))),r2=function(){if(n4.length)return t2.swup.log(`Waiting for ${n4.length} assets to load`),Promise.resolve(Promise.all(n4)).then(function(){})}();if(r2&&r2.then)return r2.then(function(){})}var e4}();return Promise.resolve(d&&d.then?d.then(function(){}):void 0)}catch(e4){return Promise.reject(e4)}},this.options={...this.defaults,...e2},this.options.persistAssets&&!this.options.persistTags&&(this.options.persistTags="link[rel=stylesheet], script[src], style")}mount(){this.before("content:replace",this.updateHead)}isPersistentTag(e2){const{persistTags:t2}=this.options;return typeof t2=="function"?t2(e2):typeof t2=="string"&&t2.length>0?e2.matches(t2):!!t2}}})}function initSwupProgressBarPlugin(){(function(t,e){typeof exports=="object"&&typeof module<"u"?module.exports=e():typeof define=="function"&&define.amd?define(e):(t||self).SwupProgressPlugin=e()})(this,function(){function t(){return t=Object.assign?Object.assign.bind():function(t2){for(var e2=1;e2<arguments.length;e2++){var s2=arguments[e2];for(var i2 in s2)Object.prototype.hasOwnProperty.call(s2,i2)&&(t2[i2]=s2[i2])}return t2},t.apply(this,arguments)}const e=t2=>String(t2).split(".").map(t3=>String(parseInt(t3||"0",10))).concat(["0","0"]).slice(0,3).join(".");class s{constructor(){this.isSwupPlugin=!0,this.swup=void 0,this.version=void 0,this.requires={},this.handlersToUnregister=[]}mount(){}unmount(){this.handlersToUnregister.forEach(t2=>t2()),this.handlersToUnregister=[]}_beforeMount(){if(!this.name)throw new Error("You must define a name of plugin when creating a class.")}_afterUnmount(){}_checkRequirements(){return typeof this.requires!="object"||Object.entries(this.requires).forEach(([t2,s2])=>{if(!function(t3,s3,i2){const r=function(t4,e2){var s4;if(t4==="swup")return(s4=e2.version)!=null?s4:"";{var i3;const s5=e2.findPlugin(t4);return(i3=s5?.version)!=null?i3:""}}(t3,i2);return!!r&&((t4,s4)=>s4.every(s5=>{const[,i3,r2]=s5.match(/^([\D]+)?(.*)$/)||[];var n,o;return((t5,e2)=>{const s6={"":t6=>t6===0,">":t6=>t6>0,">=":t6=>t6>=0,"<":t6=>t6<0,"<=":t6=>t6<=0};return(s6[e2]||s6[""])(t5)})((o=r2,n=e(n=t4),o=e(o),n.localeCompare(o,void 0,{numeric:!0})),i3||">=")}))(r,s3)}(t2,s2=Array.isArray(s2)?s2:[s2],this.swup)){const e2=`${t2} ${s2.join(", ")}`;throw new Error(`Plugin version mismatch: ${this.name} requires ${e2}`)}}),!0}on(t2,e2,s2={}){var i2;e2=!(i2=e2).name.startsWith("bound ")||i2.hasOwnProperty("prototype")?e2.bind(this):e2;const r=this.swup.hooks.on(t2,e2,s2);return this.handlersToUnregister.push(r),r}once(e2,s2,i2={}){return this.on(e2,s2,t({},i2,{once:!0}))}before(e2,s2,i2={}){return this.on(e2,s2,t({},i2,{before:!0}))}replace(e2,s2,i2={}){return this.on(e2,s2,t({},i2,{replace:!0}))}off(t2,e2){return this.swup.hooks.off(t2,e2)}}class i{constructor(t2){let{className:e2,styleAttr:s2,animationDuration:i2,minValue:r,initialValue:n,trickleValue:o}=t2===void 0?{}:t2;this.value=0,this.visible=!1,this.hiding=!1,this.className="progress-bar",this.styleAttr="data-progressbar-styles data-swup-theme",this.animationDuration=300,this.minValue=.1,this.initialValue=.25,this.trickleValue=.03,this.trickleInterval=void 0,this.styleElement=void 0,this.progressElement=void 0,this.trickle=()=>{const t3=Math.random()*this.trickleValue;this.setValue(this.value+t3)},e2!==void 0&&(this.className=String(e2)),s2!==void 0&&(this.styleAttr=String(s2)),i2!==void 0&&(this.animationDuration=Number(i2)),r!==void 0&&(this.minValue=Number(r)),n!==void 0&&(this.initialValue=Number(n)),o!==void 0&&(this.trickleValue=Number(o)),this.styleElement=this.createStyleElement(),this.progressElement=this.createProgressElement()}get defaultStyles(){return`
		.${this.className} {
			position: fixed;
			display: block;
			top: 0;
			left: 0;
      width: 100%;
			height: 3px;
			background-color: black;
			z-index: 9999;
			transition:
				transform ${this.animationDuration}ms ease-out,
				opacity ${this.animationDuration/2}ms ${this.animationDuration/2}ms ease-in;
	  transform: translate3d(0, 0, 0) scaleX(var(--progress, 0));
      transform-origin: 0;
		}
	`}show(){this.visible||(this.visible=!0,this.installStyleElement(),this.installProgressElement(),this.startTrickling())}hide(){this.visible&&!this.hiding&&(this.hiding=!0,this.fadeProgressElement(()=>{this.uninstallProgressElement(),this.stopTrickling(),this.visible=!1,this.hiding=!1}))}setValue(t2){this.value=Math.min(1,Math.max(this.minValue,t2)),this.refresh()}installStyleElement(){document.head.prepend(this.styleElement)}installProgressElement(){this.progressElement.style.setProperty("--progress",String(0)),this.progressElement.style.opacity="1",document.body.prepend(this.progressElement),this.progressElement.scrollTop=0,this.setValue(Math.random()*this.initialValue)}fadeProgressElement(t2){this.progressElement.style.opacity="0",setTimeout(t2,1.5*this.animationDuration)}uninstallProgressElement(){this.progressElement.remove()}startTrickling(){this.trickleInterval||(this.trickleInterval=window.setInterval(this.trickle,this.animationDuration))}stopTrickling(){window.clearInterval(this.trickleInterval),delete this.trickleInterval}refresh(){requestAnimationFrame(()=>{this.progressElement.style.setProperty("--progress",String(this.value))})}createStyleElement(){const t2=document.createElement("style");return this.styleAttr.split(" ").forEach(e2=>t2.setAttribute(e2,"")),t2.textContent=this.defaultStyles,t2}createProgressElement(){const t2=document.createElement("div");return t2.className=this.className,t2.setAttribute("aria-hidden","true"),t2}}return class extends s{constructor(t2){t2===void 0&&(t2={}),super(),this.name="SwupProgressPlugin",this.defaults={className:"swup-progress-bar",delay:300,transition:300,minValue:.1,initialValue:.25,finishAnimation:!0},this.options=void 0,this.progressBar=void 0,this.showProgressBarTimeout=void 0,this.hideProgressBarTimeout=void 0,this.options={...this.defaults,...t2};const{className:e2,minValue:s2,initialValue:r,transition:n}=this.options;this.progressBar=new i({className:e2,minValue:s2,initialValue:r,animationDuration:n})}mount(){this.on("visit:start",this.startShowingProgress),this.on("page:view",this.stopShowingProgress)}startShowingProgress(){this.progressBar.setValue(0),this.showProgressBarAfterDelay()}stopShowingProgress(){this.progressBar.setValue(1),this.options.finishAnimation?this.finishAnimationAndHideProgressBar():this.hideProgressBar()}showProgressBar(){this.cancelHideProgressBarTimeout(),this.progressBar.show()}showProgressBarAfterDelay(){this.cancelShowProgressBarTimeout(),this.cancelHideProgressBarTimeout(),this.showProgressBarTimeout=window.setTimeout(this.showProgressBar.bind(this),this.options.delay)}hideProgressBar(){this.cancelShowProgressBarTimeout(),this.progressBar.hide()}finishAnimationAndHideProgressBar(){this.cancelShowProgressBarTimeout(),this.hideProgressBarTimeout=window.setTimeout(this.hideProgressBar.bind(this),this.options.transition)}cancelShowProgressBarTimeout(){window.clearTimeout(this.showProgressBarTimeout),delete this.showProgressBarTimeout}cancelHideProgressBarTimeout(){window.clearTimeout(this.hideProgressBarTimeout),delete this.hideProgressBarTimeout}}})}function initSwupSlideTheme(){(function(e,t){typeof exports=="object"&&typeof module<"u"?module.exports=t():typeof define=="function"&&define.amd?define(t):(e||self).SwupSlideTheme=t()})(this,function(){function e(){return e=Object.assign?Object.assign.bind():function(e2){for(var t2=1;t2<arguments.length;t2++){var s2=arguments[t2];for(var n2 in s2)Object.prototype.hasOwnProperty.call(s2,n2)&&(e2[n2]=s2[n2])}return e2},e.apply(this,arguments)}const t=e2=>String(e2).split(".").map(e3=>String(parseInt(e3||"0",10))).concat(["0","0"]).slice(0,3).join(".");class s{constructor(){this.isSwupPlugin=!0,this.swup=void 0,this.version=void 0,this.requires={},this.handlersToUnregister=[]}mount(){}unmount(){this.handlersToUnregister.forEach(e2=>e2()),this.handlersToUnregister=[]}_beforeMount(){if(!this.name)throw new Error("You must define a name of plugin when creating a class.")}_afterUnmount(){}_checkRequirements(){return typeof this.requires!="object"||Object.entries(this.requires).forEach(([e2,s2])=>{if(!function(e3,s3,n2){const i=function(e4,t2){var s4;if(e4==="swup")return(s4=t2.version)!=null?s4:"";{var n3;const s5=t2.findPlugin(e4);return(n3=s5?.version)!=null?n3:""}}(e3,n2);return!!i&&((e4,s4)=>s4.every(s5=>{const[,n3,i2]=s5.match(/^([\D]+)?(.*)$/)||[];var r,o;return((e5,t2)=>{const s6={"":e6=>e6===0,">":e6=>e6>0,">=":e6=>e6>=0,"<":e6=>e6<0,"<=":e6=>e6<=0};return(s6[t2]||s6[""])(e5)})((o=i2,r=t(r=e4),o=t(o),r.localeCompare(o,void 0,{numeric:!0})),n3||">=")}))(i,s3)}(e2,s2=Array.isArray(s2)?s2:[s2],this.swup)){const t2=`${e2} ${s2.join(", ")}`;throw new Error(`Plugin version mismatch: ${this.name} requires ${t2}`)}}),!0}on(e2,t2,s2={}){var n2;t2=!(n2=t2).name.startsWith("bound ")||n2.hasOwnProperty("prototype")?t2.bind(this):t2;const i=this.swup.hooks.on(e2,t2,s2);return this.handlersToUnregister.push(i),i}once(t2,s2,n2={}){return this.on(t2,s2,e({},n2,{once:!0}))}before(t2,s2,n2={}){return this.on(t2,s2,e({},n2,{before:!0}))}replace(t2,s2,n2={}){return this.on(t2,s2,e({},n2,{replace:!0}))}off(e2,t2){return this.swup.hooks.off(e2,t2)}}class n extends s{constructor(...e2){super(...e2),this._originalAnimationSelectorOption="",this._addedStyleElements=[],this._addedHTMLContent=[],this._classNameAddedToElements=[],this._addClassNameToElement=()=>{this._classNameAddedToElements.forEach(e3=>{Array.from(document.querySelectorAll(e3.selector)).forEach(t2=>{t2.classList.add(`swup-transition-${e3.name}`)})})}}_beforeMount(){this._originalAnimationSelectorOption=String(this.swup.options.animationSelector),this.swup.options.animationSelector='[class*="swup-transition-"]',this.swup.hooks.on("content:replace",this._addClassNameToElement)}_afterUnmount(){this.swup.options.animationSelector=this._originalAnimationSelectorOption,this._addedStyleElements.forEach(e2=>{e2.outerHTML=""}),this._addedStyleElements=[],this._addedHTMLContent.forEach(e2=>{e2.outerHTML=""}),this._addedHTMLContent=[],this._classNameAddedToElements.forEach(e2=>{Array.from(document.querySelectorAll(e2.selector)).forEach(e3=>{e3.className.split(" ").forEach(t2=>{new RegExp("^swup-transition-").test(t2)&&e3.classList.remove(t2)})})}),this.swup.hooks.off("content:replace",this._addClassNameToElement)}applyStyles(e2){const t2=document.createElement("style");t2.setAttribute("data-swup-theme",""),t2.appendChild(document.createTextNode(e2)),document.head.prepend(t2),this._addedStyleElements.push(t2)}applyHTML(e2){const t2=document.createElement("div");t2.innerHTML=e2,document.body.appendChild(t2),this._addedHTMLContent.push(t2)}addClassName(e2,t2){this._classNameAddedToElements.push({selector:e2,name:t2}),this._addClassNameToElement()}}return class extends n{constructor(e2){e2===void 0&&(e2={}),super(),this.name="SwupSlideTheme",this.defaults={mainElement:"#swup",reversed:!1},this.options={...this.defaults,...e2}}mount(){this.applyStyles("html{--swup-slide-theme-direction:1;--swup-slide-theme-translate:60px;--swup-slide-theme-duration-fade:.3s;--swup-slide-theme-duration-slide:.4s;--swup-slide-theme-translate-forward:calc(var(--swup-slide-theme-direction)*var(--swup-slide-theme-translate));--swup-slide-theme-translate-backward:calc(var(--swup-slide-theme-translate-forward)*-1)}html.swup-theme-reverse{--swup-slide-theme-direction:-1}html.is-changing .swup-transition-main{opacity:1;transform:translateZ(0);transition:opacity var(--swup-slide-theme-duration-fade),transform var(--swup-slide-theme-duration-slide)}html.is-animating .swup-transition-main{opacity:0;transform:translate3d(0,var(--swup-slide-theme-translate-backward),0)}html.is-animating.is-leaving .swup-transition-main{transform:translate3d(0,var(--swup-slide-theme-translate-forward),0)}"),this.addClassName(this.options.mainElement,"main"),this.options.reversed&&document.documentElement.classList.add("swup-theme-reverse")}unmount(){document.documentElement.classList.remove("swup-theme-reverse")}}})}function initSwupFadeTheme(){(function(e,t){typeof exports=="object"&&typeof module<"u"?module.exports=t():typeof define=="function"&&define.amd?define(t):(e||self).SwupFadeTheme=t()})(this,function(){function e(){return e=Object.assign?Object.assign.bind():function(e2){for(var t2=1;t2<arguments.length;t2++){var n2=arguments[t2];for(var s2 in n2)Object.prototype.hasOwnProperty.call(n2,s2)&&(e2[s2]=n2[s2])}return e2},e.apply(this,arguments)}const t=e2=>String(e2).split(".").map(e3=>String(parseInt(e3||"0",10))).concat(["0","0"]).slice(0,3).join(".");class n{constructor(){this.isSwupPlugin=!0,this.swup=void 0,this.version=void 0,this.requires={},this.handlersToUnregister=[]}mount(){}unmount(){this.handlersToUnregister.forEach(e2=>e2()),this.handlersToUnregister=[]}_beforeMount(){if(!this.name)throw new Error("You must define a name of plugin when creating a class.")}_afterUnmount(){}_checkRequirements(){return typeof this.requires!="object"||Object.entries(this.requires).forEach(([e2,n2])=>{if(!function(e3,n3,s2){const o=function(e4,t2){var n4;if(e4==="swup")return(n4=t2.version)!=null?n4:"";{var s3;const n5=t2.findPlugin(e4);return(s3=n5?.version)!=null?s3:""}}(e3,s2);return!!o&&((e4,n4)=>n4.every(n5=>{const[,s3,o2]=n5.match(/^([\D]+)?(.*)$/)||[];var i,r;return((e5,t2)=>{const n6={"":e6=>e6===0,">":e6=>e6>0,">=":e6=>e6>=0,"<":e6=>e6<0,"<=":e6=>e6<=0};return(n6[t2]||n6[""])(e5)})((r=o2,i=t(i=e4),r=t(r),i.localeCompare(r,void 0,{numeric:!0})),s3||">=")}))(o,n3)}(e2,n2=Array.isArray(n2)?n2:[n2],this.swup)){const t2=`${e2} ${n2.join(", ")}`;throw new Error(`Plugin version mismatch: ${this.name} requires ${t2}`)}}),!0}on(e2,t2,n2={}){var s2;t2=!(s2=t2).name.startsWith("bound ")||s2.hasOwnProperty("prototype")?t2.bind(this):t2;const o=this.swup.hooks.on(e2,t2,n2);return this.handlersToUnregister.push(o),o}once(t2,n2,s2={}){return this.on(t2,n2,e({},s2,{once:!0}))}before(t2,n2,s2={}){return this.on(t2,n2,e({},s2,{before:!0}))}replace(t2,n2,s2={}){return this.on(t2,n2,e({},s2,{replace:!0}))}off(e2,t2){return this.swup.hooks.off(e2,t2)}}class s extends n{constructor(...e2){super(...e2),this._originalAnimationSelectorOption="",this._addedStyleElements=[],this._addedHTMLContent=[],this._classNameAddedToElements=[],this._addClassNameToElement=()=>{this._classNameAddedToElements.forEach(e3=>{Array.from(document.querySelectorAll(e3.selector)).forEach(t2=>{t2.classList.add(`swup-transition-${e3.name}`)})})}}_beforeMount(){this._originalAnimationSelectorOption=String(this.swup.options.animationSelector),this.swup.options.animationSelector='[class*="swup-transition-"]',this.swup.hooks.on("content:replace",this._addClassNameToElement)}_afterUnmount(){this.swup.options.animationSelector=this._originalAnimationSelectorOption,this._addedStyleElements.forEach(e2=>{e2.outerHTML=""}),this._addedStyleElements=[],this._addedHTMLContent.forEach(e2=>{e2.outerHTML=""}),this._addedHTMLContent=[],this._classNameAddedToElements.forEach(e2=>{Array.from(document.querySelectorAll(e2.selector)).forEach(e3=>{e3.className.split(" ").forEach(t2=>{new RegExp("^swup-transition-").test(t2)&&e3.classList.remove(t2)})})}),this.swup.hooks.off("content:replace",this._addClassNameToElement)}applyStyles(e2){const t2=document.createElement("style");t2.setAttribute("data-swup-theme",""),t2.appendChild(document.createTextNode(e2)),document.head.prepend(t2),this._addedStyleElements.push(t2)}applyHTML(e2){const t2=document.createElement("div");t2.innerHTML=e2,document.body.appendChild(t2),this._addedHTMLContent.push(t2)}addClassName(e2,t2){this._classNameAddedToElements.push({selector:e2,name:t2}),this._addClassNameToElement()}}return class extends s{constructor(e2){e2===void 0&&(e2={}),super(),this.name="SwupFadeTheme",this.defaults={mainElement:"#swup"},this.options={...this.defaults,...e2}}mount(){this.applyStyles("html{--swup-fade-theme-duration:.4s}html.is-changing .swup-transition-main{opacity:1;transition:opacity var(--swup-fade-theme-duration)}html.is-animating .swup-transition-main{opacity:0}"),this.addClassName(this.options.mainElement,"main")}}})}var init_swup=__esm({"frontend/assets/js/dev/components/swup.js"(){}}),smoothPageTransitions_exports={};__export(smoothPageTransitions_exports,{initSmoothPageTransitions:()=>initSmoothPageTransitions});async function initSmoothPageTransitions(){initSwup(),initSwupHeadPlugin();let containerSelector,swupPlugins=[new SwupHeadPlugin];switch(config.jsVars.pageData.builder){case"elementor":containerSelector=".elementor";break;case"divi":containerSelector="#page-container";break;case"oxygen":containerSelector=".ct-inner-content";break;case"beaver":containerSelector=".fl-builder-content";break;case"bricks":containerSelector="#brx-content";break;case"block-editor":containerSelector=".wp-site-blocks";break;default:containerSelector="#swup";break}if(config.jsVars.settings.appCapabilities.smoothPageTransitions.progressBar==="on"){const{initSwupProgressBarPlugin:initSwupProgressBarPlugin2}=await Promise.resolve().then(()=>(init_swup(),swup_exports));initSwupProgressBarPlugin2(),swupPlugins.push(new SwupProgressPlugin),document.head.insertAdjacentHTML("beforeend","<style>.swup-progress-bar { background-color: "+config.jsVars.settings.webAppManifest.appearance.themeColor+" !important; }</style>")}if(config.jsVars.settings.appCapabilities.smoothPageTransitions.transition==="slide"){const{initSwupSlideTheme:initSwupSlideTheme2}=await Promise.resolve().then(()=>(init_swup(),swup_exports));initSwupSlideTheme2(),swupPlugins.push(new SwupSlideTheme({mainElement:containerSelector}))}else{const{initSwupFadeTheme:initSwupFadeTheme2}=await Promise.resolve().then(()=>(init_swup(),swup_exports));initSwupFadeTheme2(),swupPlugins.push(new SwupFadeTheme({mainElement:containerSelector}))}if(config.jsVars.settings.appCapabilities.smoothPageTransitions.compatibilityMode==="on"){const{initSwupScriptsPlugin:initSwupScriptsPlugin2}=await Promise.resolve().then(()=>(init_swup(),swup_exports));initSwupScriptsPlugin2(),swupPlugins.push(new SwupScriptsPlugin),containerSelector="#swup"}new Swup({containers:[containerSelector],plugins:swupPlugins})}var init_smoothPageTransitions=__esm({"frontend/assets/js/dev/modules/smoothPageTransitions.js"(){init_frontend(),init_swup()}}),pushNotificationsPrompt_exports={};__export(pushNotificationsPrompt_exports,{initPushNotificationsPrompt:()=>initPushNotificationsPrompt});async function initPushNotificationsPrompt(){customElements.get("pwa-push-notifications-prompt")||customElements.define("pwa-push-notifications-prompt",PwaPushNotificationsPrompt),PwaPushNotificationsPrompt.show()}var PwaPushNotificationsPrompt,init_pushNotificationsPrompt=__esm({"frontend/assets/js/dev/modules/pushNotificationsPrompt.js"(){init_frontend(),init_pushNotificationsSubscription(),init_utils(),PwaPushNotificationsPrompt=class _PwaPushNotificationsPrompt extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.styles=new Set}async connectedCallback(){this.render(),this.unsubscribe=pushNotificationsSubscription_default.subscribe(this.handleStateChange.bind(this)),this.handleSubscription(),this.handleDismiss()}handleStateChange(state){["subscribed","blocked","loading"].includes(state)?this.hide():state==="unsubscribed"&&_PwaPushNotificationsPrompt.show()}injectStyles(css){this.styles.add(css)}static show(){let pushNotificationsPrompt=document.querySelector("pwa-push-notifications-prompt");return pushNotificationsPrompt||(pushNotificationsPrompt=document.createElement("pwa-push-notifications-prompt"),document.body.appendChild(pushNotificationsPrompt)),requestAnimationFrame(()=>{const prompt=pushNotificationsPrompt.shadowRoot.querySelector(".push-notifications-prompt");setTimeout(()=>{prompt.classList.add("visible")},300)}),pushNotificationsPrompt}hide(){const prompt=this.shadowRoot.querySelector(".push-notifications-prompt");prompt.classList.remove("visible"),prompt.addEventListener("transitionend",()=>{this.remove()},{once:!0})}handleSubscription(){this.shadowRoot.querySelector(".push-notifications-prompt-button_allow").addEventListener("click",async()=>{try{await pushNotificationsSubscription_default.addSubscription()}catch(error){console.error(error)}})}handleDismiss(){this.shadowRoot.querySelector(".push-notifications-prompt-button_dismiss").addEventListener("click",async()=>{this.hide()})}render(){var _a,_b,_c,_d,_e,_f,_g;const themeColor=(_c=(_b=(_a=config.jsVars.settings.webAppManifest)==null?void 0:_a.appearance)==null?void 0:_b.themeColor)!=null?_c:"#000000",backgroundColor=getContrastTextColor(themeColor),textColor=getContrastTextColor(backgroundColor),promptMessage=(_f=(_e=(_d=config.jsVars.settings.pushNotifications)==null?void 0:_d.prompt)==null?void 0:_e.message)!=null?_f:wp.i18n.__("We would like to show you notifications for the latest news and updates.",config.jsVars.slug),appName=(_g=config.jsVars.settings.webAppManifest.appIdentity.appName)!=null?_g:"",appIconHtml=config.jsVars.iconUrl?`<img class="push-notifications-prompt-media_icon" src="${config.jsVars.iconUrl}" alt="${appName}" onerror="this.style.display='none'"/>`:"";this.injectStyles(`
      .push-notifications-prompt {
        position: fixed;
        top: 0;
        left: 50%;
        -webkit-transform: translateX(-50%) translateY(-100%);
            -ms-transform: translateX(-50%) translateY(-100%);
                transform: translateX(-50%) translateY(-100%);
        padding: 1rem;
        width: 25rem;
        max-width: 85%;
        background-color: ${backgroundColor};
        color: ${textColor};
        border: 1px solid ${textColor}15;
        border-radius: 0.75rem;
        -webkit-box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
                box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        z-index: 9999999999999999;
        -webkit-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        -o-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0;
        visibility: hidden;
      }

      .push-notifications-prompt.visible {
        opacity: 1;
        visibility: visible;
        -webkit-transform: translateX(-50%) translateY(1rem);
            -ms-transform: translateX(-50%) translateY(1rem);
                transform: translateX(-50%) translateY(1rem);
      }

      .push-notifications-prompt-media {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex: 1;
      }

      .push-notifications-prompt-media_icon {
        border-radius: 9999px;
        border: 1px solid #e5e7eb;
        flex-shrink: 0;
        height: 50px;
        width: 50px;
        display: inline-block;
      }

      .push-notifications-prompt-media_texts {
        flex: 1;
        min-width: 0;
      }

      .push-notifications-prompt-media_title {
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-weight: 500;
        color: ${textColor};
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }

      .push-notifications-prompt-media_message {
        font-size: 0.75rem;
        line-height: 1rem;
        font-weight: 400;
        color: ${textColor}cc;
        margin-top: 0.12rem;
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }

      .push-notifications-prompt-buttons {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.75rem;
        margin-top: 1.25rem;
      }

      .push-notifications-prompt-button_dismiss {
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: ${textColor}59;
        background: none;
        font-weight: 600;
        border: none;
        outline: none;
        padding: 0;
        margin: 0;
        cursor: pointer;
      }

      .push-notifications-prompt-button_allow {
        display: block;
        background-color: ${themeColor};
        color: ${backgroundColor};
        vertical-align: middle;
        text-decoration: none;
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-weight: 600;
        padding: 0.375rem 0.875rem;
        border: none;
        outline: none;
        border-radius: 9999px;
        cursor: pointer;
      }

      .push-notifications-prompt-button_allow:hover {
        opacity: 0.8;
      }
    `);const combinedStyles=Array.from(this.styles).join(`
`);this.shadowRoot.innerHTML=`
      <style>${combinedStyles}</style>
      <div class="push-notifications-prompt">
        <div class="push-notifications-prompt-media">
          ${appIconHtml}
          <div class="push-notifications-prompt-media_texts">
            <div class="push-notifications-prompt-media_title">${wp.i18n.__("Push Notifications",config.jsVars.slug)}</div>
            <div class="push-notifications-prompt-media_message">${promptMessage}</div>
          </div>
        </div>
        <div class="push-notifications-prompt-buttons">
          <button type="button" class="push-notifications-prompt-button_dismiss">
            ${wp.i18n.__("Dismiss",config.jsVars.slug)}
          </button>
          <button type="button" class="push-notifications-prompt-button_allow">
            ${wp.i18n.__("Allow Notifications",config.jsVars.slug)}
          </button>
        </div>
      </div>
    `}}}}),pushNotificationsButton_exports={};__export(pushNotificationsButton_exports,{initPushNotificationsButton:()=>initPushNotificationsButton});async function initPushNotificationsButton(){customElements.get("pwa-push-notifications-button")||customElements.define("pwa-push-notifications-button",PwaPushNotificationsButton),PwaPushNotificationsButton.show()}var PwaPushNotificationsButton,init_pushNotificationsButton=__esm({"frontend/assets/js/dev/modules/pushNotificationsButton.js"(){init_frontend(),init_pushNotificationsSubscription(),init_utils(),PwaPushNotificationsButton=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.styles=new Set,this.position=config.jsVars.settings.pushNotifications.button.position,this.behavior=config.jsVars.settings.pushNotifications.button.behavior,this.icons={subscribe:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>',unsubscribe:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742"/><path d="m2 2 20 20"/><path d="M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05"/></svg>'}}async connectedCallback(){this.render(),this.unsubscribe=pushNotificationsSubscription_default.subscribe(this.handleStateChange.bind(this)),this.handleSubscription()}static show(){let pushNotificationsButton=document.querySelector("pwa-push-notifications-button");return pushNotificationsButton||(pushNotificationsButton=document.createElement("pwa-push-notifications-button"),document.body.appendChild(pushNotificationsButton)),pushNotificationsButton}injectStyles(css){this.styles.add(css)}handleStateChange(state){const iconSpan=this.shadowRoot.querySelector(".push-notifications-button_icon"),spinner=this.shadowRoot.querySelector(".push-notifications-button_spinner"),pushButton=this.shadowRoot.querySelector(".push-notifications-button");switch(state){case"loading":iconSpan.style.display="none",spinner.style.display="block",pushButton.classList.add("-disabled");break;case"subscribed":iconSpan.style.display="flex",spinner.style.display="none",pushButton.classList.remove("-disabled"),iconSpan.innerHTML=this.icons.unsubscribe,this.behavior==="hidden"&&this.remove();break;case"unsubscribed":iconSpan.style.display="flex",spinner.style.display="none",pushButton.classList.remove("-disabled"),iconSpan.innerHTML=this.icons.subscribe;break;case"blocked":iconSpan.style.display="flex",spinner.style.display="none",iconSpan.innerHTML=this.icons.subscribe,Notification.permission==="denied"&&this.remove();break}}handleSubscription(){this.shadowRoot.querySelector(".push-notifications-button").addEventListener("click",async()=>{try{pushNotificationsSubscription_default.currentState==="subscribed"?await pushNotificationsSubscription_default.removeSubscription():pushNotificationsSubscription_default.currentState==="unsubscribed"&&await pushNotificationsSubscription_default.addSubscription()}catch(error){console.error(error)}})}render(){var _a,_b,_c;const themeColor=(_c=(_b=(_a=config.jsVars.settings.webAppManifest)==null?void 0:_a.appearance)==null?void 0:_b.themeColor)!=null?_c:"#000000",iconColor=getContrastTextColor(themeColor),positionStyles={"bottom-right":document.querySelector("pwa-navigation-tab-bar")?"bottom: 70px; right: 20px;":"bottom: 20px; right: 20px;","bottom-left":document.querySelector("pwa-navigation-tab-bar")?"bottom: 70px; left: 20px;":"bottom: 20px; left: 20px;","top-right":"top: 20px; right: 20px;","top-left":"top: 20px; left: 20px;"}[this.position];this.injectStyles(`
      .push-notifications-button {
        position: fixed;
        ${positionStyles}
        z-index: 999;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        width: 50px;
        height: 50px;
        background: ${themeColor};
        border: none;
        border-radius: 50%;
        cursor: pointer;
        -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }

      .push-notifications-button:hover {
        opacity: 0.8;
      }

      .push-notifications-button.-disabled {
        pointer-events: none !important;
      }
  
      .push-notifications-button_icon {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        width: 1.25rem;
        height: 1.25rem;
        color: ${iconColor};
      }

      .push-notifications-button_spinner {
        display: none;
        width: 1rem;
        height: 1rem;
        border: 2px solid ${iconColor}40;
        border-top-color: ${iconColor};
        border-radius: 50%;
        -webkit-animation: spinner 0.8s linear infinite;
                animation: spinner 0.8s linear infinite;
      }

      @-webkit-keyframes spinner {
        to {
          -webkit-transform: rotate(360deg);
                  transform: rotate(360deg);
        }
      }

      @keyframes spinner {
        to {
          -webkit-transform: rotate(360deg);
                  transform: rotate(360deg);
        }
      }
    `);const combinedStyles=Array.from(this.styles).join(`
`);this.shadowRoot.innerHTML=`
      <style>${combinedStyles}</style>
      <div class="push-notifications-button" aria-label="${wp.i18n.__("Enable / Disable Push Notifications")}">
        <span class="push-notifications-button_spinner"></span>
        <span class="push-notifications-button_icon"></span>
      </div>
    `}}}}),offlineNotification_exports={};__export(offlineNotification_exports,{initOfflineNotification:()=>initOfflineNotification});async function initOfflineNotification(){customElements.get("pwa-offline-notification")||customElements.define("pwa-offline-notification",PwaOfflineNotification),navigator.onLine||PwaOfflineNotification.showReconnecting(),window.addEventListener("offline",()=>{PwaOfflineNotification.showReconnecting()}),window.addEventListener("online",()=>{PwaOfflineNotification.showReconnected()})}var PwaOfflineNotification,init_offlineNotification=__esm({"frontend/assets/js/dev/modules/offlineNotification.js"(){init_frontend(),init_utils(),PwaOfflineNotification=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.styles=new Set}connectedCallback(){this.render()}injectStyles(css){this.styles.add(css)}static showReconnecting(){let offlineNotification=document.querySelector("pwa-offline-notification");return offlineNotification||(offlineNotification=document.createElement("pwa-offline-notification"),document.body.appendChild(offlineNotification)),requestAnimationFrame(()=>{const notification=offlineNotification.shadowRoot.querySelector(".offline-notification"),icon=notification.querySelector(".offline-notification_icon"),text=notification.querySelector(".offline-notification_text");notification.classList.remove("reconnected"),icon.classList.add("spinner"),icon.classList.remove("success"),text.textContent=wp.i18n.__("Connection lost. Attempting to reconnect...",config.jsVars.slug),setTimeout(()=>{notification.classList.add("visible")},300)}),offlineNotification}static showReconnected(){const offlineNotification=document.querySelector("pwa-offline-notification");if(!offlineNotification)return;const notification=offlineNotification.shadowRoot.querySelector(".offline-notification"),icon=notification.querySelector(".offline-notification_icon"),text=notification.querySelector(".offline-notification_text");notification.classList.add("reconnected"),icon.classList.remove("spinner"),icon.classList.add("success"),text.textContent=wp.i18n.__("Successfully reconnected to the internet!",config.jsVars.slug),offlineNotification._removeTimeout&&clearTimeout(offlineNotification._removeTimeout),offlineNotification._removeTimeout=setTimeout(()=>{notification.classList.remove("visible"),notification.addEventListener("transitionend",()=>{offlineNotification.remove()},{once:!0})},2e3)}render(){var _a,_b,_c;const themeColor=(_c=(_b=(_a=config.jsVars.settings.webAppManifest)==null?void 0:_a.appearance)==null?void 0:_b.themeColor)!=null?_c:"#000000",backgroundColor=getContrastTextColor(themeColor),textColor=getContrastTextColor(backgroundColor);this.injectStyles(`
      .offline-notification {
        position: fixed;
        top: 0;
        left: 50%;
        -webkit-transform: translateX(-50%) translateY(-100%);
            -ms-transform: translateX(-50%) translateY(-100%);
                transform: translateX(-50%) translateY(-100%);
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        padding: 0.75rem 1rem;
        gap: 0.75rem;
        width: 30rem;
        max-width: 85%;
        background-color: ${backgroundColor};
        color: ${textColor};
        border: 1px solid ${textColor}15;
        border-radius: 0.75rem;
        -webkit-box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
                box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        z-index: 9999999999999999;
        -webkit-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        -o-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0;
        visibility: hidden;
      }

      .offline-notification.visible {
        opacity: 1;
        visibility: visible;
        -webkit-transform: translateX(-50%) translateY(1rem);
            -ms-transform: translateX(-50%) translateY(1rem);
                transform: translateX(-50%) translateY(1rem);
      }

      .offline-notification_icon {
        display: inline-block;
        flex-shrink: 0;
        width: 12px;
        height: 12px;
        border-radius: 9999px;
      }

      .offline-notification_icon.spinner {
        -webkit-animation: spin 1s linear infinite;
                animation: spin 1s linear infinite;
        border: 3px solid ${themeColor};
        border-top-color: transparent;
      }

      .offline-notification_icon.success {
        background-color: #22c55e;
        border-radius: 9999px;
      }

      .offline-notification_text {
        font-size: 0.875rem;
        line-height: 1.25rem;
      }

      @-webkit-keyframes spin {
        to {
          -webkit-transform: rotate(360deg);
                  transform: rotate(360deg);
        }
      }

      @keyframes spin {
        to {
          -webkit-transform: rotate(360deg);
                  transform: rotate(360deg);
        }
      }
    `);const combinedStyles=Array.from(this.styles).join(`
`);this.shadowRoot.innerHTML=`
      <style>${combinedStyles}</style>
      <div class="offline-notification" role="alert" tabindex="-1">
        <div class="offline-notification_icon spinner" role="status" aria-label="loading"></div>
        <span class="offline-notification_text">
          ${wp.i18n.__("Connection lost. Attempting to reconnect...",config.jsVars.slug)}
        </span>
      </div>
    `}}}}),offlineForms_exports={};__export(offlineForms_exports,{initOfflineForms:()=>initOfflineForms});function handleFormSubmit(e){if(!navigator.onLine){e.preventDefault(),e.stopPropagation();const form=e.target,formData2=new FormData(form),submitData={formId:form.id||`pwa-form-${Math.random().toString(36).slice(2,9)}`,submitId:`${form.id}-${Date.now()}`,url:form.action||window.location.href,method:(form.method||"POST").toUpperCase(),timestamp:Date.now(),data:Object.fromEntries(formData2),contentType:form.enctype||"application/x-www-form-urlencoded"};PwaOfflineFormHandler.show(submitData)}}async function initOfflineForms(){customElements.get("pwa-offline-form-handler")||customElements.define("pwa-offline-form-handler",PwaOfflineFormHandler),document.querySelectorAll("form:not([data-no-offline])").forEach(form=>{form.addEventListener("submit",handleFormSubmit,!0)}),navigator.onLine&&PwaOfflineFormHandler.submitStoredForms(),window.addEventListener("online",()=>{PwaOfflineFormHandler.submitStoredForms()})}var PwaOfflineFormHandler,init_offlineForms=__esm({"frontend/assets/js/dev/modules/offlineForms.js"(){init_frontend(),init_utils(),PwaOfflineFormHandler=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.styles=new Set,this.formData=null}connectedCallback(){this.render(),this.setupEventHandlers()}injectStyles(css){this.styles.add(css)}static show(formData2){let handler=document.querySelector("pwa-offline-form-handler");return handler||(handler=document.createElement("pwa-offline-form-handler"),handler.formData=formData2,document.body.appendChild(handler),requestAnimationFrame(()=>{const backdrop=handler.shadowRoot.querySelector(".offline-form-handler");document.documentElement.style.paddingRight=`${window.innerWidth-document.documentElement.offsetWidth}px`,document.documentElement.style.overflow="hidden",backdrop.classList.add("visible")})),handler}setupEventHandlers(){const cancelButton=this.shadowRoot.querySelector(".offline-form-handler-footer-button.-cancel"),proceedButton=this.shadowRoot.querySelector(".offline-form-handler-footer-button.-proceed"),container=this.shadowRoot.querySelector(".offline-form-handler-container"),backdrop=this.shadowRoot.querySelector(".offline-form-handler"),handleClose=()=>{backdrop.classList.remove("visible"),backdrop.addEventListener("transitionend",()=>{document.documentElement.style.removeProperty("overflow"),document.documentElement.style.paddingRight="",this.remove()},{once:!0})},handleProceed=async()=>{container.classList.add("-proceeding"),await this.storeFormSubmission(this.formData),handleClose()};cancelButton.addEventListener("click",handleClose),proceedButton.addEventListener("click",handleProceed),backdrop.addEventListener("click",e=>{e.target===backdrop&&handleClose()})}async storeFormSubmission(data){try{const storedForms=JSON.parse(localStorage.getItem("pwaOfflineForms"))||{};return storedForms[data.submitId]=data,localStorage.setItem("pwaOfflineForms",JSON.stringify(storedForms)),!0}catch(error){return console.error("Failed to store form data:",error),!1}}static async submitStoredForms(){const processingKey="pwaOfflineFormsProcessing",processingStart=localStorage.getItem(processingKey);if(processingStart&&Date.now()-parseInt(processingStart)>60*1e3&&localStorage.removeItem(processingKey),!localStorage.getItem(processingKey))try{localStorage.setItem(processingKey,Date.now().toString());let storedForms=JSON.parse(localStorage.getItem("pwaOfflineForms"))||{};for(const submitId in storedForms){const storedForm=storedForms[submitId];if(Date.now()-storedForm.timestamp>24*60*60*1e3){delete storedForms[submitId];continue}try{await this.submitForm(storedForm),delete storedForms[submitId]}catch(error){console.error("Failed to submit stored form:",error),!error.message.includes("Failed to fetch")&&!error.message.includes("NetworkError")&&delete storedForms[submitId]}localStorage.setItem("pwaOfflineForms",JSON.stringify(storedForms))}}catch(error){console.error("Error processing offline forms:",error)}finally{localStorage.removeItem(processingKey)}}static async submitForm(storedForm){const{url,method,data,contentType}=storedForm,isGet=method.toUpperCase()==="GET";let finalUrl=url,body;const headers=new Headers({"X-Requested-With":"XMLHttpRequest"});if(typeof wpApiSettings<"u"&&wpApiSettings.nonce&&headers.append("X-WP-Nonce",wpApiSettings.nonce),isGet){const params=new URLSearchParams;Object.entries(data).forEach(([key,value])=>{Array.isArray(value)?value.forEach(item=>params.append(`${key}[]`,item)):params.append(key,value)}),finalUrl=`${url}${url.includes("?")?"&":"?"}${params.toString()}`}else if(contentType.includes("multipart/form-data"))body=new FormData,Object.entries(data).forEach(([key,value])=>{Array.isArray(value)?value.forEach(item=>body.append(`${key}[]`,item)):body.append(key,value)});else if(headers.append("Content-Type",contentType),contentType.includes("json"))body=JSON.stringify(data);else{const params=new URLSearchParams;Object.entries(data).forEach(([key,value])=>{Array.isArray(value)?value.forEach(item=>params.append(`${key}[]`,item)):params.append(key,value)}),body=params.toString()}const fetchOptions={method,headers,credentials:"same-origin"};isGet||(fetchOptions.body=body);const response=await fetch(finalUrl,fetchOptions);if(!response.ok)throw new Error(`Server returned ${response.status}: ${response.statusText}`);return response}render(){var _a,_b,_c;const themeColor=(_c=(_b=(_a=config.jsVars.settings.webAppManifest)==null?void 0:_a.appearance)==null?void 0:_b.themeColor)!=null?_c:"#000000",backgroundColor=getContrastTextColor(themeColor),textColor=getContrastTextColor(backgroundColor);this.injectStyles(`
      .offline-form-handler {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999999;
        background: rgba(0, 0, 0, 0);
        -webkit-backdrop-filter: blur(0px);
                backdrop-filter: blur(0px);
        -webkit-transition: all 0.2s ease-out;
        -o-transition: all 0.2s ease-out;
        transition: all 0.2s ease-out;
        opacity: 0;
        visibility: hidden;
      }

      .offline-form-handler.visible {      
        background: rgba(0, 0, 0, 0.7);
        -webkit-backdrop-filter: blur(5px);
                backdrop-filter: blur(5px);
        opacity: 1;
        visibility: visible;
      }

      .offline-form-handler-container {
        position: fixed;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, calc(-50% + 20px));
            -ms-transform: translate(-50%, calc(-50% + 20px));
                transform: translate(-50%, calc(-50% + 20px));
        background: ${backgroundColor};
        border-radius: 10px;
        -webkit-box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        max-width: 29rem;
        width: 95%;
        padding: 0.75rem 1rem;
        overflow: hidden;
        opacity: 0;
        -webkit-transition: all 0.15s ease-out;
        -o-transition: all 0.15s ease-out;
        transition: all 0.15s ease-out;
        z-index: 999999999999999999999;
      }

      .offline-form-handler.visible .offline-form-handler-container {
        -webkit-transform: translate(-50%, -50%);
            -ms-transform: translate(-50%, -50%);
                transform: translate(-50%, -50%);
        opacity: 1;
      }

      .offline-form-handler.visible:has(.offline-form-handler-container.-proceeding) {
        pointer-events: none;
      }

      .offline-form-handler.visible .offline-form-handler-container.-proceeding {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
            -ms-flex-direction: column;
                flex-direction: column;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
      }

      .offline-form-handler.visible .offline-form-handler-container.-proceeding::before {
        content: '';
        position: absolute;
        background: rgb(255 255 255 / 0.5);
        z-index: 2;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }

      .offline-form-handler.visible .offline-form-handler-container.-proceeding::after {
        content: '';
        position: absolute;
        display: inline-block;
        border: 3px solid ${themeColor};
        border-top-color: transparent;
        border-radius: 9999px;
        width: 1.5rem;
        height: 1.5rem;
        z-index: 5;
        -webkit-animation: spin 1s linear infinite;
                animation: spin 1s linear infinite;
      }

      .offline-form-handler-header {
        width: 100%;
      }

      .offline-form-handler-header-texts {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        gap: 0.5rem;
      }

      .offline-form-handler-header-texts_icon {
        width: 1.5rem;
        height: 1.5rem;
        color: ${textColor}b3;
      }

      .offline-form-handler-header-texts_title {
        font-size: 1.125rem;
        line-height: 1.75rem;
        font-weight: 500;
        color: ${textColor};
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }

      .offline-form-handler-body {
        margin-top: 0.75rem;
        overflow-y: auto;
        max-height: 34rem;
      }

      .offline-form-handler-body_message {
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: ${textColor}b3;
      }

      .offline-form-handler-footer {
        margin-top: 0.75rem;
        width: 100%;
      }

      .offline-form-handler-footer-buttons {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: end;
            -ms-flex-pack: end;
                justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 1rem;
      }

      .offline-form-handler-footer-button {
        display: -webkit-inline-box;
        display: -ms-inline-flexbox;
        display: inline-flex;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        padding: 0.5rem 0.75rem;
        font-weight: 500;
        font-size: 0.75rem;
        line-height: 1rem;
        border-radius: 0.5rem;
        -webkit-transition: all 0.1s ease;
        -o-transition: all 0.1s ease;
        transition: all 0.1s ease;
        cursor: pointer;
        outline: none;
        border: none;
      }

      .offline-form-handler-footer-button:hover {
        opacity: 0.8;
      }

      .offline-form-handler-footer-button:focus {
        outline: none;
        border: none;
      }

      .offline-form-handler-footer-button.-cancel {
        -webkit-box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
                box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        color: ${textColor};
        background: ${backgroundColor};
        border: 1px solid ${textColor}1a;
      }

      .offline-form-handler-footer-button.-proceed {
        color: ${backgroundColor};
        background: ${themeColor};
      }

      @media (max-width: 700px) {
        .offline-form-handler-container {
          max-width: 100%;
          top: unset;
          bottom: 0;
          left: 0;
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
          -webkit-box-shadow: none;
                  box-shadow: none;
          opacity: 1;
          -webkit-transform: translateY(100%);
              -ms-transform: translateY(100%);
                  transform: translateY(100%);
        } 

        .offline-form-handler.visible .offline-form-handler-container {
          -webkit-transform: translateY(0);
              -ms-transform: translateY(0);
                  transform: translateY(0);
        }

        .offline-form-handler-footer-buttons {
          -webkit-box-orient: vertical;
          -webkit-box-direction: reverse;
              -ms-flex-direction: column-reverse;
                  flex-direction: column-reverse;
        }

        .offline-form-handler-footer-button {
          padding: 0.75rem;
        }
      }

      @-webkit-keyframes spin {
        to {
          -webkit-transform: rotate(360deg);
                  transform: rotate(360deg);
        }
      }

      @keyframes spin {
        to {
          -webkit-transform: rotate(360deg);
                  transform: rotate(360deg);
        }
      }
    `);const combinedStyles=Array.from(this.styles).join(`
`);this.shadowRoot.innerHTML=`
      <style>${combinedStyles}</style>
      <div class="offline-form-handler">
        <div class="offline-form-handler-container">
          <div class="offline-form-handler-header">
            <div class="offline-form-handler-header-texts">
              <svg class="offline-form-handler-header-texts_icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wifi-off"><path d="M12 20h.01"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/><path d="M5 12.859a10 10 0 0 1 5.17-2.69"/><path d="M19 12.859a10 10 0 0 0-2.007-1.523"/><path d="M2 8.82a15 15 0 0 1 4.177-2.643"/><path d="M22 8.82a15 15 0 0 0-11.288-3.764"/><path d="m2 2 20 20"/></svg>
              <div class="offline-form-handler-header-texts_title">${wp.i18n.__("No Internet Connection",config.jsVars.slug)}</div>
            </div>
          </div>
          <div class="offline-form-handler-body">
            <div class="offline-form-handler-body_message">${wp.i18n.__("You\u2019re currently offline. Your form submission data will be saved and be automatically processed in the background when you\u2019re back online within 24 hours. Would you like to proceed?",config.jsVars.slug)}</div>
          </div>
          <div class="offline-form-handler-footer">
            <div class="offline-form-handler-footer-buttons">
              <button type="button" class="offline-form-handler-footer-button -cancel">
                Cancel
              </button>
              <button type="button" class="offline-form-handler-footer-button -proceed">
                Yes, Please
              </button>
            </div>
          </div>
        </div>
      </div>
    `}}}}),pullDownRefresh_exports={};__export(pullDownRefresh_exports,{initPullDownRefresh:()=>initPullDownRefresh});async function initPullDownRefresh(){document.body.style.overscrollBehaviorY="contain",customElements.get("pwa-pull-down-refresh")||customElements.define("pwa-pull-down-refresh",PwaPullDownRefresh),PwaPullDownRefresh.show()}var PwaPullDownRefresh,init_pullDownRefresh=__esm({"frontend/assets/js/dev/modules/pullDownRefresh.js"(){init_frontend(),init_utils(),PwaPullDownRefresh=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.styles=new Set,this.tracking=!1,this.refreshing=!1,this.startY=0,this.currentY=0,this.dragResistance=.4,this.threshold=70}connectedCallback(){this.render(),this.setupEventListeners()}static show(){let pullDownRefresh=document.querySelector("pwa-pull-down-refresh");return pullDownRefresh||(pullDownRefresh=document.createElement("pwa-pull-down-refresh"),document.body.insertAdjacentElement("afterbegin",pullDownRefresh)),pullDownRefresh}injectStyles(css){this.styles.add(css)}setupEventListeners(){document.addEventListener("touchstart",this.handleTouchStart.bind(this),{passive:!1}),document.addEventListener("touchmove",this.handleTouchMove.bind(this),{passive:!1}),document.addEventListener("touchend",this.handleTouchEnd.bind(this))}handleTouchStart(e){if(window.scrollY!==0)return;const touchY=e.touches[0].pageY;this._touchStartY=touchY;const refreshContainer=this.shadowRoot.querySelector(".pull-down-refresh");refreshContainer.style.transition="none";const currentHeight=refreshContainer.offsetHeight;currentHeight>0?(refreshContainer.style.height=`${currentHeight}px`,this.startY=touchY-currentHeight):this.startY=touchY,this.currentY=this.startY,this.tracking=!0,refreshContainer.style.visibility="visible",refreshContainer.offsetHeight}handleTouchMove(e){if(!this.tracking)return;this.currentY=e.touches[0].pageY;const pullDistance=(this.currentY-this.startY)*this.dragResistance;if(pullDistance>=0){this.currentY-this.startY>10&&e.preventDefault();const refreshContainer=this.shadowRoot.querySelector(".pull-down-refresh"),statusText=this.shadowRoot.querySelector(".pull-down-refresh_text");refreshContainer.style.transition="none",refreshContainer.style.height=`${pullDistance}px`,pullDistance>this.threshold?statusText.textContent=wp.i18n.__("Release to refresh",config.jsVars.slug):statusText.textContent=wp.i18n.__("Pull down to refresh",config.jsVars.slug)}}async handleTouchEnd(){if(!this.tracking)return;this.tracking=!1;const pullDistance=(this.currentY-this.startY)*this.dragResistance,refreshContainer=this.shadowRoot.querySelector(".pull-down-refresh"),statusText=this.shadowRoot.querySelector(".pull-down-refresh_text"),spinner=this.shadowRoot.querySelector(".pull-down-refresh_spinner");refreshContainer.style.transition="height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",pullDistance>this.threshold?(this.refreshing=!0,refreshContainer.style.height="60px",statusText.textContent=wp.i18n.__("Refreshing...",config.jsVars.slug),spinner.style.display="block",location.reload()):this.resetPosition()}resetPosition(){const refreshContainer=this.shadowRoot.querySelector(".pull-down-refresh");refreshContainer.style.transition="height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",refreshContainer.style.height="0",refreshContainer.addEventListener("transitionend",()=>{refreshContainer.style.transition="",refreshContainer.style.visibility="hidden",this.tracking=!1,this.refreshing=!1},{once:!0})}render(){var _a,_b,_c;const themeColor=(_c=(_b=(_a=config.jsVars.settings.webAppManifest)==null?void 0:_a.appearance)==null?void 0:_b.themeColor)!=null?_c:"#000000",textColor=getContrastTextColor(themeColor);this.injectStyles(`
      :host {
        display: block;
        width: 100%;
        overflow: hidden;
      }

      .pull-down-refresh {
        height: 0;
        visibility: hidden;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        background-color: ${themeColor};
        color: ${textColor};
        gap: 0.5rem;
        overflow: hidden;
        will-change: height;
      }

      .pull-down-refresh_content {
        padding: 1rem;
       display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        gap: 0.75rem;
        min-height: 60px;
      }

      .pull-down-refresh_spinner {
        display: none;
        width: 0.75rem;
        height: 0.75rem;
        border: 0.1875rem solid ${textColor};
        border-top-color: transparent;
        border-radius: 9999px;
        -webkit-animation: spin 1s linear infinite;
                animation: spin 1s linear infinite;
      }

      .pull-down-refresh_text {
        font-size: 0.875rem;
        line-height: 1.25rem;
      }

      @-webkit-keyframes spin {
        to {
          -webkit-transform: rotate(360deg);
                  transform: rotate(360deg);
        }
      }

      @keyframes spin {
        to {
          -webkit-transform: rotate(360deg);
                  transform: rotate(360deg);
        }
      }
    `);const combinedStyles=Array.from(this.styles).join(`
`);this.shadowRoot.innerHTML=`
      <style>${combinedStyles}</style>
      <div class="pull-down-refresh" role="alert">
        <div class="pull-down-refresh_content">
          <div class="pull-down-refresh_spinner" role="status" aria-label="loading"></div>
          <span class="pull-down-refresh_text">
            ${wp.i18n.__("Pull down to refresh",config.jsVars.slug)}
          </span>
        </div>
      </div>
    `}}}}),shakeRefresh_exports={};__export(shakeRefresh_exports,{initShakeRefresh:()=>initShakeRefresh});async function initShakeRefresh(){customElements.get("pwa-shake-refresh")||customElements.define("pwa-shake-refresh",PwaShakeRefresh),PwaShakeRefresh.show()}var PwaShakeRefresh,init_shakeRefresh=__esm({"frontend/assets/js/dev/modules/shakeRefresh.js"(){init_frontend(),init_utils(),PwaShakeRefresh=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.styles=new Set}connectedCallback(){this.render(),this.handleDetectShake()}static show(){let shakeRefresh=document.querySelector("pwa-shake-refresh");return shakeRefresh||(shakeRefresh=document.createElement("pwa-shake-refresh"),document.body.appendChild(shakeRefresh)),shakeRefresh}injectStyles(css){this.styles.add(css)}handleDetectShake(){let x1=0,y1=0,z1=0,x2=0,y2=0,z2=0;window.addEventListener("devicemotion",e=>{x1=e.accelerationIncludingGravity.x,y1=e.accelerationIncludingGravity.y,z1=e.accelerationIncludingGravity.z},!1);const component=this;setInterval(()=>{Math.abs(x1-x2+y1-y2+z1-z2)>16&&(component.shadowRoot.querySelector(".shake-notification").classList.add("visible"),setTimeout(()=>location.reload(),500)),x2=x1,y2=y1,z2=z1},200)}render(){var _a,_b,_c;const backgroundColor=(_c=(_b=(_a=config.jsVars.settings.webAppManifest)==null?void 0:_a.appearance)==null?void 0:_b.backgroundColor)!=null?_c:"#ffffff",textColor=getContrastTextColor(backgroundColor);this.injectStyles(`
      .shake-notification {
        position: fixed;
        top: 0;
        left: 50%;
        -webkit-transform: translateX(-50%) translateY(-100%);
            -ms-transform: translateX(-50%) translateY(-100%);
                transform: translateX(-50%) translateY(-100%);
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        padding: 0.75rem 1rem;
        gap: 0.5rem;
        width: 30rem;
        max-width: 85%;
        background-color: ${backgroundColor};
        color: ${textColor};
        border: 1px solid ${textColor}15;
        border-radius: 0.75rem;
        -webkit-box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
                box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        z-index: 9999999999999999;
        -webkit-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        -o-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0;
      }

      .shake-notification.visible {
        opacity: 1;
        -webkit-transform: translateX(-50%) translateY(1rem);
            -ms-transform: translateX(-50%) translateY(1rem);
                transform: translateX(-50%) translateY(1rem);
      }

      .shake-notification_spinner {
        width: 0.75rem;
        height: 0.75rem;
        border: 0.1875rem solid ${textColor};
        border-top-color: transparent;
        border-radius: 9999px;
        -webkit-animation: spin 1s linear infinite;
                animation: spin 1s linear infinite;
      }

      .shake-notification_text {
        font-size: 0.875rem;
        line-height: 1.25rem;
      }

      @-webkit-keyframes spin {
        to {
          -webkit-transform: rotate(360deg);
                  transform: rotate(360deg);
        }
      }

      @keyframes spin {
        to {
          -webkit-transform: rotate(360deg);
                  transform: rotate(360deg);
        }
      }
    `);const combinedStyles=Array.from(this.styles).join(`
`);this.shadowRoot.innerHTML=`
      <style>${combinedStyles}</style>
      <div class="shake-notification" role="alert">
        <div class="shake-notification_spinner" role="status" aria-label="loading"></div>
        <span class="shake-notification_text">
          ${wp.i18n.__("Shake detected! Refreshing the page...",config.jsVars.slug)}
        </span>
      </div>
    `}}}}),inactiveBlur_exports={};__export(inactiveBlur_exports,{initInactiveBlur:()=>initInactiveBlur});function toggleBlur(isBlur){var val=isBlur?"blur(3px)":"initial";document.documentElement.style.transition="filter 0.15s ease",document.documentElement.style["-webkit-transition"]="-webkit-filter 0.15s ease",document.documentElement.style["-moz-transition"]="-moz-filter 0.15s ease",document.documentElement.style["-o-transition"]="-o-filter 0.15s ease",document.documentElement.style["-ms-transition"]="-ms-filter 0.15s ease",["filter","-webkit-filter","-moz-filter","-o-filter","-ms-filter"].forEach(function(prop){document.documentElement.style[prop]=val})}async function initInactiveBlur(){["visibilitychange","pageshow","pagehide","focus","blur","resume","freeze"].forEach(function(evt){window.addEventListener(evt,function(e){document.hidden||!document.hasFocus()||e.type==="pagehide"||e.type==="blur"||e.type==="freeze"?toggleBlur(!0):toggleBlur(!1)})})}var init_inactiveBlur=__esm({"frontend/assets/js/dev/modules/inactiveBlur.js"(){}}),autosaveForms_exports={};__export(autosaveForms_exports,{initAutosaveForms:()=>initAutosaveForms});function persist(form){if(formData.has(form))return;load(form);const saveForm=()=>save(form),inputHandler=debounce(()=>save(form),500),saveFormBeforeUnload=()=>{window.removeEventListener("unload",saveForm),saveForm()},submitHandler=()=>{cleanup(form),config.jsVars.settings.appCapabilities.autosaveForms.persistOnSubmit!=="on"&&clearStorage(form)};formData.set(form,{saveForm,inputHandler,saveFormBeforeUnload,submitHandler}),window.addEventListener("beforeunload",saveFormBeforeUnload),window.addEventListener("unload",saveForm),form.addEventListener("input",inputHandler),form.addEventListener("change",inputHandler),form.addEventListener("submit",submitHandler)}function serialize(form){const data={};for(const element of form.elements){if(!element.name||element.disabled)continue;const tag=element.tagName,type=element.type;tag==="INPUT"&&(type==="password"||type==="file")||tag==="INPUT"&&(type==="submit"||type==="button"||type==="reset"||type==="image")||(tag==="INPUT"?type==="radio"?element.checked&&(data[element.name]=element.value):type==="checkbox"?(data[element.name]||(data[element.name]=[]),element.checked&&data[element.name].push(element.value)):data[element.name]=element.value:tag==="TEXTAREA"?data[element.name]=element.value:tag==="SELECT"&&(element.multiple?data[element.name]=Array.from(element.selectedOptions).map(option=>option.value):data[element.name]=element.value))}return data}function save(form){try{const data=serialize(form),key=getStorageKey(form);Object.keys(data).length>0&&(data._timestamp=Date.now(),localStorage.setItem(key,JSON.stringify(data)))}catch(error){console.warn("Failed to save form data:",error)}}function deserialize(form,data){for(const name in data){if(name.startsWith("_"))continue;Array.from(form.elements).filter(element=>element.name===name).forEach(element=>{applyValues(element,data[name])})}}function applyValues(element,value){const tag=element.tagName,type=element.type;try{tag==="INPUT"?type==="radio"?element.checked=element.value===value:type==="checkbox"?Array.isArray(value)?element.checked=value.includes(element.value):element.checked=!!value:element.value=value||"":tag==="TEXTAREA"?element.value=value||"":tag==="SELECT"&&(element.multiple&&Array.isArray(value)?Array.from(element.options).forEach(option=>{option.selected=value.includes(option.value)}):element.value=value||"")}catch(error){console.warn("Failed to apply value to element:",element,error)}}function load(form){try{const json=localStorage.getItem(getStorageKey(form));if(json){const data=JSON.parse(json);deserialize(form,data)}}catch(error){console.warn("Failed to load form data:",error),clearStorage(form)}}function clearStorage(form){try{localStorage.removeItem(getStorageKey(form))}catch(error){console.warn("Failed to clear form storage:",error)}}function getStorageKey(form){let identifier=form.id;if(!identifier){const formStructure={action:form.action||"",method:form.method||"get",fieldCount:form.elements.length,fieldNames:Array.from(form.elements).filter(el=>el.name).slice(0,5).map(el=>el.name).sort().join(",")};identifier=btoa(JSON.stringify(formStructure)).replace(/[^a-zA-Z0-9]/g,"").substring(0,16)}return`autosave_${window.location.pathname.replace(/[^a-zA-Z0-9]/g,"_")}_${identifier}`}function debounce(func,wait){let timeout;return function(...args){const later=()=>{clearTimeout(timeout),func(...args)};clearTimeout(timeout),timeout=setTimeout(later,wait)}}function cleanup(form){const handlers=formData.get(form);handlers&&(window.removeEventListener("beforeunload",handlers.saveFormBeforeUnload),window.removeEventListener("unload",handlers.saveForm),form.removeEventListener("input",handlers.inputHandler),form.removeEventListener("change",handlers.inputHandler),form.removeEventListener("submit",handlers.submitHandler),formData.delete(form))}function cleanupOldStorage(){try{const now=Date.now(),maxAge=7*24*60*60*1e3;for(let i=localStorage.length-1;i>=0;i--){const key=localStorage.key(i);if(key&&key.startsWith("autosave_"))try{const data=JSON.parse(localStorage.getItem(key));data&&data._timestamp&&now-data._timestamp>maxAge&&localStorage.removeItem(key)}catch{localStorage.removeItem(key)}}}catch(error){console.warn("Failed to cleanup old storage:",error)}}async function initAutosaveForms(){try{Array.from(document.forms).forEach(form=>{persist(form)}),new MutationObserver(mutations=>{mutations.forEach(mutation=>{mutation.addedNodes.forEach(node=>{node.nodeType===Node.ELEMENT_NODE&&(node.tagName==="FORM"&&persist(node),(node.querySelectorAll?node.querySelectorAll("form"):[]).forEach(form=>persist(form)))})})}).observe(document.body,{childList:!0,subtree:!0}),cleanupOldStorage()}catch(error){console.error("Failed to initialize autosave forms:",error)}}var formData,init_autosaveForms=__esm({"frontend/assets/js/dev/modules/autosaveForms.js"(){init_frontend(),formData=new WeakMap}}),vibrations_exports={};__export(vibrations_exports,{initVibrations:()=>initVibrations});async function initVibrations(){document.addEventListener("touchstart",function(event){if(!(event.target.tagName==="INPUT"||event.target.tagName==="TEXTAREA"||event.target.isContentEditable))try{navigator.vibrate(50)}catch(error){console.error("Error triggering vibration:",error)}},{passive:!0})}var init_vibrations=__esm({"frontend/assets/js/dev/modules/vibrations.js"(){}}),idleDetection_exports={};__export(idleDetection_exports,{initIdleDetection:()=>initIdleDetection});async function initIdleDetection(){customElements.get("pwa-idle-detection")||customElements.define("pwa-idle-detection",PwaIdleDetection);const requestPermission=async()=>{try{if(await IdleDetector.requestPermission()==="granted")try{const controller=new AbortController,idleDetector=new IdleDetector;idleDetector.addEventListener("change",()=>{idleDetector.userState==="idle"?PwaIdleDetection.show():PwaIdleDetection.hide()}),await idleDetector.start({threshold:config.jsVars.settings.appCapabilities.idleDetection.threshold*6e4,signal:controller.signal})}catch(error){console.error("Error initializing idle detector:",error)}else console.log("Idle detection permission not granted.")}catch(error){console.error("Error requesting idle detection permission:",error)}document.removeEventListener("click",requestPermission)};document.addEventListener("click",requestPermission)}var PwaIdleDetection,init_idleDetection=__esm({"frontend/assets/js/dev/modules/idleDetection.js"(){init_frontend(),init_utils(),PwaIdleDetection=class _PwaIdleDetection extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.styles=new Set}connectedCallback(){this.render(),this.handlePageReload()}static show(){let idleDetection=document.querySelector("pwa-idle-detection");return idleDetection||(idleDetection=document.createElement("pwa-idle-detection"),document.body.appendChild(idleDetection)),requestAnimationFrame(()=>{idleDetection.shadowRoot.querySelector(".idle-notification").classList.add("visible")}),idleDetection}static hide(){const idleDetection=document.querySelector("pwa-idle-detection");if(idleDetection){const idleNotification=idleDetection.shadowRoot.querySelector(".idle-notification");idleNotification.classList.remove("visible"),idleNotification.addEventListener("transitionend",()=>{idleDetection.remove()},{once:!0})}}injectStyles(css){this.styles.add(css)}handlePageReload(){this.shadowRoot.querySelector(".idle-notification").querySelector(".idle-notification-button_reload").addEventListener("click",()=>{_PwaIdleDetection.hide(),location.reload()})}render(){var _a,_b,_c;const themeColor=(_c=(_b=(_a=config.jsVars.settings.webAppManifest)==null?void 0:_a.appearance)==null?void 0:_b.themeColor)!=null?_c:"#000000",backgroundColor=getContrastTextColor(themeColor),textColor=getContrastTextColor(backgroundColor);this.injectStyles(`
      .idle-notification {
        position: fixed;
        top: 0;
        left: 50%;
        -webkit-transform: translateX(-50%) translateY(-100%);
            -ms-transform: translateX(-50%) translateY(-100%);
                transform: translateX(-50%) translateY(-100%);
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        gap: 1rem;
        width: 30rem;
        max-width: 85%;
        background-color: ${backgroundColor};
        color: ${textColor};
        border: 1px solid ${textColor}15;
        border-radius: 0.75rem;
        -webkit-box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
                box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        z-index: 9999999999999999;
        -webkit-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        -o-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0;
      }

      .idle-notification.visible {
        opacity: 1;
        -webkit-transform: translateX(-50%) translateY(1rem);
            -ms-transform: translateX(-50%) translateY(1rem);
                transform: translateX(-50%) translateY(1rem);
      }

      .idle-notification_icon {
        display: inline-block;
        flex-shrink: 0;
        width: 1.5rem;
        height: 1.5rem;
        color: ${textColor};
      }

      .idle-notification_texts {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        gap: 0.325rem;
      }

      .idle-notification_text {
        font-size: 0.875rem;
        line-height: 1.25rem;
      }

      .idle-notification-button_reload {
        display: inline-block;
        background-color: ${textColor};
        color: ${backgroundColor};
        vertical-align: middle;
        text-decoration: none;
        font-size: 0.75rem;
        line-height: 1rem;
        font-weight: 500;
        padding: 0.375rem 0.875rem;
        border: none;
        outline: none;
        border-radius: 9999px;
        cursor: pointer;
      }

      .idle-notification-button_reload:hover {
        opacity: 0.8;
      }
    `);const combinedStyles=Array.from(this.styles).join(`
`);this.shadowRoot.innerHTML=`
      <style>${combinedStyles}</style>
      <div class="idle-notification" role="alert" tabindex="-1">
        <div class="idle-notification_texts">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor" class="idle-notification_icon"><path d="m520-496 120 120q11 11 11 28t-11 28q-11 11-28 11t-28-11L452-452q-6-6-9-13.5t-3-15.5v-159q0-17 11.5-28.5T480-680q17 0 28.5 11.5T520-640v144Zm90-264q-21 0-35.5-14.5T560-810q0-21 14.5-35.5T610-860q21 0 35.5 14.5T660-810q0 21-14.5 35.5T610-760Zm0 660q-21 0-35.5-14.5T560-150q0-21 14.5-35.5T610-200q21 0 35.5 14.5T660-150q0 21-14.5 35.5T610-100Zm160-520q-21 0-35.5-14.5T720-670q0-21 14.5-35.5T770-720q21 0 35.5 14.5T820-670q0 21-14.5 35.5T770-620Zm0 380q-21 0-35.5-14.5T720-290q0-21 14.5-35.5T770-340q21 0 35.5 14.5T820-290q0 21-14.5 35.5T770-240Zm60-190q-21 0-35.5-14.5T780-480q0-21 14.5-35.5T830-530q21 0 35.5 14.5T880-480q0 21-14.5 35.5T830-430ZM80-480q0-157 104.5-270T441-878q16-2 27.5 9.5T480-840q0 16-10.5 28T443-798q-121 14-202 104t-81 214q0 125 81 214.5T443-162q16 2 26.5 14t10.5 28q0 17-11.5 28.5T441-82Q288-97 184-210T80-480Z"/></svg>
          <span class="idle-notification_text">
            ${wp.i18n.__("You've been idle for a while.",config.jsVars.slug)}
          </span>
        </div>
        <button type="button" class="idle-notification-button_reload">Reload Page</button>
      </div>
    `}}}}),screenWakeLock_exports={};__export(screenWakeLock_exports,{initScreenWakeLock:()=>initScreenWakeLock});async function initScreenWakeLock(){let wakeLock=null;const requestWakeLock=async()=>{try{wakeLock=await navigator.wakeLock.request("screen"),wakeLock.addEventListener("release",()=>{wakeLock=null})}catch(error){console.error("Error requesting screen wake lock:",error)}},handleVisibilityChange=async()=>{document.visibilityState==="visible"&&await requestWakeLock()};await requestWakeLock(),document.addEventListener("visibilitychange",handleVisibilityChange),document.addEventListener("fullscreenchange",handleVisibilityChange)}var init_screenWakeLock=__esm({"frontend/assets/js/dev/modules/screenWakeLock.js"(){}}),config,settings,userData,pluginsData,pageData,init_frontend=__esm({"frontend/assets/js/dev/frontend.js"(){init_utils(),init_pushNotificationsSubscription(),config=(()=>{const optionName="daftplug_progressify",jsVars=window[optionName+"_frontend_js_vars"]||{};return{optionName,jsVars}})(),{settings,userData,pluginsData,pageData}=config.jsVars,document.addEventListener("DOMContentLoaded",async function(){var _a,_b,_c,_d,_e,_f,_g,_h,_i,_j,_k,_l,_m,_n,_o,_p,_q,_r,_s,_t,_u,_v,_w,_x,_y,_z,_A,_B,_C,_D,_E,_F,_G,_H,_I,_J,_K,_L,_M,_N,_O,_P,_Q,_R,_S,_T,_U,_V,_W,_X,_Y,_Z,__,_$,_aa,_ba,_ca,_da,_ea,_fa,_ga,_ha,_ia,_ja,_ka,_la,_ma,_na,_oa,_pa,_qa,_ra,_sa,_ta,_ua,_va,_wa,_xa,_ya,_za,_Aa,_Ba,_Ca,_Da,_Ea,_Fa,_Ga,_Ha,_Ia,_Ja,_Ka,_La,_Ma,_Na,_Oa,_Pa,_Qa,_Ra,_Sa,_Ta,_Ua,_Va,_Wa,_Xa,_Ya,_Za,__a,_$a,_ab,_bb,_cb,_db,_eb,_fb,_gb,_hb,_ib,_jb,_kb,_lb,_mb,_nb,_ob,_pb,_qb,_rb,_sb,_tb,_ub,_vb;if(isPwa()){const{initPwaTracker:initPwaTracker2}=await Promise.resolve().then(()=>(init_pwaTracker(),pwaTracker_exports));if(await initPwaTracker2(),((_b=(_a=settings?.uiComponents)==null?void 0:_a.pwaCustomCssAndJs)==null?void 0:_b.feature)==="on"){const{initPwaCustomCssAndJs:initPwaCustomCssAndJs2}=await Promise.resolve().then(()=>(init_pwaCustomCssAndJs(),pwaCustomCssAndJs_exports));await initPwaCustomCssAndJs2()}}if(!isPwa()&&((_d=(_c=settings?.installation)==null?void 0:_c.prompts)==null?void 0:_d.feature)==="on"){const{initInstallUrl:initInstallUrl2}=await Promise.resolve().then(()=>(init_installUrl(),installUrl_exports));await initInstallUrl2();const{initInstallButton:initInstallButton2}=await Promise.resolve().then(()=>(init_installButton(),installButton_exports));if(await initInstallButton2(),((_f=(_e=settings?.installation)==null?void 0:_e.prompts)==null?void 0:_f.skipFirstVisit)!=="on"||isReturningVisitor()){if(((_j=(_i=(_h=(_g=settings?.installation)==null?void 0:_g.prompts)==null?void 0:_h.types)==null?void 0:_i.headerBanner)==null?void 0:_j.feature)==="on"&&!getCookie("pwa_header_banner_overlay_shown")){const{initInstallOverlayHeaderBanner:initInstallOverlayHeaderBanner2}=await Promise.resolve().then(()=>(init_installOverlayHeaderBanner(),installOverlayHeaderBanner_exports));await initInstallOverlayHeaderBanner2(),setCookie("pwa_header_banner_overlay_shown","true",(_m=(_l=(_k=settings?.installation)==null?void 0:_k.prompts)==null?void 0:_l.timeout)!=null?_m:1)}if(((_q=(_p=(_o=(_n=settings?.installation)==null?void 0:_n.prompts)==null?void 0:_o.types)==null?void 0:_p.snackbar)==null?void 0:_q.feature)==="on"&&((_r=userData?.device)!=null&&_r.isSmartphone||(_s=userData?.device)!=null&&_s.isTablet)&&!getCookie("pwa_snackbar_overlay_shown")){const{initInstallOverlaySnackbar:initInstallOverlaySnackbar2}=await Promise.resolve().then(()=>(init_installOverlaySnackbar(),installOverlaySnackbar_exports));await initInstallOverlaySnackbar2(),setCookie("pwa_snackbar_overlay_shown","true",(_v=(_u=(_t=settings?.installation)==null?void 0:_t.prompts)==null?void 0:_u.timeout)!=null?_v:1)}if(((_z=(_y=(_x=(_w=settings?.installation)==null?void 0:_w.prompts)==null?void 0:_x.types)==null?void 0:_y.blogPopup)==null?void 0:_z.feature)==="on"&&((_A=pageData?.type)!=null&&_A.isBlogPost)&&((_B=userData?.device)!=null&&_B.isSmartphone||(_C=userData?.device)!=null&&_C.isTablet)&&!getCookie("pwa_blog_popup_overlay_shown")){const{initInstallOverlayBlogPopup:initInstallOverlayBlogPopup2}=await Promise.resolve().then(()=>(init_installOverlayBlogPopup(),installOverlayBlogPopup_exports));await initInstallOverlayBlogPopup2(),setCookie("pwa_blog_popup_overlay_shown","true",(_F=(_E=(_D=settings?.installation)==null?void 0:_D.prompts)==null?void 0:_E.timeout)!=null?_F:1)}if(((_J=(_I=(_H=(_G=settings?.installation)==null?void 0:_G.prompts)==null?void 0:_H.types)==null?void 0:_I.navigationMenu)==null?void 0:_J.feature)==="on"&&((_K=userData?.device)!=null&&_K.isSmartphone||(_L=userData?.device)!=null&&_L.isTablet)){const{initInstallOverlayNavigationMenu:initInstallOverlayNavigationMenu2}=await Promise.resolve().then(()=>(init_installOverlayNavigationMenu(),installOverlayNavigationMenu_exports));await initInstallOverlayNavigationMenu2()}if(((_P=(_O=(_N=(_M=settings?.installation)==null?void 0:_M.prompts)==null?void 0:_N.types)==null?void 0:_O.inFeed)==null?void 0:_P.feature)==="on"&&((_Q=userData?.device)!=null&&_Q.isSmartphone||(_R=userData?.device)!=null&&_R.isTablet)){const{initInstallOverlayInFeed:initInstallOverlayInFeed2}=await Promise.resolve().then(()=>(init_installOverlayInFeed(),installOverlayInFeed_exports));await initInstallOverlayInFeed2()}if(((_V=(_U=(_T=(_S=settings?.installation)==null?void 0:_S.prompts)==null?void 0:_T.types)==null?void 0:_U.woocommerceCheckout)==null?void 0:_V.feature)==="on"&&((_W=pluginsData?.isActive)!=null&&_W.woocommerce)&&document.body.classList.contains("woocommerce-checkout")&&((_X=userData?.device)!=null&&_X.isSmartphone||(_Y=userData?.device)!=null&&_Y.isTablet)){const{initInstallOverlayWoocommerceCheckout:initInstallOverlayWoocommerceCheckout2}=await Promise.resolve().then(()=>(init_installOverlayWoocommerceCheckout(),installOverlayWoocommerceCheckout_exports));await initInstallOverlayWoocommerceCheckout2()}}}if(((__=(_Z=settings?.appCapabilities)==null?void 0:_Z.smoothPageTransitions)==null?void 0:__.feature)==="off"&&((_aa=(_$=settings?.uiComponents)==null?void 0:_$.pageLoader)==null?void 0:_aa.feature)==="on"&&((_ca=(_ba=settings?.uiComponents)==null?void 0:_ba.pageLoader)!=null&&_ca.supportedDevices.some(supported=>{var _a2,_b2,_c2;return supported==="smartphone"&&((_a2=userData?.device)==null?void 0:_a2.isSmartphone)||supported==="tablet"&&((_b2=userData?.device)==null?void 0:_b2.isTablet)||supported==="desktop"&&((_c2=userData?.device)==null?void 0:_c2.isDesktop)}))){const{initPageLoader:initPageLoader2}=await Promise.resolve().then(()=>(init_pageLoader(),pageLoader_exports));await initPageLoader2()}if(((_ea=(_da=settings?.webAppManifest)==null?void 0:_da.displaySettings)==null?void 0:_ea.orientationLock)==="on"){const{initOrientationLock:initOrientationLock2}=await Promise.resolve().then(()=>(init_orientationLock(),orientationLock_exports));await initOrientationLock2()}if(((_ga=(_fa=settings?.uiComponents)==null?void 0:_fa.toastMessages)==null?void 0:_ga.feature)==="on"&&((_ia=(_ha=settings?.uiComponents)==null?void 0:_ha.toastMessages)!=null&&_ia.supportedDevices.some(supported=>{var _a2,_b2;return supported==="smartphone"&&((_a2=userData?.device)==null?void 0:_a2.isSmartphone)||supported==="tablet"&&((_b2=userData?.device)==null?void 0:_b2.isTablet)}))){const{initToastMessages:initToastMessages2}=await Promise.resolve().then(()=>(init_toastMessages(),toastMessages_exports));await initToastMessages2()}if(((_ka=(_ja=settings?.uiComponents)==null?void 0:_ja.navigationTabBar)==null?void 0:_ka.feature)==="on"&&((_ma=(_la=settings?.uiComponents)==null?void 0:_la.navigationTabBar)!=null&&_ma.navigationItems.some(item=>item.icon&&item.label&&item.page))&&((_oa=(_na=settings?.uiComponents)==null?void 0:_na.navigationTabBar)!=null&&_oa.supportedDevices.some(supported=>{var _a2,_b2;return supported==="smartphone"&&((_a2=userData?.device)==null?void 0:_a2.isSmartphone)||supported==="tablet"&&((_b2=userData?.device)==null?void 0:_b2.isTablet)}))){const{initNavigationTabBar:initNavigationTabBar2}=await Promise.resolve().then(()=>(init_navigationTabBar(),navigationTabBar_exports));await initNavigationTabBar2()}if(((_qa=(_pa=settings?.uiComponents)==null?void 0:_pa.scrollProgressBar)==null?void 0:_qa.feature)==="on"&&((_sa=(_ra=settings?.uiComponents)==null?void 0:_ra.scrollProgressBar)!=null&&_sa.supportedDevices.some(supported=>{var _a2,_b2,_c2;return supported==="smartphone"&&((_a2=userData?.device)==null?void 0:_a2.isSmartphone)||supported==="tablet"&&((_b2=userData?.device)==null?void 0:_b2.isTablet)||supported==="desktop"&&((_c2=userData?.device)==null?void 0:_c2.isDesktop)}))){const{initScrollProgressBar:initScrollProgressBar2}=await Promise.resolve().then(()=>(init_scrollProgressBar(),scrollProgressBar_exports));await initScrollProgressBar2()}if(((_ua=(_ta=settings?.uiComponents)==null?void 0:_ta.darkMode)==null?void 0:_ua.feature)==="on"&&((_wa=(_va=settings?.uiComponents)==null?void 0:_va.darkMode)!=null&&_wa.supportedDevices.some(supported=>{var _a2,_b2,_c2;return supported==="smartphone"&&((_a2=userData?.device)==null?void 0:_a2.isSmartphone)||supported==="tablet"&&((_b2=userData?.device)==null?void 0:_b2.isTablet)||supported==="desktop"&&((_c2=userData?.device)==null?void 0:_c2.isDesktop)}))){const{initDarkMode:initDarkMode2}=await Promise.resolve().then(()=>(init_darkMode(),darkMode_exports));await initDarkMode2()}if(((_ya=(_xa=settings?.uiComponents)==null?void 0:_xa.shareButton)==null?void 0:_ya.feature)==="on"&&navigator.share&&((_Aa=(_za=settings?.uiComponents)==null?void 0:_za.shareButton)!=null&&_Aa.supportedDevices.some(supported=>{var _a2,_b2,_c2;return supported==="smartphone"&&((_a2=userData?.device)==null?void 0:_a2.isSmartphone)||supported==="tablet"&&((_b2=userData?.device)==null?void 0:_b2.isTablet)||supported==="desktop"&&((_c2=userData?.device)==null?void 0:_c2.isDesktop)}))){const{initShareButton:initShareButton2}=await Promise.resolve().then(()=>(init_shareButton(),shareButton_exports));await initShareButton2()}if(((_Ca=(_Ba=settings?.appCapabilities)==null?void 0:_Ba.smoothPageTransitions)==null?void 0:_Ca.feature)==="on"&&((_Ea=(_Da=settings?.appCapabilities)==null?void 0:_Da.smoothPageTransitions)!=null&&_Ea.supportedDevices.some(supported=>{var _a2,_b2,_c2;return supported==="smartphone"&&((_a2=userData?.device)==null?void 0:_a2.isSmartphone)||supported==="tablet"&&((_b2=userData?.device)==null?void 0:_b2.isTablet)||supported==="desktop"&&((_c2=userData?.device)==null?void 0:_c2.isDesktop)}))){const{initSmoothPageTransitions:initSmoothPageTransitions2}=await Promise.resolve().then(()=>(init_smoothPageTransitions(),smoothPageTransitions_exports));await initSmoothPageTransitions2()}if(((_Ga=(_Fa=settings?.pushNotifications)==null?void 0:_Fa.prompt)==null?void 0:_Ga.feature)==="on"&&"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window&&!["subscribed","blocked"].includes(await pushNotificationsSubscription_default.getSubscriptionState())&&!getCookie("pwa_push_notifications_prompt_shown")&&(((_Ia=(_Ha=settings?.pushNotifications)==null?void 0:_Ha.prompt)==null?void 0:_Ia.skipFirstVisit)!=="on"||isReturningVisitor())){const{initPushNotificationsPrompt:initPushNotificationsPrompt2}=await Promise.resolve().then(()=>(init_pushNotificationsPrompt(),pushNotificationsPrompt_exports));await initPushNotificationsPrompt2(),setCookie("pwa_push_notifications_prompt_shown","true",(_La=(_Ka=(_Ja=settings?.pushNotifications)==null?void 0:_Ja.prompt)==null?void 0:_Ka.timeout)!=null?_La:1)}if(((_Na=(_Ma=settings?.pushNotifications)==null?void 0:_Ma.button)==null?void 0:_Na.feature)==="on"&&"serviceWorker"in navigator&&"PushManager"in window&&"Notification"in window&&await pushNotificationsSubscription_default.getSubscriptionState()!=="blocked"&&(await pushNotificationsSubscription_default.getSubscriptionState()!=="subscribed"||((_Pa=(_Oa=settings?.pushNotifications)==null?void 0:_Oa.button)==null?void 0:_Pa.behavior)==="shown")){const{initPushNotificationsButton:initPushNotificationsButton2}=await Promise.resolve().then(()=>(init_pushNotificationsButton(),pushNotificationsButton_exports));await initPushNotificationsButton2()}if(((_Ra=(_Qa=settings?.offlineUsage)==null?void 0:_Qa.capabilities)==null?void 0:_Ra.feature)==="on"){if(((_Ua=(_Ta=(_Sa=settings?.offlineUsage)==null?void 0:_Sa.capabilities)==null?void 0:_Ta.notification)==null?void 0:_Ua.feature)==="on"){const{initOfflineNotification:initOfflineNotification2}=await Promise.resolve().then(()=>(init_offlineNotification(),offlineNotification_exports));await initOfflineNotification2()}if(((_Xa=(_Wa=(_Va=settings?.offlineUsage)==null?void 0:_Va.capabilities)==null?void 0:_Wa.forms)==null?void 0:_Xa.feature)==="on"){const{initOfflineForms:initOfflineForms2}=await Promise.resolve().then(()=>(init_offlineForms(),offlineForms_exports));await initOfflineForms2()}}if(((_Za=(_Ya=settings?.uiComponents)==null?void 0:_Ya.pullDownRefresh)==null?void 0:_Za.feature)==="on"&&((_$a=(__a=settings?.uiComponents)==null?void 0:__a.pullDownRefresh)!=null&&_$a.supportedDevices.some(supported=>{var _a2,_b2;return supported==="smartphone"&&((_a2=userData?.device)==null?void 0:_a2.isSmartphone)||supported==="tablet"&&((_b2=userData?.device)==null?void 0:_b2.isTablet)}))){const{initPullDownRefresh:initPullDownRefresh2}=await Promise.resolve().then(()=>(init_pullDownRefresh(),pullDownRefresh_exports));await initPullDownRefresh2()}if(((_bb=(_ab=settings?.uiComponents)==null?void 0:_ab.shakeRefresh)==null?void 0:_bb.feature)==="on"&&"DeviceMotionEvent"in window&&((_db=(_cb=settings?.uiComponents)==null?void 0:_cb.shakeRefresh)!=null&&_db.supportedDevices.some(supported=>{var _a2,_b2;return supported==="smartphone"&&((_a2=userData?.device)==null?void 0:_a2.isSmartphone)||supported==="tablet"&&((_b2=userData?.device)==null?void 0:_b2.isTablet)}))){const{initShakeRefresh:initShakeRefresh2}=await Promise.resolve().then(()=>(init_shakeRefresh(),shakeRefresh_exports));await initShakeRefresh2()}if(((_fb=(_eb=settings?.uiComponents)==null?void 0:_eb.inactiveBlur)==null?void 0:_fb.feature)==="on"&&((_hb=(_gb=settings?.uiComponents)==null?void 0:_gb.inactiveBlur)!=null&&_hb.supportedDevices.some(supported=>{var _a2,_b2;return supported==="smartphone"&&((_a2=userData?.device)==null?void 0:_a2.isSmartphone)||supported==="tablet"&&((_b2=userData?.device)==null?void 0:_b2.isTablet)}))){const{initInactiveBlur:initInactiveBlur2}=await Promise.resolve().then(()=>(init_inactiveBlur(),inactiveBlur_exports));await initInactiveBlur2()}if(((_jb=(_ib=settings?.appCapabilities)==null?void 0:_ib.autosaveForms)==null?void 0:_jb.feature)==="on"){const{initAutosaveForms:initAutosaveForms2}=await Promise.resolve().then(()=>(init_autosaveForms(),autosaveForms_exports));await initAutosaveForms2()}if(((_lb=(_kb=settings?.appCapabilities)==null?void 0:_kb.vibrations)==null?void 0:_lb.feature)==="on"&&navigator.vibrate&&((_nb=(_mb=settings?.appCapabilities)==null?void 0:_mb.vibrations)!=null&&_nb.supportedDevices.some(supported=>{var _a2,_b2;return supported==="smartphone"&&((_a2=userData?.device)==null?void 0:_a2.isSmartphone)||supported==="tablet"&&((_b2=userData?.device)==null?void 0:_b2.isTablet)}))){const{initVibrations:initVibrations2}=await Promise.resolve().then(()=>(init_vibrations(),vibrations_exports));await initVibrations2()}if(((_pb=(_ob=settings?.appCapabilities)==null?void 0:_ob.idleDetection)==null?void 0:_pb.feature)==="on"&&"IdleDetector"in window&&((_rb=(_qb=settings?.appCapabilities)==null?void 0:_qb.idleDetection)!=null&&_rb.supportedDevices.some(supported=>{var _a2,_b2,_c2;return supported==="smartphone"&&((_a2=userData?.device)==null?void 0:_a2.isSmartphone)||supported==="tablet"&&((_b2=userData?.device)==null?void 0:_b2.isTablet)||supported==="desktop"&&((_c2=userData?.device)==null?void 0:_c2.isDesktop)}))){const{initIdleDetection:initIdleDetection2}=await Promise.resolve().then(()=>(init_idleDetection(),idleDetection_exports));await initIdleDetection2()}if(((_tb=(_sb=settings?.appCapabilities)==null?void 0:_sb.screenWakeLock)==null?void 0:_tb.feature)==="on"&&navigator.wakeLock&&((_vb=(_ub=settings?.appCapabilities)==null?void 0:_ub.screenWakeLock)!=null&&_vb.supportedDevices.some(supported=>{var _a2,_b2,_c2;return supported==="smartphone"&&((_a2=userData?.device)==null?void 0:_a2.isSmartphone)||supported==="tablet"&&((_b2=userData?.device)==null?void 0:_b2.isTablet)||supported==="desktop"&&((_c2=userData?.device)==null?void 0:_c2.isDesktop)}))){const{initScreenWakeLock:initScreenWakeLock2}=await Promise.resolve().then(()=>(init_screenWakeLock(),screenWakeLock_exports));await initScreenWakeLock2()}})}});init_frontend()})();

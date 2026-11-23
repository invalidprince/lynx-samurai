/* Lynx Samurai — events rendering + contact form (same pattern as Sawyer's Squishys) */
(function(){"use strict";
var ACCESS_KEY="REPLACE_WITH_WEB3FORMS_KEY",ENDPOINT="https://api.web3forms.com/submit",SUBJECT="Lynx Samurai website message";
var listEl=document.getElementById("events-list");
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function parseDate(v){if(!v)return null;var m=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(v).trim());return m?new Date(+m[1],+m[2]-1,+m[3]):null}
var MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function render(evs){var today=new Date();today.setHours(0,0,0,0);
  evs=evs.filter(function(e){var d=parseDate((e.dates&&e.dates[e.dates.length-1])||e.date);return d&&d>=today}).sort(function(a,b){return parseDate(a.dates?a.dates[0]:a.date)-parseDate(b.dates?b.dates[0]:b.date)});
  if(!evs.length){listEl.innerHTML='<p class="empty">No shows on the calendar right now. Check back soon or <a href="#contact">message me</a>.</p>';return}
  listEl.innerHTML=evs.map(function(e){var d=parseDate(e.dates?e.dates[0]:e.date);var when=e.dates&&e.dates.length>1?MON[d.getMonth()]+" "+d.getDate()+"–"+parseDate(e.dates[e.dates.length-1]).getDate():d.toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric",year:"numeric"});
    return'<article class="event"><div class="event-date"><span class="m">'+MON[d.getMonth()]+'</span><span class="d">'+d.getDate()+'</span></div><div><h3>'+esc(e.name)+'</h3><p>'+esc(when)+(e.hours?' · <span class="hours">'+esc(e.hours)+'</span>':'')+'</p><p>'+esc(e.location)+'</p>'+(e.notes?'<p>'+esc(e.notes)+'</p>':'')+'</div></article>'}).join("");
  listEl.setAttribute("aria-busy","false")}
fetch("events.json",{cache:"no-store"}).then(function(r){return r.json()}).then(render).catch(function(){listEl.innerHTML='<p class="empty">Couldn\'t load events.</p>'});
var form=document.getElementById("contact-form");if(form){var st=form.querySelector(".form-status");form.addEventListener("submit",function(ev){ev.preventDefault();if(!form.checkValidity()){st.textContent="Please fill in every field.";return}
  var fd=new FormData(form);fd.append("access_key",ACCESS_KEY);fd.append("subject",SUBJECT);st.textContent="Sending…";
  fetch(ENDPOINT,{method:"POST",body:fd}).then(function(r){return r.json()}).then(function(j){st.textContent=j.success?"Sent. I'll get back to you soon.":"Something went wrong. Try again or message me on Facebook."}).catch(function(){st.textContent="Something went wrong. Try again or message me on Facebook."})})}
document.getElementById("year").textContent=new Date().getFullYear();
})();

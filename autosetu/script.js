document.getElementById('footer-year').textContent = new Date().getFullYear();

/* ---- marigold garland ---- */
(function(){
  var row = document.getElementById('garland-row');
  var frag = document.createDocumentFragment();
  for(var i=0;i<40;i++){ var f=document.createElement('span'); f.className='garland-flower'; frag.appendChild(f); }
  row.appendChild(frag);
})();

/* ---- mandala petal generator (richer, layered lotus pattern) ---- */
function buildMandala(id, petals, color){
  var g = document.getElementById(id);
  if(!g) return;
  var ns = "http://www.w3.org/2000/svg";
  function el(tag, attrs){
    var n = document.createElementNS(ns, tag);
    for(var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }
  /* outer ring of small filled petals */
  for(var i=0;i<petals;i++){
    var angle = (360/petals)*i;
    g.appendChild(el('path', {
      d:'M100 100 C 95 76, 92 50, 100 20 C 108 50, 105 76, 100 100 Z',
      fill:color, opacity:'0.22', transform:'rotate('+angle+' 100 100)'
    }));
    g.appendChild(el('path', {
      d:'M100 100 C 96 78, 91 52, 100 22 C 109 52, 104 78, 100 100 Z',
      fill:'none', stroke:color, 'stroke-width':'1.1', opacity:'0.8', transform:'rotate('+angle+' 100 100)'
    }));
  }
  /* inner ring of smaller petals, offset */
  var innerCount = Math.round(petals*0.75);
  for(var j=0;j<innerCount;j++){
    var a2 = (360/innerCount)*j + (180/innerCount);
    g.appendChild(el('path', {
      d:'M100 100 C 97 86, 94 70, 100 52 C 106 70, 103 86, 100 100 Z',
      fill:'none', stroke:color, 'stroke-width':'0.9', opacity:'0.55', transform:'rotate('+a2+' 100 100)'
    }));
  }
  /* concentric rings */
  g.appendChild(el('circle', {cx:'100', cy:'100', r:'18', fill:'none', stroke:color, 'stroke-width':'1', opacity:'0.6'}));
  g.appendChild(el('circle', {cx:'100', cy:'100', r:'60', fill:'none', stroke:color, 'stroke-width':'1', opacity:'0.45'}));
  g.appendChild(el('circle', {cx:'100', cy:'100', r:'78', fill:'none', stroke:color, 'stroke-width':'0.8', 'stroke-dasharray':'1 5', opacity:'0.5'}));
  g.appendChild(el('circle', {cx:'100', cy:'100', r:'92', fill:'none', stroke:color, 'stroke-width':'1', 'stroke-dasharray':'2 7', opacity:'0.45'}));
  /* small dots ring, evenly spaced */
  var dotCount = petals*2;
  for(var k=0;k<dotCount;k++){
    var da = (360/dotCount)*k;
    var rad = da*Math.PI/180;
    var r = 78;
    var cx = 100 + r*Math.cos(rad);
    var cy = 100 + r*Math.sin(rad);
    g.appendChild(el('circle', {cx:cx.toFixed(1), cy:cy.toFixed(1), r:'1.6', fill:color, opacity:'0.55'}));
  }
}
buildMandala('mandala-outer', 16, '#f4d774');
buildMandala('mandala-inner', 12, '#ffb27a');

/* ---- Ashoka-style 24-spoke chakra wheel (hero decoration) ---- */
(function(){
  var g = document.getElementById('chakra-spokes');
  if(!g) return;
  var ns = "http://www.w3.org/2000/svg";
  var spokes = 24;
  for(var i=0;i<spokes;i++){
    var angle = (360/spokes)*i;
    var line = document.createElementNS(ns,'line');
    line.setAttribute('x1','50'); line.setAttribute('y1','50');
    line.setAttribute('x2','50'); line.setAttribute('y2','14');
    line.setAttribute('transform','rotate('+angle+' 50 50)');
    g.appendChild(line);
  }
})();

/* ---- stat counters ---- */
(function(){
  var stats = document.querySelectorAll('.stat-num');
  if(!stats.length) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function animate(el){
    var target = parseFloat(el.dataset.count);
    var decimal = parseInt(el.dataset.decimal || '0');
    var suffix = el.dataset.suffix || '';
    if(reduce){ el.textContent = (decimal ? target.toFixed(decimal) : Math.round(target)) + suffix; return; }
    var dur = 1400, start = performance.now();
    function tick(now){
      var p = Math.min(1, (now-start)/dur);
      var eased = 1 - Math.pow(1-p, 3);
      var val = target*eased;
      el.textContent = (decimal ? val.toFixed(decimal) : Math.round(val)) + suffix;
      if(p<1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){ if(entry.isIntersecting){ animate(entry.target); io.unobserve(entry.target); } });
  }, {threshold:0.5});
  stats.forEach(function(s){ io.observe(s); });
})();

/* ---- USP bar fill ---- */
(function(){
  var bars = document.querySelectorAll('.bar-fill');
  if(!bars.length) return;
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){ entry.target.style.width = entry.target.dataset.pct + '%'; io.unobserve(entry.target); }
    });
  }, {threshold:0.4});
  bars.forEach(function(b){ io.observe(b); });
})();

/* ---- ticket 3D tilt ---- */
(function(){
  var stage = document.querySelector('.ticket-stage');
  var card = document.getElementById('ticket-card');
  if(!stage || !card) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  stage.addEventListener('mousemove', function(e){
    var r = stage.getBoundingClientRect();
    var px = (e.clientX - r.left)/r.width - 0.5;
    var py = (e.clientY - r.top)/r.height - 0.5;
    card.style.transform = 'rotateY('+(-8 + px*18)+'deg) rotateX('+(4 - py*18)+'deg)';
  });
  stage.addEventListener('mouseleave', function(){ card.style.transform = 'rotateY(-8deg) rotateX(4deg)'; });
})();

/* ============================================================
   THEME (dark mode) — persisted
   ============================================================ */
(function(){
  var root = document.documentElement;
  var saved = localStorage.getItem('autosetu-theme');
  if(saved === 'dark') root.setAttribute('data-theme','dark');
  document.getElementById('theme-toggle').addEventListener('click', function(){
    var isDark = root.getAttribute('data-theme') === 'dark';
    root.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('autosetu-theme', isDark ? 'light' : 'dark');
  });
})();

/* ============================================================
   TOAST (lightweight success / error feedback, non-blocking)
   ============================================================ */
function showToast(message, kind){
  var region = document.getElementById('toast-region');
  var t = document.createElement('div');
  t.className = 'toast' + (kind === 'success' ? ' toast-success' : kind === 'error' ? ' toast-error' : '');
  var icon = kind === 'success'
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>'
    : kind === 'error'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>'
      : '';
  t.innerHTML = icon + '<span>'+message+'</span>';
  region.appendChild(t);
  requestAnimationFrame(function(){ t.classList.add('is-visible'); });
  setTimeout(function(){
    t.classList.remove('is-visible');
    setTimeout(function(){ t.remove(); }, 250);
  }, 3200);
}

/* ============================================================
   CONFIRM DIALOG (for destructive actions)
   ============================================================ */
function confirmDialog(title, desc, okLabel){
  return new Promise(function(resolve){
    var overlay = document.getElementById('confirm-dialog-overlay');
    document.getElementById('confirm-dialog-title').textContent = title;
    document.getElementById('confirm-dialog-desc').textContent = desc;
    var okBtn = document.getElementById('confirm-dialog-ok');
    var cancelBtn = document.getElementById('confirm-dialog-cancel');
    okBtn.textContent = okLabel || 'Remove';
    overlay.classList.add('is-open');
    okBtn.focus();
    function cleanup(result){
      overlay.classList.remove('is-open');
      okBtn.removeEventListener('click', onOk);
      cancelBtn.removeEventListener('click', onCancel);
      overlay.removeEventListener('click', onOverlay);
      document.removeEventListener('keydown', onKey);
      resolve(result);
    }
    function onOk(){ cleanup(true); }
    function onCancel(){ cleanup(false); }
    function onOverlay(e){ if(e.target === overlay) cleanup(false); }
    function onKey(e){ if(e.key === 'Escape') cleanup(false); }
    okBtn.addEventListener('click', onOk);
    cancelBtn.addEventListener('click', onCancel);
    overlay.addEventListener('click', onOverlay);
    document.addEventListener('keydown', onKey);
  });
}

/* ============================================================
   FAVORITES
   ============================================================ */
var Favorites = {
  key:'autosetu-favorites',
  get:function(){ try{ var d = JSON.parse(localStorage.getItem(this.key)); return Array.isArray(d) ? d : []; }catch(e){ return []; } },
  set:function(list){ localStorage.setItem(this.key, JSON.stringify(list)); renderFavCount(); renderFavDrawer(); },
  toggle:function(name){
    var list = this.get();
    var idx = list.indexOf(name);
    if(idx > -1) list.splice(idx,1); else list.push(name);
    this.set(list);
  },
  has:function(name){ return this.get().indexOf(name) > -1; }
};
function renderFavCount(){
  var n = Favorites.get().length;
  var badge = document.getElementById('fav-count');
  badge.textContent = n;
  badge.style.display = n ? 'flex' : 'none';
}
function renderFavDrawer(){
  var body = document.getElementById('drawer-body');
  var list = Favorites.get();
  if(!list.length){ body.innerHTML = '<p class="drawer-empty">No favorites yet — tap the heart on any seva to save it here for next time.</p>'; return; }
  body.innerHTML = '';
  list.forEach(function(name){
    var svc = SERVICES.find(function(s){ return s.name === name; }) ||
      SERVICE_CATEGORIES.find(function(s){ return s.name.replace(/&amp;/g,'&') === name; });
    var priceVal = svc ? (svc.price || svc.from) : null;
    var priceText = priceVal ? ('From \u20B9'+priceVal.toLocaleString('en-IN')) : '';
    var row = document.createElement('div');
    row.className = 'drawer-item';
    row.innerHTML = '<span><span class="drawer-item-name">'+name+'</span><br><span class="drawer-item-price">'+priceText+'</span></span>'+
      '<button class="drawer-remove" aria-label="Remove '+name+' from favorites" data-name="'+name.replace(/"/g,'&quot;')+'">✕</button>';
    body.appendChild(row);
  });
  body.querySelectorAll('.drawer-remove').forEach(function(btn){
    btn.addEventListener('click', function(){
      var name = btn.dataset.name;
      confirmDialog('Remove favorite?', 'Remove "'+name+'" from your favorites. You can always add it back later.', 'Remove').then(function(ok){
        if(ok){ Favorites.toggle(name); showToast('Removed from favorites', 'success'); }
      });
    });
  });
}
document.getElementById('fav-toggle').addEventListener('click', function(){
  document.getElementById('fav-drawer').classList.add('is-open');
  document.getElementById('drawer-overlay').classList.add('is-open');
});
function closeDrawer(){
  document.getElementById('fav-drawer').classList.remove('is-open');
  document.getElementById('drawer-overlay').classList.remove('is-open');
}
document.getElementById('drawer-close').addEventListener('click', closeDrawer);
document.getElementById('drawer-overlay').addEventListener('click', closeDrawer);

/* ============================================================
   RECENTLY VIEWED
   ============================================================ */
var RecentlyViewed = {
  key:'autosetu-recent',
  get:function(){ try{ var d = JSON.parse(localStorage.getItem(this.key)); return Array.isArray(d) ? d : []; }catch(e){ return []; } },
  add:function(name){
    var list = this.get().filter(function(n){ return n !== name; });
    list.unshift(name);
    if(list.length > 6) list = list.slice(0,6);
    localStorage.setItem(this.key, JSON.stringify(list));
    renderRecentStrip();
  }
};
function renderRecentStrip(){
  var wrap = document.getElementById('recent-strip-wrap');
  var strip = document.getElementById('recent-strip');
  var list = RecentlyViewed.get();
  if(!list.length){ wrap.classList.remove('has-items'); return; }
  wrap.classList.add('has-items');
  strip.innerHTML = '';
  list.forEach(function(name){
    var svc = SERVICES.find(function(s){ return s.name === name; });
    if(!svc) return;
    var chip = document.createElement('div');
    chip.className = 'recent-chip';
    chip.innerHTML = '<h4>'+svc.name+'</h4><div class="recent-price">From \u20B9'+svc.price.toLocaleString('en-IN')+'</div>';
    chip.addEventListener('click', function(){
      document.getElementById('svc-select').value = svc.name;
      document.getElementById('booking-form').scrollIntoView({behavior:'smooth', block:'start'});
    });
    strip.appendChild(chip);
  });
}

/* ---- generic modal helpers ---- */
function openModal(html, wide){
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-box').classList.toggle('modal-wide', !!wide);
  document.getElementById('modal-overlay').classList.add('is-open');
}
function closeModal(){ document.getElementById('modal-overlay').classList.remove('is-open'); }
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', function(e){ if(e.target === this) closeModal(); });
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape' && document.getElementById('modal-overlay').classList.contains('is-open')) closeModal();
});

/* ---- home: static service showcase (info only, no booking) ---- */
var SERVICE_CATEGORIES = [
  { name:"Periodic maintenance", cat:"Oil, filters, fluids, belts", from:899, icon:"oil" },
  { name:"Brakes &amp; suspension", cat:"Pads, discs, shocks", from:649, icon:"brake" },
  { name:"Tyres &amp; alignment", cat:"Rotation, balancing, alignment", from:499, icon:"tire" },
  { name:"AC &amp; detailing", cat:"Cooling, interior, ceramic coat", from:1099, icon:"ac" },
  { name:"Inspection &amp; PUC", cat:"Emission check, 50-point report", from:399, icon:"inspect" },
  { name:"Insurance &amp; bodywork", cat:"Claims, denting, painting", from:2999, icon:"inspect" },
];
var ICONS = {
  oil:'<path d="M12 2 5 12a7 7 0 1 0 14 0z"/>',
  engine:'<rect x="3" y="9" width="14" height="8" rx="1"/><path d="M17 11h3v4h-3z"/><path d="M6 9V6h6v3"/>',
  brake:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.6"/><path d="M12 4v3M20 12h-3M12 20v-3M4 12h3"/>',
  battery:'<rect x="3" y="7" width="16" height="11" rx="1.5"/><path d="M19 10v5M9 9v6M13 9v6"/>',
  tire:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 4v3M20 12h-3M12 20v-3M4 12h3M17.6 6.4l-2.1 2.1M6.4 17.6l2.1-2.1M17.6 17.6l-2.1-2.1M6.4 6.4l2.1 2.1"/>',
  inspect:'<circle cx="10" cy="10" r="6.5"/><path d="M15 15l5 5"/>',
  ac:'<path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9"/>',
  snow:'<path d="M12 2v20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1"/>'
};
(function(){
  var grid = document.getElementById('svc-static-grid');
  SERVICE_CATEGORIES.forEach(function(s){
    var card = document.createElement('div');
    card.className = 'svc-static-card';
    var plain = s.name.replace(/&amp;/g,'&');
    var fav = Favorites.has(plain);
    card.innerHTML =
      '<button class="fav-btn'+(fav?' is-fav':'')+'" data-name="'+plain.replace(/"/g,'&quot;')+'" aria-label="'+(fav?'Remove ':'Add ')+plain+' to favorites" aria-pressed="'+fav+'"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7.5-4.6-9.6-9A5.3 5.3 0 0 1 12 6a5.3 5.3 0 0 1 9.6 5c-2.1 4.4-9.6 9-9.6 9Z"/></svg></button>'+
      '<span class="svc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ICONS[s.icon]+'</svg></span>'+
      '<h3>'+s.name+'</h3><div class="svc-cat">'+s.cat+'</div>'+
      '<div class="svc-from">From \u20B9'+s.from.toLocaleString('en-IN')+'<span>starting price</span></div>';
    grid.appendChild(card);
  });
  grid.querySelectorAll('.fav-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var wasFav = btn.classList.contains('is-fav');
      Favorites.toggle(btn.dataset.name);
      btn.classList.toggle('is-fav');
      btn.setAttribute('aria-pressed', String(!wasFav));
      showToast(wasFav ? 'Removed from favorites' : 'Added to favorites', 'success');
    });
  });
})();

/* ---- reviews: continuous marquee (duplicated once for seamless loop) ---- */
var TESTIMONIALS = [
  { name:"Kavya Reddy", vehicle:"Hyundai Creta", rating:5, quote:"Booked my periodic service in under two minutes and got a reminder that morning. Car was ready before the estimate." },
  { name:"Suresh Iyengar", vehicle:"Maruti Suzuki Swift", rating:5, quote:"Arjun explained exactly what the brake job needed before touching the car. Transparent pricing, no surprises." },
  { name:"Meera Pillai", vehicle:"Tata Nexon EV", rating:4, quote:"First shop in the city that actually understood the EV's battery diagnostics, explained in detail." },
  { name:"Aditya Bhatt", vehicle:"Mahindra Thar", rating:5, quote:"The wheel alignment report with before-and-after numbers is a nice touch. Three years, no repeat issues." },
  { name:"Nisha Deshmukh", vehicle:"Honda City", rating:5, quote:"Getting the PUC certificate and inspection done together saved me a whole extra trip." },
  { name:"Farhan Sheikh", vehicle:"Toyota Innova Crysta", rating:4, quote:"Ceramic coating held up beautifully through the monsoon. Meticulous team, worth the wait for a slot." },
];
var userReviewsKey = 'autosetu-user-reviews';
function getUserReviews(){ try{ var d = JSON.parse(localStorage.getItem(userReviewsKey)); return Array.isArray(d) ? d : []; }catch(e){ return []; } }
function renderReviews(){
  var track = document.getElementById('testi-track');
  var all = getUserReviews().concat(TESTIMONIALS);
  function buildSet(){
    var f = document.createDocumentFragment();
    all.forEach(function(t){
      var card = document.createElement('div');
      card.className = 'postcard';
      card.innerHTML =
        '<div class="postcard-stamp" aria-hidden="true">AUTO<br/>SETU</div>'+
        '<div class="stars" aria-hidden="true">'+"★".repeat(t.rating)+"☆".repeat(5-t.rating)+'</div>'+
        '<p class="postcard-quote">"'+t.quote+'" <span style="position:absolute;left:-9999px;">Rated '+t.rating+' out of 5 stars.</span></p>'+
        '<div class="postcard-name">'+t.name+'</div>'+
        '<div class="postcard-vehicle">'+t.vehicle+'</div>';
      f.appendChild(card);
    });
    return f;
  }
  track.innerHTML = '';
  track.appendChild(buildSet());
  track.appendChild(buildSet());
}
renderReviews();

/* ---- shared inline form validation helper ---- */
function validateField(fieldEl, isValid){
  fieldEl.classList.toggle('has-error', !isValid);
  var input = fieldEl.querySelector('input, select, textarea');
  if(input) input.setAttribute('aria-invalid', String(!isValid));
  return isValid;
}
function clearFieldErrors(formEl){
  formEl.querySelectorAll('.field').forEach(function(f){ f.classList.remove('has-error'); });
}

/* ---- leave-a-review form (with inline validation) ---- */
(function(){
  var input = document.getElementById('review-rate-input');
  var current = 5;
  function draw(){
    input.innerHTML = '';
    for(var i=1;i<=5;i++){
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = '★';
      b.setAttribute('aria-label', i+' star'+(i>1?'s':''));
      b.setAttribute('aria-pressed', i<=current ? 'true':'false');
      if(i<=current) b.classList.add('is-on');
      b.addEventListener('click', function(){ current = Array.prototype.indexOf.call(input.children, this)+1; draw(); });
      input.appendChild(b);
    }
  }
  draw();
  var form = document.getElementById('review-form');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    clearFieldErrors(form);
    var nameEl = document.getElementById('review-name');
    var vehicleEl = document.getElementById('review-vehicle');
    var quoteEl = document.getElementById('review-quote');
    var okName = validateField(nameEl.closest('.field'), nameEl.value.trim().length > 0);
    var okVehicle = validateField(vehicleEl.closest('.field'), vehicleEl.value.trim().length > 0);
    var okQuote = validateField(quoteEl.closest('.field'), quoteEl.value.trim().length > 0);
    document.getElementById('review-thanks').style.display = 'none';
    if(!okName || !okVehicle || !okQuote){
      var firstInvalid = form.querySelector('.field.has-error input, .field.has-error textarea');
      if(firstInvalid) firstInvalid.focus();
      showToast('Please fill in the highlighted fields', 'error');
      return;
    }
    var list = getUserReviews();
    list.unshift({ name:nameEl.value.trim(), vehicle:vehicleEl.value.trim(), rating:current, quote:quoteEl.value.trim() });
    localStorage.setItem(userReviewsKey, JSON.stringify(list));
    renderReviews();
    document.getElementById('review-thanks').style.display = 'block';
    showToast('Review submitted — thank you!', 'success');
    form.reset();
    current = 5; draw();
  });
})();

/* ============================================================
   SERVICES DATA
   ============================================================ */
var SERVICES = [
  { id:"SVC-01", name:"Periodic oil & filter change", cat:"Maintenance", price:899, duration:45, desc:"Fully synthetic oil, OEM-grade filter, 21-point check.", icon:"oil", rating:4.8, reviews:212 },
  { id:"SVC-02", name:"General service", cat:"Maintenance", price:2499, duration:150, desc:"Comprehensive service covering fluids, filters and belts.", icon:"engine", rating:4.7, reviews:184 },
  { id:"SVC-03", name:"Brake pads & discs", cat:"Repair", price:1799, duration:90, desc:"Pad replacement, disc skimming and brake fluid top-up.", icon:"brake", rating:4.9, reviews:156 },
  { id:"SVC-04", name:"Battery check & replacement", cat:"Repair", price:649, duration:30, desc:"Load test, terminal cleaning, replacement if needed.", icon:"battery", rating:4.6, reviews:98 },
  { id:"SVC-05", name:"Clutch & gearbox check", cat:"Repair", price:1499, duration:90, desc:"Clutch plate wear check and gear-shift diagnostics.", icon:"engine", rating:4.5, reviews:64 },
  { id:"SVC-06", name:"Tyre rotation & balancing", cat:"Tyres", price:499, duration:40, desc:"4-wheel rotation, computerised balancing and air check.", icon:"tire", rating:4.7, reviews:143 },
  { id:"SVC-07", name:"4-wheel alignment", cat:"Tyres", price:799, duration:45, desc:"Laser alignment to manufacturer spec, before/after report.", icon:"tire", rating:4.8, reviews:121 },
  { id:"SVC-08", name:"PUC & pre-purchase inspection", cat:"Inspection", price:399, duration:30, desc:"Emission check plus a full 50-point inspection report.", icon:"inspect", rating:4.6, reviews:87 },
  { id:"SVC-09", name:"Insurance claim & denting-painting", cat:"Inspection", price:2999, duration:240, desc:"Cashless claim support, denting, painting and polish.", icon:"inspect", rating:4.4, reviews:52 },
  { id:"SVC-10", name:"AC service & gas top-up", cat:"Detailing", price:1099, duration:60, desc:"Cooling coil clean, gas refill and cabin filter change.", icon:"ac", rating:4.7, reviews:167 },
  { id:"SVC-11", name:"Interior & exterior detailing", cat:"Detailing", price:1999, duration:120, desc:"Foam wash, vacuuming, dashboard polish and wax coat.", icon:"snow", rating:4.8, reviews:139 },
  { id:"SVC-12", name:"Ceramic coating", cat:"Detailing", price:8999, duration:300, desc:"Paint correction with a 2-year ceramic protective layer.", icon:"snow", rating:4.9, reviews:76 },
];
/* per-spec §7: each service needs "Available Providers" — computed once from the
   provider→service mapping below rather than duplicated by hand, then attached to
   each service object so SERVICES[i].providers is always in sync with TECHNICIANS. */
function attachAvailableProviders(){
  SERVICES.forEach(function(s){
    s.providers = TECHNICIANS.filter(function(t){ return t.services.indexOf(s.name) > -1; })
      .map(function(t){ return t.code; });
  });
}
var TECHNICIANS = [
  { providerId:"PRV-01", code:"AM", name:"Arjun Mehta", role:"Lead technician · Engine & drivetrain", years:11, rating:4.9, jobs:1840, specialties:["Engines","Drivetrain","General service"], bio:"Arjun has run the shop floor since AutoSetu opened in 2013. He trained at a Hyundai authorised centre before going independent, and personally signs off every general service.", services:["Periodic oil & filter change","General service","Clutch & gearbox check","Battery check & replacement"], profileImage:"https://api.dicebear.com/7.x/initials/svg?seed=Arjun%20Mehta", workingDays:[1,2,3,4,5,6], workingHours:{start:"09:00", end:"18:00"} },
  { providerId:"PRV-02", code:"PS", name:"Priya Shenoy", role:"EV & hybrid specialist", years:6, rating:4.8, jobs:640, specialties:["EV batteries","Hybrid drivetrains","Diagnostics"], bio:"Priya is certified on high-voltage battery diagnostics for six major EV brands and leads AutoSetu's growing EV bay.", services:["General service","Battery check & replacement"], profileImage:"https://api.dicebear.com/7.x/initials/svg?seed=Priya%20Shenoy", workingDays:[1,2,3,4,5], workingHours:{start:"09:00", end:"17:30"} },
  { providerId:"PRV-03", code:"AR", name:"Ananya Rao", role:"Detailing & paint", years:5, rating:4.9, jobs:910, specialties:["Ceramic coating","Paint correction","Interior detailing"], bio:"Ananya runs the ceramic coating and paint correction bay, with a waitlist that regularly runs two weeks deep.", services:["Interior & exterior detailing","Ceramic coating","Insurance claim & denting-painting"], profileImage:"https://api.dicebear.com/7.x/initials/svg?seed=Ananya%20Rao", workingDays:[2,3,4,5,6], workingHours:{start:"10:00", end:"18:00"} },
  { providerId:"PRV-04", code:"VK", name:"Vikram Kulkarni", role:"Brakes & suspension", years:9, rating:4.8, jobs:1320, specialties:["Brakes","Suspension","Disc skimming"], bio:"Vikram handles disc skimming, pad wear checks and alignment, and trains new technicians on brake-system safety.", services:["Brake pads & discs"], profileImage:"https://api.dicebear.com/7.x/initials/svg?seed=Vikram%20Kulkarni", workingDays:[1,2,3,4,5,6], workingHours:{start:"09:00", end:"18:00"} },
  { providerId:"PRV-05", code:"RN", name:"Rahul Nair", role:"Tyres & alignment", years:7, rating:4.7, jobs:1105, specialties:["Alignment","Balancing","Tyre rotation"], bio:"Rahul runs laser alignment and balancing on the newest rig in the city, with a before/after report on every job.", services:["Tyre rotation & balancing","4-wheel alignment"], profileImage:"https://api.dicebear.com/7.x/initials/svg?seed=Rahul%20Nair", workingDays:[1,2,3,4,5,6,0], workingHours:{start:"09:00", end:"18:00"} },
  { providerId:"PRV-06", code:"SD", name:"Sana D'Souza", role:"AC & electricals", years:4, rating:4.7, jobs:520, specialties:["AC systems","Wiring","Cabin electronics"], bio:"Sana specialises in cooling systems, wiring diagnostics and cabin electronics, including OEM infotainment fixes.", services:["AC service & gas top-up","PUC & pre-purchase inspection"], profileImage:"https://api.dicebear.com/7.x/initials/svg?seed=Sana%20DSouza", workingDays:[1,2,3,4,5], workingHours:{start:"09:30", end:"17:00"} },
];
/* spec §7: services carry an explicit "Available Providers" list, computed from
   the mapping above so it can never drift out of sync. */
attachAvailableProviders();
var TEAM_DESC = {
  AM:"11 years on engines and drivetrains, heads the shop floor.",
  PS:"Certified on battery diagnostics for six major EV brands.",
  AR:"Runs the ceramic coating and paint correction bay.",
  VK:"Handles disc skimming, pad wear checks and alignment.",
  RN:"Laser alignment and balancing on the newest rig in town.",
  SD:"Cooling systems, wiring diagnostics and cabin electronics."
};

/* ============================================================
   APPOINTMENTS — mock data, application state & persistence
   Schema:
   { appointmentId, customerName, service, provider, date, time, status, notes }
   status is one of: Booked, Confirmed, In Progress, Completed, Rescheduled, Cancelled, No Show
   ============================================================ */
var APPOINTMENTS_SEED = [
  { appointmentId:"APT-1024", customerName:"Aarav Sharma", service:"Technical Support", provider:"Riya Mehta", date:"2026-08-25", time:"10:30", status:"Confirmed" },
  { appointmentId:"APT-1031", customerName:"Kavya Reddy", service:"Periodic oil & filter change", provider:"Arjun Mehta", date:"2026-09-04", time:"10:00", status:"Confirmed", duration:45 },
  { appointmentId:"APT-1042", customerName:"Suresh Iyengar", service:"Brake pads & discs", provider:"Vikram Kulkarni", date:"2026-09-06", time:"13:00", status:"Rescheduled", duration:90 },
  { appointmentId:"APT-1050", customerName:"Meera Pillai", service:"AC service & gas top-up", provider:"Sana D'Souza", date:"2026-08-18", time:"11:00", status:"Completed", duration:60 },
  { appointmentId:"APT-1057", customerName:"Farhan Sheikh", service:"Ceramic coating", provider:"Ananya Rao", date:"2026-08-10", time:"09:30", status:"Cancelled", duration:300 },
  { appointmentId:"APT-1063", customerName:"Nisha Deshmukh", service:"4-wheel alignment", provider:"Rahul Nair", date:"2026-09-10", time:"15:00", status:"Confirmed", duration:45 },
  { appointmentId:"APT-1071", customerName:"Rohan Kapoor", service:"General service", provider:"Arjun Mehta", date:"2026-09-08", time:"09:00", status:"Booked", duration:150, notes:"Requested a call before starting engine work." },
  { appointmentId:"APT-1076", customerName:"Divya Menon", service:"Battery check & replacement", provider:"Priya Shenoy", date:"2026-09-02", time:"09:30", status:"In Progress", duration:30 },
  { appointmentId:"APT-1080", customerName:"Karan Malhotra", service:"PUC & pre-purchase inspection", provider:"Sana D'Souza", date:"2026-08-15", time:"10:00", status:"No Show", duration:30 }
];

var AppointmentsStore = {
  key:'autosetu-appointments',
  get:function(){
    try{
      var raw = localStorage.getItem(this.key);
      if(!raw) return null;
      var parsed = JSON.parse(raw);
      if(!Array.isArray(parsed)) return null;
      /* filter out any malformed entries so a corrupted value can't break rendering */
      var clean = parsed.filter(function(a){
        return a && typeof a === 'object' &&
          typeof a.appointmentId === 'string' &&
          typeof a.customerName === 'string' &&
          typeof a.service === 'string';
      });
      return clean;
    }catch(e){
      return null;
    }
  },
  set:function(list){
    try{ localStorage.setItem(this.key, JSON.stringify(list)); }catch(e){ /* storage unavailable — fail silently */ }
  },
  /* returns the working list, seeding localStorage on first run or after corruption */
  init:function(){
    var list = this.get();
    if(!list){
      list = APPOINTMENTS_SEED.slice();
      this.set(list);
    }
    return list;
  },
  add:function(appt){
    var list = this.init();
    list.unshift(appt);
    this.set(list);
    return list;
  },
  updateStatus:function(id, status){
    var list = this.init();
    var appt = list.find(function(a){ return a.appointmentId === id; });
    if(appt) appt.status = status;
    this.set(list);
    return appt;
  },
  reschedule:function(id, date, time){
    var list = this.init();
    var appt = list.find(function(a){ return a.appointmentId === id; });
    if(appt){ appt.date = date; appt.time = time; appt.status = 'Rescheduled'; }
    this.set(list);
    return appt;
  },
  nextId:function(){
    var list = this.init();
    var max = 1023;
    list.forEach(function(a){
      var m = /^APT-(\d+)$/.exec(a.appointmentId || '');
      if(m){ max = Math.max(max, parseInt(m[1],10)); }
    });
    return 'APT-' + (max + 1);
  }
};

function formatApptDate(d){
  try{
    var parts = d.split('-');
    var dt = new Date(parseInt(parts[0],10), parseInt(parts[1],10)-1, parseInt(parts[2],10));
    return dt.toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short', year:'numeric' });
  }catch(e){ return d || 'Date unavailable'; }
}
function statusSlug(status){
  return String(status || '').toLowerCase().replace(/\s+/g,'-');
}
function formatApptTime(t){
  if(!t || t.indexOf(':') === -1) return t || '';
  var bits = t.split(':');
  var h = parseInt(bits[0],10);
  var m = bits[1];
  var ampm = h >= 12 ? 'PM' : 'AM';
  var h12 = h % 12; if(h12 === 0) h12 = 12;
  return h12 + ':' + m + ' ' + ampm;
}

/* ============================================================
   APPOINTMENTS — advanced 3D presentation layer (pure JS + injected CSS)
   Every visual here is generated at runtime: no external stylesheet
   or library. Cards live in a perspective stage, tilt toward the
   pointer, stagger in like a fanned stack of chits, and a cancelled
   appointment gets a rubber-stamp animation before it updates.
   ============================================================ */
function ensureApptStyles(){
  if(document.getElementById('appt-3d-styles')) return;
  var style = document.createElement('style');
  style.id = 'appt-3d-styles';
  style.textContent =
    '.appt-list-3d{perspective:1600px;perspective-origin:50% -10%;}'+
    '.appt-card{position:relative;transform-style:preserve-3d;will-change:transform;'+
      'transform:rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translateZ(0);'+
      'transition:transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s ease;'+
      'box-shadow:0 1px 0 0 rgba(20,20,10,.06),0 2px 0 0 rgba(20,20,10,.05),0 3px 0 0 rgba(20,20,10,.04),'+
        '0 14px 26px -12px rgba(20,20,10,.28),0 4px 10px -4px rgba(20,20,10,.16);'+
      'animation:apptStackIn .55s cubic-bezier(.22,1.15,.4,1) both;'+
      'animation-delay:calc(var(--i,0) * 55ms);}'+
    '.appt-card:hover{box-shadow:0 1px 0 0 rgba(20,20,10,.07),0 2px 0 0 rgba(20,20,10,.06),0 3px 0 0 rgba(20,20,10,.05),'+
        '0 26px 40px -14px rgba(20,20,10,.34),0 8px 16px -6px rgba(20,20,10,.2);}'+
    '.appt-card::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:3;'+
      'opacity:0;transition:opacity .25s ease;'+
      'background:radial-gradient(circle at var(--mx,50%) var(--my,20%), rgba(255,255,255,.5), rgba(255,255,255,0) 55%);'+
      'mix-blend-mode:overlay;}'+
    '.appt-card:hover::before{opacity:1;}'+
    '.appt-card::after{content:"";position:absolute;left:10px;right:10px;bottom:-6px;height:10px;z-index:-1;border-radius:0 0 10px 10px;'+
      'background:rgba(20,20,10,.06);transform:translateZ(-14px) scale(.96);filter:blur(2px);}'+
    '@keyframes apptStackIn{'+
      '0%{opacity:0;transform:rotateX(-55deg) translateY(-16px) translateZ(-40px);}'+
      '60%{opacity:1;}'+
      '100%{opacity:1;transform:rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translateY(0) translateZ(0);}}'+
    '.appt-status-badge{position:relative;display:inline-flex;align-items:center;gap:5px;overflow:hidden;'+
      'transform:translateZ(18px);box-shadow:0 3px 8px -2px rgba(20,20,10,.35), inset 0 1px 0 rgba(255,255,255,.35);}'+
    '.appt-status-badge::after{content:"";position:absolute;inset:0;'+
      'background:linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,.55) 50%, rgba(255,255,255,0) 70%);'+
      'transform:translateX(-120%);animation:apptBadgeSheen 3.2s ease-in-out infinite;}'+
    '@keyframes apptBadgeSheen{0%,45%{transform:translateX(-120%);}65%{transform:translateX(120%);}100%{transform:translateX(120%);}}'+
    '.appt-card-actions{transform:translateZ(14px);}'+
    '.appt-card-actions .btn{transition:transform .15s cubic-bezier(.34,1.56,.64,1), box-shadow .15s ease;}'+
    '.appt-card-actions .btn:hover{transform:translateY(-2px) translateZ(4px);box-shadow:0 6px 12px -4px rgba(20,20,10,.3);}'+
    '.appt-card-actions .btn:active{transform:translateY(1px) translateZ(0);}'+
    '.appt-card-id{transform:translateZ(10px);display:inline-block;}'+
    '.reschedule-panel{transform-origin:top center;animation:apptPanelDrop .4s cubic-bezier(.22,1.1,.36,1) both;}'+
    '@keyframes apptPanelDrop{0%{opacity:0;transform:rotateX(-70deg) translateY(-8px);}100%{opacity:1;transform:rotateX(0deg) translateY(0);}}'+
    '.appt-stamp-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;'+
      'z-index:5;pointer-events:none;border-radius:inherit;}'+
    '.appt-stamp-mark{border:3px solid #b1473c;color:#b1473c;font-family:Baloo 2, sans-serif;font-weight:800;'+
      'font-size:1.1rem;letter-spacing:.06em;text-transform:uppercase;padding:6px 18px;border-radius:8px;'+
      'background:rgba(255,247,244,.85);opacity:0;transform:scale(3) rotate(-18deg);'+
      'box-shadow:0 0 0 3px rgba(177,71,60,.15);}'+
    '.appt-stamp-overlay.is-stamping .appt-stamp-mark{animation:apptStampSlam .6s cubic-bezier(.15,.9,.25,1) forwards;}'+
    '@keyframes apptStampSlam{'+
      '0%{opacity:0;transform:scale(3) rotate(-18deg);}'+
      '55%{opacity:1;transform:scale(.92) rotate(-10deg);}'+
      '72%{transform:scale(1.06) rotate(-11deg);}'+
      '100%{opacity:1;transform:scale(1) rotate(-10deg);}}'+
    '.appt-card.is-cancelling{animation:apptCardShake .5s ease;}'+
    '@keyframes apptCardShake{0%,100%{transform:rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translateZ(0);}'+
      '20%{transform:rotateX(var(--rx,0deg)) rotateY(calc(var(--ry,0deg) - 1.2deg)) translateZ(6px);}'+
      '40%{transform:rotateX(var(--rx,0deg)) rotateY(calc(var(--ry,0deg) + 1.2deg)) translateZ(6px);}'+
      '60%{transform:rotateX(var(--rx,0deg)) rotateY(calc(var(--ry,0deg) - .6deg)) translateZ(3px);}'+
      '80%{transform:rotateX(var(--rx,0deg)) rotateY(calc(var(--ry,0deg) + .6deg)) translateZ(3px);}}'+
    '@media (prefers-reduced-motion: reduce){'+
      '.appt-card{animation:none !important;transition:none !important;transform:none !important;}'+
      '.appt-status-badge::after{animation:none !important;}'+
      '.appt-card.is-cancelling{animation:none !important;}'+
      '.appt-stamp-overlay.is-stamping .appt-stamp-mark{animation:none !important;opacity:1;transform:scale(1) rotate(-10deg);}'+
      '.reschedule-panel{animation:none !important;}}'+
    '@media (hover:none){.appt-card{transform:none !important;}.appt-card::before{display:none;}}';
  document.head.appendChild(style);
}

/* pointer-tracked tilt + gloss highlight, throttled with requestAnimationFrame */
function attachApptCardTilt(card){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if(window.matchMedia('(hover: none)').matches) return;
  var raf = null;
  card.addEventListener('mousemove', function(e){
    var r = card.getBoundingClientRect();
    var px = (e.clientX - r.left) / r.width;
    var py = (e.clientY - r.top) / r.height;
    if(raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function(){
      card.style.setProperty('--ry', ((px - 0.5) * 10).toFixed(2) + 'deg');
      card.style.setProperty('--rx', ((0.5 - py) * 8).toFixed(2) + 'deg');
      card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
    });
  });
  card.addEventListener('mouseleave', function(){
    if(raf) cancelAnimationFrame(raf);
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '20%');
  });
}

/* plays a 3D rubber-stamp animation over a card, then invokes callback */
function playApptCancelStamp(card, callback){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){ callback(); return; }
  card.classList.add('is-cancelling');
  var overlay = document.createElement('div');
  overlay.className = 'appt-stamp-overlay';
  overlay.innerHTML = '<span class="appt-stamp-mark">Cancelled</span>';
  card.appendChild(overlay);
  requestAnimationFrame(function(){ overlay.classList.add('is-stamping'); });
  setTimeout(function(){ callback(); }, 620);
}

/* ---- render "My appointments" view ---- */
var openRescheduleId = null;
function renderAppointments(){
  var listEl = document.getElementById('appt-list');
  if(!listEl) return;
  ensureApptStyles();
  listEl.classList.add('appt-list-3d');
  var searchEl = document.getElementById('appt-search');
  var filterEl = document.getElementById('appt-filter');
  var query = (searchEl && searchEl.value ? searchEl.value : '').trim().toLowerCase();
  var statusFilter = filterEl ? filterEl.value : 'All';

  var all = AppointmentsStore.init();
  var visible = all.filter(function(a){
    var matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    var haystack = (a.customerName+' '+a.service+' '+a.appointmentId+' '+(a.provider||'')).toLowerCase();
    var matchesQuery = !query || haystack.indexOf(query) > -1;
    return matchesStatus && matchesQuery;
  });
  /* soonest upcoming first, using date+time as sort key */
  visible.sort(function(a,b){ return (a.date+'T'+(a.time||'00:00')).localeCompare(b.date+'T'+(b.time||'00:00')); });

  listEl.innerHTML = '';
  if(!visible.length){
    listEl.innerHTML = '<p class="appt-empty">No appointments match this search yet. Try a different name, chit number, or status — or book a fresh seva.</p>';
    return;
  }

  visible.forEach(function(a, idx){
    var card = document.createElement('div');
    card.className = 'appt-card';
    card.style.setProperty('--i', idx);
    var canAct = (a.status === 'Confirmed' || a.status === 'Rescheduled');
    card.innerHTML =
      '<div class="appt-card-main">'+
        '<span class="appt-card-id">#'+a.appointmentId+'</span>'+
        '<span class="appt-card-svc">'+a.service+'</span>'+
        '<span class="appt-card-meta">'+a.customerName+' · '+(a.provider||'Unassigned')+'</span>'+
        '<span class="appt-card-meta">'+formatApptDate(a.date)+' · '+formatApptTime(a.time)+'</span>'+
      '</div>'+
      '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:10px;">'+
        '<span class="appt-status-badge appt-status-'+statusSlug(a.status)+'">'+a.status+'</span>'+
        (canAct ? '<div class="appt-card-actions">'+
          '<button type="button" class="btn btn-outline btn-sm appt-reschedule-btn" data-id="'+a.appointmentId+'">Reschedule</button>'+
          '<button type="button" class="btn btn-ghost btn-sm appt-cancel-btn" data-id="'+a.appointmentId+'">Cancel</button>'+
        '</div>' : '')+
      '</div>'+
      (openRescheduleId === a.appointmentId ?
        '<div class="reschedule-panel">'+
          '<div class="field"><label for="resched-date-'+a.appointmentId+'">New date</label><input type="date" id="resched-date-'+a.appointmentId+'" value="'+a.date+'" min="'+todayStrGlobal()+'"></div>'+
          '<div class="field"><label for="resched-time-'+a.appointmentId+'">New time</label><input type="time" id="resched-time-'+a.appointmentId+'" value="'+(a.time||'')+'"></div>'+
          '<span class="field-error-msg" id="resched-error-'+a.appointmentId+'" style="display:none;align-items:center;gap:5px;">⚠ That slot is not available.</span>'+
          '<button type="button" class="btn btn-primary btn-sm appt-resched-save" data-id="'+a.appointmentId+'">Save new slot</button>'+
          '<button type="button" class="btn btn-ghost btn-sm appt-resched-cancel">Close</button>'+
        '</div>' : '');
    attachApptCardTilt(card);
    listEl.appendChild(card);
  });

  listEl.querySelectorAll('.appt-cancel-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var id = btn.dataset.id;
      confirmDialog('Cancel this appointment?', 'Chit #'+id+' will be marked as cancelled. You can always book a new slot.', 'Cancel booking').then(function(ok){
        if(!ok) return;
        var card = btn.closest('.appt-card');
        playApptCancelStamp(card, function(){
          AppointmentsStore.updateStatus(id, 'Cancelled');
          renderAppointments();
          showToast('Appointment '+id+' cancelled', 'success');
        });
      });
    });
  });
  listEl.querySelectorAll('.appt-reschedule-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      openRescheduleId = (openRescheduleId === btn.dataset.id) ? null : btn.dataset.id;
      renderAppointments();
    });
  });
  listEl.querySelectorAll('.appt-resched-cancel').forEach(function(btn){
    btn.addEventListener('click', function(){ openRescheduleId = null; renderAppointments(); });
  });
  listEl.querySelectorAll('.appt-resched-save').forEach(function(btn){
    btn.addEventListener('click', function(){
      var id = btn.dataset.id;
      var dateEl = document.getElementById('resched-date-'+id);
      var timeEl = document.getElementById('resched-time-'+id);
      var errEl = document.getElementById('resched-error-'+id);
      if(!dateEl.value || !timeEl.value){
        showToast('Please choose both a date and a time', 'error');
        return;
      }
      var all = AppointmentsStore.init();
      var appt = all.find(function(a){ return a.appointmentId === id; });
      var check = isSlotAvailable(providerNameToCode(appt.provider), dateEl.value, timeEl.value, appt.duration || 60, id);
      if(!check.ok){
        if(errEl){ errEl.textContent = '⚠ '+check.reason; errEl.style.display='flex'; }
        showToast(check.reason, 'error');
        return;
      }
      if(errEl) errEl.style.display = 'none';
      AppointmentsStore.reschedule(id, dateEl.value, timeEl.value);
      openRescheduleId = null;
      renderAppointments();
      showToast('Appointment '+id+' rescheduled', 'success');
    });
  });
}
function todayStrGlobal(){ return new Date().toISOString().slice(0,10); }
function providerNameToCode(name){
  var t = TECHNICIANS.find(function(x){ return x.name === name; });
  return t ? t.code : null;
}

var appointmentsBuilt = false;
function buildAppointmentsView(){
  if(appointmentsBuilt) return;
  appointmentsBuilt = true;
  document.getElementById('appt-search').addEventListener('input', renderAppointments);
  document.getElementById('appt-filter').addEventListener('change', renderAppointments);
  renderAppointments();
}

function ratingStars(r){
  var full = Math.round(r);
  return "★".repeat(full) + "☆".repeat(5-full);
}

function openProviderModal(code){
  var t = TECHNICIANS.find(function(x){ return x.code === code; });
  if(!t) return;
  var html =
    '<div class="provider-modal-head"><span class="avatar" aria-hidden="true">'+t.code+'</span><div><h3>'+t.name+'</h3><div class="provider-modal-role">'+t.role+'</div>'+
    '<div class="rating-line"><span class="rating-stars" aria-hidden="true">'+ratingStars(t.rating)+'</span><span>'+t.rating.toFixed(1)+' out of 5</span></div></div></div>'+
    '<div class="provider-modal-body">'+
      '<div class="provider-stat-row">'+
        '<div class="provider-stat"><b>'+t.years+' yrs</b><span>Experience</span></div>'+
        '<div class="provider-stat"><b>'+t.jobs.toLocaleString('en-IN')+'</b><span>Jobs completed</span></div>'+
        '<div class="provider-stat"><b>'+t.rating.toFixed(1)+'★</b><span>Customer rating</span></div>'+
      '</div>'+
      '<p>'+t.bio+'</p>'+
      '<div><strong style="font-size:0.85rem;color:var(--teal-deep);">Specialties</strong>'+
      '<div class="provider-specialties" style="margin-top:8px;">'+t.specialties.map(function(s){ return '<span>'+s+'</span>'; }).join('')+'</div></div>'+
      '<div><strong style="font-size:0.85rem;color:var(--teal-deep);">Services offered</strong>'+
      '<div class="provider-specialties" style="margin-top:8px;">'+t.services.map(function(s){ return '<span>'+s+'</span>'; }).join('')+'</div></div>'+
    '</div>';
  openModal(html, false);
}

/* ---- compare feature ---- */
var CompareList = [];
function updateCompareBar(){
  var bar = document.getElementById('compare-bar');
  document.getElementById('compare-count').textContent = CompareList.length + ' selected (max 3)';
  bar.classList.toggle('is-visible', CompareList.length > 0);
}
document.getElementById('compare-clear-btn').addEventListener('click', function(){
  if(!CompareList.length) return;
  confirmDialog('Clear comparison?', 'This removes all '+CompareList.length+' service(s) from your comparison list.', 'Clear').then(function(ok){
    if(!ok) return;
    CompareList = [];
    document.querySelectorAll('.svc-compare-check input').forEach(function(cb){ cb.checked = false; });
    updateCompareBar();
    showToast('Comparison cleared', 'success');
  });
});
document.getElementById('compare-open-btn').addEventListener('click', function(){
  if(!CompareList.length) return;
  var rows = [
    { label:'Category', key:'cat' },
    { label:'Starting price', key:'price', fmt:function(v){ return '\u20B9'+v.toLocaleString('en-IN'); } },
    { label:'Duration', key:'duration', fmt:function(v){ return '~'+v+' min'; } },
    { label:'What it covers', key:'desc' }
  ];
  var svcs = CompareList.map(function(name){ return SERVICES.find(function(s){ return s.name === name; }); }).filter(Boolean);
  var html = '<h3 style="color:var(--teal-deep);font-size:1.1rem;">Comparing '+svcs.length+' services</h3>'+
    '<table class="compare-table"><thead><tr><th scope="col"></th>'+svcs.map(function(s){ return '<th scope="col">'+s.name+'</th>'; }).join('')+'</tr></thead><tbody>'+
    rows.map(function(r){
      return '<tr><th scope="row" class="compare-label">'+r.label+'</th>'+svcs.map(function(s){
        var v = s[r.key];
        return '<td>'+(r.fmt ? r.fmt(v) : v)+'</td>';
      }).join('')+'</tr>';
    }).join('') +
    '<tr><th scope="row" class="compare-label">Rating</th>'+svcs.map(function(s){ return '<td>'+s.rating.toFixed(1)+' out of 5 ('+s.reviews+' reviews)</td>'; }).join('')+'</tr>'+
    '</tbody></table>';
  openModal(html, true);
});

/* ============================================================
   AVAILABILITY ENGINE
   Working hours: Mon–Sat 9:00–18:00, Sunday 10:00–14:00.
   A slot is available only if:
   - it is not in the past,
   - it falls fully inside the provider's working hours for that day,
   - it does not overlap any existing non-cancelled appointment
     for that same provider (duration-aware).
   ============================================================ */
function timeToMinutes(t){
  var p = (t || '00:00').split(':');
  return parseInt(p[0],10)*60 + parseInt(p[1],10);
}
function minutesToTime(m){
  var h = Math.floor(m/60), mm = m%60;
  return (h<10?'0':'')+h+':'+(mm<10?'0':'')+mm;
}
/* Falls back to the shop-wide default (Mon–Sat 9:00–18:00, Sun 10:00–14:00) when no
   provider is given, but otherwise reads the provider's own workingDays/workingHours. */
function getWorkingHoursForDate(dateStr, providerCode){
  var d = new Date(dateStr+'T00:00:00');
  var day = d.getDay(); /* 0 = Sunday ... 6 = Saturday */
  var tech = providerCode ? TECHNICIANS.find(function(t){ return t.code === providerCode; }) : null;
  if(tech && tech.workingHours){
    return { start:timeToMinutes(tech.workingHours.start), end:timeToMinutes(tech.workingHours.end) };
  }
  if(day === 0) return { start:600, end:840 };   /* 10:00–14:00 */
  return { start:540, end:1080 };                /* 9:00–18:00 */
}
function isProviderWorkingOnDate(providerCode, dateStr){
  var tech = TECHNICIANS.find(function(t){ return t.code === providerCode; });
  if(!tech || !tech.workingDays) return true;
  var day = new Date(dateStr+'T00:00:00').getDay();
  return tech.workingDays.indexOf(day) > -1;
}
function isPastDateTime(dateStr, timeStr){
  if(!dateStr || !timeStr) return false;
  var dt = new Date(dateStr+'T'+timeStr+':00');
  return dt.getTime() <= Date.now();
}
function getActiveAppointmentsForProvider(providerName, excludeId){
  return AppointmentsStore.init().filter(function(a){
    return a.provider === providerName && a.status !== 'Cancelled' && a.appointmentId !== excludeId;
  });
}
/* returns {ok:boolean, reason?:string} */
function isSlotAvailable(providerCode, dateStr, timeStr, duration, excludeId){
  var tech = TECHNICIANS.find(function(t){ return t.code === providerCode; });
  if(!tech) return { ok:false, reason:'Please choose a technician.' };
  if(!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return { ok:false, reason:'Please pick a valid date.' };
  if(!timeStr || !/^\d{2}:\d{2}$/.test(timeStr)) return { ok:false, reason:'Please pick a valid time.' };
  if(isPastDateTime(dateStr, timeStr)) return { ok:false, reason:'That date/time has already passed. Please choose a future slot.' };
  if(!isProviderWorkingOnDate(providerCode, dateStr)){
    return { ok:false, reason:tech.name.split(' ')[0]+" isn't working that day — outside working hours." };
  }
  var dur = duration || 60;
  var hours = getWorkingHoursForDate(dateStr, providerCode);
  var startMin = timeToMinutes(timeStr);
  var endMin = startMin + dur;
  if(startMin < hours.start || endMin > hours.end){
    return { ok:false, reason:'That time is outside '+tech.name.split(' ')[0]+"'s working hours for that day." };
  }
  var existing = getActiveAppointmentsForProvider(tech.name, excludeId).filter(function(a){ return a.date === dateStr; });
  var conflict = existing.some(function(a){
    var aStart = timeToMinutes(a.time || '09:00');
    var aEnd = aStart + (a.duration || 60);
    return startMin < aEnd && aStart < endMin;
  });
  if(conflict) return { ok:false, reason:tech.name+' already has an appointment then. Please pick another slot.' };
  return { ok:true };
}

/* ---- services view: tabs, flip cards, technician picker, booking form ---- */
var servicesBuilt = false;
function buildServicesView(){
  if(servicesBuilt) return;
  servicesBuilt = true;

  var tabsEl = document.getElementById('svc-tabs');
  var gridEl = document.getElementById('svc-grid');
  var selectEl = document.getElementById('svc-select');
  var cats = ["All"];
  SERVICES.forEach(function(s){ if(cats.indexOf(s.cat)===-1) cats.push(s.cat); });
  var active = "All";

  function render(){
    gridEl.innerHTML = "";
    var visible = SERVICES.filter(function(s){ return active==="All" || s.cat===active; });
    if(!visible.length){
      gridEl.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--ink-soft);padding:30px 0;">No services found in this category yet.</p>';
      return;
    }
    visible.forEach(function(s){
      var card = document.createElement('div');
      card.className = 'svc-card';
      card.tabIndex = 0;
      card.setAttribute('role','button');
      card.setAttribute('aria-label', 'Flip card for '+s.name+' to see price');
      var isFav = Favorites.has(s.name);
      var isCompared = CompareList.indexOf(s.name) > -1;
      card.innerHTML =
        '<div class="svc-card-inner">'+
          '<div class="svc-face svc-front">'+
            '<button class="fav-btn'+(isFav?' is-fav':'')+'" data-name="'+s.name.replace(/"/g,'&quot;')+'" aria-label="'+(isFav?'Remove ':'Add ')+s.name+' to favorites" aria-pressed="'+isFav+'"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7.5-4.6-9.6-9A5.3 5.3 0 0 1 12 6a5.3 5.3 0 0 1 9.6 5c-2.1 4.4-9.6 9-9.6 9Z"/></svg></button>'+
            '<span class="svc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ICONS[s.icon]+'</svg></span>'+
            '<div><h3>'+s.name+'</h3><div class="svc-cat">'+s.cat+'</div>'+
            '<div class="rating-line"><span class="rating-stars" aria-hidden="true">'+ratingStars(s.rating)+'</span><span>'+s.rating.toFixed(1)+' out of 5 ('+s.reviews+' reviews)</span></div></div>'+
            '<div class="svc-flip-hint">Tap for price →</div>'+
          '</div>'+
          '<div class="svc-face svc-back">'+
            '<p>'+s.desc+'</p>'+
            '<div>'+
              '<div class="svc-price">\u20B9'+s.price.toLocaleString('en-IN')+'<span>starting price</span></div>'+
              '<div class="svc-duration">~'+s.duration+' min</div>'+
              '<div class="svc-back-actions">'+
                '<a href="#booking" class="btn btn-gold btn-sm svc-book-btn" data-svc="'+s.name.replace(/"/g,'&quot;')+'">Book this seva</a>'+
                '<label class="svc-compare-check"><input type="checkbox" class="compare-check" data-name="'+s.name.replace(/"/g,'&quot;')+'" '+(isCompared?'checked':'')+'> Compare</label>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>';
      card.addEventListener('click', function(e){
        if(e.target.closest('.svc-book-btn') || e.target.closest('.svc-compare-check') || e.target.closest('.fav-btn')) return;
        card.classList.toggle('is-flipped');
        if(card.classList.contains('is-flipped')) RecentlyViewed.add(s.name);
      });
      card.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); card.click(); }});
      gridEl.appendChild(card);
    });
    gridEl.querySelectorAll('.svc-book-btn').forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.stopPropagation();
        var svcName = btn.dataset.svc;
        var owningTech = TECHNICIANS.find(function(t){ return t.services.indexOf(svcName) > -1; });
        if(owningTech){
          selectTechnician(owningTech.code);
        }
        selectEl.value = svcName;
        validateField(selectEl.closest('.field'), true);
        renderSchedule(selectedTechCode);
        showToast(svcName+' added to the booking form below', 'success');
      });
    });
    gridEl.querySelectorAll('.fav-btn').forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.stopPropagation();
        var wasFav = btn.classList.contains('is-fav');
        Favorites.toggle(btn.dataset.name);
        btn.classList.toggle('is-fav');
        btn.setAttribute('aria-pressed', String(!wasFav));
        showToast(wasFav ? 'Removed from favorites' : 'Added to favorites', 'success');
      });
    });
    gridEl.querySelectorAll('.compare-check').forEach(function(cb){
      cb.addEventListener('click', function(e){ e.stopPropagation(); });
      cb.addEventListener('change', function(){
        var name = cb.dataset.name;
        if(cb.checked){
          if(CompareList.length >= 3){ cb.checked = false; showToast('You can compare up to 3 services at a time.', 'error'); return; }
          CompareList.push(name);
        } else {
          CompareList = CompareList.filter(function(n){ return n !== name; });
        }
        updateCompareBar();
      });
    });
  }

  cats.forEach(function(c){
    var btn = document.createElement('button');
    btn.className = 'svc-tab' + (c==='All' ? ' is-active':'');
    btn.type = 'button';
    btn.setAttribute('aria-pressed', c==='All' ? 'true':'false');
    btn.textContent = c;
    btn.addEventListener('click', function(){
      active = c;
      tabsEl.querySelectorAll('.svc-tab').forEach(function(b){ b.classList.remove('is-active'); b.setAttribute('aria-pressed','false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed','true');
      render();
    });
    tabsEl.appendChild(btn);
  });

  /* only services offered by the currently-selected provider populate the dropdown */
  function refreshServiceOptions(code){
    var tech = TECHNICIANS.find(function(t){ return t.code === code; });
    var offered = tech ? tech.services : [];
    var previousValue = selectEl.value;
    selectEl.innerHTML = '<option value="">Select a service…</option>';
    SERVICES.filter(function(s){ return offered.indexOf(s.name) > -1; }).forEach(function(s){
      var opt = document.createElement('option');
      opt.value = s.name; opt.textContent = s.name+' — from \u20B9'+s.price.toLocaleString('en-IN')+' (~'+s.duration+' min)';
      selectEl.appendChild(opt);
    });
    if(offered.indexOf(previousValue) > -1) selectEl.value = previousValue;
  }

  render();
  renderRecentStrip();

  var techGrid = document.getElementById('tech-grid');
  techGrid.setAttribute('role','radiogroup');
  techGrid.setAttribute('aria-label','Choose a technician');
  var selectedTechCode = null;

  function selectTechnician(code){
    selectedTechCode = code;
    techGrid.querySelectorAll('.tech-pick').forEach(function(p){
      var on = p.dataset.code === code;
      p.classList.toggle('is-selected', on);
      p.setAttribute('aria-checked', on ? 'true':'false');
    });
    validateField(document.getElementById('tech-grid').closest('.field'), true);
    refreshServiceOptions(code);
    renderSchedule(code);
  }

  TECHNICIANS.forEach(function(t, i){
    var pick = document.createElement('div');
    pick.className = 'tech-pick';
    pick.dataset.code = t.code;
    pick.setAttribute('role','radio');
    pick.setAttribute('aria-checked','false');
    pick.setAttribute('aria-label', t.name+', '+t.role);
    pick.tabIndex = 0;
    pick.innerHTML = '<span class="avatar" aria-hidden="true">'+t.code+'</span><span><span class="tech-pick-name">'+t.name+'</span><br><span class="tech-pick-role">'+t.role+'</span></span>'+
      '<button type="button" class="tech-pick-info" data-code="'+t.code+'" aria-label="View full profile: '+t.name+'">ⓘ</button>';
    pick.addEventListener('click', function(e){
      if(e.target.closest('.tech-pick-info')) return;
      selectTechnician(t.code);
    });
    pick.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); pick.click(); }});
    techGrid.appendChild(pick);
  });
  techGrid.querySelectorAll('.tech-pick-info').forEach(function(btn){
    btn.addEventListener('click', function(e){ e.stopPropagation(); openProviderModal(btn.dataset.code); });
  });

  /* nothing selected until the customer picks a technician — services & schedule stay empty until then */
  selectEl.innerHTML = '<option value="">Select a technician first…</option>';

  /* ---- schedule visualization: real upcoming dates, real working hours, real conflicts ---- */
  var scheduleGrid = document.getElementById('schedule-grid');
  var scheduleHint = document.getElementById('schedule-hint');
  var pickedCell = null;
  var DAY_COUNT = 6;
  var SLOT_TIMES = ['09:00','11:00','13:00','15:00','17:00'];

  function nextDates(n){
    var out = [];
    var base = new Date();
    for(var i=0;i<n;i++){
      var d = new Date(base.getTime() + i*86400000);
      out.push(d.toISOString().slice(0,10));
    }
    return out;
  }
  function dayLabel(dateStr, idx){
    var d = new Date(dateStr+'T00:00:00');
    var wd = d.toLocaleDateString('en-IN', { weekday:'short' });
    var md = d.toLocaleDateString('en-IN', { day:'numeric', month:'short' });
    return (idx===0 ? 'Today' : wd) + '<small>'+md+'</small>';
  }

  function renderSchedule(code){
    scheduleGrid.innerHTML = '';
    pickedCell = null;
    if(!code){
      scheduleHint.textContent = 'Choose a technician above to see their real availability.';
      return;
    }
    scheduleHint.textContent = "Green slots are open for your chosen technician. Tap one to fill in the date & time above. Busy/closed slots can't be selected.";
    var dur = 60;
    var svcName = selectEl.value;
    if(svcName){
      var svc = SERVICES.find(function(s){ return s.name === svcName; });
      if(svc) dur = svc.duration;
    }
    var dates = nextDates(DAY_COUNT);

    scheduleGrid.appendChild(document.createElement('div'));
    dates.forEach(function(dateStr, idx){
      var h = document.createElement('div');
      h.className = 'sched-head';
      h.innerHTML = dayLabel(dateStr, idx);
      scheduleGrid.appendChild(h);
    });

    SLOT_TIMES.forEach(function(timeStr){
      var label = document.createElement('div');
      label.className = 'sched-row-label';
      var bits = timeStr.split(':');
      var hr = parseInt(bits[0],10);
      var ampm = hr>=12?'PM':'AM'; var h12 = hr%12; if(h12===0) h12=12;
      label.textContent = h12+':'+bits[1]+' '+ampm;
      scheduleGrid.appendChild(label);

      dates.forEach(function(dateStr){
        var check = isSlotAvailable(code, dateStr, timeStr, dur);
        var cell = document.createElement('button');
        cell.type = 'button';
        var isPast = isPastDateTime(dateStr, timeStr);
        var cls = check.ok ? 'avail' : (isPast || (check.reason||'').indexOf('working hours')>-1 ? 'closed' : 'busy');
        cell.className = 'sched-cell ' + cls;
        cell.textContent = check.ok ? 'Open' : (cls==='closed' ? 'Closed' : 'Booked');
        cell.disabled = !check.ok;
        cell.setAttribute('aria-label', dateStr+' '+timeStr+', '+(check.ok ? 'open' : (check.reason||'not available')));
        if(check.ok){
          cell.addEventListener('click', function(){
            if(pickedCell) pickedCell.classList.remove('is-picked');
            cell.classList.add('is-picked');
            pickedCell = cell;
            document.getElementById('date-input').value = dateStr;
            validateField(document.getElementById('date-input').closest('.field'), true);
            document.getElementById('time-input').value = timeStr;
            validateField(document.getElementById('time-input').closest('.field'), true);
          });
        }
        scheduleGrid.appendChild(cell);
      });
    });
  }
  renderSchedule(null);

  /* re-check the grid whenever the chosen service (and therefore its duration) changes */
  selectEl.addEventListener('change', function(){
    validateField(selectEl.closest('.field'), !!selectEl.value);
    renderSchedule(selectedTechCode);
  });
  /* also re-validate manually typed dates/times against real availability as the customer edits them */
  document.getElementById('date-input').min = todayStrGlobal();
  document.getElementById('date-input').addEventListener('change', function(){
    validateField(this.closest('.field'), !!this.value && this.value >= todayStrGlobal());
  });

  /* ---- booking submit: validation → loading → success/error → saved to appointments ---- */
  var bookingForm = document.getElementById('booking-form');
  var submitBtn = document.getElementById('booking-submit-btn');
  var loadingAlert = document.getElementById('booking-loading');
  var errorAlert = document.getElementById('booking-error');
  var errorText = document.getElementById('booking-error-text');
  var confirmPanel = document.getElementById('confirm-panel');
  var techField = document.getElementById('tech-grid').closest('.field');
  var timeErrorMsg = document.getElementById('time-error-msg');

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var PHONE_RE = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;

  bookingForm.addEventListener('submit', function(e){
    e.preventDefault();
    clearFieldErrors(bookingForm);
    errorAlert.classList.remove('is-visible');
    confirmPanel.classList.remove('is-visible');
    timeErrorMsg.textContent = '⚠ Please pick a time.';

    var nameEl = document.getElementById('name-input');
    var emailEl = document.getElementById('email-input');
    var phoneEl = document.getElementById('phone-input');
    var svcName = selectEl.value;
    var vehicleEl = document.getElementById('veh-input');
    var dateEl = document.getElementById('date-input');
    var timeEl = document.getElementById('time-input');
    var notesEl = document.getElementById('notes-input');

    var okTech = validateField(techField, !!selectedTechCode);
    var okName = validateField(document.getElementById('field-name'), nameEl.value.trim().length > 1);
    var okEmail = validateField(document.getElementById('field-email'), EMAIL_RE.test(emailEl.value.trim()));
    var okPhone = validateField(document.getElementById('field-phone'), PHONE_RE.test(phoneEl.value.trim().replace(/[\s-]/g,'')));
    var okSvc = validateField(document.getElementById('field-svc'), !!svcName);
    var okVeh = validateField(document.getElementById('field-veh'), vehicleEl.value.trim().length > 2);
    var okDate = validateField(document.getElementById('field-date'), !!dateEl.value && dateEl.value >= todayStrGlobal());

    var svc = svcName ? SERVICES.find(function(s){ return s.name === svcName; }) : null;
    var slotCheck = { ok:false, reason:'Please pick a time.' };
    if(okTech && okDate && timeEl.value && svc){
      slotCheck = isSlotAvailable(selectedTechCode, dateEl.value, timeEl.value, svc.duration);
    } else if(!timeEl.value){
      slotCheck = { ok:false, reason:'Please pick a time.' };
    }
    if(slotCheck.reason) timeErrorMsg.textContent = '⚠ '+slotCheck.reason;
    var okTime = validateField(document.getElementById('field-time'), slotCheck.ok);

    if(!okTech || !okName || !okEmail || !okPhone || !okSvc || !okVeh || !okDate || !okTime){
      errorText.textContent = "We couldn't complete your booking. Please fix the highlighted fields and try again.";
      errorAlert.classList.add('is-visible');
      var firstInvalid = bookingForm.querySelector('.field.has-error input, .field.has-error select, .field.has-error [role="radiogroup"]');
      if(firstInvalid && firstInvalid.focus) firstInvalid.focus();
      showToast('Please fix the highlighted fields', 'error');
      return;
    }

    var customerName = nameEl.value.trim();
    var email = emailEl.value.trim();
    var phone = phoneEl.value.trim();
    var vehicle = vehicleEl.value.trim();
    var date = dateEl.value;
    var time = timeEl.value;
    var notes = notesEl.value.trim();
    var tech = TECHNICIANS.find(function(t){ return t.code === selectedTechCode; });
    var smsOn = document.getElementById('reminder-sms').checked;
    var emailOn = document.getElementById('reminder-email').checked;

    /* loading state */
    submitBtn.disabled = true;
    submitBtn.textContent = 'Confirming…';
    loadingAlert.classList.add('is-visible');

    setTimeout(function(){
      loadingAlert.classList.remove('is-visible');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirm booking';

      /* final race-condition guard: re-check availability right before writing, in case
         another tab/booking took the slot while this one was "confirming" */
      var finalCheck = isSlotAvailable(selectedTechCode, date, time, svc.duration);
      if(!finalCheck.ok){
        errorText.textContent = finalCheck.reason + ' Please choose another slot.';
        errorAlert.classList.add('is-visible');
        validateField(document.getElementById('field-time'), false);
        renderSchedule(selectedTechCode);
        showToast(finalCheck.reason, 'error');
        return;
      }

      var appointmentId = AppointmentsStore.nextId();
      var appt = {
        appointmentId: appointmentId,
        customerName: customerName,
        email: email,
        phone: phone,
        service: svc.name,
        provider: tech.name,
        date: date,
        time: time,
        duration: svc.duration,
        status: "Confirmed",
        vehicle: vehicle,
        price: svc.price,
        notes: notes,
        smsReminder: smsOn,
        emailReminder: emailOn
      };
      AppointmentsStore.add(appt);

      var visitCount = AppointmentsStore.init().filter(function(a){ return a.customerName === customerName; }).length;
      confirmPanel.classList.add('is-visible');
      document.getElementById('confirm-stats').innerHTML =
        '<div class="confirm-stat"><b>#'+appointmentId+'</b><span>Booking chit</span></div>'+
        '<div class="confirm-stat"><b>'+(visitCount===1?'1st':visitCount+(visitCount===2?'nd':visitCount===3?'rd':'th'))+'</b><span>Visit with AutoSetu</span></div>'+
        '<div class="confirm-stat"><b>\u20B9'+svc.price.toLocaleString('en-IN')+'</b><span>Estimated total</span></div>'+
        '<div class="confirm-stat"><b>~'+svc.duration+' min</b><span>Estimated duration</span></div>'+
        '<div class="confirm-stat"><b>'+(smsOn && emailOn ? '2 set' : (smsOn||emailOn) ? '1 set' : 'None')+'</b><span>Reminders</span></div>'+
        '<div class="confirm-stat"><b>'+tech.name.split(' ')[0]+'</b><span>Your technician</span></div>';
      confirmPanel.scrollIntoView({behavior:'smooth', block:'nearest'});
      showToast('Booking confirmed — chit #'+appointmentId, 'success');

      window._lastBooking = { ticketId:appointmentId, svc:svc, vehicle:vehicle, date:date, time:time, tech:tech, smsOn:smsOn, emailOn:emailOn };
      renderSchedule(selectedTechCode); /* the just-booked slot now shows as Booked */
      appointmentsBuilt = false; /* force refresh of appointments list next time it's opened */
      if(staffAppointmentsBuilt && document.getElementById('staff-dashboard') && document.getElementById('staff-dashboard').style.display !== 'none'){
        var staffSessionNow = getStaffSession();
        if(staffSessionNow) renderStaffDashboard(staffSessionNow); /* keep the staff board in sync with new bookings */
      }
    }, 900);
  });

  document.getElementById('print-btn').addEventListener('click', function(){
    var b = window._lastBooking;
    if(!b){ return; }
    document.getElementById('print-chit').innerHTML =
      '<h1 style="font-family:Baloo 2, sans-serif;">AutoSetu — Booking Confirmation</h1>'+
      '<p>Booking chit #'+b.ticketId+'</p>'+
      '<table style="border-collapse:collapse;margin-top:16px;width:100%;max-width:480px;">'+
        '<tr><td style="padding:6px 0;color:#555;">Service</td><td style="padding:6px 0;font-weight:700;">'+b.svc.name+'</td></tr>'+
        '<tr><td style="padding:6px 0;color:#555;">Vehicle</td><td style="padding:6px 0;font-weight:700;">'+b.vehicle+'</td></tr>'+
        '<tr><td style="padding:6px 0;color:#555;">Date</td><td style="padding:6px 0;font-weight:700;">'+b.date+'</td></tr>'+
        '<tr><td style="padding:6px 0;color:#555;">Time</td><td style="padding:6px 0;font-weight:700;">'+b.time+'</td></tr>'+
        '<tr><td style="padding:6px 0;color:#555;">Technician</td><td style="padding:6px 0;font-weight:700;">'+b.tech.name+'</td></tr>'+
        '<tr><td style="padding:6px 0;color:#555;">Estimate</td><td style="padding:6px 0;font-weight:700;">From \u20B9'+b.svc.price.toLocaleString('en-IN')+'</td></tr>'+
      '</table>'+
      '<p style="margin-top:20px;color:#555;">24, Residency Road, Bengaluru, Karnataka 560025 · +91 98765 43210</p>';
    window.print();
  });

  document.getElementById('calendar-btn').addEventListener('click', function(){
    var b = window._lastBooking;
    if(!b){ return; }
    var dt = (b.date || new Date().toISOString().slice(0,10)).replace(/-/g,'');
    var tm = (b.time || '10:00').replace(':','') + '00';
    var ics = ['BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT',
      'SUMMARY:AutoSetu — '+b.svc.name,
      'DTSTART:'+dt+'T'+tm,
      'DESCRIPTION:Booking chit #'+b.ticketId+' with '+b.tech.name+'. Vehicle: '+b.vehicle,
      'LOCATION:24 Residency Road, Bengaluru, Karnataka 560025',
      'END:VEVENT','END:VCALENDAR'].join('\\r\\n');
    var blob = new Blob([ics], {type:'text/calendar'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'autosetu-'+b.ticketId+'.ics';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Calendar file downloaded', 'success');
  });
}

/* ---- staff view: login/signup tabs + team directory ---- */
var staffBuilt = false;
var STAFF_SESSION_KEY = 'autosetu-staff-session';
var DEMO_STAFF_ACCOUNTS = [
  { email:'arjun@autosetu.in', password:'staff123', name:'Arjun Mehta', role:'Lead technician' },
  { email:'staff@autosetu.in', password:'demo1234', name:'Staff Demo', role:'Front desk' }
];
function getStaffSession(){
  try{ return JSON.parse(localStorage.getItem(STAFF_SESSION_KEY)); }catch(e){ return null; }
}
function setStaffSession(account){
  try{
    if(account) localStorage.setItem(STAFF_SESSION_KEY, JSON.stringify({ name:account.name, role:account.role, email:account.email }));
    else localStorage.removeItem(STAFF_SESSION_KEY);
  }catch(e){ /* storage unavailable — session just won't persist across reloads */ }
}
function buildStaffView(){
  if(staffBuilt) return;
  staffBuilt = true;

  document.querySelectorAll('.staff-tab').forEach(function(tab){
    tab.addEventListener('click', function(){
      document.querySelectorAll('.staff-tab').forEach(function(t){ t.classList.remove('is-active'); t.setAttribute('aria-pressed','false'); });
      document.querySelectorAll('.auth-form').forEach(function(f){ f.classList.remove('is-active'); });
      tab.classList.add('is-active');
      tab.setAttribute('aria-pressed','true');
      document.getElementById(tab.dataset.target).classList.add('is-active');
    });
  });

  function wireAuthForm(id, fields){
    var form = document.getElementById(id);
    form.addEventListener('submit', function(e){
      e.preventDefault();
      clearFieldErrors(form);
      var allOk = true;
      fields.forEach(function(f){
        var el = document.getElementById(f.id);
        var ok = f.check(el.value);
        if(!validateField(document.getElementById(f.field), ok)) allOk = false;
      });
      if(!allOk){
        var firstInvalid = form.querySelector('.field.has-error input, .field.has-error select');
        if(firstInvalid) firstInvalid.focus();
        showToast('Please fix the highlighted fields', 'error');
        return;
      }

      if(id === 'login-form'){
        var emailVal = document.getElementById('login-id').value.trim().toLowerCase();
        var passVal = document.getElementById('login-pass').value;
        var account = DEMO_STAFF_ACCOUNTS.find(function(a){ return a.email === emailVal && a.password === passVal; });
        if(!account){
          validateField(document.getElementById('field-login-id'), false);
          validateField(document.getElementById('field-login-pass'), false);
          showToast('Invalid email or password — try the demo credentials shown below the form', 'error');
          return;
        }
        setStaffSession(account);
        showStaffDashboard(account);
        showToast('Welcome back, '+account.name.split(' ')[0]+'!', 'success');
        return;
      }

      /* signup stays a demo — no backend to provision new staff accounts against */
      showToast('This is a demo — connect it to your staff authentication backend to go live.', 'success');
    });
  }
  wireAuthForm('login-form', [
    { id:'login-id', field:'field-login-id', check:function(v){ return v.trim().length > 0; } },
    { id:'login-pass', field:'field-login-pass', check:function(v){ return v.length > 0; } }
  ]);
  wireAuthForm('signup-form', [
    { id:'signup-name', field:'field-signup-name', check:function(v){ return v.trim().length > 0; } },
    { id:'signup-role', field:'field-signup-role', check:function(v){ return v.trim().length > 0; } },
    { id:'signup-email', field:'field-signup-email', check:function(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); } },
    { id:'signup-pass', field:'field-signup-pass', check:function(v){ return v.length >= 8; } }
  ]);

  var demoNote = document.createElement('p');
  demoNote.className = 'auth-note';
  demoNote.id = 'staff-demo-note';
  demoNote.innerHTML = 'Demo login — email: <strong>staff@autosetu.in</strong> · password: <strong>demo1234</strong>';
  var loginForm = document.getElementById('login-form');
  if(loginForm && loginForm.parentNode) loginForm.parentNode.insertBefore(demoNote, loginForm.nextSibling);

  var grid = document.getElementById('team-grid');
  TECHNICIANS.forEach(function(t){
    var card = document.createElement('div');
    card.className = 'team-card';
    card.tabIndex = 0;
    card.setAttribute('role','button');
    card.setAttribute('aria-label','View full profile for '+t.name);
    card.innerHTML = '<div class="team-avatar" aria-hidden="true">'+t.code+'</div><h3>'+t.name+'</h3><div class="team-role">'+t.role+'</div>'+
      '<div class="rating-line" style="justify-content:center;"><span class="rating-stars" aria-hidden="true">'+ratingStars(t.rating)+'</span><span>'+t.rating.toFixed(1)+' out of 5</span></div>'+
      '<p class="team-desc">'+TEAM_DESC[t.code]+'</p>';
    card.addEventListener('click', function(){ openProviderModal(t.code); });
    card.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openProviderModal(t.code); } });
    grid.appendChild(card);
  });

  var existingSession = getStaffSession();
  if(existingSession) showStaffDashboard(existingSession);
}

/* ---- staff dashboard: shown after a successful login, hides the login/signup panel ----
   FIX (layout bug): the HTML already ships a static <section id="staff-dashboard"> further
   down the page, after <section id="auth"> (which wraps .staff-tabs + .auth-panel). The old
   code only hid .staff-tabs/.auth-panel individually, but never hid the outer #auth section
   itself. That outer section still carries the site's default ".section{padding:76px 0}"
   rule, so even with its children hidden it kept rendering as an EMPTY 152px-tall block
   (76px top + 76px bottom padding, cream background) sitting between the page-hero and the
   dashboard — that's the big blank gap that was pushing the appointments table off-screen.
   Now we hide/restore the whole #auth section, not just its children. */
var staffAppointmentsBuilt = false;
function showStaffDashboard(account){
  var authSection = document.getElementById('auth');
  if(authSection) authSection.style.display = 'none';
  document.querySelectorAll('.staff-tabs, .auth-panel').forEach(function(el){ el.style.display = 'none'; });

  var host = document.getElementById('staff-dashboard');
  if(!host){
    /* fallback only — in practice the static #staff-dashboard section in the HTML
       always exists, so this branch shouldn't normally run */
    host = document.createElement('div');
    host.id = 'staff-dashboard';
    var authPanel = document.querySelector('.auth-panel');
    authPanel.parentNode.insertBefore(host, authPanel);
  }
  host.classList.remove('dash-hidden');
  host.style.display = 'block';

  renderStaffDashboard(account);
  staffAppointmentsBuilt = true;
}
function hideStaffDashboard(){
  setStaffSession(null);
  var host = document.getElementById('staff-dashboard');
  if(host) host.style.display = 'none';
  var authSection = document.getElementById('auth');
  if(authSection) authSection.style.display = '';
  document.querySelectorAll('.staff-tabs, .auth-panel').forEach(function(el){ el.style.display = ''; });
  var loginForm = document.getElementById('login-form');
  if(loginForm) loginForm.reset();
  showToast('Logged out', 'success');
}
var STAFF_STATUS_STATES = [
  { key:'Booked', label:'Booked' },
  { key:'Confirmed', label:'Confirmed' },
  { key:'In Progress', label:'In Progress' },
  { key:'Completed', label:'Completed' },
  { key:'Rescheduled', label:'Rescheduled' },
  { key:'Cancelled', label:'Cancelled' },
  { key:'No Show', label:'No Show' }
];

/* injects the compact status-select control styling once; safe to call repeatedly.
   FIX (layout bug): the previous version rendered all 7 statuses as individual
   flex buttons (.chit-btn) inside an un-constrained section (see the showStaffDashboard
   fix above). Even after fixing the width bug, seven always-visible pill buttons per row
   is still too wide for a data table column and wraps awkwardly. Replaced with a single
   compact <select> per row — same "tap to change status" behaviour, but it takes up a
   fixed, predictable width no matter how many statuses exist. */
function ensureChitStyles(){
  if(document.getElementById('chit-status-styles')) return;
  var style = document.createElement('style');
  style.id = 'chit-status-styles';
  style.textContent =
    '.status-select-wrap{position:relative;display:inline-block;min-width:132px;}'+
    '.status-select{width:100%;-webkit-appearance:none;appearance:none;cursor:pointer;'+
      'font-family:var(--ff-display, inherit);font-weight:700;font-size:0.78rem;'+
      'padding:8px 30px 8px 12px;border-radius:8px;border:1.5px solid var(--line,rgba(33,21,16,0.12));'+
      'background-color:#efece1;color:var(--ink-soft,#5c4a3c);'+
      'background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%235c4a3c\' stroke-width=\'2.4\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E");'+
      'background-repeat:no-repeat;background-position:right 8px center;background-size:14px;'+
      'transition:background-color .15s ease,color .15s ease,border-color .15s ease,box-shadow .15s ease;}'+
    '.status-select:hover{box-shadow:0 2px 6px rgba(20,20,10,.12);}'+
    '.status-select:focus-visible{outline:2px solid var(--gold,#d7a13a);outline-offset:2px;}'+
    '.status-select[data-state="Confirmed"]{background-color:var(--teal,#12796b);color:#eafff9;border-color:var(--teal-deep,#095048);}'+
    '.status-select[data-state="Confirmed"]{background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23eafff9\' stroke-width=\'2.4\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E");}'+
    '.status-select[data-state="Completed"]{background-color:var(--gold,#a97a1c);color:#fff7e6;border-color:var(--gold-deep,#7a5711);}'+
    '.status-select[data-state="Completed"]{background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23fff7e6\' stroke-width=\'2.4\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E");}'+
    '.status-select[data-state="Cancelled"]{background-color:#b1473c;color:#fff0ee;border-color:#7d2f27;}'+
    '.status-select[data-state="Cancelled"]{background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23fff0ee\' stroke-width=\'2.4\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E");}'+
    '.status-select[data-state="Rescheduled"]{background-color:#3d6fa0;color:#eaf3ff;border-color:#264a6c;}'+
    '.status-select[data-state="Rescheduled"]{background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23eaf3ff\' stroke-width=\'2.4\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E");}'+
    '.status-select[data-state="Booked"]{background-color:#8a7a4f;color:#fff9ea;border-color:#5f5334;}'+
    '.status-select[data-state="Booked"]{background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23fff9ea\' stroke-width=\'2.4\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E");}'+
    '.status-select[data-state="In Progress"]{background-color:#c07a2e;color:#fff6ec;border-color:#8a561e;}'+
    '.status-select[data-state="In Progress"]{background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23fff6ec\' stroke-width=\'2.4\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E");}'+
    '.status-select[data-state="No Show"]{background-color:#6b6f76;color:#f4f5f6;border-color:#494c51;}'+
    '.status-select[data-state="No Show"]{background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23f4f5f6\' stroke-width=\'2.4\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E");}'+
    '@media (max-width:760px){.status-select-wrap{min-width:112px;}.status-select{font-size:0.72rem;padding:7px 26px 7px 10px;}}';
  document.head.appendChild(style);
}

/* builds a compact status <select> that replaces the old row of 7 buttons */
function buildStatusChit(appt, onChange){
  var wrap = document.createElement('div');
  wrap.className = 'status-select-wrap';
  var select = document.createElement('select');
  select.className = 'status-select';
  select.dataset.state = appt.status;
  select.setAttribute('aria-label', 'Update status for '+appt.appointmentId);
  STAFF_STATUS_STATES.forEach(function(s){
    var opt = document.createElement('option');
    opt.value = s.key;
    opt.textContent = s.label;
    if(appt.status === s.key) opt.selected = true;
    select.appendChild(opt);
  });
  select.addEventListener('change', function(){
    var newStatus = select.value;
    select.dataset.state = newStatus;
    onChange(newStatus);
  });
  wrap.appendChild(select);
  return wrap;
}

/* persisted across re-renders so filters don't reset every time a status is updated */
var staffFilters = { query:'', status:'All', provider:'All', service:'All', date:'' };

/* injects colorful 3D styling for the staff status-summary cards AND the filter
   toolbar directly beneath them (the two blocks the user pointed out as "too plain"
   compared to the rest of the app). Safe to call repeatedly — bails if already injected. */
function ensureStaffSummaryStyles(){
  if(document.getElementById('staff-summary-styles')) return;
  var style = document.createElement('style');
  style.id = 'staff-summary-styles';
  style.textContent =
    /* ---- summary cards: gradient, inset sheen, depth shadow, hover lift + tilt ---- */
    '.staff-summary-row{display:flex;flex-wrap:wrap;gap:14px;margin:14px 0 20px;perspective:1200px;}'+
    '.staff-summary-card{position:relative;flex:1;min-width:108px;padding:16px 14px;border-radius:14px;text-align:center;color:#fff;'+
      'background:linear-gradient(145deg, var(--card-c1,#8a7a4f), var(--card-c2,#5f5334));'+
      'box-shadow:0 2px 0 rgba(255,255,255,.25) inset, 0 -3px 0 rgba(0,0,0,.18) inset,'+
        '0 10px 20px -8px rgba(20,20,10,.45), 0 4px 8px -2px rgba(20,20,10,.3);'+
      'transform:translateY(0) rotateX(0deg);transform-style:preserve-3d;'+
      'transition:transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s ease;'+
      'animation:staffCardPop .5s cubic-bezier(.22,1.2,.4,1) both;animation-delay:calc(var(--i,0) * 60ms);}'+
    '.staff-summary-card:hover{transform:translateY(-4px) rotateX(6deg);'+
      'box-shadow:0 2px 0 rgba(255,255,255,.3) inset, 0 -3px 0 rgba(0,0,0,.2) inset,'+
        '0 18px 30px -10px rgba(20,20,10,.5), 0 8px 14px -4px rgba(20,20,10,.35);}'+
    '@keyframes staffCardPop{0%{opacity:0;transform:translateY(14px) scale(.9) rotateX(-25deg);}100%{opacity:1;transform:translateY(0) scale(1) rotateX(0deg);}}'+
    '.staff-summary-icon{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;'+
      'background:rgba(255,255,255,.22);margin-bottom:6px;box-shadow:0 2px 4px rgba(0,0,0,.25) inset;}'+
    '.staff-summary-icon svg{width:16px;height:16px;stroke:#fff;}'+
    '.staff-summary-num{font-size:1.5rem;font-weight:800;text-shadow:0 2px 3px rgba(0,0,0,.3);}'+
    '.staff-summary-label{font-size:0.74rem;font-weight:600;margin-top:2px;opacity:.92;letter-spacing:.02em;text-transform:uppercase;}'+
    '.staff-summary-card[data-key="Total"]{--card-c1:#3d6fa0;--card-c2:#1f3f5e;}'+
    '.staff-summary-card[data-key="Booked"]{--card-c1:#8a7a4f;--card-c2:#5f5334;}'+
    '.staff-summary-card[data-key="Confirmed"]{--card-c1:#1aa48f;--card-c2:#095048;}'+
    '.staff-summary-card[data-key="In-Progress"]{--card-c1:#e0913f;--card-c2:#8a561e;}'+
    '.staff-summary-card[data-key="Completed"]{--card-c1:#d7a13a;--card-c2:#7a5711;}'+
    '.staff-summary-card[data-key="Rescheduled"]{--card-c1:#5b8fc4;--card-c2:#264a6c;}'+
    '.staff-summary-card[data-key="Cancelled"]{--card-c1:#d16558;--card-c2:#7d2f27;}'+
    '.staff-summary-card[data-key="No-Show"]{--card-c1:#8b909a;--card-c2:#494c51;}'+
    /* ---- filter toolbar: glassy raised panel, pill inputs, gradient button ---- */
    '.staff-appt-filters{display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin-bottom:16px;'+
      'padding:14px 16px;border-radius:16px;background:linear-gradient(160deg, rgba(255,255,255,.7), rgba(255,255,255,.35));'+
      'box-shadow:0 1px 0 rgba(255,255,255,.6) inset, 0 10px 24px -14px rgba(20,20,10,.35);}'+
    '[data-theme="dark"] .staff-appt-filters{background:linear-gradient(160deg, rgba(255,255,255,.08), rgba(255,255,255,.02));}'+
    '.staff-filter-input, .staff-filter-date{flex:2;min-width:170px;padding:10px 14px;border-radius:999px;'+
      'border:1.5px solid rgba(33,21,16,.12);background:#fff;font-size:0.85rem;'+
      'box-shadow:0 2px 4px rgba(20,20,10,.06) inset, 0 3px 6px -3px rgba(20,20,10,.15);'+
      'transition:box-shadow .2s ease, transform .15s ease;}'+
    '.staff-filter-date{flex:1;min-width:140px;}'+
    '.staff-filter-input:focus, .staff-filter-date:focus{outline:none;box-shadow:0 0 0 3px rgba(18,121,107,.25), 0 3px 6px -3px rgba(20,20,10,.2);transform:translateY(-1px);}'+
    '.staff-filter-select-wrap{position:relative;flex:1;min-width:150px;}'+
    '.staff-filter-select{width:100%;-webkit-appearance:none;appearance:none;cursor:pointer;padding:10px 30px 10px 14px;'+
      'border-radius:999px;border:1.5px solid rgba(33,21,16,.12);font-size:0.85rem;font-weight:600;'+
      'background-color:#fff;color:var(--ink-soft,#5c4a3c);'+
      'background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%235c4a3c\' stroke-width=\'2.4\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E");'+
      'background-repeat:no-repeat;background-position:right 10px center;background-size:14px;'+
      'box-shadow:0 2px 4px rgba(20,20,10,.06) inset, 0 3px 6px -3px rgba(20,20,10,.15);'+
      'transition:box-shadow .2s ease, transform .15s ease;}'+
    '.staff-filter-select:hover{box-shadow:0 2px 4px rgba(20,20,10,.08) inset, 0 6px 12px -4px rgba(20,20,10,.22);}'+
    '.staff-filter-select:focus{outline:none;box-shadow:0 0 0 3px rgba(18,121,107,.25);}'+
    '.staff-filter-clear-btn{padding:10px 20px;border-radius:999px;border:none;cursor:pointer;font-weight:700;font-size:0.85rem;color:#fff;'+
      'background:linear-gradient(145deg,#e0913f,#b1473c);'+
      'box-shadow:0 2px 0 rgba(255,255,255,.25) inset, 0 8px 16px -8px rgba(177,71,60,.6), 0 3px 6px -2px rgba(20,20,10,.3);'+
      'transition:transform .15s cubic-bezier(.34,1.56,.64,1), box-shadow .15s ease;}'+
    '.staff-filter-clear-btn:hover{transform:translateY(-2px);box-shadow:0 2px 0 rgba(255,255,255,.3) inset, 0 12px 20px -8px rgba(177,71,60,.7), 0 4px 8px -2px rgba(20,20,10,.35);}'+
    '.staff-filter-clear-btn:active{transform:translateY(1px);}'+
    '@media (prefers-reduced-motion: reduce){.staff-summary-card{animation:none !important;transition:none !important;}'+
      '.staff-summary-card:hover{transform:none !important;}'+
      '.staff-filter-input:focus, .staff-filter-date:focus{transform:none !important;}'+
      '.staff-filter-clear-btn:hover, .staff-filter-clear-btn:active{transform:none !important;}}'+
    '@media (max-width:760px){.staff-summary-card{min-width:88px;padding:12px 10px;}.staff-summary-num{font-size:1.2rem;}'+
      '.staff-appt-filters{padding:12px;}}';
  document.head.appendChild(style);
}

/* small round glyph shown above each summary number */
function staffSummaryIcon(key){
  var icons = {
    'Total':'<circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/>',
    'Booked':'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>',
    'Confirmed':'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    'In Progress':'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    'Completed':'<path d="M20 6 9 17l-5-5"/>',
    'Rescheduled':'<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>',
    'Cancelled':'<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
    'No Show':'<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>'
  };
  var d = icons[key] || icons['Total'];
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>';
}

/* spec §11: "overview of the day's appointments" broken down by status */
function buildStaffStatusSummary(all){
  ensureStaffSummaryStyles();
  var counts = { Total: all.length };
  STAFF_STATUS_STATES.forEach(function(s){ counts[s.key] = 0; });
  all.forEach(function(a){ if(counts.hasOwnProperty(a.status)) counts[a.status]++; });
  var cards = ['Total'].concat(STAFF_STATUS_STATES.map(function(s){ return s.key; }));
  return '<div class="staff-summary-row">'+
    cards.map(function(key, idx){
      return '<div class="staff-summary-card" data-key="'+key.replace(/\s+/g,'-')+'" style="--i:'+idx+';">'+
        '<span class="staff-summary-icon" aria-hidden="true">'+staffSummaryIcon(key)+'</span>'+
        '<div class="staff-summary-num">'+counts[key]+'</div>'+
        '<div class="staff-summary-label">'+key+'</div>'+
      '</div>';
    }).join('') +
  '</div>';
}

/* spec §12: staff should be able to open an appointment and view customer info,
   service info, provider, date/time, notes and current status. */
function openStaffAppointmentDetail(appointmentId){
  var all = AppointmentsStore.init();
  var a = all.find(function(x){ return x.appointmentId === appointmentId; });
  if(!a) return;
  var html =
    '<h3 style="color:var(--teal-deep);font-size:1.1rem;">Appointment #'+a.appointmentId+'</h3>'+
    '<div style="margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:10px 20px;">'+
      '<div><strong style="font-size:0.78rem;color:var(--ink-soft);">Customer</strong><div>'+a.customerName+'</div></div>'+
      '<div><strong style="font-size:0.78rem;color:var(--ink-soft);">Status</strong><div><span class="appt-status-badge appt-status-'+statusSlug(a.status)+'">'+a.status+'</span></div></div>'+
      '<div><strong style="font-size:0.78rem;color:var(--ink-soft);">Service</strong><div>'+a.service+'</div></div>'+
      '<div><strong style="font-size:0.78rem;color:var(--ink-soft);">Technician</strong><div>'+(a.provider||'Unassigned')+'</div></div>'+
      '<div><strong style="font-size:0.78rem;color:var(--ink-soft);">Date &amp; time</strong><div>'+formatApptDate(a.date)+' · '+formatApptTime(a.time)+'</div></div>'+
      '<div><strong style="font-size:0.78rem;color:var(--ink-soft);">Duration</strong><div>'+(a.duration ? '~'+a.duration+' min' : '—')+'</div></div>'+
      (a.email ? '<div><strong style="font-size:0.78rem;color:var(--ink-soft);">Email</strong><div>'+a.email+'</div></div>' : '')+
      (a.phone ? '<div><strong style="font-size:0.78rem;color:var(--ink-soft);">Phone</strong><div>'+a.phone+'</div></div>' : '')+
      (a.vehicle ? '<div><strong style="font-size:0.78rem;color:var(--ink-soft);">Vehicle</strong><div>'+a.vehicle+'</div></div>' : '')+
    '</div>'+
    '<div style="margin-top:14px;"><strong style="font-size:0.78rem;color:var(--ink-soft);">Notes</strong>'+
      '<p style="margin-top:4px;">'+(a.notes ? a.notes : 'No additional notes for this appointment.')+'</p></div>';
  openModal(html, false);
}

function renderStaffDashboard(account){
  var host = document.getElementById('staff-dashboard');
  if(!host) return;
  ensureChitStyles();
  var all = AppointmentsStore.init();

  var providerNames = TECHNICIANS.map(function(t){ return t.name; });
  var serviceNames = SERVICES.map(function(s){ return s.name; });

  var visible = all.filter(function(a){
    var q = staffFilters.query.trim().toLowerCase();
    var matchesQuery = !q || (a.customerName+' '+a.appointmentId+' '+a.service+' '+(a.provider||'')).toLowerCase().indexOf(q) > -1;
    var matchesStatus = staffFilters.status === 'All' || a.status === staffFilters.status;
    var matchesProvider = staffFilters.provider === 'All' || a.provider === staffFilters.provider;
    var matchesService = staffFilters.service === 'All' || a.service === staffFilters.service;
    var matchesDate = !staffFilters.date || a.date === staffFilters.date;
    return matchesQuery && matchesStatus && matchesProvider && matchesService && matchesDate;
  });
  visible.sort(function(a,b){ return (a.date+'T'+(a.time||'00:00')).localeCompare(b.date+'T'+(b.time||'00:00')); });

  function opt(value, label, selected){
    return '<option value="'+value+'"'+(selected?' selected':'')+'>'+label+'</option>';
  }

  var rows = visible.map(function(a){
    return '<tr data-row-id="'+a.appointmentId+'">'+
      '<td class="staff-appt-id"><button type="button" class="staff-appt-view-btn" data-id="'+a.appointmentId+'" style="background:none;border:none;padding:0;color:var(--teal-deep,#095048);font-weight:700;text-decoration:underline;cursor:pointer;">#'+a.appointmentId+'</button></td>'+
      '<td>'+a.customerName+'</td>'+
      '<td>'+a.service+'</td>'+
      '<td>'+(a.provider||'Unassigned')+'</td>'+
      '<td>'+formatApptDate(a.date)+' · '+formatApptTime(a.time)+'</td>'+
      '<td><span class="appt-status-badge appt-status-'+statusSlug(a.status)+'">'+a.status+'</span></td>'+
      '<td class="staff-appt-update-cell"></td>'+
    '</tr>';
  }).join('');

  host.innerHTML =
    '<div class="wrap">'+
    '<div class="staff-appt-toolbar" style="justify-content:space-between;">'+
      '<div><strong>Signed in as '+account.name+'</strong><div style="font-size:0.8rem;color:var(--ink-soft);margin-top:2px;">'+account.role+'</div></div>'+
      '<button type="button" class="btn btn-ghost btn-sm" id="staff-logout-btn">Log out</button>'+
    '</div>'+
    buildStaffStatusSummary(all)+
    '<div class="staff-appt-filters">'+
      '<input type="search" id="staff-search" class="staff-filter-input" placeholder="Search customer, chit #, service…" value="'+staffFilters.query.replace(/"/g,'&quot;')+'" aria-label="Search appointments">'+
      '<div class="staff-filter-select-wrap"><select id="staff-filter-status" class="staff-filter-select" aria-label="Filter by status">'+opt('All','All statuses', staffFilters.status==='All')+STAFF_STATUS_STATES.map(function(s){ return opt(s.key, s.label, staffFilters.status===s.key); }).join('')+'</select></div>'+
      '<div class="staff-filter-select-wrap"><select id="staff-filter-provider" class="staff-filter-select" aria-label="Filter by technician">'+opt('All','All technicians', staffFilters.provider==='All')+providerNames.map(function(n){ return opt(n, n, staffFilters.provider===n); }).join('')+'</select></div>'+
      '<div class="staff-filter-select-wrap"><select id="staff-filter-service" class="staff-filter-select" aria-label="Filter by service">'+opt('All','All services', staffFilters.service==='All')+serviceNames.map(function(n){ return opt(n, n, staffFilters.service===n); }).join('')+'</select></div>'+
      '<input type="date" id="staff-filter-date" class="staff-filter-date" aria-label="Filter by date" value="'+staffFilters.date+'">'+
      '<button type="button" class="btn btn-ghost btn-sm staff-filter-clear-btn" id="staff-filter-clear">Clear filters</button>'+
    '</div>'+
    '<p class="staff-appt-count">'+visible.length+' of '+all.length+' appointment'+(all.length===1?'':'s')+'</p>'+
    '<div class="staff-appt-table-wrap">'+
      '<table class="staff-appt-table">'+
        '<thead><tr><th>ID</th><th>Customer</th><th>Service</th><th>Technician</th><th>When</th><th>Status</th><th>Update</th></tr></thead>'+
        '<tbody>'+(rows || '<tr class="staff-appt-empty-row"><td colspan="7">No appointments match this search yet.</td></tr>')+'</tbody>'+
      '</table>'+
    '</div>'+
    '</div>';

  document.getElementById('staff-logout-btn').addEventListener('click', hideStaffDashboard);

  document.getElementById('staff-search').addEventListener('input', function(){ staffFilters.query = this.value; renderStaffDashboard(account); });
  document.getElementById('staff-filter-status').addEventListener('change', function(){ staffFilters.status = this.value; renderStaffDashboard(account); });
  document.getElementById('staff-filter-provider').addEventListener('change', function(){ staffFilters.provider = this.value; renderStaffDashboard(account); });
  document.getElementById('staff-filter-service').addEventListener('change', function(){ staffFilters.service = this.value; renderStaffDashboard(account); });
  document.getElementById('staff-filter-date').addEventListener('change', function(){ staffFilters.date = this.value; renderStaffDashboard(account); });
  document.getElementById('staff-filter-clear').addEventListener('click', function(){
    staffFilters = { query:'', status:'All', provider:'All', service:'All', date:'' };
    renderStaffDashboard(account);
  });

  host.querySelectorAll('.staff-appt-view-btn').forEach(function(btn){
    btn.addEventListener('click', function(){ openStaffAppointmentDetail(btn.dataset.id); });
  });

  visible.forEach(function(a){
    var cell = host.querySelector('tr[data-row-id="'+a.appointmentId+'"] .staff-appt-update-cell');
    if(!cell) return;
    cell.appendChild(buildStatusChit(a, function(newStatus){
      AppointmentsStore.updateStatus(a.appointmentId, newStatus);
      appointmentsBuilt = false; /* keep "My appointments" view in sync too */
      var badge = host.querySelector('tr[data-row-id="'+a.appointmentId+'"] .appt-status-badge');
      if(badge){
        badge.className = 'appt-status-badge appt-status-'+statusSlug(newStatus);
        badge.textContent = newStatus;
      }
      showToast(a.appointmentId+' marked '+newStatus.toLowerCase(), 'success');
    }));
  });
}


/* ---- single-file router: switches between home / services / appointments / staff "pages" ---- */
var VIEW_TITLES = {
  home: "AutoSetu — Gaadi Ki Seva, Poori Shraddha Se",
  services: "Book a Service — AutoSetu",
  appointments: "My Appointments — AutoSetu",
  staff: "Staff Portal — AutoSetu"
};
function showView(name, anchor, skipHistory){
  document.querySelectorAll('.page-view').forEach(function(v){ v.classList.remove('is-active'); });
  var target = document.getElementById('view-'+name);
  if(!target) { name = 'home'; target = document.getElementById('view-home'); }
  target.classList.add('is-active');
  document.title = VIEW_TITLES[name] || VIEW_TITLES.home;

  document.querySelectorAll('.site-nav-links a[data-view]').forEach(function(a){
    a.classList.toggle('is-current', a.dataset.view === name);
  });

  if(name === 'services') buildServicesView();
  if(name === 'staff') buildStaffView();
  if(name === 'appointments'){ appointmentsBuilt = false; buildAppointmentsView(); }

  if(anchor){
    requestAnimationFrame(function(){
      var el = document.getElementById(anchor);
      if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    });
  } else {
    window.scrollTo(0,0);
  }

  if(!skipHistory){
    history.pushState({view:name}, '', name==='home' ? '#/' : '#/'+name);
  }
  var links = document.getElementById('site-nav-links');
  if(links) links.classList.remove('is-open');
}

/* All internal navigation stays inside this same page/tab — no new windows. */
document.addEventListener('click', function(e){
  var link = e.target.closest('[data-view]');
  if(!link) return;
  e.preventDefault();
  var view = link.dataset.view;
  var anchor = link.dataset.anchor;
  showView(view, anchor);
});

/* Browser Back/Forward buttons move between the app's own "pages" too */
window.addEventListener('popstate', function(e){
  var name = (e.state && e.state.view) || (window.location.hash.replace('#/', '').replace('#','')) || 'home';
  showView(name === '' ? 'home' : name, null, true);
});

document.getElementById('nav-toggle').addEventListener('click', function(){
  var links = document.getElementById('site-nav-links');
  var open = links.classList.toggle('is-open');
  this.setAttribute('aria-expanded', open ? 'true':'false');
});

/* initial favorites / recent render */
renderFavCount();
renderFavDrawer();

/* On load, honour the URL hash so a refreshed/shared link lands on the right page */
(function(){
  var hash = window.location.hash.replace('#/', '').replace('#','');
  showView(hash === '' ? 'home' : hash, null, true);
})();
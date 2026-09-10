(function () {
  'use strict';

  const CITY_ORDER = Object.freeze(['Almaty','Astana','Shymkent']);
  const FACET_ORDER = Object.freeze({
    city:CITY_ORDER,
    category:Object.freeze(['Hybrid','Interior design','Kitchen','Bathroom']),
    priority:Object.freeze(['High','Medium','Low'])
  });
  const DASHBOARD_DATE_ISO = '2026-09-03';
  const emptyFilters = () => ({ city:'', category:'', showroom:'', priority:'', search:'' });
  const escapeHTML = (value) => String(value).replace(/[&<>'"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  function selectedFacetValues(key, filtersOrValue) {
    const raw = filtersOrValue && !Array.isArray(filtersOrValue) && typeof filtersOrValue === 'object' ? filtersOrValue[key] : filtersOrValue;
    const values = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const selected = new Set(values);
    return (FACET_ORDER[key] || []).filter((value)=>selected.has(value));
  }
  function selectedCities(filtersOrValue) {
    return selectedFacetValues('city',filtersOrValue);
  }
  function mapCities(filters) {
    const selected = selectedCities(filters);
    return selected.length ? selected : [...CITY_ORDER];
  }
  function toggleFacetSelection(key, current, value) {
    const selected = new Set(selectedFacetValues(key,current));
    if (selected.has(value)) selected.delete(value); else selected.add(value);
    return (FACET_ORDER[key] || []).filter((name)=>selected.has(name));
  }
  function toggleCitySelection(current, city) {
    return toggleFacetSelection('city',current,city);
  }
  function hasCompetitiveEvidence(row) {
    const isMeaningful = (value) => {
      const text = String(value || '').trim().toLowerCase();
      return !!text && !text.includes('not evidenced in current research') && !text.includes('no competing or comparable brand relationship is evidenced');
    };
    return !!row && (isMeaningful(row.brands) || isMeaningful(row.evidence));
  }
  function competitiveBlockHTML(row) {
    if (!hasCompetitiveEvidence(row)) return '';
    return `<section class="dossier-block competitive-evidence"><p>Competitive signal</p><h3>${escapeHTML(row.brands)}</h3><span>${escapeHTML(row.evidence)}</span></section>`;
  }
  const scoreValue = { High:3, 'Medium-High':2, Medium:1 };
  function derive(source, filters, sort) {
    const q = (filters.search || '').trim().toLowerCase();
    const cities = selectedCities(filters);
    const categories = selectedFacetValues('category',filters);
    const priorities = selectedFacetValues('priority',filters);
    const rows = source.filter((row) => {
      if (cities.length && !cities.includes(row.city)) return false;
      if (categories.length && !categories.includes(row.category)) return false;
      if (filters.showroom && row.showroom !== filters.showroom) return false;
      if (priorities.length && !priorities.includes(row.priority)) return false;
      if (q && ![row.name,row.city,row.category,row.phone,row.email,row.address,row.website,row.brands,row.evidence].join(' ').toLowerCase().includes(q)) return false;
      return true;
    });
    const key = sort.key || 'score', direction = sort.dir === 'asc' ? 1 : -1;
    return rows.slice().sort((a,b) => {
      let av = a[key], bv = b[key];
      if (key === 'price') { av = scoreValue[av]; bv = scoreValue[bv]; }
      if (typeof av === 'string') { av = av.toLowerCase(); bv = String(bv).toLowerCase(); }
      if (av < bv) return -direction;
      if (av > bv) return direction;
      return a.name.localeCompare(b.name);
    });
  }
  function metrics(rows) {
    return { total:rows.length, high:rows.filter(r=>r.priority==='High').length, showroom:rows.filter(r=>r.showroom==='Yes').length, cities:new Set(rows.map(r=>r.city)).size };
  }
  function executiveSummary(rows, filters) {
    const selected = selectedCities(filters);
    const current = metrics(rows);
    return {
      cities:selected.length ? selected.join(' + ') : 'All cities',
      prospects:current.total,
      high:current.high,
      showroom:current.showroom
    };
  }
  const CSV_FIELDS = [
    ['Account','name'],['City','city'],['Profile','category'],['Priority','priority'],['Potential index','score'],
    ['Showroom','showroom'],['Price position','price'],['Service breadth','serviceBreadth'],['Address','address'],
    ['Phone','phone'],['Email','email'],['Website','website'],['Competitive brands','brands'],
    ['Competitive evidence','evidence'],['Recommended action','recommendedAction'],['Evidence source','source']
  ];
  const csvCell = (value) => `"${String(value ?? '').replace(/"/g,'""')}"`;
  function prospectsCSV(rows) {
    const header = CSV_FIELDS.map(([label])=>csvCell(label)).join(',');
    const body = rows.map((row)=>CSV_FIELDS.map(([,key])=>csvCell(row[key])).join(','));
    return `\ufeff${[header,...body].join('\r\n')}`;
  }
  function exportFilename(filters) {
    const scope = selectedCities(filters).map((city)=>city.toLowerCase()).join('-') || 'all-cities';
    return `kazakhstan-partner-intelligence-${scope}-${DASHBOARD_DATE_ISO}.csv`;
  }
  function queue(rows, limit=6) { return rows.slice().sort((a,b)=>b.score-a.score || a.name.localeCompare(b.name)).slice(0,limit); }
  function filtersForKpi(action, current) {
    if (action === 'all') return emptyFilters();
    if (action === 'high') return { ...current, priority:'High' };
    if (action === 'showroom') return { ...current, showroom:'Yes' };
    return { ...current };
  }
  function layoutPoints(rows, laneKey='') {
    const points = [];
    const ordered = rows.slice().sort((a,b)=>b.score-a.score || a.id.localeCompare(b.id));
    const xCandidates = Array.from({length:43},(_,index)=>8 + index*2);
    const yOffsets = [0,-4,4,-8,8,-12,12,-16,16];
    const seed = [...String(laneKey)].reduce((sum,char)=>sum+char.charCodeAt(0),0);
    ordered.forEach((row,index)=>{
       const price = { Low: .18, Medium: .46, 'Medium-High': .68, High: .86 }[row.price] ?? .46;
       const preferred = Math.round(Math.max(8,Math.min(92,(price + (row.showroom === 'Yes' ? .12 : .03))*100)));
      let best = null;
      for (const offset of yOffsets) for (const x of xCandidates) {
        const y = Math.max(4,Math.min(96,row.score + offset));
        const minDistance = points.length ? Math.min(...points.map((point)=>Math.hypot((x-point.x)*2.4,(y-point.y)*4.55))) : 1000;
        const quality = minDistance - Math.abs(offset)*0.55 - Math.abs(x-preferred)*0.025;
        if (!best || quality > best.quality) best = { id:row.id, score:row.score, x, y, quality };
      }
      points.push(best);
    });
    return points.map(({quality,...point})=>point);
  }
  window.KZCore = Object.freeze({ emptyFilters, selectedFacetValues, selectedCities, mapCities, toggleFacetSelection, toggleCitySelection, hasCompetitiveEvidence, competitiveBlockHTML, derive, metrics, executiveSummary, prospectsCSV, exportFilename, queue, layoutPoints, filtersForKpi });

  window.bootKZApp = function bootKZApp(options) {
    const source = window.KZ_PROSPECTS;
    const $ = (selector, root=document) => root.querySelector(selector);
    const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
    const state = { filters:emptyFilters(), sort:{key:'score',dir:'desc'}, selectedId:null, route:'landing' };
    const pages = $$('.page');
    const esc = escapeHTML;
    const categoryClass = (v) => 'cat-' + v.toLowerCase().replace(/\s+/g,'-');
    function syncFilterButtons() {
      $$('[data-filter-button]').forEach((button)=>{
        const key = button.dataset.filterButton;
        const active = FACET_ORDER[key] ? selectedFacetValues(key,state.filters).includes(button.dataset.value) : state.filters[key] === button.dataset.value;
        button.setAttribute('aria-pressed',String(active));
      });
    }

    const ownershipMarkup = '<p class="top-ownership">Market research &amp; dashboard created by <strong>Francisco González</strong></p>';
    $$('.wordmark .brand-mark, .brand-button span').forEach((node)=>{ node.innerHTML='<img src="assets/cosentino-corporate-reference.png" alt="Cosentino">'; node.classList.add('logo-asset'); });
    $$('[data-page="projects"] .construction p').forEach((node)=>{ node.textContent='Projects research is available on request. Ask Francisco if you need a research.'; });
    $$('[data-page="landing"] .project-choice i').forEach((node)=>{ node.textContent='Ask Francisco if you need a research →'; });
    $$('#view-positioning .section-head').forEach((node)=>{ if(node.querySelector('.map-axis-copy')) return; const copy=document.createElement('span'); copy.className='map-axis-copy'; copy.innerHTML='<b>Y · Processing, purchasing &amp; operational readiness · Potential index / priority (0–100)</b><b>X · Commercial reach &amp; showroom network</b><small>Price positioning and service breadth inform the horizontal position · Shape = commercial profile · Colour = rating · Double ring = confirmed showroom · Select a point for the complete dossier</small>'; node.appendChild(copy); });
    const mapStyle=document.createElement('style'); mapStyle.textContent='.map-axis-copy{display:flex;flex-direction:column;gap:4px;max-width:430px;text-align:right;color:var(--muted);font-size:10px;line-height:1.35}.map-axis-copy b{color:var(--ink);font-weight:600}.map-axis-copy small{font-size:9px;color:var(--muted)}.logo-asset{overflow:hidden}.logo-asset img{width:100%;height:100%;display:block;object-fit:cover}'; document.head.appendChild(mapStyle);
    $$('.landing-nav .wordmark, .topbar .brand-button').forEach((brand)=>{
      if (!brand.nextElementSibling?.classList.contains('top-ownership')) brand.insertAdjacentHTML('afterend',ownershipMarkup);
    });
    const projectHeader = $('[data-page="projects"] .project-grid > header');
    if (projectHeader && !projectHeader.querySelector('.wordmark')) {
       projectHeader.insertAdjacentHTML('afterbegin',`<div class="project-identity"><a href="https://www.cosentino.com/" target="_blank" rel="noopener" class="wordmark"><span class="brand-mark logo-asset"><img src="assets/cosentino-corporate-reference.png" alt="Cosentino"></span><b>COSENTINO</b></a>${ownershipMarkup}</div>`);
    }
    $$('.ownership, .market-title small, .landing footer span:last-child').forEach((legacy)=>legacy.hidden=true);
    const kpiActions = ['all','high','showroom','coverage'];
    const kpiLabels = ['Open complete account list','Review priority accounts','Review display-ready partners','Compare city coverage'];
    $$('.metrics article').forEach((card,index)=>{
      card.dataset.kpiAction=kpiActions[index];
      card.tabIndex=0;
      card.setAttribute('role','button');
      card.setAttribute('aria-label',`${card.innerText.trim()}. Open related intelligence.`);
      card.insertAdjacentHTML('beforeend',`<div class="kpi-footer"><span>${kpiLabels[index]} <b>↗</b></span><i aria-hidden="true"><b></b></i></div>`);
    });
    const viewDescriptions = {
      positioning:'Opportunity field',
      accounts:'All filtered prospects',
      shortlist:'First conversations',
      coverage:'City and profile reach',
      competitive:'Market signals'
    };
    $$('[data-view]').forEach((button,index)=>{
      const label=button.textContent.trim();
      button.innerHTML=`<span class="view-index">${String(index+1).padStart(2,'0')}</span><span class="view-copy"><b>${label}</b><small class="view-description">${viewDescriptions[button.dataset.view]}</small></span><span class="view-arrow" aria-hidden="true">↗</span>`;
    });
    const executiveContextMarkup = `<section class="executive-context" data-executive-context aria-label="Current filtered opportunity summary" aria-live="polite"><header><p>Current opportunity view</p><strong data-context-cities>All cities</strong></header><div class="context-metric"><strong data-context-prospects>70</strong><span>Prospects</span></div><div class="context-metric"><strong data-context-high>34</strong><span>High priority</span></div><div class="context-metric"><strong data-context-showroom>34</strong><span>Showrooms</span></div><footer aria-label="Dashboard updated · 3 September 2026"><span><b>Dashboard updated</b> · 3 September 2026 <i>Evidence status and recommended actions are retained in each dossier.</i></span><button type="button" data-export-csv>Export filtered CSV <b aria-hidden="true">↓</b></button></footer></section><p class="map-guidance"><span aria-hidden="true">↗</span><b>Explore an account.</b> Select any point to open the complete account dossier.</p>`;
    $$('.decision').forEach((panel)=>{
      const heading = $('.section-head',panel);
      if (heading && !panel.querySelector('[data-executive-context]')) heading.insertAdjacentHTML('afterend',executiveContextMarkup);
    });

    function activateKpi(action) {
      if (action === 'coverage') {
        $$('[data-view]').forEach((tab)=>tab.classList.toggle('active',tab.dataset.view==='coverage'));
        $('#view-coverage')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
        return;
      }
      state.filters=filtersForKpi(action,state.filters);
      if (action === 'all') $$('[data-filter]').forEach((input)=>input.value='');
      syncFilterButtons();
      state.selectedId=null;
      render();
      $$('[data-view]').forEach((tab)=>tab.classList.toggle('active',tab.dataset.view==='accounts'));
      $('#view-accounts')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
    }

    function route(name) {
      state.route = name;
      pages.forEach(p=>p.classList.toggle('active', p.dataset.page===name));
      document.body.dataset.currentRoute = name;
      if (name==='retail') render();
      const target = $(`[data-page="${name}"] h1, [data-page="${name}"] h2`);
      if (target) { target.tabIndex=-1; target.focus({preventScroll:true}); }
    }
    function mapHTML(rows) {
      const positions=new Map(layoutPoints(rows,'opportunity-field').map(point=>[point.id,point]));
      const dots=rows.map((r)=>{
        const point=positions.get(r.id);
        return `<button class="map-dot ${categoryClass(r.category)} priority-${r.priority.toLowerCase()} ${r.showroom==='Yes'?'has-showroom':''} ${state.selectedId===r.id?'selected':''}" style="--x:${point.x}%;--y:${point.y}%" data-select="${r.id}" aria-label="${esc(r.name)}, ${r.score} potential, ${r.priority} rating${r.showroom==='Yes'?', confirmed showroom':''}" title="${esc(r.name)} · ${r.score}/100 · ${r.priority} rating · ${r.showroom==='Yes'?'Showroom confirmed':'Showroom not confirmed'}"><span>${r.score}</span></button>`;
      }).join('');
      return `<div class="map-field"><div class="map-zone zone-develop">DEVELOP — GROW WITH THEM</div><div class="map-zone zone-priority">PRIORITY — ACT NOW</div><div class="map-zone zone-monitor">MONITOR — LOWER EVIDENCE</div><div class="map-zone zone-qualify">QUALIFY — VERIFY</div><span class="map-axis-y-title">PROCESSING, PURCHASING &amp; OPERATIONAL READINESS</span><span class="map-axis-y-tick tick-top">100</span><span class="map-axis-y-tick tick-bottom">0</span><span class="map-axis-x-title">COMMERCIAL REACH &amp; SHOWROOM NETWORK →</span><span class="map-axis-x-end x-left">Limited reach</span><span class="map-axis-x-end x-right">Broad reach</span>${dots}</div>`;
    }
    function queueHTML(rows) {
      return queue(rows,6).map((r,i)=>`<button class="target ${state.selectedId===r.id?'selected':''}" data-select="${r.id}"><span class="target-rank">${String(i+1).padStart(2,'0')}</span><span><b>${esc(r.name)}</b><small>${r.city} · ${r.category}</small></span><strong>${r.score}</strong></button>`).join('') || '<p class="empty">No prospects match these filters.</p>';
    }
    function tableHTML(rows) {
      return rows.map(r=>`<tr class="${state.selectedId===r.id?'selected':''}" data-select="${r.id}" tabindex="0"><td><b>${esc(r.name)}</b><small>${esc(r.email||r.phone||'Contact not listed')}</small></td><td>${r.city}</td><td><span class="category ${categoryClass(r.category)}">${r.category}</span></td><td>${r.showroom}</td><td>${r.price}</td><td><span class="priority p-${r.priority.toLowerCase()}">${r.priority}</span></td><td class="score">${r.score}</td></tr>`).join('') || '<tr><td colspan="7" class="empty">No prospects match these filters.</td></tr>';
    }
    function detailHTML(r) {
      if (!r) return '';
      const contact=[r.phone&&`<a href="tel:${r.phone.split('/')[0].replace(/[^\d+]/g,'')}">${esc(r.phone)}</a>`,r.email&&`<a href="mailto:${esc(r.email)}">${esc(r.email)}</a>`].filter(Boolean).join('');
      const web=r.website?`<a href="${esc(r.website)}" target="_blank" rel="noopener">Visit account website ↗</a>`:'';
      const sourceLink=r.source?`<a href="${esc(r.source)}" target="_blank">Open captured research ↗</a>`:'<span>Source not linked</span>';
      return `<button class="detail-close" data-close-detail aria-label="Close prospect detail">×</button><p class="detail-kicker">Prospect dossier · ${r.city}</p><h2 tabindex="-1">${esc(r.name)}</h2><div class="detail-score"><strong>${r.score}</strong><span>potential<br>index</span></div><p class="reason">${esc(r.reason)}.</p><dl><div><dt>Profile</dt><dd>${r.category}</dd></div><div><dt>Physical exposure</dt><dd>${r.showroom}</dd></div><div><dt>Price position</dt><dd>${r.price}</dd></div><div><dt>Service breadth</dt><dd>${r.serviceBreadth}</dd></div><div><dt>Address</dt><dd>${esc(r.address)}</dd></div></dl>${competitiveBlockHTML(r)}<section class="dossier-block next-action"><p>Recommended next action</p><h3>${esc(r.recommendedAction)}</h3><span>Commercial recommendation · validate with the local team.</span></section><div class="contacts">${contact||'<span>Contact not listed</span>'}${web}</div><div class="research-source"><p>Evidence source</p>${sourceLink}</div><p class="method-note">Working-priority hypothesis based on category fit, physical exposure and price positioning. Competitive statements are shown only where supported by captured research.</p>`;
    }
    function downloadCurrentView(rows) {
      const blob = new Blob([prospectsCSV(rows)],{type:'text/csv;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href=url;
      link.download=exportFilename(state.filters);
      link.hidden=true;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),0);
    }
    function render() {
      const rows=derive(source,state.filters,state.sort), m=metrics(rows);
      const values={total:m.total,high:m.high,showroom:m.showroom,cities:m.cities};
      Object.entries(values).forEach(([key,value])=>$$(`[data-metric="${key}"]`).forEach(el=>el.textContent=value));
      const summary = executiveSummary(rows,state.filters);
      $$('[data-context-cities]').forEach((el)=>el.textContent=summary.cities);
      $$('[data-context-prospects]').forEach((el)=>el.textContent=summary.prospects);
      $$('[data-context-high]').forEach((el)=>el.textContent=summary.high);
      $$('[data-context-showroom]').forEach((el)=>el.textContent=summary.showroom);
      $$('[data-export-csv]').forEach((button)=>{
        button.disabled=rows.length===0;
        button.setAttribute('aria-label',`Export ${rows.length} filtered prospects as CSV`);
      });
      const denominators={total:source.length,high:Math.max(1,m.total),showroom:Math.max(1,m.total),cities:3};
      Object.entries(values).forEach(([key,value])=>$$(`[data-metric="${key}"]`).forEach((el)=>{const fill=el.closest('article')?.querySelector('.kpi-footer i b');if(fill)fill.style.width=`${Math.min(100,Math.round(value/denominators[key]*100))}%`;}));
      $$('[data-result-count]').forEach(el=>el.textContent=`${rows.length} of ${source.length} prospects`);
      const cities = mapCities(state.filters);
      $$('[data-map]').forEach((el)=>{
        el.style.setProperty('--city-count',cities.length);
        el.dataset.cityCount=String(cities.length);
        el.innerHTML=mapHTML(rows);
      });
      $$('[data-queue]').forEach(el=>el.innerHTML=queueHTML(rows));
      $$('[data-table-body]').forEach(el=>el.innerHTML=tableHTML(rows));
      const selected=source.find(r=>r.id===state.selectedId);
      $$('[data-detail]').forEach(el=>{el.innerHTML=detailHTML(selected);el.classList.toggle('open',!!selected);el.setAttribute('aria-hidden',String(!selected));});
      document.body.classList.toggle('detail-open',!!selected);
      $$('[data-sort]').forEach(el=>el.setAttribute('aria-sort',state.sort.key===el.dataset.sort?(state.sort.dir==='asc'?'ascending':'descending'):'none'));
    }
    document.addEventListener('click',(event)=>{
      const exportButton=event.target.closest('[data-export-csv]'); if(exportButton){downloadCurrentView(derive(source,state.filters,state.sort));return;}
      const kpi=event.target.closest('[data-kpi-action]'); if(kpi){activateKpi(kpi.dataset.kpiAction);return;}
      const nav=event.target.closest('[data-route]'); if(nav){route(nav.dataset.route);return;}
      const choice=event.target.closest('[data-select]'); if(choice){state.selectedId=choice.dataset.select;render();setTimeout(()=>{$('[data-detail].open h2')?.focus()},20);return;}
      if(event.target.closest('[data-close-detail]')){state.selectedId=null;render();return;}
      const reset=event.target.closest('[data-reset]'); if(reset){state.filters=emptyFilters();$$('[data-filter]').forEach(el=>el.value='');syncFilterButtons();render();return;}
      const filterButton=event.target.closest('[data-filter-button]'); if(filterButton){const key=filterButton.dataset.filterButton;const value=filterButton.dataset.value;if(FACET_ORDER[key]){state.filters[key]=toggleFacetSelection(key,state.filters[key],value);}else{state.filters[key]=state.filters[key]===value?'':value;}syncFilterButtons();state.selectedId=null;render();return;}
      const view=event.target.closest('[data-view]'); if(view){$$('[data-view]').forEach(el=>el.classList.toggle('active',el===view));const target=$(`#view-${view.dataset.view}`);if(target){target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});target.tabIndex=-1;target.focus({preventScroll:true});}return;}
      const sort=event.target.closest('[data-sort]'); if(sort){const key=sort.dataset.sort;state.sort={key,dir:state.sort.key===key&&state.sort.dir==='desc'?'asc':'desc'};render();return;}
      const theme=event.target.closest('[data-theme-toggle]'); if(theme){const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;try{localStorage.setItem('kz-theme',next)}catch(e){};return;}
      const filters=event.target.closest('[data-filter-toggle]'); if(filters){document.body.classList.toggle('filters-open');filters.setAttribute('aria-expanded',String(document.body.classList.contains('filters-open')));}
    });
    document.addEventListener('change',(event)=>{if(event.target.matches('[data-filter]')){state.filters[event.target.dataset.filter]=event.target.value;state.selectedId=null;render();}});
    document.addEventListener('input',(event)=>{if(event.target.matches('[data-filter="search"]')){state.filters.search=event.target.value;state.selectedId=null;render();}});
    document.addEventListener('keydown',(event)=>{if(event.key==='Escape'&&state.selectedId){state.selectedId=null;render();}const kpi=event.target.closest('[data-kpi-action]');if(kpi&&(event.key==='Enter'||event.key===' ')){event.preventDefault();kpi.click();return;}const row=event.target.closest('tr[data-select]');if(row&&(event.key==='Enter'||event.key===' ')){event.preventDefault();state.selectedId=row.dataset.select;render();}});
    try{document.documentElement.dataset.theme=localStorage.getItem('kz-theme')||options.defaultTheme||'light'}catch(e){document.documentElement.dataset.theme=options.defaultTheme||'light'}
    route('landing');
    window.KZ_APP={state,render,route};
  };
}());

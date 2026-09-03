(function () {
  'use strict';

  const CITY_ORDER = Object.freeze(['Almaty','Astana','Shymkent']);
  const emptyFilters = () => ({ city:'', category:'', showroom:'', priority:'', search:'' });
  const escapeHTML = (value) => String(value).replace(/[&<>'"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  function selectedCities(filtersOrValue) {
    const raw = filtersOrValue && !Array.isArray(filtersOrValue) && typeof filtersOrValue === 'object' ? filtersOrValue.city : filtersOrValue;
    const values = Array.isArray(raw) ? raw : raw ? [raw] : [];
    const selected = new Set(values);
    return CITY_ORDER.filter((city)=>selected.has(city));
  }
  function mapCities(filters) {
    const selected = selectedCities(filters);
    return selected.length ? selected : [...CITY_ORDER];
  }
  function toggleCitySelection(current, city) {
    const selected = new Set(selectedCities(current));
    if (selected.has(city)) selected.delete(city); else selected.add(city);
    return CITY_ORDER.filter((name)=>selected.has(name));
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
    const rows = source.filter((row) => {
      if (cities.length && !cities.includes(row.city)) return false;
      if (filters.category && row.category !== filters.category) return false;
      if (filters.showroom && row.showroom !== filters.showroom) return false;
      if (filters.priority && row.priority !== filters.priority) return false;
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
      const preferred = 10 + ((index*31 + seed)%81);
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
  window.KZCore = Object.freeze({ emptyFilters, selectedCities, mapCities, toggleCitySelection, hasCompetitiveEvidence, competitiveBlockHTML, derive, metrics, queue, layoutPoints, filtersForKpi });

  window.bootKZApp = function bootKZApp(options) {
    const source = window.KZ_PROSPECTS;
    const $ = (selector, root=document) => root.querySelector(selector);
    const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
    const state = { filters:emptyFilters(), sort:{key:'score',dir:'desc'}, selectedId:null, route:'landing' };
    const pages = $$('.page');
    const esc = escapeHTML;
    const categoryClass = (v) => 'cat-' + v.toLowerCase().replace(/\s+/g,'-');
    function syncFilterButtons() {
      const cities = selectedCities(state.filters);
      $$('[data-filter-button]').forEach((button)=>{
        const key = button.dataset.filterButton;
        const active = key === 'city' ? cities.includes(button.dataset.value) : state.filters[key] === button.dataset.value;
        button.setAttribute('aria-pressed',String(active));
      });
    }

    const ownershipMarkup = '<p class="top-ownership">Market research &amp; dashboard created by <strong>Francisco González</strong></p>';
    $$('.landing-nav .wordmark, .topbar .brand-button').forEach((brand)=>{
      if (!brand.nextElementSibling?.classList.contains('top-ownership')) brand.insertAdjacentHTML('afterend',ownershipMarkup);
    });
    const projectHeader = $('[data-page="projects"] .project-grid > header');
    if (projectHeader && !projectHeader.querySelector('.wordmark')) {
      projectHeader.insertAdjacentHTML('afterbegin',`<div class="project-identity"><a href="https://www.cosentino.com/" target="_blank" rel="noopener" class="wordmark"><span>C</span><b>COSENTINO</b></a>${ownershipMarkup}</div>`);
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
    function mapHTML(rows, cities) {
      return cities.map((city) => {
        const cityRows=rows.filter(r=>r.city===city);
        const positions=new Map(layoutPoints(cityRows,city).map(point=>[point.id,point]));
        const dots=cityRows.map((r)=>{
          const point=positions.get(r.id);
          return `<button class="map-dot ${categoryClass(r.category)} ${r.showroom==='Yes'?'has-showroom':''} ${state.selectedId===r.id?'selected':''}" style="--x:${point.x}%;--y:${point.y}%" data-select="${r.id}" aria-label="${esc(r.name)}, ${r.score} potential${r.showroom==='Yes'?', confirmed showroom':''}" title="${esc(r.name)} · ${r.score}/100 · ${r.showroom==='Yes'?'Showroom confirmed':'Showroom not confirmed'}"><span>${r.score}</span></button>`;
        }).join('');
        return `<section class="city-lane"><header><b>${city}</b><span>${cityRows.length} prospects</span></header><div class="lane-field"><i class="grid g1">100</i><i class="grid g2">70</i><i class="grid g3">40</i><i class="grid g4">0</i>${dots}</div></section>`;
      }).join('');
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
    function render() {
      const rows=derive(source,state.filters,state.sort), m=metrics(rows);
      const values={total:m.total,high:m.high,showroom:m.showroom,cities:m.cities};
      Object.entries(values).forEach(([key,value])=>$$(`[data-metric="${key}"]`).forEach(el=>el.textContent=value));
      const denominators={total:source.length,high:Math.max(1,m.total),showroom:Math.max(1,m.total),cities:3};
      Object.entries(values).forEach(([key,value])=>$$(`[data-metric="${key}"]`).forEach((el)=>{const fill=el.closest('article')?.querySelector('.kpi-footer i b');if(fill)fill.style.width=`${Math.min(100,Math.round(value/denominators[key]*100))}%`;}));
      $$('[data-result-count]').forEach(el=>el.textContent=`${rows.length} of ${source.length} prospects`);
      const cities = mapCities(state.filters);
      $$('[data-map]').forEach((el)=>{
        el.style.setProperty('--city-count',cities.length);
        el.dataset.cityCount=String(cities.length);
        el.innerHTML=mapHTML(rows,cities);
      });
      $$('[data-queue]').forEach(el=>el.innerHTML=queueHTML(rows));
      $$('[data-table-body]').forEach(el=>el.innerHTML=tableHTML(rows));
      const selected=source.find(r=>r.id===state.selectedId);
      $$('[data-detail]').forEach(el=>{el.innerHTML=detailHTML(selected);el.classList.toggle('open',!!selected);el.setAttribute('aria-hidden',String(!selected));});
      document.body.classList.toggle('detail-open',!!selected);
      $$('[data-sort]').forEach(el=>el.setAttribute('aria-sort',state.sort.key===el.dataset.sort?(state.sort.dir==='asc'?'ascending':'descending'):'none'));
    }
    document.addEventListener('click',(event)=>{
      const kpi=event.target.closest('[data-kpi-action]'); if(kpi){activateKpi(kpi.dataset.kpiAction);return;}
      const nav=event.target.closest('[data-route]'); if(nav){route(nav.dataset.route);return;}
      const choice=event.target.closest('[data-select]'); if(choice){state.selectedId=choice.dataset.select;render();setTimeout(()=>{$('[data-detail].open h2')?.focus()},20);return;}
      if(event.target.closest('[data-close-detail]')){state.selectedId=null;render();return;}
      const reset=event.target.closest('[data-reset]'); if(reset){state.filters=emptyFilters();$$('[data-filter]').forEach(el=>el.value='');syncFilterButtons();render();return;}
      const filterButton=event.target.closest('[data-filter-button]'); if(filterButton){const key=filterButton.dataset.filterButton;const value=filterButton.dataset.value;if(key==='city'){state.filters.city=toggleCitySelection(state.filters.city,value);}else{state.filters[key]=state.filters[key]===value?'':value;}syncFilterButtons();state.selectedId=null;render();return;}
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

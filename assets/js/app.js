'use strict';
(() => {
 const script = document.currentScript;
 const base = new URL('../../', script.src);
 const pages = [
 ['產業總覽','index.html','資安 企業 產業 雲端 網路 資料 SOC SASE'],
 ['端點安全','sectors/endpoint.html','端點 EPP EDR XDR MDR Falcon'],
 ['身分安全','sectors/identity.html','身分 SSO MFA IAM PAM IGA Zero Trust'],
 ['CrowdStrike｜CRWD','companies/crwd.html','CRWD CrowdStrike Falcon ARR 財報'],
 ['Okta｜OKTA','companies/okta.html','OKTA Auth0 身分 cRPO 財報'],
 ['Palo Alto Networks｜PANW','companies/panw.html','PANW Palo Alto Cortex NGS ARR 財報'],
 ['財報指標與互動練習','metrics/index.html','ARR Net New ARR RPO cRPO NRR Billings FCF SBC EPS GAAP 財報 指標']
 ];
 const search = document.getElementById('site-search');
 const results = document.getElementById('search-results');
 search.addEventListener('input', () => {
  results.replaceChildren(); const term = search.value.trim().toLowerCase();
  results.hidden = !term; if(!term) return;
  const matches = pages.filter(p => (p[0]+' '+p[2]).toLowerCase().includes(term));
  matches.forEach(p => { const link=document.createElement('a');link.href=new URL(p[1],base);link.textContent=p[0]+' ↗';results.append(link); });
  if(!matches.length){const p=document.createElement('p');p.textContent='找不到相關頁面，試試 ARR、端點或 PANW。';results.append(p);}
 });
 search.addEventListener('keydown', e => { if(e.key==='Escape'){results.hidden=true;search.value='';}if(e.key==='Enter'&&!results.hidden){const link=results.querySelector('a');if(link)link.click();} });
 document.addEventListener('click', e => {if(!results.contains(e.target)&&e.target!==search)results.hidden=true;});
 const menu=document.getElementById('menu-toggle');
 menu.addEventListener('click',()=>{const open=document.body.classList.toggle('menu-open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'關閉':'目錄';});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.body.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');menu.textContent='目錄';}});
 const financial = document.getElementById('financial-data');
 const format = (value, digits=1) => value == null ? '待核對' : value.toLocaleString('en-US',{minimumFractionDigits:digits,maximumFractionDigits:digits});
 if(financial){
  const data=JSON.parse(financial.textContent); const select=document.getElementById('quarter-select');
  const detailFields=[['gaap_gross_margin','GAAP 毛利率','%',2],['gaap_operating_margin','GAAP 營業利益率','%',2],['non_gaap_operating_margin','non-GAAP 營業利益率','%',2],['gaap_eps','GAAP 稀釋 EPS',' 美元',2],['non_gaap_eps','non-GAAP 稀釋 EPS',' 美元',2],['operating_cash_flow','營業現金流','',1],['capex','資本支出（資產購置）','',1],['fcf','自由現金流（公司口徑）','',1],['fcf_margin','自由現金流率','%',2],['sbc','SBC（純股權薪酬）','',1],['diluted_shares','GAAP 稀釋加權平均股數',' 百萬股',3]];
  function render(){
   const q=data.quarters[Number(select.value)];
   document.getElementById('quarter-meta').textContent=`財季截止 ${q.period_end} ｜ 公告 ${q.release_date} ｜ 核對 ${q.checked_at} ｜ ${q.status}`;
   const cards=document.getElementById('finance-cards'); cards.replaceChildren();
   [['營收',q.revenue,'百萬美元'],['營收 YoY',q.revenue_yoy,'% · 官方約數'],['non-GAAP OPM',q.non_gaap_operating_margin,'%'],['自由現金流',q.fcf,'百萬美元 · 公司口徑']].forEach(([label,value,unit])=>{const card=document.createElement('article');card.className='finance-card';const s=document.createElement('span'),b=document.createElement('b'),small=document.createElement('small');s.textContent=label;b.textContent=format(value);small.textContent=unit;card.append(s,b,small);cards.append(card);});
   const details=document.getElementById('finance-details');details.replaceChildren();
   detailFields.forEach(([key,label,unit,digits])=>{const row=document.createElement('div'),span=document.createElement('span'),b=document.createElement('b');span.textContent=label;b.textContent=q[key]==null?'待核對':format(q[key],digits)+unit;if(q[key]==null)b.className='pending';row.append(span,b);details.append(row);});
   const kpis=document.getElementById('kpi-cards');kpis.replaceChildren();
   Object.entries(q.kpis||{}).forEach(([name,value])=>{const card=document.createElement('div'),span=document.createElement('span'),b=document.createElement('b');span.textContent=name;b.textContent=format(value,name.includes('%')?0:1)+(name.includes('%')?'%':'');card.append(span,b);kpis.append(card);});
   document.getElementById('quarter-note').textContent=[q.eps_basis?'EPS 與股數口徑：'+q.eps_basis+'。':'',q.note||'',data.methodology].filter(Boolean).join(' ');
   const links=document.getElementById('quarter-sources');links.replaceChildren();
   q.source_urls.forEach((u,i)=>{const link=document.createElement('a');link.href=u;link.target='_blank';link.rel='noopener';link.textContent=`FY${q.fiscal_year} Q${q.fiscal_quarter} 官方財報來源 ${i+1} ↗`;links.append(link);});
  }
  select.addEventListener('change',render);render();
 }
 const revenue=document.getElementById('calc-revenue'),fcf=document.getElementById('calc-fcf');
 if(revenue&&fcf){const result=document.getElementById('calc-result');const calculate=()=>{const r=Number(revenue.value),f=Number(fcf.value);result.textContent=revenue.value===''||fcf.value===''||!Number.isFinite(r)||!Number.isFinite(f)||r<=0?'營收需大於 0':(f/r*100).toFixed(1)+'%';result.style.fontSize=result.textContent.length>9?'24px':'';};revenue.addEventListener('input',calculate);fcf.addEventListener('input',calculate);calculate();}
})();

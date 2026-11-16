"""Check local links, structured data, and embedded data consistency."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,math
ROOT=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.ids=set();self.collect=False;self.payload=''
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if 'id' in d:self.ids.add(d['id'])
  for key in ('href','src'):
   if key in d:self.links.append(d[key])
  if tag=='script' and d.get('id')=='financial-data':self.collect=True
 def handle_endtag(self,tag):
  if tag=='script':self.collect=False
 def handle_data(self,s):
  if self.collect:self.payload+=s
pages={p:Page() for p in ROOT.rglob('*.html')}
for p,parser in pages.items():parser.feed(p.read_text())
errors=[]
for p,parser in pages.items():
 for link in parser.links:
  u=urlsplit(link)
  if u.scheme or u.netloc:continue
  dest=(p.parent/unquote(u.path)).resolve() if u.path else p
  if dest.is_dir():dest=dest/'index.html'
  if not dest.exists():errors.append(f'{p.relative_to(ROOT)}: missing {link}')
  if u.fragment and dest in pages and unquote(u.fragment) not in pages[dest].ids:errors.append(f'{p.name}: missing anchor {link}')
for p in (ROOT/'data/companies').glob('*.json'):
 d=json.loads(p.read_text());assert len(d['quarters'])>=4
 seen=set()
 for q in d['quarters']:
  key=(q['fiscal_year'],q['fiscal_quarter']);assert key not in seen;seen.add(key)
  assert q['period_end']<=q['release_date']<=q['checked_at']
  assert q['revenue']>0 and all(x.startswith('https://') for x in q['source_urls'])
  if q['fcf'] is not None:assert math.isclose(q['fcf_margin'],q['fcf']/q['revenue']*100,abs_tol=.011)
  for k,v in q.items():
   if isinstance(v,float):assert math.isfinite(v)
 page=pages[ROOT/'companies'/(p.stem+'.html')]
 assert json.loads(page.payload)==d,'Embedded financial data must match canonical JSON'
assert not errors,'\n'.join(errors)
print(f'PASS: {len(pages)} pages, local links/anchors, 12 financial records, JSON and embedded data consistency.')

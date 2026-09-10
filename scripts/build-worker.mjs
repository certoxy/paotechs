import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const files = ['index.html','privacy.html','terms.html','404.html','labaflow.html','retail-solutions.html','custom-apps.html','case-studies.html','thank-you.html','styles.css','enhancements.css','phase2.css','script.js','favicon.svg','paotechs-logo.svg','paotechs-logo-light.svg','social-preview.svg','social-preview.png','robots.txt','sitemap.xml','googleb3031afe16ca73ae.html'];
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8'};
const assets = {};
for (const name of files) assets['/' + name] = { type: mime[extname(name)] || 'application/octet-stream', data: (await readFile(resolve(root, name))).toString('base64') };
assets['/'] = assets['/index.html'];
const worker = `const assets=${JSON.stringify(assets)};
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const clean=(value,max)=>String(value||'').trim().slice(0,max);
async function inquiry(request,env){
  let body; try{body=await request.json()}catch{return json({error:'Invalid request.'},400)}
  if(clean(body.website,100)) return json({ok:true});
  const name=clean(body.name,120),email=clean(body.email,200),company=clean(body.company,180),interest=clean(body.interest,120),message=clean(body.message,4000);
  if(!name||!email||!interest||!message||!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return json({error:'Please complete all required fields.'},400);
  const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{authorization:'Bearer '+env.RESEND_API_KEY,'content-type':'application/json'},body:JSON.stringify({from:env.INQUIRY_FROM,to:[env.INQUIRY_TO],reply_to:email,subject:'PAOTECHS inquiry: '+interest,text:['New PAOTECHS website inquiry','','Name: '+name,'Email: '+email,'Company: '+(company||'Not provided'),'Interest: '+interest,'','Project details:',message].join('\\n')})});
  if(!response.ok) return json({error:'We could not send your inquiry. Please try again or email hello@paotechs.com.'},502);
  return json({ok:true});
}
export default{async fetch(request,env){const url=new URL(request.url);if(url.pathname==='/api/inquiry'&&request.method==='POST')return inquiry(request,env);if(request.method!=='GET'&&request.method!=='HEAD')return new Response('Method not allowed',{status:405});let asset=assets[url.pathname];if(!asset&&url.pathname.endsWith('/'))asset=assets[url.pathname+'index.html'];if(!asset)asset=assets['/404.html'];const bytes=Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0));return new Response(request.method==='HEAD'?null:bytes,{status:assets[url.pathname]||url.pathname==='/'?200:404,headers:{'content-type':asset.type,'x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin','content-security-policy':\"default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; form-action 'self'; frame-ancestors 'none'\",'cache-control':asset.type.startsWith('text/html')?'no-cache':'public, max-age=86400'}})}};`;
await mkdir(resolve(root,'worker'),{recursive:true});
await mkdir(resolve(root,'dist/server'),{recursive:true});
await mkdir(resolve(root,'dist/.openai'),{recursive:true});
await writeFile(resolve(root,'worker/index.js'),worker);
await writeFile(resolve(root,'dist/server/index.js'),worker);
await writeFile(resolve(root,'dist/.openai/hosting.json'),await readFile(resolve(root,'.openai/hosting.json')));

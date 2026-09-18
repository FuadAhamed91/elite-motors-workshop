// Runs after `vite build` and `vite build --ssr`: writes the static shell (navbar + hero,
// both languages) and the language/intro bootstrap script into dist/index.html.
import { readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

const { renderShell, shellMeta } = await import(pathToFileURL('.prerender/entry-server.js').href)
const htmlPath = 'dist/index.html'
let html = readFileSync(htmlPath, 'utf8')

const shell =
  `<div class="shell shell-en" lang="en" dir="ltr">${renderShell('en')}</div>` +
  `<div class="shell shell-ar" lang="ar" dir="rtl">${renderShell('ar')}</div>` +
  (shellMeta.introOverlay ? '<div class="shell-intro splash-backdrop" aria-hidden="true"></div>' : '')

if (!html.includes('<div id="root"></div>')) throw new Error('dist/index.html: #root placeholder not found')
html = html.replace('<div id="root"></div>', `<div id="root">${shell}</div>`)

// Language + intro bootstrap: runs before the stylesheet so the first paint is already
// in the visitor's language and, for first-time visitors, already under the intro backdrop.
const bootstrap = `<script>(function(){try{var d=document.documentElement,q=new URLSearchParams(location.search),p=q.get('lang'),l=(p==='ar'||p==='en')?p:null;if(!l){var s=localStorage.getItem('emw:lang');if(s==='ar'||s==='en')l=s}if(!l){var ls=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language];l=ls.some(function(x){return /^ar/i.test(x||'')})?'ar':'en'}d.lang=l;d.dir=l==='ar'?'rtl':'ltr';var t=${JSON.stringify(shellMeta.titles)},m=${JSON.stringify(shellMeta.descriptions)};document.title=t[l];var md=document.querySelector('meta[name="description"]');if(md)md.setAttribute('content',m[l]);if(l==='ar'){['https://fonts.googleapis.com','https://fonts.gstatic.com'].forEach(function(o){var c=document.createElement('link');c.rel='preconnect';c.href=o;if(o.indexOf('gstatic')>0)c.crossOrigin='';document.head.appendChild(c)});var f=document.createElement('link');f.rel='stylesheet';f.href='https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap';f.setAttribute('data-arabic-font','true');document.head.appendChild(f)}${
  shellMeta.introOverlay
    ? `var seen=${shellMeta.introOncePerVisitor ? 'localStorage' : 'sessionStorage'}.getItem(${JSON.stringify(shellMeta.introStorageKey)}),rm=matchMedia('(prefers-reduced-motion: reduce)').matches,n=navigator,weak=${shellMeta.skipOnWeakDevices ? '!!(n.connection&&n.connection.saveData)||(n.hardwareConcurrency<=2)||(n.deviceMemory<=2)' : 'false'},mode=q.get('intro');if(!seen&&!rm&&!weak&&mode!=='skip')d.classList.add('intro-pending');`
    : ''
}}catch(e){}})();</script>`
const anchor = '<meta name="viewport"'
const at = html.indexOf(anchor)
if (at < 0) throw new Error('dist/index.html: viewport meta not found')
const lineEnd = html.indexOf('\n', at)
html = html.slice(0, lineEnd + 1) + '    ' + bootstrap + '\n' + html.slice(lineEnd + 1)

// Let the shell paint before the app runs: preload the main module, but import it only
// once the browser has reported its largest-contentful-paint candidate (the shell's
// headline) — or on the first touch/keypress, or after 2.5 s in a background tab. On a
// slow connection the script is still downloading by then, so nothing is lost.
const scriptTag = html.match(/<script type="module" crossorigin src="(\/assets\/index-[^"]+\.js)"><\/script>/)
if (!scriptTag) throw new Error('dist/index.html: main module script not found')
const mainSrc = scriptTag[1]
const loader =
  `(function(){var d=false,g=function(){if(!d){d=true;import(${JSON.stringify(mainSrc)})}};` +
  `try{var o=new PerformanceObserver(function(){o.disconnect();g()});o.observe({type:'largest-contentful-paint',buffered:true})}catch(e){g()}` +
  `addEventListener('pointerdown',g,{once:true});addEventListener('keydown',g,{once:true});setTimeout(g,2500)})()`
html = html.replace(
  scriptTag[0],
  `<link rel="modulepreload" crossorigin href="${mainSrc}">
    <script type="module">${loader}</script>`,
)

writeFileSync(htmlPath, html)
console.log(`prerender: shell written to ${htmlPath} (${Math.round(html.length / 1024)} KB)`)

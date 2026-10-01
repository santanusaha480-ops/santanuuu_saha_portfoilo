const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);

// Loading screen
window.addEventListener('load',()=>setTimeout(()=>document.body.classList.add('loaded'),450));

// Scroll progress + back-to-top
const progress=$('.scroll-progress'), topBtn=$('.back-top');
function updateScrollUI(){
  const max=document.documentElement.scrollHeight-innerHeight;
  const ratio=max>0?scrollY/max:0;
  progress.style.transform=`scaleX(${ratio})`;
  topBtn.classList.toggle('show',scrollY>700);
}
addEventListener('scroll',updateScrollUI,{passive:true}); updateScrollUI();

// Reveal on scroll
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')});
},{threshold:.12});
$$('.reveal').forEach(el=>observer.observe(el));

// Cursor
const dot=$('.cursor-dot'),ring=$('.cursor-ring');let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px'});
(function cursorLoop(){rx+=(mx-rx)*.13;ry+=(my-ry)*.13;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(cursorLoop)})();
$$('a,button,.tilt').forEach(el=>{el.addEventListener('mouseenter',()=>ring.classList.add('hover'));el.addEventListener('mouseleave',()=>ring.classList.remove('hover'))});

// Magnetic controls
$$('.magnetic').forEach(el=>{
  el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)*.18,y=(e.clientY-r.top-r.height/2)*.18;el.style.transform=`translate(${x}px,${y}px)`});
  el.addEventListener('mouseleave',()=>el.style.transform='');
});

// 3D tilt
if(innerWidth>800) $$('.tilt').forEach(el=>{
  el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,rx=(y/r.height-.5)*-7,ry=(x/r.width-.5)*7;el.style.transform=`perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`});
  el.addEventListener('mouseleave',()=>el.style.transform='');
});

// Hero parallax
addEventListener('scroll',()=>{$$('.parallax').forEach(el=>el.style.transform=`translateY(${scrollY*parseFloat(el.dataset.speed||.1)}px)`)},{passive:true});

// Menu
const menuBtn=$('#menuBtn'),menu=$('#menuPanel');
menuBtn.addEventListener('click',()=>menu.classList.toggle('open'));
$$('#menuPanel a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));

// Music: start immediately when the page loads.
// NOTE: Modern browsers may block audible autoplay until the visitor interacts
// with the page. We attempt autoplay immediately, and retry on the first
// interaction as a fallback.
const music=$('#ambient'),musicBtn=$('#musicToggle');
music.volume=.18;
music.autoplay=true;
music.setAttribute('autoplay','');
music.setAttribute('playsinline','');

async function startMusic(){
  if(!music.paused) return true;
  try{
    await music.play();
    musicBtn.textContent='♫';
    musicBtn.setAttribute('aria-label','Pause ambient music');
    return true;
  }catch(e){
    return false;
  }
}

// Try as early as possible, then retry after the page becomes ready.
startMusic();
addEventListener('DOMContentLoaded',startMusic,{once:true});
addEventListener('load',startMusic,{once:true});

// Browser autoplay-policy fallback: as soon as the visitor first interacts,
// start the supplied piano track without requiring the music button to be clicked.
['pointerdown','keydown','touchstart','scroll'].forEach(evt=>{
  addEventListener(evt,startMusic,{once:true,passive:true});
});

musicBtn.addEventListener('click',async e=>{
  e.stopPropagation();
  if(music.paused){
    await startMusic();
  }else{
    music.pause();
    musicBtn.textContent='♪';
    musicBtn.setAttribute('aria-label','Play ambient music');
  }
});

// Copy email
$('#copyEmail').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('santanusaha480@gmail.com')}catch(e){}document.body.classList.add('copying');setTimeout(()=>document.body.classList.remove('copying'),1500)});

// Current section title
const sections=[...$$('main section')];
const titleObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)document.title=`${e.target.id.toUpperCase()} — SANTANUUU SAHA`}),{threshold:.55});
sections.forEach(s=>titleObserver.observe(s));

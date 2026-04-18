const hdr=document.getElementById('header');
window.addEventListener('scroll',()=>{hdr.classList.toggle('scrolled',window.scrollY>20)},{passive:true});
const ham=document.querySelector('.hamburger'),mnav=document.querySelector('.mobile-nav');
if(ham&&mnav){ham.addEventListener('click',()=>{ham.classList.toggle('open');mnav.classList.toggle('open');document.body.style.overflow=mnav.classList.contains('open')?'hidden':''});mnav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{ham.classList.remove('open');mnav.classList.remove('open');document.body.style.overflow=''}))}
const obs=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');obs.unobserve(x.target)}})},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.rv').forEach(el=>obs.observe(el));
document.querySelectorAll('.faq-q').forEach(q=>{q.addEventListener('click',()=>q.parentElement.classList.toggle('open'))});

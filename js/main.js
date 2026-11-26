/* Ruah Cafeteria — interações do site
   Cardápio em abas, faixa de palavras, olhos que seguem o mouse, leque do Instagram,
   vídeo da inauguração e carregamento da cena 3D do topo (js/xicara3d.js). */
(() => {
const SCRIPT_URL = document.currentScript.src;
/* ---------- flutuantes ---------- */
const FL={
  grao:`<svg viewBox="0 0 40 40"><ellipse cx="20" cy="20" rx="12" ry="16" fill="#5A2E17"/><path d="M20 5c-6 8 6 22 0 30" stroke="#2B140A" stroke-width="3" fill="none"/></svg>`,
  folha:`<svg viewBox="0 0 40 40"><path d="M6 34C6 14 20 4 36 4c0 18-12 30-30 30z" fill="#3E8A5A"/><path d="M8 32L30 10" stroke="#2A6A42" stroke-width="2.5"/></svg>`,
  gelo:`<svg viewBox="0 0 40 40"><rect x="5" y="5" width="30" height="30" rx="8" fill="rgba(225,244,255,.75)" stroke="#fff" stroke-width="2"/><path d="M11 13h8" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>`,
  canela:`<svg viewBox="0 0 40 40"><rect x="4" y="12" width="32" height="8" rx="4" fill="#8A4A22"/><rect x="4" y="21" width="32" height="8" rx="4" fill="#A65E2E"/></svg>`,
  coracao:`<svg viewBox="0 0 40 40"><path d="M20 34C6 24 2 16 8 9c4-4 9-3 12 2 3-5 8-6 12-2 6 7 2 15-12 25z" fill="#E08A6B"/></svg>`,
  queijo:`<svg viewBox="0 0 40 40"><path d="M4 30L34 10v20z" fill="#F7D046"/><circle cx="24" cy="23" r="3" fill="#E0B32E"/><circle cx="30" cy="17" r="2" fill="#E0B32E"/></svg>`,
  choco:`<svg viewBox="0 0 40 40"><rect x="6" y="6" width="28" height="28" rx="4" fill="#4A2412"/><path d="M20 6v28M6 20h28" stroke="#2E160A" stroke-width="2.5"/></svg>`,
  morango:`<svg viewBox="0 0 40 40"><path d="M20 36C8 28 6 16 12 12c4-2 12-2 16 0 6 4 4 16-8 24z" fill="#C8333A"/><path d="M12 10c4 2 12 2 16 0l-8-6z" fill="#3E8A5A"/></svg>`
};
const VAGAS=[[6,14,1,-14],[84,10,.8,20],[2,60,.9,30],[86,56,1.1,-8],[20,86,.7,12],[72,84,.85,-24]];
const flut=(tipos)=>tipos.map((t,i)=>{const[l,tp,s,r]=VAGAS[i%6];return `<div class="flut" style="left:${l}%;top:${tp}%;scale:${s};rotate:${r}deg;animation-delay:${(i*.7).toFixed(1)}s,${(i*.06).toFixed(2)}s">${FL[t]}</div>`}).join('');

/* ---------- cardápio ---------- */
const P='img/produtos/';
const CARD=[
 {id:'cafes',titulo:'Cafés',bg:'#D9A441',fg:'#2A1416',ativo:'#2A1416',ativoFg:'#F3ECDA',script:'café',itens:[
  {n:'Espresso',s:'curto e intenso',d:'Grãos moídos na hora e extração no capricho, com aquela crema dourada. Pequeno no tamanho, grande no sabor.',t:['Passado na hora','Puro'],img:P+'espresso.webp',f:['grao','grao','folha','grao','grao','coracao']},
  {n:'Café com chantilly',s:'cremoso por cima',d:'Café quentinho coberto com chantilly e uma pitadinha de canela. Docinho na medida.',t:['Com chantilly','Docinho'],img:P+'cafe-com-chantilly.webp',f:['canela','grao','coracao','canela','grao','coracao']},
  {n:'Cappuccino',s:'espuma cremosa',d:'Espresso, leite vaporizado e uma camada de espuma cremosa, com aquele coraçãozinho por cima.',t:['Com arte no leite','Cremoso'],img:'img/cafe.webp',f:['canela','grao','coracao','choco','grao','canela']},
  {n:'Café coado',s:'na xícara',d:'O cafezinho de todo dia, passado na hora e servido bem quente.',t:['Clássico','Quentinho'],img:P+'cafe-coado.webp',f:['grao','folha','grao','coracao','grao','grao']},
  {n:'Chocolate quente',s:'com raspas de chocolate',d:'Chocolate cremoso e quentinho, finalizado com raspas de chocolate. Abraço em forma de bebida.',t:['Cremoso','Com raspas'],img:P+'chocolate-quente.webp',alto:true,f:['choco','coracao','choco','canela','choco','grao']}
 ]},
 {id:'comer',titulo:'Pra comer',bg:'#5B1D22',fg:'#F3ECDA',ativo:'#F3ECDA',ativoFg:'#5B1D22',script:'fome',itens:[
  {n:'Pão c/ requeijão',s:'gratinado',d:'Casquinha dourada por cima e requeijão derretendo por dentro. Aquela pedida clássica de quando bate uma fominha.',t:['Gratinado','Não passa pro lado'],img:P+'pao-requeijao-gratinado.webp',f:['queijo','queijo','folha','queijo','grao','queijo']},
  {n:'Pão de queijo',s:'saindo do forno',d:'Casquinha crocante, miolo puxa-puxa. Combina com qualquer café do cardápio — e tem combo!',t:['Quentinho','Mineirinho'],img:P+'pao-de-queijo.webp',f:['queijo','folha','queijo','grao','queijo','folha']},
  {n:'Misto quente',s:'na chapa',d:'Pão, presunto e queijo derretido, prensado na chapa até ficar douradinho e marcado.',t:['Na chapa','Derretido'],img:P+'misto-quente.webp',f:['queijo','folha','queijo','queijo','grao','folha']},
  {n:'Pão na chapa',s:'com queijo',d:'Pão francês na chapa, crocante por fora, com queijo escorrendo por dentro.',t:['Crocante','Queijo derretido'],img:P+'pao-na-chapa-queijo.webp',f:['queijo','grao','queijo','folha','queijo','grao']},
  {n:'Croissant',s:'folhado e amanteigado',d:'Massa folhada, dourada e amanteigada. Vai bem com um espresso curtinho.',t:['Folhado','Dourado'],img:P+'croissant.webp',f:['grao','folha','coracao','grao','folha','grao']},
  {n:'Salgado assado',s:'quentinho',d:'Salgado assado com casquinha de queijo gratinado. Pergunte no balcão os sabores do dia.',t:['Assado','Sabores do dia'],img:P+'salgado-assado.webp',f:['queijo','folha','queijo','grao','queijo','folha']},
  {n:'Bolo do dia',s:'fatia caseira',d:'Bolos deliciosos, como o de cenoura com cobertura de chocolate. Uma receita caseira pra acompanhar o café.',t:['Caseiro','Muda todo dia'],img:P+'bolo-cenoura-chocolate.webp',f:['choco','coracao','choco','morango','choco','folha']}
 ]},
 {id:'gelados',titulo:'Gelados',bg:'#1E5646',fg:'#F3ECDA',ativo:'#D9A441',ativoFg:'#2A1416',script:'gelo',itens:[
  {n:'Cappuccino ice',s:'gelado e cremoso',d:'Cappuccino batido com gelo, servido na taça. Refrescante pros dias quentes de Rio Preto.',t:['Refrescante','Cremoso'],img:P+'cappuccino-ice.webp',alto:true,f:['gelo','grao','gelo','choco','gelo','grao']},
  {n:'Soda italiana',s:'com gelo e limão',d:'Água com gás, xarope de fruta, bastante gelo e uma rodela de limão. Leve e colorida.',t:['Gaseificada','Refrescante'],img:P+'soda-italiana.webp',alto:true,f:['gelo','folha','gelo','gelo','folha','gelo']},
  {n:'Energético',s:'bem gelado',d:'Já pegou o seu? Energético geladinho pra dar aquele gás no dia.',t:['Gelado','Pra dar um gás'],img:P+'energetico.webp',alto:true,f:['gelo','gelo','folha','gelo','gelo','folha']}
 ]}
];
const paineis=document.getElementById('paineis');
paineis.innerHTML=CARD.map(c=>`<div class="painel" id="${c.id}" style="background:${c.bg};--fg:${c.fg};--ativo:${c.ativo};--ativo-fg:${c.ativoFg}">
  <svg class="rasgo cima" data-c="${c.bg}"></svg>
  <div class="wrap"><h2>${c.titulo}</h2>
  <div class="abas-wrap"><button class="seta-btn" data-dir="-1" aria-label="Item anterior">‹</button>
  <div class="abas" role="tablist" aria-label="${c.titulo}">${c.itens.map((it,i)=>`<button class="aba" role="tab" id="${c.id}-${i}" aria-selected="${i===0}" data-i="${i}">${it.img?`<img src="${it.img}" alt="">`:it.arte()}<span><b>${it.n}</b><small>${it.s}</small></span></button>`).join('')}</div>
  <button class="seta-btn" data-dir="1" aria-label="Próximo item">›</button></div>
  <div class="palco" aria-live="polite"></div><p class="desc"></p>
  <a class="btn" style="background:${c.ativo};color:${c.ativoFg}" href="#visite">Vem provar na Ruah ›</a>
  </div></div>`).join('')+`<p class="aviso wrap">Itens, sabores e preços podem variar — confira as novidades no balcão e no Instagram.</p>`;
CARD.forEach(c=>{
  const el=document.getElementById(c.id),palco=el.querySelector('.palco'),desc=el.querySelector('.desc'),abas=[...el.querySelectorAll('.aba')];let atual=0;
  const mostra=(i,rola=true)=>{atual=(i+c.itens.length)%c.itens.length;const it=c.itens[atual];
    abas.forEach((a,k)=>a.setAttribute('aria-selected',k===atual));
    if(rola){const ab=el.querySelector('.abas'),r=abas[atual].getBoundingClientRect(),q=ab.getBoundingClientRect();ab.scrollBy({left:(r.left+r.width/2)-(q.left+q.width/2),behavior:'smooth'})}
    palco.innerHTML=`<div class="fundo-script">Ruah</div>${flut(it.f)}<div class="heroi${it.alto?' alto':''}">${it.img?`<img src="${it.img}" alt="${it.n} da Ruah Cafeteria">`:it.arte()}</div><span class="tag t1">${it.t[0]}</span><span class="tag t2">${it.t[1]}</span>`;
    desc.textContent=it.d};
  abas.forEach(a=>a.addEventListener('click',()=>mostra(+a.dataset.i)));
  el.querySelectorAll('.seta-btn').forEach(b=>b.addEventListener('click',()=>mostra(atual+ +b.dataset.dir)));
  el.querySelector('.abas').addEventListener('keydown',e=>{if(e.key==='ArrowRight'){mostra(atual+1);abas[atual].focus()}if(e.key==='ArrowLeft'){mostra(atual-1);abas[atual].focus()}});
  mostra(0,false);
});

/* ---------- papel rasgado ---------- */
let sem=7;const rnd=()=>(sem=(sem*9301+49297)%233280)/233280;
document.querySelectorAll('.rasgo').forEach(s=>{s.setAttribute('viewBox','0 0 1200 30');s.setAttribute('preserveAspectRatio','none');
  let d='M0 30L0 '+(10+rnd()*12);for(let x=0;x<1200;){x+=8+rnd()*22;d+=`L${Math.min(x,1200).toFixed(0)} ${(3+rnd()*22).toFixed(1)}`}
  s.innerHTML=`<path d="${d}L1200 30Z" fill="${s.dataset.c}"/>`});

/* ---------- faixa de palavras ---------- */
const P1=['Passado na hora','Cremoso','Quentinho','Gratinado','Com fé','Feito com carinho','Na calma','Coado'];
const P2=['Espresso','Pão de queijo','Cappuccino ice','Requeijão','Soda italiana','Bolo do dia','Croissant','Abençoado'];
const lin=a=>{const s=a.map(w=>`<span>${w}</span><span class="ponto">•</span>`).join('');return s+s};
document.getElementById('l1').innerHTML=lin(P1);document.getElementById('l2').innerHTML=lin(P2);

/* ---------- hero flutuantes ---------- */
document.getElementById('hero-flut').innerHTML=[['grao',-4,6,1],['folha',88,58,1.2],['grao',-6,42,.8],['coracao',90,86,.9],['grao',40,-4,.7]].map(([t,l,tp,s],i)=>`<div class="flut" style="left:${l}%;top:${tp}%;width:${54*s}px;rotate:${i*37}deg;animation-delay:${i*.9}s">${FL[t]}</div>`).join('');

/* ---------- olhos que acompanham ---------- */
const og=document.getElementById('olhos-g'),olhos=document.getElementById('olhos');
og.innerHTML=[38,110].map(x=>`<ellipse cx="${x}" cy="42" rx="32" ry="40" fill="#fff"/><g class="iris" data-x="${x}"><circle cx="${x}" cy="46" r="17" fill="#C8902F"/><circle cx="${x}" cy="46" r="13" fill="#5B3415"/><circle cx="${x}" cy="46" r="8" fill="#111"/><circle cx="${x-5}" cy="40" r="4" fill="#fff"/></g>`).join('');
const iris=[...og.querySelectorAll('.iris')];
const olha=(px,py)=>{const r=olhos.getBoundingClientRect();iris.forEach(g=>{const cx=r.left+r.width*(+g.dataset.x/150),cy=r.top+r.height*.5,a=Math.atan2(py-cy,px-cx),d=Math.min(12,Math.hypot(px-cx,py-cy)/20);g.setAttribute('transform',`translate(${(Math.cos(a)*d).toFixed(1)} ${(Math.sin(a)*d*1.2).toFixed(1)})`)})};
addEventListener('pointermove',e=>olha(e.clientX,e.clientY),{passive:true});
let tq=0;const passeia=setInterval(()=>{if(matchMedia('(hover:none)').matches){tq++;const r=olhos.getBoundingClientRect();olha(r.left+r.width/2+Math.cos(tq)*300,r.top+Math.sin(tq*1.3)*200)}},1400);

/* ---------- leque do instagram ---------- */
const posts=[...document.querySelectorAll('.post')],POS=[[-150,10,-14],[-50,-14,-5],[50,-14,5],[150,10,14]];
const leque=()=>{const k=Math.min(1,innerWidth/900)*(innerWidth<600?.8:1);posts.forEach((p,i)=>{const[x,y,r]=POS[i];p.style.transform=`translate(calc(-50% + ${x*k*1.6}px),calc(-50% + ${y}px)) rotate(${r}deg)`;p.onmouseenter=()=>p.style.transform=`translate(calc(-50% + ${x*k*1.6}px),calc(-50% + ${y-30}px)) rotate(0deg) scale(1.06)`;p.onmouseleave=leque})};
leque();addEventListener('resize',leque);

/* ---------- reel da inauguração ---------- */
const reel=document.getElementById('reel'),rb=document.querySelector('.reel-play');let pausadoPeloUsuario=matchMedia('(prefers-reduced-motion:reduce)').matches;
const rbTxt=()=>{rb.textContent=reel.paused?'▶':'❚❚';rb.setAttribute('aria-label',reel.paused?'Tocar vídeo':'Pausar vídeo')};
rb.addEventListener('click',()=>{if(reel.paused){pausadoPeloUsuario=false;reel.play().catch(()=>{})}else{pausadoPeloUsuario=true;reel.pause()}});
reel.addEventListener('play',rbTxt);reel.addEventListener('pause',rbTxt);rbTxt();
new IntersectionObserver(([e])=>{if(e.isIntersecting&&!pausadoPeloUsuario)reel.play().catch(()=>{});else if(!e.isIntersecting)reel.pause()},{threshold:.35}).observe(reel);

/* ---------- xícara 3D no topo (a foto fica de reserva) ---------- */
const xBox=document.getElementById('xic3d');
if(document.documentElement.classList.contains('com3d')){
  const hf=xBox.parentElement;let pronto=false;
  const reserva=()=>{if(!pronto)hf.classList.add('sem3d')};
  setTimeout(reserva,8000); // conexão muito lenta: mostra a foto
  import(new URL('xicara3d.js',SCRIPT_URL).href)
    .then(m=>m.montaXicara(xBox,{logo:'img/logo.webp'}))
    .then(()=>{pronto=true;hf.classList.remove('sem3d');hf.classList.add('tem3d')})
    .catch(reserva);
}

/* ---------- topo ---------- */
const topo=document.getElementById('topo');const rol=()=>topo.classList.toggle('solid',scrollY>40);addEventListener('scroll',rol,{passive:true});rol();
})();

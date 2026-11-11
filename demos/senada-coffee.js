/* Senada Coffee demo: no payment provider, backend, or real order submission. */
(() => {
"use strict";
const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];
const KEY_CART="senada-coffee-demo-cart", KEY_LANG="senada-language", KEY_THEME="senada-theme";
const products=[
  {id:"latte",cat:"coffee",price:28000,emoji:"☕",tone:"#dbeee8",liquid:"#b58864",name:["Signature Latte","Signature Latte"],desc:["Espresso pilihan dengan susu lembut dan latte art.","Smooth espresso with creamy milk and latte art."],flag:["Favorit","Bestseller"]},
  {id:"aren",cat:"coffee",price:30000,emoji:"🧋",tone:"#f1e6d7",liquid:"#9d7654",name:["Kopi Susu Aren","Palm Sugar Coffee"],desc:["Kopi susu dingin, manis alami gula aren.","Iced milk coffee with natural palm sugar sweetness."],flag:["Terlaris","Popular"]},
  {id:"matcha",cat:"noncoffee",price:32000,emoji:"🍵",tone:"#e0edda",liquid:"#83a56a",name:["Iced Matcha","Iced Matcha"],desc:["Matcha harum dan susu segar, disajikan dingin.","Fragrant matcha with fresh milk, served chilled."],flag:["Pilihan baru","New"]},
  {id:"americano",cat:"coffee",price:24000,emoji:"☕",tone:"#e2ebec",liquid:"#654d3e",name:["Americano","Americano"],desc:["Rasa kopi yang bersih, bold, dan menyegarkan.","Clean, bold, refreshing espresso with water."],flag:null},
  {id:"choco",cat:"noncoffee",price:29000,emoji:"🥛",tone:"#f1e2df",liquid:"#855b4a",name:["Chocolate Cloud","Chocolate Cloud"],desc:["Cokelat pekat, susu, dan foam yang creamy.","Rich chocolate, milk, and creamy foam."],flag:null},
  {id:"croissant",cat:"food",price:26000,emoji:"🥐",tone:"#f9ebda",liquid:"#e2a75a",name:["Butter Croissant","Butter Croissant"],desc:["Pastry renyah berlapis, dipanggang hangat.","Flaky, buttery pastry served warm."],flag:["Fresh baked","Fresh baked"]},
  {id:"toast",cat:"food",price:34000,emoji:"🥪",tone:"#edf1de",liquid:"#c59b64",name:["Cheese Toast","Cheese Toast"],desc:["Roti panggang gurih, keju leleh, dan herbs.","Toasted bread, melted cheese, and herbs."],flag:null},
  {id:"berry",cat:"noncoffee",price:31000,emoji:"🍓",tone:"#f5e2e6",liquid:"#d37c8d",name:["Berry Fizz","Berry Fizz"],desc:["Soda beri ringan, segar, dan berwarna cerah.","Sparkling berry refreshment, light and fruity."],flag:null}
];
const translations={
 id:{
 demo:"DEMO PORTOFOLIO · TIDAK MENERIMA PESANAN NYATA",back:"← Kembali ke Senada Creatlabs",
 menuNav:"Menu",howNav:"Cara Pesan",aboutNav:"Tentang",cart:"Keranjang",
 eyebrow:"FRESH COFFEE. GOOD MOMENTS.",heroTitle:"Kopi enak,<br><em>pesan gampang.</em>",
 heroDesc:"Temukan kopi favoritmu, pilih camilan, dan selesaikan pesanan dalam beberapa langkah. Semua dari genggamanmu.",
 heroCta:"Pesan sekarang →",quick:"Siap untuk pickup",made:"Diracik setelah dipesan",tag:"Your daily coffee fix",tagSub:"Made with good vibes",
 heroBubble:"✦ Freshly brewed, just for you",
 perk1:"Pesan tanpa antre",perk1d:"Pilih menu lewat website.",perk2:"Pickup lebih mudah",perk2d:"Simulasi pengambilan di kedai.",perk3:"Pembayaran praktis",perk3d:"Lihat pengalaman QR pembayaran demo.",
 category:"KATEGORI MENU",menuTitle:"Pilih yang kamu suka.",menuSub:"Semua menu dan harga di bawah hanya contoh untuk demonstrasi.",
 all:"Semua",coffee:"Coffee",noncoffee:"Non-Coffee",food:"Snacks",search:"Cari menu favorit...",add:"+ Tambah",
 noResult:"Menu tidak ditemukan. Coba kata kunci lain.",storyEyebrow:"HOW IT WORKS",storyTitle:"Pilih. Checkout. Nikmati.",storyText:"Tampilan ini menunjukkan bagaimana pelanggan dapat menemukan menu, membuat keranjang, dan melihat instruksi pembayaran dalam satu pengalaman yang sederhana. Senada Coffee adalah merek fiktif.",
 step1:"01 Pilih menu",step2:"02 Cek keranjang",step3:"03 Simulasi QR",
 footer:"© Senada Coffee — contoh website pemesanan fiktif.",footerBack:"Dibuat untuk portofolio Senada Creatlabs",
 emptyTitle:"Keranjang masih kosong",emptyDesc:"Pilih menu favoritmu untuk memulai pesanan.",
 sub:"Subtotal",service:"Biaya layanan demo",total:"Total",checkout:"Lanjut checkout →",drawerHint:"Simulasi pemesanan • Tidak ada transaksi sungguhan.",remove:"Hapus",qty:"Jumlah",
 mobileCart:"Lihat keranjang",items:"item",item:"item",
 checkoutTitle:"Detail pesanan",checkoutDesc:"Isi nama untuk simulasi pengambilan di kedai.",
 name:"Nama pemesan *",namePlaceholder:"Nama lengkap",note:"Catatan untuk barista (opsional)",notePlaceholder:"Contoh: less ice, tanpa gula...",
 pay:"Buat QR pembayaran demo →",payTitle:"Simulasi pembayaran",payDesc:"Ini hanya contoh alur QR untuk portofolio.",
 order:"Nomor simulasi",payAmount:"TOTAL SIMULASI",warning:"QR DEMO — TIDAK VALID UNTUK PEMBAYARAN. Jangan pindai atau transfer uang. Tidak ada transaksi sebenarnya.",
 simulate:"Simulasikan pembayaran ✓",backCart:"Kembali ke keranjang",
 successTitle:"Pesanan demo selesai!",successText:"Ini hanya simulasi. Tidak ada pesanan terkirim, pembayaran diproses, atau pesanan yang perlu diambil.",again:"Buat pesanan demo baru",
 toastAdded:"ditambahkan ke keranjang",errorName:"Isi nama pemesan terlebih dahulu.",clearWarn:"Semua fitur di halaman ini hanya demo. Jangan lakukan pembayaran nyata.",
 light:"Ganti ke mode terang",dark:"Ganti ke mode gelap",
 pickup:"Pickup di kedai · Simulasi",thanks:"Terima kasih, "
 },
 en:{
 demo:"PORTFOLIO DEMO · NO REAL ORDERS",back:"← Back to Senada Creatlabs",
 menuNav:"Menu",howNav:"How it works",aboutNav:"About",cart:"Cart",
 eyebrow:"FRESH COFFEE. GOOD MOMENTS.",heroTitle:"Great coffee,<br><em>easy ordering.</em>",
 heroDesc:"Find your favorite coffee, add a tasty bite, and complete your order in a few simple steps — all from your phone.",
 heroCta:"Order now →",quick:"Ready for pickup",made:"Made fresh to order",tag:"Your daily coffee fix",tagSub:"Made with good vibes",
 heroBubble:"✦ Freshly brewed, just for you",
 perk1:"Skip the queue",perk1d:"Browse and select online.",perk2:"Easy pickup",perk2d:"Simulated in-store pickup.",perk3:"Simple checkout",perk3d:"Explore the sample QR payment flow.",
 category:"MENU CATEGORIES",menuTitle:"Find your new favorite.",menuSub:"All items and prices shown are fictional demo content.",
 all:"All",coffee:"Coffee",noncoffee:"Non-Coffee",food:"Snacks",search:"Search your favorites...",add:"+ Add",
 noResult:"No items found. Try another search.",storyEyebrow:"HOW IT WORKS",storyTitle:"Choose. Checkout. Enjoy.",storyText:"A simple customer journey: browse the menu, build a cart, and see simulated payment instructions. Senada Coffee is a fictional brand.",
 step1:"01 Choose items",step2:"02 Review cart",step3:"03 Simulate QR",
 footer:"© Senada Coffee — fictional ordering website demo.",footerBack:"Created for Senada Creatlabs portfolio",
 emptyTitle:"Your cart is empty",emptyDesc:"Add your favorites to get started.",
 sub:"Subtotal",service:"Demo service charge",total:"Total",checkout:"Continue to checkout →",drawerHint:"Ordering demo • No real transactions.",remove:"Remove",qty:"Quantity",
 mobileCart:"View cart",items:"items",item:"item",
 checkoutTitle:"Order details",checkoutDesc:"Enter your name for the simulated pickup order.",
 name:"Customer name *",namePlaceholder:"Full name",note:"Note for the barista (optional)",notePlaceholder:"Example: less ice, no sugar...",
 pay:"Generate demo payment QR →",payTitle:"Payment simulation",payDesc:"This is an illustration of a QR checkout flow only.",
 order:"Demo order ID",payAmount:"SIMULATED TOTAL",warning:"DEMO QR — NOT VALID FOR PAYMENT. Do not scan or transfer funds. No real transaction exists.",
 simulate:"Simulate payment ✓",backCart:"Back to cart",
 successTitle:"Demo order complete!",successText:"This is only a simulation. No order was submitted, no payment was processed, and nothing needs to be collected.",again:"Start another demo order",
 toastAdded:"added to cart",errorName:"Please enter a customer name.",clearWarn:"This page is a demo. Do not make any real payments.",
 light:"Switch to light mode",dark:"Switch to dark mode",
 pickup:"In-store pickup · Simulation",thanks:"Thank you, "
 }
};
const money=n=>"Rp"+Number(n).toLocaleString("id-ID");
const getPref=(key,fallback)=>{try{return localStorage.getItem(key)||fallback}catch(_){return fallback}};
const setPref=(key,value)=>{try{localStorage.setItem(key,value)}catch(_){ }};
let lang=getPref(KEY_LANG,"id")==="en"?"en":"id",theme=getPref(KEY_THEME,"light")==="dark"?"dark":"light",cart={},cat="all",query="",order=null,toastTimer;
const t=key=>translations[lang][key]||key;
try{const val=JSON.parse(getPref(KEY_CART,"{}"));if(val&&typeof val==="object"&&!Array.isArray(val))products.forEach(p=>{const q=Number(val[p.id]);if(Number.isInteger(q)&&q>0)cart[p.id]=Math.min(q,30)})}catch(_){}
const save=()=>setPref(KEY_CART,JSON.stringify(cart));
const count=()=>Object.values(cart).reduce((a,b)=>a+b,0);
const subtotal=()=>products.reduce((a,p)=>a+p.price*(cart[p.id]||0),0);
const total=()=>subtotal(); // Demo has no real tax, handling, or service charge.
const productById=id=>products.find(p=>p.id===id);
const nameOf=p=>p.name[lang==="id"?0:1], descOf=p=>p.desc[lang==="id"?0:1];
const iconSearch='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10.5" cy="10.5" r="6"/><path d="m15 15 5 5"/></svg>';
function drinkArt(p){
 if(p.cat==="food")return '<svg class="drink pastry" viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="101" rx="49" ry="12" fill="#28554d" opacity=".12"/><path d="M18 81 Q12 40 60 25 Q103 39 102 83 Q67 101 18 81Z" fill="'+p.liquid+'" stroke="#b37d4e" stroke-width="3"/><path d="M23 69 Q38 35 60 32 Q85 41 97 69" fill="none" stroke="#ffe3a9" stroke-width="8" stroke-linecap="round"/><path d="M22 81 Q59 99 98 81" fill="none" stroke="#fbe0a5" stroke-width="7" stroke-linecap="round"/></svg>';
 const hot=p.id==="latte"||p.id==="americano";
 if(hot)return '<svg class="drink" viewBox="0 0 120 150" aria-hidden="true"><ellipse cx="60" cy="131" rx="47" ry="10" fill="#25594d" opacity=".12"/><path d="M23 35h76v61c0 21-15 35-37 35S23 117 23 96Z" fill="#fffdf6" stroke="#d3dfd9" stroke-width="3"/><path d="M99 48h9c18 0 15 31-8 31" fill="none" stroke="#f6f9f7" stroke-width="10"/><ellipse cx="61" cy="35" rx="38" ry="12" fill="#e9cfb5" stroke="#fffdf6" stroke-width="4"/><ellipse cx="61" cy="35" rx="26" ry="8" fill="'+p.liquid+'"/><path d="M51 34q10-11 20 0-10 7-20 0Z" fill="#fff8ed"/><text x="60" y="93" font-size="12" fill="#0d7566" font-family="sans-serif" font-weight="bold" text-anchor="middle">senada</text></svg>';
 return '<svg class="drink" viewBox="0 0 120 150" aria-hidden="true"><ellipse cx="62" cy="136" rx="43" ry="10" fill="#254e46" opacity=".12"/><path d="M30 28h66l-7 105H37Z" fill="'+p.liquid+'" stroke="#e8f2ec" stroke-width="3"/><path d="M32 34h62l-4 27H35Z" fill="#f6f3e7" opacity=".27"/><ellipse cx="63" cy="29" rx="34" ry="9" fill="#f0f7ed"/><path d="M82 26 95 2" stroke="#d5a494" stroke-width="5" stroke-linecap="round"/><path d="M43 63h41" stroke="#fffaed" opacity=".5" stroke-width="3"/><text x="63" y="97" font-size="12" fill="#fffef9" font-family="sans-serif" font-weight="bold" text-anchor="middle">senada</text></svg>';
}
function renderProducts(){
 const list=products.filter(p=>(cat==="all"||p.cat===cat)&&(nameOf(p).toLocaleLowerCase().includes(query)||descOf(p).toLocaleLowerCase().includes(query)));
 $("#product-grid").innerHTML=list.length?list.map(p=>'<article class="product"><div class="product-art" style="--art-bg:'+p.tone+'">'+drinkArt(p)+(p.flag?'<span class="product-flag">'+p.flag[lang==="id"?0:1]+'</span>':'')+'</div><div class="product-info"><span class="product-meta">'+t(p.cat)+'</span><h3>'+nameOf(p)+'</h3><p class="product-desc">'+descOf(p)+'</p><div class="product-bottom"><span class="price">'+money(p.price)+'</span><button class="add-btn" type="button" data-add="'+p.id+'">'+t("add")+'</button></div></div></article>').join(""):'<div class="empty-results" style="grid-column:1/-1">'+t("noResult")+'</div>';
}
function renderCart(){
 const n=count();
 $("#cart-count").textContent=n;
 $("#mobile-count").textContent=n+" "+t(n===1?"item":"items");
 $("#mobile-total").textContent=money(total());
 $("#mobile-cart").hidden=n===0;
 const rows=products.filter(p=>cart[p.id]);
 $("#cart-list").innerHTML=rows.length?rows.map(p=>'<div class="cart-line"><div class="cart-thumb" style="--item-bg:'+p.tone+'">'+p.emoji+'</div><div><h3>'+nameOf(p)+'</h3><small>'+money(p.price)+'</small><div class="qty-controls"><button type="button" data-dec="'+p.id+'" aria-label="- '+nameOf(p)+'">−</button><span>'+cart[p.id]+'</span><button type="button" data-inc="'+p.id+'" aria-label="+ '+nameOf(p)+'">+</button></div></div><div class="line-total">'+money(p.price*cart[p.id])+'<button type="button" class="remove-btn" data-remove="'+p.id+'">'+t("remove")+'</button></div></div>').join(""):'<div class="cart-empty"><div class="illustration">🛒</div><strong>'+t("emptyTitle")+'</strong><p>'+t("emptyDesc")+'</p></div>';
 $("#cart-sub").textContent=money(subtotal());
 $("#cart-service").textContent=money(0);
 $("#cart-total").textContent=money(total());
 $("#checkout-open").disabled=n===0;
}
function changeQty(id,delta){if(!productById(id))return;const next=Math.max(0,Math.min(30,(cart[id]||0)+delta));if(next)cart[id]=next;else delete cart[id];save();renderCart();}
function showToast(text){const el=$("#toast");el.textContent=text;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2300);}
function openDrawer(){closeModal();$("#cart-overlay").classList.add("open");$("#cart-drawer").classList.add("open");$("#cart-drawer").setAttribute("aria-hidden","false");document.body.classList.add("modal-open");$("#cart-close").focus();}
function closeDrawer(){const wasOpen=$("#cart-drawer").classList.contains("open");$("#cart-overlay").classList.remove("open");$("#cart-drawer").classList.remove("open");$("#cart-drawer").setAttribute("aria-hidden","true");document.body.classList.remove("modal-open");if(wasOpen)$("#cart-open").focus();}
function showModal(id){closeDrawer();$("#checkout-modal").classList.add("open");$("#checkout-modal").setAttribute("aria-hidden","false");document.body.classList.add("modal-open");["details","payment","success"].forEach(k=>$("#screen-"+k).hidden=k!==id);$("#modal-close").focus();}
function closeModal(){const wasOpen=$("#checkout-modal").classList.contains("open");$("#checkout-modal").classList.remove("open");$("#checkout-modal").setAttribute("aria-hidden","true");document.body.classList.remove("modal-open");if(wasOpen)$("#cart-open").focus();}
function refreshStatic(){
 document.documentElement.lang=lang;
 $$("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;el.textContent=t(key)});
 $$("[data-i18n-html]").forEach(el=>{el.innerHTML=t(el.dataset.i18nHtml)});
 $$("[data-placeholder]").forEach(el=>{el.placeholder=t(el.dataset.placeholder)});
 $$("[data-language]").forEach(el=>el.setAttribute("aria-pressed",String(el.dataset.language===lang)));
 document.title=lang==="id"?"Senada Coffee — Pesan Kopi Online (Demo)":"Senada Coffee — Online Ordering (Demo)";
 $("#theme-toggle").title=t(theme==="dark"?"light":"dark");
 $("#theme-toggle").setAttribute("aria-label",$("#theme-toggle").title);
 $("#theme-toggle").textContent=theme==="dark"?"☀":"☾";
 $("#name-input").placeholder=t("namePlaceholder");$("#note-input").placeholder=t("notePlaceholder");$("#search-input").placeholder=t("search");
 $$("[data-filter]").forEach(el=>{el.textContent=t(el.dataset.filter);el.setAttribute("aria-pressed",String(cat===el.dataset.filter));});
 $("#search-input").setAttribute("aria-label",t("search"));
 renderProducts();renderCart();
}
function setTheme(next){theme=next;document.documentElement.dataset.theme=theme;setPref(KEY_THEME,theme);$("#theme-toggle").textContent=theme==="dark"?"☀":"☾";$("#theme-toggle").title=t(theme==="dark"?"light":"dark");$("#theme-toggle").setAttribute("aria-label",$("#theme-toggle").title);document.querySelector('meta[name="theme-color"]').content=theme==="dark"?"#111e1d":"#f5f8f7";}
function setLanguage(next){lang=next;setPref(KEY_LANG,next);refreshStatic();}
function mockQR(seed){
 // QR-style decoration only. Intentionally has NO actual payment payload,
 // no QR-standard finder patterns, and a visible DEMO NOT PAYABLE watermark.
 let cells="",size=17,hash=0;
 for(let i=0;i<seed.length;i++)hash=(Math.imul(hash,31)+seed.charCodeAt(i))|0;
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  let value=(Math.imul(x+3,92821)^Math.imul(y+7,68917)^hash^((x*y+19)*31))>>>0;
  if((value%7)<3 && !(x>4&&x<13&&y>6&&y<11))cells+='<rect x="'+(10+x*10)+'" y="'+(10+y*10)+'" width="8" height="8" rx="1" fill="#183d37"/>';
 }
 return '<svg viewBox="0 0 190 190" role="img" aria-label="QR tiruan DEMO, tidak dapat digunakan untuk membayar"><rect width="190" height="190" rx="7" fill="#fff"/>'+cells+'<rect x="16" y="74" width="158" height="43" rx="7" fill="#fff" stroke="#d3e0dc" stroke-width="2"/><text x="95" y="92" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="900" fill="#bb3431">DEMO</text><text x="95" y="107" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="800" fill="#bb3431">NOT PAYABLE</text><path d="M0 0 190 190" stroke="#b93430" stroke-width="2" opacity=".23"/></svg>';
}
function checkout(){
 if(!count())return;
 $("#order-name").textContent="";
 $("#checkout-subtotal").textContent=money(total());
 $("#name-input").value="";$("#note-input").value="";
 showModal("details");$("#name-input").focus();
}
function generateQR(){
 const name=$("#name-input").value.trim();
 if(!name){$("#name-input").focus();showToast(t("errorName"));return;}
 order={name:name.substring(0,80),note:$("#note-input").value.trim().substring(0,250),items:products.filter(p=>cart[p.id]).map(p=>({id:p.id,qty:cart[p.id],price:p.price})),amount:total(),id:"SC-DEMO-"+String(Date.now()).slice(-7)};
 $("#order-id").textContent=order.id;$("#qr-total").textContent=money(order.amount);
 $("#fake-qr").innerHTML=mockQR(order.id);
 showModal("payment");
}
function finish(){
 if(!order)return;
 $("#success-person").textContent=t("thanks")+order.name+"!";
 $("#success-order").textContent=order.id;
 cart={};save();renderCart();order=null;showModal("success");
}
document.addEventListener("click",event=>{
 const e=event.target.closest("button,[data-filter]");if(!e)return;
 const id=e.dataset.add;
 if(id){changeQty(id,1);showToast(nameOf(productById(id))+" "+t("toastAdded"));return;}
 if(e.dataset.dec){changeQty(e.dataset.dec,-1);return;}
 if(e.dataset.inc){changeQty(e.dataset.inc,1);return;}
 if(e.dataset.remove){delete cart[e.dataset.remove];save();renderCart();return;}
 if(e.hasAttribute("data-filter")){cat=e.dataset.filter;$$("[data-filter]").forEach(b=>b.setAttribute("aria-pressed",String(b===e)));renderProducts();return;}
 if(e.hasAttribute("data-language")){setLanguage(e.dataset.language);return;}
});
$("#search-input").addEventListener("input",e=>{query=e.target.value.trim().toLocaleLowerCase();renderProducts();});
$("#cart-open").addEventListener("click",openDrawer);
$("#mobile-cart-button").addEventListener("click",openDrawer);
$("#cart-close").addEventListener("click",closeDrawer);
$("#cart-overlay").addEventListener("click",closeDrawer);
$("#checkout-open").addEventListener("click",checkout);
$("#modal-close").addEventListener("click",closeModal);
$("#checkout-modal").addEventListener("click",e=>{if(e.target.id==="checkout-modal")closeModal();});
$("#checkout-form").addEventListener("submit",e=>{e.preventDefault();generateQR();});
$("#back-cart").addEventListener("click",openDrawer);
$("#simulate-payment").addEventListener("click",finish);
$("#new-order").addEventListener("click",()=>{closeModal();location.hash="#menu";});
$("#theme-toggle").addEventListener("click",()=>setTheme(theme==="dark"?"light":"dark"));
document.addEventListener("keydown",event=>{if(event.key==="Escape"){if($("#checkout-modal").classList.contains("open"))closeModal();else closeDrawer()}});
setTheme(theme);setLanguage(lang);
})();
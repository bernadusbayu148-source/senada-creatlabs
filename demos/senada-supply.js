/* Senada Supply — functional fictional storefront. No real order API or payments. */
(()=>{
"use strict";
const $=q=>document.querySelector(q), $$=q=>[...document.querySelectorAll(q)];
const CARTKEY="senada-supply-cart",WISHKEY="senada-supply-wishlist",LANGKEY="senada-language",THEMEKEY="senada-theme";
const data=[
{id:"arc",name:"ARC TEE",type:"tee",cat:"tees",price:189000,tag:"BEST SELLER",tile:"#dbe2da",colors:[["Ink","#2d3430"],["Stone","#d5d2c5"],["Moss","#61745d"]],sizes:["S","M","L","XL"],copy:["Kaos oversized berbahan katun dengan bahu jatuh dan bentuk clean.","Oversized cotton tee with dropped shoulders and a clean silhouette."]},
{id:"form",name:"FORM HOODIE",type:"hoodie",cat:"outer",price:389000,tag:"NEW DROP",tile:"#d9d8cf",colors:[["Ash","#b6b7af"],["Forest","#4d6250"],["Ink","#333a38"]],sizes:["S","M","L","XL"],copy:["Hoodie dengan potongan relaxed untuk layering sehari-hari.","Relaxed-fit hoodie for easy everyday layering."]},
{id:"ease",name:"EASE TROUSER",type:"pants",cat:"bottom",price:299000,tile:"#dce3db",colors:[["Olive","#67735b"],["Charcoal","#444d48"]],sizes:["S","M","L","XL"],copy:["Celana lurus dengan cutting yang nyaman dan rapi.","Comfortable straight-leg trousers with a polished fit."]},
{id:"canvas",name:"CANVAS TOTE",type:"bag",cat:"accessory",price:119000,tag:"ESSENTIAL",tile:"#eee7d9",colors:[["Natural","#d9c7ac"],["Ink","#303b34"]],sizes:["OS"],copy:["Tas kanvas minimal yang cocok dibawa ke mana saja.","A minimal canvas tote for everything you carry."]},
{id:"oxford",name:"RELAXED OXFORD",type:"shirt",cat:"tees",price:269000,tile:"#e7e6df",colors:[["Cloud","#e7e8e0"],["Blue","#8ca5b2"]],sizes:["S","M","L","XL"],copy:["Kemeja boxy yang bisa dipakai terbuka atau dikancing.","Boxy shirt to wear open or buttoned up."]},
{id:"studio",name:"STUDIO JACKET",type:"jacket",cat:"outer",price:459000,tag:"LIMITED",tile:"#e4e0d8",colors:[["Khaki","#9f9f7e"],["Black","#343936"]],sizes:["M","L","XL"],copy:["Jaket ringan dengan saku utilitas dan detail fungsional.","Lightweight jacket with utility pockets and practical details."]},
{id:"rib",name:"RIB TANK",type:"tee",cat:"tees",price:149000,tile:"#e8e5df",colors:[["Ivory","#e6dfd2"],["Graphite","#515954"]],sizes:["S","M","L"],copy:["Basic ribbed dengan tekstur lembut untuk layering.","Soft ribbed basic, ideal for layering."]},
{id:"daily",name:"DAILY SHORTS",type:"shorts",cat:"bottom",price:219000,tile:"#e5e5da",colors:[["Sage","#95a88c"],["Ink","#303a34"]],sizes:["S","M","L","XL"],copy:["Celana pendek kasual dengan pinggang elastis.","Casual shorts with an easy elastic waistband."]}
];
const tt={
id:{demo:"DEMO PORTOFOLIO · BRAND FIKTIF · TIDAK ADA TRANSAKSI NYATA",back:"← Kembali ke Senada Creatlabs",navShop:"Shop",navStory:"Cerita Brand",navNew:"Koleksi Baru",bag:"Bag",eyebrow:"THE EVERYDAY UNIFORM · DROP 01",heroTitle:"Wear it<br><em>your way.</em>",heroDesc:"Pakaian sehari-hari dengan karakter minimal, siluet santai, dan detail yang tetap menonjol.",heroBtn:"Lihat koleksi ↗",heroOne:"✳ Bebas dipadukan",heroTwo:"✳ Cari ukuranmu",strip1:"QUALITY IN THE DETAILS",strip2:"EASY TO STYLE",strip3:"MADE FOR YOUR EVERYDAY",collection:"CURATED COLLECTION",collectionTitle:"Good staples.<br>Better stories.",collectionDesc:"Pilih warna dan ukuran untuk setiap produk. Semua katalog, stok, dan harga di sini merupakan contoh.",all:"Semua",tees:"Tops",outer:"Outerwear",bottom:"Bottoms",accessory:"Accessories",saved:"♥ Wishlist",sortDefault:"Pilihan",sortLow:"Harga terendah",sortHigh:"Harga tertinggi",search:"Cari produk...",details:"Lihat detail & pilih ukuran ↗",lookEyebrow:"OUR APPROACH",lookTitle:"Less noise.<br>More you.",lookText:"Gaya yang terasa personal tanpa harus berlebihan. Ini adalah contoh bagaimana sebuah clothing brand dapat menyampaikan identitas dan koleksinya melalui website.",lookButton:"Lihat koleksi ↗",footerText:"Brand clothing fiktif — hanya untuk demonstrasi.",footerLink:"Dibuat oleh Senada Creatlabs ↗",bagTitle:"Keranjang belanja",subtotal:"Subtotal",estimatedTotal:"Total sementara",checkoutBtn:"Lanjut checkout demo →",bagDisclaimer:"Pembayaran dan pengiriman tidak nyata. Ini hanya simulasi website toko online.",productDetails:"Detail produk",edit:"THE EDIT",color:"Warna",size:"Ukuran",addBag:"Tambah ke keranjang ↗",checkoutExplain:"Isi data untuk melihat simulasi ringkasan pesanan. Tidak ada data yang dikirim.",name:"Nama pemesan *",address:"Alamat (simulasi) *",delivery:"Metode penerimaan",shipping:"Pengiriman contoh · Rp18.000",pickup:"Ambil di toko · Gratis",promo:"Kode promo (opsional)",checkoutWarning:"DEMO: tidak ada pembayaran, pemrosesan order, maupun pengiriman sesungguhnya.",placeOrder:"Selesaikan pesanan simulasi →",success:"Pesanan demo selesai!",successDesc:"Ini hanya simulasi. Tidak ada pembayaran diproses atau pesanan diteruskan ke penjual.",another:"Jelajahi lagi ↗",remove:"Hapus",emptyTitle:"Keranjang kosong",emptyDesc:"Cari produk favorit dan pilih ukuran untuk memulai.",noResults:"Tidak ada produk yang cocok dengan pencarian.",colorChoose:"Pilih warna",sizeChoose:"Pilih ukuran",bagAdded:"ditambahkan ke keranjang",savedToast:"Wishlist diperbarui",codeApplied:"Kode PLAY10 diterapkan (demo).",codeInvalid:"Kode tidak valid. Coba PLAY10.",deliveryCost:"Ongkir simulasi",discount:"Diskon promo",total:"Total",orderNumber:"Nomor pesanan demo",customer:"Pemesan",errorProduct:"Pilih produk terlebih dahulu.",dark:"Aktifkan mode gelap",light:"Aktifkan mode terang"},
en:{demo:"PORTFOLIO DEMO · FICTIONAL BRAND · NO REAL TRANSACTIONS",back:"← Back to Senada Creatlabs",navShop:"Shop",navStory:"Our Story",navNew:"New Arrivals",bag:"Bag",eyebrow:"THE EVERYDAY UNIFORM · DROP 01",heroTitle:"Wear it<br><em>your way.</em>",heroDesc:"Everyday essentials with a minimal attitude, relaxed silhouettes and a sense of personal style.",heroBtn:"Explore collection ↗",heroOne:"✳ Easy to style",heroTwo:"✳ Find your fit",strip1:"QUALITY IN THE DETAILS",strip2:"EASY TO STYLE",strip3:"MADE FOR YOUR EVERYDAY",collection:"CURATED COLLECTION",collectionTitle:"Good staples.<br>Better stories.",collectionDesc:"Pick a color and size. All items, prices and availability are fictional demo data.",all:"All",tees:"Tops",outer:"Outerwear",bottom:"Bottoms",accessory:"Accessories",saved:"♥ Wishlist",sortDefault:"Featured",sortLow:"Price: low to high",sortHigh:"Price: high to low",search:"Search items...",details:"View details & choose size ↗",lookEyebrow:"OUR APPROACH",lookTitle:"Less noise.<br>More you.",lookText:"Effortless personal style without the extras. This is an example of how a clothing label can express its identity and collections online.",lookButton:"Shop the edit ↗",footerText:"Fictional clothing label — for demonstration only.",footerLink:"Created by Senada Creatlabs ↗",bagTitle:"Your Bag",subtotal:"Subtotal",estimatedTotal:"Estimated total",checkoutBtn:"Demo checkout →",bagDisclaimer:"There are no real payments or deliveries. This is a storefront simulation.",productDetails:"Product details",edit:"THE EDIT",color:"Color",size:"Size",addBag:"Add to bag ↗",checkoutExplain:"Fill in this form to see a simulated order summary. No data is submitted.",name:"Customer name *",address:"Address (demo) *",delivery:"Delivery method",shipping:"Demo shipping · Rp18,000",pickup:"Store pickup · Free",promo:"Promo code (optional)",checkoutWarning:"DEMO: No real payments, order processing or deliveries take place.",placeOrder:"Complete demo order →",success:"Demo order complete!",successDesc:"This is only a simulation. No payments were processed and nothing was sent to a merchant.",another:"Explore more ↗",remove:"Remove",emptyTitle:"Your bag is empty",emptyDesc:"Explore the collection and pick a size to get started.",noResults:"No matching products found.",colorChoose:"Choose color",sizeChoose:"Choose size",bagAdded:"added to your bag",savedToast:"Wishlist updated",codeApplied:"PLAY10 code applied (demo).",codeInvalid:"Invalid code. Try PLAY10.",deliveryCost:"Demo shipping",discount:"Promo discount",total:"Total",orderNumber:"Demo order ID",customer:"Customer",errorProduct:"Choose an item first.",dark:"Switch to dark mode",light:"Switch to light mode"}
};
const pref=(key,alt)=>{try{return localStorage.getItem(key)||alt}catch(_){return alt}},savePref=(key,val)=>{try{localStorage.setItem(key,val)}catch(_){}};
let lang=pref(LANGKEY,"id")==="en"?"en":"id",theme=pref(THEMEKEY,"light")==="dark"?"dark":"light",category="all",search="",sort="featured",selected=null,choiceColor=0,choiceSize=null,cart={},favorites=new Set(),previousFocus=null,toastTimer;
try{const raw=JSON.parse(pref(CARTKEY,"{}"));if(raw&&typeof raw==="object"&&!Array.isArray(raw))for(const [key,qty] of Object.entries(raw)){const[id,size,index]=key.split("|");const p=data.find(p=>p.id===id);if(p&&p.sizes.includes(size)&&Number.isInteger(+index)&&p.colors[+index]&&Number.isInteger(qty)&&qty>0&&qty<=30)cart[key]=qty;}}catch(_){}
try{const raw=JSON.parse(pref(WISHKEY,"[]"));if(Array.isArray(raw))favorites=new Set(raw.filter(id=>data.some(p=>p.id===id)));}catch(_){}
const t=key=>tt[lang][key]||key;const idr=n=>"Rp"+Math.round(n).toLocaleString("id-ID");
const product=id=>data.find(p=>p.id===id);
const keyFor=(p,size,color)=>p.id+"|"+size+"|"+color;
function garment(p,color){
 const shape=p.type,fill=color||p.colors[0][1],stroke="#28362e";
 const base={tee:'<path d="M42 42 75 24 93 35h34l18-11 33 18 20 45-39 17-10-22-2 141H73L71 82l-10 22-39-17Z"/><path d="M93 35q17 29 34 0" fill="none" stroke="#ffffff55" stroke-width="5"/>',
 hoodie:'<path d="M80 25q30-19 60 0l31 16 24 50-41 16-10-28 3 139H73L76 79 65 107 24 91l24-50Z"/><path d="M80 25q6 58 30 58t30-58" fill="none" stroke="#26342d70" stroke-width="5"/><path d="M99 80v35m23-35v35" stroke="#e6e5da" stroke-width="3"/><path d="M83 154h54v24H83Z" fill="#ffffff15" stroke="#ffffff3b" stroke-width="2"/>',
 shirt:'<path d="M76 22 92 31h36l16-9 35 23 16 46-39 19-12-26 1 136H73L75 84l-12 26-39-19 16-46Z"/><path d="m92 31 18 31 18-31-18-11Z" fill="#fafbf555"/><path d="M110 62v156" fill="none" stroke="#25362b55" stroke-width="3"/><g fill="#f8f8eb"><circle cx="112" cy="91" r="2"/><circle cx="112" cy="120" r="2"/><circle cx="112" cy="149" r="2"/></g>',
 pants:'<path d="M66 29h90l-4 63-21 127h-38l17-127-8-4-12 131H52L67 93Z"/><path d="M66 45h90M110 45v47" stroke="#ffffff60" stroke-width="3" fill="none"/>',
 shorts:'<path d="M61 45h99l6 116-54 9-9-52-7 52-54-9Z"/><path d="M61 66h99M103 65v53" fill="none" stroke="#ffffff60" stroke-width="3"/>',
 jacket:'<path d="m77 23 23 15h21l23-15 35 20 22 47-43 21-12-29v141H74V82l-12 29-43-21 22-47Z"/><path d="m100 38 10 34 11-34M110 72v149" fill="none" stroke="#e9ede355" stroke-width="4"/><path d="M81 141h27v34H81Zm31 0h27v34h-27Z" fill="#ffffff2d" stroke="#ffffff65" stroke-width="2"/>',
 bag:'<path d="M51 68h116l-13 150H64Z"/><path d="M77 74V47q0-32 32-32t32 32v27" stroke="'+fill+'" stroke-width="14" fill="none"/><path d="M79 74V47q0-29 30-29t30 29v27" stroke="#ffffff67" stroke-width="3" fill="none"/>'};
 return '<svg viewBox="0 0 220 250" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><ellipse cx="110" cy="232" rx="83" ry="9" fill="#22372d" opacity=".13"/><g fill="'+fill+'" stroke="'+stroke+'" stroke-width="3" stroke-linejoin="round">'+base[shape]+'</g><path d="M91 190h39" stroke="#fafbf2" stroke-width="2" stroke-linecap="round" opacity=".55"/><text x="110" y="'+(shape==="pants"||shape==="shorts"?"78":"129")+'" text-anchor="middle" fill="'+(shape==="shirt"||shape==="bag"?"#3b4e3c":"#e8f0e8")+'" font-family="sans-serif" font-size="9" font-weight="bold" letter-spacing="2">S/S</text></svg>';
}
function renderProducts(){
 let items=data.filter(p=>(category==="all"||category===p.cat||(category==="saved"&&favorites.has(p.id)))&&(p.name.toLowerCase().includes(search)||p.copy[lang==="id"?0:1].toLowerCase().includes(search)));
 if(sort==="low")items.sort((a,b)=>a.price-b.price);if(sort==="high")items.sort((a,b)=>b.price-a.price);
 $("#product-grid").innerHTML=items.length?items.map(p=>'<article class="product"><div class="product-art" style="--tile:'+p.tile+'">'+garment(p)+ (p.tag?'<span class="tag">'+p.tag+'</span>':'')+'<button class="heart" type="button" data-wish="'+p.id+'" aria-label="Wishlist '+p.name+'" aria-pressed="'+favorites.has(p.id)+'">'+(favorites.has(p.id)?"♥":"♡")+'</button></div><div class="product-name"><strong>'+p.name+'</strong><span>'+idr(p.price)+'</span></div><p class="product-info">'+p.copy[lang==="id"?0:1]+'</p><button class="product-link" type="button" data-open="'+p.id+'">'+t("details")+'</button></article>').join(""):'<div class="empty-result">'+t("noResults")+'</div>';
}
const cartEntries=()=>Object.entries(cart).map(([key,qty])=>{const[id,size,ci]=key.split("|");const p=product(id);return{key,p,size,ci:+ci,qty}}).filter(x=>x.p&&x.qty>0);
const subtotal=()=>cartEntries().reduce((sum,x)=>sum+x.p.price*x.qty,0);
const count=()=>cartEntries().reduce((sum,x)=>sum+x.qty,0);
function renderBag(){
 $("#bag-count").textContent=count();
 const lines=cartEntries();
 $("#bag-items").innerHTML=lines.length?lines.map(x=>'<div class="cart-item"><div class="cart-thumb" style="--tile:'+x.p.tile+'">'+garment(x.p,x.p.colors[x.ci][1])+'</div><div><h3>'+x.p.name+'</h3><p>'+x.size+' / '+x.p.colors[x.ci][0]+'</p><div class="qty"><button type="button" data-less="'+x.key+'" aria-label="Decrease quantity">−</button><span>'+x.qty+'</span><button type="button" data-more="'+x.key+'" aria-label="Increase quantity">+</button></div></div><div class="cart-price">'+idr(x.p.price*x.qty)+'<button class="delete" type="button" data-remove="'+x.key+'">'+t("remove")+'</button></div></div>').join(""):'<div class="cart-empty">◡<strong>'+t("emptyTitle")+'</strong>'+t("emptyDesc")+'</div>';
 $("#bag-subtotal").textContent=idr(subtotal());$("#bag-total").textContent=idr(subtotal());$("#to-checkout").disabled=!lines.length;
}
function toast(msg){const el=$("#toast");clearTimeout(toastTimer);el.textContent=msg;el.classList.add("show");toastTimer=setTimeout(()=>el.classList.remove("show"),2100)}
function persistCart(){savePref(CARTKEY,JSON.stringify(cart));renderBag();}
function changeQty(key,d){if(!cart[key])return;cart[key]+=d;if(cart[key]<=0)delete cart[key];else if(cart[key]>30)cart[key]=30;persistCart();}
function openBag(){closeModal(false);$("#scrim").classList.add("open");$("#bag-drawer").classList.add("open");$("#bag-drawer").setAttribute("aria-hidden","false");document.body.classList.add("locked");$("#bag-close").focus();}
function closeBag(restore=true){$("#scrim").classList.remove("open");$("#bag-drawer").classList.remove("open");$("#bag-drawer").setAttribute("aria-hidden","true");document.body.classList.remove("locked");if(restore)$("#bag-open").focus()}
function openModal(screen){closeBag(false);previousFocus=document.activeElement;$("#modal").classList.add("open");$("#modal").setAttribute("aria-hidden","false");document.body.classList.add("locked");showScreen(screen);$("#modal-close").focus()}
function showScreen(screen){["detail","checkout","success"].forEach(x=>$("#"+x+"-screen").hidden=x!==screen);$("#dialog-title").textContent=screen==="detail"?t("productDetails"):screen==="checkout"?t("checkoutBtn"):t("success")}
function closeModal(restore=true){const open=$("#modal").classList.contains("open");$("#modal").classList.remove("open");$("#modal").setAttribute("aria-hidden","true");document.body.classList.remove("locked");if(open&&restore) (previousFocus?.isConnected?previousFocus:$("#bag-open")).focus()}
function openDetails(id){selected=product(id);if(!selected)return;choiceColor=0;choiceSize=selected.sizes.includes("M")?"M":selected.sizes[0];renderDetails();openModal("detail")}
function renderDetails(){if(!selected)return;$("#detail-name").textContent=selected.name;$("#detail-price").textContent=idr(selected.price);$("#detail-desc").textContent=selected.copy[lang==="id"?0:1];$("#detail-art").innerHTML=garment(selected,selected.colors[choiceColor][1]);$("#color-options").innerHTML=selected.colors.map((c,i)=>'<button type="button" data-color="'+i+'" style="background:'+c[1]+'" aria-label="'+c[0]+'" title="'+c[0]+'" aria-pressed="'+(choiceColor===i)+'"></button>').join("");$("#size-options").innerHTML=selected.sizes.map(size=>'<button type="button" data-size="'+size+'" aria-pressed="'+(size===choiceSize)+'">'+size+'</button>').join("")}
function addBag(){if(!selected||!choiceSize)return;const key=keyFor(selected,choiceSize,choiceColor);cart[key]=Math.min((cart[key]||0)+1,30);persistCart();const msg=selected.name+" "+t("bagAdded");closeModal();toast(msg);}
function shipping(){return $("#delivery").value==="shipping"?18000:0}
function discount(){return $("#promo").value.trim().toUpperCase()==="PLAY10"?Math.min(30000,Math.round(subtotal()*.1)):0}
function renderSummary(){
 const sub=subtotal(),fee=shipping(),disc=discount();
 $("#checkout-summary").innerHTML='<div class="line-total"><span>'+t("subtotal")+'</span><strong>'+idr(sub)+'</strong></div><div class="line-total"><span>'+t("deliveryCost")+'</span><strong>'+idr(fee)+'</strong></div><div class="line-total"><span>'+t("discount")+'</span><strong>− '+idr(disc)+'</strong></div><div class="line-total big"><span>'+t("total")+'</span><strong>'+idr(sub+fee-disc)+'</strong></div>';
 const entered=$("#promo").value.trim().toUpperCase();$("#promo-status").textContent=entered?(entered==="PLAY10"?t("codeApplied"):t("codeInvalid")):"";
}
function checkout(){if(!count())return;$("#checkout-form").reset();$("#promo").value="";renderSummary();openModal("checkout")}
function finishCheckout(event){event.preventDefault();if(!$("#checkout-form").reportValidity())return;const name=$("#buyer-name").value.trim();if(!name)return;const code="SS-DEMO-"+String(Date.now()).slice(-7);cart={};persistCart();$("#success-id").textContent=t("orderNumber")+": "+code+" · "+t("customer")+": "+name.slice(0,80);showScreen("success")}
function translate(){
 document.documentElement.lang=lang;
 $$("[data-t]").forEach(el=>{el.textContent=t(el.dataset.t)});
 $$("[data-t-html]").forEach(el=>{el.innerHTML=t(el.dataset.tHtml)});
 $$("[data-lang]").forEach(el=>el.setAttribute("aria-pressed",String(el.dataset.lang===lang)));
 $("#product-search").placeholder=t("search");$("#product-search").setAttribute("aria-label",t("search"));
 $("#theme-toggle").setAttribute("aria-label",t(theme==="dark"?"light":"dark"));
 $("#sort").querySelectorAll("option[data-t]").forEach(el=>el.textContent=t(el.dataset.t));
 $$("[data-filter]").forEach(el=>el.setAttribute("aria-pressed",String(el.dataset.filter===category)));
 renderProducts();renderBag();if(selected&&!$("#detail-screen").hidden)renderDetails();
 if(!$("#checkout-screen").hidden)renderSummary();
}
function setTheme(next){theme=next;document.documentElement.dataset.theme=next;savePref(THEMEKEY,next);$("#theme-toggle").textContent=next==="dark"?"☀":"☾";$("#theme-toggle").setAttribute("aria-label",t(next==="dark"?"light":"dark"));document.querySelector('meta[name="theme-color"]').content=next==="dark"?"#151e17":"#f7f6f1"}
document.addEventListener("click",ev=>{
 const el=ev.target.closest("button");if(!el)return;
 if(el.dataset.open){openDetails(el.dataset.open);return}
 if(el.dataset.wish){favorites.has(el.dataset.wish)?favorites.delete(el.dataset.wish):favorites.add(el.dataset.wish);savePref(WISHKEY,JSON.stringify([...favorites]));renderProducts();toast(t("savedToast"));return}
 if(el.dataset.filter){category=el.dataset.filter;$$("[data-filter]").forEach(x=>x.setAttribute("aria-pressed",String(x===el)));renderProducts();return}
 if(el.dataset.lang){lang=el.dataset.lang;savePref(LANGKEY,lang);translate();return}
 if(el.dataset.color!==undefined){choiceColor=Number(el.dataset.color);renderDetails();return}
 if(el.dataset.size){choiceSize=el.dataset.size;renderDetails();return}
 if(el.dataset.more){changeQty(el.dataset.more,1);return}
 if(el.dataset.less){changeQty(el.dataset.less,-1);return}
 if(el.dataset.remove){delete cart[el.dataset.remove];persistCart();}
});
$("#product-search").addEventListener("input",e=>{search=e.target.value.trim().toLowerCase();renderProducts()});
$("#sort").addEventListener("change",e=>{sort=e.target.value;renderProducts()});
$("#bag-open").addEventListener("click",openBag);
$("#bag-close").addEventListener("click",()=>closeBag());
$("#scrim").addEventListener("click",()=>closeBag());
$("#modal-close").addEventListener("click",()=>closeModal());
$("#modal").addEventListener("click",e=>{if(e.target===$("#modal"))closeModal()});
$("#detail-add").addEventListener("click",addBag);
$("#to-checkout").addEventListener("click",checkout);
$("#promo").addEventListener("input",renderSummary);
$("#delivery").addEventListener("change",renderSummary);
$("#checkout-form").addEventListener("submit",finishCheckout);
$("#order-again").addEventListener("click",()=>{closeModal();window.location.hash="#shop"});
$("#theme-toggle").addEventListener("click",()=>setTheme(theme==="dark"?"light":"dark"));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){if($("#modal").classList.contains("open"))closeModal();else if($("#bag-drawer").classList.contains("open"))closeBag()}});
$("#hero-graphic").innerHTML=garment(data[5],data[5].colors[0][1]);
$("#look-graphic").innerHTML=garment(data[1],data[1].colors[1][1]);
setTheme(theme);translate();
})();

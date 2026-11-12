/* Real stock photography enhancements for fictional demo websites.
 * Source: https://unsplash.com/license (Unsplash License, free personal/commercial use).
 * Images illustrate possible products, people and environments; no branded product
 * or portrayed business/person is claimed to be Senada's actual inventory/team.
 * When a remote photo is unavailable, the original CSS/SVG/emoji art remains.
 */
(()=>{
"use strict";
const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
const page=document.body?.dataset.page;
if(!["coffee","bloom","prime","supply"].includes(page))return;
const file=(id,w=900)=>"https://images.unsplash.com/"+id+"?auto=format&fit=crop&w="+w+"&q=78";
const ASSETS={
 coffee:{
  hero:["photo-1495474472287-4d71bcdd2085","Suasana meja kopi dengan beberapa minuman"],
  story:["photo-1511920170033-f8396924c348","Cangkir kopi di meja"],
  products:{
   latte:["photo-1509042239860-f550ce710b93","Secangkir kopi latte"],
   aren:["photo-1461023058943-07fcbe16d735","Kopi dingin dalam gelas"],
   matcha:["photo-1515823064-d6e0c04616a7","Minuman teh hijau"],
   americano:["photo-1511920170033-f8396924c348","Kopi hitam"],
   choco:["photo-1570968915860-54d5c301fa9f","Minuman cokelat"],
   croissant:["photo-1555507036-ab1f4038808a","Croissant panggang"],
   toast:["photo-1525351484163-7529414344d8","Sajian sarapan panggang"],
   berry:["photo-1536256263959-770b48d82b0a","Minuman segar dengan buah beri"]
  }
 },
 bloom:{
  hero:["photo-1608248543803-ba4f8c70ae0b","Produk perawatan kulit di atas latar minimalis"],
  products:[
   ["photo-1620916566398-39f1143ab7be","Botol serum skincare"],
   ["photo-1611930022073-b7a4ba5fcccd","Produk kosmetik dan skincare"],
   ["photo-1556228578-8c89e6adf883","Produk kecantikan dan perawatan kulit"]
  ],
  story:["photo-1556228720-1957be83d304","Produk dan rutinitas perawatan diri"]
 },
 prime:{
  hero:["photo-1486406146926-c627a92ad1ab","Gedung perkantoran modern"],
  cases:[
   ["photo-1497366216548-37526070297c","Interior ruang kerja modern"],
   ["photo-1521737711867-e3b97375f902","Orang-orang berdiskusi dan berkolaborasi"],
   ["photo-1497366754035-f200968a6e72","Ruang kerja kantor kontemporer"]
  ]
 },
 supply:{
  hero:["photo-1539109136881-3be0616acf4b","Fotografi editorial busana"],
  look:["photo-1515886657613-9f3515b0c78f","Inspirasi gaya fashion sehari-hari"],
  products:{
   arc:["photo-1521572163474-6864f9cf17ab","Kaos basic"],
   form:["photo-1551488831-00ddcb6c6bd3","Pakaian hoodie"],
   ease:["photo-1542272604-787c3835535d","Celana fashion"],
   canvas:["photo-1547949003-9792a18a2601","Tas kanvas fashion"],
   oxford:["photo-1598032895397-b9472444bf93","Kemeja kasual"],
   studio:["photo-1591047139829-d91aecb6caea","Jaket kasual"],
   rib:["photo-1529139574466-a303027c1d8b","Inspirasi koleksi atasan"],
   daily:["photo-1503342217505-b0a15ec3261c","Pakaian santai"]
  }
 }
};
function decorate(host,item,important=false){
 if(!host||!item||host.querySelector(":scope > img.demo-real-photo"))return;
 const image=document.createElement("img"),shade=document.createElement("span");
 image.className="demo-real-photo";image.alt=item[1];image.decoding="async";
 image.loading=important?"eager":"lazy";if(important)image.fetchPriority="high";
 shade.className="demo-photo-shade";shade.setAttribute("aria-hidden","true");
 host.classList.add("demo-photo-host");
 // Set handlers before src: no unverified photo replaces existing artwork.
 image.addEventListener("load",()=>{if(image.naturalWidth>=100)host.classList.add("has-real-photo");else fail();},{once:true});
 function fail(){image.remove();shade.remove();host.classList.remove("has-real-photo");host.dataset.demoPhotoFailed="true";}
 image.addEventListener("error",fail,{once:true});
 // Don't retry a broken URL on every product filter rerender.
 if(host.dataset.demoPhotoFailed==="true")return;
 host.prepend(image);host.append(shade);
 image.src=file(item[0],important?1300:800);
}
function products(){
 if(page==="coffee"){
  $$("#product-grid .product").forEach(card=>{
   const id=card.querySelector("[data-add]")?.dataset.add;
   decorate(card.querySelector(".product-art"),ASSETS.coffee.products[id]);
  });
  $$("#cart-list .cart-line").forEach(line=>{
   const id=line.querySelector("[data-inc]")?.dataset.inc;
   decorate(line.querySelector(".cart-thumb"),ASSETS.coffee.products[id]);
  });
 }else if(page==="supply"){
  $$("#product-grid .product").forEach(card=>{
   const id=card.querySelector("[data-open]")?.dataset.open;
   decorate(card.querySelector(".product-art"),ASSETS.supply.products[id]);
  });
  // Product lookup is stable even if a shopper filters the visible collection.
  const names={"ARC TEE":"arc","FORM HOODIE":"form","EASE TROUSER":"ease","CANVAS TOTE":"canvas","RELAXED OXFORD":"oxford","STUDIO JACKET":"studio","RIB TANK":"rib","DAILY SHORTS":"daily"};
  const detailKey=names[$("#detail-name")?.textContent?.trim()];
  if(detailKey)decorate($("#detail-art"),ASSETS.supply.products[detailKey]);
  $("#bag-items .cart-item").forEach(card=>{
   const id=names[card.querySelector("h3")?.textContent?.trim()];
   decorate(card.querySelector(".cart-thumb"),ASSETS.supply.products[id]);
  });
 }
}
function staticPhotos(){
 if(page==="coffee"){
  decorate($(".hero-visual"),ASSETS.coffee.hero,true);
  decorate($(".story-photo"),ASSETS.coffee.story);
 }else if(page==="bloom"){
  decorate($(".stage"),ASSETS.bloom.hero,true);
  $$("#koleksi .product-art").forEach((node,i)=>decorate(node,ASSETS.bloom.products[i]));
  decorate($(".story-art"),ASSETS.bloom.story);
 }else if(page==="prime"){
  decorate($(".hero-scene"),ASSETS.prime.hero,true);
  $$(".cases .case-art").forEach((node,i)=>decorate(node,ASSETS.prime.cases[i]));
 }else if(page==="supply"){
  decorate($(".hero-art"),ASSETS.supply.hero,true);
  decorate($(".look-photo"),ASSETS.supply.look);
 }
}
function credit(){
 const footer=$("footer");if(!footer)return;
 const section=document.createElement("aside");section.className="demo-photo-credit wrap";
 section.setAttribute("aria-label","Kredit foto demo");
 const text=document.createElement("span");
 text.textContent="Foto stok ilustratif / Illustrative stock photos · ";
 const link=document.createElement("a");link.href="https://unsplash.com/license";
 link.target="_blank";link.rel="noopener noreferrer";link.textContent="Unsplash License";
 const note=document.createElement("span");note.textContent=" · Produk, lokasi usaha, tim, dan studi kasus yang ditampilkan bersifat fiktif.";
 section.append(text,link,note);footer.before(section);
}
staticPhotos();products();credit();
const container=page==="coffee"?$("#product-grid"):page==="supply"?$("#product-grid"):null;
if(container)new MutationObserver(products).observe(container,{childList:true});
const more=page==="coffee"?$("#cart-list"):page==="supply"?$("#bag-items"):null;
if(more)new MutationObserver(products).observe(more,{childList:true});
if(page==="supply"){
 const detail=$("#detail-art");if(detail)new MutationObserver(products).observe(detail,{childList:true});
}
})();
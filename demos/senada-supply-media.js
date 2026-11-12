/* Senada Supply — coherent product imagery, independent from shared demo photo script.
 * Product pictures are editorial stock references, not real Senada Supply inventory.
 * Product ID (not visual position or sort index) determines the photographed item.
 * Photos stay hidden until verified loaded. Stock imagery remains illustrative.
 */
(()=>{
  "use strict";
  if(document.body?.dataset.page!=="supply")return;
  const $=selector=>document.querySelector(selector);
  const $$=selector=>Array.from(document.querySelectorAll(selector));

  const photos={
    arc:{ids:["photo-1521572163474-6864f9cf17ab","photo-1621347311229-fd6e0b5a75e8"],alt:"Kaos putih polos, referensi ARC TEE",position:"50% 38%"},
    form:{ids:["photo-1618354691373-d851c5c3a990","photo-1620799140408-edc6dcb6d633"],alt:"Hoodie kasual, referensi FORM HOODIE",position:"50% 45%"},
    ease:{ids:["photo-1594633312681-425c7b97ccd1","photo-1542272604-787c3835535d"],alt:"Celana panjang, referensi EASE TROUSER",position:"50% 48%"},
    canvas:{ids:["photo-1544816155-12df9643f363"],alt:"Tas tote kanvas, referensi CANVAS TOTE",position:"50% 49%"},
    oxford:{ids:["photo-1598032895397-b9472444bf93"],alt:"Kemeja kasual, referensi RELAXED OXFORD",position:"50% 45%"},
    studio:{ids:["photo-1591047139829-d91aecb6caea"],alt:"Jaket kasual, referensi STUDIO JACKET",position:"50% 43%"},
    rib:{ids:["photo-1593841446197-0ff7e913ab1e","photo-1556632973-57d167636a3f"],alt:"Atasan tanpa lengan, referensi RIB TANK",position:"50% 35%"},
    daily:{ids:["photo-1603469278809-b2139cf2958d","photo-1503342217505-b0a15ec3261c"],alt:"Pakaian dengan celana pendek, referensi DAILY SHORTS",position:"50% 45%"}
  };
  const byName={
    "ARC TEE":"arc","FORM HOODIE":"form","EASE TROUSER":"ease",
    "CANVAS TOTE":"canvas","RELAXED OXFORD":"oxford","STUDIO JACKET":"studio",
    "RIB TANK":"rib","DAILY SHORTS":"daily"
  };
  const photoURL=(id,size)=>"https://images.unsplash.com/"+id+"?auto=format&fit=crop&w="+size+"&h="+Math.round(size*1.25)+"&q=80";
  const staticPhotoURL=(id,size)=>"https://images.unsplash.com/"+id+"?auto=format&fit=crop&w="+size+"&q=80";
  const loaded=new Map();

  function attach(host,info,identity,options={}){
    if(!host||!info||!info.ids?.length)return;
    const size=options.size||720;
    const sig=identity+"-"+size;
    if(host.dataset.supplyPhotoId===sig)return;
    const old=host.querySelector(":scope > .supply-real-photo");if(old)old.remove();
    host.dataset.supplyPhotoId=sig;
    host.classList.add("supply-photo-host");
    host.classList.remove("supply-has-photo","supply-photo-failed");
    const img=document.createElement("img");
    img.className="supply-real-photo";
    img.alt=info.alt;
    img.width=size;
    img.height=Math.round(size*1.25);
    img.decoding="async";
    img.loading=options.important?"eager":"eager";
    img.style.objectPosition=info.position||"50% 50%";
    host.prepend(img);
    let attempt=0;
    const loadNext=()=>{
      if(attempt>=info.ids.length){
        host.classList.add("supply-photo-failed");
        host.classList.remove("supply-has-photo");
        img.remove();
        return;
      }
      const sourceId=info.ids[attempt++];
      const src=photoURL(sourceId,size);
      img.src=src;
      if(loaded.get(src)==="ok"&&img.complete&&img.naturalWidth>80){
        host.classList.add("supply-has-photo");
      }
    };
    img.onload=()=>{
      if(img.naturalWidth<100){loadNext();return;}
      loaded.set(img.currentSrc||img.src,"ok");
      host.classList.remove("supply-photo-failed");
      host.classList.add("supply-has-photo");
    };
    img.onerror=()=>loadNext();
    loadNext();
  }

  function refreshProducts(){
    $$("#product-grid .product").forEach((card,index)=>{
      const id=card.querySelector("[data-open]")?.dataset.open;
      const host=card.querySelector(".product-art");
      attach(host,photos[id],id,{size:720,important:index<4});
    });
  }
  function refreshDetail(){
    const host=$("#detail-art");
    const name=$("#detail-name")?.textContent?.trim();
    const id=byName[name];
    if(host&&id)attach(host,photos[id],id,{size:880,important:true});
  }
  function refreshBag(){
    $$("#bag-items .cart-item").forEach(item=>{
      const id=byName[item.querySelector("h3")?.textContent?.trim()];
      attach(item.querySelector(".cart-thumb"),photos[id],id,{size:360,important:true});
    });
  }
  function staticPhotos(){
    const hero=$(".hero-art"),look=$(".look-photo");
    attach(hero,{ids:["photo-1539109136881-3be0616acf4b"],alt:"Inspirasi editorial fashion Senada Supply",position:"50% 37%"},"editorial-hero",{size:1200,important:true});
    attach(look,{ids:["photo-1515886657613-9f3515b0c78f"],alt:"Inspirasi gaya fashion sehari-hari",position:"50% 43%"},"editorial-look",{size:900,important:false});
  }
  function preloadProductImages(){
    // Re-sorting recreates cards. Decoding their files in advance prevents
    // the apparent photo-to-illustration swap shown during quick sort changes.
    Object.values(photos).forEach(info=>{
      const prefetch=new Image();
      const src=photoURL(info.ids[0],720);
      prefetch.onload=()=>{if(prefetch.naturalWidth>100)loaded.set(src,"ok");};
      prefetch.src=src;
    });
  }
  staticPhotos();
  refreshProducts();
  refreshDetail();
  refreshBag();
  const grid=$("#product-grid"),bag=$("#bag-items"),detail=$("#detail-art");
  if(grid)new MutationObserver(refreshProducts).observe(grid,{childList:true});
  if(bag)new MutationObserver(refreshBag).observe(bag,{childList:true});
  if(detail)new MutationObserver(refreshDetail).observe(detail,{childList:true});
  preloadProductImages();
})();
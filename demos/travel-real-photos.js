/* Senada Journey: verified Wikimedia Commons destination photography.
   All original illustrations remain as fallbacks if externally served photos fail. */
(()=>{
  "use strict";
  const PHOTOS=[
  {
    "id": "bali",
    "location": "Bali",
    "filename": "Cliff_at_Uluwatu_temple,_Bali.jpg",
    "author": "Emma THERY",
    "license": "CC BY-SA 4.0",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/20/Cliff_at_Uluwatu_temple,_Bali.jpg/960px-Cliff_at_Uluwatu_temple,_Bali.jpg",
    "altID": "Tebing Uluwatu di Bali",
    "altEN": "Uluwatu cliffs, Bali"
  },
  {
    "id": "komodo",
    "location": "Labuan Bajo",
    "filename": "Padar_Island_in_Komodo_National_Park.jpg",
    "author": "Lydia Kristiani",
    "license": "CC BY-SA 4.0",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Padar_Island_in_Komodo_National_Park.jpg/960px-Padar_Island_in_Komodo_National_Park.jpg",
    "altID": "Pulau Padar di kawasan Labuan Bajo",
    "altEN": "Padar Island near Labuan Bajo"
  },
  {
    "id": "bromo",
    "location": "Bromo",
    "filename": "Mount_Bromo_After_Sunrise.jpg",
    "author": "Tahu Tebu",
    "license": "CC BY-SA 4.0",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ea/Mount_Bromo_After_Sunrise.jpg/960px-Mount_Bromo_After_Sunrise.jpg",
    "altID": "Lanskap Gunung Bromo setelah matahari terbit",
    "altEN": "Mount Bromo after sunrise"
  },
  {
    "id": "yogya",
    "location": "Yogyakarta",
    "filename": "Prambanan_Temple_Yogyakarta.jpg",
    "author": "manggaliretno368",
    "license": "CC0 1.0",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/Prambanan_Temple_Yogyakarta.jpg/960px-Prambanan_Temple_Yogyakarta.jpg",
    "altID": "Candi Prambanan di Yogyakarta",
    "altEN": "Prambanan Temple, Yogyakarta"
  },
  {
    "id": "raja",
    "location": "Raja Ampat",
    "filename": "Piaynemo_Raja_Ampat.jpg",
    "author": "Rolandandika",
    "license": "CC BY-SA 4.0",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/Piaynemo_Raja_Ampat.jpg/960px-Piaynemo_Raja_Ampat.jpg",
    "altID": "Kepulauan Piaynemo di Raja Ampat",
    "altEN": "Piaynemo Islands, Raja Ampat"
  },
  {
    "id": "bandung",
    "location": "Bandung",
    "filename": "Kawah_Putih_in_Bandung.jpg",
    "author": "Gilangsmntr",
    "license": "CC BY-SA 4.0",
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f1/Kawah_Putih_in_Bandung.jpg/960px-Kawah_Putih_in_Bandung.jpg",
    "altID": "Kawah Putih di Bandung",
    "altEN": "Kawah Putih lake, Bandung"
  }
];
  const $=s=>document.querySelector(s);
  const loc=()=>document.documentElement.lang==="en"?"en":"id";
  const source=p=>"https://commons.wikimedia.org/wiki/File:"+encodeURIComponent(p.filename);
  const licenseURL=p=>p.license==="CC0 1.0"?"https://creativecommons.org/publicdomain/zero/1.0/":"https://creativecommons.org/licenses/by-sa/4.0/";
  const title=p=>loc()==="id"?p.altID:p.altEN;
  function identify(text){return PHOTOS.find(p=>text.includes(p.location));}
  function hydrateImage(image,onReady,onFail){
    const good=()=>{if(image.naturalWidth>50){image.hidden=false;onReady();}else bad();};
    const bad=()=>{image.remove();if(onFail)onFail();};
    image.addEventListener("load",good,{once:true});
    image.addEventListener("error",bad,{once:true});
    if(image.getAttribute("src")&&image.complete){if(image.naturalWidth>0)good();else bad();}
  }
  function updateCardPhotos(){
    document.querySelectorAll(".trip-art").forEach(card=>{
      if(card.querySelector(".trip-photo"))return;
      const p=identify(card.querySelector(".location")?.textContent||"");if(!p)return;
      const img=document.createElement("img");img.className="trip-photo";img.alt=title(p);
      img.loading="lazy";img.decoding="async";img.hidden=true;img.dataset.photoId=p.id;
      const shade=document.createElement("span");shade.className="trip-photo-shade";shade.setAttribute("aria-hidden","true");
      const credit=document.createElement("a");credit.className="photo-credit";credit.href=source(p);
      credit.target="_blank";credit.rel="noopener noreferrer";credit.textContent="© "+p.author;credit.title=p.author+" · "+p.license;
      credit.hidden=true;
      card.append(img,shade,credit);
      hydrateImage(img,()=>{card.classList.add("has-real-photo");credit.hidden=false;},()=>{shade.remove();credit.remove();card.classList.remove("has-real-photo");});
      img.src=p.url;
    });
  }
  function updateDetailPhoto(){
    const scene=$("#detail-scene");if(!scene||scene.querySelector(".detail-photo"))return;
    const p=identify($("#detail-region")?.textContent||"");if(!p)return;
    scene.classList.remove("has-real-photo");
    const img=document.createElement("img");
    img.className="detail-photo";img.alt=title(p);img.dataset.photoId=p.id;
    img.decoding="async";img.hidden=true;scene.append(img);
    hydrateImage(img,()=>scene.classList.add("has-real-photo"),()=>scene.classList.remove("has-real-photo"));
    img.src=p.url;
  }
  function installHero(){
    const hero=$(".hero");if(!hero)return;
    const p=PHOTOS.find(x=>x.id==="raja");const img=document.createElement("img");
    img.id="hero-photo";img.className="hero-photo";img.alt=title(p);img.dataset.photoId=p.id;
    img.decoding="async";img.fetchPriority="high";img.hidden=true;
    const credit=document.createElement("a");credit.className="hero-photo-credit";credit.href=source(p);
    credit.target="_blank";credit.rel="noopener noreferrer";credit.textContent="Foto: "+p.author+" · "+p.license;
    hero.append(img,credit);
    hydrateImage(img,()=>hero.classList.add("has-real-photo"),()=>{credit.remove();hero.classList.remove("has-real-photo");});
    img.src=p.url;
  }
  function installCredits(){
    const footer=$(".footer");if(!footer)return;
    const section=document.createElement("section");section.className="photo-credits";
    section.innerHTML='<div class="wrap"><details><summary id="photo-credits-title"></summary><ul id="photo-credits-list"></ul><p class="photo-note" id="photo-credits-note"></p></details></div>';
    footer.before(section);
    const ul=section.querySelector("ul");
    PHOTOS.forEach(p=>{
      const li=document.createElement("li");
      const b=document.createElement("strong");b.textContent=p.location;
      const by=document.createTextNode(" — ");
      const photographer=document.createElement("a");photographer.href=source(p);photographer.target="_blank";
      photographer.rel="noopener noreferrer";photographer.textContent=p.author;
      const separator=document.createTextNode(" · ");
      const license=document.createElement("a");license.href=licenseURL(p);license.target="_blank";
      license.rel="noopener noreferrer";license.textContent=p.license;
      li.append(b,by,photographer,separator,license);ul.appendChild(li);
    });
    translateCredits();
  }
  function translateCredits(){
    const isID=loc()==="id";
    const summary=$("#photo-credits-title");if(summary)summary.textContent=isID?"Kredit foto destinasi":"Destination photo credits";
    const note=$("#photo-credits-note");
    if(note)note.textContent=isID?"Foto destinasi asli dari Wikimedia Commons. Tampilan kartu memotong foto sesuai rasio bingkai. Hak cipta dan lisensi masing-masing mengikuti sumber asli; seluruh paket tetap fiktif.":"Authentic destination photos from Wikimedia Commons. Images are cropped to fit card proportions. Copyright and license details follow each original source; travel packages remain fictional.";
    document.querySelectorAll("[data-photo-id]").forEach(img=>{const p=PHOTOS.find(p=>p.id===img.dataset.photoId);if(p)img.alt=title(p);});
  }
  const trips=$("#trip-grid"),scene=$("#detail-scene");
  if(trips){new MutationObserver(updateCardPhotos).observe(trips,{childList:true});updateCardPhotos();}
  if(scene){new MutationObserver(updateDetailPhoto).observe(scene,{childList:true});updateDetailPhoto();}
  new MutationObserver(translateCredits).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
  installHero();installCredits();
})();

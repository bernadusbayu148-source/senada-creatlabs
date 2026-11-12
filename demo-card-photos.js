/* Photographic portfolio previews; published demos remain separate visual identities.
   All product, fashion, office and coffee photos are illustrative stock imagery. */
(()=>{
"use strict";
const images={
 "Senada Coffee":"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80",
 "Senada Bloom":"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1000&q=80",
 "Senada Prime":"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
 "Senada Supply":"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80",
 "Senada Journey":"https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/Piaynemo_Raja_Ampat.jpg/960px-Piaynemo_Raja_Ampat.jpg"
};
document.querySelectorAll("#work-slider .work-card").forEach(card=>{
 const name=card.querySelector("h3")?.textContent?.trim();
 const src=images[name],art=card.querySelector(".work-art");if(!src||!art)return;
 const img=document.createElement("img");img.className="demo-preview-photo";
 img.alt="";img.loading="lazy";img.decoding="async";
 const shade=document.createElement("span");shade.className="demo-preview-shade";shade.setAttribute("aria-hidden","true");
 img.onload=()=>{if(img.naturalWidth>100){art.classList.add("has-real-photo");art.append(shade);}else img.remove();};
 img.onerror=()=>{img.remove();shade.remove();art.classList.remove("has-real-photo");};
 art.prepend(img);img.src=src;
});
})();
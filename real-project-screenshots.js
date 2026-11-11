/* Loads real homepage screenshots from public screenshot services.
   If screenshots are unavailable or blocked, keep the existing illustrated cards. */
(() => {
  "use strict";
  const screenshotImages=[...document.querySelectorAll("img.real-site-screenshot[data-screenshot-url]")];
  if(!screenshotImages.length)return;
  for(const img of screenshotImages){
    const original=img.getAttribute("data-screenshot-url");
    let site;
    try{site=new URL(original);if(site.protocol!=="https:")continue;}
    catch(_){continue;}
    const encoded=encodeURIComponent(site.href);
    const providers=[
      "https://s.wordpress.com/mshots/v1/"+encoded+"?w=1200&h=760",
      "https://image.thum.io/get/width/1200/crop/760/noanimate/"+site.href
    ];
    let index=0;
    const tryProvider=()=>{
      if(index>=providers.length){img.removeAttribute("src");return;}
      img.src=providers[index++];
    };
    img.addEventListener("load",()=>{
      // Some providers reply with tiny placeholder icons on failure.
      if(img.naturalWidth<500||img.naturalHeight<240){
        tryProvider();
        return;
      }
      img.parentElement.classList.add("has-homepage-screenshot");
    });
    img.addEventListener("error",tryProvider);
    tryProvider();
  }
})();
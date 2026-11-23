(function(){
  "use strict";
  window.SENADA_AUTH_READY = (async function(){
    try{
      var response = await fetch((window.SENADA_API_BASE || "/api.php") + "?action=me", {credentials:"same-origin",cache:"no-store"});
      if(!response.ok){ window.location.replace("/admin/"); return false; }
      var data = await response.json();
      if(!data.ok){ window.location.replace("/admin/"); return false; }
      window.SENADA_CSRF_TOKEN = data.csrf_token;

      var actions = document.querySelector(".topbar-actions");
      if(actions && !document.getElementById("adminLogout")){
        var button = document.createElement("button");
        button.id = "adminLogout";
        button.type = "button";
        button.textContent = "Keluar";
        button.style.cssText = "height:34px;padding:0 12px;border:1px solid var(--line);border-radius:9px;background:var(--white);color:var(--ink);font:600 11px 'DM Sans',sans-serif;cursor:pointer";
        button.addEventListener("click", async function(){
          button.disabled = true;
          try{
            var result = await fetch((window.SENADA_API_BASE || "/api.php") + "?action=logout", {
              method:"POST",credentials:"same-origin",
              headers:{"Content-Type":"application/json","X-CSRF-Token":window.SENADA_CSRF_TOKEN || ""},
              body:"{}"
            });
            if(result.ok) window.location.replace("/admin/");
            else { button.disabled = false; alert("Logout belum berhasil. Muat ulang halaman dan coba lagi."); }
          }catch(error){ button.disabled = false; alert("Server tidak dapat dihubungi."); }
        });
        actions.insertBefore(button, actions.firstChild);
      }
      return true;
    }catch(error){
      console.error("Senada admin authentication check failed.", error);
      window.location.replace("/admin/");
      return false;
    }
  })();
})();

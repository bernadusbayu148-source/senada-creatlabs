(function(){
  "use strict";
  var STORAGE_KEY="senada_preview_projects_demo_v1";
  var SERVER_MODE=window.SENADA_SERVER_MODE===true;
  var API_BASE=window.SENADA_API_BASE||"/api.php";
  var list=document.getElementById("previewProjectList");
  if(!list)return;
  var modal=document.getElementById("previewModal");
  var form=document.getElementById("previewProjectForm");
  var search=document.getElementById("previewSearch");
  var editingId=null;
  var projects=[];

  function loadLocalProjects(){
    try{var raw=localStorage.getItem(STORAGE_KEY);var parsed=raw?JSON.parse(raw):[];return Array.isArray(parsed)?parsed:[];}catch(e){return [];}
  }
  function saveLocalProjects(){
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify(projects));return true;}catch(e){notify("Browser tidak dapat menyimpan data lokal.");return false;}
  }
  function escapeHtml(value){
    return String(value==null?"":value).replace(/[&<>"']/g,function(ch){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch];});
  }
  function slugify(value){
    return String(value||"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,50);
  }
  function notify(message){
    var toast=document.getElementById("toast");if(!toast)return;
    toast.textContent=message;toast.classList.add("is-visible");
    window.clearTimeout(notify.timer);notify.timer=window.setTimeout(function(){toast.classList.remove("is-visible");},3000);
  }
  async function apiRequest(action,method,body){
    if(window.SENADA_AUTH_READY){
      var ready=await window.SENADA_AUTH_READY;
      if(!ready)throw new Error("Sesi admin tidak aktif. Silakan login kembali.");
    }
    var options={method:method||"GET",credentials:"same-origin",cache:"no-store",headers:{}};
    if(options.method!=="GET"){
      options.headers["Content-Type"]="application/json";
      options.headers["X-CSRF-Token"]=window.SENADA_CSRF_TOKEN||"";
      options.body=JSON.stringify(body||{});
    }
    var response=await fetch(API_BASE+"?action="+encodeURIComponent(action),options);
    var data={};
    try{data=await response.json();}catch(e){}
    if(!response.ok||!data.ok)throw new Error(data.error||"Permintaan ke server gagal.");
    return data;
  }
  function modeLabel(mode){
    return mode==="both"?"Otomatis + Manual":mode==="auto"?"Otomatis":"Manual";
  }
  function updateServerNotice(){
    if(!SERVER_MODE)return;
    var title=document.getElementById("previewSecurityTitle");
    var message=document.getElementById("previewSecurityMessage");
    var state=document.getElementById("previewSecurityState");
    var warning=document.getElementById("previewFormWarning");
    if(title)title.textContent="Backend admin terhubung";
    if(message)message.textContent="Konfigurasi project disimpan di MySQL. Password disimpan sebagai hash dan akses preview diperiksa oleh server pada subdomain preview yang terpisah.";
    if(state)state.textContent="SERVER";
    if(warning)warning.textContent="Password minimal 12 karakter. Saat mengedit, biarkan kosong untuk mempertahankan password lama. Password tidak dapat dilihat kembali setelah disimpan.";
    var captions=document.querySelectorAll(".preview-stat-card small");
    if(captions[0])captions[0].textContent="Tersimpan di database";
    if(captions[1])captions[1].textContent="File index.html tersedia di storage";
  }
  function render(){
    var term=(search.value||"").toLowerCase().trim();
    var filtered=projects.filter(function(p){
      return (String(p.name||"")+" "+String(p.repository_url||p.repositoryUrl||"")+" "+String(p.category||"")).toLowerCase().indexOf(term)!==-1;
    });
    document.getElementById("previewStatTotal").textContent=String(projects.length);
    document.getElementById("previewStatReady").textContent=String(projects.filter(function(p){return !!p.ready;}).length);
    if(!filtered.length){
      list.innerHTML=projects.length?
        '<div class="preview-empty"><div class="preview-empty-icon">⌕</div><strong>Project tidak ditemukan</strong><p>Coba kata kunci lain untuk mencari proyek preview.</p></div>':
        '<div class="preview-empty"><div class="preview-empty-icon">↗</div><strong>Belum ada project preview</strong><p>'+(SERVER_MODE?"Tambahkan repository pertama dan atur password khusus untuk pelanggan.":"Tambahkan konfigurasi contoh. Data hanya tersimpan di browser ini.")+'</p><button type="button" data-preview-action="add">＋ Tambah project pertama</button></div>';
      return;
    }
    list.innerHTML=filtered.map(function(p){
      var isEnabled=SERVER_MODE?!!p.enabled:true;
      var ready=SERVER_MODE?!!p.ready:false;
      var repo=p.repository_url||p.repositoryUrl||"";
      var branch=p.branch||"main";
      var mode=SERVER_MODE?p.deployment_mode:(p.autoDeploy&&p.manualDeploy?"both":p.autoDeploy?"auto":"manual");
      var status=SERVER_MODE?(!isEnabled?"Akses dicabut":ready?"Siap dipreview":"Menunggu deployment"):"Setup required";
      var stateClass=isEnabled?"":" is-disabled";
      var previewLink=SERVER_MODE&&p.preview_url?'<a class="preview-project-link" href="'+escapeHtml(p.preview_url)+'" target="_blank" rel="noopener noreferrer">Buka link preview ↗</a>':"";
      var actionButtons=SERVER_MODE
        ? '<button class="preview-deploy-button" type="button" data-preview-action="deploy" data-id="'+escapeHtml(p.id)+'" '+(isEnabled&&mode!=="auto"?"":"disabled")+'>Deploy manual</button><button type="button" data-preview-action="edit" data-id="'+escapeHtml(p.id)+'">Edit</button><button type="button" data-preview-action="disable" data-id="'+escapeHtml(p.id)+'" '+(isEnabled?"":"disabled")+'>'+(isEnabled?"Cabut akses":"Nonaktif")+'</button>'
        : '<button class="preview-deploy-button" type="button" data-preview-action="deploy" data-id="'+escapeHtml(p.id)+'" '+(p.manualDeploy?"":"disabled")+'>Simulasikan deploy</button><button type="button" data-preview-action="edit" data-id="'+escapeHtml(p.id)+'">Edit</button><button type="button" data-preview-action="delete" data-id="'+escapeHtml(p.id)+'">Hapus</button>';
      return '<article class="preview-project-card">'+
        '<div class="preview-project-top"><span class="preview-category">'+escapeHtml(p.category)+'</span><span class="preview-project-state'+stateClass+'">'+escapeHtml(status)+'</span></div>'+
        '<h3>'+escapeHtml(p.name)+'</h3>'+
        '<p class="preview-repo"><span>Repository</span><br>'+escapeHtml(repo)+'</p>'+
        '<div class="preview-project-meta"><span>Branch <b>'+escapeHtml(branch)+'</b></span><span>Slug <b>'+escapeHtml(p.slug)+'</b></span></div>'+
        '<div class="preview-project-meta"><span>Deployment <b>'+escapeHtml(modeLabel(mode))+'</b></span><span>Password <b>'+(SERVER_MODE?(p.has_password?"Tersimpan":"Belum diatur"):"Demo only")+'</b></span></div>'+
        '<div class="preview-project-lock"><span class="lock">⌑</span><div>'+(isEnabled?"Private access":"Access revoked")+'<small>'+(ready?"File website sudah tersedia di storage.":SERVER_MODE?"Menunggu hasil deployment di private storage.":"Link dan proteksi belum aktif.")+'</small></div></div>'+
        previewLink+
        '<div class="preview-card-actions">'+actionButtons+'</div>'+
      '</article>';
    }).join("");
  }
  async function loadServerProjects(){
    try{
      var data=await apiRequest("projects","GET");
      projects=Array.isArray(data.projects)?data.projects:[];
      render();
    }catch(error){
      list.innerHTML='<div class="preview-empty"><div class="preview-empty-icon">!</div><strong>Backend belum dapat dimuat</strong><p>'+escapeHtml(error.message)+'</p></div>';
      notify(error.message);
    }
  }
  function openModal(project){
    editingId=project?project.id:null;
    form.reset();
    document.getElementById("previewProjectId").value=project?project.id:"";
    document.getElementById("previewName").value=project?project.name:"";
    document.getElementById("previewRepo").value=project?(project.repository_url||project.repositoryUrl):"";
    document.getElementById("previewBranch").value=project?project.branch:"main";
    document.getElementById("previewCategory").value=project?project.category:"Business Website";
    document.getElementById("previewSlug").value=project?project.slug:"";
    document.getElementById("previewSlug").disabled=!!(SERVER_MODE&&project);
    document.getElementById("previewPassword").value="";
    document.getElementById("previewAutoDeploy").checked=project?(SERVER_MODE?project.deployment_mode!=="manual":!!project.autoDeploy):true;
    document.getElementById("previewManualDeploy").checked=project?(SERVER_MODE?project.deployment_mode!=="auto":!!project.manualDeploy):true;
    document.getElementById("previewModalTitle").textContent=project?"Edit project preview":"Tambah project preview";
    document.getElementById("previewName").dataset.slugTouched="false";
    modal.hidden=false;
    document.body.style.overflow="hidden";
    document.getElementById("previewName").focus();
  }
  function closeModal(){
    modal.hidden=true;document.body.style.overflow="";editingId=null;
    document.getElementById("previewSlug").disabled=false;
  }
  function validRepository(value){
    try{
      var url=new URL(value);
      var parts=url.pathname.split("/").filter(Boolean);
      return url.protocol==="https:"&&url.hostname==="github.com"&&parts.length===2;
    }catch(e){return false;}
  }

  updateServerNotice();
  document.getElementById("addPreviewProject").addEventListener("click",function(){openModal(null);});
  document.getElementById("previewName").addEventListener("input",function(){
    var slug=document.getElementById("previewSlug");
    if(this.dataset.slugTouched!=="true"&&!slug.disabled)slug.value=slugify(this.value);
  });
  document.getElementById("previewSlug").addEventListener("input",function(){
    document.getElementById("previewName").dataset.slugTouched="true";
    this.value=slugify(this.value);
  });
  form.addEventListener("submit",async function(event){
    event.preventDefault();
    var name=document.getElementById("previewName").value.trim();
    var repositoryUrl=document.getElementById("previewRepo").value.trim().replace(/\/+$/,"");
    var branch=document.getElementById("previewBranch").value.trim();
    var slug=slugify(document.getElementById("previewSlug").value);
    var autoDeploy=document.getElementById("previewAutoDeploy").checked;
    var manualDeploy=document.getElementById("previewManualDeploy").checked;
    var password=document.getElementById("previewPassword").value;
    if(!validRepository(repositoryUrl)){notify("Masukkan URL repository GitHub yang valid.");return;}
    if(!name||!branch||!slug){notify("Lengkapi nama, branch, dan slug preview.");return;}
    if(!autoDeploy&&!manualDeploy){notify("Pilih minimal satu metode deployment.");return;}
    if(SERVER_MODE&&!editingId&&password.length<12){notify("Password project baru minimal 12 karakter.");return;}
    if(SERVER_MODE&&password!==""&&password.length<12){notify("Password baru minimal 12 karakter.");return;}
    var mode=autoDeploy&&manualDeploy?"both":autoDeploy?"auto":"manual";
    if(SERVER_MODE){
      try{
        await apiRequest("save-project","POST",{
          id:editingId||0,name:name,repository_url:repositoryUrl,branch:branch,
          category:document.getElementById("previewCategory").value,slug:slug,
          deployment_mode:mode,password:password
        });
        closeModal();
        await loadServerProjects();
        notify("Project tersimpan di database server. Password tersimpan dalam bentuk hash.");
      }catch(error){notify(error.message);}
      return;
    }
    var record={
      id:editingId||String(Date.now()),name:name,repositoryUrl:repositoryUrl,branch:branch,
      category:document.getElementById("previewCategory").value,slug:slug,
      autoDeploy:autoDeploy,manualDeploy:manualDeploy,access:"private",status:"setup-required",
      updatedAt:new Date().toISOString()
    };
    if(editingId)projects=projects.map(function(p){return p.id===editingId?record:p;});
    else projects.unshift(record);
    if(saveLocalProjects()){closeModal();render();notify("Konfigurasi demo disimpan di browser ini.");}
  });
  document.addEventListener("click",async function(event){
    var close=event.target.closest("[data-preview-close]");
    if(close){closeModal();return;}
    var action=event.target.closest("[data-preview-action]");
    if(!action)return;
    var type=action.getAttribute("data-preview-action");
    var id=action.getAttribute("data-id");
    if(type==="add"){openModal(null);return;}
    var project=projects.find(function(p){return String(p.id)===String(id);});
    if(!project)return;
    if(type==="edit"){openModal(project);return;}
    if(type==="deploy"){
      if(!SERVER_MODE){notify("Simulasi saja: GitHub Actions dan hosting privat belum dihubungkan.");return;}
      action.disabled=true;
      try{
        var result=await apiRequest("deploy","POST",{id:Number(id)});
        notify(result.message||"GitHub Actions berhasil dipicu.");
      }catch(error){notify(error.message);}
      action.disabled=false;
      return;
    }
    if(type==="disable"&&SERVER_MODE){
      if(!window.confirm("Cabut akses preview untuk "+project.name+"? Pelanggan tidak akan bisa membuka project ini."))return;
      try{await apiRequest("disable-project","POST",{id:Number(id)});await loadServerProjects();notify("Akses preview berhasil dicabut.");}
      catch(error){notify(error.message);}
      return;
    }
    if(type==="delete"&&!SERVER_MODE&&window.confirm("Hapus konfigurasi demo untuk "+project.name+" dari browser ini?")){
      projects=projects.filter(function(p){return String(p.id)!==String(id);});
      saveLocalProjects();render();notify("Konfigurasi demo dihapus dari browser ini.");
    }
  });
  search.addEventListener("input",render);
  document.addEventListener("keydown",function(event){if(event.key==="Escape"&&!modal.hidden)closeModal();});
  if(SERVER_MODE)loadServerProjects();
  else {projects=loadLocalProjects();render();}
})();

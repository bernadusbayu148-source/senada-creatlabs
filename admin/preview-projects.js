(function(){
  "use strict";
  var STORAGE_KEY="senada_preview_projects_demo_v1";
  var list=document.getElementById("previewProjectList");
  if(!list)return;
  var modal=document.getElementById("previewModal");
  var form=document.getElementById("previewProjectForm");
  var search=document.getElementById("previewSearch");
  var editingId=null;
  var projects=loadProjects();

  function loadProjects(){
    try{var raw=localStorage.getItem(STORAGE_KEY);var parsed=raw?JSON.parse(raw):[];return Array.isArray(parsed)?parsed:[];}catch(e){return [];}
  }
  function saveProjects(){
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
    window.clearTimeout(notify.timer);notify.timer=window.setTimeout(function(){toast.classList.remove("is-visible");},2800);
  }
  function render(){
    var term=(search.value||"").toLowerCase().trim();
    var filtered=projects.filter(function(p){return (p.name+" "+p.repositoryUrl+" "+p.category).toLowerCase().indexOf(term)!==-1;});
    document.getElementById("previewStatTotal").textContent=String(projects.length);
    document.getElementById("previewStatReady").textContent="0";
    if(!filtered.length){
      list.innerHTML=projects.length?
        '<div class="preview-empty"><div class="preview-empty-icon">⌕</div><strong>Project tidak ditemukan</strong><p>Coba kata kunci lain untuk mencari proyek preview.</p></div>':
        '<div class="preview-empty"><div class="preview-empty-icon">↗</div><strong>Belum ada project preview</strong><p>Tambahkan repository pertama. Pengaturan ini tersimpan hanya di browser ini sampai backend dan autentikasi server diaktifkan.</p><button type="button" data-preview-action="add">＋ Tambah project pertama</button></div>';
      return;
    }
    list.innerHTML=filtered.map(function(p){
      var auto=p.autoDeploy?"Aktif (belum terhubung)":"Nonaktif";
      var manual=p.manualDeploy?"Tersedia (simulasi)":"Nonaktif";
      return '<article class="preview-project-card">'+
        '<div class="preview-project-top"><span class="preview-category">'+escapeHtml(p.category)+'</span><span class="preview-status">Setup required</span></div>'+
        '<h3>'+escapeHtml(p.name)+'</h3>'+
        '<p class="preview-repo"><span>Repository</span><br>'+escapeHtml(p.repositoryUrl)+'</p>'+
        '<div class="preview-project-meta"><span>Branch <b>'+escapeHtml(p.branch)+'</b></span><span>Slug <b>'+escapeHtml(p.slug)+'</b></span></div>'+
        '<div class="preview-project-meta"><span>Auto deploy <b>'+auto+'</b></span><span>Manual <b>'+manual+'</b></span></div>'+
        '<div class="preview-project-lock"><span class="lock">⌑</span><div>Private access required<small>Link preview belum diterbitkan atau diverifikasi.</small></div></div>'+
        '<div class="preview-card-actions"><button class="preview-deploy-button" type="button" data-preview-action="deploy" data-id="'+escapeHtml(p.id)+'" '+(p.manualDeploy?"":"disabled")+'>Simulasikan deploy</button><button type="button" data-preview-action="edit" data-id="'+escapeHtml(p.id)+'">Edit</button><button type="button" data-preview-action="delete" data-id="'+escapeHtml(p.id)+'">Hapus</button></div>'+
      '</article>';
    }).join("");
  }
  function openModal(project){
    editingId=project?project.id:null;
    form.reset();
    document.getElementById("previewProjectId").value=project?project.id:"";
    document.getElementById("previewName").value=project?project.name:"";
    document.getElementById("previewRepo").value=project?project.repositoryUrl:"";
    document.getElementById("previewBranch").value=project?project.branch:"main";
    document.getElementById("previewCategory").value=project?project.category:"Business Website";
    document.getElementById("previewSlug").value=project?project.slug:"";
    document.getElementById("previewAutoDeploy").checked=project?!!project.autoDeploy:true;
    document.getElementById("previewManualDeploy").checked=project?!!project.manualDeploy:true;
    document.getElementById("previewModalTitle").textContent=project?"Edit project preview":"Tambah project preview";
    document.getElementById("previewName").dataset.slugTouched="false";
    modal.hidden=false;
    document.body.style.overflow="hidden";
    document.getElementById("previewName").focus();
  }
  function closeModal(){
    modal.hidden=true;document.body.style.overflow="";editingId=null;
  }
  function validRepository(value){
    try{
      var url=new URL(value);
      var parts=url.pathname.split("/").filter(Boolean);
      return url.protocol==="https:"&&url.hostname==="github.com"&&parts.length===2;
    }catch(e){return false;}
  }

  document.getElementById("addPreviewProject").addEventListener("click",function(){openModal(null);});
  document.getElementById("previewName").addEventListener("input",function(){
    var slug=document.getElementById("previewSlug");
    if(this.dataset.slugTouched!=="true")slug.value=slugify(this.value);
  });
  document.getElementById("previewSlug").addEventListener("input",function(){
    document.getElementById("previewName").dataset.slugTouched="true";
    this.value=slugify(this.value);
  });
  form.addEventListener("submit",function(event){
    event.preventDefault();
    var name=document.getElementById("previewName").value.trim();
    var repositoryUrl=document.getElementById("previewRepo").value.trim().replace(/\/+$/,"");
    var branch=document.getElementById("previewBranch").value.trim();
    var slug=slugify(document.getElementById("previewSlug").value);
    var autoDeploy=document.getElementById("previewAutoDeploy").checked;
    var manualDeploy=document.getElementById("previewManualDeploy").checked;
    if(!validRepository(repositoryUrl)){notify("Masukkan URL repository GitHub yang valid.");return;}
    if(!name||!branch||!slug){notify("Lengkapi nama, branch, dan slug preview.");return;}
    if(!autoDeploy&&!manualDeploy){notify("Pilih minimal satu metode deployment.");return;}
    var record={
      id:editingId||String(Date.now()),
      name:name,
      repositoryUrl:repositoryUrl,
      branch:branch,
      category:document.getElementById("previewCategory").value,
      slug:slug,
      autoDeploy:autoDeploy,
      manualDeploy:manualDeploy,
      access:"private",
      status:"setup-required",
      updatedAt:new Date().toISOString()
    };
    if(editingId){
      projects=projects.map(function(p){return p.id===editingId?record:p;});
    }else{
      projects.unshift(record);
    }
    if(saveProjects()){closeModal();render();notify("Konfigurasi preview disimpan di browser ini (mode demo).");}
  });
  document.addEventListener("click",function(event){
    var close=event.target.closest("[data-preview-close]");
    if(close){closeModal();return;}
    var action=event.target.closest("[data-preview-action]");
    if(!action)return;
    var type=action.getAttribute("data-preview-action");
    var id=action.getAttribute("data-id");
    if(type==="add"){openModal(null);return;}
    var project=projects.find(function(p){return p.id===id;});
    if(!project)return;
    if(type==="edit"){openModal(project);return;}
    if(type==="deploy"){
      notify("Simulasi saja: GitHub Actions dan hosting privat belum dihubungkan.");
      return;
    }
    if(type==="delete"&&window.confirm("Hapus konfigurasi demo untuk "+project.name+" dari browser ini?")){
      projects=projects.filter(function(p){return p.id!==id;});saveProjects();render();notify("Konfigurasi demo dihapus dari browser ini.");
    }
  });
  search.addEventListener("input",render);
  document.addEventListener("keydown",function(event){if(event.key==="Escape"&&!modal.hidden)closeModal();});
  render();
})();
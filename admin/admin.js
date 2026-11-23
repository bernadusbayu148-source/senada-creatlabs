(function(){
  "use strict";
  var STORAGE_KEY = "senada_admin_demo_v1";
  var initial = [
    {id:1,name:"Nadia Putri",company:"Studio skincare",initials:"NP",avatar:"violet",type:"Business Website",budget:"Rp5–8 juta",email:"nadia@example.test",phone:"+62 8xx-xxxx-0142",source:"Form website",status:"Baru",unread:true,time:"10:24",date:"Hari ini",brief:"Saya ingin membuat website untuk brand skincare kecil saya. Butuh halaman produk, cerita brand, dan tombol konsultasi.",messages:[{from:"client",text:"Halo Senada! Aku menemukan website kalian dan tertarik untuk membuat website untuk brand skincare kecilku.",time:"10:18"},{from:"client",text:"Kira-kira bisa bantu membuat website dengan katalog produk, cerita brand, dan form konsultasi?",time:"10:24"}]},
    {id:2,name:"Raka Mahendra",company:"Kopi Sore",initials:"RM",avatar:"coral",type:"Custom Web App",budget:"Rp8–12 juta",email:"raka@example.test",phone:"+62 8xx-xxxx-0285",source:"Form website",status:"Dalam Diskusi",unread:true,time:"09:46",date:"Hari ini",brief:"Butuh website coffee shop dengan menu, lokasi, dan sistem membership sederhana.",messages:[{from:"client",text:"Pagi, saya sedang mencari partner untuk mengembangkan website coffee shop kami.",time:"09:42"},{from:"client",text:"Kalau bisa sekalian ada membership sederhana untuk pelanggan tetap.",time:"09:46"},{from:"admin",text:"Halo Kak Raka! Bisa banget. Kami bisa bantu mulai dari website informasi, menu, sampai sistem membership. Boleh cerita sedikit alur membership yang dibayangkan?",time:"09:51"}]},
    {id:3,name:"Dinda Larasati",company:"Dinda Studio",initials:"DL",avatar:"lime",type:"Landing Page",budget:"Rp2–4 juta",email:"dinda@example.test",phone:"+62 8xx-xxxx-0361",source:"Form website",status:"Menunggu Balasan",unread:false,time:"Kemarin",date:"Kemarin",brief:"Membutuhkan landing page untuk personal brand dan jasa konsultasi.",messages:[{from:"client",text:"Hai, aku ingin punya landing page yang rapi untuk memperkenalkan jasa konsultasiku.",time:"Kemarin 15:08"},{from:"admin",text:"Halo Kak Dinda, terima kasih sudah menghubungi Senada. Kami sudah menerima brief-nya dan sedang menyiapkan beberapa pertanyaan lanjutan.",time:"Kemarin 15:16"}]},
    {id:4,name:"Arif Pratama",company:"Northside Supply",initials:"AP",avatar:"blue",type:"Business Website",budget:"Rp5–8 juta",email:"arif@example.test",phone:"+62 8xx-xxxx-0493",source:"Form website",status:"Dalam Diskusi",unread:false,time:"Sen, 16:20",date:"Senin",brief:"Ingin website katalog untuk brand apparel lokal dengan halaman koleksi dan kontak reseller.",messages:[{from:"client",text:"Kami ingin website katalog untuk brand apparel. Belum perlu checkout, lebih ke katalog dan kontak reseller.",time:"Senin 16:20"},{from:"admin",text:"Siap, Kak Arif. Kebutuhan katalog dan kontak reseller bisa kami bantu. Kami akan susun gambaran scope awalnya.",time:"Senin 16:35"}]},
    {id:5,name:"Maya Anindya",company:"Langkah Kita Travel",initials:"MA",avatar:"peach",type:"Business Website",budget:"Rp4–6 juta",email:"maya@example.test",phone:"+62 8xx-xxxx-0527",source:"Form website",status:"Selesai",unread:false,time:"Ming, 11:12",date:"Minggu",brief:"Website profil agen perjalanan dengan halaman paket wisata dan formulir konsultasi.",messages:[{from:"client",text:"Halo, kami butuh website profil travel dan daftar paket wisata.",time:"Minggu 11:12"},{from:"admin",text:"Terima kasih, Kak Maya. Brief sudah kami terima. Untuk kebutuhan ini, kami sarankan business website dengan katalog paket wisata.",time:"Minggu 11:25"}]}
  ];
  var conversations = loadData();
  var selectedId = conversations.length ? conversations[0].id : null;
  var activeFilter = "all";
  var toastTimer = null;

  function loadData(){
    try{
      var saved = localStorage.getItem(STORAGE_KEY);
      if(saved){var parsed=JSON.parse(saved);if(Array.isArray(parsed)&&parsed.length)return parsed;}
    }catch(e){}
    return JSON.parse(JSON.stringify(initial));
  }
  function saveData(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(conversations));}catch(e){}}
  function esc(value){return String(value==null?"":value).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
  function initials(name){return String(name||"").split(/\s+/).slice(0,2).map(function(s){return s.charAt(0);}).join("").toUpperCase();}
  function avatarClass(type){return type==="coral"?"avatar-coral":type==="lime"?"avatar-lime":type==="blue"?"avatar-blue":type==="peach"?"avatar-peach":"";}
  function statusClass(status){return status==="Baru"?"status-baru":status==="Menunggu Balasan"?"status-menunggu":status==="Dalam Diskusi"?"status-diskusi":"status-selesai";}
  function statusShort(status){return status==="Menunggu Balasan"?"Menunggu":status==="Dalam Diskusi"?"Diskusi":status;}
  function getSelected(){return conversations.find(function(c){return c.id===selectedId;})||conversations[0]||null;}
  function showToast(message){
    var el=document.getElementById("toast");if(!el)return;
    el.textContent=message;el.classList.add("is-visible");
    clearTimeout(toastTimer);toastTimer=setTimeout(function(){el.classList.remove("is-visible");},2300);
  }
  function switchPage(page){
    document.querySelectorAll("[data-view]").forEach(function(view){view.classList.toggle("is-visible",view.getAttribute("data-view")===page);});
    document.querySelectorAll(".nav-link").forEach(function(link){link.classList.toggle("is-active",link.getAttribute("data-page")===page);});
    var labels={overview:"Overview",inbox:"Inbox",contacts:"Kontak",projects:"Proyek",previews:"Project Preview",settings:"Pengaturan"};
    document.getElementById("breadcrumbCurrent").textContent=labels[page]||"Overview";
    document.getElementById("sidebar").classList.remove("is-open");
    document.getElementById("mobileScrim").classList.remove("is-visible");
    if(page==="inbox")renderInbox();
    if(page==="contacts")renderContacts();
    if(page==="projects")renderProjects();
  }
  function renderStats(){
    var count=function(status){return conversations.filter(function(c){return c.status===status;}).length;};
    var unread=conversations.filter(function(c){return c.unread;}).length;
    document.getElementById("statTotal").textContent=String(24+conversations.length-5);
    document.getElementById("statNew").textContent=count("Baru");
    document.getElementById("statDiscuss").textContent=count("Dalam Diskusi");
    document.getElementById("statDone").textContent=count("Selesai");
    document.getElementById("pipeNew").textContent=count("Baru");
    document.getElementById("pipeWait").textContent=count("Menunggu Balasan");
    document.getElementById("pipeTalk").textContent=count("Dalam Diskusi");
    document.getElementById("pipeDone").textContent=count("Selesai");
    document.getElementById("navUnread").textContent=String(unread);
    document.getElementById("unreadTabCount").textContent=String(unread);
    document.getElementById("inboxCountLabel").textContent=conversations.length+" percakapan";
    document.getElementById("contactCount").textContent=conversations.length+" kontak contoh";
  }
  function renderRecent(){
    var root=document.getElementById("recentList");
    var items=conversations.slice().sort(function(a,b){return b.id-a.id;}).slice(0,4);
    root.innerHTML=items.map(function(c){var last=c.messages[c.messages.length-1];return '<div class="recent-row"><div class="recent-person"><div class="avatar '+avatarClass(c.avatar)+'">'+esc(c.initials)+'</div><div><strong>'+esc(c.name)+'</strong><small>'+esc(c.company)+'</small></div></div><div class="recent-message">'+esc(last?last.text:"Belum ada pesan")+'</div><span class="status-badge '+statusClass(c.status)+'">'+esc(statusShort(c.status))+'</span><span class="recent-time">'+esc(c.time)+'</span><button class="recent-open" type="button" data-open-id="'+c.id+'" aria-label="Buka percakapan">›</button></div>';}).join("");
  }
  function renderOverview(){renderStats();renderRecent();}
  function renderConversationList(){
    var root=document.getElementById("conversationList");
    var query=(document.getElementById("inboxSearch").value||"").toLowerCase().trim();
    var items=conversations.filter(function(c){
      var matches=(c.name+" "+c.company+" "+c.type+" "+(c.messages[c.messages.length-1]||{}).text).toLowerCase().indexOf(query)>=0;
      return matches&&(activeFilter==="all"||c.unread);
    }).sort(function(a,b){return b.id-a.id;});
    if(!items.length){root.innerHTML='<div class="empty-list">Tidak ada percakapan yang cocok.</div>';return;}
    root.innerHTML=items.map(function(c){
      var last=c.messages[c.messages.length-1];
      return '<button class="conversation-item '+(c.id===selectedId?"is-selected":"")+'" type="button" data-conversation-id="'+c.id+'"><span class="avatar '+avatarClass(c.avatar)+'">'+esc(c.initials)+'</span><span class="conversation-main"><span class="conversation-title"><strong>'+esc(c.name)+'</strong><time>'+esc(c.time)+'</time></span><span class="conversation-preview">'+esc(last?last.text:"Belum ada pesan")+'</span><span class="conversation-sub"><span class="mini-tag">'+esc(c.type)+'</span>'+(c.unread?'<i class="unread-dot"></i>':'')+'</span></span></button>';
    }).join("");
  }
  function renderMessages(c){
    var root=document.getElementById("messageThread");
    root.innerHTML='<div class="date-divider">'+esc(c.date||"Percakapan")+'</div>'+c.messages.map(function(m){
      var mine=m.from==="admin";
      return '<div class="message-row '+(mine?"is-mine":"")+'"><div class="message-bubble">'+esc(m.text).replace(/\n/g,"<br>")+'</div><span class="message-time">'+(mine?"Senada · ":"")+esc(m.time)+'</span></div>';
    }).join("");
    root.scrollTop=root.scrollHeight;
  }
  function renderSelected(){
    var c=getSelected(),empty=document.getElementById("chatEmpty"),content=document.getElementById("chatContent");
    if(!c){empty.style.display="block";content.classList.remove("is-active");return;}
    empty.style.display="none";content.classList.add("is-active");
    document.getElementById("chatAvatar").textContent=c.initials;
    document.getElementById("chatAvatar").className="avatar avatar-large "+avatarClass(c.avatar);
    document.getElementById("chatName").textContent=c.name;
    document.getElementById("chatMeta").textContent=c.company+" · "+c.type;
    document.getElementById("chatProjectType").textContent=c.type;
    document.getElementById("chatProjectBudget").textContent="Budget: "+c.budget;
    document.getElementById("chatSource").textContent=c.source.toUpperCase();
    document.getElementById("leadAvatar").textContent=c.initials;
    document.getElementById("leadAvatar").className="avatar avatar-profile "+avatarClass(c.avatar);
    document.getElementById("leadName").textContent=c.name;
    document.getElementById("leadCompany").textContent=c.company;
    document.getElementById("leadSince").textContent="Inquiry · "+c.date;
    document.getElementById("statusSelect").value=c.status;
    document.getElementById("leadEmail").textContent=c.email;
    document.getElementById("leadPhone").textContent=c.phone;
    document.getElementById("leadSource").textContent=c.source;
    document.getElementById("leadType").textContent=c.type;
    document.getElementById("leadBudget").textContent=c.budget;
    document.getElementById("leadBrief").textContent=c.brief;
    renderMessages(c);
  }
  function renderInbox(){renderStats();renderConversationList();renderSelected();}
  function renderContacts(){
    var query=(document.getElementById("contactSearch").value||"").toLowerCase().trim();
    var items=conversations.filter(function(c){return (c.name+" "+c.company+" "+c.type+" "+c.status).toLowerCase().indexOf(query)>=0;});
    document.getElementById("contactsTable").innerHTML=items.map(function(c){
      return '<tr><td><div class="table-person"><span class="avatar '+avatarClass(c.avatar)+'">'+esc(c.initials)+'</span><div><strong>'+esc(c.name)+'</strong><br><span>'+esc(c.email)+'</span></div></div></td><td>'+esc(c.company)+'</td><td>'+esc(c.type)+'</td><td><span class="status-badge '+statusClass(c.status)+'">'+esc(statusShort(c.status))+'</span></td><td>'+esc(c.time)+'</td><td><button class="table-action" type="button" data-contact-id="'+c.id+'">Buka</button></td></tr>';
    }).join("")||'<tr><td colspan="6">Kontak tidak ditemukan.</td></tr>';
  }
  function renderProjects(){
    var columns=[{title:"Inisiasi",status:"Baru",items:[]},{title:"Dalam proses",status:"Dalam Diskusi",items:[]},{title:"Selesai",status:"Selesai",items:[]}];
    conversations.forEach(function(c){var col=columns.find(function(x){return x.status===c.status;});if(!col&&c.status==="Menunggu Balasan")col=columns[0];if(col)col.items.push(c);});
    document.getElementById("projectsBoard").innerHTML=columns.map(function(col){
      return '<section class="project-column"><div class="project-column-head"><strong>'+col.title+'</strong><span>'+col.items.length+'</span></div>'+col.items.map(function(c){return '<article class="project-card"><div class="project-card-top"><span class="project-type">'+esc(c.type.toUpperCase())+'</span><span class="project-menu">•••</span></div><h3>'+esc(c.company)+'</h3><p>'+esc(c.name)+' · '+esc(c.budget)+'</p><div class="project-card-foot"><span>'+esc(c.status)+'</span><span class="project-owner">'+esc(c.initials)+'</span></div></article>';}).join("")+'</section>';
    }).join("");
  }
  document.addEventListener("click",function(event){
    var pageButton=event.target.closest("[data-page]");
    if(pageButton){switchPage(pageButton.getAttribute("data-page"));return;}
    var conversationButton=event.target.closest("[data-conversation-id]");
    if(conversationButton){selectedId=Number(conversationButton.getAttribute("data-conversation-id"));var c=getSelected();if(c)c.unread=false;saveData();renderInbox();return;}
    var recentButton=event.target.closest("[data-open-id]");
    if(recentButton){selectedId=Number(recentButton.getAttribute("data-open-id"));var selected=getSelected();if(selected)selected.unread=false;saveData();switchPage("inbox");return;}
    var contactButton=event.target.closest("[data-contact-id]");
    if(contactButton){selectedId=Number(contactButton.getAttribute("data-contact-id"));var chosen=getSelected();if(chosen)chosen.unread=false;saveData();switchPage("inbox");return;}
    var filter=event.target.closest("[data-filter]");
    if(filter){activeFilter=filter.getAttribute("data-filter");document.querySelectorAll(".filter-tab").forEach(function(x){x.classList.toggle("is-active",x===filter);});renderConversationList();}
  });
  document.getElementById("inboxSearch").addEventListener("input",renderConversationList);
  document.getElementById("contactSearch").addEventListener("input",renderContacts);
  document.getElementById("globalSearch").addEventListener("keydown",function(e){if(e.key==="Enter"){document.getElementById("inboxSearch").value=this.value;switchPage("inbox");renderConversationList();}});
  document.getElementById("statusSelect").addEventListener("change",function(){
    var c=getSelected();if(!c)return;c.status=this.value;saveData();renderStats();renderConversationList();renderRecent();renderContacts();renderProjects();showToast("Status prospek diperbarui.");
  });
  document.getElementById("composerForm").addEventListener("submit",function(e){
    e.preventDefault();var field=document.getElementById("composerInput"),message=field.value.trim(),c=getSelected();
    if(!message){showToast("Tulis balasan terlebih dahulu.");return;}
    if(!c){showToast("Pilih percakapan terlebih dahulu.");return;}
    c.messages.push({from:"admin",text:message,time:new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"})});
    c.status="Menunggu Balasan";c.unread=false;c.time="Baru saja";saveData();field.value="";renderInbox();renderOverview();showToast("Balasan simulasi ditambahkan ke percakapan.");
  });
  document.getElementById("resetDemo").addEventListener("click",function(){
    if(!window.confirm("Kembalikan semua percakapan ke data contoh awal?"))return;
    conversations=JSON.parse(JSON.stringify(initial));selectedId=conversations[0].id;saveData();renderOverview();renderInbox();renderContacts();renderProjects();showToast("Data preview berhasil direset.");
  });
  document.getElementById("themeToggle").addEventListener("click",function(){document.body.classList.toggle("dark");try{localStorage.setItem("senada-admin-theme",document.body.classList.contains("dark")?"dark":"light");}catch(e){}});
  try{if(localStorage.getItem("senada-admin-theme")==="dark")document.body.classList.add("dark");}catch(e){}
  document.getElementById("mobileMenuToggle").addEventListener("click",function(){document.getElementById("sidebar").classList.add("is-open");document.getElementById("mobileScrim").classList.add("is-visible");});
  document.getElementById("mobileScrim").addEventListener("click",function(){document.getElementById("sidebar").classList.remove("is-open");this.classList.remove("is-visible");});
  document.getElementById("dismissNotice").addEventListener("click",function(){document.querySelector(".preview-notice").style.display="none";});
  document.getElementById("newMessageHint").addEventListener("click",function(){showToast("Pesan baru akan masuk setelah form website terhubung.");});
  document.addEventListener("keydown",function(e){if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();document.getElementById("globalSearch").focus();}});
  renderOverview();renderInbox();renderContacts();renderProjects();
})();
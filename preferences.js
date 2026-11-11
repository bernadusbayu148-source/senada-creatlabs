/* Senada Creatlabs — shared ID/EN translations and persisted light/dark mode.
   No external packages or tracking. Preference keys are shared by demo pages. */
(function(){
  "use strict";
  const KEYS={theme:"senada-theme",language:"senada-language"};
  const safeGet=(key)=>{try{return localStorage.getItem(key)}catch(_){return null}};
  const safeSet=(key,value)=>{try{localStorage.setItem(key,value)}catch(_){/* private mode */}};
  const originalTitle=document.title;
  const originalDesc=document.querySelector('meta[name="description"]')?.content||"";
  const originalText=new WeakMap();
  const originalAttrs=new WeakMap();
  let lang=safeGet(KEYS.language)==="en"?"en":"id";
  let theme=safeGet(KEYS.theme)==="dark"?"dark":"light";
  // Original Indonesian text -> natural English copy; brand names stay unchanged.
  const EN={
    // Shared controls and navigation
    "Beranda":"Home","Tentang":"About","Layanan":"Services","Konsep":"Concepts","Proses":"Process",
    "Paket":"Packages","Kontak":"Contact","Mulai proyek":"Start a project","Konsultasi ↗":"Let's talk ↗",
    "Lihat website contoh":"Explore live demo","Geser untuk lihat konsep lain":"Swipe for more concepts",
    "Geser untuk lihat paket lain":"Swipe for more packages",
    "Konsep sebelumnya":"Previous concept","Konsep berikutnya":"Next concept",
    "Paket sebelumnya":"Previous package","Paket berikutnya":"Next package",
    "Geser untuk melihat dua konsep website":"Swipe to explore two website concepts",
    "Geser untuk melihat tiga paket jasa":"Swipe to explore three service packages",
    "Navigasi cepat Senada pada layar mobile":"Senada mobile quick navigation",
    "Navigasi utama":"Main navigation","Buka preview website konsep F&B yang Hangat":"Open the warm coffee shop website demo",
    "Buka preview website konsep Brand yang Berani":"Open the bold lifestyle website demo",
    // Main hero and about
    "Creative web studio • Indonesia":"Creative web studio • Indonesia",
    "Bikin web yang":"Websites with","beda":"a different","nadanya.":"rhythm.",
    "Punya ide besar? Kami bantu bikin website yang tampil beda, gampang dipakai, dan nyambung sama karakter brand-mu.":"Have a big idea? We build distinctive, easy-to-use websites that feel right for your brand.",
    "Ceritakan idemu":"Tell us your idea","Jelajahi layanan":"Explore services",
    "ide seru,":"fresh ideas,","web melaju! ↗":"websites that fly! ↗",
    "IDE LIAR":"BOLD IDEAS","WEB TERARAH":"PURPOSEFUL WEB","DESAIN BERKARAKTER":"DESIGN WITH CHARACTER","BUAT BRAND-MU":"BUILT FOR YOUR BRAND",
    "Kenalan dulu":"Get to know us","Satu frekuensi, banyak kemungkinan.":"Same wavelength, endless possibilities.",
    "Di Senada Creatlabs, kami percaya website yang bagus bukan cuma soal tampilan. Website harus":"At Senada Creatlabs, we believe a great website goes beyond good looks. It needs",
    "punya karakter, punya tujuan, dan nyaman digunakan.":"character, purpose, and an effortless experience.",
    "Kami menggabungkan ide kreatif dengan pengembangan web yang rapi, supaya brand-mu lebih mudah ditemukan dan diingat.":"We combine bold creative ideas with thoughtful web development, so your brand is easier to discover and remember.",
    "Begini cara kami bekerja ↗":"See how we work ↗",
    // Services
    "Apa yang kami kerjakan":"What we do","Dari ide random jadi website keren.":"Turning wild ideas into brilliant websites.",
    "Tiap brand punya ritme sendiri. Pilih layanan yang paling pas buat kebutuhanmu.":"Every brand has its own rhythm. Choose the service that fits yours.",
    "Halaman promosi yang fokus, menarik, dan mengajak pengunjung mengambil tindakan.":"Focused, engaging promotional pages designed to inspire action.",
    "Rumah digital untuk profil usaha, menu, katalog, layanan, dan informasi penting.":"A digital home for your company, menu, catalog, services, and important information.",
    "Dashboard, membership, reservasi, dan fitur khusus untuk operasional bisnis.":"Dashboards, memberships, reservations, and tailored tools for running your business.",
    "Update konten, perawatan berkala, dan bantuan teknis supaya web tetap nyaman dipakai.":"Content updates, regular maintenance, and technical support to keep your website running smoothly.",
    // Concepts
    "Moodboard proyek":"Project moodboard","Beda bisnis, beda ceritanya.":"Different businesses, different stories.",
    "Dua eksplorasi visual berikut adalah konsep demo, bukan proyek klien sungguhan.":"These two creative explorations are fictional demos, not real client projects.",
    "F&B yang Hangat":"A Cozy Coffee Brand",
    "Eksplorasi website untuk kedai kopi yang mengutamakan cerita, menu, dan suasana.":"A coffee shop website concept built around stories, the menu, and the atmosphere.",
    "Brand yang Berani":"A Bold Lifestyle Brand",
    "Eksplorasi website untuk brand lifestyle dengan warna yang ekspresif.":"A lifestyle website concept full of expressive colors and personality.",
    // Process
    "Cara kerja kami":"How we work","Seru prosesnya.":"Fun process.","Jelas langkahnya.":"Clear steps.",
    "Kreatif boleh spontan. Eksekusi tetap terarah, transparan, dan kolaboratif.":"Creativity can be spontaneous. Delivery stays focused, transparent, and collaborative.",
    "Kenalan":"Discover","Diskusi ide, target audiens, referensi, dan tujuan website.":"We discuss your idea, audience, references, and website goals.",
    "Rancang":"Design","Tentukan struktur halaman, arah visual, dan ruang lingkup pekerjaan.":"We define the page structure, visual direction, and project scope.",
    "Bangun":"Build","Desain dan development, lalu review bersama sebelum dirilis.":"We design, develop, and review together before launch.",
    "Meluncur!":"Launch!","Pengujian akhir, penyerahan akses, serta opsi bantuan lanjutan.":"Final testing, handover, and optional ongoing support.",
    // Packages
    "Pilihan kolaborasi":"Ways to collaborate","Mulai dari yang pas, tumbuh sesuai kebutuhan.":"Start with what fits. Grow as you go.",
    "Paket contoh untuk memulai diskusi. Cakupan dan penawaran akhir disepakati setelah brief.":"These sample packages start the conversation. Final scope and pricing are agreed after your brief.",
    "Untuk ide yang mau meluncur":"For ideas ready to take off",
    "Satu halaman utama untuk memperkenalkan produk, promo, atau layanan.":"A focused one-page site to introduce your product, promotion, or service.",
    "Landing page responsif":"Responsive landing page","Struktur konten dan CTA":"Content structure and calls to action",
    "Form/tautan kontak":"Contact form or link","Dasar SEO teknis":"Technical SEO basics",
    "Diskusi paket ini ↗":"Discuss this package ↗",
    "Untuk brand yang siap tumbuh":"For growing brands",
    "Website bisnis dengan beberapa halaman untuk cerita dan kebutuhan brand.":"A multi-page business website built around your brand and its needs.",
    "Beberapa halaman inti":"Essential website pages","Tampilan mobile-friendly":"Mobile-friendly experience",
    "Galeri atau katalog konten":"Gallery or content catalog","Panduan pengelolaan dasar":"Basic content management guidance",
    "Untuk ide dengan kebutuhan unik":"For unique business needs",
    "Website atau aplikasi dengan alur, integrasi, dan kebutuhan khusus.":"A tailored website or application with custom workflows and integrations.",
    "Scope sesuai kebutuhan":"Tailored project scope","Dashboard/fitur khusus":"Custom dashboards and features",
    "Integrasi API bila diperlukan":"API integrations where needed","Perencanaan dan uji fitur":"Feature planning and testing",
    "Harga, masa pengerjaan, biaya domain/hosting, serta revisi dibahas dan dicatat dalam proposal proyek.":"Pricing, timelines, domain and hosting costs, and revisions are detailed in the project proposal.",
    // FAQ
    "Pertanyaan umum":"Frequently asked questions","Yang sering ditanyain.":"Good questions, answered.",
    "Kalau ada hal lain, ceritakan saja saat mengisi brief.":"Have another question? Tell us in your project brief.",
    "Apakah bisa dibuat sesuai desain brand saya?":"Can you match my brand's visual identity?",
    "Bisa. Warna, tipografi, tampilan, dan fitur akan disesuaikan dengan identitas brand dan kebutuhan yang disepakati.":"Absolutely. Colors, typography, layout, and features can be adapted to your brand and agreed project requirements.",
    "Apakah website bisa dibuka di HP?":"Will my website work on mobile?",
    "Ya, desain responsif menjadi bagian dari pendekatan kami. Setiap proyek tetap melewati pengecekan tampilan di berbagai ukuran layar.":"Yes. Responsive design is part of our approach, and every project is checked at different screen sizes.",
    "Apakah domain dan hosting termasuk?":"Are domain and hosting included?",
    "Bisa dibantu pengadaannya, tetapi biaya dan kepemilikan domain/hosting akan dijelaskan terpisah dalam proposal agar transparan.":"We can help arrange them. Costs and ownership of the domain and hosting are explained separately in the proposal.",
    "Berapa lama proses pembuatannya?":"How long does a website take?",
    "Tergantung kompleksitas dan kesiapan materi. Estimasi timeline akan diberikan setelah kebutuhan dan ruang lingkup proyek jelas.":"It depends on complexity and content readiness. We'll provide a timeline once the requirements and scope are clear.",
    // Form, CTA and footer
    "Punya rencana seru?":"Got an exciting idea?","Yuk, satu frekuensi!":"Let's get in sync!",
    "Ceritakan kebutuhan web-mu. Mulai dari ide kecil, promosi bisnis, sampai sistem yang lebih kompleks.":"Tell us what you need, from a simple idea or campaign to a full custom web application.",
    "Belum punya brief? Nggak masalah.":"No project brief yet? No problem.",
    "Versi demo: form ini menyiapkan pesan yang dapat disalin. Hubungan email/WhatsApp resmi bisa diaktifkan setelah kontak bisnis ditentukan.":"Demo version: this form creates a message you can copy. Email and WhatsApp contact can be enabled when the official channels are ready.",
    "Ceritakan proyekmu ✍":"Tell us about your project ✍",
    "Isi singkat, lalu salin brief untuk dikirim ke Senada.":"Fill in the details, then copy your brief to share with Senada.",
    "Nama kamu *":"Your name *","Email atau WhatsApp *":"Email or WhatsApp *",
    "Butuh website seperti apa?":"What kind of website do you need?",
    "Belum yakin, mau konsultasi":"Not sure yet — let's talk",
    "Cerita singkat idemu *":"Tell us about your idea *",
    "Perkiraan anggaran (opsional)":"Estimated budget (optional)",
    "Belum ditentukan":"Not decided yet","Di bawah Rp3 juta":"Under IDR 3 million",
    "Rp3–7 juta":"IDR 3–7 million","Rp7–15 juta":"IDR 7–15 million","Di atas Rp15 juta":"Over IDR 15 million",
    "Salin brief proyek":"Copy project brief",
    "Nama / nama bisnis":"Your name / business name",
    "Kontak yang bisa dihubungi":"Where we can reach you",
    "Ceritain proyek, target, fitur yang kamu bayangkan...":"Tell us about your project, audience, and features...",
    "Creative web studio untuk ide-ide berani yang ingin punya tempat sendiri di internet.":"A creative web studio helping bold ideas find their own place online.",
    "Yuk ngobrol ↗":"Let's talk ↗","Kembali ke atas ↑":"Back to top ↑",
    "Creative Web Studio · Indonesia ·":"Creative Web Studio · Indonesia ·",
    "Kontak yang bisa dihubungi":"Contact details",
    "Senada Creatlabs — Bikin Web yang Beda Nadanya.":"Senada Creatlabs — Websites with a Different Rhythm.",
    "Senada Creatlabs adalah creative web studio yang merancang website berkarakter untuk bisnis, brand, dan ide-ide baru.":"Senada Creatlabs is a creative web studio designing character-filled websites for businesses, brands, and bold new ideas.",
    // Coffee concept demo
    "✳ KONSEP DEMO — BUKAN BISNIS SUNGGUHAN":"✳ DEMO CONCEPT — NOT A REAL BUSINESS",
    "← Kembali ke Senada":"← Back to Senada",
    "Menu":"Menu","Cerita":"Story","Kunjungi":"Visit",
    "Lihat menu ↗":"View menu ↗","Kedai kopi & cerita":"Coffee & conversations",
    "Sejenak dulu.":"Slow down.","Secangkir":"One more","lagi.":"cup.",
    "Dari tegukan pertama sampai obrolan terakhir, selalu ada ruang untuk cerita yang hangat.":"From the first sip to the last conversation, there's always room for a warm story.",
    "Kenali menu kami ↗":"Explore the menu ↗","Cerita di balik cangkir ↓":"The story behind each cup ↓",
    "Ruang nyaman":"Cozy corners","Kopi yang akrab":"Familiar flavors","Cerita tanpa jeda":"Endless stories",
    "Pilihan favorit":"Community favorites","Teman setiap cerita.":"Made for every story.",
    "Contoh daftar menu untuk menunjukkan cara produk ditampilkan pada website kedai kopi.":"A sample menu demonstrating how coffee shop products could be presented online.",
    "Semua":"All","Hangat":"Hot","Dingin":"Iced",
    "Kopi Pagi":"Morning Brew","Kopi susu lembut, teman membuka hari dengan senyum.":"Smooth milk coffee to start your day with a smile.",
    "CONTOH MENU · HANGAT":"SAMPLE MENU · HOT",
    "Es Cerita":"Iced Stories","Minuman dingin dengan rasa manis yang menyenangkan.":"A refreshing iced drink with a playful sweet twist.",
    "CONTOH MENU · DINGIN":"SAMPLE MENU · ICED",
    "Teman Ngopi":"Coffee Companion","Camilan ringan yang pas menemani obrolan panjang.":"Light bites made for conversations that last.",
    "Lebih dari kopi":"More than coffee","Tempat cerita menemukan rumah.":"Where stories feel at home.",
    "Ini adalah contoh bagian profil brand: kisah di balik usaha, suasana tempat, dan alasan pelanggan ingin datang kembali. Warna, kata-kata, dan karakter visual disesuaikan dengan identitas bisnis klien.":"This is an example brand story: the business journey, atmosphere, and the reasons people return. Colors, copy, and visuals can all reflect the client's identity.",
    "Lihat bagian kunjungan ↗":"Explore the visit section ↗",
    "Sampai ketemu!":"See you soon!","Ngopi bareng, yuk?":"Coffee together?",
    "Halaman demo ini tidak memiliki lokasi, pemesanan, atau bisnis sungguhan. Pada proyek nyata, bagian ini dapat berisi alamat, peta, jam buka, dan kontak kedai.":"This demo has no real location, ordering, or operating business. A real project could include an address, map, opening hours, and café contact details.",
    "Kembali ke Senada Creatlabs ↗":"Back to Senada Creatlabs ↗",
    "kopi! — Contoh konsep website F&B":"kopi! — Sample coffee shop website concept",
    "Dirancang oleh":"Designed by","· Hanya untuk demonstrasi":"· For demonstration only",
    "Kopi! — Demo Konsep Website F&B | Senada Creatlabs":"Kopi! — Coffee Shop Website Demo | Senada Creatlabs",
    "Website konsep fiktif untuk eksplorasi desain F&B oleh Senada Creatlabs.":"A fictional coffee shop website concept created by Senada Creatlabs.",
    "Navigasi demo":"Demo navigation",
    "Filter menu":"Filter menu",
    // bloom. demo
    "✳ KONSEP DEMO — BRAND FIKTIF":"✳ DEMO CONCEPT — FICTIONAL BRAND",
    "Koleksi":"Collection","Inspirasi":"Inspiration",
    "Lebih berani berekspresi, lebih bebas jadi diri sendiri. Karena setiap hari layak punya warnanya sendiri.":"Express yourself freely and boldly. Every day deserves its own color.",
    "Jelajahi koleksi ↗":"Explore the collection ↗",
    "Contoh halaman katalog visual yang dapat disesuaikan dengan produk dan kategori sebuah brand.":"A sample visual catalog adaptable to a brand's products and categories.",
    "Konsep produk harian dengan nuansa lembut dan visual yang ceria.":"An everyday product concept with soft tones and cheerful visuals.",
    "Inspirasi visual untuk produk lifestyle yang ingin tampil beda.":"Visual inspiration for lifestyle products that want to stand out.",
    "Contoh kategori spesial untuk kampanye atau koleksi terbatas.":"A sample special category for campaigns or limited-edition collections.",
    "Warna boleh ramai. Pesan tetap jelas.":"Bold colors. Clear messages.",
    "Ini adalah contoh bagian storytelling brand. Setiap komponen—dari headline, palet warna, hingga navigasi produk—dirancang agar punya karakter yang konsisten dan mudah dipahami.":"This is an example of brand storytelling. Every element, from the headline and color palette to product navigation, works together to create a consistent, clear personality.",
    "Lihat inspirasi ↗":"Explore inspiration ↗",
    "Website yang punya":"A website with",
    "Semua merek, produk, dan konten pada halaman ini merupakan ilustrasi. Pada proyek nyata, fitur katalog, stok, dan pemesanan dapat dirancang sesuai kebutuhan klien.":"All brands, products, and content on this page are illustrative. A real project can include catalog, inventory, and ordering features tailored to the client.",
    "Kembali ke Senada ↗":"Back to Senada ↗",
    "bloom. — Contoh konsep website lifestyle":"bloom. — Sample lifestyle website concept",
    "bloom. — Demo Konsep Lifestyle | Senada Creatlabs":"bloom. — Lifestyle Website Demo | Senada Creatlabs",
    "Website konsep fiktif lifestyle yang penuh warna dan interaksi, dirancang oleh Senada Creatlabs.":"A colorful, interactive fictional lifestyle website concept created by Senada Creatlabs.",
    "Filter koleksi":"Filter collection",
    // Accessible labels
    "Senada Creatlabs, beranda":"Senada Creatlabs, home",
    "Logo Senada":"Senada logo",
    "Konsultasi dengan Senada Creatlabs":"Consult with Senada Creatlabs",
    "Mulai proyek dengan Senada Creatlabs":"Start a project with Senada Creatlabs",
    "Kembali ke Beranda":"Back to home",
    "Buka menu":"Open menu",
    "Tutup menu":"Close menu"
  };

  const translate=(value)=>Object.prototype.hasOwnProperty.call(EN,value)?EN[value]:value;
  function themeColor(){
    const page=document.body?.dataset.page||"senada";
    if(theme==="dark")return page==="coffee"?"#18130f":page==="bloom"?"#1b142b":"#141321";
    return page==="coffee"?"#f7e8d3":page==="bloom"?"#ffb8c5":"#f9f6ef";
  }
  function setTheme(next){
    theme=next==="dark"?"dark":"light";
    document.documentElement.dataset.theme=theme;
    safeSet(KEYS.theme,theme);
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta)meta.content=themeColor();
    const themeButton=document.querySelector('[data-theme-toggle]');
    if(themeButton){
      const isDark=theme==="dark";
      themeButton.setAttribute("aria-label",isDark?(lang==="en"?"Switch to light mode":"Aktifkan mode terang"):(lang==="en"?"Switch to dark mode":"Aktifkan mode gelap"));
      themeButton.setAttribute("title",themeButton.getAttribute("aria-label"));
      themeButton.setAttribute("aria-pressed",String(isDark));
    }
  }
  function translateText(){
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{
      acceptNode(node){
        const p=node.parentElement;
        if(!p||p.closest(".preference-controls")||p.closest("script,style,svg"))return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let node;
    while((node=walker.nextNode())){
      if(!originalText.has(node))originalText.set(node,node.nodeValue);
      const raw=originalText.get(node);
      const m=/^(\s*)([\s\S]*?)(\s*)$/.exec(raw);
      if(!m)continue;
      node.nodeValue=m[1]+(lang==="en"?translate(m[2]):m[2])+m[3];
    }
    document.querySelectorAll("[placeholder],[aria-label],[title],option").forEach(el=>{
      if(el.closest(".preference-controls"))return;
      if(!originalAttrs.has(el)){
        originalAttrs.set(el,{placeholder:el.getAttribute("placeholder"),aria:el.getAttribute("aria-label"),title:el.getAttribute("title")});
      }
      const orig=originalAttrs.get(el);
      if(orig.placeholder!==null)el.setAttribute("placeholder",lang==="en"?translate(orig.placeholder):orig.placeholder);
      if(orig.aria!==null)el.setAttribute("aria-label",lang==="en"?translate(orig.aria):orig.aria);
      if(orig.title!==null)el.setAttribute("title",lang==="en"?translate(orig.title):orig.title);
    });
    document.title=lang==="en"?translate(originalTitle):originalTitle;
    const desc=document.querySelector('meta[name="description"]');
    if(desc)desc.content=lang==="en"?translate(originalDesc):originalDesc;
    document.documentElement.lang=lang;
  }
  function setLanguage(next){
    lang=next==="en"?"en":"id";
    safeSet(KEYS.language,lang);
    translateText();
    document.querySelectorAll("[data-language]").forEach(button=>{
      const active=button.dataset.language===lang;
      button.setAttribute("aria-pressed",String(active));
      button.setAttribute("aria-label",(button.dataset.language==="id"?"Bahasa Indonesia":"English")+(active?" ✓":""));
    });
    setTheme(theme);
  }
  function init(){
    document.querySelectorAll("[data-language]").forEach(button=>button.addEventListener("click",()=>setLanguage(button.dataset.language)));
    document.querySelector("[data-theme-toggle]")?.addEventListener("click",()=>setTheme(theme==="dark"?"light":"dark"));
    // Retain stable form values while the displayed options change language.
    document.querySelectorAll("select option:not([value])").forEach(option=>option.setAttribute("value",option.textContent.trim()));
    setLanguage(lang);
  }
  window.SenadaPrefs={language:()=>lang,theme:()=>theme,setLanguage,setTheme,t:(text)=>lang==="en"?translate(text):text};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
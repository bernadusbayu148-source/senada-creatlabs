(function(){
  "use strict";

  var modal=document.getElementById("aiReplyModal");
  var openButton=document.getElementById("aiReplyOpen");
  if(!modal||!openButton)return;

  var dialog=modal.querySelector(".ai-assist-dialog");
  var questionField=document.getElementById("aiCustomerQuestion");
  var contextField=document.getElementById("aiExtraContext");
  var results=document.getElementById("aiAssistResults");
  var emptyState=document.getElementById("aiAssistEmpty");
  var draftField=document.getElementById("aiReplyDraft");
  var generatedParts={};

  function notify(message){
    var toast=document.getElementById("toast");
    if(!toast)return;
    toast.textContent=message;
    toast.classList.add("is-visible");
    window.clearTimeout(notify.timer);
    notify.timer=window.setTimeout(function(){toast.classList.remove("is-visible");},2400);
  }

  function latestCustomerMessage(){
    var messages=Array.prototype.slice.call(document.querySelectorAll("#messageThread .message-row:not(.is-mine) .message-bubble"));
    var latest=messages[messages.length-1];
    return latest?latest.innerText.trim():"";
  }

  function openModal(){
    var name=(document.getElementById("chatName")||{}).textContent||"Pelanggan";
    var meta=(document.getElementById("chatMeta")||{}).textContent||"";
    document.getElementById("aiCustomerMeta").textContent=name+" · "+meta;
    questionField.value=latestCustomerMessage();
    contextField.value="";
    results.hidden=true;
    emptyState.hidden=false;
    draftField.value="";
    generatedParts={};
    modal.hidden=false;
    document.body.classList.add("ai-assist-open");
    dialog.focus();
  }

  function closeModal(){
    modal.hidden=true;
    document.body.classList.remove("ai-assist-open");
    openButton.focus();
  }

  function getAnalysis(question,extraContext){
    var q=question.toLowerCase();
    var firstName=((document.getElementById("chatName")||{}).textContent||"Kak").trim().split(/\s+/)[0];
    var parts={
      greeting:"Halo Kak "+firstName+", terima kasih sudah menghubungi Senada.",
      explanation:"",
      nextStep:"",
      question:"Boleh kirimkan detail tambahan atau screenshot pesan yang muncul agar kami bisa memeriksanya dengan lebih tepat?"
    };
    var intent,explanation,verify;

    if(/nxdomain|dns|nameserver|domain tidak bisa|domain tidak ditemukan/.test(q)){
      intent="Pelanggan mengalami kendala saat membuka domain. Pesan DNS/NXDOMAIN menunjukkan nama domain tidak berhasil ditemukan saat proses pencarian DNS.";
      explanation="NXDOMAIN biasanya berarti DNS resolver tidak menemukan record untuk nama domain tersebut. Kemungkinan penyebabnya antara lain nameserver atau DNS record belum tepat, domain kedaluwarsa atau berstatus suspend, maupun perubahan DNS yang masih dalam proses propagasi. Pesan ini belum cukup untuk memastikan satu penyebab tertentu.";
      verify="Periksa status domain, nameserver aktif, record A/AAAA/CNAME, zona DNS, dan apakah ada perubahan DNS baru-baru ini. Jangan menyatakan domain pasti kedaluwarsa atau server pasti bermasalah sebelum pengecekan.";
      parts.explanation="Pesan DNS_PROBE_FINISHED_NXDOMAIN biasanya muncul ketika domain belum berhasil ditemukan melalui sistem DNS. Hal ini dapat berkaitan dengan pengaturan DNS atau nameserver, dan belum tentu berarti website atau file website rusak.";
      parts.nextStep="Kami akan membantu memeriksa status domain, nameserver, dan pengaturan DNS terlebih dahulu agar penyebabnya bisa diketahui dengan lebih tepat.";
      parts.question="Apakah sebelumnya ada perubahan nameserver, pengaturan DNS, atau perpanjangan domain?";
    }else if(/ssl|https|sertifikat|not secure|koneksi tidak pribadi/.test(q)){
      intent="Pelanggan melihat peringatan keamanan atau kendala sertifikat SSL saat membuka website.";
      explanation="Peringatan SSL dapat terjadi jika sertifikat belum terpasang, kedaluwarsa, tidak cocok dengan nama domain, atau konfigurasi HTTPS belum lengkap. Perlu melihat pesan browser dan status sertifikat untuk memastikan penyebabnya.";
      verify="Periksa masa berlaku sertifikat, cakupan domain dan subdomain, rantai sertifikat, serta pengalihan HTTP ke HTTPS. Jangan meminta pelanggan mengabaikan peringatan keamanan.";
      parts.explanation="Peringatan tersebut biasanya berkaitan dengan sertifikat keamanan SSL yang digunakan untuk koneksi HTTPS. Kami perlu memeriksa status dan konfigurasi sertifikat agar bisa memastikan penyebabnya.";
      parts.nextStep="Kami akan meninjau sertifikat SSL dan pengaturan HTTPS pada domain yang digunakan.";
      parts.question="Boleh kirimkan alamat website dan screenshot peringatan yang muncul di browser?";
    }else if(/500|502|503|504|server|hosting|website.*tidak bisa dibuka|tidak dapat diakses|error.*website/.test(q)){
      intent="Pelanggan melaporkan website tidak dapat diakses atau menampilkan error server.";
      explanation="Kode 5xx umumnya menandakan server atau aplikasi gagal memproses permintaan. Penyebabnya dapat berasal dari resource hosting, konfigurasi server, plugin/aplikasi, atau perubahan kode. Pesan spesifik dan waktu kejadian dibutuhkan untuk diagnosis.";
      verify="Catat kode error lengkap, waktu kejadian, status layanan hosting, error log, penggunaan resource, dan perubahan terakhir. Jangan menjanjikan bahwa masalah berasal dari hosting sebelum memeriksa log.";
      parts.explanation="Error tersebut biasanya menunjukkan bahwa server atau aplikasi website sedang gagal memproses permintaan. Penyebabnya bisa berasal dari konfigurasi, aplikasi, atau layanan server, sehingga perlu diperiksa lebih lanjut.";
      parts.nextStep="Kami akan meninjau kode error dan kondisi website terlebih dahulu sebelum menentukan tindakan perbaikannya.";
      parts.question="Apakah error muncul setiap kali website dibuka? Jika memungkinkan, boleh kirimkan screenshot dan alamat halaman yang mengalami kendala?";
    }else if(/lambat|loading|lemot|kecepatan|speed/.test(q)){
      intent="Pelanggan mengeluhkan performa atau waktu muat website yang lambat.";
      explanation="Kecepatan website dapat dipengaruhi ukuran gambar, jumlah script, cache, koneksi jaringan, respons server, dan layanan pihak ketiga. Perlu menguji halaman tertentu dan perangkat/jaringan yang digunakan.";
      verify="Uji URL yang sama, perangkat dan jaringan berbeda; periksa ukuran gambar, script pihak ketiga, cache, serta waktu respons server sebelum memilih optimasi.";
      parts.explanation="Website yang lambat dapat dipengaruhi beberapa faktor, seperti ukuran gambar, script yang dimuat, cache, koneksi, atau respons server. Kita perlu memeriksa halaman yang dimaksud agar penyebabnya tidak ditebak.";
      parts.nextStep="Kami akan mengevaluasi halaman tersebut dan mencari bagian yang paling memengaruhi waktu muat website.";
      parts.question="Halaman mana yang terasa lambat, dan apakah kendala terjadi di HP, komputer, atau keduanya?";
    }else if(/mobile|hp|ponsel|responsif|responsive|tampilan.*layar/.test(q)){
      intent="Pelanggan menanyakan tampilan website pada perangkat mobile atau masalah responsivitas.";
      explanation="Tampilan mobile dapat dipengaruhi breakpoint CSS, ukuran elemen, navigasi, dan konten yang memiliki lebar tetap. Perlu mengetahui perangkat, browser, dan halaman yang bermasalah.";
      verify="Minta URL halaman, jenis perangkat, browser, dan screenshot. Bandingkan viewport serta periksa overflow horizontal dan elemen yang tidak menyesuaikan ukuran layar.";
      parts.explanation="Tampilan mobile diatur agar elemen website menyesuaikan ukuran layar. Jika ada bagian yang terpotong atau tidak rapi, biasanya perlu diperiksa pada layout dan aturan responsif halaman tersebut.";
      parts.nextStep="Kami akan memeriksa tampilan halaman pada ukuran layar yang digunakan dan menyesuaikan bagian yang bermasalah.";
      parts.question="Boleh kirimkan screenshot, tipe HP, dan halaman yang tampilannya kurang sesuai?";
    }else{
      intent="Pelanggan meminta penjelasan atau bantuan terkait: "+question.trim();
      explanation="Informasi yang tersedia belum cukup untuk memastikan penyebab atau memberikan solusi teknis yang spesifik. Lebih aman meminta detail tambahan sebelum menyampaikan kepastian kepada pelanggan.";
      verify="Gunakan konteks proyek dan dokumentasi yang sudah disetujui. Jika pertanyaan menyangkut biaya, jadwal, keamanan, atau perubahan scope, pastikan detailnya sebelum memberi komitmen.";
      parts.explanation="Terima kasih sudah menjelaskan kebutuhannya. Agar kami tidak memberikan informasi yang keliru, kami ingin memastikan beberapa detail terlebih dahulu.";
      parts.nextStep="Setelah detailnya kami terima, kami akan meninjau kebutuhan tersebut dan menyampaikan langkah yang paling sesuai.";
    }

    if(extraContext.trim()){
      verify+=" Konteks tambahan dari owner yang perlu dipertimbangkan: "+extraContext.trim();
    }
    return {intent:intent,explanation:explanation,verify:verify,parts:parts};
  }

  function buildDraft(){
    var selected=Array.prototype.slice.call(modal.querySelectorAll("[data-ai-part]:checked"));
    draftField.value=selected.map(function(input){return generatedParts[input.getAttribute("data-ai-part")]||"";}).filter(Boolean).join("\n\n");
  }

  function analyze(){
    var question=questionField.value.trim();
    if(!question){notify("Masukkan pertanyaan pelanggan terlebih dahulu.");questionField.focus();return;}
    var analysis=getAnalysis(question,contextField.value||"");
    generatedParts=analysis.parts;
    document.getElementById("aiIntent").textContent=analysis.intent;
    document.getElementById("aiExplanation").textContent=analysis.explanation;
    document.getElementById("aiVerify").textContent=analysis.verify;
    document.getElementById("aiPartGreeting").textContent=analysis.parts.greeting;
    document.getElementById("aiPartExplanation").textContent=analysis.parts.explanation;
    document.getElementById("aiPartNextStep").textContent=analysis.parts.nextStep;
    document.getElementById("aiPartQuestion").textContent=analysis.parts.question;
    modal.querySelectorAll("[data-ai-part]").forEach(function(input){input.checked=true;});
    emptyState.hidden=true;
    results.hidden=false;
    buildDraft();
    notify("Simulasi bantuan AI selesai. Periksa dan pilih bagian jawaban.");
  }

  openButton.addEventListener("click",openModal);
  modal.querySelectorAll("[data-ai-close]").forEach(function(button){button.addEventListener("click",closeModal);});
  document.addEventListener("keydown",function(event){if(event.key==="Escape"&&!modal.hidden)closeModal();});
  document.getElementById("aiAnalyzeButton").addEventListener("click",analyze);
  modal.querySelectorAll("[data-ai-part]").forEach(function(input){input.addEventListener("change",buildDraft);});
  document.getElementById("aiUseDraft").addEventListener("click",function(){
    var draft=draftField.value.trim();
    if(!draft){notify("Pilih setidaknya satu bagian jawaban.");return;}
    var composer=document.getElementById("composerInput");
    composer.value=draft;
    closeModal();
    composer.focus();
    notify("Draft dimasukkan ke kolom balasan. Periksa sebelum mengirim.");
  });
  document.getElementById("aiCopyDraft").addEventListener("click",function(){
    var draft=draftField.value.trim();
    if(!draft){notify("Belum ada draft untuk disalin.");return;}
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(draft).then(function(){notify("Draft berhasil disalin.");}).catch(function(){draftField.focus();draftField.select();notify("Pilih teks lalu salin secara manual.");});
    }else{
      draftField.focus();draftField.select();notify("Pilih teks lalu salin secara manual.");
    }
  });
})();
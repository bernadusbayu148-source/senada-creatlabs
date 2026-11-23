(() => {
  const form = document.getElementById("agent-prompt-form");
  if (!form) return;

  const promptInput = document.getElementById("agent-prompt");
  const messages = document.getElementById("agent-messages");
  const runButton = document.getElementById("agent-run-button");
  const runStatus = document.getElementById("agent-run-status");
  const runTitle = document.getElementById("agent-run-title");
  const runDescription = document.getElementById("agent-run-description");
  const progressBar = document.getElementById("agent-progress-bar");
  const steps = [...document.querySelectorAll("#agent-steps li")];
  const reviewEmpty = document.getElementById("agent-review-empty");
  const reviewCard = document.getElementById("agent-review-card");
  const approvalStatus = document.getElementById("agent-approval-status");
  const approveButton = document.getElementById("agent-approve");
  const reviseButton = document.getElementById("agent-revise");
  const toast = document.getElementById("toast");
  let running = false;
  let toastTimer;

  function notify(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  function addMessage(type, message) {
    const article = document.createElement("article");
    article.className = "agent-message agent-message-" + type;

    const avatar = document.createElement("span");
    avatar.className = "agent-message-avatar";
    avatar.textContent = type === "assistant" ? "✳" : "B";

    const body = document.createElement("div");
    body.className = "agent-message-body";

    const meta = document.createElement("div");
    meta.className = "agent-message-meta";

    const author = document.createElement("strong");
    author.textContent = type === "assistant" ? "Senada Agent" : "You";

    const time = document.createElement("time");
    time.textContent = "Just now";
    meta.append(author, time);

    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    body.append(meta, paragraph);
    article.append(avatar, body);
    messages.append(article);
    messages.scrollTop = messages.scrollHeight;
  }

  function setProgress(completedCount) {
    steps.forEach((step, index) => {
      step.classList.toggle("is-complete", index < completedCount);
      step.classList.toggle("is-current", index === completedCount);
      step.classList.toggle("is-pending", index > completedCount);
    });
    progressBar.style.width = Math.max(20, Math.min(100, completedCount * 20)) + "%";
  }

  function resetReview() {
    reviewCard.hidden = true;
    reviewEmpty.hidden = false;
    approvalStatus.textContent = "Menunggu keputusan owner.";
    approveButton.disabled = false;
    reviseButton.disabled = false;
  }

  function runAgent(task) {
    if (running || !task.trim()) return;
    running = true;
    addMessage("user", task.trim());
    promptInput.value = "";
    runButton.disabled = true;
    runButton.textContent = "Agent sedang bekerja...";
    runStatus.textContent = "RUNNING DEMO";
    runTitle.textContent = "Menyiapkan alur kerja";
    runDescription.textContent = "Simulasi sedang memperlihatkan tahapan yang akan dilakukan Agent.";
    setProgress(1);
    resetReview();

    window.setTimeout(() => {
      runTitle.textContent = "Proposal siap ditinjau";
      runDescription.textContent = "Simulasi selesai. Tidak ada repository yang dibaca dan tidak ada file yang diubah.";
      runStatus.textContent = "REVIEW REQUIRED";
      setProgress(4);
      reviewEmpty.hidden = true;
      reviewCard.hidden = false;
      addMessage("assistant", "Untuk tugas ini, alur Agent akan memeriksa file yang relevan, merencanakan perubahan, menyiapkan diff, dan menjalankan pemeriksaan. Panel kanan menampilkan contoh proposal agar Anda dapat mencoba proses review dan persetujuan.");
      notify("Simulasi Agent selesai. Periksa contoh proposal di panel kanan.");
      running = false;
      runButton.disabled = false;
      runButton.innerHTML = 'Jalankan Agent <span>↗</span>';
    }, 720);
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    runAgent(promptInput.value);
  });

  promptInput.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  document.querySelectorAll("[data-agent-prompt]").forEach(button => {
    button.addEventListener("click", () => {
      promptInput.value = button.dataset.agentPrompt;
      promptInput.focus();
    });
  });

  document.querySelectorAll("[data-agent-file]").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-agent-file]").forEach(file => file.classList.toggle("is-selected", file === button));
      const path = button.dataset.agentFile;
      const descriptions = {
        "index.html": "Halaman utama dan struktur konten proyek. Informasi ini hanya contoh untuk memperlihatkan konteks Agent.",
        "styles.css": "Aturan tampilan, warna, jarak, dan responsive layout. Konten file belum dibaca.",
        "app.js": "Interaksi antarmuka dan perilaku komponen. Konten file belum dibaca.",
        "README.md": "Dokumentasi proyek dan petunjuk penggunaan. Konten file belum dibaca."
      };
      document.getElementById("agent-selected-file").textContent = path;
      document.getElementById("agent-file-description").textContent = descriptions[path] || "Contoh file proyek.";
    });
  });

  document.getElementById("agent-project-select").addEventListener("change", event => {
    const sample = event.target.value === "aure";
    document.getElementById("agent-repo-name").textContent = sample ? "aure-studio-demo" : "senada-creatlabs";
    document.getElementById("agent-repo-owner").textContent = sample ? "senada-samples / illustrative" : "bernadusbayu148-source / public";
    notify("Konteks proyek demo diperbarui.");
  });

  approveButton.addEventListener("click", () => {
    approvalStatus.textContent = "Disetujui di simulasi. GitHub tetap tidak berubah.";
    approvalStatus.classList.add("is-approved");
    approveButton.disabled = true;
    reviseButton.disabled = true;
    runStatus.textContent = "APPROVED · DEMO";
    runTitle.textContent = "Persetujuan simulasi tercatat";
    setProgress(5);
    addMessage("assistant", "Persetujuan contoh tercatat di tampilan ini. Pada sistem sebenarnya, persetujuan harus terikat pada diff yang tepat sebelum backend membuat branch dan pull request.");
    notify("Persetujuan simulasi dicatat. Tidak ada commit dibuat.");
  });

  reviseButton.addEventListener("click", () => {
    approvalStatus.textContent = "Revisi diminta di simulasi. Proposal belum disetujui.";
    approvalStatus.classList.remove("is-approved");
    approveButton.disabled = true;
    reviseButton.disabled = true;
    runStatus.textContent = "REVISION REQUESTED";
    runTitle.textContent = "Menunggu instruksi revisi";
    addMessage("assistant", "Catatan revisi contoh dicatat di tampilan ini. Tidak ada perubahan kode yang diterapkan.");
    notify("Permintaan revisi simulasi dicatat.");
  });

  document.getElementById("agent-reset").addEventListener("click", () => {
    messages.replaceChildren();
    addMessage("assistant", "Sesi demo baru siap. Tulis instruksi atau pilih salah satu contoh tugas untuk mencoba Agent Mode.");
    runStatus.textContent = "READY";
    runTitle.textContent = "Belum ada tugas aktif";
    runDescription.textContent = "Kirim instruksi untuk melihat alur kerja Agent dalam simulasi.";
    setProgress(1);
    resetReview();
    approvalStatus.classList.remove("is-approved");
    notify("Sesi Agent demo direset.");
  });
})();

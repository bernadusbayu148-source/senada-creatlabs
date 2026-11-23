(() => {
  const screens = [...document.querySelectorAll("[data-screen]")];
  const toast = document.getElementById("toast");
  let toastTimer;

  function notify(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2300);
  }

  function showScreen(name, updateHash = true) {
    const target = screens.some(screen => screen.dataset.screen === name) ? name : "login";
    screens.forEach(screen => screen.classList.toggle("is-active", screen.dataset.screen === target));
    if (updateHash && location.hash !== "#/" + target) history.pushState({ screen: target }, "", "#/" + target);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function showTab(name) {
    document.querySelectorAll("[data-tab]").forEach(tab => tab.classList.toggle("is-visible", tab.dataset.tab === name));
    document.querySelectorAll("[data-dashboard-tab]").forEach(button => button.classList.toggle("is-current", button.dataset.dashboardTab === name));
    const labels = { overview: "Overview", projects: "Project Preview", deploy: "Deployment", settings: "Pengaturan" };
    document.getElementById("dash-crumb").textContent = labels[name] || "Overview";
  }

  document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => showScreen(button.dataset.go));
  });

  document.getElementById("demo-login-form").addEventListener("submit", event => {
    event.preventDefault();
    showScreen("dashboard");
    showTab("overview");
    notify("Selamat datang di Senada Desk demo.");
  });

  document.querySelectorAll("[data-dashboard-tab]").forEach(button => {
    button.addEventListener("click", () => showTab(button.dataset.dashboardTab));
  });

  document.querySelector(".alert-close").addEventListener("click", () => {
    document.querySelector(".demo-alert").remove();
  });

  const themeButtons = document.querySelectorAll(".theme-toggle");
  function setTheme(theme) {
    document.body.dataset.theme = theme;
    try { localStorage.setItem("senada-preview-lab-theme", theme); } catch (_) {}
    themeButtons.forEach(button => button.textContent = theme === "dark" ? "☾" : "☼");
  }
  let initialTheme = "light";
  try { initialTheme = localStorage.getItem("senada-preview-lab-theme") || "light"; } catch (_) {}
  setTheme(initialTheme);
  themeButtons.forEach(button => button.addEventListener("click", () => setTheme(document.body.dataset.theme === "dark" ? "light" : "dark")));

  const unlockForm = document.getElementById("unlock-form");
  const passwordInput = document.getElementById("client-password");
  const passwordError = document.getElementById("password-error");
  unlockForm.addEventListener("submit", event => {
    event.preventDefault();
    if (passwordInput.value.trim() === "SENADA-DEMO") {
      passwordError.classList.remove("is-visible");
      showScreen("preview");
      notify("Akses demo berhasil dibuka.");
    } else {
      passwordError.classList.add("is-visible");
      passwordInput.focus();
    }
  });

  document.getElementById("toggle-password").addEventListener("click", () => {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  });

  document.getElementById("copy-demo-password").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("SENADA-DEMO");
      notify("Password demo berhasil disalin.");
    } catch (_) {
      passwordInput.value = "SENADA-DEMO";
      passwordInput.focus();
      notify("Password demo ditampilkan di kolom.");
    }
  });

  document.querySelectorAll("[data-mode]").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-mode]").forEach(choice => {
        const selected = choice === button;
        choice.classList.toggle("is-selected", selected);
        choice.setAttribute("aria-pressed", String(selected));
      });
      document.getElementById("deploy-description").textContent =
        button.dataset.mode === "manual" ? "Manual deployment dipilih." : "Automatic deployment dipilih.";
      notify(button.dataset.mode === "manual" ? "Mode manual dipilih." : "Mode otomatis dipilih.");
    });
  });

  document.getElementById("simulate-deploy").addEventListener("click", () => {
    const method = document.querySelector("[data-mode].is-selected").dataset.mode;
    document.querySelector(".deploy-status").textContent = "Deployment simulated!";
    document.getElementById("deploy-time").textContent = "Aure Studio · Just now · " + (method === "manual" ? "Manual" : "Automatic");
    document.querySelector(".deploy-progress i").style.width = "100%";
    notify("Simulasi deployment selesai. Hosting belum terhubung.");
  });

  document.getElementById("copy-url").addEventListener("click", async () => {
    const url = "https://preview.senada.test/p/aure-studio";
    try { await navigator.clipboard.writeText(url); notify("URL demo berhasil disalin."); }
    catch (_) { notify(url); }
  });

  const dialog = document.getElementById("project-dialog");
  ["open-settings", "open-settings-2", "open-settings-3"].forEach(id => {
    document.getElementById(id).addEventListener("click", () => dialog.showModal());
  });
  document.getElementById("cancel-settings").addEventListener("click", () => dialog.close());
  document.getElementById("save-settings").addEventListener("click", () => {
    const value = document.getElementById("edit-project-name").value.trim();
    if (!value) { notify("Nama proyek tidak boleh kosong."); return; }
    document.getElementById("project-name").textContent = value;
    dialog.close();
    notify("Perubahan demo disimpan di tampilan ini.");
  });

  document.querySelectorAll(".aure-menu").forEach(button => {
    button.addEventListener("click", () => notify("Navigasi mobile website contoh."));
  });

  function syncFromHash() {
    const name = location.hash.replace(/^#\/?/, "") || "login";
    showScreen(name, false);
  }
  window.addEventListener("popstate", syncFromHash);
  window.addEventListener("hashchange", syncFromHash);
  syncFromHash();
})();
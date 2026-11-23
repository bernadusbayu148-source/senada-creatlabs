<?php
declare(strict_types=1);

function senada_config(): array {
    static $config = null;
    if ($config !== null) return $config;
    $path = getenv('SENADA_CONFIG_PATH') ?: dirname(__DIR__) . '/config.php';
    if (!is_file($path)) {
        throw new RuntimeException('Konfigurasi server belum tersedia. Salin config.example.php menjadi config.php di luar document root.');
    }
    $loaded = require $path;
    if (!is_array($loaded)) throw new RuntimeException('Format config.php tidak valid.');
    foreach (['db', 'app_secret', 'preview_storage_path'] as $key) {
        if (empty($loaded[$key])) throw new RuntimeException('Konfigurasi server belum lengkap: ' . $key);
    }
    if (strlen((string)$loaded['app_secret']) < 64) {
        throw new RuntimeException('app_secret harus berupa secret acak minimal 64 karakter.');
    }
    $config = $loaded;
    return $config;
}

function senada_db(): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;
    $cfg = senada_config()['db'];
    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', $cfg['host'] ?? 'localhost', $cfg['name'] ?? '', $cfg['charset'] ?? 'utf8mb4');
    $pdo = new PDO($dsn, (string)($cfg['user'] ?? ''), (string)($cfg['pass'] ?? ''), [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}

function senada_start_session(string $name): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.cookie_httponly', '1');
    ini_set('session.cookie_samesite', 'Lax');
    $secure = (!empty($_SERVER['HTTPS']) && strtolower((string)$_SERVER['HTTPS']) !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    session_name($name);
    session_set_cookie_params(['lifetime'=>0, 'path'=>'/', 'secure'=>$secure, 'httponly'=>true, 'samesite'=>'Lax']);
    session_start();
    $now = time();
    $last = (int)($_SESSION['_last_activity'] ?? $now);
    $created = (int)($_SESSION['_session_created'] ?? $now);
    if (($now - $last) > 1800 || ($now - $created) > 28800) {
        $_SESSION = [];
        session_regenerate_id(true);
        $created = $now;
    }
    $_SESSION['_session_created'] = $created;
    $_SESSION['_last_activity'] = $now;
}

function senada_csrf_token(string $key = '_csrf'): string {
    if (empty($_SESSION[$key]) || !is_string($_SESSION[$key])) $_SESSION[$key] = bin2hex(random_bytes(32));
    return $_SESSION[$key];
}

function senada_json_body(): array {
    static $body = null;
    if ($body !== null) return $body;
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') { $body = $_POST; return $body; }
    $decoded = json_decode($raw, true);
    $body = is_array($decoded) ? $decoded : $_POST;
    return $body;
}

function senada_json(array $payload, int $status = 200): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, private');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function senada_verify_csrf(string $key = '_csrf'): void {
    $sent = (string)($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
    if ($sent === '') $sent = (string)(senada_json_body()['_csrf'] ?? '');
    $expected = (string)($_SESSION[$key] ?? '');
    if ($expected === '' || $sent === '' || !hash_equals($expected, $sent)) {
        senada_json(['ok'=>false, 'error'=>'Sesi keamanan tidak valid. Muat ulang halaman dan coba lagi.'], 419);
    }
}

function senada_require_method(string $method): void {
    if (strtoupper((string)($_SERVER['REQUEST_METHOD'] ?? 'GET')) !== strtoupper($method)) {
        senada_json(['ok'=>false, 'error'=>'Metode request tidak didukung.'], 405);
    }
}

function senada_current_admin(): ?array {
    $admin = $_SESSION['admin'] ?? null;
    return is_array($admin) && !empty($admin['id']) ? $admin : null;
}

function senada_require_admin(): array {
    $admin = senada_current_admin();
    if (!$admin) senada_json(['ok'=>false, 'error'=>'Silakan login kembali.'], 401);
    $stmt = senada_db()->prepare('SELECT id,email,role,is_active FROM admins WHERE id=:id LIMIT 1');
    $stmt->execute([':id'=>(int)$admin['id']]);
    $fresh = $stmt->fetch();
    if (!$fresh || (int)$fresh['is_active'] !== 1) {
        unset($_SESSION['admin']);
        senada_json(['ok'=>false, 'error'=>'Akun admin tidak aktif. Silakan hubungi owner.'], 401);
    }
    $_SESSION['admin'] = ['id'=>(int)$fresh['id'], 'email'=>(string)$fresh['email'], 'role'=>(string)$fresh['role']];
    return $_SESSION['admin'];
}

function senada_ip_hash(): string {
    return hash_hmac('sha256', (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown'), (string)senada_config()['app_secret']);
}

function senada_valid_slug(string $slug): bool {
    return (bool)preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug) && strlen($slug) <= 50;
}

function senada_repo_parts(string $url): ?array {
    $url = preg_replace('/\.git$/i', '', trim($url));
    $parts = parse_url($url);
    if (!$parts || strtolower((string)($parts['scheme'] ?? '')) !== 'https'
        || strtolower((string)($parts['host'] ?? '')) !== 'github.com'
        || !empty($parts['query']) || !empty($parts['fragment'])) return null;
    $segments = array_values(array_filter(explode('/', trim((string)($parts['path'] ?? ''), '/')), 'strlen'));
    if (count($segments) !== 2) return null;
    foreach ($segments as $segment) {
        if (!preg_match('/^[A-Za-z0-9_.-]{1,100}$/', $segment) || $segment === '.' || $segment === '..') return null;
    }
    return ['owner'=>$segments[0], 'repo'=>$segments[1], 'url'=>'https://github.com/' . $segments[0] . '/' . $segments[1]];
}

function senada_login_attempts_blocked(PDO $db, string $table, string $whereSql, array $params, int $limit = 10): bool {
    $sql = "SELECT COUNT(*) FROM {$table} WHERE ({$whereSql}) AND succeeded = 0 AND attempted_at >= (NOW() - INTERVAL 15 MINUTE)";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    return (int)$stmt->fetchColumn() >= $limit;
}

function senada_login_page(string $message = ''): never {
    http_response_code(200);
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-store, private');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: no-referrer');
    header('X-Content-Type-Options: nosniff');
    $safe = htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

    $html = <<<'HTML'
<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <meta name="theme-color" content="#f7f5f0">
  <title>Masuk · Senada Desk</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root{--violet:#5c43ed;--ink:#27243a;--muted:#898596;--paper:#f7f5f0}
    *{box-sizing:border-box}
    body{margin:0;min-height:100vh;background:var(--paper);color:var(--ink);font-family:"DM Sans",sans-serif}
    .login-shell{min-height:100vh;display:grid;grid-template-columns:minmax(340px,.95fr) minmax(420px,1.05fr);padding:18px}
    .login-art{position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;min-height:calc(100vh - 36px);padding:38px 42px;border-radius:25px;background:radial-gradient(circle at 78% 16%,#8d7bff 0,transparent 29%),linear-gradient(145deg,#5d47e8 0%,#4432b6 52%,#292064 100%);color:#fff}
    .brand{display:flex;align-items:center;gap:11px;color:#fff;text-decoration:none}
    .brand-mark{display:grid;place-items:center;width:39px;height:39px;padding:0;background:#fff;color:#5c43ed;border-radius:13px;font:700 18px "Space Grotesk",sans-serif}
    .brand-word{font:700 19px "Space Grotesk",sans-serif;letter-spacing:-.06em}
    .brand-word small{display:block;margin-top:1px;font:700 7px "DM Sans",sans-serif;letter-spacing:.23em;opacity:.72}
    .art-copy{position:relative;z-index:2;max-width:480px;margin:45px 0}
    .art-kicker{display:inline-flex;align-items:center;gap:8px;padding:8px 11px;border:1px solid #ffffff3d;border-radius:99px;background:#ffffff12;color:#eeeaff;font:700 8px "Space Grotesk",sans-serif;letter-spacing:.14em}
    .art-kicker i{width:6px;height:6px;border-radius:50%;background:#d8f48b;box-shadow:0 0 0 4px #d8f48b22}
    .art-copy h1{margin:20px 0 13px;font:700 clamp(35px,4.2vw,57px)/1.06 "Space Grotesk",sans-serif;letter-spacing:-.065em}
    .art-copy h1 span{color:#d8f48b}
    .art-copy p{max-width:390px;margin:0;color:#e4e0ff;font-size:13px;line-height:1.8}
    .art-orbit{position:absolute;width:330px;height:330px;right:-75px;bottom:13%;border:1px solid #ffffff30;border-radius:50%}
    .art-orbit:before,.art-orbit:after{content:"";position:absolute;border:1px solid #ffffff26;border-radius:50%}
    .art-orbit:before{inset:34px}.art-orbit:after{inset:72px}
    .art-spark{position:absolute;right:17%;bottom:27%;font-size:62px;color:#d8f48b;transform:rotate(12deg);text-shadow:0 12px 30px #21185c70}
    .art-foot{position:relative;z-index:2;display:flex;justify-content:space-between;gap:12px;color:#d5d0ff;font-size:9px}
    .login-main{display:grid;place-items:center;padding:30px}
    .login-card{width:min(420px,100%)}
    .login-topline{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px}
    .login-topline span{font:700 9px "Space Grotesk",sans-serif;letter-spacing:.16em;color:#8d8799}
    .secure-tag{display:inline-flex;align-items:center;gap:6px;padding:7px 9px;border:1px solid #dce9c5;border-radius:99px;background:#f4f9e9;color:#617a30;font:700 7px "Space Grotesk",sans-serif;letter-spacing:.08em}
    .secure-tag i{width:6px;height:6px;border-radius:50%;background:#8aa64d}
    .login-mark{display:grid;place-items:center;width:48px;height:48px;padding:9px;border-radius:15px;background:#5c43ed;box-shadow:0 10px 22px #5c43ed30}
    .login-mark-letter{color:#fff;font:700 22px "Space Grotesk",sans-serif}
    .login-eyebrow{margin:22px 0 8px;color:var(--violet);font:700 9px "Space Grotesk",sans-serif;letter-spacing:.16em}
    h1{margin:0;font:700 31px "Space Grotesk",sans-serif;letter-spacing:-.055em}
    .login-intro{margin:9px 0 26px;color:var(--muted);font-size:11px;line-height:1.7}
    .field{display:block;margin:17px 0}
    .field>span{display:block;margin-bottom:8px;font-size:10px;font-weight:700;color:#4d495b}
    .field input{width:100%;height:48px;padding:0 14px;border:1px solid #e2deea;border-radius:11px;outline:none;background:#fff;color:var(--ink);font:500 12px "DM Sans",sans-serif;transition:border-color .15s,box-shadow .15s}
    .field input:focus{border-color:#8a79f4;box-shadow:0 0 0 4px #5c43ed13}
    .password-wrap{position:relative}
    .password-wrap input{padding-right:76px}
    .show-password{position:absolute;right:9px;top:50%;transform:translateY(-50%);border:0;background:transparent;color:#756e89;font:700 9px "DM Sans",sans-serif;cursor:pointer;padding:7px}
    .login-submit{width:100%;height:48px;margin-top:9px;border:0;border-radius:11px;background:var(--violet);color:#fff;font:700 11px "DM Sans",sans-serif;cursor:pointer;box-shadow:0 9px 20px #5c43ed2a}
    .login-submit:disabled{opacity:.65;cursor:wait}
    .login-error{min-height:22px;margin:13px 0 0;color:#b04f49;font-size:9px;line-height:1.55}
    .login-foot{margin-top:28px;color:#aaa5b2;text-align:center;font-size:8px;line-height:1.6}
    @media(max-width:850px){.login-shell{grid-template-columns:1fr;padding:10px}.login-art{min-height:270px;padding:25px 27px;border-radius:20px}.art-copy{margin:35px 0 24px}.art-copy h1{font-size:35px;margin:13px 0 8px}.art-copy p{font-size:10px;max-width:430px}.art-orbit{width:210px;height:210px;right:-55px;bottom:-70px}.art-orbit:before{inset:22px}.art-orbit:after{inset:48px}.art-spark{right:17%;bottom:23%;font-size:42px}.art-foot{font-size:8px}.login-main{padding:38px 18px 28px}}
    @media(max-width:480px){.login-art{min-height:240px;padding:21px}.brand-mark{width:34px;height:34px}.brand-word{font-size:17px}.art-copy{margin:26px 0 19px}.art-copy h1{font-size:31px}.art-copy p{max-width:300px}.art-spark{right:11%;bottom:22%;font-size:35px}.art-foot span:last-child{display:none}.login-main{padding:34px 12px}.login-card h1{font-size:27px}.login-topline{margin-bottom:22px}}
  </style>
</head>
<body>
  <div class="login-shell">
    <aside class="login-art">
      <a class="brand" href="/" aria-label="Senada Creatlabs">
        <span class="brand-mark" aria-hidden="true">S</span>
        <span class="brand-word">senada<span style="color:#d8f48b">.</span><small>CREATLABS</small></span>
      </a>
      <div class="art-copy">
        <span class="art-kicker"><i></i> YOUR CREATIVE WORKSPACE</span>
        <h1>Ide bagus.<br><span>Eksekusi lebih terarah.</span></h1>
        <p>Satu ruang untuk mengelola percakapan, merapikan kebutuhan klien, dan membawa setiap ide menuju proyek yang nyata.</p>
      </div>
      <div class="art-orbit" aria-hidden="true"></div>
      <div class="art-spark" aria-hidden="true">✳</div>
      <div class="art-foot"><span>Made for ideas that move.</span><span>Senada Desk · Admin Workspace</span></div>
    </aside>
    <main class="login-main">
      <section class="login-card">
        <div class="login-topline"><span>ADMIN ACCESS</span><span class="secure-tag"><i></i> SECURE SESSION</span></div>
        <div class="login-mark"><span class="login-mark-letter" aria-hidden="true">S</span></div>
        <div class="login-eyebrow">SENADA CREATLABS</div>
        <h1>Selamat datang kembali.</h1>
        <p class="login-intro">Masuk ke Senada Desk untuk melanjutkan percakapan dan mengelola proyek klien.</p>
        <form id="loginForm" autocomplete="on">
          <label class="field"><span>Email admin</span><input name="email" type="email" placeholder="nama@senada.id" autocomplete="username" required maxlength="190"></label>
          <label class="field"><span>Password</span><div class="password-wrap"><input id="loginPassword" name="password" type="password" placeholder="Masukkan password" autocomplete="current-password" required maxlength="72"><button class="show-password" id="togglePassword" type="button">Lihat</button></div></label>
          <button class="login-submit" id="loginSubmit" type="submit">Masuk ke workspace <span aria-hidden="true">↗</span></button>
          <div class="login-error" id="loginError" role="alert">__LOGIN_ERROR__</div>
        </form>
        <p class="login-foot">Akses khusus tim Senada Creatlabs.<br>Jangan bagikan detail akun kepada siapa pun.</p>
      </section>
    </main>
  </div>
  <script>
    (function(){
      var form=document.getElementById("loginForm");
      var error=document.getElementById("loginError");
      var submit=document.getElementById("loginSubmit");
      var password=document.getElementById("loginPassword");
      var toggle=document.getElementById("togglePassword");
      toggle.addEventListener("click",function(){
        var visible=password.type==="text";
        password.type=visible?"password":"text";
        toggle.textContent=visible?"Lihat":"Sembunyikan";
      });
      form.addEventListener("submit",async function(event){
        event.preventDefault();
        submit.disabled=true;
        submit.textContent="Sedang masuk...";
        error.textContent="Memeriksa akun...";
        var data=new FormData(form);
        try{
          var csrfResponse=await fetch("/api.php?action=csrf",{credentials:"same-origin",cache:"no-store"});
          if(!csrfResponse.ok)throw new Error("Server belum siap. Periksa konfigurasi backend.");
          var csrfData=await csrfResponse.json();
          var response=await fetch("/api.php?action=login",{
            method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-Token":csrfData.csrf_token},
            body:JSON.stringify({email:data.get("email"),password:data.get("password")})
          });
          var result=await response.json();
          if(!response.ok||!result.ok)throw new Error(result.error||"Email atau password salah.");
          location.replace("/admin/");
        }catch(err){
          error.textContent=err.message||"Server tidak dapat dihubungi. Coba lagi.";
          submit.disabled=false;
          submit.textContent="Masuk ke workspace ↗";
        }
      });
    })();
  </script>
</body>
</html>
HTML;

    echo str_replace('__LOGIN_ERROR__', $safe, $html);
    exit;
}

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
    $safe = htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    echo '<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Login · Senada Desk</title><style>
    *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:22px;background:#f5f2ec;color:#242232;font:15px Arial,sans-serif}.card{width:min(420px,100%);padding:34px;background:#fff;border:1px solid #e8e2f0;border-radius:22px;box-shadow:0 18px 60px #26203312}.mark{width:44px;height:44px;display:grid;place-items:center;border-radius:14px;background:#5c43ed;color:white;font-weight:bold;font-size:22px}.eyebrow{margin:20px 0 8px;color:#7665c8;font-size:10px;font-weight:bold;letter-spacing:.16em}h1{margin:0 0 8px;font-size:27px;letter-spacing:-.04em}p{color:#777382;font-size:13px;line-height:1.6}label{display:block;margin-top:16px;font-size:12px;font-weight:bold}input{display:block;width:100%;height:46px;margin-top:7px;padding:0 12px;border:1px solid #ded9e8;border-radius:10px;font:inherit}button{width:100%;height:47px;margin-top:22px;border:0;border-radius:11px;background:#5c43ed;color:white;font-weight:bold;cursor:pointer}.error{min-height:18px;margin-top:12px;color:#b44d43;font-size:12px}.foot{margin-top:20px;font-size:11px;color:#a19cab;text-align:center}
    </style></head><body><main class="card"><div class="mark">S</div><div class="eyebrow">SENADA CREATLABS</div><h1>Admin workspace</h1><p>Masuk untuk mengelola project preview dan akses pelanggan.</p><form id="loginForm"><label>Email admin<input name="email" type="email" autocomplete="username" required maxlength="190"></label><label>Password<input name="password" type="password" autocomplete="current-password" required></label><button type="submit">Masuk ke dashboard</button><div class="error" id="loginError" role="alert">' . $safe . '</div></form><div class="foot">Akses khusus tim Senada · Jangan bagikan akun admin</div></main>
    <script>
    (function(){var form=document.getElementById("loginForm"),error=document.getElementById("loginError");form.addEventListener("submit",async function(e){e.preventDefault();error.textContent="Memeriksa akun...";var data=new FormData(form);try{var c=await fetch("/api.php?action=csrf",{credentials:"same-origin",cache:"no-store"});var cj=await c.json();var r=await fetch("/api.php?action=login",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","X-CSRF-Token":cj.csrf_token},body:JSON.stringify({email:data.get("email"),password:data.get("password")})});var j=await r.json();if(!r.ok||!j.ok){error.textContent=j.error||"Login gagal.";return;}location.replace("/admin/");}catch(err){error.textContent="Server belum dapat dihubungi. Periksa koneksi atau konfigurasi backend.";}});})();
    </script></body></html>';
    exit;
}

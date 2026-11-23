<?php
declare(strict_types=1);

require dirname(__DIR__) . '/app/bootstrap.php';
senada_start_session('senada_preview_session');

function preview_error_page(int $status, string $title, string $message): never {
    http_response_code($status);
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-store, private');
    $t = htmlspecialchars($title, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $m = htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    echo '<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>' . $t . '</title><style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:22px;background:#f5f2ec;color:#242232;font:15px Arial,sans-serif}.card{width:min(430px,100%);padding:34px;background:#fff;border:1px solid #e8e2f0;border-radius:22px;box-shadow:0 18px 60px #26203312}.mark{width:44px;height:44px;display:grid;place-items:center;border-radius:14px;background:#5c43ed;color:white;font-weight:bold;font-size:22px}h1{font-size:24px;margin:20px 0 8px}p{color:#777382;line-height:1.6;font-size:13px}</style></head><body><main class="card"><div class="mark">S</div><h1>' . $t . '</h1><p>' . $m . '</p></main></body></html>';
    exit;
}

function preview_login_form(string $slug, string $projectName, string $error = ''): never {
    http_response_code(200);
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-store, private');
    header('X-Content-Type-Options: nosniff');
    $safeName = htmlspecialchars($projectName, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $safeError = htmlspecialchars($error, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $csrf = htmlspecialchars(senada_csrf_token('_preview_csrf'), ENT_QUOTES, 'UTF-8');
    $action = '/p/' . rawurlencode($slug) . '/';
    echo '<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="referrer" content="no-referrer"><title>Private Preview · Senada</title><style>
    *{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:22px;background:#f5f2ec;color:#242232;font:15px Arial,sans-serif}.card{width:min(430px,100%);padding:34px;background:#fff;border:1px solid #e8e2f0;border-radius:22px;box-shadow:0 18px 60px #26203312}.mark{width:44px;height:44px;display:grid;place-items:center;border-radius:14px;background:#5c43ed;color:white;font-weight:bold;font-size:22px}.eyebrow{margin:20px 0 8px;color:#7665c8;font-size:10px;font-weight:bold;letter-spacing:.16em}h1{margin:0 0 8px;font-size:26px;letter-spacing:-.04em}p{color:#777382;font-size:13px;line-height:1.6}label{display:block;margin-top:18px;font-size:12px;font-weight:bold}input{display:block;width:100%;height:48px;margin-top:8px;padding:0 13px;border:1px solid #ded9e8;border-radius:10px;font:inherit}button{width:100%;height:48px;margin-top:20px;border:0;border-radius:11px;background:#5c43ed;color:white;font-weight:bold;cursor:pointer}.error{min-height:18px;margin-top:12px;color:#b44d43;font-size:12px}.foot{margin-top:20px;font-size:11px;color:#a19cab;text-align:center}
    </style></head><body><main class="card"><div class="mark">S</div><div class="eyebrow">SENADA CREATLABS · PRIVATE PREVIEW</div><h1>' . $safeName . '</h1><p>Website ini hanya dapat dibuka oleh orang yang memiliki password preview.</p><form method="post" action="' . $action . '"><input type="hidden" name="_csrf" value="' . $csrf . '"><label>Password preview<input type="password" name="password" autocomplete="current-password" required autofocus maxlength="72"></label><button type="submit">Buka project preview</button><div class="error" role="alert">' . $safeError . '</div></form><div class="foot">Akses terbatas · Senada Creatlabs</div></main></body></html>';
    exit;
}

try {
    $slug = strtolower(trim((string)($_GET['slug'] ?? '')));
    if (!senada_valid_slug($slug)) preview_error_page(404, 'Preview tidak ditemukan', 'Link preview tidak valid atau sudah tidak tersedia.');

    $db = senada_db();
    $stmt = $db->prepare('SELECT id,name,slug,password_hash,is_enabled FROM preview_projects WHERE slug=:slug LIMIT 1');
    $stmt->execute([':slug'=>$slug]);
    $project = $stmt->fetch();
    if (!$project || (int)$project['is_enabled'] !== 1) {
        preview_error_page(404, 'Preview tidak tersedia', 'Project ini tidak ditemukan atau aksesnya telah dicabut.');
    }

    $access = $_SESSION['preview_access'][$slug] ?? null;
    $now = time();
    $hasAccess = is_array($access)
        && (int)($access['project_id'] ?? 0) === (int)$project['id']
        && (int)($access['expires_at'] ?? 0) > $now
        && (int)($access['created_at'] ?? 0) + 28800 > $now
        && hash_equals((string)($access['password_fingerprint'] ?? ''), hash('sha256', (string)$project['password_hash']));

    if (!$hasAccess && ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
        $sentCsrf = (string)($_POST['_csrf'] ?? '');
        $expectedCsrf = (string)($_SESSION['_preview_csrf'] ?? '');
        if ($expectedCsrf === '' || $sentCsrf === '' || !hash_equals($expectedCsrf, $sentCsrf)) {
            preview_login_form($slug, (string)$project['name'], 'Sesi formulir tidak valid. Muat ulang halaman.');
        }

        $ipHash = senada_ip_hash();
        $blocked = senada_login_attempts_blocked($db, 'preview_login_attempts', 'project_id = :project_id AND ip_hash = :ip_hash', [
            ':project_id'=>(int)$project['id'], ':ip_hash'=>$ipHash
        ], 10);
        if ($blocked) preview_error_page(429, 'Terlalu banyak percobaan', 'Akses sementara dibatasi karena terlalu banyak percobaan password. Coba lagi dalam 15 menit.');

        $password = (string)($_POST['password'] ?? '');
        $valid = strlen($password) <= 72 && password_verify($password, (string)$project['password_hash']);
        $attempt = $db->prepare('INSERT INTO preview_login_attempts (project_id,ip_hash,succeeded) VALUES (:project,:ip,:success)');
        $attempt->execute([':project'=>(int)$project['id'], ':ip'=>$ipHash, ':success'=>$valid ? 1 : 0]);
        if (!$valid) {
            usleep(250000);
            preview_login_form($slug, (string)$project['name'], 'Password tidak cocok. Silakan coba lagi.');
        }

        session_regenerate_id(true);
        $_SESSION['_session_created'] = time();
        $_SESSION['_last_activity'] = time();
        $_SESSION['preview_access'][$slug] = [
            'project_id'=>(int)$project['id'],
            'created_at'=>time(),
            'expires_at'=>time()+1800,
            'password_fingerprint'=>hash('sha256', (string)$project['password_hash'])
        ];
        unset($_SESSION['_preview_csrf']);
        header('Location: /p/' . rawurlencode($slug) . '/', true, 303);
        exit;
    }

    if (!$hasAccess) preview_login_form($slug, (string)$project['name']);

    $_SESSION['preview_access'][$slug]['expires_at'] = min(
        (int)$_SESSION['preview_access'][$slug]['created_at'] + 28800,
        time() + 1800
    );

    $relative = rawurldecode((string)($_GET['path'] ?? ''));
    $relative = str_replace('\\', '/', $relative);
    if (str_contains($relative, "\0") || preg_match('#(^|/)\.\.?(/|$)#', $relative)) {
        preview_error_page(404, 'File tidak ditemukan', 'Path file tidak valid.');
    }
    $segments = array_values(array_filter(explode('/', $relative), 'strlen'));
    foreach ($segments as $segment) {
        if ($segment[0] === '.' || preg_match('/[\x00-\x1F]/', $segment)) {
            preview_error_page(404, 'File tidak ditemukan', 'Path file tidak diizinkan.');
        }
    }

    $storageRoot = rtrim((string)senada_config()['preview_storage_path'], DIRECTORY_SEPARATOR);
    $projectDir = realpath($storageRoot . DIRECTORY_SEPARATOR . $slug);
    if ($projectDir === false || !is_dir($projectDir)) {
        preview_error_page(503, 'Preview sedang disiapkan', 'Password benar, tetapi hasil deployment belum tersedia. Coba lagi setelah proses deploy selesai.');
    }

    $candidate = $projectDir . DIRECTORY_SEPARATOR . implode(DIRECTORY_SEPARATOR, $segments);
    if ($relative === '') $candidate = $projectDir . DIRECTORY_SEPARATOR . 'index.html';
    $target = realpath($candidate);
    if ($target !== false && is_dir($target)) $target = realpath($target . DIRECTORY_SEPARATOR . 'index.html');
    if ($target === false && ($relative === '' || !str_contains(basename($relative), '.'))) {
        $target = realpath($projectDir . DIRECTORY_SEPARATOR . 'index.html');
    }
    $prefix = rtrim($projectDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
    if ($target === false || !is_file($target) || !str_starts_with($target, $prefix)) {
        preview_error_page(404, 'Halaman tidak ditemukan', 'File yang diminta tidak tersedia di project preview ini.');
    }

    $extension = strtolower(pathinfo($target, PATHINFO_EXTENSION));
    if (in_array($extension, ['php','phtml','phar','htaccess','env','ini','log','sql','sh','cgi'], true)) {
        preview_error_page(404, 'File tidak tersedia', 'Jenis file ini tidak dapat ditayangkan melalui preview statis.');
    }

    $mime = [
        'html'=>'text/html; charset=utf-8', 'htm'=>'text/html; charset=utf-8',
        'css'=>'text/css; charset=utf-8', 'js'=>'application/javascript; charset=utf-8',
        'mjs'=>'application/javascript; charset=utf-8', 'json'=>'application/json; charset=utf-8',
        'svg'=>'image/svg+xml', 'xml'=>'application/xml; charset=utf-8',
        'txt'=>'text/plain; charset=utf-8', 'webmanifest'=>'application/manifest+json',
        'woff'=>'font/woff', 'woff2'=>'font/woff2', 'ttf'=>'font/ttf', 'otf'=>'font/otf',
        'png'=>'image/png', 'jpg'=>'image/jpeg', 'jpeg'=>'image/jpeg', 'gif'=>'image/gif',
        'webp'=>'image/webp', 'avif'=>'image/avif', 'ico'=>'image/x-icon',
        'mp4'=>'video/mp4', 'webm'=>'video/webm', 'mp3'=>'audio/mpeg', 'pdf'=>'application/pdf'
    ];
    $contentType = $mime[$extension] ?? 'application/octet-stream';
    header('Content-Type: ' . $contentType);
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: same-origin');
    header('Cache-Control: private, no-store');
    header('Content-Length: ' . (string)filesize($target));
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'HEAD') exit;
    readfile($target);
} catch (Throwable $error) {
    error_log('[Senada Preview] ' . $error->getMessage());
    preview_error_page(500, 'Preview mengalami gangguan', 'Server tidak dapat menampilkan preview saat ini. Silakan hubungi Senada Creatlabs.');
}

<?php
declare(strict_types=1);

$bootstrapPath = getenv('SENADA_APP_BOOTSTRAP') ?: dirname(__DIR__) . '/app/bootstrap.php';
if (!is_file($bootstrapPath)) {
    http_response_code(503);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Private Senada bootstrap path is not configured.';
    exit;
}
require $bootstrapPath;
senada_start_session('senada_admin_session');

$sessionAdmin = senada_current_admin();
if ($sessionAdmin) {
    try {
        $check = senada_db()->prepare('SELECT is_active FROM admins WHERE id=:id LIMIT 1');
        $check->execute([':id'=>(int)$sessionAdmin['id']]);
        $active = $check->fetchColumn();
        if ((int)$active !== 1) unset($_SESSION['admin']);
    } catch (Throwable $error) {
        http_response_code(503);
        header('Content-Type: text/plain; charset=utf-8');
        echo 'Backend admin belum siap. Periksa konfigurasi database.';
        exit;
    }
}
if (!senada_current_admin()) senada_login_page();

$adminUi = __DIR__ . '/admin/index.html';
if (!is_file($adminUi)) {
    http_response_code(503);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Folder admin/index.html belum disalin ke document root subdomain admin.';
    exit;
}
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store, private');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');
$html = file_get_contents($adminUi);
if ($html === false) {
    http_response_code(500);
    echo 'Dashboard tidak dapat dibaca.';
    exit;
}
$injected = '<script>window.SENADA_SERVER_MODE=true;window.SENADA_API_BASE="/api.php";document.body.classList.add("server-mode");</script><script src="/auth.js"></script>';
$html = str_replace('<script src="admin.js"></script>', $injected . '<script src="admin.js"></script>', $html);
echo $html;

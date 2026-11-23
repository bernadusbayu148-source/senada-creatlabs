<?php
declare(strict_types=1);

require dirname(__DIR__) . '/app/bootstrap.php';
senada_start_session('senada_admin_session');

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
$html = file_get_contents($adminUi);
if ($html === false) {
    http_response_code(500);
    echo 'Dashboard tidak dapat dibaca.';
    exit;
}
$injected = '<script>window.SENADA_SERVER_MODE=true;window.SENADA_API_BASE="/api.php";</script><script src="/auth.js"></script>';
$html = str_replace('<script src="admin.js"></script>', $injected . '<script src="admin.js"></script>', $html);
echo $html;

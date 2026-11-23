<?php
declare(strict_types=1);

// Jalankan melalui SSH/Terminal hosting: php create-admin.php owner@example.com
// Script ini hanya berjalan di CLI dan tidak menyediakan akun/password default.
if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit('Not found');
}
require dirname(__DIR__) . '/app/bootstrap.php';

$email = strtolower(trim($argv[1] ?? ''));
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fwrite(STDERR, "Pemakaian: php create-admin.php email@domain.com\n");
    exit(1);
}

$password = getenv('SENADA_ADMIN_PASSWORD') ?: '';
if ($password === '' && function_exists('stream_isatty') && stream_isatty(STDIN) && function_exists('shell_exec')) {
    $terminalState = trim((string)shell_exec('stty -g 2>/dev/null'));
    if ($terminalState !== '') {
        echo "Password admin (minimal 14 karakter): ";
        shell_exec('stty -echo');
        $password = rtrim((string)fgets(STDIN), "\r\n");
        shell_exec('stty ' . escapeshellarg($terminalState));
        echo "\n";
    }
}
putenv('SENADA_ADMIN_PASSWORD');
if (strlen($password) < 14 || strlen($password) > 1024) {
    fwrite(STDERR, "Password harus terdiri dari 14–1024 karakter. Jika terminal tidak mendukung input tersembunyi, set environment variable SENADA_ADMIN_PASSWORD sementara.\n");
    exit(1);
}

try {
    $db = senada_db();
    $stmt = $db->prepare("INSERT INTO admins (email,password_hash,role,is_active) VALUES (:email,:hash,'owner',1)");
    $stmt->execute([':email'=>$email, ':hash'=>password_hash($password, PASSWORD_DEFAULT)]);
    unset($password);
    fwrite(STDOUT, "Akun owner berhasil dibuat: {$email}\n");
} catch (Throwable $error) {
    unset($password);
    fwrite(STDERR, "Gagal membuat admin: " . $error->getMessage() . "\n");
    exit(1);
}

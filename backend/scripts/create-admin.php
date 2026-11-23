<?php
declare(strict_types=1);

// Jalankan melalui SSH/Terminal hosting: php create-admin.php owner@example.com
// Script ini tidak menyediakan akun/password default dan tidak dapat dijalankan via web.
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
if (!function_exists('readline')) {
    fwrite(STDERR, "PHP readline diperlukan untuk membuat admin melalui terminal.\n");
    exit(1);
}
$password = readline('Password admin (minimal 14 karakter): ');
if (strlen($password) < 14 || strlen($password) > 1024) {
    fwrite(STDERR, "Password harus terdiri dari 14–1024 karakter.\n");
    exit(1);
}
try {
    $db = senada_db();
    $stmt = $db->prepare("INSERT INTO admins (email,password_hash,role,is_active) VALUES (:email,:hash,'owner',1)");
    $stmt->execute([':email'=>$email, ':hash'=>password_hash($password, PASSWORD_DEFAULT)]);
    fwrite(STDOUT, "Akun owner berhasil dibuat: {$email}\n");
} catch (Throwable $error) {
    fwrite(STDERR, "Gagal membuat admin: " . $error->getMessage() . "\n");
    exit(1);
}

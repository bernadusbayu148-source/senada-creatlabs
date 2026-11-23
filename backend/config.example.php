<?php
declare(strict_types=1);

/*
 * Salin menjadi backend/config.php.
 * File config.php WAJIB berada di luar document root hosting dan jangan pernah di-commit.
 */
return [
    'db' => [
        'host' => 'localhost',
        'name' => 'ISI_NAMA_DATABASE',
        'user' => 'ISI_USER_DATABASE',
        'pass' => 'GANTI_DENGAN_PASSWORD_DATABASE',
        'charset' => 'utf8mb4',
    ],
    // Buat secret acak panjang dengan: php -r "echo bin2hex(random_bytes(32)), PHP_EOL;"
    'app_secret' => 'GANTI_DENGAN_SECRET_ACAK_MINIMAL_64_HEX',
    'preview_storage_path' => '/home/CPANEL_USER/senada-previews',
    'preview_base_url' => 'https://preview.example.com',
    // Fine-grained GitHub token. Kosongkan sampai integrasi GitHub siap.
    'github_token' => '',
    'github_api_version' => '2022-11-28',
];

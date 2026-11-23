<?php
declare(strict_types=1);

require dirname(__DIR__) . '/app/bootstrap.php';
senada_start_session('senada_admin_session');

try {
    $action = (string)($_GET['action'] ?? '');
    if ($action === 'csrf') {
        senada_require_method('GET');
        senada_json(['ok'=>true, 'csrf_token'=>senada_csrf_token()]);
    }

    $db = senada_db();

    if ($action === 'login') {
        senada_require_method('POST');
        senada_verify_csrf();
        $body = senada_json_body();
        $email = strtolower(trim((string)($body['email'] ?? '')));
        $password = (string)($body['password'] ?? '');
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '' || strlen($password) > 4096) {
            senada_json(['ok'=>false, 'error'=>'Email atau password tidak valid.'], 422);
        }
        $emailHash = hash_hmac('sha256', $email, (string)senada_config()['app_secret']);
        $ipHash = senada_ip_hash();
        if (senada_login_attempts_blocked($db, 'admin_login_attempts', 'email_hash = :email_hash OR ip_hash = :ip_hash', [
            ':email_hash'=>$emailHash, ':ip_hash'=>$ipHash
        ], 10)) {
            senada_json(['ok'=>false, 'error'=>'Terlalu banyak percobaan login. Coba lagi setelah 15 menit.'], 429);
        }

        $stmt = $db->prepare('SELECT id,email,password_hash,role,is_active FROM admins WHERE email=:email LIMIT 1');
        $stmt->execute([':email'=>$email]);
        $admin = $stmt->fetch();
        $valid = $admin && (int)$admin['is_active'] === 1 && password_verify($password, (string)$admin['password_hash']);
        $attempt = $db->prepare('INSERT INTO admin_login_attempts (email_hash,ip_hash,succeeded) VALUES (:email_hash,:ip_hash,:succeeded)');
        $attempt->execute([':email_hash'=>$emailHash, ':ip_hash'=>$ipHash, ':succeeded'=>$valid ? 1 : 0]);

        if (!$valid) {
            usleep(250000);
            senada_json(['ok'=>false, 'error'=>'Email atau password salah.'], 401);
        }
        session_regenerate_id(true);
        $_SESSION['admin'] = ['id'=>(int)$admin['id'], 'email'=>(string)$admin['email'], 'role'=>(string)$admin['role']];
        $_SESSION['_session_created'] = time();
        $_SESSION['_last_activity'] = time();
        $_SESSION['_csrf'] = bin2hex(random_bytes(32));
        $db->prepare('UPDATE admins SET last_login_at=NOW() WHERE id=:id')->execute([':id'=>(int)$admin['id']]);
        senada_json(['ok'=>true, 'admin'=>$_SESSION['admin'], 'csrf_token'=>$_SESSION['_csrf']]);
    }

    if ($action === 'me') {
        senada_require_method('GET');
        $admin = senada_require_admin();
        senada_json(['ok'=>true, 'admin'=>$admin, 'csrf_token'=>senada_csrf_token()]);
    }

    if ($action === 'logout') {
        senada_require_method('POST');
        senada_require_admin();
        senada_verify_csrf();
        unset($_SESSION['admin']);
        session_regenerate_id(true);
        $_SESSION['_csrf'] = bin2hex(random_bytes(32));
        senada_json(['ok'=>true]);
    }

    $admin = senada_require_admin();

    if ($action === 'projects') {
        senada_require_method('GET');
        $rows = $db->query("SELECT id,name,slug,repository_owner,repository_name,repository_url,branch_name,category,deployment_mode,is_enabled,last_deploy_requested_at,created_at,updated_at,(password_hash <> '') AS has_password FROM preview_projects ORDER BY updated_at DESC")->fetchAll();
        $base = rtrim((string)(senada_config()['preview_base_url'] ?? ''), '/');
        $projects = array_map(static function(array $row) use ($base): array {
            return [
                'id'=>(int)$row['id'], 'name'=>$row['name'], 'slug'=>$row['slug'],
                'repository_url'=>$row['repository_url'], 'branch'=>$row['branch_name'],
                'category'=>$row['category'], 'deployment_mode'=>$row['deployment_mode'],
                'enabled'=>(bool)$row['is_enabled'], 'has_password'=>(bool)$row['has_password'],
                'last_deploy_requested_at'=>$row['last_deploy_requested_at'],
                'preview_url'=>$base !== '' ? $base . '/p/' . rawurlencode($row['slug']) . '/' : null,
                'updated_at'=>$row['updated_at'],
                'ready'=>is_file(rtrim((string)senada_config()['preview_storage_path'], DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $row['slug'] . DIRECTORY_SEPARATOR . 'index.html')
            ];
        }, $rows);
        senada_json(['ok'=>true, 'projects'=>$projects]);
    }

    if ($action === 'save-project') {
        senada_require_method('POST');
        senada_verify_csrf();
        $body = senada_json_body();
        $id = (int)($body['id'] ?? 0);
        $name = trim((string)($body['name'] ?? ''));
        $slug = strtolower(trim((string)($body['slug'] ?? '')));
        $repo = senada_repo_parts((string)($body['repository_url'] ?? ''));
        $branch = trim((string)($body['branch'] ?? 'main'));
        $category = trim((string)($body['category'] ?? 'Other'));
        $mode = (string)($body['deployment_mode'] ?? 'both');
        $newPassword = (string)($body['password'] ?? '');

        if ($name === '' || strlen($name) > 360 || !$repo || !senada_valid_slug($slug)
            || $branch === '' || strlen($branch) > 120 || !preg_match('/^[A-Za-z0-9._\/-]+$/', $branch)
            || str_contains($branch, '..') || $category === '' || strlen($category) > 240
            || !in_array($mode, ['auto','manual','both'], true)) {
            senada_json(['ok'=>false, 'error'=>'Periksa nama, repository, branch, kategori, slug, dan mode deployment.'], 422);
        }

        $existing = null;
        if ($id > 0) {
            $find = $db->prepare('SELECT id,slug FROM preview_projects WHERE id=:id LIMIT 1');
            $find->execute([':id'=>$id]);
            $existing = $find->fetch();
            if (!$existing) senada_json(['ok'=>false, 'error'=>'Project tidak ditemukan.'], 404);
            if ((string)$existing['slug'] !== $slug) senada_json(['ok'=>false, 'error'=>'Slug tidak dapat diubah setelah project dibuat.'], 422);
        }
        if (!$existing && strlen($newPassword) < 12) senada_json(['ok'=>false, 'error'=>'Password project baru minimal 12 karakter.'], 422);
        if ($newPassword !== '' && (strlen($newPassword) < 12 || strlen($newPassword) > 1024)) {
            senada_json(['ok'=>false, 'error'=>'Password harus terdiri dari 12–1024 karakter.'], 422);
        }

        $passwordHash = $newPassword !== '' ? password_hash($newPassword, PASSWORD_DEFAULT) : null;
        if ($existing) {
            $sql = 'UPDATE preview_projects SET name=:name,repository_owner=:owner,repository_name=:repo,repository_url=:url,branch_name=:branch,category=:category,deployment_mode=:mode,updated_at=NOW()';
            $params = [':name'=>$name, ':owner'=>$repo['owner'], ':repo'=>$repo['repo'], ':url'=>$repo['url'], ':branch'=>$branch, ':category'=>$category, ':mode'=>$mode, ':id'=>$id];
            if ($passwordHash !== null) { $sql .= ',password_hash=:password_hash'; $params[':password_hash'] = $passwordHash; }
            $sql .= ' WHERE id=:id';
            $db->prepare($sql)->execute($params);
            $savedId = $id;
        } else {
            $insert = $db->prepare('INSERT INTO preview_projects (name,slug,repository_owner,repository_name,repository_url,branch_name,category,deployment_mode,password_hash,created_by) VALUES (:name,:slug,:owner,:repo,:url,:branch,:category,:mode,:password_hash,:admin)');
            $insert->execute([
                ':name'=>$name, ':slug'=>$slug, ':owner'=>$repo['owner'], ':repo'=>$repo['repo'], ':url'=>$repo['url'],
                ':branch'=>$branch, ':category'=>$category, ':mode'=>$mode, ':password_hash'=>$passwordHash, ':admin'=>(int)$admin['id']
            ]);
            $savedId = (int)$db->lastInsertId();
        }
        senada_json(['ok'=>true, 'id'=>$savedId]);
    }

    if ($action === 'disable-project') {
        senada_require_method('POST');
        senada_verify_csrf();
        $body = senada_json_body();
        $id = (int)($body['id'] ?? 0);
        $stmt = $db->prepare('UPDATE preview_projects SET is_enabled=0,updated_at=NOW() WHERE id=:id AND is_enabled=1');
        $stmt->execute([':id'=>$id]);
        if ($stmt->rowCount() < 1) senada_json(['ok'=>false, 'error'=>'Project tidak ditemukan atau sudah nonaktif.'], 404);
        senada_json(['ok'=>true]);
    }

    if ($action === 'deploy') {
        senada_require_method('POST');
        senada_verify_csrf();
        $body = senada_json_body();
        $id = (int)($body['id'] ?? 0);
        $stmt = $db->prepare('SELECT * FROM preview_projects WHERE id=:id AND is_enabled=1 LIMIT 1');
        $stmt->execute([':id'=>$id]);
        $project = $stmt->fetch();
        if (!$project) senada_json(['ok'=>false, 'error'=>'Project tidak ditemukan atau nonaktif.'], 404);
        if (!in_array($project['deployment_mode'], ['manual','both'], true)) {
            senada_json(['ok'=>false, 'error'=>'Mode deployment manual tidak diaktifkan untuk project ini.'], 422);
        }
        $token = (string)(senada_config()['github_token'] ?? '');
        if ($token === '') senada_json(['ok'=>false, 'error'=>'GitHub Actions belum dikonfigurasi di server.'], 503);
        if (!function_exists('curl_init')) senada_json(['ok'=>false, 'error'=>'Ekstensi cURL PHP belum tersedia di hosting.'], 503);

        $endpoint = 'https://api.github.com/repos/' . rawurlencode($project['repository_owner']) . '/' . rawurlencode($project['repository_name']) . '/actions/workflows/senada-preview-deploy.yml/dispatches';
        $payload = json_encode(['ref'=>$project['branch_name'], 'inputs'=>['preview_slug'=>$project['slug']]]);
        $ch = curl_init($endpoint);
        curl_setopt_array($ch, [
            CURLOPT_POST=>true, CURLOPT_POSTFIELDS=>$payload, CURLOPT_RETURNTRANSFER=>true, CURLOPT_TIMEOUT=>20,
            CURLOPT_HTTPHEADER=>[
                'Accept: application/vnd.github+json', 'Authorization: Bearer ' . $token,
                'X-GitHub-Api-Version: ' . (senada_config()['github_api_version'] ?? '2022-11-28'),
                'Content-Type: application/json', 'User-Agent: Senada-Creatlabs-Preview-Manager'
            ]
        ]);
        $response = curl_exec($ch);
        $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($response === false || $status !== 204) {
            senada_json(['ok'=>false, 'error'=>'GitHub menolak pemicu deployment. Periksa token, izin Actions, dan file workflow di repository.'], 502);
        }
        $db->prepare("INSERT INTO preview_deployments (project_id,deployment_mode,status,requested_by) VALUES (:project,'manual','queued',:admin)")
            ->execute([':project'=>$id, ':admin'=>(int)$admin['id']]);
        $db->prepare('UPDATE preview_projects SET last_deploy_requested_at=NOW() WHERE id=:id')->execute([':id'=>$id]);
        senada_json(['ok'=>true, 'message'=>'GitHub Actions berhasil dipicu. Status build dapat dilihat pada tab Actions repository.']);
    }

    if ($action === 'deployments') {
        senada_require_method('GET');
        $id = (int)($_GET['id'] ?? 0);
        $stmt = $db->prepare('SELECT id,deployment_mode,status,github_run_url,commit_sha,created_at,finished_at FROM preview_deployments WHERE project_id=:id ORDER BY created_at DESC LIMIT 20');
        $stmt->execute([':id'=>$id]);
        senada_json(['ok'=>true, 'deployments'=>$stmt->fetchAll()]);
    }

    senada_json(['ok'=>false, 'error'=>'Endpoint tidak ditemukan.'], 404);
} catch (PDOException $error) {
    if ((string)$error->getCode() === '23000') {
        senada_json(['ok'=>false, 'error'=>'Slug preview sudah digunakan. Pilih slug lain.'], 409);
    }
    error_log('[Senada API] ' . $error->getMessage());
    senada_json(['ok'=>false, 'error'=>'Terjadi kesalahan pada database. Periksa konfigurasi backend atau log hosting.'], 500);
} catch (Throwable $error) {
    error_log('[Senada API] ' . $error->getMessage());
    senada_json(['ok'=>false, 'error'=>'Terjadi kesalahan pada server. Periksa konfigurasi backend atau log hosting.'], 500);
}

-- Senada Creatlabs — Private Project Preview
-- Import ke database MySQL baru yang khusus untuk Senada. Jangan gunakan database PA.YU.

CREATE TABLE admins (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('owner','admin') NOT NULL DEFAULT 'admin',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admins_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE admin_login_attempts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email_hash CHAR(64) NOT NULL,
  ip_hash CHAR(64) NOT NULL,
  succeeded TINYINT(1) NOT NULL DEFAULT 0,
  attempted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_admin_attempt_email (email_hash, attempted_at),
  KEY idx_admin_attempt_ip (ip_hash, attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE preview_projects (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(50) NOT NULL,
  repository_owner VARCHAR(100) NOT NULL,
  repository_name VARCHAR(100) NOT NULL,
  repository_url VARCHAR(255) NOT NULL,
  branch_name VARCHAR(120) NOT NULL DEFAULT 'main',
  category VARCHAR(80) NOT NULL DEFAULT 'Other',
  deployment_mode ENUM('auto','manual','both') NOT NULL DEFAULT 'both',
  password_hash VARCHAR(255) NOT NULL,
  is_enabled TINYINT(1) NOT NULL DEFAULT 1,
  created_by BIGINT UNSIGNED NULL,
  last_deploy_requested_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_preview_projects_slug (slug),
  KEY idx_preview_projects_enabled (is_enabled),
  CONSTRAINT fk_preview_projects_admin
    FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE preview_login_attempts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id BIGINT UNSIGNED NOT NULL,
  ip_hash CHAR(64) NOT NULL,
  succeeded TINYINT(1) NOT NULL DEFAULT 0,
  attempted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_preview_attempt_project_ip (project_id, ip_hash, attempted_at),
  CONSTRAINT fk_preview_attempt_project
    FOREIGN KEY (project_id) REFERENCES preview_projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE preview_deployments (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id BIGINT UNSIGNED NOT NULL,
  deployment_mode ENUM('auto','manual') NOT NULL,
  status ENUM('queued','success','failed') NOT NULL DEFAULT 'queued',
  requested_by BIGINT UNSIGNED NULL,
  github_run_url VARCHAR(500) NULL,
  commit_sha VARCHAR(64) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finished_at DATETIME NULL,
  PRIMARY KEY (id),
  KEY idx_preview_deploy_project (project_id, created_at),
  CONSTRAINT fk_preview_deploy_project
    FOREIGN KEY (project_id) REFERENCES preview_projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_preview_deploy_admin
    FOREIGN KEY (requested_by) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

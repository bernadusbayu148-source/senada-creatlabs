<?php
declare(strict_types=1);

require dirname(__DIR__) . '/app/bootstrap.php';

$checks = [
    'valid slug accepted' => senada_valid_slug('coffee-shop-demo'),
    'numeric slug accepted' => senada_valid_slug('project-2026'),
    'uppercase slug rejected' => !senada_valid_slug('Coffee-Shop'),
    'underscore slug rejected' => !senada_valid_slug('coffee_shop'),
    'leading dash rejected' => !senada_valid_slug('-coffee'),
    'double dash rejected' => !senada_valid_slug('coffee--shop'),
    'valid GitHub repository parsed' => senada_repo_parts('https://github.com/example/coffee-demo') !== null,
    'git suffix normalized' => (senada_repo_parts('https://github.com/example/coffee-demo.git')['url'] ?? '') === 'https://github.com/example/coffee-demo',
    'HTTP repository rejected' => senada_repo_parts('http://github.com/example/coffee-demo') === null,
    'nested repository path rejected' => senada_repo_parts('https://github.com/example/coffee-demo/tree/main') === null,
    'query string repository rejected' => senada_repo_parts('https://github.com/example/coffee-demo?tab=readme') === null,
];

$failed = [];
foreach ($checks as $label => $passed) {
    if (!$passed) $failed[] = $label;
}
if ($failed) {
    fwrite(STDERR, "Failed checks:\n- " . implode("\n- ", $failed) . "\n");
    exit(1);
}
echo 'Senada helper smoke checks passed: ' . count($checks) . PHP_EOL;

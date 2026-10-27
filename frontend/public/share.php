<?php
/**
 * Ahorramix · Vista previa al compartir un producto (WhatsApp, Facebook, X, Telegram...).
 * .htaccess solo envía aquí a los robots de vista previa en las rutas /producto/<slug>.
 * Las personas ven la tienda normal. Lee wcStoreUrl y siteUrl de ahorramix-config.js.
 */
header('Content-Type: text/html; charset=utf-8');

$cfg = @file_get_contents(__DIR__ . '/ahorramix-config.js') ?: '';
$read = function ($key) use ($cfg) {
    return preg_match('/' . $key . '\s*:\s*"([^"]*)"/', $cfg, $m) ? rtrim(trim($m[1]), '/') : '';
};
$wc = $read('wcStoreUrl');
$scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = preg_replace('/[^a-z0-9.\-:]/i', '', $_SERVER['HTTP_HOST'] ?? '');
$site = $read('siteUrl') ?: "$scheme://$host";
$slug = preg_replace('/[^a-z0-9\-_%]/i', '', $_GET['slug'] ?? '');
$e = function ($s) { return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8'); };

$p = null;
if ($wc && $slug && $read('commerceMode') === 'woocommerce') {
    $cache = sys_get_temp_dir() . '/ahorramix-share-' . md5($wc . $slug) . '.json';
    if (is_file($cache) && time() - filemtime($cache) < 900) {
        $body = file_get_contents($cache);
    } else {
        $ctx = stream_context_create(['http' => ['timeout' => 4, 'header' => "Accept: application/json\r\n"]]);
        $body = @file_get_contents("$wc/wp-json/wc/store/v1/products?slug=" . rawurlencode($slug), false, $ctx);
        if ($body) @file_put_contents($cache, $body);
    }
    $list = json_decode($body ?: '[]', true);
    $p = is_array($list) && !empty($list[0]) ? $list[0] : null;
}

$url = $site . '/producto/' . $slug;
$title = 'Ahorramix — Ofertas en hogar, tecnología y moda';
$desc = 'Productos útiles a buen precio. IVA incluido y envío a toda España.';
$image = $site . '/images/brand/og-ahorramix.jpg';
$amount = '';
$currency = 'EUR';
if ($p) {
    $pr = $p['prices'] ?? [];
    $minor = (int) ($pr['currency_minor_unit'] ?? 2);
    $value = isset($pr['price']) ? ((float) $pr['price']) / pow(10, $minor) : null;
    $currency = $pr['currency_code'] ?? 'EUR';
    $name = html_entity_decode($p['name'] ?? '', ENT_QUOTES, 'UTF-8');
    if ($value !== null) {
        $amount = number_format($value, 2, '.', '');
        $title = $name . ' · ' . number_format($value, 2, ',', '.') . ' ' . ($pr['currency_symbol'] ?? '€');
    } else {
        $title = $name;
    }
    $short = trim(preg_replace('/\s+/', ' ', html_entity_decode(strip_tags($p['short_description'] ?? ''), ENT_QUOTES, 'UTF-8')));
    if ($short !== '') $desc = preg_match('/^(.{177}).{4,}/us', $short, $cut) ? rtrim($cut[1]) . '…' : $short;
    if (!empty($p['images'][0]['src'])) $image = $p['images'][0]['src'];
}
?><!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title><?= $e($title) ?></title>
<meta name="description" content="<?= $e($desc) ?>">
<link rel="canonical" href="<?= $e($url) ?>">
<meta property="og:type" content="<?= $p ? 'product' : 'website' ?>">
<meta property="og:site_name" content="Ahorramix">
<meta property="og:locale" content="es_ES">
<meta property="og:url" content="<?= $e($url) ?>">
<meta property="og:title" content="<?= $e($title) ?>">
<meta property="og:description" content="<?= $e($desc) ?>">
<meta property="og:image" content="<?= $e($image) ?>">
<?php if ($amount !== ''): ?>
<meta property="product:price:amount" content="<?= $e($amount) ?>">
<meta property="product:price:currency" content="<?= $e($currency) ?>">
<?php endif; ?>
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?= $e($title) ?>">
<meta name="twitter:description" content="<?= $e($desc) ?>">
<meta name="twitter:image" content="<?= $e($image) ?>">
</head>
<body><p><a href="<?= $e($url) ?>"><?= $e($title) ?></a></p></body>
</html>

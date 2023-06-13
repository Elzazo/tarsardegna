<?php
$nome = isset($_GET['mese']) ? $_GET['mese'] : '';
$anno = isset($_GET['anno']) ? $_GET['anno'] : '';

$directory = "data/" . $anno;
$fileCount = 0;

if (is_dir($directory)) {
    $files = scandir($directory);
    
    foreach ($files as $file) {
        if (strpos($file, $nome) === 0) {
            $fileCount++;
        }
    }
}

echo $fileCount;
?>

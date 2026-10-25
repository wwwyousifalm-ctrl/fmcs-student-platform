<?php
/**
 * Academic Resource Upload Handler (Admin/Secretary)
 */
session_start();
require_once 'db.php';

// Check if user is logged in and authorized
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    die('Unauthorized access.');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['resource_file'])) {
    $course_code = trim($_POST['course_code']);
    $title       = trim($_POST['title']);
    $department  = trim($_POST['department']);

    $file     = $_FILES['resource_file'];
    $fileName = basename($file['name']);
    $fileSize = round($file['size'] / (1024 * 1024), 2) . ' MB';
    $fileTmp  = $file['tmp_name'];

    $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    $allowed = ['pdf', 'zip', 'docx', 'pptx'];

    if (in_array($fileExt, $allowed)) {
        $newFileName = uniqid('res_', true) . '.' . $fileExt;
        $uploadDir = '../uploads/resources/';

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $destination = $uploadDir . $newFileName;
        $dbPath = 'uploads/resources/' . $newFileName;

        if (move_uploaded_file($fileTmp, $destination)) {
            $stmt = $pdo->prepare("INSERT INTO resources (course_code, title, department, file_size, file_path) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$course_code, $title, $department, $fileSize, $dbPath]);

            header('Location: ../resources.html?upload=success');
            exit();
        } else {
            die('Error uploading file to server.');
        }
    } else {
        die('Invalid file type. Only PDF, ZIP, DOCX, and PPTX are allowed.');
    }
}
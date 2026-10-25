<?php
/**
 * Secure User Registration Handler
 */
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullname   = trim($_POST['fullname'] ?? '');
    $email      = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $student_id = trim($_POST['student_id'] ?? '');
    $department = trim($_POST['department'] ?? '');
    $password   = $_POST['password'] ?? '';

    if (empty($fullname) || empty($email) || empty($student_id) || empty($department) || empty($password)) {
        die('Error: All registration fields are required.');
    }

    // Hash password securely
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    try {
        $stmt = $pdo->prepare("INSERT INTO users (fullname, email, student_id, department, password) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$fullname, $email, $student_id, $department, $hashedPassword]);

        header('Location: ../login.html?registered=success');
        exit();
    } catch (\PDOException $e) {
        if ($e->getCode() == 23000) {
            die('Error: Email or Student ID already registered.');
        }
        die('Database Error: ' . $e->getMessage());
    }
}
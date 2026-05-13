<?php
function api_request($method, $endpoint, $data = null, $token = null) {
    $ch = curl_init('http://127.0.0.1:8000/api/v1' . $endpoint);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        if ($data) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $headers = ['Content-Type: application/json', 'Accept: application/json'];
    if ($token) $headers[] = 'Authorization: Bearer ' . $token;
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return ['status' => $status, 'body' => json_decode($response, true) ?: $response];
}

echo "1. Testing Login...\n";
$login = api_request('POST', '/auth/login', ['email' => 'admin@aiub.edu', 'password' => 'Admin@1234']);
if ($login['status'] !== 200 || !isset($login['body']['data']['token'])) {
    die("Login failed: " . print_r($login, true) . "\n");
}
$token = $login['body']['data']['token'];
echo "   -> Login successful\n";

echo "2. Testing GET /employees...\n";
$emps = api_request('GET', '/employees', null, $token);
if ($emps['status'] !== 200) die("Failed to get employees: " . print_r($emps, true) . "\n");
echo "   -> Employees count: " . count($emps['body']['data']) . "\n";

echo "3. Testing GET /dashboard/stats...\n";
$stats = api_request('GET', '/dashboard/stats', null, $token);
if ($stats['status'] !== 200) die("Failed to get stats: " . print_r($stats, true) . "\n");
echo "   -> Total Employees in stats: " . $stats['body']['data']['total_employees'] . "\n";

echo "4. Testing Payroll Run generation...\n";
$pr = api_request('POST', '/payroll-runs', ['year' => 2024, 'month' => 5], $token);
if ($pr['status'] !== 201) die("Failed to create payroll run: " . print_r($pr, true) . "\n");
$runId = $pr['body']['data']['id'];
echo "   -> Created Payroll Run ID: $runId\n";

echo "5. Testing Payroll Generation Process...\n";
$gen = api_request('POST', "/payroll-runs/$runId/generate", null, $token);
if ($gen['status'] !== 200) die("Failed to generate payroll: " . print_r($gen, true) . "\n");
echo "   -> Payroll Generation successful. Total Net: " . $gen['body']['data']['total_net'] . "\n";

echo "\nAll backend tests passed successfully!\n";

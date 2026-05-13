<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
body{font-family:DejaVu Sans,sans-serif;font-size:11px;color:#191c1e;margin:0;padding:20px}
.header{background:#001e40;color:#fff;padding:20px;text-align:center;border-radius:8px;margin-bottom:20px}
.header h1{margin:0;font-size:20px}.header p{margin:4px 0;opacity:.8;font-size:11px}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px}
.info-box{background:#f2f4f7;padding:12px;border-radius:6px}
.info-box label{font-size:9px;font-weight:700;text-transform:uppercase;color:#43474f;display:block;margin-bottom:4px}
.info-box span{font-weight:600;color:#001e40}
table{width:100%;border-collapse:collapse;margin-bottom:12px}
th{background:#003366;color:#fff;padding:8px;text-align:left;font-size:10px;font-weight:700}
td{padding:6px 8px;border-bottom:1px solid #e0e3e6}
.amount{text-align:right;font-weight:600}
.net-row td{background:#003366;color:#fff;font-size:13px;font-weight:700;padding:10px 8px}
.footer{margin-top:30px;border-top:2px solid #003366;padding-top:16px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;text-align:center}
.sig-line{border-top:1px solid #737780;margin-top:30px;padding-top:4px;font-size:9px;color:#737780}
</style></head>
<body>
<div class="header">
    <h1>AIUB HRMS</h1>
    <p>American International University-Bangladesh</p>
    <p>SALARY PAYSLIP — {{ \Carbon\Carbon::createFromDate($payrollItem->payrollRun->year, $payrollItem->payrollRun->month, 1)->format('F Y') }}</p>
</div>
<div class="info-grid">
    <div class="info-box"><label>Employee Name</label><span>{{ $payrollItem->employee->full_name }}</span></div>
    <div class="info-box"><label>Employee ID</label><span>{{ $payrollItem->employee->employee_id }}</span></div>
    <div class="info-box"><label>Department</label><span>{{ $payrollItem->employee->department?->name }}</span></div>
    <div class="info-box"><label>Designation</label><span>{{ $payrollItem->employee->designation?->title }}</span></div>
    <div class="info-box"><label>Payroll Run</label><span>{{ $payrollItem->payrollRun->run_code }}</span></div>
    <div class="info-box"><label>Working Days</label><span>{{ $payrollItem->present_days }}/{{ $payrollItem->working_days }}</span></div>
</div>
<table>
    <thead><tr><th>Earnings</th><th class="amount">Amount (৳)</th></tr></thead>
    <tbody>
        <tr><td>Basic Salary</td><td class="amount">{{ number_format($payrollItem->basic_salary, 2) }}</td></tr>
        <tr><td>House Rent Allowance</td><td class="amount">{{ number_format($payrollItem->hra, 2) }}</td></tr>
        <tr><td>Medical Allowance</td><td class="amount">{{ number_format($payrollItem->medical_allowance, 2) }}</td></tr>
        <tr><td>Transport Allowance</td><td class="amount">{{ number_format($payrollItem->transport_allowance, 2) }}</td></tr>
        <tr><td>Other Allowance</td><td class="amount">{{ number_format($payrollItem->other_allowance, 2) }}</td></tr>
        <tr><td><strong>Gross Salary</strong></td><td class="amount"><strong>{{ number_format($payrollItem->gross_salary, 2) }}</strong></td></tr>
    </tbody>
</table>
<table>
    <thead><tr><th>Deductions</th><th class="amount">Amount (৳)</th></tr></thead>
    <tbody>
        <tr><td>Provident Fund</td><td class="amount">{{ number_format($payrollItem->provident_fund, 2) }}</td></tr>
        <tr><td>Income Tax</td><td class="amount">{{ number_format($payrollItem->tax, 2) }}</td></tr>
        <tr><td>Other Deductions</td><td class="amount">{{ number_format($payrollItem->other_deductions, 2) }}</td></tr>
        <tr><td><strong>Total Deductions</strong></td><td class="amount"><strong>{{ number_format($payrollItem->total_deductions, 2) }}</strong></td></tr>
    </tbody>
</table>
<table>
    <tbody><tr class="net-row"><td>NET PAY</td><td class="amount">৳ {{ number_format($payrollItem->net_salary, 2) }}</td></tr></tbody>
</table>
<div class="footer">
    <div><div class="sig-line">Employee Signature</div></div>
    <div><div class="sig-line">HR Manager</div></div>
    <div><div class="sig-line">Authorized Signatory</div></div>
</div>
<p style="text-align:center;color:#737780;font-size:9px;margin-top:20px">Generated on {{ now()->format('d M Y H:i') }} — AIUB HRMS</p>
</body></html>

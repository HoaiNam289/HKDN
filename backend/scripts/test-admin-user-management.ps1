param(
    [string]$BaseUrl = 'http://127.0.0.1:8080',
    [string]$AdminEmail = 'admin@gmail.com'
)

$ErrorActionPreference = 'Stop'
$adminSecure = Read-Host 'Nhap mat khau ADMIN (khong hien thi)' -AsSecureString
$adminPtr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($adminSecure)
$adminPassword = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($adminPtr)
[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($adminPtr)

function Invoke-JsonApi([string]$Method, [string]$Path, [object]$Body = $null, [hashtable]$Headers = @{}) {
    try {
        $params = @{ Method = $Method; Uri = "$BaseUrl$Path"; Headers = $Headers; UseBasicParsing = $true }
        if ($null -ne $Body) { $params.ContentType = 'application/json'; $params.Body = ($Body | ConvertTo-Json -Depth 8) }
        $response = Invoke-WebRequest @params
        return [PSCustomObject]@{ Status = [int]$response.StatusCode; Body = if ($response.Content) { $response.Content | ConvertFrom-Json } else { $null } }
    } catch {
        $status = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode.value__ } else { 0 }
        $body = $null
        if ($_.ErrorDetails.Message) { try { $body = $_.ErrorDetails.Message | ConvertFrom-Json } catch {} }
        return [PSCustomObject]@{ Status = $status; Body = $body }
    }
}

$login = Invoke-JsonApi 'POST' '/api/auth/login' @{ email = $AdminEmail; password = $adminPassword }
if ($login.Status -ne 200) { throw "ADMIN login failed with HTTP $($login.Status)." }
$headers = @{ Authorization = "Bearer $($login.Body.accessToken)" }
$stamp = [DateTime]::UtcNow.ToString('yyyyMMddHHmmss')
$testEmail = "admin-user-test.$stamp@example.com"
$testPassword = 'Admin-user-test-password-123!'

$create = Invoke-JsonApi 'POST' '/api/admin/users' @{ fullName = 'EduCertify Admin Test'; email = $testEmail; password = $testPassword; roles = @('STUDENT') } $headers
$createdId = $create.Body.id
$list = Invoke-JsonApi 'GET' '/api/admin/users?page=0&size=5&sort=createdAt,desc' $null $headers
$search = Invoke-JsonApi 'GET' "/api/admin/users?q=$testEmail&page=0&size=10" $null $headers
$detail = Invoke-JsonApi 'GET' "/api/admin/users/$createdId" $null $headers
$update = Invoke-JsonApi 'PATCH' "/api/admin/users/$createdId" @{ fullName = 'EduCertify Admin Test Updated'; email = $testEmail; roles = @('ISSUER'); enabled = $true; locked = $false } $headers
$roleStudent = Invoke-JsonApi 'PATCH' "/api/admin/users/$createdId" @{ fullName = 'EduCertify Admin Test Updated'; email = $testEmail; roles = @('STUDENT'); enabled = $true; locked = $false } $headers
$studentLogin = Invoke-JsonApi 'POST' '/api/auth/login' @{ email = $testEmail; password = $testPassword }
$studentHeaders = if ($studentLogin.Status -eq 200) { @{ Authorization = "Bearer $($studentLogin.Body.accessToken)" } } else { @{} }
$studentAdmin = Invoke-JsonApi 'GET' '/api/admin/users' $null $studentHeaders
$lock = Invoke-JsonApi 'PATCH' "/api/admin/users/$createdId" @{ fullName = 'EduCertify Admin Test Updated'; email = $testEmail; roles = @('STUDENT'); enabled = $false; locked = $true } $headers
$lockedLogin = Invoke-JsonApi 'POST' '/api/auth/login' @{ email = $testEmail; password = $testPassword }
$oldTokenAfterLock = if ($studentLogin.Status -eq 200) { Invoke-JsonApi 'GET' '/api/auth/me' $null $studentHeaders } else { [PSCustomObject]@{ Status = 0 } }
$unlock = Invoke-JsonApi 'PATCH' "/api/admin/users/$createdId" @{ fullName = 'EduCertify Admin Test Updated'; email = $testEmail; roles = @('STUDENT'); enabled = $true; locked = $false } $headers
$admins = Invoke-JsonApi 'GET' '/api/admin/users?role=ADMIN&status=ACTIVE&page=0&size=20' $null $headers
$lastAdminGuard = $null
if ($admins.Status -eq 200 -and $admins.Body.content.Count -eq 1) {
    $lastAdmin = $admins.Body.content[0]
    $lastAdminGuard = Invoke-JsonApi 'PATCH' "/api/admin/users/$($lastAdmin.id)" @{ fullName = $lastAdmin.fullName; email = $lastAdmin.email; roles = @('ADMIN'); enabled = $false; locked = $true } $headers
}

[PSCustomObject]@{
    AdminLogin = $login.Status
    CreateTestUser = $create.Status
    ListUsers = $list.Status
    SearchTestUser = $search.Status
    GetDetails = $detail.Status
    GrantIssuer = $update.Status
    RevokeIssuerKeepStudent = $roleStudent.Status
    StudentLogin = $studentLogin.Status
    StudentAdminApi = $studentAdmin.Status
    LockTestUser = $lock.Status
    LockedUserLogin = $lockedLogin.Status
    PreviouslyIssuedTokenAfterLock = $oldTokenAfterLock.Status
    UnlockTestUser = $unlock.Status
    LastAdminGuard = if ($lastAdminGuard) { $lastAdminGuard.Status } else { 'NOT_RUN' }
    TestEmail = $testEmail
} | ConvertTo-Json -Compress

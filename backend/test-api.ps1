# Backend API Test Script
$baseUrl = "http://localhost:3000/graphql"
$timestamp = Get-Date -Format "mmss"

function Invoke-GQL {
    param([string]$Query, [string]$Token)
    $body = @{ query = $Query } | ConvertTo-Json
    $h = @{ "Content-Type" = "application/json" }
    if ($Token) { $h["Authorization"] = "Bearer $Token" }
    try {
        $resp = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $body -Headers $h
        return $resp
    } catch {
        Write-Host "ERROR: $_" -ForegroundColor Red
        return $null
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  BACKEND API TEST SUITE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$adminEmail = "admin_$timestamp@test.com"
$memberEmail = "member_$timestamp@test.com"

# --- TEST 1: Register Admin ---
Write-Host "[TEST 1] Register Admin User ($adminEmail)..." -ForegroundColor Yellow
$r = Invoke-GQL -Query "mutation { register(registerUserInput: { firstName: `"TestAdmin`", lastName: `"User`", email: `"$adminEmail`", password: `"Admin123!`", roleId: 3, countryId: 1 }) { accessToken user { id email } } }"
if ($r.data.register.user.email) {
    Write-Host "  PASS: Admin registered => $($r.data.register.user.email) (id: $($r.data.register.user.id))" -ForegroundColor Green
    $adminToken = $r.data.register.accessToken
} elseif ($r.errors) {
    Write-Host "  FAIL: $($r.errors[0].message.Substring(0, [Math]::Min(100, $r.errors[0].message.Length)))" -ForegroundColor Red
    exit 1
}

# --- TEST 2: Register Member ---
Write-Host "[TEST 2] Register Member User ($memberEmail)..." -ForegroundColor Yellow
$r = Invoke-GQL -Query "mutation { register(registerUserInput: { firstName: `"TestMember`", lastName: `"User`", email: `"$memberEmail`", password: `"Member123!`", roleId: 1, countryId: 1 }) { accessToken user { id email } } }"
if ($r.data.register.user.email) {
    Write-Host "  PASS: Member registered => $($r.data.register.user.email) (id: $($r.data.register.user.id))" -ForegroundColor Green
    $memberToken = $r.data.register.accessToken
} elseif ($r.errors) {
    Write-Host "  FAIL: $($r.errors[0].message.Substring(0, [Math]::Min(100, $r.errors[0].message.Length)))" -ForegroundColor Red
    exit 1
}

# --- TEST 3: Login Admin ---
Write-Host "[TEST 3] Login Admin..." -ForegroundColor Yellow
$r = Invoke-GQL -Query "mutation { login(loginUserInput: { email: `"$adminEmail`", password: `"Admin123!`" }) { accessToken user { id email } } }"
if ($r.data.login.accessToken) {
    Write-Host "  PASS: Admin logged in, JWT received" -ForegroundColor Green
    $adminToken = $r.data.login.accessToken
} elseif ($r.errors) {
    Write-Host "  FAIL: $($r.errors[0].message)" -ForegroundColor Red
}

# --- TEST 4: Login Member ---
Write-Host "[TEST 4] Login Member..." -ForegroundColor Yellow
$r = Invoke-GQL -Query "mutation { login(loginUserInput: { email: `"$memberEmail`", password: `"Member123!`" }) { accessToken user { id email } } }"
if ($r.data.login.accessToken) {
    Write-Host "  PASS: Member logged in, JWT received" -ForegroundColor Green
    $memberToken = $r.data.login.accessToken
} elseif ($r.errors) {
    Write-Host "  FAIL: $($r.errors[0].message)" -ForegroundColor Red
}

# --- TEST 5: Admin creates Restaurant ---
Write-Host "[TEST 5] Admin creates Restaurant..." -ForegroundColor Yellow
$r = Invoke-GQL -Query "mutation { createRestaurant(createRestaurantInput: { name: `"Burger Joint $timestamp`", description: `"Best burgers`", address: `"123 Main St`", phoneNumber: `"555-0101`", countryId: 1 }) { id name } }" -Token $adminToken
if ($r.data.createRestaurant.id) {
    $restaurantId = $r.data.createRestaurant.id
    Write-Host "  PASS: Restaurant created => $($r.data.createRestaurant.name) (id: $restaurantId)" -ForegroundColor Green
} elseif ($r.errors) {
    Write-Host "  FAIL: $($r.errors[0].message)" -ForegroundColor Red
}

# --- TEST 6: Member tries to create Restaurant (should fail) ---
Write-Host "[TEST 6] Member tries to create Restaurant (should be denied)..." -ForegroundColor Yellow
$r = Invoke-GQL -Query "mutation { createRestaurant(createRestaurantInput: { name: `"Unauthorized`", description: `"Fail`", address: `"456 St`", phoneNumber: `"555`", countryId: 1 }) { id } }" -Token $memberToken
if ($r.errors -or (-not $r.data.createRestaurant)) {
    Write-Host "  PASS: Member correctly denied (Role Guard working)" -ForegroundColor Green
} else {
    Write-Host "  FAIL: Member was able to create restaurant!" -ForegroundColor Red
}

# --- TEST 7: Admin adds Menu Items ---
Write-Host "[TEST 7] Admin adds Menu Items..." -ForegroundColor Yellow
$r = Invoke-GQL -Query "mutation { addMenuItem(createMenuItemInput: { name: `"Classic Burger`", description: `"Juicy beef`", price: 9.99, restaurantId: $restaurantId }) { id name price } }" -Token $adminToken
if ($r.data.addMenuItem.id) {
    $menuItemId1 = $r.data.addMenuItem.id
    Write-Host "  PASS: Item 1 => $($r.data.addMenuItem.name) @ `$$($r.data.addMenuItem.price)" -ForegroundColor Green
} elseif ($r.errors) {
    Write-Host "  FAIL: $($r.errors[0].message)" -ForegroundColor Red
}

$r = Invoke-GQL -Query "mutation { addMenuItem(createMenuItemInput: { name: `"Fries`", description: `"Crispy fries`", price: 3.99, restaurantId: $restaurantId }) { id name price } }" -Token $adminToken
if ($r.data.addMenuItem.id) {
    $menuItemId2 = $r.data.addMenuItem.id
    Write-Host "  PASS: Item 2 => $($r.data.addMenuItem.name) @ `$$($r.data.addMenuItem.price)" -ForegroundColor Green
} elseif ($r.errors) {
    Write-Host "  FAIL: $($r.errors[0].message)" -ForegroundColor Red
}

# --- TEST 8: Fetch Restaurants with Menu Items ---
Write-Host "[TEST 8] Fetch all Restaurants..." -ForegroundColor Yellow
$r = Invoke-GQL -Query '{ restaurants { id name menuItems { id name price } } }' -Token $memberToken
if ($r.data.restaurants) {
    Write-Host "  PASS: Found $($r.data.restaurants.Count) restaurant(s)" -ForegroundColor Green
} elseif ($r.errors) {
    Write-Host "  FAIL: $($r.errors[0].message)" -ForegroundColor Red
}

# --- TEST 9: Member creates an Order ---
Write-Host "[TEST 9] Member creates Order..." -ForegroundColor Yellow
$r = Invoke-GQL -Query "mutation { createOrder(createOrderInput: { restaurantId: $restaurantId, items: [{ menuItemId: $menuItemId1, quantity: 2 }, { menuItemId: $menuItemId2, quantity: 1 }] }) { id totalAmount orderStatus items { menuItemId quantity unitPrice subtotal } } }" -Token $memberToken
if ($r.data.createOrder.id) {
    $orderId = $r.data.createOrder.id
    Write-Host "  PASS: Order created (id: $orderId), total: `$$($r.data.createOrder.totalAmount), status: $($r.data.createOrder.orderStatus)" -ForegroundColor Green
} elseif ($r.errors) {
    Write-Host "  FAIL: $($r.errors[0].message.Substring(0, [Math]::Min(150, $r.errors[0].message.Length)))" -ForegroundColor Red
}

# --- TEST 10: Member views My Orders ---
Write-Host "[TEST 10] Member views My Orders..." -ForegroundColor Yellow
$r = Invoke-GQL -Query '{ myOrders { id totalAmount orderStatus } }' -Token $memberToken
if ($r.data.myOrders) {
    Write-Host "  PASS: Member has $($r.data.myOrders.Count) order(s)" -ForegroundColor Green
} elseif ($r.errors) {
    Write-Host "  FAIL: $($r.errors[0].message)" -ForegroundColor Red
}

# --- TEST 11: Admin views All Orders ---
Write-Host "[TEST 11] Admin views All Orders..." -ForegroundColor Yellow
$r = Invoke-GQL -Query '{ allOrders { id totalAmount orderStatus userId } }' -Token $adminToken
if ($r.data.allOrders) {
    Write-Host "  PASS: Admin sees $($r.data.allOrders.Count) total order(s)" -ForegroundColor Green
} elseif ($r.errors) {
    Write-Host "  FAIL: $($r.errors[0].message)" -ForegroundColor Red
}

# --- TEST 12: Admin updates Order Status ---
Write-Host "[TEST 12] Admin updates Order Status to PAID..." -ForegroundColor Yellow
if ($orderId) {
    $r = Invoke-GQL -Query "mutation { updateOrderStatus(orderId: $orderId, status: `"PAID`") { id orderStatus } }" -Token $adminToken
    if ($r.data.updateOrderStatus.orderStatus -eq "PAID") {
        Write-Host "  PASS: Order status updated to PAID" -ForegroundColor Green
    } elseif ($r.errors) {
        Write-Host "  FAIL: $($r.errors[0].message)" -ForegroundColor Red
    }
} else {
    Write-Host "  SKIP: No order to update" -ForegroundColor DarkYellow
}

# --- TEST 13: Member adds Payment Method ---
Write-Host "[TEST 13] Member adds Payment Method..." -ForegroundColor Yellow
$r = Invoke-GQL -Query "mutation { addPaymentMethod(createPaymentMethodInput: { methodName: `"Visa Card`", provider: `"Stripe`", token: `"tok_test_$timestamp`" }) { id methodName provider } }" -Token $memberToken
if ($r.data.addPaymentMethod.id) {
    $paymentMethodId = $r.data.addPaymentMethod.id
    Write-Host "  PASS: Payment method => $($r.data.addPaymentMethod.methodName) via $($r.data.addPaymentMethod.provider)" -ForegroundColor Green
} elseif ($r.errors) {
    Write-Host "  FAIL: $($r.errors[0].message)" -ForegroundColor Red
}

# --- TEST 14: Member views Payment Methods ---
Write-Host "[TEST 14] Member views Payment Methods..." -ForegroundColor Yellow
$r = Invoke-GQL -Query '{ myPaymentMethods { id methodName provider isActive } }' -Token $memberToken
if ($r.data.myPaymentMethods) {
    Write-Host "  PASS: Member has $($r.data.myPaymentMethods.Count) payment method(s)" -ForegroundColor Green
} elseif ($r.errors) {
    Write-Host "  FAIL: $($r.errors[0].message)" -ForegroundColor Red
}

# --- TEST 15: Member cancels Order ---
Write-Host "[TEST 15] Member cancels their Order..." -ForegroundColor Yellow
if ($orderId) {
    $r = Invoke-GQL -Query "mutation { cancelOrder(orderId: $orderId) { id orderStatus } }" -Token $memberToken
    if ($r.data.cancelOrder.orderStatus -eq "CANCELLED") {
        Write-Host "  PASS: Order cancelled successfully" -ForegroundColor Green
    } elseif ($r.errors) {
        Write-Host "  FAIL: $($r.errors[0].message.Substring(0, [Math]::Min(150, $r.errors[0].message.Length)))" -ForegroundColor Red
    }
} else {
    Write-Host "  SKIP: No order to cancel" -ForegroundColor DarkYellow
}

# --- TEST 16: Unauthenticated request ---
Write-Host "[TEST 16] Unauthenticated request (should be denied)..." -ForegroundColor Yellow
$r = Invoke-GQL -Query '{ restaurants { id name } }'
if ($r.errors -or (-not $r.data.restaurants)) {
    Write-Host "  PASS: Unauthenticated request correctly denied" -ForegroundColor Green
} else {
    Write-Host "  FAIL: Request was allowed without auth!" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  ALL 16 TESTS COMPLETED" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

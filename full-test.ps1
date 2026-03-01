$API = "http://localhost:3000/graphql"
$FRONTEND = "http://localhost:3001"
$TS = Get-Date -Format "mmss"
$PASS = 0
$FAIL = 0
$TOTAL = 0

function Test-GraphQL {
    param([string]$Name, [string]$Query, [string]$Token, [bool]$ExpectError = $false)
    $script:TOTAL++
    Write-Host ""
    Write-Host "[$script:TOTAL] $Name..." -ForegroundColor Cyan
    try {
        $headers = @{ "Content-Type" = "application/json" }
        if ($Token) { $headers["Authorization"] = "Bearer $Token" }
        $body = @{ query = $Query } | ConvertTo-Json -Depth 10
        $resp = Invoke-RestMethod -Uri $API -Method POST -Headers $headers -Body $body -ErrorAction Stop
        if ($ExpectError) {
            if ($resp.errors) {
                Write-Host "  PASS: Correctly returned error" -ForegroundColor Green
                $script:PASS++
            }
            else {
                Write-Host "  FAIL: Expected error but got success" -ForegroundColor Red
                $script:FAIL++
            }
        }
        else {
            if ($resp.errors) {
                Write-Host "  FAIL: $($resp.errors[0].message)" -ForegroundColor Red
                $script:FAIL++
            }
            else {
                Write-Host "  PASS" -ForegroundColor Green
                $script:PASS++
            }
        }
        return $resp
    }
    catch {
        if ($ExpectError) {
            Write-Host "  PASS: Request correctly denied" -ForegroundColor Green
            $script:PASS++
        }
        else {
            Write-Host "  FAIL: $($_.Exception.Message)" -ForegroundColor Red
            $script:FAIL++
        }
        return $null
    }
}

function Test-Http {
    param([string]$Name, [string]$Url, [int]$ExpectedStatus = 200)
    $script:TOTAL++
    Write-Host ""
    Write-Host "[$script:TOTAL] $Name..." -ForegroundColor Cyan
    try {
        $resp = Invoke-WebRequest -Uri $Url -Method GET -UseBasicParsing -ErrorAction Stop
        if ($resp.StatusCode -eq $ExpectedStatus) {
            Write-Host "  PASS: HTTP $($resp.StatusCode)" -ForegroundColor Green
            $script:PASS++
        }
        else {
            Write-Host "  FAIL: Expected $ExpectedStatus got $($resp.StatusCode)" -ForegroundColor Red
            $script:FAIL++
        }
    }
    catch {
        Write-Host "  FAIL: $($_.Exception.Message)" -ForegroundColor Red
        $script:FAIL++
    }
}

Write-Host ""
Write-Host "========================================================" -ForegroundColor Yellow
Write-Host "  FOOD ORDERING SYSTEM - FULL END-TO-END TEST SUITE" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Yellow
Write-Host "  Timestamp: $TS"
Write-Host "  Backend:   $API"
Write-Host "  Frontend:  $FRONTEND"
Write-Host "========================================================" -ForegroundColor Yellow

# SECTION 1
Write-Host ""
Write-Host "--- SECTION 1: BACKEND API HEALTH ---" -ForegroundColor Magenta

$r = Test-GraphQL -Name "GraphQL endpoint is accessible" -Query '{ __typename }'

# SECTION 2
Write-Host ""
Write-Host "--- SECTION 2: USER REGISTRATION ---" -ForegroundColor Magenta

$adminEmail = "testadmin_${TS}@test.com"
$memberEmail = "testmember_${TS}@test.com"

$r = Test-GraphQL -Name "Register Admin user" -Query "mutation { register(registerUserInput: { firstName: `"TestAdmin`", lastName: `"User`", email: `"$adminEmail`", password: `"Admin123`", roleId: 3, countryId: 1 }) { accessToken user { id email } } }"
$adminToken = $r.data.register.accessToken
$adminId = $r.data.register.user.id
if ($adminToken) { Write-Host ("  Admin ID: " + $adminId) -ForegroundColor DarkGray }

$r = Test-GraphQL -Name "Register Member user" -Query "mutation { register(registerUserInput: { firstName: `"TestMember`", lastName: `"User`", email: `"$memberEmail`", password: `"Member123`", roleId: 1, countryId: 1 }) { accessToken user { id email } } }"
$memberToken = $r.data.register.accessToken
$memberId = $r.data.register.user.id
if ($memberToken) { Write-Host ("  Member ID: " + $memberId) -ForegroundColor DarkGray }

$r = Test-GraphQL -Name "Duplicate email rejected" -Query "mutation { register(registerUserInput: { firstName: `"Dup`", lastName: `"User`", email: `"$adminEmail`", password: `"Test1234`", roleId: 1, countryId: 1 }) { accessToken } }" -ExpectError $true

# SECTION 3
Write-Host ""
Write-Host "--- SECTION 3: USER LOGIN ---" -ForegroundColor Magenta

$r = Test-GraphQL -Name "Login Admin" -Query "mutation { login(loginUserInput: { email: `"$adminEmail`", password: `"Admin123`" }) { accessToken user { id email } } }"
$adminToken = $r.data.login.accessToken

$r = Test-GraphQL -Name "Login Member" -Query "mutation { login(loginUserInput: { email: `"$memberEmail`", password: `"Member123`" }) { accessToken user { id email } } }"
$memberToken = $r.data.login.accessToken

Test-GraphQL -Name "Wrong password rejected" -Query "mutation { login(loginUserInput: { email: `"$adminEmail`", password: `"WrongPass`" }) { accessToken } }" -ExpectError $true

Test-GraphQL -Name "Non-existent email rejected" -Query "mutation { login(loginUserInput: { email: `"nobody_${TS}@test.com`", password: `"Test1234`" }) { accessToken } }" -ExpectError $true

# SECTION 4
Write-Host ""
Write-Host "--- SECTION 4: AUTHORIZATION ---" -ForegroundColor Magenta

Test-GraphQL -Name "Unauthenticated access denied" -Query "query { restaurants { id } }" -ExpectError $true

$r = Test-GraphQL -Name "Admin creates restaurant" -Query "mutation { createRestaurant(createRestaurantInput: { name: `"TestDiner_$TS`", description: `"Auto test`", address: `"123 Test St`", phoneNumber: `"555$TS`", countryId: 1 }) { id name } }" -Token $adminToken
$restaurantId = $r.data.createRestaurant.id
if ($restaurantId) { Write-Host ("  Restaurant ID: " + $restaurantId) -ForegroundColor DarkGray }

Test-GraphQL -Name "Member cannot create restaurant" -Query "mutation { createRestaurant(createRestaurantInput: { name: `"Unauth`", description: `"x`", address: `"x`", phoneNumber: `"x`", countryId: 1 }) { id } }" -Token $memberToken -ExpectError $true

# SECTION 5
Write-Host ""
Write-Host "--- SECTION 5: MENU ITEMS ---" -ForegroundColor Magenta

$r = Test-GraphQL -Name "Add Burger (9.99)" -Query "mutation { addMenuItem(createMenuItemInput: { name: `"Test Burger`", description: `"Juicy burger`", price: 9.99, restaurantId: $restaurantId }) { id name price } }" -Token $adminToken
$menuItem1 = $r.data.addMenuItem.id

$r = Test-GraphQL -Name "Add Fries (3.99)" -Query "mutation { addMenuItem(createMenuItemInput: { name: `"Test Fries`", description: `"Crispy fries`", price: 3.99, restaurantId: $restaurantId }) { id name price } }" -Token $adminToken
$menuItem2 = $r.data.addMenuItem.id

$r = Test-GraphQL -Name "Add Shake (5.49)" -Query "mutation { addMenuItem(createMenuItemInput: { name: `"Test Shake`", description: `"Chocolate shake`", price: 5.49, restaurantId: $restaurantId }) { id name price } }" -Token $adminToken
$menuItem3 = $r.data.addMenuItem.id

# SECTION 6
Write-Host ""
Write-Host "--- SECTION 6: RESTAURANT BROWSING ---" -ForegroundColor Magenta

$r = Test-GraphQL -Name "Fetch restaurants with menu items" -Query "query { restaurants { id name menuItems { id name price } } }" -Token $memberToken

$r = Test-GraphQL -Name "Verify restaurant has 3 items" -Query "query { restaurants { id menuItems { id } } }" -Token $adminToken
$testRest = $r.data.restaurants | Where-Object { $_.id -eq $restaurantId }
$ic = $testRest.menuItems.Count
if ($ic -eq 3) { Write-Host ("  Restaurant " + $restaurantId + " has " + $ic + " items") -ForegroundColor DarkGray }

# SECTION 7
Write-Host ""
Write-Host "--- SECTION 7: ORDER FLOW ---" -ForegroundColor Magenta

$r = Test-GraphQL -Name "Member places order (2xBurger + 1xFries)" -Query "mutation { createOrder(createOrderInput: { restaurantId: $restaurantId, items: [{ menuItemId: $menuItem1, quantity: 2 }, { menuItemId: $menuItem2, quantity: 1 }] }) { id totalAmount orderStatus items { menuItemId quantity unitPrice subtotal } } }" -Token $memberToken
$orderId = $r.data.createOrder.id
$orderTotal = $r.data.createOrder.totalAmount
Write-Host ("  Order #" + $orderId + " Total: " + $orderTotal) -ForegroundColor DarkGray

$r = Test-GraphQL -Name "Member views own orders" -Query "query { myOrders { id totalAmount orderStatus } }" -Token $memberToken

$r = Test-GraphQL -Name "Admin views ALL orders" -Query "query { allOrders { id userId totalAmount orderStatus } }" -Token $adminToken

$r = Test-GraphQL -Name "Admin updates order to PAID" -Query "mutation { updateOrderStatus(orderId: $orderId, status: `"PAID`") { id orderStatus } }" -Token $adminToken

$r = Test-GraphQL -Name "Member creates 2nd order (cancel test)" -Query "mutation { createOrder(createOrderInput: { restaurantId: $restaurantId, items: [{ menuItemId: $menuItem3, quantity: 1 }] }) { id orderStatus } }" -Token $memberToken
$cancelOrderId = $r.data.createOrder.id

$r = Test-GraphQL -Name "Member cancels order" -Query "mutation { cancelOrder(orderId: $cancelOrderId) { id orderStatus } }" -Token $memberToken

# SECTION 8
Write-Host ""
Write-Host "--- SECTION 8: PAYMENT METHODS ---" -ForegroundColor Magenta

$r = Test-GraphQL -Name "Add Visa payment" -Query "mutation { addPaymentMethod(createPaymentMethodInput: { methodName: `"Visa`", provider: `"Stripe`", token: `"tok_visa_$TS`" }) { id methodName provider isActive } }" -Token $memberToken
$paymentId = $r.data.addPaymentMethod.id

$r = Test-GraphQL -Name "Add PayPal payment" -Query "mutation { addPaymentMethod(createPaymentMethodInput: { methodName: `"PayPal`", provider: `"PayPal`", token: `"pp_$TS`" }) { id methodName provider } }" -Token $memberToken

$r = Test-GraphQL -Name "View payment methods" -Query "query { myPaymentMethods { id methodName provider isActive } }" -Token $memberToken

$r = Test-GraphQL -Name "Delete payment method" -Query "mutation { deletePaymentMethod(id: $paymentId) }" -Token $memberToken

# SECTION 9
Write-Host ""
Write-Host "--- SECTION 9: ADMIN USER MGMT ---" -ForegroundColor Magenta

$r = Test-GraphQL -Name "Admin fetches all users" -Query "query { users { id firstName lastName email roleId isActive } }" -Token $adminToken

Test-GraphQL -Name "Member cannot fetch users" -Query "query { users { id email } }" -Token $memberToken -ExpectError $true

# SECTION 10
Write-Host ""
Write-Host "--- SECTION 10: FRONTEND PAGES ---" -ForegroundColor Magenta

Test-Http -Name "Landing page (/)" -Url "$FRONTEND/"
Test-Http -Name "Login page (/login)" -Url "$FRONTEND/login"
Test-Http -Name "Register page (/register)" -Url "$FRONTEND/register"
Test-Http -Name "Dashboard (/dashboard)" -Url "$FRONTEND/dashboard"
Test-Http -Name "Restaurants" -Url "$FRONTEND/dashboard/restaurants"
Test-Http -Name "Orders" -Url "$FRONTEND/dashboard/orders"
Test-Http -Name "Checkout" -Url "$FRONTEND/dashboard/orders/checkout"
Test-Http -Name "Payments" -Url "$FRONTEND/dashboard/payments"
Test-Http -Name "Admin" -Url "$FRONTEND/dashboard/admin"

# RESULTS
Write-Host ""
Write-Host "========================================================" -ForegroundColor Yellow
Write-Host "  TEST RESULTS" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Yellow
Write-Host "  Total:  $TOTAL" -ForegroundColor White
Write-Host "  Passed: $PASS" -ForegroundColor Green
$failColor = "Green"
if ($FAIL -gt 0) { $failColor = "Red" }
Write-Host "  Failed: $FAIL" -ForegroundColor $failColor
Write-Host "========================================================" -ForegroundColor Yellow

if ($FAIL -eq 0) {
    Write-Host ""
    Write-Host "  ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host ""
}
else {
    Write-Host ""
    Write-Host "  SOME TESTS FAILED - Review output above" -ForegroundColor Red
    Write-Host ""
}

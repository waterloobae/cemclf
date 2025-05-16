<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'Blade Theme')</title>
</head>
<body>
    <header>
        <h1>Welcome to My Blade Theme</h1>
    </header>
    <main>
        @yield('content')
    </main>
    <footer>
        <p>Powered by Blade Theme</p>
    </footer>
</body>
</html>

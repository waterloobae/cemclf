<header id="main-header" class="sticky-top">
    <div class="header-border">
        <div class="gradient-bars">
            <span class="bar-one"></span>
            <span class="bar-two"></span>
            <span class="bar-three"></span>
            <span class="bar-four"></span>
        </div>
    </div>
    <div id="header-content" class="container-fluid container-xxl">
        <nav class="navbar">
            <a class="navbar-brand" href="https://cemc.uwaterloo.ca/">
                <img src="{{ asset('vendor/cemclf/images/cemc_logo.svg') }}" alt="CEMC Logo" />
            </a>
            @auth
                @include('layouts.navigation')
            @endauth
            {{ $slot }}
        </nav>
    </div>
</header> 

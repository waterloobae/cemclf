<!DOCTYPE html>
<html lang="en">
<head>
	<x-cemclf::cemc-head>
		@yield('title', 'CEMC website')
	</x-cemclf::cemc-head>
</head>

<body class="tex2jax_ignore" data-aos-easing="ease" data-aos-duration="400" data-aos-delay="0">
	<x-cemclf::cemc-header :nav="$nav ?? []" />
	
	<x-cemclf::cemc-hero-banner 
		:h1="View::yieldContent('h1')"
		:image="View::hasSection('image') ? View::yieldContent('image') : null"
	>
			@yield('hero-content')
	</x-cemclf::cemc-hero-banner>

    <div class="container justify-content-center w-50">
        <div class="body">			
			@yield('content')
        </div>
    </div>
	<x-cemclf::cemc-footer />
	<x-cemclf::cemc-bottom />
</body>
</html>

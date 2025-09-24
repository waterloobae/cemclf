# CEMCLF - Laravel Blade Theme Package

A comprehensive Laravel Blade theme package that provides the **Centre for Education in Mathematics and Computing (CEMC)** look and feel for University of Waterloo applications.

## 🎯 **Features**

- **Complete CEMC Theme**: Professional University of Waterloo CEMC branding
- **Responsive Design**: Mobile-first Bootstrap-based layout
- **Blade Components**: Reusable UI components for consistent design
- **Hero Banner System**: Customizable hero sections with optional images
- **Navigation System**: Multi-level dropdown navigation support  
- **Asset Management**: CSS, JavaScript, and image assets included
- **Easy Integration**: Drop-in replacement for Laravel layouts
- **Customizable**: All views and assets can be published and modified

## 📋 **Requirements**

- PHP 8.2 or higher
- Laravel 10.0, 11.0, or 12.0
- Bootstrap CSS framework (included in package assets)

## 🚀 **Installation**

### 1. Install via Composer

```bash
composer require waterloobae/cemclf
```

### 2. Update Dependencies

```bash
composer update
```

### 3. Publish Assets (if needed)

The package automatically publishes assets during installation, but you can manually publish them if needed:

```bash
# Publish all assets and views
php artisan vendor:publish --tag=cemclf --force

# Or for Laravel Sail
sail artisan vendor:publish --tag=cemclf --force
```

### 4. Individual Publishing Options

```bash
# Publish only views (for customization)
php artisan vendor:publish --tag=cemclf-views

# Publish only assets (CSS, JS, images)
php artisan vendor:publish --tag=cemclf-assets
```

## 📁 **Package Structure**

```
packages/waterloobae/cemclf/
├── src/
│   ├── CemcLookAndFeelServiceProvider.php    # Service provider
│   └── View/Components/                       # Blade components
│       ├── CemcHead.php                      # <head> section component
│       ├── CemcHeader.php                    # Header with navigation
│       ├── CemcNav.php                       # Navigation menu
│       ├── CemcHeroBanner.php               # Hero banner section
│       ├── CemcFooter.php                   # Footer section
│       └── CemcBottom.php                   # Bottom scripts
├── resources/
│   └── views/
│       ├── layout.blade.php                 # Main layout template
│       └── components/                      # Component templates
├── public/
│   ├── css/                                # CEMC stylesheets
│   ├── images/                            # CEMC images and logos
│   └── js/                               # JavaScript files
└── composer.json
```

## 🛠 **Available Blade Components**

### Core Components

| Component | Description | Props |
|-----------|-------------|--------|
| `<x-cemclf::cemc-head>` | HTML head section with CEMC styles | Content for `<title>` |
| `<x-cemclf::cemc-header>` | Header with logo and navigation | `nav` array |
| `<x-cemclf::cemc-nav>` | Navigation menu | `nav` array |
| `<x-cemclf::cemc-hero-banner>` | Hero banner section | `h1`, `image` (optional) |
| `<x-cemclf::cemc-footer>` | Footer section | None |
| `<x-cemclf::cemc-bottom>` | Bottom scripts and elements | None |

## 📖 **Basic Usage**

### 1. Create a Blade View

Create your view file extending the CEMCLF layout:

```blade
{{-- resources/views/welcome.blade.php --}}
@extends('cemclf::layout')

@section('title', 'Welcome to CEMC')

@section('inside-head-tag')
    <meta name="description" content="Centre for Education in Mathematics and Computing" />
    <meta name="keywords" content="CEMC, University of Waterloo, Mathematics, Computing" />
@endsection

@section('h1', 'Problem Set Generator')
@section('image', asset('vendor/cemclf/images/guy_in_computer.jpeg'))

@section('hero-content')
    Welcome to the Centre for Education in Mathematics and Computing. 
    Explore our educational resources and problem sets.
@endsection

@section('content')
    <div class="row">
        <div class="col-md-8">
            <h2>Featured Content</h2>
            <p>Your main page content goes here...</p>
        </div>
        <div class="col-md-4">
            <h3>Quick Links</h3>
            <ul class="list-unstyled">
                <li><a href="#">Mathematics Resources</a></li>
                <li><a href="#">Computing Tutorials</a></li>
                <li><a href="#">Problem Sets</a></li>
            </ul>
        </div>
    </div>
@endsection
```

### 2. Define Routes with Navigation

```php
{{-- routes/web.php --}}

Route::get('/', function () {
    $nav = [
        ['label' => 'Home', 'url' => '/'],
        ['label' => 'About CEMC', 'url' => '/about'],
        [
            'label' => 'Resources', 
            'submenu' => [
                ['label' => 'Mathematics', 'url' => '/resources/mathematics'],
                ['label' => 'Computer Science', 'url' => '/resources/computing'],
                ['label' => 'Problem Sets', 'url' => '/resources/problems'],
            ]
        ],
        ['label' => 'Contests', 'url' => '/contests'],
        ['label' => 'Contact', 'url' => '/contact'],
    ];
    
    return view('welcome', ['nav' => $nav]);
});
```

## 🔧 **Advanced Usage**

### Navigation Structure

The navigation system supports multi-level dropdowns:

```php
$nav = [
    // Simple navigation item
    ['label' => 'Home', 'url' => '/'],
    
    // Dropdown navigation with submenu
    [
        'label' => 'Resources',
        'submenu' => [
            ['label' => 'Mathematics', 'url' => '/math'],
            ['label' => 'Computing', 'url' => '/computing'],
            ['label' => 'Problem Sets', 'url' => '/problems'],
        ]
    ],
    
    // External link
    ['label' => 'UW Homepage', 'url' => 'https://uwaterloo.ca'],
];
```

### Hero Banner Options

```blade
{{-- Hero banner with image --}}
@section('h1', 'Welcome to CEMC')
@section('image', asset('vendor/cemclf/images/guy_in_computer.jpeg'))
@section('hero-content')
    Your hero banner description text
@endsection

{{-- Hero banner without image --}}
@section('h1', 'Mathematics Resources')
@section('hero-content')
    Explore our comprehensive mathematics learning materials
@endsection
```

### Using Individual Components

You can use components individually in custom layouts:

```blade
<!DOCTYPE html>
<html lang="en">
<head>
    <x-cemclf::cemc-head>My Custom Page Title</x-cemclf::cemc-head>
</head>
<body>
    <x-cemclf::cemc-header :nav="$navigation" />
    
    <main class="container">
        <x-cemclf::cemc-hero-banner 
            h1="Custom Hero Title"
            :image="asset('images/custom-hero.jpg')"
        >
            Custom hero content here
        </x-cemclf::cemc-hero-banner>
        
        <!-- Your content -->
        
    </main>
    
    <x-cemclf::cemc-footer />
    <x-cemclf::cemc-bottom />
</body>
</html>
```

## 🎨 **Customization**

### Publishing Views for Customization

```bash
# Publish views to customize templates
php artisan vendor:publish --tag=cemclf-views
```

This creates files in:
- `resources/views/vendor/cemclf/layout.blade.php`
- `resources/views/vendor/cemclf/components/`

### Publishing Assets for Customization

```bash
# Publish assets to customize styles
php artisan vendor:publish --tag=cemclf-assets
```

This creates files in:
- `public/vendor/cemclf/css/` - CEMC stylesheets
- `public/vendor/cemclf/images/` - CEMC logos and images
- `public/vendor/cemclf/js/` - JavaScript files

### Available CSS Classes

The package includes CEMC-specific CSS classes:

```css
/* Layout classes */
.hero-banner              /* Hero section styling */
.navbar-brand            /* Logo container */
.gradient-bars           /* CEMC header gradient */

/* Component classes */
.field_hero_title        /* Hero title styling */
.hero-banner-body        /* Hero content area */
.navbar-nav              /* Navigation menu */
.dropdown-menu           /* Navigation dropdowns */
```

## 🖼 **Available Assets**

### Images
- `CEMC-logo-BW.png` - CEMC logo (black & white)
- `cemc_logo.svg` - CEMC logo (vector)
- `UniversityOfWaterloo_header_logo.png` - UW header logo
- `guy_in_computer.jpeg` - Default hero image
- Social media icons (Facebook, Twitter, Instagram, YouTube)

### Stylesheets
- `cemc.css` - Main CEMC styles
- `drupal1.css`, `drupal2.css`, `drupal3.css` - Drupal compatibility styles

## 📱 **Responsive Design**

The package includes responsive breakpoints:

- **Mobile**: `< 768px` - Collapsed navigation, stacked layout
- **Tablet**: `768px - 992px` - Responsive navigation, flexible grid
- **Desktop**: `> 992px` - Full navigation, multi-column layout

## 🔍 **Troubleshooting**

### Assets Not Loading

1. **Clear Laravel caches**:
```bash
php artisan config:clear
php artisan view:clear
php artisan cache:clear
```

2. **Republish assets**:
```bash
php artisan vendor:publish --tag=cemclf-assets --force
```

3. **Check asset paths**:
```bash
# Verify assets exist
ls -la public/vendor/cemclf/
```

### Navigation Not Appearing

Ensure you're passing the `nav` array to your view:

```php
return view('your-view', ['nav' => $navArray]);
```

### Styling Issues

1. **Check CSS load order** in the head component
2. **Verify Bootstrap compatibility** if using custom CSS
3. **Clear browser cache** and **Laravel view cache**

## 🧪 **Example Implementation**

Complete example for a CEMC website:

```php
// routes/web.php
Route::get('/', function () {
    $nav = [
        ['label' => 'Home', 'url' => '/'],
        ['label' => 'About', 'url' => '/about'],
        [
            'label' => 'Mathematics',
            'submenu' => [
                ['label' => 'Algebra', 'url' => '/math/algebra'],
                ['label' => 'Calculus', 'url' => '/math/calculus'],
                ['label' => 'Statistics', 'url' => '/math/statistics'],
            ]
        ],
        [
            'label' => 'Computing',
            'submenu' => [
                ['label' => 'Programming', 'url' => '/cs/programming'],
                ['label' => 'Algorithms', 'url' => '/cs/algorithms'],
                ['label' => 'Data Structures', 'url' => '/cs/data-structures'],
            ]
        ],
        ['label' => 'Contests', 'url' => '/contests'],
    ];
    
    return view('welcome', compact('nav'));
});
```

```blade
{{-- resources/views/welcome.blade.php --}}
@extends('cemclf::layout')

@section('title', 'CEMC - University of Waterloo')
@section('h1', 'Centre for Education in Mathematics and Computing')
@section('image', asset('vendor/cemclf/images/guy_in_computer.jpeg'))

@section('hero-content')
    Enhancing mathematics and computer science education through innovative 
    resources, contests, and professional development opportunities.
@endsection

@section('content')
<div class="row mb-5">
    <div class="col-lg-8">
        <h2>Welcome to CEMC</h2>
        <p class="lead">
            The Centre for Education in Mathematics and Computing provides 
            resources and programs designed to help educators and students 
            explore and learn mathematics and computer science.
        </p>
        
        <div class="row">
            <div class="col-md-6 mb-4">
                <h3>Mathematics Resources</h3>
                <p>Comprehensive materials covering algebra, calculus, 
                statistics, and more.</p>
                <a href="/mathematics" class="btn btn-primary">Explore Math</a>
            </div>
            <div class="col-md-6 mb-4">
                <h3>Computing Resources</h3>
                <p>Programming tutorials, algorithm challenges, and 
                computer science fundamentals.</p>
                <a href="/computing" class="btn btn-primary">Explore CS</a>
            </div>
        </div>
    </div>
    
    <div class="col-lg-4">
        <div class="card">
            <div class="card-header">
                <h4>Quick Links</h4>
            </div>
            <div class="card-body">
                <ul class="list-unstyled">
                    <li><a href="/contests">Math Contests</a></li>
                    <li><a href="/workshops">Teacher Workshops</a></li>
                    <li><a href="/resources">Educational Resources</a></li>
                    <li><a href="/about">About CEMC</a></li>
                </ul>
            </div>
        </div>
    </div>
</div>
@endsection
```

## 📞 **Support**

- **Package Author**: Terry Bae (terry.bae@gmail.com)
- **License**: MIT License
- **Repository**: Part of University of Waterloo CEMC projects

## 🔄 **Version History**

- **Current**: Supports Laravel 10.x, 11.x, 12.x
- **PHP**: Requires PHP 8.2+
- **Bootstrap**: Compatible with Bootstrap 5.x

---

*This package provides the official CEMC (Centre for Education in Mathematics and Computing) theme for University of Waterloo Laravel applications.*


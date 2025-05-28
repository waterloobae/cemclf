# How to Install
Since this package repository is private, it uses Composer's vcs repository locally and does not use Packagit.

First, add following codes into your project composer.json.

```json
"repositories": [
  {
    "type": "vcs",
    "url": "https://git.uwaterloo.ca/cemc-development-team/LookAndFeel.git"
  }
],
"require": {
  "cemc-development-team/lookandfeel": "dev-main"
}
```
Then, edit ~/.composer/auth.json for credentials to include following codes or create auth.json in the package root directory
After those two steps above are done, run the command as below.
```bash
composer update
```
Your project should be ready to use cemclf package for now.

It is possible CSS, JS and image asset files are not published automaticall. If not, run either of command below.
```base
php artisan vendor:publish --tag=cemclf --force
sail artisan vendor:publish --tag=cemclf --force
```

# How to Use

image section is optional.
```php
{{-- resources/views/welcome.blade.php --}}
@extends('cemclf::layout')
@section('title', 'Welcome to CEMC')  
@section('inside-head-tag')
	<meta name="description" content="Look and Feel template test." />
@endsection
@section('h1', 'Problem Set Generator')
@section('image', asset('vendor/cemclf/images/guy_in_computer.jpeg') . '?itok=lHrMwHeX')

@section('hero-content')
    Wordings for contents in Hero Banner
@endsection

@section('content')
    <p>Your page contents!</p>

@endsection
```
In /routes/web.php, you can add routes as below. $nav is optional. Without $nav, the page just won't display navigation bar.
```php
Route::get('/', function () {
    // return view('welcome');
    return view('welcome', [
        'nav' => [
            ['label' => 'Home', 'url' => '/'],
            ['label' => 'About', 'url' => '/about'],
            ['label' => 'Services', 'submenu' => [
                ['label' => 'Web Dev', 'url' => '/services/web'],
                ['label' => 'SEO', 'url' => '/services/seo'],
            ]],
        ],
    ]);
});
```
or
```php
$nav = [
    ['label' => 'Home', 'url' => '/'],
    ['label' => 'About', 'url' => '/about'],
    ['label' => 'Services', 'submenu' => [
        ['label' => 'Web Dev', 'url' => '/services/web'],
        ['label' => 'SEO', 'url' => '/services/seo'],
    ]],
];

Route::get('/', function () use ($nav) {
    return view('cemc', ['nav' => $nav]);
});
```


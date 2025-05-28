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
```json
{
    "gitlab-token": {
        "git.uwaterloo.ca": "glpat-wqUxTpEP-kqyfQ6tbfBD"
    }
}
```
After those two steps above are done, run the command as below.
```bash
composer update
```
Your project should be ready to use cemclf package for now.

# How to Use

```php
{{-- resources/views/welcome.blade.php --}}
@extends('cemclf::layout')
@section('title', 'Welcome to CEMC')  
@section('h1', 'Problem Set Generator')
@section('image', asset('vendor/cemclf/images/guy_in_computer.jpeg') . '?itok=lHrMwHeX')

@section('hero-content')
    Wordings for contents in Hero Banner
@endsection

@section('content')
    <p>Your page contents!</p>

@endsection
```
In /routes/web.php, you can add routes as below.
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


<?php

use Illuminate\Support\Facades\Blade;

it('registers the package layout and component views', function () {
    expect(view()->exists('cemclf::layout'))->toBeTrue()
        ->and(view()->exists('cemclf::components.cemc-header'))->toBeTrue()
        ->and(view()->exists('cemclf::components.cemc-nav'))->toBeTrue()
        ->and(view()->exists('cemclf::components.cemc-hero-banner'))->toBeTrue();
});

it('renders header navigation through the package Blade components', function () {
    $html = Blade::render(
        '<x-cemclf::cemc-header :nav="$nav" />',
        ['nav' => [['label' => 'Home', 'url' => '/home']]],
    );

    expect($html)->toContain('href="/home"')
        ->and($html)->toContain('>Home</a>');
});

it('renders submenu items and escapes navigation labels', function () {
    $html = Blade::render(
        '<x-cemclf::cemc-nav :nav="$nav" />',
        ['nav' => [[
            'label' => '<Math & Logic>',
            'submenu' => [['label' => 'Practice', 'url' => '/practice']],
        ]]],
    );

    expect($html)->toContain('&lt;Math &amp; Logic&gt;')
        ->and($html)->toContain('href="/practice"')
        ->and($html)->toContain('>Practice</a>');
});

it('renders hero content with an optional image', function () {
    $html = Blade::render(
        '<x-cemclf::cemc-hero-banner h1="Problem Sets" image="/images/banner.jpg">Explore problems</x-cemclf::cemc-hero-banner>',
    );

    expect($html)->toContain('Problem Sets')
        ->and($html)->toContain('Explore problems')
        ->and($html)->toContain('src="/images/banner.jpg"');
});
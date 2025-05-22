<?php

namespace WaterlooBae\Cemclf;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Blade;

class CemcLookAndFeelServiceProvider extends ServiceProvider
{
    public function boot()
    {
        // Load package views
        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'cemclf');

        // Register Blade components with prefix
        Blade::componentNamespace('Waterloobae\\Cemclf\\View\\Components', 'cemclf');
        //Blade::component('cemclf::cemc-nav', CemcNav::class);

        // Optionally publish views for customization
        $this->publishes([
            __DIR__ . '/../resources/views' => resource_path('views/vendor/cemclf'),
        ], 'cemclf-views');

        $this->publishes([
        __DIR__ . '/../public' => public_path('vendor/cemclf'),
        ], 'cemclf-assets');

        $this->publishes([
        // all in one go
        __DIR__ . '/../resources/views' => resource_path('views/vendor/cemclf'),
        __DIR__ . '/../public' => public_path('vendor/cemclf'),
    ], 'cemclf');


    }

    public function register()
    {
        //
    }
}
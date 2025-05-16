<?php

namespace WaterlooBae\CEMCLF;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Blade;

class CemcLookAndFeelServiceProvider extends ServiceProvider
{
    public function boot()
    {
        // Load package views
        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'CEMCLF');

        // Register Blade components with prefix
        Blade::componentNamespace('Waterloobae\\Cemclf\\View\\Components', 'cemclf');

        // Optionally publish views for customization
        $this->publishes([
            __DIR__ . '/../resources/views' => resource_path('views/vendor/CEMCLF'),
        ], 'cemclf-views');

        $this->publishes([
        __DIR__ . '/../public' => public_path('vendor/cemclf'),
        ], 'cemclf-assets');
    }

    public function register()
    {
        //
    }
}
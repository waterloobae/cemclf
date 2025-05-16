<?php

namespace WaterlooBae\CEMCLF;

use Illuminate\Support\ServiceProvider;

class CemcLookAndFeelServiceProvider extends ServiceProvider
{
    public function boot()
    {
        // Load package views
        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'CEMCLF');

        // Optionally publish views for customization
        $this->publishes([
            __DIR__ . '/../resources/views' => resource_path('views/vendor/CEMCLF'),
        ], 'cemclf-views');
    }

    public function register()
    {
        //
    }
}
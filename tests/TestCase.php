<?php

namespace Waterloobae\Cemclf\Tests;

use Orchestra\Testbench\TestCase as Orchestra;
use WaterlooBae\Cemclf\CemcLookAndFeelServiceProvider;

abstract class TestCase extends Orchestra
{
    protected function getPackageProviders($app): array
    {
        return [CemcLookAndFeelServiceProvider::class];
    }
}
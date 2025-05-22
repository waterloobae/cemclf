<?php

namespace Waterloobae\Cemclf\View\Components;

use Illuminate\View\Component;

class CemcHeroBanner extends Component
{
    public string $h1;
    public ?string $image;

    public function __construct(string $h1, ?string $image = null)
    {
        $this->h1 = $h1;
        $this->image = $image;
    }

    public function render()
    {
        return view('cemclf::components.cemc-hero-banner');
    }
}
<?php
namespace Waterloobae\Cemclf\View\Components;

use Illuminate\View\Component;

class CemcNav extends Component
{
    public array $nav;

    public function __construct(array $nav = [])
    {
        $this->nav = $nav;
    }

    public function render()
    {
        return view('cemclf::components.cemc-nav');
    }
}
  @if (!empty($nav)) 
  <div class="collapse navbar-collapse" id="navbarCollapse">
    <div>
      <nav role="navigation" aria-labelledby="block-cemc-main-menu-menu" id="block-cemc-main-menu">
        <h2 class="visually-hidden" id="block-cemc-main-menu-menu">Main navigation</h2>
        <ul data-block="navigation" class="nav navbar-nav">
          @foreach ($nav as $item)
            <li class="nav-item">            
                @if (!empty($item['submenu']))
                    <span class="nav-link dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="false" aria-haspopup="true">{{ $item['label'] }}</span>
                    <ul class="dropdown-menu">
                        @foreach ($item['submenu'] as $subitem)
                            <li class="nav-item">
                                <a href="{{ $subitem['url'] }}" class="dropdown-item" data-drupal-link-system-path="node/718">{{ $subitem['label'] }}</a>
                            </li>
                        @endforeach
                    </ul>
                @else
                    <a href="{{ $item['url'] }}" class="nav-link" >{{ $item['label'] }}</a>
                @endif
          </li>
          @endforeach
        </ul>
      </nav>
    </div>
  </div>
  <div class="mini-toolbar">
    <button class="btn btn-primary nav-toggler d-lg-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-burger search-bar collapsed">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 12H18V10H0V12ZM0 7H18V5H0V7ZM0 0V2H18V0H0Z" fill="#151515" />
        </svg>
      </span>
      <span class="navbar-toggler-burger search-bar open">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="black" />
        </svg>
      </span>
    </button>
  </div>
 @endif
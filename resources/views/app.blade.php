<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- IBM Plex fonts used by Carbon are served from this CDN --}}
    <link rel="preconnect" href="https://1.www.s81c.com" crossorigin>

    <title inertia>{{ config('app.name', 'Kathy Command Centre') }}</title>

    @viteReactRefresh
    @vite(['resources/js/app.tsx'])
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>

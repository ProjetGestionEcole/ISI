<?php

use App\Console\Commands\ApiFunctionCommand;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use \App\Console\Commands\MakeServiceCommand;
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        api: __DIR__.'/../routes/api.php', // ajoute cette ligne !
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Configuration pour les routes API
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        // Exclure les routes API de la vérification CSRF
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);

        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
        ]);

        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })
    ->withCommands([MakeServiceCommand::class,
    ])
    ->withCommands([ApiFunctionCommand::class,
    ]) 
->create();
    

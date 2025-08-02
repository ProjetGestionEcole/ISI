<?php

namespace App\Console\Commands;

use Illuminate\Console\GeneratorCommand;
use Illuminate\Support\Str;

class ApiFunctionCommand extends GeneratorCommand
{
    protected $name = 'make:api-function';
    protected $description = 'Créer un contrôleur API dans app/Http/Controllers avec injection de service';
    protected $type = 'API Controller';

    // Le chemin vers le stub (adapter selon ton projet)
    protected function getStub(): string
    {
        return __DIR__.'/Stubs/apigenerator.stub';
    }

    // Namespace par défaut : app\Http\Controllers
    protected function getDefaultNamespace($rootNamespace): string
    {
        return $rootNamespace . '\Http\Controllers';
    }

    // Génération du fichier : remplace les variables dans le stub + vérifie service
    protected function buildClass($name): string
    {
        $stub = parent::buildClass($name);
        $className = class_basename($name);

        // Nom du model extrait du nom du controller (ex: NiveauController → Niveau)
        $modelName = Str::replaceLast('Controller', '', $className);

        // Vérifie que la classe service correspondante existe (ex: App\Services\NiveauService)
        $serviceClass = $this->rootNamespace() . 'Services\\' . $modelName . 'Service';

        if (!class_exists($serviceClass)) {
            $this->error("Erreur : la classe service {$serviceClass} n'existe pas. Créez-la avant de générer ce contrôleur.");
            exit(1); // Stop la commande artisan
        }

        $modelLower = Str::camel($modelName);
        $modelPlural = Str::pluralStudly($modelName);
        $modelLowerPlural = Str::plural($modelLower);

        // Remplacement dans le stub
        $stub = str_replace('{{ class }}', $className, $stub);
        $stub = str_replace('{{ namespace }}', $this->getNamespace($name), $stub);
        $stub = str_replace('{{ model }}', $modelName, $stub);
        $stub = str_replace('{{ modelLower }}', $modelLower, $stub);
        $stub = str_replace('{{ modelPlural }}', $modelPlural, $stub);
        $stub = str_replace('{{ modelLowerPlural }}', $modelLowerPlural, $stub);

        return $stub;
    }
}
// Usage : artisan make:api-function NomDuController
// Exemple : artisan make:api-function NiveauController
// Cela créera un fichier app/Http/Controllers/NiveauController.php avec le stub approprié.

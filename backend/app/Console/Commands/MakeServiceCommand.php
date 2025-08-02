<?php

/*namespace App\Console\Commands;

use Illuminate\Console\Command;

class MakeServiceCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
    protected $signature = 'app:make-service-command';

    /**
     * The console command description.
     *
     * @var string
    protected $description = 'Command description';

    /**
     * Execute the console command.
   
    public function handle()
    {
        
    }
}

namespace App\Console\Commands;

use Illuminate\Console\GeneratorCommand;

class MakeServiceCommand extends GeneratorCommand
{
    protected $name = 'make:service';

    protected $description = 'Créer une classe de service dans app/Services';

    protected $type = 'Service';

    protected function getStub(): string
    {
        return __DIR__.'/Stubs/service.stub';
    }

    protected function getDefaultNamespace($rootNamespace): string
    {
        return $rootNamespace.'\Services';
    }
}
*/
namespace App\Console\Commands;

use Illuminate\Console\GeneratorCommand;
use Illuminate\Support\Str;

class MakeServiceCommand extends GeneratorCommand
{
    protected $name = 'make:service';
    protected $description = 'Créer une classe de service dans app/Services';
    protected $type = 'Service';

    protected function getStub(): string
    {
        return __DIR__.'/Stubs/service.stub';
    }

    protected function getDefaultNamespace($rootNamespace): string
    {
        return $rootNamespace . '\Services';
    }

    protected function replaceClass($stub, $name)
    {
        $stub = parent::replaceClass($stub, $name);

        $model = str_replace('Service', '', class_basename($name));
        $modelLower = Str::camel($model);
        $modelPlural = Str::pluralStudly($model);
        $modelLowerPlural = Str::plural($modelLower);

        return str_replace(
            ['{{ model }}', '{{ modelLower }}', '{{ modelPlural }}', '{{ modelLowerPlural }}'],
            [$model, $modelLower, $modelPlural, $modelLowerPlural],
            $stub
        );
    }
}


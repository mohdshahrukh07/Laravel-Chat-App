<?php

// namespace App\Console\Commands;

// use Illuminate\Console\Command;
// use Symfony\Component\Process\Process;

// class ReverbStart extends Command
// {
//     /**
//      * The name and signature of the console command.
//      *
//      * @var string
//      */
//     protected $signature = 'reverb:start';

//     /**
//      * The console command description.
//      *
//      * @var string
//      */
//     protected $description = 'Start the Laravel server and the reverb process';

//     /**
//      * Execute the console command.
//      *
//      * @return int
//      */
//     public function handle()
//     {
//         $this->info('Starting the Laravel server...');
//         $serveProcess = new Process(['php', 'artisan', 'serve']);
//         $serveProcess->start();

//         // Ensure the server has started
//         sleep(2);

//         if (!$serveProcess->isRunning()) {
//             $this->error('Failed to start the Laravel server.');
//             return 1;
//         }

//         $this->info('Starting the reverb process...');
//         $reverbProcess = new Process(['php', 'artisan', 'reverb:start']);
//         $reverbProcess->setTty(true);
//         $reverbProcess->run();

//         if (!$reverbProcess->isSuccessful()) {
//             $this->error('Failed to start the reverb process.');
//             return 1;
//         }

//         $this->info('Both processes have been started.');
//         return 0;
//     }
// }

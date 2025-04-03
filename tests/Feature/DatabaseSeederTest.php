<?php

namespace Tests\Unit;

use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DatabaseSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_database_seeder_creates_users()
    {
        $this->seed(\Database\Seeders\DatabaseSeeder::class);

        $this->assertDatabaseCount('users', 12); // 2 specific users + 10 random users
    }

    public function test_database_seeder_creates_groups()
    {
        $this->seed(\Database\Seeders\DatabaseSeeder::class);

        $this->assertDatabaseCount('groups', 5);
    }

    public function test_database_seeder_creates_messages()
    {
        $this->seed(\Database\Seeders\DatabaseSeeder::class);

        $this->assertDatabaseCount('messages', 1000);
    }

    public function test_database_seeder_creates_conversations()
    {
        $this->seed(\Database\Seeders\DatabaseSeeder::class);

        $messages = Message::whereNull('group_id')->orderBy('created_at')->get();
        $conversations = $messages->groupBy(function ($message) {
            return collect([$message->sender_id, $message->receiver_id])
                ->sort()->implode('_');
        });

        $this->assertDatabaseCount('conversations', $conversations->count());
    }

    public function test_database_seeder_assigns_correct_owner_to_groups()
    {
        $this->seed(\Database\Seeders\DatabaseSeeder::class);

        $groups = Group::all();
        foreach ($groups as $group) {
            $this->assertEquals(1, $group->owner_id);
        }
    }

    public function test_database_seeder_attaches_users_to_groups_correctly()
    {
        $this->seed(\Database\Seeders\DatabaseSeeder::class);

        $groups = Group::with('users')->get();
        foreach ($groups as $group) {
            $this->assertGreaterThanOrEqual(2, $group->users->count());
            $this->assertLessThanOrEqual(6, $group->users->count()); // 1 owner + 1-5 random users
        }
    }
}
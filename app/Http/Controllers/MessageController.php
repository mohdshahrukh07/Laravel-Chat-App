<?php

namespace App\Http\Controllers;

use App\Events\SocketMessage;
use App\Http\Requests\StoreMessageRequest;
use App\Models\{Conversation, User, Group, Message, MessageAttachment};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\MessageResource;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
class MessageController extends Controller
{
    //
    public function byUser(User $user)
    {
        $message = Message::where('sender_id', Auth::id())->where('receiver_id', $user->id)
            ->orWhere('sender_id', $user->id)
            ->where('receiver_id', Auth::id())
            ->latest()
            ->paginate(10);

        return inertia('Home', [
            'selectedConversation' => $user->toConversationArray(),
            'messages' => MessageResource::collection($message),
        ]);
    }
    public function byGroup(Group $group)
    {
        $message = Message::where('group_id', $group->id)
            ->latest()
            ->paginate(10);
        return inertia('Home', [
            'selectedConversation' => $group->toConversationArray(),
            'messages' => MessageResource::collection($message),
        ]);
    }
    public function loadOlder(Message $message)
    {
        if ($message->group_id) {
            $message = Message::where('created_at', '<', $message->created_at)
                ->where('group_id', $message->group_id)
                ->latest()
                ->paginate(10);
        } else {
            $message = Message::where('created_at', '<', $message->created_at)
                ->where(function ($query) use ($message) {
                    $query->where('sender_id', $message->sender_id)
                        ->where('receiver_id', $message->receiver_id)
                        ->orWhere('sender_id', $message->receiver_id)
                        ->where('receiver_id', $message->sender_id);
                })
                ->latest()
                ->paginate(10);
        }
        return MessageResource::collection($message);
    }
    public function store(StoreMessageRequest $request)
    {
        $data = $request->validated();
        $data['sender_id'] = Auth::id();
        $receiverId = $data['receiver_id'] ?? null;
        $groupId = $data['group_id'] ?? null;

        $files = $data['attachments'] ?? [];
        $message = Message::create($data);

        $attachments = [];
        if ($files) {
            foreach ($files as $file) {
                $directory = 'attachments/' . Str::random(32);
                Storage::makeDirectory($directory);

                $model = [
                    'message_id' => $message->id,
                    'name' => $file->getClientOriginalName(),
                    'mime' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                    'path' => $file->store($directory, 'public'),
                ];
                $attachment = MessageAttachment::create($model);
                $attachments[] = $attachment;
            }
            $message->attachments = $attachments;
        }
        if ($receiverId) {
            Conversation::updateConversationWithMessage($receiverId, Auth::id(), $message);
        }
        if ($groupId) {
            Group::updateGroupWithMessage($groupId, $message);
        }
        SocketMessage::dispatch($message);
        return new MessageResource($message);
    }
    public function destroy(Message $message)
    {
        if ($message->sender_id !== Auth::id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $message->delete();
        return response('', 204);
    }
}

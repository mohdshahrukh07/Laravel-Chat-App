<?php

namespace App\Http\Resources;

use App\Models\Message;
use App\Http\Resources\UserResource;
use App\Http\Resources\MessageAttachmentResouce;
use App\Models\MessageAttachment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'message'=>$this->message,
            'receiver_id'=>$this->receiver_id,
            'sender'=>new UserResource($this->sender),
            'group_id'=>$this->group_id,
            'attachments'=>MessageAttachmentResource::collection($this->attachments),
            'created_at'=>$this->created_at,
            'updated_at'=>$this->updated_at,

        ];
    }
}
 
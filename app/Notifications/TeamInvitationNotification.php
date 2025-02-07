<?php

namespace App\Notifications;

use App\Models\Team;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;

class TeamInvitationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected string $invitationId;
    protected User $user;
    protected Team $team;
    protected string $email;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $invitationId, User $user, Team $team, string $email)
    {
        $this->invitationId = $invitationId;
        $this->user = $user;
        $this->team = $team;
        $this->email = $email;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['broadcast'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'invitation_id' => $this->invitationId,
            'team_id' => $this->team->id,
            'team_name' => $this->team->name,
            'inviter_id' => $this->user->id,
            'inviter_name' => $this->user->name,
            'inviter_email' => $this->user->email,
            'email' => $this->email,
            'message' => 'You have been invited to join the team.',
        ]);
    }
}

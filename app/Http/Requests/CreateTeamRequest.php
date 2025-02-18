<?php

namespace App\Http\Requests;

use App\Enums\TeamRole;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class CreateTeamRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'teamName' => ['required', 'string', 'max:255'],
            'teamDescription' => ['string', 'max:2000'],
            'invites' => ['nullable', 'array'],
            'invites.*.email' => ['required', 'email'],
            'invites.*.role' => ['required', Rule::enum(TeamRole::class)],
        ];
    }
}

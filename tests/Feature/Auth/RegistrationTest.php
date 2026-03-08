<?php

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
});

test('new users can register as owner', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => 'owner',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('new users can register as developer', function () {
    $response = $this->post('/register', [
        'name' => 'Dev User',
        'email' => 'dev@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => 'developer',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('my-tasks', absolute: false));
});

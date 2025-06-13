<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('home');
});

Route::get('/register', function () {
    return view('register');
});

Route::get('/users/dash', function () {
    return view('users/dash');
});

Route::get('/users/form', function () {
    return view('users/form');
});

Route::get('/users/profile', function () {
    return view('users/profile');
});

// NU Admin ROUTES

Route::get('/admin/dash', function () {
    return view('nu_admin/dash');
});

Route::get('/admin/profile', function () {
    return view('nu_admin/profile');
});

Route::get('/admin/manage-acc', function () {
    return view('nu_admin/manage_acc');
});

Route::get('/admin/create-form', function () {
    return view('nu_admin/create_form');
});

Route::get('/admin/form-analysis', function () {
    return view('nu_admin/form_analysis');
});

Route::get('/admin/graphical-analysis', function () {
    return view('nu_admin/graphical_analysis');
});

Route::get('/admin/edit-event', function () {
    return view('nu_admin/edit_event');
});

// NU Organizer ROUTES

Route::get('/organizer/dash', function () {
    return view('nu_organizer/dash');
});

Route::get('/organizer/profile', function () {
    return view('nu_organizer/profile');
});

Route::get('/organizer/manage-acc', function () {
    return view('nu_organizer/manage_acc');
});

Route::get('/organizer/form-analysis', function () {
    return view('nu_organizer/form_analysis');
});

Route::get('/organizer/graphical-analysis', function () {
    return view('nu_organizer/graphical_analysis');
});

// DEPT ROUTES

Route::get('/dept/dash', function () {
    return view('dept_admins/dash');
});

Route::get('/dept/profile', function () {
    return view('dept_admins/profile');
});

Route::get('/dept/manage-acc', function () {
    return view('dept_admins/manage_acc');
});

Route::get('/dept/create-form', function () {
    return view('dept_admins/create_form');
});

Route::get('/dept/form-analysis', function () {
    return view('dept_admins/form_analysis');
});

Route::get('/dept/graphical-analysis', function () {
    return view('dept_admins/graphical_analysis');
});

Route::get('/dept/edit-event', function () {
    return view('dept_admins/edit_event');
});
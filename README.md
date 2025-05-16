# Real-Time Notification Backend API

## User Authentication & Management APIs
## BASE URL = https://real-time-notif-be-a9b1.vercel.app

### Register a new user

* **POST /api/v1/users/register**
	+ Request Body: `name`, `email`, `password`
	+ Response: `accessToken`, `refreshToken`

### Login a user

* **POST /api/v1/users/login**
	+ Request Body: `email`, `password`
	+ Response: `accessToken`, `refreshToken`

### Logout a user

* **POST /api/v1/users/logout**
	+ Request Headers: `Authorization: Bearer <accessToken>`
	+ Response: `message`

### Refresh access token

* **GET /api/v1/users/refresh-token**
	+ Request Headers: `Authorization: Bearer <refreshToken>`
	+ Response: `accessToken`

### Forgot password

* **POST /api/v1/users/forgot-password**
	+ Request Body: `email`
	+ Response: `message`

### Reset password

* **POST /api/v1/users/reset-password/:resetToken**
	+ Request Body: `password`, `confirmPassword`
	+ Request Params: `resetToken`
	+ Response: `message`

### Get current user

* **GET /api/v1/users/current-user**
	+ Request Headers: `Authorization: Bearer <accessToken>`
	+ Response: `user`

## Notification APIs

### Create and send a notification

* **POST /api/v1/notifications**
	+ Request Body: `title`, `message`, `type` 
	+ Response: `notification`

### Get total notifications

* **GET /api/v1/notifications/total**
	+ Response: `total`

### Get notification history

* **GET /api/v1/notifications/getHistory**
	+ Response: `notifications`

## Task Management APIs

### Create a task

* **POST /api/v1/tasks/**
	+ Request Body: `title`, `description`, `dueDate`, `priority` (optional)
	+ Response: `task`

### Get all tasks

* **GET /api/v1/tasks/**
	+ Request Headers: `Authorization: Bearer <accessToken>`
	+ Response: `tasks`

### Get a specific task

* **GET /api/v1/tasks/:id**
	+ Request Headers: `Authorization: Bearer <accessToken>`
	+ Request Params: `id`
	+ Response: `task`

### Update a task

* **PATCH /api/v1/tasks/:id**
	+ Request Headers: `Authorization: Bearer <accessToken>`
	+ Request Params: `id`
	+ Request Body: `title`, `description`, `dueDate`, `priority` (optional)
	+ Response: `task`

### Delete a task

* **DELETE /api/v1/tasks/:id**
	+ Request Headers: `Authorization: Bearer <accessToken>`
	+ Request Params: `id`
	+ Response: `message`

## Admin APIs

### Get all users

* **GET /api/v1/admin/users**
	+ Request Headers: `Authorization: Bearer <adminAccessToken>`
	+ Response: `users`

### Get all tasks

* **GET /api/v1/admin/tasks**
	+ Request Headers: `Authorization: Bearer <adminAccessToken>`
	+ Response: `tasks`

### Get all notifications

* **GET /api/v1/admin/notifications**
	+ Request Headers: `Authorization: Bearer <adminAccessToken>`
	+ Response: `notifications`

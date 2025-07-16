# URL Shortener UI

This is the Next.js frontend for the URL Shortener project.

## Environment Variables

The UI expects the following environment variable:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

You can create a `.env` file in the root of the `url-shortener-ui` directory with this variable for local development.

## Docker Usage

You can run the UI using Docker:

1. Build the Docker image:
   ```bash
   docker build -t url-shortener-ui .
   ```

2. Run the container (make sure to set environment variables as needed):
   ```bash
   docker run --env-file .env -p 3000:3000 url-shortener-ui
   ```

This will start the UI on port 3000 by default. Adjust the `.env` file or environment variables as needed for your setup.

---

- The UI will connect to the API using the `NEXT_PUBLIC_API_URL` value.
- For production, set `NEXT_PUBLIC_API_URL` to your deployed API endpoint. 

## Docker Compose

To run both the API and UI together, use Docker Compose from the project root:

1. Make sure your `url-shortener-ui/.env` file contains:
   ```
   NEXT_PUBLIC_API_URL=http://api:3001
   ```
2. Then run:
   ```bash
   docker compose up --build
   ```

- The UI will be available at http://localhost:3000
- The API will be available at http://localhost:3001 

---

## Session Expiration Handling

- If a user's session (access token) expires, any authenticated API request will automatically log the user out and redirect them to the login screen (`/auth`).
- Currently, the login screen does **not** display a message about session expiration.
- In the future, you could enhance the login screen to show a friendly message (e.g., "Your session has expired. Please log in again.") when a user is redirected due to session expiration. This would improve the user experience and make the reason for the redirect clear. 
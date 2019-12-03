# UPTIME MONITOR API

## RESTful API for an Uptime Monitor application

### Uptime Monitor API doesn't use any npm package. It's builded only using some built-in NodeJs modules.

Uptmon app allows users to enter URLs the want monitored, and receive alerts when those resources "go down" or "come back up".

**Development is in progress.**

### Usage
<pre>Development is in progress</pre>

## Specs

1. The API listens on a PORT and accepts incomming HTTP request for POST, GET, PUT, DELETE, HEAD.

2. The API allows a client to connect, then create a new user, then edit and delete that user.

3. The API allows users to "sign in" which gives them a token that they can use for subsequent authenticated requests.

4. The API allows the user to "sign out" which invalidates their token.

5. The API allows a signed-in user to use their token to create a new "check".

6. The API allows a signed-in user to edit or delete any of their "checks" (Users only can create up to five "checks").

7. In the background, workers perform all the "checks" at the appropiate times, and send an alert to the users when a "check" changes its state from "up" to "down", or vice versa.

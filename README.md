# GQ1 Playwright Automation

## Setup

1. Open a terminal in the `GQ1` folder.
2. Install dependencies:
   ```
   npm install
   ```

## Run the Test

```
npm test
```

## What It Does

- Navigates to the GQ1 login page.
- Logs in with provided credentials.
- Verifies successful login.
- Logs out and verifies return to login page.

> Adjust selectors in `loginLogout.spec.js` if the login or logout buttons have different labels or attributes.

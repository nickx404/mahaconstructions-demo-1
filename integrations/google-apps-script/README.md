# Chatbot lead delivery setup

The chatbot form includes required name and phone and optional email. Live delivery needs a client-owned Google Sheet and Apps Script deployment. No email credentials belong in the React app.

1. Create a private Google Sheet in the client's Google account. Copy its ID from the URL between `/d/` and `/edit`.
2. Open **Extensions → Apps Script**, paste `Code.gs`, and save. Use the V8 runtime.
3. In **Project Settings → Script properties**, add:
   - `SPREADSHEET_ID`: the sheet ID.
   - `NOTIFICATION_EMAIL`: the client's confirmed recipient; the website currently lists `saimaha1000@gmail.com`.
   - `ALLOWED_ORIGINS`: comma-separated exact website origins, without paths or trailing slashes. For example `https://nickx404.github.io,http://localhost:5173`. Add a custom domain if used.
4. Deploy as a **Web app**, execute as **Me**, access **Anyone**. Authorize Sheets and Mail access as the owning client. Copy the deployed `/exec` URL. Keep the Sheet private; only the receiving web app is public. Updates to the script require updating its deployment version.
5. For local development, create `.env.local` with `VITE_CHATBOT_LEAD_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec` and restart Vite. For GitHub Pages, set repository **Actions variable** `VITE_CHATBOT_LEAD_URL` and rebuild/deploy. This URL is public configuration, not a secret.
6. Before enabling for real visitors, submit a clearly marked sample enquiry with an owned phone number. Confirm a Sheet row, notification email, and the chatbot's resumed answer. Check retries reuse the row, page reload reuses the saved contact in the same tab, and a blocked/failed request retains the form without claiming success. Check desktop and mobile. Delete sample data afterwards.

## Delivery behavior

- A hidden form posts to Google. The receiver returns a nonce-bound `postMessage` receipt from a Google origin only after writing the row. A blind `no-cors` request is not treated as success.
- Each tab session has one random lead ID. Retries update that row rather than duplicating it. Visitor email is optional and is stored in column K; existing sheets get that header without shifting columns. Only creation sends a notification. Later enquiry location/project details update the same row; email contains the first question and a Sheet link.
- Email failure or exhausted Google quotas do not lose a saved Sheet lead; the Email status column records the failure. Check that column regularly. No automatic email retry is included.
- The public receiver validates inputs, serializes writes, and escapes spreadsheet formulas. Origin checking is not bot authentication. For higher traffic or spam, add a server-verified CAPTCHA and rate limiting before public launch. Google service quotas still apply.
- Contact and Joint Venture page forms remain unconnected; this receiver is for chatbot leads only.
- Without a deployment URL, Continue keeps details only in the current browser tab session and resumes the pending answer. The mini form has no storage or connection-status message, and no saved/sent confirmation is displayed. These local drafts are not delivered automatically later. After configuring a receiver, the visitor must submit the mini form to deliver a lead.

Google references: [web apps](https://developers.google.com/apps-script/guides/web), [HTML iframe restrictions](https://developers.google.com/apps-script/guides/html/restrictions), [quotas](https://developers.google.com/apps-script/guides/services/quotas).

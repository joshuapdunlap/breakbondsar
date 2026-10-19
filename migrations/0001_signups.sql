-- Sign-ups from the "Get involved" form on /take-action/. One row per email address:
-- signing up again with the same address updates the earlier row (see worker/index.ts).
-- No IP addresses are stored. Times are UTC, ISO 8601 (2026-10-19T19:51:14Z).
CREATE TABLE signups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 100),
  email TEXT NOT NULL UNIQUE CHECK (length(email) BETWEEN 3 AND 254),
  phone TEXT CHECK (phone IS NULL OR length(phone) <= 16),
  zip TEXT CHECK (zip IS NULL OR length(zip) <= 10),
  -- Comma-separated choices from "How do you want to help?", in form order.
  interests TEXT CHECK (interests IS NULL OR length(interests) <= 100),
  note TEXT CHECK (note IS NULL OR length(note) <= 500),
  -- Path of the page the form was sent from, without query or fragment.
  source TEXT CHECK (source IS NULL OR length(source) <= 200),
  -- Keyed SHA-256 of the browser's User-Agent header, to spot repeat or scripted sign-ups.
  user_agent_hash TEXT CHECK (user_agent_hash IS NULL OR length(user_agent_hash) = 32)
);

CREATE INDEX signups_created_at ON signups (created_at);

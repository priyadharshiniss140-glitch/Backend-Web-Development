'use strict';
// auth/passport.js — Google OAuth strategy

const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { users, nextId } = require('../data');

async function verifyCallback(accessToken, refreshToken, profile, done) {
  try {
    // 1. Returning OAuth user: the stable Google ID takes precedence over email.
    const returningUser = users.find((user) => user.googleId === profile.id);
    if (returningUser) {
      return done(null, returningUser);
    }

    // The profile email is supplied by Google's verified OAuth profile.
    const email = profile.emails[0].value;

    // 2. Link an existing local account only when Google verifies the email.
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      if (profile._json?.email_verified !== true) {
        return done(null, false);
      }

      existingUser.googleId = profile.id;
      return done(null, existingUser);
    }

    // 3. No Google ID or email match: create a new least-privilege account.
    const newUser = {
      id: nextId(),
      googleId: profile.id,
      email,
      name: profile.displayName,
      role: 'member',
    };

    users.push(newUser);
    return done(null, newUser);
  } catch (error) {
    return done(error);
  }
}

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID     || 'test-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'test-client-secret',
      callbackURL:  '/auth/google/callback',
    },
    verifyCallback,
  ),
);

// Export verifyCallback so tests can call it without a browser.
module.exports = { passport, verifyCallback };

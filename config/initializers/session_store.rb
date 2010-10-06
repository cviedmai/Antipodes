# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_Antipodes_session',
  :secret      => 'da8a06b411afb27a1e7fbcb27715b24bf4ab52cef227d5ac823284af05ef3a6aaad37a1c4caa9877f6858a5b6c779d6e1618032141ea64341963b6ab8fd4082f'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store

# workast-articles
This is an API to work with Users and Articles easily 

# Installation
You only need to have mongo already installed in your workstation
Then, Just clone the repository and run **npm install**, let to workast-articles do the rest!.

# Execution
The API has two execution modes for now (not production mode)
* npm run start (runs authorization mode, need the secret token in each request)
* npm run dev (runs without authorization, if you need a standard development mode)

# Important!
This API is only for development.
If you need to run in production, you will need to define by your own:
 * production.json 
 * log4js_config_production.json 
 * npm script for production mode

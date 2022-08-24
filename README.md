### Install Order:

0. Setup .env files
   - There are .env.example files for each sub directory (Frontend and Backend)
   - You there are dummy values in those .env files, you need to replace them with working ones.
1. Init
   - First do an install of the wrapper module which orchestrates everything else

```bash
    npm install
```

- From now on you can stay in this root directory to run all commands. The following command:
  - Install the modules:
  - Generates the JS database connectors
  -

```bash
    npm run init
```

2. Build

```bash
    npm run build
```

3. Seed

- Seeds the database with one super admin
- Make sure there is a vendor id in .env for the first super admin (something associated with planes)
- Make sure there is an email address for super admin in .env

```bash
npm run seed
```

4. Serve

- Serves both applications and has the terminal log output for both

```bash
    npm run serve
```

### TODO:

- [ ] Cron Job that Restarts
- [ ] Restart on server crash
- [ ] Throng workers if traffic seems to be a concern

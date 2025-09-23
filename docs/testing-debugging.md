# Test Debugging in Cursor

## Local Debugging
1. Set breakpoints in a test file.
2. Use "Debug Jest Tests" or "Debug Current Jest Test" from `.vscode/launch.json`.
3. Watch mode is disabled for reliable debugging.

## Docker Debugging
1. `docker-compose up -d` to start services.
2. Use "Debug Jest Tests (Docker)" launch config.
3. Node inspector listens on port 9229.

## Snapshot Testing
- Write snapshot tests alongside components.
- Update snapshots after intentional UI changes.

Commands:

```bash
npm run test:snapshots        # run snapshot-named tests
npm run test:update-snapshots # update snapshots
```

## Troubleshooting
- Ensure port 9229 is free for the debugger.
- Verify service name `app` in `docker-compose.yml` matches debug config.
- Use `--runInBand` for deterministic debugging.

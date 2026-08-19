import { FullConfig } from '@playwright/test';
import { logger } from '../utils/logger';
import { ensureDir } from '../utils/file-utils';
import fs from 'fs';
import path from 'path';

const AUTH_DIR = path.resolve(__dirname, '..', '.auth');
const STORAGE_STATE_PATH = path.join(AUTH_DIR, 'storageState.json');

async function globalSetup(config: FullConfig): Promise<void> {
  logger.info('Global setup started for HMS Testing Framework');
  ensureDir(AUTH_DIR);
  ensureDir(path.resolve(__dirname, '..', 'reports', 'logs'));

  // Ensure storage state file exists so tests don't fail on missing auth file
  if (!fs.existsSync(STORAGE_STATE_PATH)) {
    fs.writeFileSync(STORAGE_STATE_PATH, JSON.stringify({ cookies: [], origins: [] }));
  }

  logger.info('Global setup completed for HMS');
}

export default globalSetup;

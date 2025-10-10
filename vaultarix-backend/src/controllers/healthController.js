/**
 * src/controllers/healthController.js
 *
 * Construye respuesta de health con info forense no crítica:
 * - service_version: desde package.json
 * - uptime: seconds
 * - timestamp: server time (ISO)
 * - memory usage (rss) truncated
 * - load average (first value) if available (non-sensitive)
 * - instance_id_hash: identificador no reversible para correlación entre logs (SHA256 truncado)
 *
 * Evita nombres de host, IPs, variables sensibles o claves.
 */

import os from 'os';
import fs from 'fs';
import path from 'path';
import { getInstanceIdHash } from '../services/cryptoService.js';

const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json')));

export const getHealth = (req, res) => {
  try {
    const uptime = process.uptime();
    const mem = process.memoryUsage();
    const rssMB = Math.round((mem.rss / 1024 / 1024) * 100) / 100;
    let load = null;
    if (os.loadavg) {
      const loads = os.loadavg();
      if (loads && loads.length > 0) load = Math.round(loads[0] * 100) / 100;
    }

    const response = {
      service: 'vaultarix-backend',
      version: pkg.version || '0.0.0',
      timestamp: new Date().toISOString(),
      uptime_seconds: Math.round(uptime),
      memory_rss_mb: rssMB,
      load_avg_1m: load,
      instance_id_hash: getInstanceIdHash(), // hash no reversible para correlación forense
      note: 'Información no sensible. No contiene datos de usuarios ni claves.'
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: 'unable to produce health info' });
  }
};

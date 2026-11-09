import { z } from 'zod';

// Zod 4 teste `Function("")` pour compiler ses schémas (JIT) : la CSP l'interdit et signale une violation
// dans la console. On désactive le JIT ; les schémas fonctionnent à l'identique, un peu moins vite.
z.config({ jitless: true });

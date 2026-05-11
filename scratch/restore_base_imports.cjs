const fs = require('fs');
const path = 'c:/Users/Usuario/Documents/Timespage/src/pages/Admin.tsx';
let content = fs.readFileSync(path, 'utf8');

const baseImports = `import { useState, useEffect, FormEvent } from 'react';
import { supabase } from '../lib/supabase';`;

if (!content.includes('useState')) {
    content = baseImports + '\n' + content;
}

fs.writeFileSync(path, content, 'utf8');
console.log('Base imports restored');

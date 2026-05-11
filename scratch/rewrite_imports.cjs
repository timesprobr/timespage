const fs = require('fs');
const path = 'c:/Users/Usuario/Documents/Timespage/src/pages/Admin.tsx';
let content = fs.readFileSync(path, 'utf8');

const lucideImports = [
  'LayoutDashboard', 'Trophy', 'FileText', 'Trash2', 'Edit3', 'X',
  'PlusCircle', 'Download', 'FileImage', 'Sun', 'Moon', 'Upload',
  'Eye', 'Users', 'ShieldCheck', 'LogOut', 'Plus', 'Palette', 'Globe',
  'Image as ImageIcon', 'ChevronLeft', 'ChevronRight', 'TrendingUp',
  'Activity', 'ArrowUpRight', 'Zap', 'RefreshCw', 'Target',
  'MessageSquare', 'MessageCircle', 'UserPlus', 'User', 'MousePointer2'
];

const newImportBlock = `import { \n  ${lucideImports.join(', \n  ')}\n} from 'lucide-react';`;

content = content.replace(/import \{[\s\S]*?\} from 'lucide-react';/, newImportBlock);

// Fix 400 error
content = content.replace(/registrationsQuery\.order\(['"]createdAt['"]/, "registrationsQuery.order('created_at'");
content = content.replace(/socioLeadsQuery\.order\(['"]createdAt['"]/, "socioLeadsQuery.order('created_at'");

fs.writeFileSync(path, content, 'utf8');
console.log('Imports rewritten');

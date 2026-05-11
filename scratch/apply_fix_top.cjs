const fs = require('fs');
const path = 'c:/Users/Usuario/Documents/Timespage/src/pages/Admin.tsx';
const topPath = 'c:/Users/Usuario/Documents/Timespage/scratch/fix_top.cjs';
let content = fs.readFileSync(path, 'utf8');
const top = fs.readFileSync(topPath, 'utf8');

// Find where export default function Admin() starts and replace everything before it
const marker = 'export default function Admin() {';
const index = content.indexOf(marker);

if (index !== -1) {
    const rest = content.substring(index + marker.length);
    fs.writeFileSync(path, top + rest, 'utf8');
    console.log('File top replaced');
} else {
    console.log('Marker not found');
}

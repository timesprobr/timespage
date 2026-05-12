const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'Admin.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Check if Home menu item already exists
if (content.includes("id: 'home', label: 'Home'")) {
  console.log('Home menu item already exists');
} else {
  // Find the news menu item line and insert Home before it
  const newsMenuLine = "{ id: 'news', label: 'Not";
  const idx = content.indexOf(newsMenuLine);
  if (idx === -1) {
    console.error('Could not find news menu item');
    // Try alternative
    const altIdx = content.indexOf("id: 'news'");
    if (altIdx === -1) {
      console.error('Could not find news menu at all');
      process.exit(1);
    }
    // Go back to start of line
    let lineStart = altIdx;
    while (lineStart > 0 && content[lineStart - 1] !== '\n') lineStart--;
    const indent = content.substring(lineStart, altIdx).match(/^\s*/)?.[0] || '                         ';
    const homeMenuItem = indent + "{ id: 'home', label: 'Home', icon: Home },\n";
    content = content.substring(0, lineStart) + homeMenuItem + content.substring(lineStart);
  } else {
    // Go back to start of line
    let lineStart = idx;
    while (lineStart > 0 && content[lineStart - 1] !== '\n') lineStart--;
    const indent = content.substring(lineStart, idx).match(/^\s*/)?.[0] || '                         ';
    const homeMenuItem = indent + "{ id: 'home', label: 'Home', icon: Home },\n";
    content = content.substring(0, lineStart) + homeMenuItem + content.substring(lineStart);
  }
  console.log('Home menu item added!');
}

// Check if Home is in activeTab type  
if (!content.includes("'home' |")) {
  content = content.replace(
    "'dashboard' | 'news'",
    "'dashboard' | 'home' | 'news'"
  );
  console.log('Home added to activeTab type');
} else {
  console.log('Home already in activeTab type');
}

// Check if Home icon is imported
if (!content.includes('   Home,')) {
  content = content.replace(
    '   ExternalLink,',
    '   ExternalLink,\n   Home,'
  );
  console.log('Home icon imported');
} else {
  console.log('Home icon already imported');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done! File saved.');

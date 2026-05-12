const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'Admin.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Remover o item de menu "conversion" da lista do map em Analytics
const targetLines = [
  "{ id: 'conversion', label: 'Conversão', icon: Target },",
  "{ id: 'conversion', label: 'Convers\u00e3o', icon: Target },",
  "{ id: 'conversion', label: 'ConversÃ£o', icon: Target },"
];

let removed = false;
for (const line of targetLines) {
  if (content.includes(line)) {
    content = content.replace(line, '');
    removed = true;
    break;
  }
}

// Se não achou na busca exata, usa regex
if (!removed) {
  content = content.replace(/\s*\{\s*id:\s*'conversion'[^}]+\},?\r?\n?/, '');
  console.log('Removido via regex.');
} else {
  console.log('Removido via busca de string exata.');
}

// Remover o botão "Ver Mapa de Cliques"
const btnCode = '<button onClick={() => setActiveTab(\'conversion\')} className="text-[8px] font-black uppercase text-saas-primary hover:underline">Ver Mapa de Cliques</button>';
if (content.includes(btnCode)) {
  content = content.replace(btnCode, '');
  console.log('Botão Ver Mapa de Cliques removido.');
} else {
  // tenta regex
  content = content.replace(/<button[^>]+setActiveTab\('conversion'\)[^>]*>[^<]*<\/button>/, '');
  console.log('Botão de conversão checado/removido via regex.');
}

// Salvar
fs.writeFileSync(filePath, content, 'utf8');
console.log('Admin.tsx atualizado com sucesso!');

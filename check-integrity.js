
const fs = require('fs');
const path = require('path');
const commands = JSON.parse(fs.readFileSync(path.join(__dirname,'..','policies','commands-policy.json'),'utf-8'));
const roles = JSON.parse(fs.readFileSync(path.join(__dirname,'..','policies','roles-policy.json'),'utf-8'));
if(!Array.isArray(commands.allowedCommands) || !commands.allowedCommands.length){ console.error('سياسة الأوامر غير صالحة'); process.exit(1); }
if(!Array.isArray(roles.roles) || !roles.roles.length){ console.error('سياسة الأدوار غير صالحة'); process.exit(1); }
console.log('فحص السلامة ناجح');

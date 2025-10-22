# Script de Instalação Alternativa

## Se npm não funcionar, tente:

### Opção 1: Yarn
```bash
# Instalar yarn globalmente
npm install -g yarn

# Instalar dependências
yarn install

# Executar projeto
yarn dev
```

### Opção 2: pnpm
```bash
# Instalar pnpm globalmente
npm install -g pnpm

# Instalar dependências
pnpm install

# Executar projeto
pnpm dev
```

### Opção 3: Verificar PATH do Node.js
Se Node.js estiver instalado mas não for reconhecido:

1. Adicione ao PATH do Windows:
   - `C:\Program Files\nodejs\`
   - `C:\Users\[USER]\AppData\Roaming\npm\`

2. Reinicie o terminal

### Opção 4: Usar Node Version Manager (nvm-windows)
```bash
# Instalar nvm-windows
# Download: https://github.com/coreybutler/nvm-windows

# Instalar Node.js LTS
nvm install lts
nvm use lts
```




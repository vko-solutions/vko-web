# VKO Solution - Paleta de Cores

## 🎨 **JOGO DE CORES DA APLICAÇÃO**

### **📊 CORES PRINCIPAIS:**

#### **1. Azul Aço** `#2B4C7E`
- **Uso**: Cor primária, botões principais, títulos, links
- **Contexto**: Branding principal, ações importantes
- **Tailwind**: `bg-[#2B4C7E]`, `text-[#2B4C7E]`
- **Aplicação**: Landing, Login, Register, Dashboard, AdminPermissions

#### **2. Azul Escuro** `#1e3556`
- **Uso**: Hover de botões primários, estados escuros
- **Contexto**: Interações e feedback
- **Tailwind**: `hover:bg-[#1e3556]`
- **Aplicação**: Todos os botões com hover

#### **3. Branco Puro** `#FFFFFF`
- **Uso**: Fundo principal, cards, textos sobre fundo escuro
- **Contexto**: Base da aplicação
- **Tailwind**: `bg-white`, `bg-[#FFFFFF]`
- **Aplicação**: Todo o layout

#### **4. Cinza Claro** `#F7F9FB`
- **Uso**: Fundo secundário, áreas de destaque
- **Contexto**: Background alternativo
- **Tailwind**: `bg-[#F7F9FB]`
- **Aplicação**: Backgrounds de seções

---

### **🎯 CORES SECUNDÁRIAS:**

#### **5. Verde Sálvia** `#7AC29A`
- **Uso**: Elementos decorativos, destaques, tags
- **Contexto**: Mensagens positivas, elementos visuais
- **Tailwind**: `bg-[#7AC29A]`, `text-[#7AC29A]`
- **Aplicação**: Landing (pontos decorativos, tags)

#### **6. Azul Serenity** `#A7C7E7`
- **Uso**: Elementos decorativos, círculos flutuantes
- **Contexto**: Elementos visuais de fundo
- **Tailwind**: `bg-[#A7C7E7]`
- **Aplicação**: Landing (decorativos)

#### **7. Cinza Urbano** `#6C737F`
- **Uso**: Textos secundários, placeholders
- **Contexto**: Informações menos importantes
- **Tailwind**: `text-[#6C737F]`, `text-gray-600`
- **Aplicação**: Textos secundários

#### **8. Cinza Névoa** `#E8ECEF`
- **Uso**: Bordas, divisores, elementos sutis
- **Contexto**: Separação visual discreta
- **Tailwind**: `border-[#E8ECEF]`, `border-gray-200`
- **Aplicação**: Bordas e divisores

---

### **⚠️ CORES DE ESTADO:**

#### **9. Coral Suave** `#F87171`
- **Uso**: Mensagens de erro, alertas
- **Contexto**: Feedback negativo
- **Tailwind**: `text-[#F87171]`, `text-red-600`
- **Aplicação**: Mensagens de erro

#### **10. Verde Suave** `#7AC29A`
- **Uso**: Mensagens de sucesso
- **Contexto**: Feedback positivo
- **Tailwind**: `bg-green-50`, `text-green-600`
- **Aplicação**: Mensagens de sucesso

---

## 🎨 **HIERARQUIA DE CORES:**

### **Primária (60%):**
- **Azul Aço** `#2B4C7E`: Elementos principais
- **Branco** `#FFFFFF`: Fundo principal

### **Secundária (30%):**
- **Verde Sálvia** `#7AC29A`: Destaques
- **Cinza Claro** `#F7F9FB`: Backgrounds

### **Terciária (10%):**
- **Azul Serenity** `#A7C7E7`: Decorativos
- **Cinza Urbano** `#6C737F`: Textos secundários
- **Cinza Névoa** `#E8ECEF`: Bordas

---

## 📱 **APLICAÇÃO POR COMPONENTE:**

### **Landing Page:**
- Fundo: `#FFFFFF`
- Primária: `#2B4C7E` (títulos, botão Login)
- Secundária: `#7AC29A` (botão Cadastro, tags)
- Decorativos: `#A7C7E7` (círculos flutuantes)

### **Login/Register:**
- Fundo: `bg-gray-50`
- Botões: `bg-[#2B4C7E]` / `hover:bg-[#1e3556]`
- Textos: `text-gray-700`, `text-gray-600`
- Bordas: `border-gray-300`

### **Dashboard:**
- Fundo: `bg-[#F7F9FB]`
- Botões: `bg-[#2B4C7E]` / `hover:bg-[#1e3556]`
- Cards: `bg-white`
- Títulos: `text-[#2B4C7E]`

### **Admin Panel:**
- Fundo: `bg-gray-50`
- Botões: `bg-[#2B4C7E]`
- Tabelas: `bg-white`
- Links: `hover:text-[#2B4C7E]`

---

## 🎯 **RESUMO RÁPIDO:**

### **Cores Principais:**
- **Azul Aço**: `#2B4C7E` (Primária)
- **Azul Escuro**: `#1e3556` (Hover)
- **Branco**: `#FFFFFF` (Fundo)
- **Cinza Claro**: `#F7F9FB` (Secundário)

### **Cores Secundárias:**
- **Verde Sálvia**: `#7AC29A` (Destaques)
- **Azul Serenity**: `#A7C7E7` (Decorativos)
- **Cinza Urbano**: `#6C737F` (Textos)
- **Cinza Névoa**: `#E8ECEF` (Bordas)

### **Cores de Estado:**
- **Coral Suave**: `#F87171` (Erro)
- **Verde Suave**: `#7AC29A` (Sucesso)

---

## ✅ **CONCLUSÃO:**

A aplicação usa uma paleta profissional e consistente com:
- **Azul Aço** como cor primária (branding)
- **Verde Sálvia** como cor secundária (destaques)
- **Tons neutros** para textos e backgrounds
- **Estados claros** para feedback (erro/sucesso)

**Todas as cores estão configuradas no `tailwind.config.js` e podem ser usadas diretamente nas classes Tailwind!** 🎨

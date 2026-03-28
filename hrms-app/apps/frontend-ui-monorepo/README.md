# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


//////////////////////////////////////////////////////////////////////////

## **Today's Work Summary (March 28, 2026)**

***

### **Morning: Deployment Crisis → Fixed**
```
🔧 Netlify build failing → DevTools missing dep
🔧 Removed @tanstack/react-query-devtools import
🔧 Fixed queryClient.js → commented DevTools
🔧 Fixed vite.config.js → HMR overlay disabled
🔧 Fixed monorepo → always install from ROOT
🔧 Fixed react-router chunks → corrupted deps
✅ Production deployed → Netlify GREEN
```

### **Phase 1: Employee DB Schema Extension**
```
✅ 1.1 ALTER employees → 5 new columns:
        employee_type, work_location, 
        monthly_ctc, blood_group, 
        emergency_contact

✅ 1.2 CREATE employee_compliance:
        epfo_uan, pran, esic_ip, 
        pan, e_shram_uan

✅ 1.3 CREATE employee_banking:
        primary_bank (JSONB)
        secondary_bank (JSONB)

✅ 1.4 CREATE employee_documents:
        gov_id_proof, employment_docs,
        offer_letter, photo_url, 
        signature_url

✅ 1.5 RLS policies → all 3 new tables
✅ 1.6 JOIN test → 1 row, all columns ✅
```

***

## **README Update:**

```markdown
## 📅 March 28, 2026

### 🚀 Deployment Fix
- Removed `@tanstack/react-query-devtools` from build
- Fixed Vite HMR infinite loop
- Fixed monorepo root install issue
- Fixed react-router corrupted chunks
- ✅ Netlify production deploy GREEN

### 🗄️ Employee Schema Extension (Phase 1)
Extended `employees` table + 3 new tables:

**ALTER employees:**
- `employee_type` (Permanent/Contract/Intern/Probation/Freelancer)
- `work_location`
- `monthly_ctc`
- `blood_group`
- `emergency_contact`

**NEW: `employee_compliance`**
- EPFO UAN, PRAN, ESIC IP, PAN, e-Shram UAN
- FK → employees.id (CASCADE DELETE)

**NEW: `employee_banking`**
- Primary + Secondary bank (JSONB)
- FK → employees.id (CASCADE DELETE)

**NEW: `employee_documents`**
- Gov ID, Employment docs, Photo, Signature URLs
- FK → employees.id (CASCADE DELETE)

**Security:**
- RLS enabled on all 3 tables
- anon + authenticated policies

### 🔮 Next
- [ ] Phase 2: Supabase Storage Buckets
- [ ] Phase 3: API Layer
- [ ] Phase 4: Form Integration
- [ ] Phase 5: Polish + Deploy
```

***

## **Commit Message:**
```
feat: employee schema extension + deployment fix

- fix: remove DevTools import (Netlify build)
- fix: vite HMR infinite loop + monorepo root install
- feat: ALTER employees (+5 columns)
- feat: CREATE employee_compliance table
- feat: CREATE employee_banking table (JSONB)
- feat: CREATE employee_documents table
- feat: RLS policies on all new tables
- test: JOIN verified across all 4 tables
```


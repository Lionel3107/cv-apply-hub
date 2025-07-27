# Déploiement de l'Edge Function

## 🚀 Option 1 : Via Dashboard Supabase (Recommandé)

### 1. Accéder au Dashboard
1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **Edge Functions**

### 2. Créer/Modifier l'Edge Function
1. Cliquez sur **"Create a new function"**
2. Nommez-la `analyze-cv`
3. Copiez le contenu du fichier `supabase/functions/analyze-cv/index.ts`
4. Cliquez sur **"Deploy"**

### 3. Configurer les Variables d'Environnement
1. Dans l'Edge Function, allez dans **Settings**
2. Ajoutez les variables :
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`

## 🛠️ Option 2 : Via CLI Supabase

### 1. Installer Supabase CLI
```bash
npm install -g supabase
```

### 2. Se connecter
```bash
supabase login
```

### 3. Lier le projet
```bash
supabase link --project-ref your-project-id
```

### 4. Déployer l'Edge Function
```bash
supabase functions deploy analyze-cv
```

### 5. Configurer les secrets
```bash
supabase secrets set SUPABASE_URL=https://your-project-id.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
supabase secrets set OPENAI_API_KEY=your-openai-api-key
```

## ✅ Vérification

Après déploiement, testez avec le bouton "Config" dans l'interface :
- ✅ Edge Function : Doit être "OK"
- ✅ Permissions : Doit être "OK"

## 🔧 Dépannage

### Si l'Edge Function n'est pas disponible :
1. Vérifiez qu'elle est bien déployée
2. Vérifiez les variables d'environnement
3. Vérifiez les logs dans le dashboard

### Si les permissions échouent :
1. Utilisez la Service Role Key (pas l'Anon Key)
2. Vérifiez les RLS policies dans la base de données 
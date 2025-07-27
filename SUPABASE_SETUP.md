# Configuration Supabase pour l'Analyse CV

## 🔧 Variables d'Environnement Requises

### 1. Accéder au Dashboard Supabase

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **API**

### 2. Variables à Configurer

#### Dans le Dashboard Supabase (Settings → API) :

**URL du projet :**
```
SUPABASE_URL=https://your-project-id.supabase.co
```

**Service Role Key (ANON KEY) :**
```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**OpenAI API Key :**
```
OPENAI_API_KEY=your-openai-api-key-here
```

### 3. Configuration via Dashboard

1. **Allez dans Settings → API**
2. **Copiez l'URL du projet** (Project URL)
3. **Copiez la Service Role Key** (⚠️ **IMPORTANT** : Utilisez Service Role, pas Anon Key)
4. **Allez dans Settings → Edge Functions**
5. **Ajoutez les variables d'environnement :**

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
OPENAI_API_KEY=your-openai-api-key-here
```

### 4. Vérification

Après configuration, testez avec le bouton "Config" dans l'interface :
- ✅ Connexion Supabase : OK
- ✅ Edge Function : OK
- ✅ Permissions Base de Données : OK
- ✅ Variables d'Environnement : OK

## 🚨 Problèmes Courants

### Problème : "Edge Function non disponible"
**Solution :** Vérifiez que l'Edge Function est déployée

### Problème : "Pas de permissions d'écriture"
**Solution :** Utilisez la **Service Role Key**, pas l'Anon Key

### Problème : "Missing OpenAI API key"
**Solution :** Configurez votre clé OpenAI dans les variables d'environnement

## 📋 Checklist

- [ ] SUPABASE_URL configuré
- [ ] SUPABASE_SERVICE_ROLE_KEY configuré (pas Anon Key)
- [ ] OPENAI_API_KEY configuré
- [ ] Edge Function déployée
- [ ] Test de configuration réussi

## 🔍 Test de Configuration

Utilisez le bouton "Config" dans l'interface pour vérifier que tout fonctionne correctement. 
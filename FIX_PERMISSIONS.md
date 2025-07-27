# Correction des Permissions Base de Données

## 🔍 Diagnostic

Le problème est que l'Edge Function n'a pas les permissions d'écriture sur la table `applications`. Cela peut être dû aux RLS (Row Level Security) policies.

## 🎯 **Plan d'Action pour Corriger les Permissions**

### **Étape 1 : Vérifier les RLS Policies**

1. **Allez dans le Dashboard Supabase** : [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **Sélectionnez votre projet**
3. **Allez dans Table Editor**
4. **Cliquez sur la table `applications`**
5. **Allez dans l'onglet RLS**

### **Étape 2 : Désactiver RLS (Solution Rapide)**

1. **Dans l'onglet RLS**
2. **Désactivez RLS** pour la table `applications`
3. **Cliquez sur Save**

### **Étape 3 : Vérifier la Structure de la Table**

Assurez-vous que la table `applications` a ces colonnes :
- ✅ `id` (primary key)
- ✅ `score` (integer)
- ✅ `feedback` (text)
- ✅ `updated_at` (timestamp)

### **Étape 4 : Tester la Configuration**

1. **Retournez dans l'interface**
2. **Cliquez sur "Config"**
3. **Vérifiez que "Permissions Base de Données" est maintenant OK**

### **Étape 5 : Test Complet**

1. **Cliquez sur "Tester"**
2. **Lancez un test d'analyse**
3. **Vérifiez que les données sont mises à jour**

## 🔧 Solution 2 : Vérifier les Permissions de l'Edge Function

### 1. Vérifier la Configuration de l'Edge Function
1. Allez dans **Edge Functions**
2. Sélectionnez `analyze-cv`
3. Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est bien configurée

### 2. Tester avec un Script Direct
Créez un test simple dans l'Edge Function :

```typescript
// Test de permissions
const { data: testUpdate, error: testError } = await supabase
  .from('applications')
  .update({ updated_at: new Date().toISOString() })
  .eq('id', 'test-id')
  .select();

console.log('Test permissions:', { testUpdate, testError });
```

## 🔧 Solution 3 : Vérifier la Structure de la Table

### 1. Vérifier les Colonnes
Assurez-vous que la table `applications` a ces colonnes :
- `id` (primary key)
- `score` (integer)
- `feedback` (text)
- `updated_at` (timestamp)

### 2. Vérifier les Types de Données
```sql
-- Vérifier la structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'applications';
```

## 🧪 Test de la Solution

### 1. Après avoir appliqué une solution :
1. Retournez dans l'interface
2. Cliquez sur **"Config"**
3. Vérifiez que **"Permissions Base de Données"** est maintenant **OK**

### 2. Test complet :
1. Cliquez sur **"Tester"**
2. Lancez un test d'analyse
3. Vérifiez que les données sont mises à jour dans la base

## 🚨 Problèmes Courants

### Problème : "RLS policy violation"
**Solution :** Désactivez RLS ou créez une policy appropriée

### Problème : "Column does not exist"
**Solution :** Vérifiez que les colonnes `score`, `feedback`, `updated_at` existent

### Problème : "Permission denied"
**Solution :** Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est bien configurée

## 📋 Checklist de Vérification

- [ ] RLS désactivé ou policy créée
- [ ] Colonnes `score`, `feedback`, `updated_at` existent
- [ ] Test "Config" montre "Permissions OK"
- [ ] Test d'analyse fonctionne
- [ ] Données mises à jour dans la base

## 🔍 Debug Avancé

Si le problème persiste, ajoutez ces logs dans l'Edge Function :

```typescript
// Test de connexion
console.log('Supabase URL:', supabaseUrl);
console.log('Service Key configured:', !!supabaseServiceKey);

// Test de permissions
const { data: testData, error: testError } = await supabase
  .from('applications')
  .select('id')
  .limit(1);

console.log('Test read:', { testData, testError });
``` 

## 🔍 **Informations de Débogage Améliorées**

Le nouveau test de permissions va maintenant afficher :
- **Lecture** : OK/ÉCHEC
- **Écriture** : OK/ÉCHEC  
- **Structure** : OK/ÉCHEC

Cela vous donnera des informations plus précises sur le problème exact.

## 🚨 **Si RLS est Activé et Vous Voulez le Garder**

Si vous ne voulez pas désactiver RLS, créez cette policy SQL dans le SQL Editor de Supabase :

```sql
-- Policy pour permettre aux Edge Functions d'écrire
CREATE POLICY "Enable update for edge functions" ON applications
FOR UPDATE USING (true)
WITH CHECK (true);

-- Policy pour permettre aux Edge Functions de lire
CREATE POLICY "Enable select for edge functions" ON applications
FOR SELECT USING (true);
```

## 🔍 **Logs à Observer**

Dans la console, vous devriez maintenant voir :
```
🔍 Environment Check - Read test: {...}
🔍 Environment Check - Write test: {...}
🔍 Environment Check - Structure test: {...}
```

Ces logs vous diront exactement quel type de permission échoue.

Suivez ces étapes et dites-moi ce que vous obtenez ! 🚀 

## 🎯 **Plan d'Action pour Corriger l'Affichage des Données**

### **Étape 1 : Déployer l'Edge Function Corrigée**

L'Edge Function a été modifiée pour mettre à jour les champs `skills`, `experience`, et `education`. Vous devez la redéployer :

1. **Allez dans le Dashboard Supabase** : [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. **Allez dans Edge Functions**
3. **Sélectionnez `analyze-cv`**
4. **Remplacez le code** par le contenu du fichier `supabase/functions/analyze-cv/index.ts`
5. **Cliquez sur "Deploy"**

### **Étape 2 : Tester avec les Outils de Diagnostic**

1. **Cliquez sur "Config"** pour vérifier l'environnement
2. **Cliquez sur "Tester"** pour tester l'Edge Function
3. **Cliquez sur "Vérifier"** pour vérifier les données dans la base
4. **Cliquez sur "Déboguer"** pour voir les données brutes

### **Étape 3 : Analyser un CV et Vérifier**

1. **Lancez une analyse** d'un CV
2. **Cliquez sur "Vérifier"** pour voir si toutes les données sont mises à jour
3. **Vérifiez les logs** dans la console pour voir le processus

### **Étape 4 : Vérifier l'Interface**

1. **Rafraîchissez l'interface** après l'analyse
2. **Vérifiez que les skills, expériences et éducation s'affichent**

## 🔍 **Points à Vérifier**

### **Dans le Composant "Vérifier"**
Vous devriez voir :
- ✅ **Score** : Présent
- ✅ **Feedback** : Présent
- ✅ **Skills** : Présent
- ✅ **Experience** : Présent
- ✅ **Education** : Présent
- ✅ **Updated At** : Présent

### **Dans les Logs de la Console**
Vous devriez voir :
```
🔍 Data Verification - Raw data from database: {...}
🔍 Data Verification - Analysis: {...}
```

### **Dans l'Interface**
Après l'analyse et le rafraîchissement :
- ✅ **Scores IA** affichés
- ✅ **Skills** affichés dans les badges
- ✅ **Expériences** affichées dans la colonne
- ✅ **Forces et améliorations** affichées

## 🚨 **Si le Problème Persiste**

### **Problème 1 : Edge Function non redéployée**
**Solution :** Redéployez l'Edge Function avec le nouveau code

### **Problème 2 : Données non mises à jour dans la base**
**Solution :** Vérifiez les logs de l'Edge Function dans le dashboard Supabase

### **Problème 3 : Interface ne se rafraîchit pas**
**Solution :** Vérifiez que `refreshData()` est appelé après l'analyse

## 🚨 **Checklist de Vérification**

- [ ] Edge Function redéployée avec le nouveau code
- [ ] Test "Config" tous verts
- [ ] Test "Tester" fonctionne
- [ ] Test "Vérifier" montre toutes les données présentes
- [ ] Analyse d'un CV effectuée
- [ ] Interface rafraîchie après l'analyse
- [ ] Skills, expériences et éducation affichés

## 🔍 **Logs à Observer**

Dans la console, vous devriez voir :
```
🧪 Test Analysis - Starting...
🧪 Test Analysis - Success result: {...}
🔍 Data Verification - Raw data from database: {...}
🔍 Data Verification - Analysis: {...}
```

Suivez ces étapes et dites-moi ce que vous obtenez ! 🚀 
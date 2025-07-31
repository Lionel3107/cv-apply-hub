# Configuration des Variables d'Environnement

## Problème résolu
L'erreur `process is not defined` a été corrigée en utilisant `import.meta.env` au lieu de `process.env`.

## Variables d'environnement nécessaires

### 1. Créez un fichier `.env` à la racine du projet :

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://kifyevnjincgqhszqyis.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon-ici

# OpenAI Configuration (pour les Edge Functions)
OPENAI_API_KEY=votre-clé-openai-ici
```

### 2. Variables d'environnement dans Supabase Dashboard

Allez dans votre dashboard Supabase > Edge Functions > analyze-cv > Settings et configurez :

- `SUPABASE_URL`: https://kifyevnjincgqhszqyis.supabase.co
- `SUPABASE_SERVICE_ROLE_KEY`: votre-clé-service-role
- `OPENAI_API_KEY`: votre-clé-openai

### 3. Redémarrez l'application

Après avoir créé le fichier `.env`, redémarrez votre serveur de développement :

```bash
npm run dev
```

## Vérification

1. L'erreur `process is not defined` devrait disparaître
2. Le bouton "Config" devrait fonctionner correctement
3. Les vérifications d'environnement devraient passer 
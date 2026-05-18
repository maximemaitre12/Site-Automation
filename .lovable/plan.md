## Problème

Quand tu es déjà connecté, cliquer sur **Login** dans le header passe quand même par `/auth` (qui affiche brièvement un écran blanc puis redirige). Tu veux que le clic envoie **directement** sur `/dashboard`, sans passage par `/auth`.

La cause : le header utilise `useAuth().user`, mais ce `user` est `null` pendant les premières millisecondes après le chargement de la page (le temps que Supabase relise la session depuis `localStorage`). Si tu cliques pendant cette fenêtre, `loginHref` pointe encore vers `/auth`.

## Solution

Faire en sorte que le header sache **synchronement, dès le premier rendu**, qu'une session existe dans le navigateur — sans attendre Supabase.

### Comment

Supabase stocke la session dans `localStorage` sous une clé du type `sb-<project-ref>-auth-token`. Cette clé est lisible synchronement.

1. Dans `src/components/landing/LandingHeader.tsx` :
   - Initialiser un état `hasStoredSession` avec une fonction qui lit `localStorage` au tout premier rendu (clé `sb-gydrpmetswrkrjcbkgqd-auth-token`, vérifier qu'elle contient un `access_token` non expiré).
   - Calculer `loginHref` = `/dashboard` dès que `hasStoredSession || user` est vrai, sinon `/auth?mode=login&redirect=/farmasoft`.
   - Garder `useAuth().user` comme source de vérité une fois chargée (pour gérer la déconnexion proprement et mettre à jour le label).
   - Le label devient `Open app` dès qu'on détecte la session stockée.

2. Aucun autre fichier à modifier. `Auth.tsx` garde son garde-fou actuel (écran blanc + redirect) au cas où l'utilisateur tape `/auth` manuellement.

### Détails techniques

- La lecture de `localStorage` se fait dans `useState(() => …)` pour qu'elle soit synchrone et n'arrive qu'une seule fois.
- On parse le JSON dans un `try/catch` et on vérifie `expires_at > now()` pour ne pas considérer une session expirée comme valide.
- Aucun changement de comportement pour les visiteurs non connectés : le bouton continue de pointer vers `/auth`.

### Résultat attendu

- Visiteur jamais connecté → bouton **Log in** → `/auth` (comportement actuel).
- Utilisateur déjà connecté (cookie/localStorage présent) → bouton **Open app** → `/dashboard` **instantanément**, dès le premier rendu, sans flash de `/auth`.
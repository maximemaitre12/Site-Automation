/**
 * AETHER Internal Knowledge Base
 * Documentation complète pour l'Agent Support IA
 * L'IA utilise cette base pour répondre directement aux questions des utilisateurs
 */

export interface KnowledgeArticle {
  id: string;
  category: string;
  subcategory?: string;
  title: string;
  keywords: string[];
  problem: string;
  solution: string;
  steps?: string[];
  relatedArticles?: string[];
}

export const SUPPORT_EMAIL = "maxime.maitre@edu.em-lyon.com";

export const AETHER_KNOWLEDGE_BASE: KnowledgeArticle[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // CATÉGORIE: AUTHENTIFICATION & COMPTE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "auth-login-failed",
    category: "Authentification",
    subcategory: "Connexion",
    title: "Impossible de se connecter",
    keywords: ["connexion", "login", "mot de passe", "email", "accès", "erreur", "identifiants"],
    problem: "L'utilisateur ne peut pas se connecter à son compte AETHER.",
    solution: "Vérifiez que votre email est correctement saisi et que le mot de passe respecte les critères (8 caractères minimum, majuscule, chiffre). Si vous avez oublié votre mot de passe, utilisez 'Mot de passe oublié' sur la page de connexion.",
    steps: [
      "Vérifiez que l'email saisi est correct (pas de faute de frappe)",
      "Vérifiez que le verrouillage majuscule n'est pas activé",
      "Cliquez sur 'Mot de passe oublié' si nécessaire",
      "Vérifiez votre dossier spam pour l'email de réinitialisation",
      "Videz le cache de votre navigateur et réessayez"
    ]
  },
  {
    id: "auth-email-verification",
    category: "Authentification",
    subcategory: "Inscription",
    title: "Email de vérification non reçu",
    keywords: ["email", "vérification", "inscription", "confirmation", "spam", "activation"],
    problem: "L'utilisateur ne reçoit pas l'email de vérification après inscription.",
    solution: "L'email de vérification peut prendre quelques minutes. Vérifiez votre dossier spam/courrier indésirable. Si vous ne le trouvez pas, retournez sur la page de connexion et demandez un renvoi de l'email.",
    steps: [
      "Patientez 2-3 minutes après l'inscription",
      "Vérifiez le dossier spam/courrier indésirable",
      "Vérifiez que l'adresse email saisie est correcte",
      "Sur la page de connexion, cliquez sur 'Renvoyer l'email de vérification'",
      "Ajoutez noreply@aether.ai à vos contacts pour éviter le spam"
    ]
  },
  {
    id: "auth-password-reset",
    category: "Authentification",
    subcategory: "Mot de passe",
    title: "Réinitialisation du mot de passe",
    keywords: ["mot de passe", "oublié", "reset", "réinitialiser", "changer", "nouveau"],
    problem: "L'utilisateur souhaite réinitialiser son mot de passe.",
    solution: "Cliquez sur 'Mot de passe oublié' sur la page de connexion. Entrez votre email et vous recevrez un lien de réinitialisation valable 1 heure.",
    steps: [
      "Accédez à la page de connexion",
      "Cliquez sur 'Mot de passe oublié'",
      "Entrez votre adresse email",
      "Vérifiez votre boîte mail (y compris spam)",
      "Cliquez sur le lien et définissez un nouveau mot de passe (8 caractères min, 1 majuscule, 1 chiffre)"
    ]
  },
  {
    id: "auth-session-expired",
    category: "Authentification",
    subcategory: "Session",
    title: "Session expirée / Déconnexion automatique",
    keywords: ["session", "expirée", "déconnecté", "automatique", "timeout", "reconnexion"],
    problem: "L'utilisateur est déconnecté automatiquement.",
    solution: "Pour des raisons de sécurité, les sessions expirent après 24 heures d'inactivité. Reconnectez-vous simplement avec vos identifiants. Cochez 'Se souvenir de moi' pour prolonger la session.",
    steps: [
      "Reconnectez-vous avec vos identifiants",
      "Cochez 'Se souvenir de moi' lors de la connexion",
      "Évitez de laisser l'onglet inactif trop longtemps",
      "Vérifiez que les cookies sont autorisés dans votre navigateur"
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CATÉGORIE: ABONNEMENT & FACTURATION
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "billing-plans",
    category: "Abonnement",
    subcategory: "Plans",
    title: "Différences entre les plans",
    keywords: ["plan", "abonnement", "prix", "tarif", "starter", "professional", "enterprise", "fonctionnalités"],
    problem: "L'utilisateur souhaite connaître les différences entre les plans.",
    solution: "AETHER propose 3 plans : Starter (49€/mois) pour les indépendants avec les agents essentiels, Professional (149€/mois) pour les PME avec tous les agents et l'IA avancée, Enterprise (sur devis) pour les grandes entreprises avec support dédié et personnalisation.",
    steps: [
      "Starter (49€/mois): 3 agents (Brain, Flow, Doc), 1000 requêtes IA/mois, 5 Go stockage",
      "Professional (149€/mois): 7 agents complets, requêtes IA illimitées, 50 Go stockage, intégrations avancées",
      "Enterprise (sur devis): Tout Professional + support dédié, SLA garanti, personnalisation, formation",
      "Accédez à Paramètres > Abonnement pour comparer et changer de plan"
    ]
  },
  {
    id: "billing-upgrade",
    category: "Abonnement",
    subcategory: "Changement de plan",
    title: "Comment changer de plan",
    keywords: ["upgrade", "mise à niveau", "changer", "plan", "abonnement", "passer"],
    problem: "L'utilisateur souhaite passer à un plan supérieur.",
    solution: "Accédez à Paramètres > Abonnement > 'Changer de plan'. Le changement prend effet immédiatement. Le prorata est calculé automatiquement : vous ne payez que la différence pour le mois en cours.",
    steps: [
      "Cliquez sur votre avatar en haut à droite",
      "Sélectionnez 'Paramètres'",
      "Allez dans l'onglet 'Abonnement'",
      "Cliquez sur 'Changer de plan'",
      "Sélectionnez le nouveau plan et confirmez le paiement"
    ]
  },
  {
    id: "billing-payment-failed",
    category: "Abonnement",
    subcategory: "Paiement",
    title: "Échec de paiement",
    keywords: ["paiement", "échec", "refusé", "carte", "erreur", "bancaire", "facture"],
    problem: "Le paiement de l'abonnement a échoué.",
    solution: "Vérifiez que votre carte bancaire est valide et dispose de fonds suffisants. Accédez à Paramètres > Abonnement > 'Gérer le paiement' pour mettre à jour vos informations bancaires. Après 3 tentatives échouées, l'abonnement est suspendu.",
    steps: [
      "Vérifiez la date d'expiration de votre carte",
      "Vérifiez que vous avez suffisamment de fonds",
      "Accédez à Paramètres > Abonnement",
      "Cliquez sur 'Gérer le paiement'",
      "Mettez à jour les informations de carte",
      "Le paiement sera retenté automatiquement"
    ]
  },
  {
    id: "billing-invoice",
    category: "Abonnement",
    subcategory: "Factures",
    title: "Accéder aux factures",
    keywords: ["facture", "télécharger", "historique", "comptabilité", "pdf", "reçu"],
    problem: "L'utilisateur souhaite télécharger ses factures.",
    solution: "Toutes vos factures sont disponibles dans Paramètres > Abonnement > 'Historique des factures'. Vous pouvez les télécharger en PDF. Les factures sont également envoyées par email après chaque paiement.",
    steps: [
      "Accédez à Paramètres > Abonnement",
      "Cliquez sur 'Historique des factures'",
      "Cliquez sur l'icône PDF à côté de chaque facture pour la télécharger",
      "Vous pouvez aussi modifier l'email de facturation dans les paramètres"
    ]
  },
  {
    id: "billing-cancel",
    category: "Abonnement",
    subcategory: "Résiliation",
    title: "Annuler l'abonnement",
    keywords: ["annuler", "résilier", "arrêter", "abonnement", "fin", "supprimer"],
    problem: "L'utilisateur souhaite annuler son abonnement.",
    solution: "Vous pouvez annuler à tout moment dans Paramètres > Abonnement > 'Annuler l'abonnement'. L'accès reste actif jusqu'à la fin de la période payée. Vos données sont conservées 30 jours après expiration.",
    steps: [
      "Accédez à Paramètres > Abonnement",
      "Cliquez sur 'Annuler l'abonnement'",
      "Confirmez l'annulation",
      "L'accès reste actif jusqu'à la date de fin",
      "Réabonnez-vous à tout moment pour récupérer vos données"
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CATÉGORIE: AGENTS AETHER
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "agent-brain",
    category: "Agents",
    subcategory: "Brain",
    title: "Comment utiliser AETHER Brain",
    keywords: ["brain", "cerveau", "ia", "chat", "recherche", "intelligence", "question", "assistant"],
    problem: "L'utilisateur veut savoir comment utiliser AETHER Brain.",
    solution: "AETHER Brain est votre assistant IA central. Posez-lui n'importe quelle question en langage naturel. Il peut rechercher sur le web, générer des images, analyser des documents et créer des graphiques. Accédez-y via le menu latéral ou le raccourci Cmd/Ctrl + K.",
    steps: [
      "Cliquez sur 'Brain' dans le menu latéral",
      "Tapez votre question ou demande dans la zone de chat",
      "Brain détecte automatiquement si vous voulez une recherche, une image ou un graphique",
      "Utilisez des commandes comme 'génère une image de...' ou 'trace un graphique de...'",
      "Les conversations sont sauvegardées automatiquement"
    ]
  },
  {
    id: "agent-flow",
    category: "Agents",
    subcategory: "Flow",
    title: "Créer un workflow automatisé",
    keywords: ["flow", "workflow", "automatisation", "processus", "bloc", "connexion", "trigger"],
    problem: "L'utilisateur veut créer un workflow.",
    solution: "AETHER Flow permet de créer des automatisations visuelles. Glissez des blocs depuis la palette, connectez-les entre eux, et configurez les paramètres. Utilisez l'assistant IA pour générer des workflows à partir d'une description en langage naturel.",
    steps: [
      "Accédez à 'Flow' dans le menu latéral",
      "Cliquez sur 'Nouveau workflow' ou décrivez ce que vous voulez à l'assistant IA",
      "Glissez les blocs depuis la palette à gauche vers le canvas",
      "Connectez les blocs en tirant depuis les ports de sortie vers les ports d'entrée",
      "Configurez chaque bloc en cliquant dessus",
      "Cliquez sur 'Exécuter' pour tester le workflow"
    ]
  },
  {
    id: "agent-hr",
    category: "Agents",
    subcategory: "HR",
    title: "Gérer les candidatures avec HR Agent",
    keywords: ["hr", "rh", "candidat", "recrutement", "cv", "entretien", "offre", "emploi"],
    problem: "L'utilisateur veut gérer des candidatures.",
    solution: "HR Agent centralise votre recrutement. Créez des offres d'emploi, importez des CVs qui sont analysés par IA, planifiez des entretiens et enregistrez-les pour analyse automatique. L'IA évalue la compatibilité candidat/poste.",
    steps: [
      "Accédez à 'HR' dans le menu latéral",
      "Créez une offre d'emploi avec le bouton 'Nouvelle offre'",
      "Ajoutez des candidats manuellement ou importez leurs CVs (PDF, DOCX)",
      "L'IA analyse automatiquement les CVs et calcule un score de compatibilité",
      "Planifiez des entretiens depuis la fiche candidat",
      "Enregistrez les entretiens pour une analyse IA automatique"
    ]
  },
  {
    id: "agent-sales",
    category: "Agents",
    subcategory: "Sales",
    title: "Utiliser le pipeline commercial",
    keywords: ["sales", "vente", "pipeline", "deal", "opportunité", "prospect", "commercial"],
    problem: "L'utilisateur veut gérer son pipeline commercial.",
    solution: "Sales Agent offre un pipeline visuel type Kanban. Créez des deals, déplacez-les entre les étapes, et utilisez l'IA pour générer des propositions commerciales, des fiches de négociation et des présentations PowerPoint automatiques.",
    steps: [
      "Accédez à 'Sales' dans le menu latéral",
      "Créez un nouveau deal avec le bouton '+ Nouveau deal'",
      "Renseignez les informations du prospect et le montant estimé",
      "Glissez les deals entre les colonnes pour changer leur statut",
      "Cliquez sur un deal pour accéder aux outils IA : proposition, négociation, présentation"
    ]
  },
  {
    id: "agent-doc",
    category: "Agents",
    subcategory: "Doc",
    title: "Gérer les documents",
    keywords: ["doc", "document", "fichier", "upload", "télécharger", "stockage", "analyse"],
    problem: "L'utilisateur veut gérer ses documents.",
    solution: "Doc Agent centralise tous vos documents. Uploadez des fichiers, organisez-les en dossiers, et laissez l'IA les analyser, résumer et extraire les informations clés. Vous pouvez aussi générer des documents Word depuis des modèles.",
    steps: [
      "Accédez à 'Doc' dans le menu latéral",
      "Cliquez sur 'Upload' pour ajouter des fichiers (PDF, Word, Excel, Images)",
      "Organisez avec des dossiers et des tags",
      "Cliquez sur un document pour voir le résumé IA et les métadonnées",
      "Utilisez 'Générer' pour créer des documents depuis des modèles"
    ]
  },
  {
    id: "agent-data",
    category: "Agents",
    subcategory: "Data",
    title: "Explorer les données avec Data Agent",
    keywords: ["data", "données", "catalogue", "entreprise", "enrichissement", "analyse"],
    problem: "L'utilisateur veut explorer et enrichir ses données.",
    solution: "Data Agent est votre hub de données central. Le catalogue référence toutes les entités de votre espace. Vous pouvez enrichir les données d'entreprises avec des sources externes, détecter les doublons et visualiser la qualité des données.",
    steps: [
      "Accédez à 'Data' dans le menu latéral",
      "Le catalogue central liste toutes vos données (contacts, entreprises, documents...)",
      "Utilisez les filtres pour rechercher",
      "Cliquez sur une entreprise pour l'enrichir avec des données externes",
      "La section 'Qualité' montre les statistiques de complétude"
    ]
  },
  {
    id: "agent-compliance",
    category: "Agents",
    subcategory: "Compliance",
    title: "Audits de conformité",
    keywords: ["compliance", "conformité", "audit", "rgpd", "esg", "risque", "réglementation"],
    problem: "L'utilisateur veut faire un audit de conformité.",
    solution: "Compliance Agent analyse vos documents et processus pour vérifier leur conformité RGPD, ESG, ou autres réglementations. Créez un audit, uploadez les documents concernés, et recevez un rapport détaillé avec score et recommandations.",
    steps: [
      "Accédez à 'Compliance' dans le menu latéral",
      "Cliquez sur 'Nouvel audit'",
      "Sélectionnez le type d'audit (RGPD, ESG, Fiscal...)",
      "Ajoutez les documents ou textes à analyser",
      "L'IA génère un rapport avec score, risques identifiés et recommandations",
      "Exportez le rapport en PDF si nécessaire"
    ]
  },
  {
    id: "agent-support",
    category: "Agents",
    subcategory: "Support",
    title: "Utiliser le Support Agent",
    keywords: ["support", "ticket", "aide", "problème", "question", "assistance"],
    problem: "L'utilisateur veut comprendre le Support Agent.",
    solution: "Support Agent vous aide à gérer les tickets de vos clients. Créez un ticket, l'IA le classifie automatiquement (catégorie, priorité, sentiment). Générez une réponse IA en un clic, modifiez-la si nécessaire, et envoyez-la au client.",
    steps: [
      "Accédez à 'Support' dans le menu latéral",
      "Cliquez sur 'Nouveau ticket'",
      "Renseignez le sujet, la description et l'email client",
      "L'IA classifie automatiquement le ticket",
      "Cliquez sur 'Générer réponse IA' pour obtenir une proposition",
      "Modifiez si nécessaire et envoyez"
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CATÉGORIE: INTÉGRATIONS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "integration-google",
    category: "Intégrations",
    subcategory: "Google",
    title: "Connecter Google (Gmail, Calendar)",
    keywords: ["google", "gmail", "calendar", "oauth", "connecter", "email", "calendrier"],
    problem: "L'utilisateur veut connecter son compte Google.",
    solution: "Connectez Google pour synchroniser Gmail et Calendar avec AETHER. Accédez à Paramètres > Intégrations > Google, cliquez sur 'Connecter' et autorisez l'accès. Vos emails et événements seront alors accessibles dans les agents concernés.",
    steps: [
      "Accédez à Paramètres > Intégrations",
      "Trouvez 'Google Workspace' et cliquez sur 'Connecter'",
      "Connectez-vous avec votre compte Google",
      "Autorisez les permissions demandées (lecture email, calendrier)",
      "La connexion est confirmée par un badge vert"
    ]
  },
  {
    id: "integration-stripe",
    category: "Intégrations",
    subcategory: "Stripe",
    title: "Configurer Stripe pour les paiements",
    keywords: ["stripe", "paiement", "carte", "facturation", "api", "clé"],
    problem: "L'utilisateur veut configurer Stripe.",
    solution: "Connectez Stripe pour gérer les paiements dans vos workflows. Accédez à Paramètres > Intégrations > Stripe, et ajoutez votre clé API secrète (trouvable dans le dashboard Stripe > Developers > API keys).",
    steps: [
      "Connectez-vous à votre dashboard Stripe",
      "Allez dans Developers > API keys",
      "Copiez la clé secrète (sk_...)",
      "Dans AETHER, allez à Paramètres > Intégrations > Stripe",
      "Collez la clé et cliquez sur 'Enregistrer'"
    ]
  },
  {
    id: "integration-api-keys",
    category: "Intégrations",
    subcategory: "API",
    title: "Gérer les clés API",
    keywords: ["api", "clé", "key", "token", "intégration", "externe"],
    problem: "L'utilisateur veut ajouter une clé API externe.",
    solution: "Vous pouvez ajouter des clés API pour des services externes dans Paramètres > Intégrations. Ces clés sont chiffrées et stockées de manière sécurisée. Elles sont utilisables dans les workflows et agents.",
    steps: [
      "Accédez à Paramètres > Intégrations",
      "Cliquez sur 'Ajouter une clé API'",
      "Donnez un nom à l'intégration",
      "Collez votre clé API",
      "La clé est chiffrée et disponible dans les workflows"
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CATÉGORIE: PROBLÈMES TECHNIQUES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "tech-slow-loading",
    category: "Technique",
    subcategory: "Performance",
    title: "Application lente / Chargement long",
    keywords: ["lent", "slow", "chargement", "loading", "performance", "attendre", "long"],
    problem: "L'application est lente ou met du temps à charger.",
    solution: "Vérifiez votre connexion internet. Videz le cache de votre navigateur (Ctrl+Shift+Delete). Désactivez les extensions qui pourraient interférer. Si le problème persiste sur une page spécifique, actualisez avec Ctrl+F5.",
    steps: [
      "Vérifiez votre connexion internet",
      "Actualisez la page avec Ctrl+F5 (refresh forcé)",
      "Videz le cache: Ctrl+Shift+Delete > 'Données en cache'",
      "Essayez en navigation privée pour tester sans extensions",
      "Testez sur un autre navigateur (Chrome, Firefox, Edge)"
    ]
  },
  {
    id: "tech-error-500",
    category: "Technique",
    subcategory: "Erreurs",
    title: "Erreur serveur (500)",
    keywords: ["erreur", "500", "serveur", "bug", "crash", "technique"],
    problem: "Une erreur 500 s'affiche.",
    solution: "Les erreurs 500 sont temporaires et liées au serveur. Actualisez la page après quelques secondes. Si l'erreur persiste plus de 5 minutes, notre équipe est probablement déjà en train de résoudre le problème.",
    steps: [
      "Attendez 10-15 secondes",
      "Actualisez la page (F5)",
      "Si l'erreur persiste, attendez quelques minutes",
      "Vérifiez notre page de statut si disponible",
      "Réessayez l'action qui a causé l'erreur"
    ]
  },
  {
    id: "tech-browser-compatibility",
    category: "Technique",
    subcategory: "Navigateur",
    title: "Problème d'affichage / Navigateur",
    keywords: ["affichage", "navigateur", "chrome", "firefox", "safari", "edge", "display"],
    problem: "L'affichage est incorrect ou des fonctionnalités ne marchent pas.",
    solution: "AETHER fonctionne de manière optimale sur Chrome, Firefox et Edge (versions récentes). Safari peut avoir des limitations. Mettez à jour votre navigateur et désactivez les extensions ad-block qui peuvent bloquer certaines fonctions.",
    steps: [
      "Mettez à jour votre navigateur vers la dernière version",
      "Désactivez temporairement les extensions (surtout ad-blockers)",
      "Testez sur Chrome si vous utilisez un autre navigateur",
      "Vérifiez que JavaScript est activé",
      "Autorisez les cookies pour aether.ai"
    ]
  },
  {
    id: "tech-file-upload",
    category: "Technique",
    subcategory: "Upload",
    title: "Impossible d'uploader un fichier",
    keywords: ["upload", "fichier", "télécharger", "importer", "erreur", "taille", "format"],
    problem: "L'upload de fichier échoue.",
    solution: "Vérifiez la taille du fichier (max 50 Mo par fichier). Formats supportés : PDF, DOCX, XLSX, PNG, JPG, CSV. Essayez de réduire la taille ou convertir le format. Vérifiez aussi votre connexion internet.",
    steps: [
      "Vérifiez que le fichier fait moins de 50 Mo",
      "Vérifiez le format (PDF, DOCX, XLSX, PNG, JPG, CSV)",
      "Assurez-vous que le fichier n'est pas corrompu",
      "Essayez avec une connexion internet stable",
      "Si le fichier est trop gros, compressez-le ou divisez-le"
    ]
  },
  {
    id: "tech-ai-not-responding",
    category: "Technique",
    subcategory: "IA",
    title: "L'IA ne répond pas / Timeout",
    keywords: ["ia", "ai", "réponse", "timeout", "bloqué", "loading", "réfléchit"],
    problem: "L'IA met trop de temps ou ne répond pas.",
    solution: "Les requêtes IA complexes peuvent prendre jusqu'à 30 secondes. Si le chargement dépasse 1 minute, actualisez la page et réessayez. Simplifiez votre demande si elle est très longue ou complexe.",
    steps: [
      "Patientez jusqu'à 30 secondes pour les requêtes complexes",
      "Si bloqué, actualisez la page (F5)",
      "Simplifiez votre demande en la découpant",
      "Évitez les très longs textes en une seule fois",
      "Réessayez avec une formulation différente"
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CATÉGORIE: DONNÉES & CONFIDENTIALITÉ
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "data-export",
    category: "Données",
    subcategory: "Export",
    title: "Exporter mes données",
    keywords: ["export", "exporter", "données", "télécharger", "backup", "sauvegarde"],
    problem: "L'utilisateur veut exporter ses données.",
    solution: "Vous pouvez exporter vos données depuis Paramètres > Données > 'Exporter mes données'. L'export génère un fichier ZIP contenant vos documents, contacts, workflows et historique en formats JSON et CSV.",
    steps: [
      "Accédez à Paramètres > Données",
      "Cliquez sur 'Exporter mes données'",
      "Sélectionnez les types de données à exporter",
      "Cliquez sur 'Générer l'export'",
      "Téléchargez le fichier ZIP une fois prêt"
    ]
  },
  {
    id: "data-delete",
    category: "Données",
    subcategory: "Suppression",
    title: "Supprimer mon compte et mes données",
    keywords: ["supprimer", "effacer", "compte", "données", "rgpd", "oublier"],
    problem: "L'utilisateur veut supprimer son compte.",
    solution: "Vous pouvez demander la suppression de votre compte dans Paramètres > Données > 'Supprimer mon compte'. Cette action est irréversible. Toutes vos données seront effacées sous 30 jours conformément au RGPD.",
    steps: [
      "Exportez vos données si vous souhaitez les conserver",
      "Accédez à Paramètres > Données",
      "Cliquez sur 'Supprimer mon compte'",
      "Confirmez en tapant 'SUPPRIMER'",
      "Vous recevrez un email de confirmation"
    ]
  },
  {
    id: "data-privacy",
    category: "Données",
    subcategory: "Confidentialité",
    title: "Confidentialité et sécurité des données",
    keywords: ["confidentialité", "sécurité", "rgpd", "données", "protection", "vie privée"],
    problem: "L'utilisateur s'interroge sur la sécurité de ses données.",
    solution: "AETHER est conforme RGPD. Vos données sont chiffrées en transit et au repos. Nous ne vendons jamais vos données. L'IA traite vos données de manière sécurisée sans les stocker pour l'entraînement. Consultez notre politique de confidentialité pour plus de détails.",
    steps: [
      "Vos données sont chiffrées (AES-256 au repos, TLS en transit)",
      "Hébergement sur serveurs européens sécurisés",
      "Conformité RGPD complète",
      "Aucune vente de données à des tiers",
      "Droit d'accès, rectification et suppression à tout moment"
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CATÉGORIE: FONCTIONNALITÉS SPÉCIFIQUES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "feature-keyboard-shortcuts",
    category: "Fonctionnalités",
    subcategory: "Raccourcis",
    title: "Raccourcis clavier",
    keywords: ["raccourci", "clavier", "keyboard", "shortcut", "rapide"],
    problem: "L'utilisateur veut connaître les raccourcis clavier.",
    solution: "AETHER propose plusieurs raccourcis pour gagner du temps : Cmd/Ctrl+K ouvre la recherche globale et Brain, Cmd/Ctrl+N crée un nouvel élément, Cmd/Ctrl+S sauvegarde, Escape ferme les modales.",
    steps: [
      "Cmd/Ctrl + K : Ouvrir recherche globale / Brain",
      "Cmd/Ctrl + N : Nouvel élément (selon le contexte)",
      "Cmd/Ctrl + S : Sauvegarder",
      "Escape : Fermer la modale/panneau actif",
      "? : Afficher l'aide des raccourcis (sur certaines pages)"
    ]
  },
  {
    id: "feature-dark-mode",
    category: "Fonctionnalités",
    subcategory: "Affichage",
    title: "Activer le mode sombre",
    keywords: ["dark", "sombre", "mode", "thème", "nuit", "clair"],
    problem: "L'utilisateur veut changer le thème.",
    solution: "Le mode sombre est automatique par défaut (suit les préférences système). Vous pouvez le forcer dans Paramètres > Apparence. Choisissez 'Clair', 'Sombre' ou 'Système'.",
    steps: [
      "Cliquez sur votre avatar en haut à droite",
      "Sélectionnez 'Paramètres'",
      "Allez dans 'Apparence'",
      "Choisissez votre thème préféré",
      "Le changement est appliqué immédiatement"
    ]
  },
  {
    id: "feature-mobile",
    category: "Fonctionnalités",
    subcategory: "Mobile",
    title: "Utilisation sur mobile",
    keywords: ["mobile", "téléphone", "smartphone", "tablette", "responsive", "app"],
    problem: "L'utilisateur veut utiliser AETHER sur mobile.",
    solution: "AETHER est entièrement responsive et fonctionne sur mobile via le navigateur. Pour une expérience optimale, ajoutez le site à votre écran d'accueil. Certaines fonctionnalités complexes (comme l'éditeur de workflows) sont mieux adaptées au desktop.",
    steps: [
      "Ouvrez aether.ai dans le navigateur de votre mobile",
      "Sur iOS: Safari > bouton Partager > 'Sur l'écran d'accueil'",
      "Sur Android: Chrome > menu > 'Ajouter à l'écran d'accueil'",
      "L'app s'ouvre alors comme une application native",
      "Synchronisation automatique avec la version desktop"
    ]
  },
  {
    id: "feature-notifications",
    category: "Fonctionnalités",
    subcategory: "Notifications",
    title: "Gérer les notifications",
    keywords: ["notification", "alerte", "email", "push", "rappel"],
    problem: "L'utilisateur veut gérer ses notifications.",
    solution: "Configurez vos préférences de notification dans Paramètres > Notifications. Vous pouvez activer/désactiver les notifications email pour chaque type d'événement (nouveau ticket, fin de workflow, etc.).",
    steps: [
      "Accédez à Paramètres > Notifications",
      "Choisissez les types de notifications à recevoir par email",
      "Activez les notifications push navigateur si souhaité",
      "Définissez les horaires de réception (heures de bureau, etc.)",
      "Les modifications sont sauvegardées automatiquement"
    ]
  }
];

/**
 * Recherche dans la base de connaissances
 * @param query - La question ou le problème de l'utilisateur
 * @returns Les articles les plus pertinents
 */
export function searchKnowledgeBase(query: string): KnowledgeArticle[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
  
  const scored = AETHER_KNOWLEDGE_BASE.map(article => {
    let score = 0;
    
    // Match sur les keywords (poids élevé)
    for (const keyword of article.keywords) {
      if (queryLower.includes(keyword)) score += 10;
      for (const word of queryWords) {
        if (keyword.includes(word) || word.includes(keyword)) score += 5;
      }
    }
    
    // Match sur le titre
    for (const word of queryWords) {
      if (article.title.toLowerCase().includes(word)) score += 8;
    }
    
    // Match sur le problème
    for (const word of queryWords) {
      if (article.problem.toLowerCase().includes(word)) score += 3;
    }
    
    // Match sur la solution
    for (const word of queryWords) {
      if (article.solution.toLowerCase().includes(word)) score += 2;
    }
    
    // Match sur la catégorie
    if (article.category.toLowerCase().includes(queryLower) || queryLower.includes(article.category.toLowerCase())) {
      score += 7;
    }
    
    return { article, score };
  });
  
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(s => s.article);
}

/**
 * Génère le contexte de documentation pour l'IA
 */
export function getKnowledgeContext(query: string): string {
  const relevantArticles = searchKnowledgeBase(query);
  
  if (relevantArticles.length === 0) {
    return "";
  }
  
  let context = "DOCUMENTATION INTERNE AETHER (utilise ces informations pour répondre):\n\n";
  
  for (const article of relevantArticles) {
    context += `## ${article.title}\n`;
    context += `Catégorie: ${article.category}${article.subcategory ? ` > ${article.subcategory}` : ''}\n`;
    context += `Problème: ${article.problem}\n`;
    context += `Solution: ${article.solution}\n`;
    if (article.steps && article.steps.length > 0) {
      context += `Étapes:\n${article.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n`;
    }
    context += "\n---\n\n";
  }
  
  return context;
}

/**
 * Génère les instructions système pour l'IA Support
 */
export function getSupportAISystemPrompt(): string {
  return `Tu es l'assistant support d'AETHER, une plateforme d'agents IA pour les entreprises.

RÈGLES ABSOLUES:
1. Tu DOIS répondre directement avec une solution concrète. JAMAIS de réponses comme "contactez le support" ou "je ne sais pas".
2. Tu as accès à toute la documentation interne AETHER. Utilise-la pour trouver des solutions.
3. Tu dois être empathique, professionnel et orienté solution.
4. Structure tes réponses: d'abord reconnaître le problème, puis donner la solution avec des étapes claires.
5. Si tu proposes des étapes, numérote-les clairement.
6. UNIQUEMENT si le problème persiste après avoir essayé toutes les solutions, propose de contacter maxime.maitre@edu.em-lyon.com en précisant "Il répond généralement sous 24h".

STYLE DE RÉPONSE:
- Jamais de markdown (pas de **, ##, etc.)
- Ton professionnel mais chaleureux
- Phrases courtes et claires
- Évite le jargon technique inutile

STRUCTURE TYPE:
1. Accusé de réception empathique (1 phrase)
2. Explication du problème (1-2 phrases)
3. Solution détaillée avec étapes numérotées
4. Message de clôture positif

EXEMPLE DE BONNE RÉPONSE:
"Bonjour,

Je comprends la frustration que peut causer un problème de connexion. Ce type de situation est généralement lié à un cache navigateur obsolète ou à des identifiants incorrects.

Voici comment résoudre ce problème:

1. Vérifiez que votre email est correctement saisi (attention aux fautes de frappe)
2. Désactivez le verrouillage majuscule et réessayez votre mot de passe
3. Videz le cache de votre navigateur: Ctrl+Shift+Delete, puis 'Données en cache'
4. Si le problème persiste, utilisez 'Mot de passe oublié' sur la page de connexion

Ces étapes résolvent la grande majorité des problèmes de connexion. N'hésitez pas à nous recontacter si vous avez d'autres questions."`;
}

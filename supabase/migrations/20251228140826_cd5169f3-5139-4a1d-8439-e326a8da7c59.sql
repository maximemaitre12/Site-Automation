-- Insert 20+ enterprise templates for AETHER Doc
INSERT INTO public.doc_templates (user_id, name, description, category, is_system, content_structure, variables)
VALUES 
  -- RH Templates (integration with AETHER HR)
  ('00000000-0000-0000-0000-000000000000', 'Contrat CDI', 'Contrat de travail à durée indéterminée complet et personnalisable', 'hr', true, '{"sections": ["identité", "fonction", "rémunération", "avantages", "clauses"]}', '["nom_employé", "poste", "salaire", "date_embauche"]'),
  ('00000000-0000-0000-0000-000000000000', 'Contrat CDD', 'Contrat de travail à durée déterminée avec motif de recours', 'hr', true, '{"sections": ["identité", "durée", "motif", "rémunération"]}', '["nom_employé", "poste", "durée", "motif"]'),
  ('00000000-0000-0000-0000-000000000000', 'Lettre d''offre d''emploi', 'Proposition d''embauche formelle avec conditions', 'hr', true, '{"sections": ["poste", "conditions", "avantages", "délai_réponse"]}', '["candidat", "poste", "salaire"]'),
  ('00000000-0000-0000-0000-000000000000', 'Attestation employeur', 'Attestation de travail ou certificat de travail', 'hr', true, '{"sections": ["identité_employé", "période", "fonctions"]}', '["nom_employé", "dates", "poste"]'),
  ('00000000-0000-0000-0000-000000000000', 'Compte-rendu d''entretien', 'Compte-rendu structuré d''entretien d''embauche ou annuel', 'hr', true, '{"sections": ["informations", "évaluation", "objectifs", "décision"]}', '["candidat", "poste", "date"]'),
  ('00000000-0000-0000-0000-000000000000', 'Fiche de poste', 'Description détaillée d''un poste avec missions et compétences', 'hr', true, '{"sections": ["intitulé", "missions", "compétences", "conditions"]}', '["titre_poste", "département"]'),
  ('00000000-0000-0000-0000-000000000000', 'Règlement intérieur', 'Règlement intérieur d''entreprise conforme au droit du travail', 'hr', true, '{"sections": ["objet", "discipline", "hygiène", "sanctions"]}', '["nom_entreprise"]'),
  
  -- Sales Templates (integration with AETHER Sales)
  ('00000000-0000-0000-0000-000000000000', 'Devis commercial', 'Devis professionnel avec détail des prestations et tarifs', 'sales', true, '{"sections": ["client", "prestations", "tarifs", "conditions"]}', '["client", "projet", "montant"]'),
  ('00000000-0000-0000-0000-000000000000', 'Bon de commande', 'Bon de commande formel avec références produits/services', 'sales', true, '{"sections": ["fournisseur", "articles", "livraison", "paiement"]}', '["fournisseur", "articles"]'),
  ('00000000-0000-0000-0000-000000000000', 'Facture', 'Facture conforme aux obligations légales françaises', 'sales', true, '{"sections": ["vendeur", "client", "détail", "paiement"]}', '["client", "montant", "prestations"]'),
  ('00000000-0000-0000-0000-000000000000', 'Relance impayé', 'Lettre de relance pour facture impayée (3 niveaux)', 'sales', true, '{"sections": ["rappel", "montant", "échéance", "conséquences"]}', '["client", "facture", "montant"]'),
  ('00000000-0000-0000-0000-000000000000', 'Accord de partenariat', 'Convention de partenariat commercial entre entreprises', 'sales', true, '{"sections": ["partenaires", "objet", "engagements", "durée"]}', '["partenaire", "objet"]'),
  ('00000000-0000-0000-0000-000000000000', 'NDA - Accord de confidentialité', 'Accord de non-divulgation bilatéral ou unilatéral', 'sales', true, '{"sections": ["parties", "informations_confidentielles", "obligations", "durée"]}', '["partie1", "partie2"]'),
  
  -- Compliance Templates (integration with AETHER Compliance)
  ('00000000-0000-0000-0000-000000000000', 'Politique RGPD', 'Politique de protection des données personnelles conforme RGPD', 'compliance', true, '{"sections": ["responsable", "données", "droits", "sécurité"]}', '["entreprise", "dpo"]'),
  ('00000000-0000-0000-0000-000000000000', 'Registre des traitements', 'Registre des activités de traitement des données (Art. 30 RGPD)', 'compliance', true, '{"sections": ["traitements", "finalités", "destinataires", "durées"]}', '["entreprise"]'),
  ('00000000-0000-0000-0000-000000000000', 'PIA - Étude d''impact', 'Analyse d''impact relative à la protection des données', 'compliance', true, '{"sections": ["contexte", "risques", "mesures", "avis_dpo"]}', '["traitement", "responsable"]'),
  ('00000000-0000-0000-0000-000000000000', 'Politique de sécurité IT', 'Politique de sécurité des systèmes d''information (PSSI)', 'compliance', true, '{"sections": ["périmètre", "règles", "incidents", "audit"]}', '["entreprise"]'),
  ('00000000-0000-0000-0000-000000000000', 'Charte informatique', 'Charte d''utilisation des ressources informatiques', 'compliance', true, '{"sections": ["objet", "droits", "obligations", "sanctions"]}', '["entreprise"]'),
  
  -- Reports & Analysis Templates
  ('00000000-0000-0000-0000-000000000000', 'Rapport mensuel d''activité', 'Rapport synthétique d''activité mensuelle', 'report', true, '{"sections": ["synthèse", "indicateurs", "réalisations", "perspectives"]}', '["période", "service"]'),
  ('00000000-0000-0000-0000-000000000000', 'Executive Summary', 'Résumé exécutif pour présentation direction', 'report', true, '{"sections": ["contexte", "enjeux", "recommandations", "planning"]}', '["sujet", "date"]'),
  ('00000000-0000-0000-0000-000000000000', 'Business Plan', 'Plan d''affaires complet avec projections financières', 'report', true, '{"sections": ["vision", "marché", "stratégie", "finances"]}', '["projet", "entreprise"]'),
  ('00000000-0000-0000-0000-000000000000', 'Note de synthèse', 'Note de synthèse structurée sur un sujet spécifique', 'report', true, '{"sections": ["objet", "analyse", "conclusions", "recommandations"]}', '["sujet"]'),
  ('00000000-0000-0000-0000-000000000000', 'Procès-verbal de réunion', 'PV de réunion avec décisions et actions', 'report', true, '{"sections": ["participants", "ordre_du_jour", "décisions", "actions"]}', '["reunion", "date"]'),
  
  -- Project Templates
  ('00000000-0000-0000-0000-000000000000', 'Cahier des charges', 'Cahier des charges fonctionnel et technique', 'project', true, '{"sections": ["contexte", "besoins", "spécifications", "planning"]}', '["projet", "client"]'),
  ('00000000-0000-0000-0000-000000000000', 'Proposition commerciale', 'Proposition de projet avec méthodologie et budget', 'proposal', true, '{"sections": ["contexte", "solution", "planning", "budget"]}', '["client", "projet"]')
ON CONFLICT DO NOTHING;
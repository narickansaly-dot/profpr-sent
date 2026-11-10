-- Statut « archivee » : ancienne version d'une question déjà tirée dans des tentatives (voir 20261124000003).
-- Seul dans sa migration : une valeur d'enum ajoutée ne peut pas servir dans la transaction qui la crée.
alter type public.statut_question_t add value if not exists 'archivee';

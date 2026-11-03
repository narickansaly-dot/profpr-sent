-- Évalue role_actuel() et auth.uid() une fois par requête au lieu d'une fois par ligne.
-- Le sens de chaque règle est inchangé : les tests pgTAP de l'étape 1 le vérifient.

alter policy "catalogue" on public.cours
  using (publie or (select public.role_actuel()) = 'admin_contenu');

alter policy "lecture" on public.chapitre
  using ((select public.role_actuel()) = 'admin_contenu' or (publie and public.peut_lire_cours(cours_id)));

alter policy "lecture" on public.notion
  using ((select public.role_actuel()) = 'admin_contenu'
         or public.peut_lire_cours((select cours_id from public.chapitre c where c.id = chapitre_id and c.publie)));

alter policy "lecture" on public.question
  using ((select public.role_actuel()) = 'admin_contenu'
         or (statut = 'valide'
             and public.peut_lire_cours((select cours_id from public.chapitre c where c.id = chapitre_id and c.publie))));

alter policy "lecture admin" on public.question_corrige
  using ((select public.role_actuel()) = 'admin_contenu');

alter policy "ecriture admin" on public.filiere
  using ((select public.role_actuel()) = 'admin_contenu') with check ((select public.role_actuel()) = 'admin_contenu');
alter policy "ecriture admin" on public.cours
  using ((select public.role_actuel()) = 'admin_contenu') with check ((select public.role_actuel()) = 'admin_contenu');
alter policy "ecriture admin" on public.chapitre
  using ((select public.role_actuel()) = 'admin_contenu') with check ((select public.role_actuel()) = 'admin_contenu');
alter policy "ecriture admin" on public.notion
  using ((select public.role_actuel()) = 'admin_contenu') with check ((select public.role_actuel()) = 'admin_contenu');
alter policy "ecriture admin" on public.question
  using ((select public.role_actuel()) = 'admin_contenu') with check ((select public.role_actuel()) = 'admin_contenu');
alter policy "ecriture admin" on public.question_corrige
  using ((select public.role_actuel()) = 'admin_contenu') with check ((select public.role_actuel()) = 'admin_contenu');

alter policy "son profil" on public.profil using (id = (select auth.uid()));
alter policy "modifier son profil" on public.profil
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

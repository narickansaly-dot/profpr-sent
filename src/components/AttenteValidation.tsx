export function AttenteValidation({ prenom }: { prenom: string | null }) {
  return (
    <section className="carte attente-validation" aria-labelledby="titre-attente">
      <h1 id="titre-attente">Merci{prenom ? ` ${prenom}` : ''} !</h1>
      <p>Ta demande de compte enseignant est en cours de vérification. Tu recevras l’accès à ton espace dès qu’elle sera validée.</p>
      <p className="vide">En attendant, tu peux te déconnecter et revenir plus tard.</p>
    </section>
  );
}

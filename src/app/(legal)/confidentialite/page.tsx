import type { Metadata } from 'next';
import Link from 'next/link';
import { ACompleter, NoteJuriste } from '../composants';

export const metadata: Metadata = { title: 'Politique de confidentialité' };

export default function PageConfidentialite() {
  return (
    <>
      <h1>Politique de confidentialité</h1>
      <NoteJuriste />
      <p>
        Cette page explique, simplement, quelles informations App lycée garde sur toi, pourquoi, qui peut les voir et
        comment les contrôler. Elle s’adresse aux élèves, à leurs parents et aux enseignants.
      </p>

      <h2>Qui est responsable de tes données&nbsp;?</h2>
      <p>
        Le responsable est l’éditeur de l’application&nbsp;: <ACompleter>nom ou raison sociale de l’éditeur</ACompleter>
        {' '}(voir les <Link href="/mentions-legales">mentions légales</Link>). Pour toute question sur tes données,
        écris à <ACompleter>adresse e-mail pour les données personnelles</ACompleter>.
      </p>

      <h2>Quelles données sont collectées&nbsp;?</h2>
      <ul>
        <li>Ton adresse e-mail, ton prénom, ta filière et ton niveau.</li>
        <li>
          Un indicateur «&nbsp;moins de 15 ans&nbsp;» (oui ou non). L’application ne demande ni ne garde jamais ta date
          de naissance.
        </li>
        <li>Pour les moins de 15 ans&nbsp;: l’adresse e-mail d’un parent ou d’un représentant légal, la date de la demande d’accord et celle de l’accord.</li>
        <li>Tes résultats aux quiz et aux évaluations, avec tes réponses, et l’historique des questions qui t’ont été posées.</li>
        <li>Ta progression dans les cours.</li>
        <li>Ton calendrier&nbsp;: événements, échéances et plans de révision que tu crées.</li>
        <li>Tes préférences de rappel, les appareils sur lesquels tu as activé les notifications, et les rappels envoyés.</li>
        <li>Les classes que tu as rejointes, quittées ou dont tu as été retiré, les dates de tes tentatives de saisie d’un code de classe, et les questions que tu as signalées.</li>
        <li>Le cours gratuit que tu as choisi.</li>
        <li>
          Pour les enseignants&nbsp;: le nom de l’établissement et la demande de validation du statut d’enseignant,
          examinée par un administrateur du contenu.
        </li>
        <li>
          Si tu te connectes avec Google&nbsp;: ton nom et ton adresse e-mail, fournis par Google. Nous ne recevons pas ton mot
          de passe Google.
        </li>
        <li>
          Des données techniques de connexion (adresse IP, appareil, journaux de Supabase Auth et de Vercel), gardées{' '}
          <ACompleter>durée de conservation des journaux</ACompleter>.
        </li>
      </ul>

      <h2>À quoi servent-elles, et sur quelle base&nbsp;?</h2>
      <p>
        Ces données servent à fournir les cours et les quiz, à suivre ta progression, à permettre à ton enseignant de
        suivre sa classe et à t’envoyer les rappels que tu as demandés. La base légale est l’exécution du service que tu
        utilises. Pour les élèves de moins de 15 ans, elle s’appuie aussi sur l’accord d’un parent ou d’un représentant
        légal, demandé par e-mail à l’inscription. Le lien envoyé au parent est valable 7&nbsp;jours.
      </p>
      <p>Tes résultats ne sont jamais vendus ni utilisés pour de la publicité.</p>

      <h2>Qui peut y accéder&nbsp;?</h2>
      <ul>
        <li>Toi, depuis ton compte.</li>
        <li>
          Ton enseignant, si tu as rejoint sa classe&nbsp;: il voit ta progression et tes notes. Il ne voit jamais ton
          calendrier.
        </li>
        <li>
          Un administrateur du contenu, quand tu signales une question&nbsp;: il voit ton nom et ton adresse e-mail avec
          ton signalement.
        </li>
        <li>Google, si tu choisis de te connecter avec ton compte Google (fournisseur d’identité).</li>
        <li>
          Les prestataires techniques qui font fonctionner l’application&nbsp;: Supabase (base de données et connexion),
          Vercel (hébergement), <ACompleter>fournisseur d’envoi des e-mails</ACompleter> (e-mails d’accord parental) et les
          services de notification de ton navigateur (selon le navigateur, ceux de Google, d’Apple, de Mozilla ou de
          Microsoft) pour les rappels.
        </li>
      </ul>
      <p>
        <ACompleter>transferts hors de l’Union européenne éventuels (Vercel Inc. est une société américaine) et garanties
        prévues</ACompleter>
      </p>

      <h2>Où sont-elles hébergées&nbsp;?</h2>
      <p>
        Les données sont hébergées dans l’Union européenne (Supabase, région européenne) et les traitements de
        l’application s’exécutent à Paris (Vercel).
      </p>

      <h2>Combien de temps sont-elles gardées&nbsp;?</h2>
      <ul>
        <li>Tant que ton compte existe.</li>
        <li>
          Si tu demandes la suppression de ton compte, tu as 30&nbsp;jours pour changer d’avis depuis la page
          «&nbsp;Mes données&nbsp;». Passé ce délai, le compte et tout ce qui en dépend sont supprimés définitivement, chaque nuit,
          sans retour possible. Les classes créées par un enseignant sont supprimées avec son compte.
        </li>
        <li>
          Les retraits d’une classe et les départs de classe sont gardés 30&nbsp;jours (le temps du blocage de 24&nbsp;heures
          après un retrait par l’enseignant), puis effacés.
        </li>
        <li>Le lien d’accord envoyé à un parent expire au bout de 7&nbsp;jours.</li>
        <li>
          Les dates de tes tentatives de saisie d’un code de classe servent à limiter les essais&nbsp;; celles qui ont plus
          d’une heure sont effacées à ta tentative suivante, et toutes disparaissent avec ton compte.
        </li>
      </ul>

      <h2>Cookies et stockage dans ton navigateur</h2>
      <p>
        App lycée n’utilise que des cookies nécessaires à ta connexion (la session). Il n’y a aucun traceur publicitaire
        ni aucune mesure d’audience&nbsp;: c’est pour cela qu’aucune bannière de cookies ne s’affiche. Pour te laisser relire
        des chapitres sans connexion, ton navigateur peut aussi garder en mémoire des pages de cours déjà ouvertes&nbsp;; elles
        sont vidées quand tu te déconnectes ou quand tu ouvres la page de connexion, ou depuis les réglages de ton navigateur.
      </p>

      <h2>Quels sont tes droits&nbsp;?</h2>
      <ul>
        <li>
          Accès et export&nbsp;: la page <Link href="/mes-donnees">Mes données</Link> te permet de télécharger un fichier JSON
          avec ton profil, tes classes, ta progression, tes tentatives et tes réponses, ton calendrier, tes préférences
          et tes appareils (nom et date seulement), ton consentement parental et ton cours gratuit.
        </li>
        <li>
          Ce que l’export ne contient pas, volontairement&nbsp;: le jeton de ton calendrier iCal (c’est un secret que tu peux
          révoquer à tout moment depuis le calendrier), les empreintes des jetons de sécurité et les clés techniques de
          notification de tes appareils.
        </li>
        <li>Rectification&nbsp;: en écrivant à <ACompleter>adresse e-mail pour les données personnelles</ACompleter>.</li>
        <li>Suppression&nbsp;: depuis la page <Link href="/mes-donnees">Mes données</Link>, dans les conditions ci-dessus.</li>
        <li>
          Retrait du consentement parental&nbsp;: un parent peut le retirer en écrivant à <ACompleter>adresse e-mail pour les données personnelles</ACompleter>.
          Après ce retrait, le compte de l’élève est supprimé.
        </li>
        <li>
          Réclamation&nbsp;: tu peux saisir la CNIL (<a href="https://www.cnil.fr" rel="noopener noreferrer">cnil.fr</a>).
        </li>
      </ul>
    </>
  );
}

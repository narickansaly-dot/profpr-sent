import type { Metadata } from 'next';
import Link from 'next/link';
import { ACompleter, NoteJuriste } from '../composants';

export const metadata: Metadata = { title: 'Conditions d’utilisation' };

export default function PageConditions() {
  return (
    <>
      <h1>Conditions d’utilisation</h1>
      <NoteJuriste />

      <h2>Objet du service</h2>
      <p>
        App lycée propose des cours détaillés, des quiz, des évaluations et un calendrier de révision pour les élèves de
        lycée, ainsi qu’un suivi de classe pour les enseignants.
      </p>

      <h2>Compte personnel</h2>
      <p>
        Ton compte est personnel&nbsp;: ne partage pas tes identifiants. Les informations que tu donnes doivent être
        exactes. Pour un élève de moins de 15 ans, l’usage de l’application demande l’accord d’un parent ou d’un
        représentant légal.
      </p>

      <h2>Essai et cours gratuit</h2>
      <p>
        Tu peux utiliser tous les cours pendant un essai de 7&nbsp;jours. Ensuite, tu gardes l’accès à un cours gratuit de
        ton choix, parmi les cours de ta filière et de ton niveau. Tu peux changer ce choix une seule fois, dans les
        48&nbsp;heures qui suivent ton premier choix&nbsp;; ensuite, il est définitif. Les conditions générales de vente
        des abonnements seront ajoutées avec l’abonnement.
      </p>

      <h2>Règles de bonne conduite</h2>
      <ul>
        <li>Utilise l’application pour apprendre, sans chercher à contourner ses limites ni à accéder aux comptes des autres.</li>
        <li>Pour les enseignants&nbsp;: signale une question erronée avec le bouton prévu, sans détourner ce signalement de son usage.</li>
        <li>Garde le code de ta classe pour les élèves concernés&nbsp;; un enseignant peut retirer un élève de sa classe.</li>
        <li>Pendant une évaluation, ne cherche pas à obtenir la correction avant la fin.</li>
      </ul>

      <h2>Contenu et propriété</h2>
      <p>
        Les cours et les questions restent la propriété de l’éditeur (voir les <Link href="/mentions-legales">mentions
        légales</Link>). Tu peux les utiliser pour tes révisions&nbsp;; tu ne peux ni les copier pour les diffuser, ni les
        revendre.
      </p>

      <h2>Responsabilité</h2>
      <p>
        Le contenu est conçu avec soin pour accompagner le programme, mais il ne remplace pas ton enseignant ni ton
        manuel, et aucun résultat à un examen n’est garanti. L’éditeur s’efforce de garder l’application accessible, sans
        pouvoir assurer qu’elle fonctionne sans interruption.
      </p>

      <h2>Données personnelles</h2>
      <p>
        L’usage de tes données est décrit dans la <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>

      <h2>Modification des conditions</h2>
      <p>
        Ces conditions peuvent évoluer. En cas de changement important, nous t’en informerons dans l’application.{' '}
        <ACompleter>date de dernière mise à jour</ACompleter>
      </p>

      <h2>Droit applicable</h2>
      <p>
        Ces conditions sont régies par le droit français.{' '}<ACompleter>juridiction compétente, à valider avec un juriste</ACompleter>
      </p>
    </>
  );
}

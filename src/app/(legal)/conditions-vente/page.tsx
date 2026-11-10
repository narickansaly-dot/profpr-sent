import type { Metadata } from 'next';
import Link from 'next/link';
import { ACompleter, NoteJuriste } from '../composants';

export const metadata: Metadata = { title: 'Conditions de vente' };

export default function PageConditionsVente() {
  return (
    <>
      <h1>Conditions de vente</h1>
      <NoteJuriste />
      <p>
        Le paiement en ligne n’est pas encore ouvert&nbsp;:
        ces conditions s’appliqueront à l’ouverture des abonnements.
      </p>

      <h2>Objet</h2>
      <p>
        Ces conditions décrivent l’abonnement à App lycée, qui donne accès à tous les cours de l’application. Les
        règles d’usage du service sont dans les <Link href="/conditions-utilisation">conditions d’utilisation</Link>.
      </p>

      <h2>Formules et prix</h2>
      <p>
        L’abonnement existe en formule mensuelle et en formule annuelle. La formule annuelle équivaut à 2&nbsp;mois offerts
        par rapport à douze mensualités. Les prix sont <ACompleter>prix de la formule mensuelle et de la formule annuelle</ACompleter>
        {' '}et sont indiqués toutes taxes comprises (TTC) sur la page de souscription, avant la validation.
      </p>

      <h2>Essai et version gratuite</h2>
      <p>
        Chaque élève bénéficie de 7&nbsp;jours d’accès complet à tous les cours. Ensuite, sans abonnement, l’accès se limite
        à un cours gratuit, sans limite de durée, dans les conditions décrites dans les{' '}
        <Link href="/conditions-utilisation">conditions d’utilisation</Link>.
      </p>

      <h2>Souscription et paiement</h2>
      <p>
        Le paiement est assuré par un prestataire de paiement sécurisé, <ACompleter>nom du prestataire</ACompleter>.
        L’éditeur ne conserve pas les numéros de carte bancaire. Le payeur est l’élève, s’il est majeur, ou un parent.
        Le payeur doit être titulaire du moyen de paiement utilisé ou autorisé à s’en servir.
      </p>

      <h2>Renouvellement et résiliation</h2>
      <p>
        L’abonnement est renouvelé automatiquement à la fin de chaque période, mensuelle ou annuelle, au prix en vigueur
        indiqué lors de la souscription. Vous pouvez résilier à tout moment&nbsp;: la résiliation prend effet à la fin de
        la période en cours, et l’accès complet est conservé jusqu’à cette date.
      </p>

      <h2>Échec de paiement</h2>
      <p>
        Si un paiement échoue, l’accès complet est maintenu pendant un délai de grâce de 7&nbsp;jours, le temps de
        régulariser le paiement. Passé ce délai sans paiement, le compte revient à la version gratuite. Les résultats et
        la progression sont conservés.
      </p>

      <h2>Droit de rétractation</h2>
      <p>
        Le consommateur dispose en principe d’un délai de rétractation de 14&nbsp;jours. Pour un contenu numérique fourni
        immédiatement, comme l’accès aux cours, l’acheteur renonce expressément à ce droit au moment de la souscription,
        en demandant l’accès immédiat au service (article L221-28 du Code de la consommation).{' '}
        <ACompleter>formulation à faire valider par un juriste (renonciation, information préalable, case à cocher)</ACompleter>
      </p>

      <h2>Médiation de la consommation</h2>
      <p>
        En cas de litige, après une réclamation écrite restée sans réponse satisfaisante auprès de l’éditeur, le
        consommateur peut recourir gratuitement à un médiateur de la consommation&nbsp;:{' '}
        <ACompleter>médiateur et coordonnées</ACompleter>
      </p>

      <h2>Données personnelles</h2>
      <p>
        L’usage des données est décrit dans la <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>

      <h2>Droit applicable</h2>
      <p>
        Ces conditions sont régies par le droit français.{' '}
        <ACompleter>juridiction compétente, à valider avec un juriste</ACompleter>
      </p>
    </>
  );
}

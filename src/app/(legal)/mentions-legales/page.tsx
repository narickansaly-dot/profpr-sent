import type { Metadata } from 'next';
import Link from 'next/link';
import { ACompleter, NoteJuriste } from '../composants';

export const metadata: Metadata = { title: 'Mentions légales' };

export default function PageMentionsLegales() {
  return (
    <>
      <h1>Mentions légales</h1>
      <NoteJuriste />

      <h2>Éditeur de l’application</h2>
      <ul>
        <li>Nom ou raison sociale&nbsp;: <ACompleter>nom ou raison sociale</ACompleter></li>
        <li>Adresse&nbsp;: <ACompleter>adresse de l’éditeur</ACompleter></li>
        <li>Numéro SIREN&nbsp;: <ACompleter>numéro SIREN</ACompleter></li>
        <li>Directeur ou directrice de la publication&nbsp;: <ACompleter>nom</ACompleter></li>
        <li>Contact&nbsp;: <ACompleter>adresse e-mail de contact</ACompleter></li>
      </ul>

      <h2>Hébergement de l’application</h2>
      <p>
        L’application est hébergée par Vercel Inc., <ACompleter>adresse de Vercel</ACompleter>. Les pages et les
        traitements de l’application s’exécutent dans la région de Paris (France).
      </p>

      <h2>Hébergement des données</h2>
      <p>
        Les données des comptes sont hébergées par Supabase, dans l’Union européenne, région
        {' '}<ACompleter>Paris ou Francfort, selon le projet Supabase créé</ACompleter>. Pour savoir ce que contiennent ces
        données et combien de temps elles sont gardées, lis la <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Les cours, les schémas, les questions des quiz et des évaluations, ainsi que l’ensemble de l’application, sont
        protégés par le droit d’auteur. Leur reproduction, leur diffusion ou leur revente sans autorisation écrite de
        l’éditeur sont interdites. Tu peux les utiliser pour tes propres révisions.
      </p>

      <h2>Nous contacter</h2>
      <p>
        Pour toute question sur l’application, écris à <ACompleter>adresse e-mail de contact</ACompleter>.
      </p>
    </>
  );
}

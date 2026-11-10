type Props = { valeur: number; max: number; libelle: string };

export function BarreProgression({ valeur, max, libelle }: Props) {
  const pourcentage = max > 0 ? Math.round((valeur / max) * 100) : 0;
  return (
    <div className="barre-progression" role="progressbar" aria-label={libelle}
      aria-valuemin={0} aria-valuemax={max} aria-valuenow={valeur} aria-valuetext={`${valeur} sur ${max}`}>
      <span style={{ width: `${pourcentage}%` }} />
    </div>
  );
}

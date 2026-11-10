/** Icône de l'application : un « L » blanc sur fond indigo, avec une pastille ambre. marge : zone de sécurité des icônes « maskable ». */
export function Icone({ taille, marge = 0 }: { taille: number; marge?: number }) {
  const lettre = Math.round(taille * (1 - 2 * marge) * 0.62);
  const decalage = taille * (0.18 + marge);
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#ffffff', fontSize: lettre, fontWeight: 700,
    }}>
      L
      <div style={{ position: 'absolute', top: decalage, right: decalage, width: taille * 0.14, height: taille * 0.14, borderRadius: '50%', background: '#f59e0b' }} />
    </div>
  );
}

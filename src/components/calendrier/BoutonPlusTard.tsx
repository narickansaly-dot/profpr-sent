'use client';

import { useFormStatus } from 'react-dom';

export function BoutonPlusTard() {
  const { pending } = useFormStatus();
  return <button type="submit" className="bouton bouton-secondaire" disabled={pending}>{pending ? 'Un instant…' : 'Plus tard'}</button>;
}

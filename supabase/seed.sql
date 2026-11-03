insert into public.niveau (code, nom, ordre) values
  ('2de', 'Seconde', 1), ('1re', 'Première', 2), ('Tle', 'Terminale', 3);

insert into public.filiere (voie, code, nom, ordre) values
  ('generale', 'GEN', 'Voie générale', 1),
  ('technologique', 'STMG', 'STMG — Sciences et technologies du management et de la gestion', 10),
  ('technologique', 'ST2S', 'ST2S — Sciences et technologies de la santé et du social', 11),
  ('technologique', 'STI2D', 'STI2D — Sciences et technologies de l''industrie et du développement durable', 12),
  ('technologique', 'STL', 'STL — Sciences et technologies de laboratoire', 13),
  ('technologique', 'STD2A', 'STD2A — Sciences et technologies du design et des arts appliqués', 14),
  ('technologique', 'STHR', 'STHR — Sciences et technologies de l''hôtellerie et de la restauration', 15),
  ('technologique', 'S2TMD', 'S2TMD — Sciences et techniques du théâtre, de la musique et de la danse', 16),
  ('technologique', 'STAV', 'STAV — Sciences et technologies de l''agronomie et du vivant', 17);

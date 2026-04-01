import { farbvarianten, farbvarianten_texte, herkunft } from "@prisma/client";
import {
  tiere,
  tier_texte,
  gehege,
  tierherkunft,
  tier_gehege_kapazitaet,
  wettbewerbstatuen,
  xp,
} from "@prisma/client";


export type PrismaVariant = farbvarianten & {
  texte: farbvarianten_texte[];
  herkunft: herkunft | null; // Das '?' muss weg, wenn du sicherstellen willst, dass es geladen ist
};


export type PrismaAnimal = tiere & {
  texte?: tier_texte[];
  gehege?: gehege;
  tierherkunft?: tierherkunft[];
  tier_gehege_kapazitaet?: tier_gehege_kapazitaet[];
  wettbewerbstatuen?: wettbewerbstatuen | null;
  farbvarianten?: farbvarianten[];
  xp?: xp[];
};
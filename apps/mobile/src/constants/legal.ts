// Pravna besedila (Pogoji uporabe + Politika zasebnosti) za aplikacijo Krave.
//
// POZOR: To so osnutki za izhodišče, ne pravni nasvet. Pred objavo jih mora
// pregledati oseba, usposobljena za pravo varstva osebnih podatkov (GDPR /
// ZVOP-2). Polja v oglatih oklepajih [ … ] zamenjaj z resničnimi podatki
// upravljavca, preden aplikacijo ponudiš uporabnikom.
//
// POLICY_VERSION se ob registraciji shrani skupaj s časom privolitve, da je
// razvidno, katero različico besedil je uporabnik sprejel. Ob vsaki vsebinski
// spremembi besedil to različico povečaj (uporabljamo datum zadnje spremembe).
export const POLICY_VERSION = "2026-10-06";

export interface LegalSection {
  heading: string;
  // Vsak element je samostojen odstavek.
  body: string[];
}

export interface LegalDocument {
  title: string;
  version: string;
  // Datum zadnje posodobitve, prikazan v glavi besedila.
  updated: string;
  intro: string[];
  sections: LegalSection[];
}

const CONTROLLER = "[UPRAVLJAVEC – naziv podjetja / s.p.]";
const CONTROLLER_ADDRESS = "[naslov upravljavca]";
const CONTACT_EMAIL = "[kontaktni e-naslov za varstvo podatkov]";

export const TERMS_OF_SERVICE: LegalDocument = {
  title: "Pogoji uporabe",
  version: POLICY_VERSION,
  updated: "6. 10. 2026",
  intro: [
    `Ti pogoji urejajo uporabo mobilne aplikacije Krave (v nadaljevanju »aplikacija«), ki jo zagotavlja ${CONTROLLER}, ${CONTROLLER_ADDRESS}. Z ustvarjanjem računa potrjuješ, da si pogoje prebral in se z njimi strinjaš.`,
  ],
  sections: [
    {
      heading: "1. Opis storitve",
      body: [
        "Aplikacija je namenjena vodenju evidenc na kmetiji: podatkov o živalih, molži, financah in koledarskih opravilih ter pošiljanju opomnikov. Storitev se lahko sčasoma spreminja, dopolnjuje ali ukinja.",
      ],
    },
    {
      heading: "2. Račun in registracija",
      body: [
        "Za uporabo je potreben uporabniški račun. Zavezuješ se, da boš ob registraciji navedel resnične in točne podatke ter jih sproti posodabljal.",
        "Odgovoren si za varovanje svojega gesla in za vse aktivnosti, ki se izvedejo prek tvojega računa. O vsaki nepooblaščeni uporabi računa nas nemudoma obvesti.",
        "Z vnosom KMG-MID se povežeš s kmetijo. Če KMG-MID že obstaja, se pridružiš obstoječi kmetiji in si lahko podatke deliš z drugimi člani iste kmetije.",
      ],
    },
    {
      heading: "3. Obveznosti uporabnika",
      body: [
        "Aplikacijo smeš uporabljati le za zakonite namene in v skladu s temi pogoji. Prepovedano je poskušati pridobiti nepooblaščen dostop do sistema, ga preobremenjevati ali vanj vnašati škodljivo kodo.",
        "Vnašaš lahko le podatke, za katere imaš ustrezno pravico oziroma privolitev.",
      ],
    },
    {
      heading: "4. Podatki uporabnika",
      body: [
        "Podatki, ki jih vneseš (npr. o živalih, molži in financah), ostajajo tvoji oziroma pripadajo kmetiji. Obdelavo osebnih podatkov podrobneje ureja Politika zasebnosti.",
        "Kadar je kmetija deljena med več člani, so vneseni podatki o kmetiji dostopni vsem članom te kmetije.",
      ],
    },
    {
      heading: "5. Razpoložljivost storitve",
      body: [
        "Prizadevamo si za nemoteno delovanje, vendar ne jamčimo neprekinjene razpoložljivosti. Storitev je na voljo »takšna, kot je«, brez jamstev glede ustreznosti za določen namen.",
        "Aplikacija ne nadomešča uradnih evidenc, ki jih predpisuje zakonodaja; za izpolnjevanje zakonskih obveznosti je odgovoren uporabnik sam.",
      ],
    },
    {
      heading: "6. Omejitev odgovornosti",
      body: [
        "V največjem obsegu, ki ga dopušča veljavno pravo, ne odgovarjamo za posredno ali posledično škodo, izgubo podatkov ali izgubljeni dobiček, ki bi nastala zaradi uporabe ali nezmožnosti uporabe aplikacije.",
      ],
    },
    {
      heading: "7. Prenehanje",
      body: [
        "Svoj račun lahko kadar koli izbrišeš v nastavitvah profila. Ob izbrisu se tvoji osebni podatki izbrišejo skladno s Politiko zasebnosti.",
        "Ob kršitvi teh pogojev lahko dostop do storitve omejimo ali ukinemo.",
      ],
    },
    {
      heading: "8. Spremembe pogojev",
      body: [
        "Pogoje lahko spremenimo. O pomembnejših spremembah te obvestimo v aplikaciji. Nadaljnja uporaba po uveljavitvi sprememb pomeni strinjanje s posodobljenimi pogoji.",
      ],
    },
    {
      heading: "9. Veljavno pravo",
      body: [
        "Za te pogoje velja pravo Republike Slovenije. Za morebitne spore je pristojno sodišče v Republiki Sloveniji.",
      ],
    },
    {
      heading: "10. Kontakt",
      body: [`Za vprašanja glede pogojev uporabe nam piši na ${CONTACT_EMAIL}.`],
    },
  ],
};

export const PRIVACY_POLICY: LegalDocument = {
  title: "Politika zasebnosti",
  version: POLICY_VERSION,
  updated: "6. 10. 2026",
  intro: [
    "Zasebnost tvojih podatkov nam je pomembna. Ta politika pojasnjuje, katere osebne podatke obdelujemo, zakaj, na kateri pravni podlagi in kakšne pravice imaš.",
  ],
  sections: [
    {
      heading: "1. Upravljavec",
      body: [
        `Upravljavec osebnih podatkov je ${CONTROLLER}, ${CONTROLLER_ADDRESS}. Za vsa vprašanja glede obdelave osebnih podatkov in uveljavljanje pravic smo dosegljivi na ${CONTACT_EMAIL}.`,
      ],
    },
    {
      heading: "2. Kateri podatki se obdelujejo",
      body: [
        "Podatki računa: ime in priimek, e-poštni naslov, vloga in geslo (shranjeno izključno v šifrirani/zgoščeni obliki).",
        "Podatki o kmetiji: KMG-MID ter podatki, ki jih vneseš o kmetiji, živalih, molži, financah in koledarskih opravilih.",
        "Žeton za potisna obvestila in oznaka platforme naprave (za pošiljanje opomnikov).",
        "Tehnični podatki, potrebni za delovanje in varnost storitve.",
      ],
    },
    {
      heading: "3. Nameni in pravna podlaga",
      body: [
        "Zagotavljanje storitve in vodenje računa – pravna podlaga je izvajanje pogodbe (člen 6(1)(b) GDPR).",
        "Pošiljanje potisnih opomnikov na opravila – na podlagi tvoje privolitve (člen 6(1)(a) GDPR), ki jo lahko kadar koli prekličeš v nastavitvah naprave ali profila.",
        "Zagotavljanje varnosti in preprečevanje zlorab – na podlagi zakonitega interesa (člen 6(1)(f) GDPR).",
      ],
    },
    {
      heading: "4. Hramba podatkov",
      body: [
        "Osebne podatke hranimo, dokler imaš aktiven račun. Po izbrisu računa se tvoji osebni podatki izbrišejo oziroma anonimizirajo, razen kadar jih moramo hraniti zaradi zakonskih obveznosti.",
        "Podatki deljene kmetije se ohranijo, dokler obstaja vsaj en član te kmetije; izbrišejo se, ko kmetijo zapusti zadnji član.",
      ],
    },
    {
      heading: "5. Obdelovalci in deljenje podatkov",
      body: [
        "Podatkov ne prodajamo. Za delovanje storitve uporabljamo zunanje obdelovalce: ponudnika gostovanja (Railway) in ponudnika potisnih obvestil (Expo / Apple APNs / Google FCM). Ti obdelujejo podatke v našem imenu na podlagi pogodb o obdelavi.",
        "Podatke lahko razkrijemo pristojnim organom, če to zahteva zakon.",
      ],
    },
    {
      heading: "6. Prenos v tretje države",
      body: [
        "Nekateri obdelovalci lahko podatke obdelujejo zunaj EU/EGP. V tem primeru poskrbimo za ustrezne zaščitne ukrepe (npr. standardne pogodbene klavzule). [Preveri in navedi dejansko regijo gostovanja ter morebitne prenose.]",
      ],
    },
    {
      heading: "7. Tvoje pravice",
      body: [
        "Glede svojih osebnih podatkov imaš pravico do dostopa, popravka, izbrisa, omejitve obdelave, prenosljivosti ter pravico do ugovora. Kadar obdelava temelji na privolitvi, jo lahko kadar koli prekličeš (preklic ne vpliva na zakonitost obdelave pred preklicem).",
        "Dostop do svojih podatkov in njihov izvoz ter izbris računa lahko izvedeš neposredno v aplikaciji (nastavitve profila).",
        "Pritožbo lahko vložiš pri nadzornem organu – Informacijskem pooblaščencu Republike Slovenije (www.ip-rs.si).",
      ],
    },
    {
      heading: "8. Varnost",
      body: [
        "Izvajamo ustrezne tehnične in organizacijske ukrepe za zaščito podatkov, med drugim šifriranje gesel in prenos podatkov po varni povezavi. Noben sistem ni popolnoma varen, zato absolutne varnosti ne moremo zagotoviti.",
      ],
    },
    {
      heading: "9. Potisna obvestila",
      body: [
        "Če privoliš v obvestila, pošiljamo opomnike na opravila v koledarju. Obvestila lahko kadar koli izklopiš v nastavitvah naprave.",
      ],
    },
    {
      heading: "10. Spremembe politike",
      body: [
        "To politiko lahko občasno posodobimo. O pomembnejših spremembah te obvestimo v aplikaciji; veljavna različica je vedno dostopna v aplikaciji.",
      ],
    },
    {
      heading: "11. Kontakt",
      body: [`Za vprašanja glede zasebnosti nam piši na ${CONTACT_EMAIL}.`],
    },
  ],
};

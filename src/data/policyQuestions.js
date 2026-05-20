export const policyQuestions = [
  {
    id: 'q1',
    topic: 'Bezpečnostní a geopolitická naléhavost',
    response: [
      'Z hlediska současné bezpečnostní situace by Česká republika měla',
      'plošnou šestiměsíční vojenskou službu pro mladé muže i ženy.',
    ],
    response_blank: 'zvolit míru zavedení',
    options: [
      'nezavádět',
      'zatím nezavádět, pouze sledovat vývoj',
      'posílit dobrovolné formy přípravy',
      'připravit legislativní a organizační varianty',
      'zavést selektivní povinnou přípravu pro část ročníku',
      'zavést plošnou službu postupně',
      'zavést plošnou službu co nejdříve',
    ],
    assessments: {
      no: [
        {
          A_id: 'A1',
          assessment:
            'Samotná zhoršená bezpečnostní situace ještě nemusí automaticky znamenat, že plošná povinná služba je nejúčinnější nástroj. ČR je členem NATO a bezpečnostní politika stojí primárně na kolektivní obraně, profesionální armádě a schopnosti rychle doplnit síly v krizi.',
          evidence: [
            {
              E_id: 'E1',
              evidenceText:
                'Obranná strategie ČR 2023 zdůrazňuje zapojení ČR do kolektivní obrany NATO a odstrašení protivníka jako základní rámec obrany. To podporuje argument, že povinná služba má být posuzována vůči širšímu systému obrany, nikoli jako samostatná odpověď.',
              sources: [
                {
                  source: 'Ministerstvo obrany ČR, Obranná strategie České republiky 2023',
                  sourceUrl:
                    'https://www.mo.gov.cz/assets/en/ministry-of-defence/basic-documents/defence-strategy-of-the-czech-republic_2023_final.pdf',
                },
              ],
            },
          ],
        },
      ],
      yes: [
        {
          A_id: 'A2',
          assessment:
            'V případě dlouhodobě zhoršeného bezpečnostního prostředí může širší vojenská příprava obyvatel zvýšit odolnost státu, schopnost mobilizace a počet lidí, kteří mají alespoň základní výcvik.',
          evidence: [
            {
              E_id: 'E2',
              evidenceText:
                'Severské země v reakci na zhoršené bezpečnostní prostředí posilují modely branné přípravy a rozšiřují zapojení žen. Dánsko od roku 2025 zahrnulo ženy do systému odvodního posuzování a plánuje prodlužovat dobu služby.',
              sources: [
                {
                  source: 'Reuters, Denmark expands military service to include women, 2025',
                  sourceUrl:
                    'https://www.reuters.com/business/aerospace-defense/denmark-expands-military-service-include-women-2025-07-01/',
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: 'q2',
    topic: 'Vojenský přínos a použitelnost vycvičené populace',
    response: [
      'Z hlediska reálného vojenského přínosu by ČR měla',
      'plošnou šestiměsíční službu jako nástroj pro zvýšení obranyschopnosti.',
    ],
    response_blank: 'zvolit vhodnou míru využití',
    options: [
      'nepoužít',
      'nahradit ji pouze rozšířením aktivní zálohy',
      'zaměřit se na dobrovolná cvičení a kurzy',
      'otestovat krátký pilot základního výcviku',
      'zavést selektivní model pro vybrané role',
      'zavést všeobecný výcvik s následnou rezervou',
      'zavést plošný systém s pravidelným přecvičováním',
    ],
    assessments: {
      no: [
        {
          A_id: 'A3',
          assessment:
            'Šestiměsíční služba může vytvořit velký počet lidí se základní přípravou, ale bez navazujícího zařazení, přecvičování a vybavení nemusí vytvořit skutečně použitelnou zálohu.',
          evidence: [
            {
              E_id: 'E3',
              evidenceText:
                'Aktivní záloha je v českém systému popisována jako plnohodnotná součást ozbrojených sil, která v míru pomáhá i při mimořádných událostech a v ohrožení státu slouží k doplnění ozbrojených sil. To ukazuje, že klíčový není jen první výcvik, ale dlouhodobé zařazení do systému.',
              sources: [
                {
                  source: 'Ministerstvo obrany ČR, Aktivní záloha',
                  sourceUrl:
                    'https://doarmady.mo.gov.cz/koho-hledame/vojak-v-zaloze/aktivni-zaloha',
                },
              ],
            },
          ],
        },
      ],
      yes: [
        {
          A_id: 'A4',
          assessment:
            'Povinná služba může zvýšit mobilizační základnu státu, pokud je navázána na systém záloh, specializací, evidence dovedností a pravidelného přecvičování.',
          evidence: [
            {
              E_id: 'E4',
              evidenceText:
                'Finsko dlouhodobě staví obranu na široké rezervě vytvořené skrze povinnou službu. Tento model se často uvádí jako příklad systému, kde je vojenská služba součástí širší koncepce celospolečenské obrany.',
              sources: [
                {
                  source: 'Euronews, Finland adopts an all-society model to build national defence, 2025',
                  sourceUrl:
                    'https://www.euronews.com/my-europe/2025/10/07/finland-adopts-an-all-society-model-to-build-national-defence',
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: 'q3',
    topic: 'Ekonomické náklady a dopady na mladé lidi',
    response: [
      'Z hlediska ekonomických nákladů by ČR měla',
      'povinnou službu v rozsahu šesti měsíců.',
    ],
    response_blank: 'zvolit ekonomicky přijatelnou variantu',
    options: [
      'odmítnout kvůli vysokým nákladům',
      'odložit do zpracování cost-benefit analýzy',
      'nahradit dobrovolně placenými programy',
      'otestovat malý pilot s vyčíslením nákladů',
      'zavést pouze pro část ročníku',
      'zavést postupně s kompenzacemi',
      'zavést plošně i za cenu vyšších nákladů',
    ],
    assessments: {
      no: [
        {
          A_id: 'A5',
          assessment:
            'Povinná služba má skryté ekonomické náklady: mladí lidé odkládají studium, práci nebo podnikání a stát musí financovat výcvik, ubytování, instruktory, vybavení a administraci.',
          evidence: [
            {
              E_id: 'E5',
              evidenceText:
                'Ekonomická literatura upozorňuje, že odvody představují naturální daň v podobě nucené práce a vytvářejí náklady, které se ne vždy plně objevují ve státním rozpočtu.',
              sources: [
                {
                  source: 'IZA Discussion Paper, Effects of Mandatory Military Service on Wages and Other Outcomes, 2021',
                  sourceUrl:
                    'https://docs.iza.org/dp14352.pdf',
                },
              ],
            },
            {
              E_id: 'E6',
              evidenceText:
                'Shrnutí Economics Observatory uvádí, že konskripce může mít agregované ekonomické náklady včetně dopadů na dlouhodobý příjem a růst, a proto nemusí být levná jen proto, že mzdy odvedenců jsou nízké.',
              sources: [
                {
                  source: 'Economics Observatory, What do we know about the effects of military conscription?, 2024',
                  sourceUrl:
                    'https://www.economicsobservatory.com/what-do-we-know-about-the-effects-of-military-conscription',
                },
              ],
            },
          ],
        },
      ],
      yes: [
        {
          A_id: 'A6',
          assessment:
            'Ekonomické náklady mohou být obhajitelné, pokud je služba krátká, cílená, dobře organizovaná a přináší i civilně využitelné dovednosti, například krizovou připravenost, první pomoc, logistiku nebo kybernetickou hygienu.',
          evidence: [
            {
              E_id: 'E7',
              evidenceText:
                'Dobrovolné vojenské cvičení v ČR je prezentováno jako možnost zapojení pro občany, kteří nemohou vstoupit do aktivní zálohy, ale chtějí se podle svých možností připravovat na plnění úkolů ozbrojených sil. To ukazuje, že kratší a flexibilnější formy přípravy již v českém systému existují.',
              sources: [
                {
                  source: 'Aktivní záloha MO ČR, Dobrovolné vojenské cvičení',
                  sourceUrl:
                    'https://aktivnizaloha.mo.gov.cz/dobrovolne-vojenske-cviceni',
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: 'q4',
    topic: 'Kapacita státu, armády a výcvikové infrastruktury',
    response: [
      'Z hlediska schopnosti státu program realizovat by ČR měla',
      'povinnou šestiměsíční službu.',
    ],
    response_blank: 'zvolit realistický implementační postup',
    options: [
      'nezavádět, protože kapacita není připravena',
      'nejprve posílit profesionální armádu',
      'nejprve rozšířit dobrovolné zálohy a instruktorskou kapacitu',
      'připravit organizační a infrastrukturní plán',
      'spustit regionální pilot',
      'zavést postupně po několika ročnících',
      'zavést plošně v krátkém horizontu',
    ],
    assessments: {
      no: [
        {
          A_id: 'A7',
          assessment:
            'Plošná služba bez dostatečného počtu instruktorů, kasárenské kapacity, zdravotního posuzování, vybavení a navazujícího systému rezerv může přetížit armádu a vytvořit formální, ale neúčinný program.',
          evidence: [
            {
              E_id: 'E8',
              evidenceText:
                'Český systém již pracuje s brannou povinností, odvodním řízením a vojenskou činnou službou, ale plošný mírový výcvik celého ročníku by vyžadoval výrazně větší organizační kapacitu než současné dobrovolné nástroje.',
              sources: [
                {
                  source: 'Zákon č. 585/2004 Sb., branný zákon',
                  sourceUrl:
                    'https://www.zakonyprolidi.cz/cs/2004-585',
                },
              ],
            },
          ],
        },
      ],
      yes: [
        {
          A_id: 'A8',
          assessment:
            'Příprava na povinnou službu může být využita jako impuls k modernizaci mobilizačních procesů, evidence schopností obyvatel a systému záloh.',
          evidence: [
            {
              E_id: 'E9',
              evidenceText:
                'Ministerstvo obrany popisuje dobrovolné předurčení jako možnost pro občany dát najevo připravenost zapojit se do obrany země a absolvovat výcvik v případě významného zhoršení bezpečnostní situace. To může být základ pro širší, ale stále odstupňovaný systém přípravy.',
              sources: [
                {
                  source: 'Ministerstvo obrany ČR, Dobrovolné předurčení',
                  sourceUrl:
                    'https://doarmady.mo.gov.cz/koho-hledame/vojak-v-zaloze/dobrovolne-predurceni',
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: 'q5',
    topic: 'Rovnost, legitimita a dopady na společnost',
    response: [
      'Z hlediska rovnosti a společenské přijatelnosti by ČR měla',
      'model služby pro mladé muže i ženy.',
    ],
    response_blank: 'zvolit společensky přijatelný model',
    options: [
      'nezavádět povinnou službu vůbec',
      'zachovat pouze dobrovolné zapojení',
      'zavést dobrovolný program se silnými pobídkami',
      'otevřít debatu o genderově neutrálním modelu',
      'zavést selektivní genderově neutrální model',
      'zavést plošný model s civilní alternativou',
      'zavést plošnou povinnost bez větších výjimek',
    ],
    assessments: {
      no: [
        {
          A_id: 'A9',
          assessment:
            'Povinná služba může být vnímána jako zásah do svobody mladých lidí a může vyvolat odpor, pokud nebude jasně zdůvodněna, spravedlivá a doplněná civilní alternativou pro odpůrce vojenské služby.',
          evidence: [
            {
              E_id: 'E10',
              evidenceText:
                'Ekonomická a sociální kritika odvodů často zdůrazňuje, že břemeno nenesou všichni občané rovnoměrně, ale hlavně konkrétní věkové kohorty, kterým služba zasahuje do vzdělání a začátku kariéry.',
              sources: [
                {
                  source: 'Economics Observatory, What do we know about the effects of military conscription?, 2024',
                  sourceUrl:
                    'https://www.economicsobservatory.com/what-do-we-know-about-the-effects-of-military-conscription',
                },
              ],
            },
          ],
        },
      ],
      yes: [
        {
          A_id: 'A10',
          assessment:
            'Pokud už stát uvažuje o povinné službě, genderově neutrální model pro muže i ženy může být legitimnější než návrat k modelu, který ukládá povinnost jen mužům.',
          evidence: [
            {
              E_id: 'E11',
              evidenceText:
                'Norsko zavedlo genderově neutrální povinnou vojenskou službu jako model stejných práv a povinností. Severské zkušenosti ukazují, že moderní odvody mohou být selektivní a genderově neutrální, nikoli nutně plošné pro celý ročník.',
              sources: [
                {
                  source: 'OSCE, Gender-neutral compulsory military service in Norway, 2013',
                  sourceUrl:
                    'https://cdn.osce.org/sites/default/files/f/documents/7/1/103192.pdf',
                },
                {
                  source: 'Österreichisches Institut für Internationale Politik, The Scandinavian model of military conscription, 2021',
                  sourceUrl:
                    'https://www.oiip.ac.at/cms/media/policy-analysis-scandinavian-model-of-military-conscription.pdf',
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: 'q6',
    topic: 'Alternativy k plošné povinné službě',
    response: [
      'Ve srovnání s alternativami by ČR měla',
      'plošnou šestiměsíční vojenskou službu jako hlavní nástroj branné připravenosti.',
    ],
    response_blank: 'zvolit preferovaný nástroj',
    options: [
      'odmítnout a ponechat současný stav',
      'rozšířit pouze dobrovolné nástroje',
      'zavést motivační program pro dobrovolné zálohy',
      'zavést krátkou povinnou brannou evidenci a dobrovolný výcvik',
      'zavést selektivní službu podle potřeb armády',
      'zavést univerzální službu s vojenskou i civilní větví',
      'zavést plošnou vojenskou službu pro celý ročník',
    ],
    assessments: {
      no: [
        {
          A_id: 'A11',
          assessment:
            'Cíle branné připravenosti lze částečně naplnit i méně invazivními nástroji: aktivní zálohou, dobrovolným vojenským cvičením, dobrovolným předurčením, krizovým vzděláváním nebo civilní odolností.',
          evidence: [
            {
              E_id: 'E12',
              evidenceText:
                'MO ČR uvádí více forem dobrovolného zapojení do obrany: aktivní zálohu, dobrovolné vojenské cvičení a dobrovolné předurčení. To podporuje variantu postupného rozšiřování existujících nástrojů před zavedením plošné povinnosti.',
              sources: [
                {
                  source: 'Ministerstvo obrany ČR, Voják v záloze',
                  sourceUrl:
                    'https://doarmady.mo.gov.cz/koho-hledame/vojak-v-zaloze',
                },
              ],
            },
          ],
        },
      ],
      yes: [
        {
          A_id: 'A12',
          assessment:
            'Dobrovolné nástroje nemusí stačit, pokud stát potřebuje výrazně zvýšit počet vycvičených osob v krátkém čase. V takové situaci může být selektivní nebo plošná povinnost účinnější než spoléhání na dobrovolníky.',
          evidence: [
            {
              E_id: 'E13',
              evidenceText:
                'Švédsko obnovilo povinnou službu pro muže i ženy v roce 2017 mimo jiné kvůli zhoršenému bezpečnostnímu prostředí a problémům s dobrovolným naplňováním potřeb ozbrojených sil.',
              sources: [
                {
                  source: 'Armed Forces & Society, The Reactivation and Reimagination of Military Conscription in Sweden, 2024',
                  sourceUrl:
                    'https://journals.sagepub.com/doi/10.1177/0095327X231164740',
                },
              ],
            },
          ],
        },
      ],
    },
  },
]
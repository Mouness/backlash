import type { Country } from '../services/countryService';

export const MOCK_COUNTRIES: Omit<Country, 'id'>[] = [
  {
    code: 'CAN',
    name: {
      en: 'Canada',
      fr: 'Canada',
      de: 'Kanada',
    },
    summary: {
      en: 'Focus on federalism and indigenous rights. Analyzing the impact of recent supreme court decisions.',
      fr: "Focus sur le fédéralisme et les droits autochtones. Analyse de l'impact des récentes décisions de la cour suprême.",
      de: 'Fokus auf Föderalismus und Rechte der Ureinwohner. Analyse der Auswirkungen jüngster Entscheidungen des Obersten Gerichtshofs.',
    },
    content: {
      en: `
### Overview
Canada is often viewed as a model of stability, yet it faces unique challenges regarding **indigenous self-determination** and the increasing use of the **notwithstanding clause** (Section 33 of the Charter).

### Key Issues
1.  **The Notwithstanding Clause**: Recent years have seen an unrestricted use of Section 33 by provinces (e.g., Quebec, Saskatchewan, Ontario) to shield legislation from judicial review, particularly concerning religious freedoms and gender identity rights.
2.  **Indigenous Jurisdiction**: The tension between federal, provincial, and Indigenous legal orders remains high. The implementation of UNDRIP (United Nations Declaration on the Rights of Indigenous Peoples) is a slow, contested process.
3.  **Resource Federalism**: Alberta and Saskatchewan have enacted "Sovereignty Acts" challenging federal jurisdiction over natural resources and environmental policy, signaling a rise in combative federalism.

### Case Study: Bill 96 & Bill 21
Quebec's secularism law (Bill 21) and language law (Bill 96) represent the most significant use of preemptive overrides of Charter rights, sparking a national debate on the balance between collective identity and individual liberties.
      `,
      fr: `
### Vue d'ensemble
Le Canada est souvent perçu comme un modèle de stabilité, mais il fait face à des défis uniques concernant **l'autodétermination autochtone** et l'utilisation croissante de la **clause dérogatoire** (Article 33 de la Charte).

### Enjeux Clés
1.  **Clause Dérogatoire** : Utilisation accrue par les provinces (Québec, Saskatchewan, Ontario) pour soustraire des lois au contrôle judiciaire.
2.  **Juridiction Autochtone** : Tensions persistantes entre les ordres juridiques fédéral, provincial et autochtone.
3.  **Fédéralisme des Ressources** : "Acts" de souveraineté en Alberta et Saskatchewan contestant la juridiction fédérale sur l'environnement.

### Étude de Cas : Loi 21 & Loi 96
Les lois sur la laïcité et la langue au Québec représentent l'utilisation la plus significative de dérogations préventives aux droits de la Charte.
      `,
      de: `
### Überblick
Kanada wird oft als Modell für Stabilität angesehen, steht jedoch vor Herausforderungen in Bezug auf die **Selbstbestimmung der Ureinwohner** und die zunehmende Nutzung der **Ausnahmeklausel** (Artikel 33 der Charta).

### Hauptprobleme
1.  **Die Ausnahmeklausel**: Zunehmende Nutzung durch Provinzen, um Gesetze vor gerichtlicher Überprüfung zu schützen.
2.  **Indigene Rechtsprechung**: Anhaltende Spannungen zwischen föderalen, provinziellen und indigenen Rechtsordnungen.
3.  **Ressourcenföderalismus**: Souveränitätsgesetze in Alberta und Saskatchewan fordern die föderale Zuständigkeit heraus.
      `,
    },
    imageUrl:
      'https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=800&auto=format&fit=crop', // Toronto
    score: 85,
  },
  {
    code: 'CHE',
    name: {
      en: 'Switzerland',
      fr: 'Suisse',
      de: 'Schweiz',
    },
    summary: {
      en: 'Direct democracy and cantonal sovereignty. The challenge of populism in a consensus democracy.',
      fr: 'Démocratie directe et souveraineté cantonale. Le défi du populisme dans une démocratie de consensus.',
      de: 'Direkte Demokratie und kantonale Souveränität. Die Herausforderung des Populismus in einer Konkordanzdemokratie.',
    },
    content: {
      en: `
### Overview
Switzerland's system of **Direct Democracy** and strong **Cantonal Sovereignty** is under pressure from populist movements that frame international law (e.g., ECHR) as a threat to national "self-determination."

### Key Issues
*   **The "Self-Determination" Initiative**: Efforts by right-wing populist parties to prioritize the Swiss Constitution over International Law.
*   **Pandemic Centralization**: The Covid-19 crisis saw a temporary but significant shift of power to the Federal Council, sparking a "backlash" movement defending cantonal rights and individual liberties against the "dictatorship" of Bern.
*   **Burqa Ban**: A federal vote (popular initiative) banning face coverings, illustrating how direct democracy tools can be used to target minority rights.

### Future Outlook
The tension between Switzerland's deep integration into European human rights frameworks and the populist appeal to "sovereignty" remains the central fault line of Swiss politics.
      `,
      fr: `
### Vue d'ensemble
Le système de **Démocratie Directe** et la forte **Souveraineté Cantonale** de la Suisse sont sous pression face aux mouvements populistes qui présentent le droit international comme une menace.

### Enjeux Clés
*   **Initiative "Autodétermination"** : Efforts pour prioriser la Constitution suisse sur le Droit International.
*   **Centralisation Pandémique** : Transfert temporaire de pouvoir au Conseil Fédéral, déclenchant un mouvement de défense des droits cantonaux.
*   **Interdiction de la Burqa** : Exemple d'utilisation de la démocratie directe pour cibler les droits des minorités.
      `,
      de: `
### Überblick
Das Schweizer System der **Direkten Demokratie** steht unter Druck durch populistische Bewegungen, die internationales Recht als Bedrohung der nationalen Selbstbestimmung darstellen.

### Hauptprobleme
*   **Selbstbestimmungsinitiative**: Vorrang der Bundesverfassung vor Völkerrecht.
*   **Pandemie-Zentralisierung**: Machtverschiebung nach Bern während der Krise.
*   **Burka-Verbot**: Nutzung direktdemokratischer Instrumente gegen Minderheitenrechte.
      `,
    },
    imageUrl:
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop', // Alps/Nature
    score: 90,
  },
  {
    code: 'DEU',
    name: {
      en: 'Germany',
      fr: 'Allemagne',
      de: 'Deutschland',
    },
    summary: {
      en: 'Constitutional court and federal state relations. Protecting democratic order against extremism.',
      fr: "Cour constitutionnelle et relations fédérales. Protection de l'ordre démocratique contre l'extrémisme.",
      de: 'Verfassungsgericht und Beziehungen der Bundesländer. Schutz der demokratischen Grundordnung gegen Extremismus.',
    },
    content: {
      en: `
### Overview
Germany's **"Militant Democracy"** (Wehrhafte Demokratie) is being tested by the rise of the far-right **AfD** (Alternative für Deutschland), particularly in eastern federal states (Länder).

### Key Issues
1.  **Extremism in State Parliaments**: The AfD has gained significant ground in state elections (e.g., Thuringia, Saxony), challenging the democratic consensus ("Brandmauer") of established parties.
2.  **Federal Constitutional Court (FCC)**: The FCC remains the primary bulwark against authoritarianism, but its independence is being targeted by political attacks questioning its legitimacy.
3.  **Verfassungsschutz**: The surveillance of the AfD by the Federal Office for the Protection of the Constitution has turned the intelligence agency into a central political player.

### Analysis
The German federal system serves as both an incubator for extremism (in specific states) and a firewall (through federal intervention and judicial review) against its nationwide spread.
      `,
      fr: `
### Vue d'ensemble
La **"Démocratie Militante"** allemande est mise à l'épreuve par la montée de l'**AfD**, particulièrement dans les Länder de l'est.

### Enjeux Clés
1.  **Extrémisme dans les Parlements** : L'AfD gagne du terrain, défiant le consensus démocratique.
2.  **Cour Constitutionnelle Fédérale** : Reste le rempart principal, mais sa légitimité est attaquée.
3.  **Surveillance** : Le rôle politique croissant de l'Office de protection de la Constitution.

### Analyse
Le système fédéral allemand agit à la fois comme un incubateur pour l'extrémisme (dans certains états) et comme un pare-feu contre sa propagation nationale.
      `,
      de: `
### Überblick
Deutschlands **Wehrhafte Demokratie** wird durch den Aufstieg der **AfD**, insbesondere in den östlichen Bundesländern, auf die Probe gestellt.

### Hauptprobleme
1.  **Extremismus in Landtagen**: Wahlerfolge der AfD in Thüringen und Sachsen.
2.  **Bundesverfassungsgericht**: Angriffe auf die Unabhängigkeit des Gerichts.
3.  **Verfassungsschutz**: Die Beobachtung der AfD als politisches Thema.
      `,
    },
    imageUrl:
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800&auto=format&fit=crop', // Berlin/City
    score: 88,
  },
  {
    code: 'BRA',
    name: {
      en: 'Brazil',
      fr: 'Brésil',
      de: 'Brasilien',
    },
    summary: {
      en: 'Federalism under pressure and judicial backlash. The tug-of-war between executive and judiciary.',
      fr: 'Fédéralisme sous pression et retour de bâton judiciaire. Le bras de fer entre exécutif et judiciaire.',
      de: 'Föderalismus unter Druck und justizieller Rückschlag. Das Tauziehen zwischen Exekutive und Judikative.',
    },
    content: {
      en: `
### Overview
Brazil offers a dramatic example of **Federalism as a Shield**. During the Bolsonaro administration, subnational governments (states) became the primary defenders of health policy and democratic norms against a central populist executive.

### Key Dynamics
*   **The Supreme Court (STF)**: The STF empowered states to take independent action on Covid-19, neutralizing federal denialism. This led to intense attacks on the judiciary by the President.
*   **Gubernatorial Resistance**: Governors from across the political spectrum formed alliances to bypass the federal government on vaccine procurement and environmental protection (Amazon Fund).
*   **January 8th Attacks**: The storming of the Three Powers Plaza highlighted the fragility of federal institutions, but the swift unified response of state governors showed the resilience of the federal pact.

### Conclusion
Brazilian federalism has evolved from a mechanism of patronage to a vital check on authoritarianism, though the polarization between "Red" and "Blue" states is growing.
      `,
      fr: `
### Vue d'ensemble
Le Brésil offre un exemple dramatique du **Fédéralisme comme Bouclier**. Les gouvernements subnationaux sont devenus les principaux défenseurs des normes démocratiques sous Bolsonaro.

### Dynamiques Clés
*   **La Cour Suprême (STF)** : A habilité les états à agir indépendamment sur le Covid-19.
*   **Résistance des Gouverneurs** : Alliances pour contourner le gouvernement fédéral.
*   **Attaques du 8 Janvier** : La réponse unifiée des gouverneurs a montré la résilience du pacte fédéral.
      `,
      de: `
### Überblick
Brasilien zeigt den **Föderalismus als Schutzschild**. Unter Bolsonaro wurden die Bundesstaaten zu Verteidigern demokratischer Normen.

### Schlüssel-Dynamiken
*   **Oberster Gerichtshof (STF)**: Stärkte die Handlungsfähigkeit der Staaten in der Pandemie.
*   **Widerstand der Gouverneure**: Allianzen zur Umgehung der Zentralregierung.
*   **8. Januar**: Die einheitliche Reaktion der Gouverneure zeigte die Stärke des föderalen Pakts.
      `,
    },
    imageUrl:
      'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=800&auto=format&fit=crop', // Rio
    score: 65,
  },
  {
    code: 'USA',
    name: {
      en: 'United States',
      fr: 'États-Unis',
      de: 'Vereinigte Staaten',
    },
    summary: {
      en: 'Polarization and state-level rights regression. Abortion, voting rights, and the laboratory of autocracy.',
      fr: "Polarisation et régression des droits au niveau des états. Avortement, droit de vote et laboratoire de l'autocratie.",
      de: 'Polarisierung und Rückgang der Rechte auf staatlicher Ebene. Abtreibung, Wahlrecht und das Labor der Autokratie.',
    },
    content: {
      en: `
### Overview
The United States is currently the "Laboratory of Autocracy" (David Pepper). Federalism is facilitating a **Great Divergence** where red and blue states are becoming effectively two different legal universes regarding fundamental rights.

### Critical Areas
1.  **Voting Rights**: States executing "voter suppression" laws (strict ID, gerrymandering) vs. states expanding access. The Supreme Court (SCOTUS) has largely stepped back, allowing this divergence.
2.  **Reproductive Rights**: Post-Dobbs, the map of abortion access perfectly tracks partisan control, creating "refugee" states and "prohibition" states.
3.  **Preemption**: Red state legislatures are aggressively preempting progressive policies of blue cities (e.g., minimum wage, LGBT protections), hollowing out local democracy.

### The "Independent State Legislature" Theory
Though rejected in its most extreme form by *Moore v. Harper*, the drive to grant state legislatures unchecked power over federal elections remains a potent threat to democratic stability.
      `,
      fr: `
### Vue d'ensemble
Les États-Unis sont le "Laboratoire de l'Autocratie". Le fédéralisme facilite une **Grande Divergence** où les états rouges et bleus deviennent des univers juridiques distincts.

### Domaines Critiques
1.  **Droit de Vote** : Suppression vs Expansion de l'accès. La Cour Suprême laisse faire.
2.  **Droits Reproductifs** : Après Dobbs, la carte de l'accès à l'avortement suit parfaitement le contrôle partisan.
3.  **Préemption** : Les législatures d'états bloquent les politiques progressistes des villes.

### Théorie de la Législature d'État Indépendante
Bien que rejetée partiellement par la Cour Suprême, la volonté de donner aux législatures un pouvoir incontrôlé reste une menace.
      `,
      de: `
### Überblick
Die USA erleben eine **Große Divergenz**, in der rote und blaue Staaten zu unterschiedlichen Rechtsuniversen werden.

### Kritische Bereiche
1.  **Wahlrecht**: Wählerunterdrückung vs. Zugangserweiterung.
2.  **Reproduktive Rechte**: Die Landkarte des Abtreibungszugangs spiegelt die parteipolitische Kontrolle wider.
3.  **Preemption**: Konservative Staaten blockieren progressive Städte.
      `,
    },
    imageUrl:
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800&auto=format&fit=crop', // Generic US/Coffee/City? Changed to generic
    score: 75,
  },
  {
    code: 'IND',
    name: {
      en: 'India',
      fr: 'Inde',
      de: 'Indien',
    },
    summary: {
      en: 'Centralization trends and state autonomy. Religious nationalism and the erosion of secular federalism.',
      fr: 'Tendances à la centralisation et autonomie des états. Nationalisme religieux et érosion du fédéralisme laïc.',
      de: 'Zentralisierungstendenzen und staatliche Autonomie. Religiöser Nationalismus und die Erosion des säkularen Föderalismus.',
    },
    content: {
      en: `
### Overview
India acts as a warning of how **Asymmetric Federalism** can be used for centralization. The BJP government has utilized the Governor's office and central agencies to erode the autonomy of opposition-led states.

### Key Issues
*   **The Governor's Role**: Non-elected governors appointed by the center holding back assent to bills passed by state legislatures (e.g., in Kerala, Tamil Nadu), effectively paralyzing governance.
*   **Fiscal Federalism**: The center's control over GST compensation and tax devolution is starving opposition states of funds, forcing them to depend on central largesse.
*   **Kashmir (Article 370)**: The revocation of Jammu & Kashmir's special status and its downgrade from a state to a Union Territory sets a precedent for the center unilaterally altering state boundaries and status.

### Analysis
Indian federalism is shifting from "Cooperative" to "Coercive," with the central government using the constitution's unitary features to impose a homogenized cultural and political nationalist agenda.
      `,
      fr: `
### Vue d'ensemble
L'Inde montre comment le **Fédéralisme Asymétrique** peut servir la centralisation. Le gouvernement BJP utilise le bureau du Gouverneur pour éroder l'autonomie des états d'opposition.

### Enjeux Clés
*   **Rôle du Gouverneur** : Blocage des lois votées par les parlements d'états.
*   **Fédéralisme Fiscal** : Le contrôle central sur la TVA (GST) affame les états d'opposition.
*   **Cachemire (Article 370)** : La révocation du statut spécial crée un précédent pour la modification unilatérale des frontières.

### Analyse
Le fédéralisme indien passe de "Coopératif" à "Coercitif", le centre imposant un agenda nationaliste homogène.
      `,
      de: `
### Überblick
Indien zeigt, wie **Asymmetrischer Föderalismus** zur Zentralisierung genutzt werden kann.

### Hauptprobleme
*   **Rolle des Gouverneurs**: Blockade von Gesetzen der Opposition.
*   **Fiskalischer Föderalismus**: Finanzielle Kontrolle durch das Zentrum.
*   **Kaschmir (Artikel 370)**: Einseitige Änderung des Staatsstatus durch das Zentrum.

### Analyse
Wandel vom kooperativen zum zwanghaften Föderalismus unter einer nationalisitischen Agenda.
      `,
    },
    imageUrl:
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop', // India/Taj
    score: 60,
  },
];

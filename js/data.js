/* One Shotter — option data.
 * Every option carries a `text` that is injected into the prompt, so the
 * LLM receives design guidance, not just a label. Edit freely.
 */
window.OS_DATA = (function () {
  const AI = { id: "ai", label: "Let the AI decide", text: "Choose whatever best serves the other selections and makes the strongest adventure." };

  const fields = [
    {
      key: "system", label: "Rules", hint: "Which game system the adventure is written for",
      def: "5e2024",
      options: [
        { id: "5e2024", label: "D&D 5e (2024 rules)", text: "Dungeons & Dragons 5th Edition using the 2024 core rules. Use 2024 terminology (species, Weapon Mastery, Bloodied, etc.) and encounter difficulty Low / Moderate / High." },
        { id: "5e2014", label: "D&D 5e (2014 rules)", text: "Dungeons & Dragons 5th Edition using the 2014 core rules. Use 2014 terminology and encounter difficulty Easy / Medium / Hard / Deadly." },
        { id: "agnostic", label: "System-agnostic", text: "System-agnostic fantasy. Describe threats by role and relative difficulty instead of exact stat blocks; express checks as Easy / Moderate / Hard." }
      ]
    },
    {
      key: "theme", label: "Theme", hint: "The genre and emotional promise of the night",
      def: "heroic",
      options: [
        { id: "heroic", label: "Classic Heroic Fantasy", text: "Clear stakes, brave deeds and a world worth saving. Big set-pieces, a moment for every hero to shine, and a triumphant finale." },
        { id: "gothic", label: "Gothic Horror", text: "Dread over gore: decaying grandeur, cursed bloodlines, things glimpsed by candlelight. Build tension slowly, make the players feel hunted, reveal the monster late." },
        { id: "cosmic", label: "Cosmic Horror", text: "Incomprehensible forces, forbidden knowledge with a price, reality bending at the edges. Victory means survival or containment, never total triumph." },
        { id: "mystery", label: "Mystery / Whodunit", text: "A crime with suspects, motives and alibis. Use the Three Clue Rule for every conclusion; the culprit must be deducible by the players before the reveal." },
        { id: "heist", label: "Heist", text: "A target, a security layout and a crew plan. Include a planning phase, complications that break the plan, and room for clever improvisation." },
        { id: "intrigue", label: "Political Intrigue", text: "Factions with competing agendas, secrets as currency, social combat. Every NPC wants something; violence is costly and has consequences." },
        { id: "survival", label: "Survival / Escape", text: "A hostile environment, dwindling resources and a ticking clock. The environment itself is an antagonist; tension comes from attrition and hard choices." },
        { id: "dungeon", label: "Classic Dungeon Crawl", text: "A self-contained dungeon of traps, puzzles, monsters and treasure, shaped like a five-room dungeon: guardian, puzzle, setback, climax, reward/revelation." },
        { id: "nautical", label: "Pirates & High Seas", text: "Swashbuckling action, boarding actions, storms, treasure maps, mutiny and divided loyalties." },
        { id: "fey", label: "Fey & Whimsy", text: "Dream logic, binding bargains, riddles and beautiful danger. The world has strange rules that must be learned and obeyed." },
        { id: "undead", label: "Undead Rising", text: "A spreading plague of the dead, a necromantic source and a community to save. Escalating siege pressure across the session." },
        { id: "planar", label: "Planar Adventure", text: "Another plane with its own physics and natives, a breach or portal crisis, and wonder mixed with peril." },
        { id: "wilderness", label: "Wilderness Expedition", text: "A journey through dangerous terrain toward a goal: navigation, weather, creatures, and a discovery waiting at the end." },
        { id: "hunt", label: "Monster Hunt", text: "Research, tracking and preparation leading to a fight with a great beast whose weaknesses are discovered through investigation." },
        { id: "comedy", label: "Comedic Caper", text: "Absurd situations played straight, escalating chaos and larger-than-life NPCs, while the stakes stay real." }
      ]
    },
    {
      key: "location", label: "Location", hint: "Where the adventure mostly takes place",
      def: "underdark",
      options: [
        AI,
        { id: "underdark", label: "Underdark Caverns", text: "Lightless tunnels, bioluminescent fungus, crystal grottos, underground lakes, and things that see in the dark." },
        { id: "manor", label: "Haunted Manor", text: "A decaying noble house: portraits that watch, locked wings, servants' passages, a family secret in the cellar." },
        { id: "ruins", label: "Ancient Ruins / Tomb", text: "A buried civilisation's remains: sealed vaults, trapped corridors, faded murals that tell a forgotten story." },
        { id: "port", label: "Smugglers' Port Town", text: "Fog-wrapped docks, crooked harbourmasters, hidden coves and tunnels beneath warehouses." },
        { id: "mountain", label: "Frozen Mountain Pass", text: "Howling blizzards, avalanche risk, an abandoned waystation and something hunting in the snow." },
        { id: "glade", label: "Enchanted Forest", text: "Ancient trees, shifting paths, will-o'-wisps, a fey court just out of sight." },
        { id: "desert", label: "Desert Necropolis", text: "Sun-scorched tombs, sandstorms, mirages and a city of the dead beneath the dunes." },
        { id: "swamp", label: "Fetid Swamp", text: "Sucking mud, stilt villages, rot-sweet air and lights that lure travellers off the path." },
        { id: "tower", label: "Wizard's Tower", text: "A vertical labyrinth of failed experiments, animated guardians, warped space and a missing master." },
        { id: "sunken", label: "Sunken Temple", text: "Half-flooded halls, rising tides, drowned idols and air pockets as precious resources." },
        { id: "city", label: "City Streets & Sewers", text: "Crowded markets, guild politics, rooftop chases and a hidden world beneath the cobbles." },
        { id: "carnival", label: "Travelling Carnival", text: "Bright tents with dark secrets, a sinister ringmaster, mirror mazes and games of chance with real stakes." },
        { id: "forge", label: "Volcanic Forge", text: "Rivers of magma, ancient dwarven or giant forges, heat as a hazard and a weapon." },
        { id: "monastery", label: "Isolated Monastery", text: "A remote cloister cut off by snow or flood, monks keeping vows and secrets, a relic in the crypt." },
        { id: "ship", label: "Ship at Sea", text: "A cramped vessel with no escape: storms, rigging, the hold below decks and something in the water." },
        { id: "sky", label: "Floating Sky Island", text: "Islands adrift among clouds, rope bridges, airships, falling as a constant threat." },
        { id: "village", label: "Remote Village", text: "A small community with old traditions, suspicious locals, and a threat at the edge of the woods." }
      ]
    },
    {
      key: "tone", label: "Tone", hint: "How the story should feel at the table",
      def: "balanced",
      options: [
        { id: "epic", label: "Epic", text: "Grand, cinematic and larger-than-life. Sweeping descriptions and heroic stakes." },
        { id: "grim", label: "Grim & Gritty", text: "Harsh consequences, morally grey choices, victories that cost something." },
        { id: "eerie", label: "Eerie & Tense", text: "Quiet unease, unanswered questions, a creeping sense that something is wrong." },
        { id: "balanced", label: "Balanced", text: "A mix of danger, humour and heart. Serious when it matters, light when it can be." },
        { id: "light", label: "Lighthearted", text: "Fun and upbeat. Humour is welcome, danger is real but never bleak." },
        { id: "whimsical", label: "Whimsical", text: "Playful, storybook strange, full of colourful characters and delightful oddities." }
      ]
    },
    {
      key: "villain", label: "Antagonist", hint: "The central threat",
      def: "ai",
      options: [
        AI,
        { id: "cult", label: "Cult Leader", text: "A charismatic cult leader and their fanatics, close to completing a ritual." },
        { id: "necro", label: "Necromancer / Lich", text: "A master of undeath with a twisted reason for their work." },
        { id: "dragon", label: "Dragon", text: "A dragon scaled to the party's level (a wyrmling or young dragon at low levels), with lair and personality." },
        { id: "hag", label: "Hag or Coven", text: "A hag or coven dealing in bargains, curses and stolen things." },
        { id: "noble", label: "Corrupt Noble", text: "A respected noble hiding rot behind a public face, with guards and influence." },
        { id: "aberration", label: "Aberration", text: "A mind-bending creature from beyond, with thralls and alien goals." },
        { id: "rivals", label: "Rival Adventurers", text: "A rival adventuring party chasing the same prize, mirroring the heroes." },
        { id: "fiend", label: "Fiend & Its Bargain", text: "A devil or demon working through a mortal who made a deal." },
        { id: "construct", label: "Rogue Construct", text: "An ancient construct following a broken directive to its logical, terrible end." },
        { id: "beast", label: "Apex Monster", text: "A monstrous beast driven by hunger, territory or pain, not malice." },
        { id: "fey", label: "Fey Lord", text: "A capricious fey noble bound by strange laws and stranger whims." },
        { id: "bandit", label: "Bandit King / Warlord", text: "A ruthless leader of raiders with lieutenants, a stronghold and a code." },
        { id: "curse", label: "Curse / Disaster", text: "No single villain: a curse, plague or natural disaster with a source that can be undone." }
      ]
    },
    {
      key: "level", label: "Party Level", hint: "Starting character level",
      def: "3",
      options: Array.from({ length: 20 }, (_, i) => {
        const n = i + 1;
        const tier = n <= 4 ? "Tier 1: local heroes" : n <= 10 ? "Tier 2: heroes of the realm" : n <= 16 ? "Tier 3: masters of the realm" : "Tier 4: masters of the world";
        return { id: String(n), label: "Level " + n, text: "Level " + n + " (" + tier + ")." };
      })
    },
    {
      key: "size", label: "Party Size", hint: "How many players are at the table",
      def: "4",
      options: Array.from({ length: 10 }, (_, i) => {
        const n = i + 1;
        return { id: String(n), label: n + (n === 1 ? " player (solo)" : " players"), text: n + (n === 1 ? " character" : " characters") + "." };
      })
    },
    {
      key: "length", label: "Session Length", hint: "How long you plan to play",
      def: "standard",
      options: [
        { id: "short", label: "Short (2–3 hours)", text: "About 2–3 hours of play: 4 scenes, 2 combat encounters (one is the climax) and 1 major social or exploration challenge." },
        { id: "standard", label: "Standard (3–4 hours)", text: "About 3–4 hours of play: 5 scenes, 2–3 combat encounters including the climax, plus at least 1 social and 1 exploration or puzzle challenge." },
        { id: "long", label: "Long (4–5 hours)", text: "About 4–5 hours of play: 6–7 scenes, 3–4 combat encounters including the climax, plus 1 optional scene clearly marked as cuttable for time." }
      ]
    },
    {
      key: "difficulty", label: "Difficulty", hint: "How dangerous it should be",
      def: "standard",
      options: [
        { id: "gentle", label: "Gentle", text: "Forgiving. Most fights are low difficulty, the climax is moderate. Death is unlikely; offer retreats and second chances." },
        { id: "standard", label: "Standard", text: "A fair challenge. Most fights are moderate, the climax is high difficulty. Resources should feel stretched by the end." },
        { id: "hard", label: "Hard", text: "Demanding. Fights are moderate-to-high, the climax pushes to the top of the budget. Smart tactics matter." },
        { id: "deadly", label: "Deadly", text: "Unforgiving. Encounters at or above the highest budget; character death is a real possibility and the players should know it." }
      ]
    },
    {
      key: "focus", label: "Play Style", hint: "Which pillar of play to emphasise",
      def: "balanced",
      options: [
        { id: "balanced", label: "Balanced", text: "An even mix of combat, roleplay and exploration." },
        { id: "combat", label: "Combat-heavy", text: "Lean into tactical fights with interesting terrain, enemy tactics and dynamic objectives beyond 'kill everything'." },
        { id: "roleplay", label: "Roleplay-heavy", text: "Lean into memorable NPCs, negotiation, moral choices and character moments; fewer but meaningful fights." },
        { id: "exploration", label: "Exploration-heavy", text: "Lean into discovery: environmental storytelling, hazards, secrets, hidden areas and the joy of the unknown." },
        { id: "puzzle", label: "Puzzles & Investigation", text: "Lean into riddles, clues and deduction. Every puzzle must be solvable by the players, with hints available via checks." }
      ]
    },
    {
      key: "opening", label: "Opening", hint: "How the first scene kicks off",
      def: "ai",
      options: [
        AI,
        { id: "medias", label: "In medias res", text: "Open mid-action: the characters are already in danger in the first minute, with context revealed after." },
        { id: "patron", label: "A patron's request", text: "A patron with a personal stake hires the party, with a twist on the usual job offer." },
        { id: "captured", label: "Already captured", text: "The party starts captured or trapped and must escape before the main plot unfolds." },
        { id: "arrival", label: "Arriving on the scene", text: "The party arrives somewhere just as something goes very wrong." },
        { id: "invite", label: "A mysterious invitation", text: "Each character has received the same mysterious invitation and meets at the destination." },
        { id: "aftermath", label: "The aftermath", text: "The disaster has already happened; the party arrives to pick up the pieces and find out why." }
      ]
    },
    {
      key: "twist", label: "Plot Twist", hint: "Should there be a reveal?",
      def: "one",
      options: [
        { id: "one", label: "Yes, one good twist", text: "Include exactly one plot twist that recontextualises earlier events. Foreshadow it at least twice so it feels earned, not random." },
        { id: "ai", label: "Only if it helps", text: "Include a twist only if it genuinely strengthens the story; otherwise keep the plot straightforward." },
        { id: "none", label: "No twist", text: "No plot twist. Keep the story straightforward and let the drama come from the challenge." }
      ]
    },
    {
      key: "rating", label: "Content Rating", hint: "Who's at the table",
      def: "teen",
      options: [
        { id: "family", label: "Family-friendly", text: "Suitable for children: peril without gore, defeated foes flee or are knocked out, no frightening body horror." },
        { id: "teen", label: "Teen", text: "Suitable for teens: real danger and death, violence described without graphic detail." },
        { id: "mature", label: "Mature", text: "Adult themes allowed (dark subject matter, moral horror), but no gratuitous gore or sexual content." }
      ]
    },
    {
      key: "experience", label: "Players' Experience", hint: "How familiar the players are with the game",
      def: "mixed",
      options: [
        { id: "new", label: "New players", text: "Mostly new players. Keep rules light, explain choices clearly, signpost what can be interacted with, and teach mechanics through play." },
        { id: "mixed", label: "Mixed table", text: "A mix of new and experienced players. Offer depth for veterans without leaving newcomers behind." },
        { id: "veteran", label: "Veterans", text: "Experienced players. Subvert tropes, reward system mastery and clever thinking, and don't over-explain." }
      ]
    }
  ];

  const ancestries = ["Human", "Elf", "Dwarf", "Halfling", "Gnome", "Half-Elf", "Half-Orc", "Orc", "Tiefling", "Dragonborn", "Aasimar", "Goliath"];
  const classes = ["Barbarian", "Bard", "Cleric", "Druid", "Fighter", "Monk", "Paladin", "Ranger", "Rogue", "Sorcerer", "Warlock", "Wizard", "Artificer"];
  const sampleNames = ["Thorne Ashwood", "Vex Marrowind", "Isolde Brightwater", "Grum Stonefist", "Pip Underbough", "Seraphine Vael", "Kael Duskmantle", "Nim Copperkettle", "Brann Ironvein", "Lyra Moonshadow"];

  return { fields, ancestries, classes, sampleNames };
})();

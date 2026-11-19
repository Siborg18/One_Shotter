/* One Shotter — prompt builder.
 * buildPrompt(state) -> string
 * The template carries fixed "design context" (principles + output format)
 * so that any capable LLM produces adventures with a consistent shape.
 */
window.OS_buildPrompt = function (state) {
  const D = window.OS_DATA;
  const pick = (key) => {
    const f = D.fields.find((x) => x.key === key);
    const id = (state.values && state.values[key]) || f.def;
    return f.options.find((o) => o.id === id) || f.options.find((o) => o.id === f.def) || f.options[0];
  };
  const v = {};
  D.fields.forEach((f) => (v[f.key] = pick(f.key)));

  const n = parseInt(v.size.id, 10) || 4;
  const chars = (k) => k + (k === 1 ? " character" : " characters");
  // Only the first n seats count; a seat is "provided" if it's set to an
  // existing hero and has at least one detail filled in.
  const party = (state.party || [])
    .slice(0, n)
    .filter((c) => c.mode === "existing")
    .map((c) => ({
      name: (c.name || "").trim(),
      ancestry: (c.ancestry || "").trim(),
      cls: (c.cls || "").trim(),
      hook: (c.hook || "").trim()
    }))
    .filter((c) => c.name || c.ancestry || c.cls || c.hook);
  const toCreate = n - party.length;
  const level = v.level.id;
  const sys = v.system.id;
  const statLine =
    sys === "agnostic"
      ? "Describe each threat by role (minion, brute, skirmisher, controller, boss), rough toughness and signature abilities."
      : "Use monsters from the 5e System Reference Document by exact name with their CR, or give a compact custom stat block (AC, HP, speed, key attacks with to-hit and damage, save DC, special traits).";

  const L = [];
  const h = (t) => { L.push("", "# " + t); };

  L.push("You are a veteran tabletop game designer and Dungeon Master. You write tight, original, table-ready one-shot adventures that a DM can run with minimal preparation. Write a complete one-shot adventure from the brief below. Do not ask clarifying questions; make confident creative decisions and deliver the full adventure.");

  h("THE BRIEF");
  L.push("- **Game system:** " + v.system.text);
  L.push("- **Theme — " + v.theme.label + ":** " + v.theme.text);
  L.push("- **Primary location — " + v.location.label + ":** " + v.location.text);
  L.push("- **Tone — " + v.tone.label + ":** " + v.tone.text);
  L.push("- **Antagonist — " + v.villain.label + ":** " + v.villain.text);
  L.push("- **Party:** " + chars(n) + " starting at " + v.level.text);
  L.push("- **Session length:** " + v.length.text);
  L.push("- **Difficulty — " + v.difficulty.label + ":** " + v.difficulty.text);
  L.push("- **Play style — " + v.focus.label + ":** " + v.focus.text);
  L.push("- **Opening — " + v.opening.label + ":** " + v.opening.text);
  L.push("- **Plot twist:** " + v.twist.text);
  L.push("- **Content rating — " + v.rating.label + ":** " + v.rating.text);
  L.push("- **Players:** " + v.experience.text);
  if ((state.avoid || "").trim()) L.push("- **Hard limits (never include):** " + state.avoid.trim());
  if ((state.notes || "").trim()) L.push("- **The DM's own ideas (weave these in prominently):** " + state.notes.trim());

  h("THE PARTY");
  if (party.length) {
    L.push(toCreate
      ? "The party has exactly " + chars(n) + ". The players provided " + party.length + " of them below. Use their names exactly as written, refer to them by name throughout, and never rename them."
      : "These are the player characters. Use their names exactly as written, refer to them by name throughout, and never rename them or add extra player characters.");
    party.forEach((c, i) => {
      const bits = [c.ancestry, c.cls].filter(Boolean).join(" ");
      let line = (i + 1) + ". " + (c.name ? "**" + c.name + "**" : "*Unnamed hero (give them a fitting name)*");
      line += bits ? " — " + bits + "." : " — ancestry and class not specified; choose something that rounds out the party.";
      if (c.hook) line += " Detail from the player: " + c.hook;
      L.push(line);
    });
    if (party.some((c) => !c.ancestry || !c.cls)) {
      L.push("Where ancestry or class is missing, assume a fitting choice, state it once in the Party Hooks section, and keep it consistent.");
    }
    if (toCreate) {
      L.push("Create the remaining " + (toCreate === 1 ? "character" : chars(toCreate)) + " yourself as " + (toCreate === 1 ? "a pregenerated character" : "pregenerated characters") + " (numbered from " + (party.length + 1) + "), with " + (toCreate === 1 ? "an evocative name, an ancestry and class" : "evocative names, ancestries and classes") + " that complement the heroes above and fill any missing roles, plus a one-line personality for " + (toCreate === 1 ? "them" : "each") + ". List " + "them" + " in the Party Hooks section alongside the provided heroes and use them throughout. Do not add any characters beyond these " + n + ".");
    }
  } else {
    L.push("No characters were provided. Create " + n + " pregenerated " + (n === 1 ? "character with an evocative name, an ancestry, a class" : "characters with evocative names, a balanced mix of ancestries and classes,") + " and a one-line personality" + (n === 1 ? "" : " for each") + ". List " + "them" + " in the Party Hooks section and use them throughout.");
  }
  if (n === 1) {
    L.push("This is a solo adventure for a single player. Size every encounter for one character, never let the adventure hinge on one failed roll, and offer an optional NPC companion who can help without stealing the spotlight.");
  } else if (n >= 7) {
    L.push("This is a large party. Account for action economy: favour tougher single foes backed by groups of minions, keep turns moving, and make sure every character still gets a spotlight moment.");
  }

  h("DESIGN PRINCIPLES (follow all of them)");
  [
    "**Fast start.** The first scene grabs the players within five minutes of play. Avoid the cliché of a hooded stranger in a tavern unless you deliberately subvert it.",
    "**Three-act shape.** Act I: hook and inciting incident. Act II: escalating complications and discovery. Act III: climax and resolution. The whole adventure must be completable in one session.",
    "**No dead ends.** Every scene has a clear goal, an obstacle and at least two ways forward. Every essential clue can be found in at least three ways (the Three Clue Rule). The adventure never hinges on a single roll.",
    "**Spotlight every character.** Give each character a personal hook tied to the main plot and at least one moment built around their strengths or backstory. Pay those hooks off in the climax or epilogue.",
    "**A villain with a plan.** The antagonist has a clear motive, a plan, and a timeline of what happens if the party does nothing. Foreshadow or show them before the climax so the final confrontation lands.",
    "**Encounters with purpose.** " + statLine + " Size each fight for " + chars(n) + " at level " + level + " using the stated difficulty. Give every fight a terrain feature, an enemy tactic, and where sensible, a non-combat resolution. Include a one-line note on scaling up or down.",
    "**Read-aloud text.** Boxed text is 2–4 sentences, second person, present tense, sensory and specific. It never dictates what the characters feel, say or do.",
    "**Usable numbers.** Every check has a skill and DC (easy 10, moderate 15, hard 20, adjusted to the scene). Treasure is appropriate for level " + level + ".",
    "**Original and consistent.** Use fresh, pronounceable names (avoid generic names like 'Eldoria'). Keep names, facts and numbers consistent from start to finish. No contradictions.",
    "**Respect the brief.** The theme, tone, location and content rating shape every scene, NPC and description."
  ].forEach((p, i) => L.push((i + 1) + ". " + p));

  h("OUTPUT FORMAT");
  L.push("Write in Markdown using exactly these sections, in this order, with these headings:");
  L.push("");
  L.push("## 1. Title & Pitch\nAn evocative title, then a two-sentence pitch the DM could read to the players.");
  L.push("## 2. At a Glance\nA table with: System, Party level, Party size, Length, Theme, Tone, Location, Antagonist, Difficulty.");
  L.push("## 3. DM Background\nThe hidden truth: what is really going on, who wants what, and the antagonist's timeline if the party does nothing.");
  L.push("## 4. Party Hooks\nOne short paragraph per character, by name, tying them personally to the adventure.");
  L.push("## 5. The Adventure\nUse `### Act I`, `### Act II` and `### Act III` subheadings. Inside them, number every scene as `#### Scene N: Name` and give each scene these labelled parts:\n- **Goal:** what the party is trying to do\n- **Read-aloud:** boxed text as a Markdown blockquote\n- **What's going on:** DM-only information\n- **Challenges:** checks with skill and DC, hazards, puzzles\n- **Encounter:** creatures, numbers, tactics, terrain, scaling (or \"None\")\n- **Clues & rewards:** what the party can learn or gain\n- **Spotlight:** which character this scene favours and why\n- **Moving on:** how this leads to the next scene, including alternatives");
  L.push("## 6. The Antagonist\nAppearance, motive, personality, a sample line of dialogue, combat tactics, and stats or a stat basis.");
  L.push("## 7. The Twist\nThe reveal, where it is foreshadowed, and how to play it at the table. If there is no twist, write \"None\".");
  L.push("## 8. Climax & Endings\nThe final confrontation in detail, then outcomes for full success, partial success and failure.");
  L.push("## 9. Key NPCs\nA table with: Name, Role, Wants, Secret, Roleplaying tip.");
  L.push("## 10. Treasure & Rewards\nItems, gold and story rewards, including at least one memorable item tied to the adventure.");
  L.push("## 11. DM Quick Reference\nAn encounter summary table, a DC cheat-sheet, and pacing checkpoints (where the party should be at each quarter of the session).");
  L.push("## 12. Safety & Content Notes\nContent the DM should flag to players beforehand, and how to tone it down if needed.");

  h("FINAL INSTRUCTIONS");
  L.push("Write the complete adventure now, about 3,000–5,000 words. Prioritise playability over prose: every section should give the DM something they can use at the table. Begin directly with section 1, with no preamble.");

  return L.join("\n").replace(/^\n+/, "");
};

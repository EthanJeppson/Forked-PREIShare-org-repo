# PREIshare team orientation notes

These notes start from a one-sentence mission and a role list written by the author, then get structured into the sections this team expects. The assistant helped with layout and wording. The ideas are the author’s.

This checkout is still small. The only files verified here are this document and the root `README.md`. No Git commands and no extra folder names are invented below.

## Mission

PREIshare is a standard for sharing and collaborating on a project so someone else can receive an exact, complete copy and does not have to rebuild anything.

In practice that means the team keeps one shared project of record, called **main**, and treats a successful share as: the recipient has the same project, ready to use, not a pile of missing pieces they must reconstruct.

## Workflow mapping

This table maps the author’s role list onto the order of work. It describes what happens, not which commands to type.

| Goal | What “done” looks like | How the work moves |
| --- | --- | --- |
| Share a complete project | The recipient has an exact copy and does not rebuild | Hand over the main project, or a complete copy of it, using the team’s already-built sharing tools |
| Keep main stable while people work | People can work on different parts without editing main directly | Copy main, change the copy, then propose that those changes be added back |
| Work on main together | Everyone can share the same main when that is the chosen mode | Use the pre-built tools on the shared main instead of forking off a copy |
| Accept a change onto main | The group has agreed the change belongs on main | Someone proposes a change → the change is checked against standards or rules → the group reviews it → if allowed, it is incorporated into main |

Two ways of working are both allowed by that list:

1. Everyone works on the same main and shares it with pre-built tools.
2. People copy main, work on different parts, and add those parts back to main only after the proper procedure (or group consensus).

In both ways, main is the project that counts. Copies are for work in progress. Copies are not the record until the group lets them in.

## PR actors

These are the people and places in that structure. “PR” here means a proposed change waiting for review, not a specific button name.

- **Main.** The shared project of record. It is either what everyone works on together, or the source that copies are taken from and later added back to.
- **Copy workers.** People who take a copy of main so they can work on a part. Their job is to change the copy, not to quietly overwrite main.
- **Proposer.** The person who asks for a change to be added to main. They must be able to say what changed and why it should be allowed in.
- **Standards check.** The pass that asks: does this change follow the team’s rules? This can be a person, a checklist, or later an automated check. This checkout does not yet document a specific checker, so this notes file only names the role.
- **Group reviewers.** The people who read the proposed change and decide whether it may be incorporated. Review is a group decision (consensus), not a private “I like it.”
- **Incorporator.** The person (or people) allowed to add an approved change onto main. Adding to main happens after proposal, standards check, and group review — not before.

## Definition of done

A PREIshare share or change is done when all of the following are true:

- The recipient can get an exact, complete copy of the project and does not need to rebuild missing pieces.
- There is a clear main project. People know whether they are working on main or on a copy.
- If work happened on a copy, that work is proposed for main rather than dropped onto main by surprise.
- The proposed change has been checked against the team’s standards or rules.
- The group has reviewed the change and agreed it may be incorporated.
- Only then is the change added to main.
- The notes that describe this process are sentences the author can explain to a teammate in plain speech.

For this first document itself, done also means: the file lives at `docs/onboarding/team-orientation-notes.md`, the required sections are present, and no unverified Git commands or folder names were added.

## Out of scope

This orientation task does not include:

- Rebuilding the project from scratch when a complete copy should have been shared instead.
- Adding work to main without a proposal, a standards check, and group review.
- Treating a personal copy as if it were already main.
- Inventing Git command lists or application folders that are not in this checkout.
- Claiming tools, servers, or checkers exist here when they have not been verified.
- Letting an assistant replace the author’s mission and roles with a different product story.

## AI-use stance

Use a chat assistant as a writing coach, not as the author of record.

1. **Write first.** The author writes the mission and the role or “done” list in their own words.
2. **Ask for structure, not new ideas.** Give the assistant those bullets, the filename `docs/onboarding/team-orientation-notes.md`, and the required sections: mission, workflow mapping table, PR actors, definition of done, out of scope, AI-use stance.
3. **Constrain the draft.** Keep language beginner-friendly. Do not invent Git commands. Do not invent repo folder names that have not been verified.
4. **Rewrite what you cannot explain.** After the draft, any sentence the author could not say to a teammate in plain speech gets rewritten. Those sentences are the ones that fail review later.
5. **Check the files.** Read the saved markdown. Confirm it still matches the author’s mission and roles, not a story the assistant invented.

The assistant may fix layout, headings, and wording. It may not replace the author’s meaning.

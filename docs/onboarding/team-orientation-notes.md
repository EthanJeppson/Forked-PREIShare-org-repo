# PREIshare team orientation notes

Author: Ethan Jeppson
Date: 2026-09-18

## 0. Team repository of record

- **Team repo (upstream):** https://github.com/EdTechForLearning/PREIShare-org-repo
- **My fork:** https://github.com/EthanJeppson/Forked-PREIShare-org-repo
- I contribute by forking this repo and opening pull requests from my fork. I do not push to the team repo directly.

## 1. Product mission (my words)

Handoff means giving someone my work so they can continue. After the handoff,
the other person should be able to open a matching copy and keep going. They
should not have to rebuild any part that was already finished.

PREIshare is that handoff when it is a built-in shortcut inside the tool—not
a zip I packed, not rebuild instructions, and not a view-only link. It is like
the Share button in a school slideshow app: it delivers project files or
settings the recipient can open and edit as their own copy. A screenshot of
settings, or a link that only lets someone look, is not PREIshare.

The three checks I will use before I call something PREIshare:

1. **Ready copy.** The other person gets files or settings they can open and
   use right away—not a description they have to recreate.
2. **Built-in shortcut.** The copy comes from a button, link, or labeled step
   already in the tool or course—not a package I built by hand.
3. **No rebuild-from-scratch.** They do not start from a blank project and
   reconstruct every piece.

A settings-only PREIshare still counts if it hands off settings as a ready
copy through a built-in action. It is narrower, not a different idea.

This team cares about that standard because a teammate who continues tonight
needs a usable copy, not a backpack of loose pages. My job as a new
contributor is to join that handoff loop safely—not to rewrite the shared
project on day one.

## 2. Everyday collaboration → engineering workflow

Everyday picture I already know: I could zip files and email them, or use a
built-in share action. The built-in shortcut is the better choice when the
other person needs to keep working tonight and I do not want them to unpack
and rebuild. It must still deliver what a careful manual copy aims to
provide: a complete, immediately usable project.

| Everyday picture | PREIshare engineering parallel |
| --- | --- |
| The class binder everyone presents from | The shared default branch on the team repository |
| The magic tear-off slip that makes a matching binder | A built-in copy of that project I can open and edit as my own |
| My draft pages before I hand over the slip | My separate line of work with a small change |
| Notes on what I changed in this draft | Short written history of each save |
| Asking a classmate to check the pages before they join the class binder | Opening a pull request so a teammate can review |
| They approve, then the class binder updates | Review passes, then the change can join the shared project |
| A view-only slideshow link | Looking without getting a copy you can continue from (not PREIshare) |
| Zipping files and emailing them | A manual package, not a built-in shortcut (not PREIshare) |

## 3. Actors in a pull-request workflow

- **Contributor (me):** picks a tiny safe change, works on my own ready copy,
  writes down what I did, and answers review questions.
- **Reviewer (teammate or a simulated reviewer):** checks that the change is
  correct, small enough to understand, clearly described, and still a ready
  copy the next person can use.
- **Shared repository:** the team’s source of truth on GitHub. Even if a tool
  would let me edit it directly, the team process is: draft on my copy first,
  review second, then accept onto the shared project.
- **Automation (later):** extra checks may run on the pull request. If those
  checks fail, I treat that as a real blocker, not background noise.

## 4. First-PR definition of done (beginner-safe)

My first reviewed pull request is done only when all of the following are true:

1. **Scoped:** The change is intentionally small (for example these onboarding
   notes)—not a multi-feature rewrite.
2. **Isolated:** I worked on a separate line of work. I did not edit the shared
   default copy directly.
3. **Described:** The pull request says why the change exists, what files
   changed, and how a reviewer can check it.
4. **Reviewable:** A teammate can understand the difference without a meeting.
   Notes capture any decisions or follow-ups.
5. **Verified:** I re-read my own change and fixed obvious mistakes before I
   asked for review.
6. **PREIshare-ready:** After review, the shared project is still a complete
   copy someone else can open and continue from. I used the team’s built-in
   sharing path. I did not leave a zip, a screenshot, a view-only peek, or a
   rebuild-from-scratch gap.
7. **Aligned:** The change matches team conventions I will learn in later
   steps (repo map, AI rules, and best practices).

## 5. Out of scope for the first PR

- Large rewrites, dependency upgrades, or database structure changes
- Secrets, production passwords, or real customer data
- Extra unrelated edits that make the review bigger than it needs to be
- Calling a zip email, a screenshot, rebuild instructions, or a view-only
  link “PREIshare”

## 6. How I will use AI on this team

I will prompt agents in small cycles: understand → plan → prompt → review → refine.

I will not paste secrets into agents. I will not accept agent output I cannot
explain to a teammate in plain speech. If an assistant replaces my meaning
with a different product story, I will put my words back.

On this file, I used an assistant as a writing coach. I supplied the mission:
PREIshare is a built-in shortcut that hands off a ready-to-use copy of project
files or settings so the other person does not rebuild finished work. The
assistant helped with headings and the workflow table. The three PREIshare
checks and the Share-button / no-zip / not-view-only picture are mine from
the course lesson.

Orientation is complete when I can tell a human what PREIshare is, who is in
the pull-request loop, and what “first PR done” means—before I configure
tools or write application code.

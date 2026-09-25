# BWStory — Discover & Profile

React Native (Expo SDK 57, TypeScript) implementation of the **Discover** and **Profile** screens from the
**BWStory** app ([Play Store](https://play.google.com/store/apps/details?id=com.blackcoffer.bnews&hl=en_IN)).

The screens keep BWStory's brand colour (`#143442`) and use a redesigned, short-video social layout. Discover opens into
a full-screen player and a reporter profile, and Profile has a matching own-profile page and an editor:

```
/discover ──tap video──▶ /discover/video ──tap reporter──▶ /discover/video/user
/profile  ──Edit profile──▶ /profile/edit   (Update Account)
```

Search, Create and Stories are placeholder tabs. A reviewer-facing summary, with install steps and a plan for
improvements, is in [docs/submission/BWStory-Submission-Ashika-Mishra.pdf](docs/submission/BWStory-Submission-Ashika-Mishra.pdf).

## Screens

### Discover (`/discover`)
- The BWStory logo, with Activity and Messages buttons (unread badge)
- Stories row: a navy ring means a new story, a grey ring means already watched. Tapping one opens that reporter's latest story.
- Post cards: rounded video cards, and the card most in view plays a muted, looping preview. The author sits in a see-through chip at the top, next to full-screen and more buttons. A see-through action bar at the bottom holds like (with count), comment (with count) and share, plus a save button. A two-line caption expands when tapped.
- Pull to refresh; a custom tab bar with a raised Create button

### Full-screen video (`/discover/video?storyId=…`)
- Plays with sound; tap to pause. It pauses when you leave the screen and shows loading and error states with a retry button.
- A frosted side bar with like, comments, share and save, and a tile that jumps to the next story
- Topic tag, reporter row (opens their profile), Follow, headline, "Read more…", location and date, and a progress line
- A comment bar that stays above the keyboard

### Reporter profile (`/discover/video/user?authorId=…`)
- A cover photo that fades into a dark page, with the name, verified badge and @handle
- Follow (and the follower count updates straight away), message, stats, bio with location, and a grid of the reporter's stories

### Profile (`/profile`) and Update Account (`/profile/edit`)
- Your profile uses the same layout as a reporter's page, with Edit profile and Share buttons, your bio, profession and location.
- The editor lets you change the photo (choose, replace or remove), name, gender (one-tap choice), profession, location, and bio (120-word limit with a live counter).
- Errors show under a field after you leave it or try to save. Saving jumps to the first field with a problem.
- Unsaved changes are protected on every way out: the close button, swipe back and the Android back button.

Likes, follows and saves stay in sync across every screen.

## Security & privacy
| Area | What the app does |
| --- | --- |
| Permissions | Camera, microphone, storage and overlay permissions are blocked in `app.json`. The system photo picker needs no permission. |
| Backups | `android.allowBackup: false`, so app data isn't copied to cloud backups |
| Input | Control, zero-width and bidi-override characters are stripped. Every field (and comments) has length and character rules. |
| Stored data | The profile is saved on the device with AsyncStorage (no secrets). It is re-validated when loaded, so corrupt data falls back to defaults instead of crashing. |
| Route params | `storyId` and `authorId` from deep links are accepted only if they match known records. Anything else shows a "not found" screen. |
| Photos | Only images of 10 MB or less are accepted. The photo is copied into the app's private document folder, and replaced or discarded photo files are deleted. |
| Network | Media URLs must be `https` and on an allow-listed host before they are loaded |
| Secrets | None in the repo. `.env*.local`, signing keys and keystores are git-ignored. |

## Project structure
```
src/
  app/                          Expo Router routes
    _layout.tsx                 fonts, splash screen, providers, stack
    index.tsx                   redirects to /discover
    (tabs)/                     discover, search, create, stories, profile
    discover/video/index.tsx    full-screen player
    discover/video/user.tsx     reporter profile
    profile/edit.tsx            Update Account
  components/
    ui/                         AppText, Avatar, Button, GlassButton, TextField, EmptyState, Toast, …
    social/                     FeedHeader, StoriesRail, FeedPostCard, FeedMedia, ActionRail,
                                CreatorInfo, CommentBar, ProgressLine, VerifiedBadge, Wordmark
    profile/                    ProfilePage, ProfileHero, ProfileIdentity, ProfileActions,
                                ProfileStats, BioCard, StoryGrid, GenderField
    navigation/SocialTabBar     tab bar with the raised Create button
  features/
    social/SocialContext        follow / like / save state shared across screens
    profile/                    validation, storage, ProfileContext, useProfileForm
  data/                         types, sample authors and stories (fictional)
  lib/                          format, haptics, url allow-list
  theme/                        colour, type, spacing tokens (brand #143442)
```

## Run locally
```bash
npm install
npx expo start          # scan the QR code with Expo Go (every native module used is included in Expo Go)
npm run typecheck
npm run lint
```

## Build the APK
The APK is built in the cloud with EAS, so you don't need Android Studio or a JDK installed:
```bash
npx eas-cli login                                   # one time, free Expo account
npx eas-cli build -p android --profile preview      # outputs an installable .apk
```
When the build finishes, EAS prints a download link and a QR code for the `.apk`.

## Git workflow
Each piece of work was built on its own branch and merged into `main` with `--no-ff`:
`feature/app-setup` → `feature/ui-components` → `feature/discover-screen` → `feature/profile-screen` →
`docs/readme-and-build` → `design/v3-social` (the current design).
The first design, which follows BWStory's layout closely, is kept at the tag **`v1-classic`**.

## Sample content
All names, headlines and numbers are fictional. The videos are public test clips from test-videos.co.uk, and the cover images come from picsum.photos.

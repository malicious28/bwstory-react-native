# BWStory — Discover & Profile

React Native (Expo SDK 57, TypeScript) implementation of two screens from the **BWStory** app
([Play Store](https://play.google.com/store/apps/details?id=com.blackcoffer.bnews&hl=en_IN)):

- **Discover** — a feed of short video news stories
- **Profile** — the *Update Account* screen

The other bottom tabs (Nearby, Create, Notifications) are placeholders.

## Screens

### Discover
- Brand header with menu, search (headline / author / place) and a category filter toggle
- Category chips: All, Local, India, Business, Tech, Sports
- Story cards with the author, a Follow button, video, date · location | views, the headline (tap to expand the summary), and like, comment and share buttons
- Video: only the most visible card plays. Playback starts muted, and tapping shows controls that auto-hide after 2.5 s: back/forward 10 s, play/pause and mute. A timecode and red progress bar sit at the bottom. There are loading and error states with a retry button, and playback pauses when you switch tabs.
- Pull to refresh, an empty state with a "Clear filters" button, and haptic feedback on follow and like

### Profile (Update Account)
- Cover photo with a floating camera button (choose, replace or remove a photo)
- Fields: Name, Gender (one-tap chips), Location, Profession, and Bio with a live word counter (120 words max)
- Errors appear under a field once you leave it, or when you try to save. Saving jumps to the first field with an error.
- Save from **Update Account** in the header or from the button at the bottom of the form. Going back with unsaved edits asks before discarding them.
- The form scrolls to keep the focused field above the keyboard, and your saved photo appears in the tab bar

## Security & privacy
| Area | What the app does |
| --- | --- |
| Permissions | Camera, microphone, storage and overlay permissions are blocked in `app.json`. The system photo picker needs no permission. |
| Backups | `android.allowBackup: false`, so app data isn't copied to cloud backups |
| Input | Control, zero-width and bidi-override characters are stripped. Every field has length and character rules. |
| Stored data | The profile is saved on the device with AsyncStorage (no secrets). It is re-validated when loaded, so corrupt data falls back to defaults instead of crashing. |
| Photos | Only images of 10 MB or less are accepted. The photo is copied into the app's private document folder, and replaced or discarded photo files are deleted. |
| Network | Media URLs must be `https` and on an allow-listed host before the player loads them |
| Secrets | None in the repo. `.env*.local`, signing keys and keystores are git-ignored. |

## Project structure
```
src/
  app/                      Expo Router routes
    _layout.tsx             fonts, splash screen, providers
    (tabs)/                 index (Discover), profile, nearby, create, notifications
  components/
    ui/                     AppText, AppHeader, Avatar, Button, Chip, IconButton, TextField, EmptyState, Toast
    discover/               DiscoverHeader, CategoryTabs, StoryCard, StoryAuthorRow, StoryVideo,
                            VideoProgressBar, StoryMeta, StoryHeadline, StoryActions
    profile/                ProfileCover, GenderField, ProfileTabIcon
  features/
    discover/useStoryFeed   search, filter, follow/like and refresh state
    profile/                validation, storage, ProfileContext, useProfileForm
  data/                     types + sample stories (fictional)
  lib/                      format, haptics, url allow-list
  theme/                    colour, type, spacing tokens (brand #143442)
```

## Run locally
```bash
npm install
npx expo start          # then press "a" for Android (needs a development build, see below)
npm run typecheck
npm run lint
```
The app uses native modules (expo-video, react-native-keyboard-controller, reanimated), so use a development build rather than Expo Go:
`npx eas-cli build -p android --profile development`.

## Build the APK
The APK is built in the cloud with EAS, so you don't need Android Studio or a JDK installed:
```bash
npx eas-cli login                                   # one time, free Expo account
npx eas-cli build -p android --profile preview      # outputs an installable .apk
```
When the build finishes, EAS prints a download link and a QR code for the `.apk`.

## Git workflow
Each piece of work was built on its own branch and merged into `main` with `--no-ff`:
`feature/app-setup` → `feature/ui-components` → `feature/discover-screen` → `feature/profile-screen` → `docs/readme-and-build`.

## Sample content
All names, headlines and numbers are fictional. The videos are public test clips from test-videos.co.uk, and the cover images come from picsum.photos.

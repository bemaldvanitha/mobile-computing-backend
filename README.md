**Name:** bemal_dvanitha  
**Student ID:** MSc-CS-2025-026  
**Module:** COSC 64173 — Mobile Computing  
**Assignment:** 01  
**Department of Statistics & Computer Science, University of Kelaniya**

**Demonstration video:** paste a public unlisted YouTube link, or a Google Drive link that anyone can open, on the line below before you submit this repository to eKel.

**Video link:** PASTE_YOUR_LINK_HERE

---

## What this application is

**Ceylon Trails** is a pocket guide to ten Sri Lankan places that are realistic weekend or overnight trips from the University of Kelaniya. The problem it solves is a short, concrete one: travel lists on the internet are long and vague, so it is easy to “save” a place in your head and then forget the season, the travel time, and the one thing you actually needed to know on the day.

Each trail is hard-coded with a real region, a category, how long it takes to get there from Kelaniya, when to go, how long to allow, and a practical tip. You can filter the list, open a detail screen, save a place onto a shortlist, and get a local notification so the save is not only a change of colour on a button.

The shortlist is held in shared React state. Saving Sigiriya on the detail screen makes it appear on the Favorites tab without fetching anything. Leaving the app and coming back is recorded with the React Native `AppState` API, so you can see that the shortlist survived a trip to the background.

## Screens

There are four screens.

| Screen | Route | Purpose |
| --- | --- | --- |
| Explore | `app/(tabs)/index.js` | Home tab. Shows all ten trails in a `FlatList`, with travel copy and a filter button. Saving a trail from here also fires a local notification. |
| Favorites | `app/(tabs)/favorites.js` | Second tab. Shows only the trails currently in the shared shortlist. Removing one asks for confirmation in a modal. The tab badge is the shortlist count. |
| Trail log | `app/(tabs)/log.js` | Third tab. Explains and displays `AppState` resumes (background or inactive, then active). Also has a button that schedules a local notification five seconds ahead. |
| Trail details | `app/place/[id].js` | Stack screen opened from a card. Full description, the four practical facts, photo credit, save, remove, a five-second reminder, and a Back control. |

Two modals sit on top of these screens. They are not separate routes.

- **Filter modal** (`components/FilterModal.js`) filters Explore by category and region.
- **Confirm modal** (`components/ConfirmModal.js`) asks before a trail is removed from the shortlist.

## React Native components

| Component | Where it is used |
| --- | --- |
| `View` | Screen shells, cards, the filter sheet, the confirm dialog, fact rows, and the resume banner. |
| `Text` | Titles, the hard-coded trail copy, filter chips, empty states, and the AppState banner. |
| `Image` | Thumbnail on every card (`components/PlaceCard.js`) and the hero on the detail screen. Files live in `assets/places/`. |
| `Pressable` | Opening a trail, saving, removing, applying a filter, dismissing the banner, going back, and scheduling a reminder. |
| `FlatList` | Explore renders the hard-coded `places` array. Favorites renders the same records after they have been saved. |
| `Modal` | Filter sheet on Explore, and the remove confirmation on Explore, Favorites, and the detail screen. Android back dismisses them through `onRequestClose`. |
| `AppState` | `context/PlacesContext.js`. The listener treats a change from `inactive` or `background` into `active` as a return to the app. |
| `ScrollView` | Detail screen and Trail log, so the longer copy can move. |

Shared state uses `useState` inside `PlacesProvider`. Screens read it with the `usePlaces()` hook, which is why a favorite added on one screen is already on the others. The values are the shortlist ids, the active category, the active region, the resume banner text, and the resume log. Nothing is written to disk: leaving the app with the Home button keeps the state, which is what the AppState demo needs; force-quitting the process clears it.

## Expo Router layout

File-based routes live in `app/`. The root is a stack. The three tabs are a nested layout, and the detail screen is a stack screen beside the tabs, so the header back button returns to the tab you came from.

```
app/
  _layout.js            Root stack. Wraps the app in PlacesProvider.
  (tabs)/
    _layout.js          Tab navigator: Explore, Favorites, Trail log.
    index.js            Explore
    favorites.js        Favorites
    log.js              Trail log
  place/
    [id].js             Detail stack screen, for example /place/sigiriya
```

`package.json` sets `"main": "expo-router/entry"`. `app.json` registers the `expo-router` plugin and the `ceylontrails` scheme.

Back navigation is the stack header arrow plus a Back pressable on the detail screen (`router.back()`). Filter and confirm modals dismiss with their buttons and with the Android back gesture (`onRequestClose`).

## Local notifications

I followed the current `expo-notifications` guide for Expo SDK 58 rather than the older `trigger: { seconds: 5 }` shape, which this SDK rejects.

What the code does, in `lib/notifications.js`:

1. `setNotificationHandler` tells the OS to show a banner, keep the notification in the list, and play a sound while the app is open. Without this handler a scheduled notification can fire and still not appear.
2. On Android, `setNotificationChannelAsync` creates a channel named Ceylon Trails. Android 8 and later drop notifications that have no channel.
3. `getPermissionsAsync` / `requestPermissionsAsync` ask before the first schedule. iOS and Android 13 will not show anything until that permission is granted.
4. Saving a trail calls `scheduleNotificationAsync` with `trigger: null`, which this SDK defines as “deliver now”.
5. “Remind me in 5 seconds” uses a time-interval trigger:

```js
{
  type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
  seconds: 5,
  channelId: 'trails',
}
```

The same helper is used from Explore (immediate, on save), the detail screen (immediate on save, and the 5-second reminder), and Trail log (the 5-second reminder, aimed at whatever you saved first, or Sigiriya if the shortlist is empty).

Web has no system notification tray, so the helpers refuse to schedule there and the screen tells you to use Expo Go. Record the notification part of the demo on a phone.

## How to run it

You need **Node.js 22.13 or newer**. Expo SDK 58 does not start on Node 20. If you use nvm-windows:

```bash
nvm use 22.17.1
node -v
```

Clone, install, and start:

```bash
git clone https://github.com/bemaldvanitha/mobile-computing-backend.git
cd mobile-computing-backend
npm install
npx expo start
```

Then:

1. Install **Expo Go** on your phone and update it so it supports SDK 58.
2. Scan the QR code from the terminal. Phone and computer need to be on the same network.
3. When the app asks, allow notifications. Saving a place, or tapping **Remind me in 5 seconds**, is the notification demo.
4. For AppState, press Home (or switch apps), wait a moment, and open Ceylon Trails again. A banner appears on the current screen, and Trail log gains a timestamp.

`npm run web` opens a browser build. Use it to click through tabs, filters, and the shortlist. The browser will not show a real notification or a reliable background/foreground event.

## What to show in the demonstration video

The marker asked for a screen recording, which you are adding yourself. A suggested order:

1. Scroll Explore and read out a few real values (name, region, time from Kelaniya).
2. Open the filter modal, choose Wildlife or Hill Country, and show the list shrink.
3. Open a detail screen and use Back.
4. Save a place, then open Favorites and show the same place, including the tab badge.
5. Remove it and cancel once, then confirm, so the modal is visible.
6. On Trail log, press Home and return. Show the banner and the new timestamp.
7. Tap **Remind me in 5 seconds**, leave the app, and show the notification arriving.
8. Paste the public link into **Video link** at the top of this file and push that change to `main`.

## Data and photographs

Trail text is original and hard-coded in `data/places.js`. Photographs are stored in `assets/places/` and credited on each detail screen. They are Wikimedia Commons files used under the licence named in that credit line.

## Submission checklist

- Source is the Expo JavaScript project in this repository.
- Name and student ID are at the top of this file.
- Push the final code to the **main** branch.
- Replace `PASTE_YOUR_LINK_HERE` with the public video link before the eKel deadline on **18 November 2026**.

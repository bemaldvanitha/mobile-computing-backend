**Name:** bemal_dvanitha  
**Student ID:** MSc-CS-2025-026  
**Module:** COSC 64173 — Mobile Computing  
**Assignment:** 01  
**Department of Statistics & Computer Science, University of Kelaniya**

**Demonstration video:** paste a public unlisted YouTube link, or a Google Drive link that anyone can open, on the line below before you submit this repository to eKel.

**Video link:** PASTE_YOUR_LINK_HERE

---

## What this application is

**Ceylon Trails** is a weekend planner for thirty Sri Lankan places you can actually reach from Colombo. A saved name is not a plan. The shortlist is a wishlist only. A trip is a separate list you build on purpose, then tick off before you leave.

Each place is hard-coded with a region, category, travel time, season, ticket, typical extra, and a bus fare from Colombo. Costs live in `data/costs.js`. The trip total in `lib/plan.js` adds tickets and extras, uses the single furthest bus fare, and splits one room (Rs 8,000 a night, plus Rs 1,500 for each person beyond two) across the group. A Yala, Udawalawe, or Minneriya jeep is Rs 10,000 for the vehicle, also split by the group.

A notification is sent only when a trip is created, and again if you tap **Remind me about this trip**. Saving a place does not notify. Returning from the background shows a banner that names the trip you were planning, which is the `AppState` behaviour.

## Screens

There are seven screens.

| Screen | Route | Purpose |
| --- | --- | --- |
| Explore | `app/(tabs)/index.js` | Search the thirty places, filter by category and region, sort by travel time, and save to the shortlist. |
| Trips | `app/(tabs)/trips.js` | Lists weekends you have created, with dates, places, and the calculated cost. |
| Shortlist | `app/(tabs)/favorites.js` | Places saved from Explore. Removing one asks for confirmation. The tab badge is the count. |
| Place | `app/place/[id].js` | Full description, money, save to the wishlist, or add to an existing trip. Starting a new trip opens the three-step builder at step 1. |
| Build a route | `app/trip/new.js` | Three steps every time: direction, length and Saturday, then a suggestion. Stops are added with a button. **Create trip** opens the trip you just made. |
| Trip plan | `app/trip/[id].js` | Move places between days, edit the length, tick a checklist that follows those places, add your own tasks, edit the note, see the budget, send a reminder, or delete the trip. |
| Add places | `app/trip/pick.js` | Search the guide and add or remove places on a chosen day. Adding a place does not put it on the shortlist. |

Modals, not extra routes:

- **Filter modal** on Explore.
- **Confirm modal** before a shortlist removal or a trip deletion.
- **Trip picker** on a place, when you add it to a weekend you already created.

## React Native components

| Component | Where it is used |
| --- | --- |
| `View` | Screen shells, cards, the filter sheet, the confirm dialog, fact rows, and the resume banner. |
| `Text` | Titles, the hard-coded trail copy, filter chips, empty states, and the AppState banner. |
| `Image` | Thumbnail on every card (`components/PlaceCard.js`) and the hero on the detail screen. Files live in `assets/places/`. |
| `TextInput` | Search on Explore and on Add places. Trip name, note, and the note on an existing trip. |
| `Pressable` | Saving, filtering, sorting, creating a trip, moving a place between days, ticking the checklist, and sending a reminder. |
| `FlatList` | Explore, Trips, Shortlist, and Add places. |
| `Modal` | Filter sheet, remove confirmation, and the “add to a trip” sheet. Android back dismisses them through `onRequestClose`. |
| `AppState` | `context/PlacesContext.js`. A change from `inactive` or `background` into `active` shows a banner naming the current trip or the shortlist. |
| `ScrollView` | Place, new trip, and trip plan. |

Shared state is `useState` inside `PlacesProvider`. Every screen reads it with `usePlaces()`, so a place saved on Explore is already on Shortlist, and a place added on the trip plan changes the cost on the Trips tab. Nothing is written to disk: Home and return keeps it; force-quitting clears it.

## Expo Router layout

File-based routes live in `app/`. The root is a stack. Explore, Trips, and Shortlist are a nested tab layout. Place, new trip, trip plan, and add-places sit on the stack beside the tabs, so the header back button returns to the tab you came from.

```
app/
  _layout.js            Root stack. Wraps the app in PlacesProvider.
  (tabs)/
    _layout.js          Tabs: Explore, Trips, Shortlist.
    index.js            Explore
    trips.js            Trips
    favorites.js        Shortlist
  place/
    [id].js             Place, for example /place/sigiriya
  trip/
    new.js              New trip
    [id].js             Trip plan
    pick.js             Add places, opened with ?tripId=
```

`package.json` sets `"main": "expo-router/entry"`. `app.json` registers the `expo-router` plugin and the `ceylontrails` scheme.

Back navigation is the stack header chevron. On the route builder the same chevron steps back through the three steps, and leaves the builder from step 1. Filter and confirm modals dismiss with their buttons and with the Android back gesture (`onRequestClose`).

## Local notifications

I followed the current `expo-notifications` guide for Expo SDK 58 rather than the older `trigger: { seconds: 5 }` shape, which this SDK rejects.

What the code does, in `lib/notifications.js`:

1. `setNotificationHandler` tells the OS to show a banner, keep the notification in the list, and play a sound while the app is open.
2. `getPermissionsAsync` / `requestPermissionsAsync` run before the first schedule.
3. The reminder uses a time-interval trigger of a few seconds, so you can leave the app and still see it arrive:

```js
{
  type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
  seconds: 5,
}
```

`setNotificationChannelAsync` is intentionally not called. On Android Expo Go that method throws `ExpoNotificationChannelManager.setNotificationChannelAsync` with a `NullPointerException`, which was taking down the screen. Scheduling uses the default channel, and any failure is caught and shown as text on the trip instead of a red error.

**Create trip** and **Remind me about this trip** are the only buttons that schedule a notification. Record that notification on a phone. The browser has no notification tray.

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
3. When the app asks, allow notifications. Create a trip, or open one and tap **Remind me about this trip**.
4. For AppState, press Home, then open Ceylon Trails again. A banner on the current screen names the trip or the shortlist.

`npm run web` opens a browser build. Use it to click through tabs, filters, and the shortlist. The browser will not show a real notification or a reliable background/foreground event.

## What to show in the demonstration video

The marker asked for a screen recording, which you are adding yourself. A suggested order:

1. Search Explore, then filter to Wildlife or Hill Country, and read a few real values.
2. Open a place, save it, and show it on Shortlist with the tab badge.
3. Plan a weekend through all three steps. Add the suggested stops with the button, create the trip, and show that you land on that trip. Move one place to day 2.
4. Show the cost change, and tick a checklist row.
5. Remove a shortlist place and cancel once, then confirm, so the modal is visible.
6. Press Home and come back. Show the welcome banner.
7. Tap **Remind me about this trip**, leave the app, and show the notification.
8. Paste the public link into **Video link** at the top of this file and push that change to `main`.

## Data and photographs

Trail text is original and hard-coded in `data/places.js`. Photographs are stored in `assets/places/` and credited on each detail screen. They are Wikimedia Commons files used under the licence named in that credit line.

## Submission checklist

- Source is the Expo JavaScript project in this repository.
- Name and student ID are at the top of this file.
- Push the final code to the **main** branch.
- Replace `PASTE_YOUR_LINK_HERE` with the public video link before the eKel deadline on **18 November 2026**.

**Name:** bemal_dvanitha  
**Student ID:** MSc-CS-2025-026  
**Module:** COSC 64173 — Mobile Computing  
**Assignment:** 01  
**Department of Statistics & Computer Science, University of Kelaniya**

**Video link:** https://youtube.com/shorts/sN2QHX066ws?si=W8O-HsB6SemRro-Z

## What this application is

**Ceylon Trails** plans a weekend trip from Colombo. The problem it solves is that a saved place is not a plan: you need a date, a route that fits the days you have, and a cost you can check before you leave.

Thirty Sri Lankan places are hard-coded with a region, category, travel time, season, ticket, typical extra, and a bus fare from Colombo. The shortlist is a wishlist. A trip is a separate list. Creating a trip, or tapping **Remind me about this trip**, sends a local notification. Returning from the background shows a banner that names the current trip or the shortlist.

## Screens

There are seven screens.

| Screen | Route | Purpose |
| --- | --- | --- |
| Explore | `app/(tabs)/index.js` | Search the places, filter by category and region, sort by travel time, and save to the shortlist. |
| Trips | `app/(tabs)/trips.js` | Lists the weekends you have created, with dates, places, and the calculated cost. |
| Shortlist | `app/(tabs)/favorites.js` | Places saved from Explore. Removing one asks for confirmation. The tab badge is the count. |
| Place | `app/place/[id].js` | Full description, money, save to the shortlist, or add to an existing trip. |
| Build a route | `app/trip/new.js` | Three steps: direction, length and Saturday, then a suggestion you add with a button. **Create trip** opens that trip. |
| Trip plan | `app/trip/[id].js` | Move places between days, tick the leaving checklist, see the budget, send a reminder, or delete the trip. **Home** returns to Explore. |
| Add places | `app/trip/pick.js` | Search the guide and add or remove places on a chosen day. |

Modals, not extra routes: the filter sheet on Explore, the confirm dialog before a removal, and the trip picker on a place.

## React Native components

| Component | Where it is used |
| --- | --- |
| `View` | Screen shells, cards, the filter sheet, the confirm dialog, fact rows, and the resume banner. |
| `Text` | Titles, the hard-coded trail copy, filter chips, empty states, and the AppState banner. |
| `Image` | Thumbnail on every card and the hero on the detail screen. |
| `TextInput` | Search on Explore and Add places. Trip name and the trip note. |
| `Pressable` | Saving, filtering, creating a trip, moving a place between days, ticking the checklist, and sending a reminder. |
| `FlatList` | Explore, Trips, Shortlist, and Add places. |
| `Modal` | Filter sheet, remove confirmation, and the add-to-a-trip sheet. Android back dismisses them through `onRequestClose`. |
| `AppState` | `context/PlacesContext.js`. A change from `inactive` or `background` into `active` shows a banner naming the current trip or the shortlist. |
| `ScrollView` | Place, new trip, and trip plan. |

Shared state is `useState` inside `PlacesProvider`. Every screen reads it with `usePlaces()`, so a place saved on Explore is already on Shortlist, and a place added on a trip changes the cost on the Trips tab.

## Expo Router layout

File-based routes live in `app/`. The root is a stack. Explore, Trips, and Shortlist are a nested tab layout. Place, new trip, trip plan, and add-places sit on that stack, so the header back chevron returns to the screen you came from.

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

`package.json` sets `"main": "expo-router/entry"`. On the route builder the header chevron steps back through the three steps, and leaves the builder from step 1.

## Local notifications

I used the Expo SDK 58 `expo-notifications` guide, not the older `trigger: { seconds: 5 }` shape, which this SDK rejects.

In `lib/notifications.js`:

1. `setNotificationHandler` shows a banner, keeps the notification in the list, and plays a sound while the app is open.
2. `getPermissionsAsync` and `requestPermissionsAsync` run before the first schedule.
3. The reminder uses a time-interval trigger of a few seconds:

```js
{
  type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
  seconds: 5,
}
```

`setNotificationChannelAsync` is not called. On Android Expo Go that method throws `ExpoNotificationChannelManager.setNotificationChannelAsync` with a `NullPointerException`. Scheduling uses the default channel, and any failure is caught and shown as text on the trip.

**Create trip** and **Remind me about this trip** are the only buttons that schedule a notification.

## How to run it

Node.js 22.13 or newer is required. Expo SDK 58 does not start on Node 20.

```bash
git clone https://github.com/bemaldvanitha/mobile-computing-backend.git
cd mobile-computing-backend
npm install
npx expo start
```

Install Expo Go on the phone, scan the QR code, and allow notifications when asked.

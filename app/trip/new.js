import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { usePlaces } from '../../context/PlacesContext';
import { findPlace } from '../../data/places';
import { sendReminder } from '../../lib/notifications';
import { budgetFor, formatIsoDate, formatLkr, formatRange, upcomingWeekends } from '../../lib/plan';
import { alternatesFor, assessRoute, buildFromShortlist, suggestRoute, themes } from '../../lib/routes';
import { colors } from '../../theme/colors';

const LENGTHS = [
  { days: 1, title: 'Saturday only', line: 'Back in Colombo the same night.' },
  { days: 2, title: 'One night away', line: 'Leave Saturday, home Sunday evening.' },
  { days: 3, title: 'Until Monday', line: 'Enough time for a real journey, not a cameo.' },
];

export default function NewTripScreen() {
  const weekends = upcomingWeekends(6);
  const { createTrip, favorites } = usePlaces();

  const [step, setStep] = useState(1);
  const [themeId, setThemeId] = useState(null);
  const [days, setDays] = useState(1);
  const [startDate, setStartDate] = useState(weekends[0]);
  const [proposal, setProposal] = useState(null);
  const [stops, setStops] = useState([]);
  const [blurb, setBlurb] = useState('');
  const [name, setName] = useState('');
  const [nameEdited, setNameEdited] = useState(false);
  const [groupSize, setGroupSize] = useState(2);
  const [error, setError] = useState('');

  function applyRoute(nextTheme, nextDays) {
    const route =
      nextTheme === 'shortlist'
        ? buildFromShortlist(
            favorites.map((place) => place.id),
            nextDays
          )
        : suggestRoute(nextTheme, nextDays);
    setProposal(route);
    setBlurb(route.blurb);
    if (!nameEdited) {
      setName(route.name);
    }
    setStops((current) => current.map((stop) => ({ ...stop, day: Math.min(stop.day, nextDays) })));
    setError('');
  }

  function chooseTheme(nextTheme) {
    setThemeId(nextTheme);
    applyRoute(nextTheme, days);
    setStep(2);
  }

  function chooseDays(nextDays) {
    setDays(nextDays);
    applyRoute(themeId, nextDays);
  }

  function removeStop(id) {
    setStops((current) => current.filter((stop) => stop.placeId !== id));
  }

  function addStop(id, day = 1) {
    setStops((current) => {
      if (current.some((stop) => stop.placeId === id)) {
        return current;
      }
      return [...current, { placeId: id, day: Math.min(day, days) }];
    });
    setError('');
  }

  function addSuggested() {
    if (!proposal) {
      return;
    }
    setStops((current) => {
      const next = [...current];
      proposal.stops.forEach((stop) => {
        if (!next.some((item) => item.placeId === stop.placeId)) {
          next.push({ placeId: stop.placeId, day: Math.min(stop.day, days) });
        }
      });
      return next;
    });
    setError('');
  }

  function save() {
    if (name.trim().length < 2) {
      setError('Give the route a name.');
      return;
    }
    if (stops.length === 0) {
      setError('Add at least one place. The suggestion stays a suggestion until you add it.');
      return;
    }
    const trip = createTrip({
      name,
      startDate,
      days,
      note: blurb,
      stops,
      groupSize,
    });
    const placeNames = stops
      .map((stop) => findPlace(stop.placeId)?.name)
      .filter(Boolean)
      .join(', ');
    void sendReminder({
      title: trip.name,
      body: `${formatRange(trip.startDate, trip.days)}. ${placeNames}.`,
      seconds: 5,
    });
    router.replace({
      pathname: '/trip/[id]',
      params: { id: trip.id },
    });
  }

  const draft = { days, stops, groupSize };
  const budget = budgetFor(draft);
  const verdict = assessRoute(stops, days);
  const extras = themeId && themeId !== 'shortlist' ? alternatesFor(themeId, stops) : [];
  const titles = ['Where to', 'How long', 'The route'];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Stack.Screen
        options={{
          title: titles[step - 1],
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => (step === 1 ? router.back() : setStep(step - 1))}
              accessibilityRole="button"
              accessibilityLabel="Back"
              style={styles.headerBack}
            >
              <Ionicons name="chevron-back" size={28} color={colors.paper} />
            </Pressable>
          ),
        }}
      />
      <View style={styles.progress}>
        {[1, 2, 3].map((item) => (
          <View key={item} style={[styles.progressBar, item <= step && styles.progressOn]} />
        ))}
      </View>
      <Text style={styles.stepLabel}>Step {step} of 3</Text>

      {step === 1 ? (
        <View>
          <Text style={styles.lead}>
            Start from the kind of weekend you can actually finish, not from a blank name.
          </Text>
          {themes.map((theme) => {
            const cover = findPlace(theme.coverId);
            return (
              <Pressable
                key={theme.id}
                onPress={() => chooseTheme(theme.id)}
                style={styles.theme}
                accessibilityRole="button"
              >
                <Image source={cover.image} style={styles.themeImage} />
                <View style={styles.themeCopy}>
                  <Text style={styles.themeTitle}>{theme.title}</Text>
                  <Text style={styles.themeLine}>{theme.line}</Text>
                </View>
              </Pressable>
            );
          })}
          <Pressable
            onPress={() => {
              if (favorites.length === 0) {
                router.push('/');
                return;
              }
              chooseTheme('shortlist');
            }}
            style={styles.shortlist}
            accessibilityRole="button"
          >
            <Text style={styles.themeTitle}>From my shortlist</Text>
            <Text style={styles.themeLine}>
              {favorites.length === 0
                ? 'You have not saved a place yet. Open Explore first.'
                : `${favorites.length} saved. The route keeps the ones a weekend can hold.`}
            </Text>
          </Pressable>
        </View>
      ) : null}

      {step === 2 ? (
        <View>
          <Text style={styles.lead}>The length changes the route. A day trip will not pretend Ella is nearby.</Text>
          {LENGTHS.map((option) => {
            const selected = option.days === days;
            return (
              <Pressable
                key={option.days}
                onPress={() => chooseDays(option.days)}
                style={[styles.length, selected && styles.lengthOn]}
                accessibilityRole="button"
              >
                <Text style={[styles.lengthDays, selected && styles.lengthDaysOn]}>{option.days}</Text>
                <View style={styles.lengthCopy}>
                  <Text style={styles.themeTitle}>{option.title}</Text>
                  <Text style={styles.themeLine}>{option.line}</Text>
                </View>
              </Pressable>
            );
          })}
          <Text style={styles.blurb}>{blurb}</Text>
          <Text style={styles.label}>Which Saturday</Text>
          <View style={styles.chips}>
            {weekends.map((iso) => {
              const selected = iso === startDate;
              return (
                <Pressable
                  key={iso}
                  onPress={() => setStartDate(iso)}
                  style={[styles.chip, selected && styles.chipOn]}
                  accessibilityRole="button"
                >
                  <Text style={[styles.chipText, selected && styles.chipTextOn]}>{formatIsoDate(iso)}</Text>
                </Pressable>
              );
            })}
          </View>
          <Pressable onPress={() => setStep(3)} style={styles.primary} accessibilityRole="button">
            <Text style={styles.primaryText}>Show the route</Text>
          </Pressable>
        </View>
      ) : null}

      {step === 3 ? (
        <View>
          <TextInput
            value={name}
            onChangeText={(value) => {
              setNameEdited(true);
              setName(value);
              setError('');
            }}
            style={styles.name}
          />
          <Text style={styles.blurb}>{blurb}</Text>
          {proposal?.stops?.length ? (
            <View style={styles.proposal}>
              <Text style={styles.label}>Suggested stops</Text>
              <Text style={styles.proposalNote}>
                Nothing is on the trip until you add it. Change the length and this suggestion changes with it.
              </Text>
              {proposal.stops.map((stop) => {
                const place = findPlace(stop.placeId);
                if (!place) {
                  return null;
                }
                const added = stops.some((item) => item.placeId === stop.placeId);
                return (
                  <View key={stop.placeId} style={styles.stop}>
                    <Image source={place.image} style={styles.stopImage} />
                    <View style={styles.stopCopy}>
                      <Text style={styles.stopName}>{place.name}</Text>
                      <Text style={styles.stopMeta}>
                        Day {stop.day} · {place.region}
                      </Text>
                    </View>
                    {added ? (
                      <Text style={styles.added}>Added</Text>
                    ) : (
                      <Pressable onPress={() => addStop(place.id, stop.day)} accessibilityRole="button">
                        <Text style={styles.add}>Add</Text>
                      </Pressable>
                    )}
                  </View>
                );
              })}
              <Pressable onPress={addSuggested} style={styles.secondary} accessibilityRole="button">
                <Text style={styles.secondaryText}>Add suggested stops</Text>
              </Pressable>
            </View>
          ) : null}
          <Text style={styles.label}>Your route</Text>
          {daysArray(days).map((day) => {
            const dayStops = stops.filter((stop) => stop.day === day);
            return (
              <View key={day} style={styles.day}>
                <Text style={styles.dayTitle}>Day {day}</Text>
                {dayStops.length === 0 ? (
                  <Text style={styles.emptyDay}>Travel, or a day with nowhere named yet.</Text>
                ) : null}
                {dayStops.map((stop) => {
                  const place = findPlace(stop.placeId);
                  if (!place) {
                    return null;
                  }
                  return (
                    <View key={stop.placeId} style={styles.stop}>
                      <Image source={place.image} style={styles.stopImage} />
                      <View style={styles.stopCopy}>
                        <Text style={styles.stopName}>{place.name}</Text>
                        <Text style={styles.stopMeta}>{place.region}</Text>
                      </View>
                      <Pressable onPress={() => removeStop(place.id)} accessibilityRole="button">
                        <Text style={styles.remove}>Remove</Text>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            );
          })}
          {extras.length > 0 ? (
            <View>
              <Text style={styles.label}>Add another stop</Text>
              <View style={styles.chips}>
                {extras.map((id) => (
                  <Pressable key={id} onPress={() => addStop(id)} style={styles.chip} accessibilityRole="button">
                    <Text style={styles.chipText}>{findPlace(id)?.name}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}
          <View style={[styles.verdict, verdict.level === 'good' && styles.verdictGood, verdict.level === 'tight' && styles.verdictTight, verdict.level === 'bad' && styles.verdictBad]}>
            <Text style={styles.verdictTitle}>{verdict.title}</Text>
            <Text style={styles.verdictDetail}>{verdict.detail}</Text>
          </View>
          <Text style={styles.label}>How many of you</Text>
          <View style={styles.stepper}>
            <Pressable
              onPress={() => setGroupSize((current) => Math.max(1, current - 1))}
              style={styles.stepButton}
              accessibilityRole="button"
            >
              <Text style={styles.stepButtonText}>−</Text>
            </Pressable>
            <Text style={styles.stepValue}>{groupSize}</Text>
            <Pressable
              onPress={() => setGroupSize((current) => Math.min(6, current + 1))}
              style={styles.stepButton}
              accessibilityRole="button"
            >
              <Text style={styles.stepButtonText}>+</Text>
            </Pressable>
          </View>
          <Text style={styles.cost}>{formatLkr(budget.total)} each</Text>
          <Text style={styles.costMeta}>
            {formatLkr(budget.groupTotal)} for {groupSize}.{' '}
            {budget.nights > 0
              ? `The room is split ${groupSize} ways.`
              : 'No night away, so there is no room to split.'}{' '}
            {stops.some((stop) => ['yala', 'udawalawe', 'minneriya'].includes(stop.placeId))
              ? 'The safari jeep is Rs 10,000, divided by the group.'
              : 'Bus fare is the furthest place, paid once.'}
          </Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable onPress={save} style={styles.primary} accessibilityRole="button">
            <Text style={styles.primaryText}>
              {stops.length > 0 && verdict.level === 'bad' ? 'Create trip anyway' : 'Create trip'}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </ScrollView>
  );
}

function daysArray(days) {
  return Array.from({ length: days }, (_, index) => index + 1);
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  headerBack: {
    paddingRight: 8,
    paddingVertical: 4,
  },
  proposal: {
    marginTop: 8,
  },
  proposalNote: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  add: {
    color: colors.green,
    fontWeight: '700',
  },
  added: {
    color: colors.gold,
    fontWeight: '700',
  },
  secondary: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  secondaryText: {
    color: colors.green,
    fontWeight: '700',
    fontSize: 15,
  },
  progress: {
    flexDirection: 'row',
    gap: 6,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 99,
    backgroundColor: colors.line,
  },
  progressOn: {
    backgroundColor: colors.green,
  },
  stepLabel: {
    color: colors.gold,
    fontWeight: '700',
    fontSize: 12,
    marginTop: 10,
    letterSpacing: 0.4,
  },
  lead: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
    marginTop: 8,
    marginBottom: 14,
  },
  theme: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
    marginBottom: 10,
  },
  themeImage: {
    width: 96,
    height: 96,
  },
  themeCopy: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 12,
    justifyContent: 'center',
  },
  themeTitle: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '700',
  },
  themeLine: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 19,
    marginTop: 4,
  },
  shortlist: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    marginTop: 4,
  },
  length: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    marginBottom: 10,
  },
  lengthOn: {
    borderColor: colors.green,
    backgroundColor: '#E7F0EA',
  },
  lengthDays: {
    width: 42,
    textAlign: 'center',
    color: colors.green,
    fontSize: 28,
    fontWeight: '700',
  },
  lengthDaysOn: {
    color: colors.greenDark,
  },
  lengthCopy: {
    flex: 1,
  },
  blurb: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
    marginTop: 6,
  },
  label: {
    color: colors.ink,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipOn: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  chipText: {
    color: colors.ink,
    fontWeight: '600',
  },
  chipTextOn: {
    color: colors.paper,
  },
  name: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '700',
    paddingVertical: 4,
  },
  verdict: {
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
  },
  verdictGood: {
    backgroundColor: '#E3EFE6',
  },
  verdictTight: {
    backgroundColor: colors.banner,
  },
  verdictBad: {
    backgroundColor: '#F6E4E0',
  },
  verdictTitle: {
    color: colors.ink,
    fontWeight: '700',
    fontSize: 16,
  },
  verdictDetail: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  day: {
    marginTop: 16,
  },
  dayTitle: {
    color: colors.gold,
    fontWeight: '700',
    fontSize: 13,
  },
  emptyDay: {
    color: colors.muted,
    marginTop: 6,
  },
  stop: {
    marginTop: 8,
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stopImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  stopCopy: {
    flex: 1,
  },
  stopName: {
    color: colors.ink,
    fontWeight: '700',
    fontSize: 16,
  },
  stopMeta: {
    color: colors.muted,
    marginTop: 2,
  },
  remove: {
    color: colors.danger,
    fontWeight: '700',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonText: {
    color: colors.paper,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
  },
  stepValue: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  cost: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '700',
    marginTop: 16,
  },
  costMeta: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  error: {
    color: colors.danger,
    marginTop: 12,
  },
  primary: {
    marginTop: 18,
    backgroundColor: colors.green,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: {
    color: colors.paper,
    fontWeight: '700',
    fontSize: 16,
  },
});

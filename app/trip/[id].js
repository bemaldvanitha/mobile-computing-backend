import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ConfirmModal } from '../../components/ConfirmModal';
import { usePlaces } from '../../context/PlacesContext';
import { findPlace } from '../../data/places';
import { visibleChecks } from '../../lib/checklist';
import { sendReminder } from '../../lib/notifications';
import { budgetFor, formatLkr, formatRange, groupSizeOf } from '../../lib/plan';
import { assessRoute } from '../../lib/routes';
import { colors } from '../../theme/colors';

const DAY_OPTIONS = [1, 2, 3];

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams();
  const tripId = Array.isArray(id) ? id[0] : id;
  const {
    getTrip,
    setTripNote,
    setTripDays,
    setStopDay,
    removeStop,
    toggleCheck,
    addCheck,
    removeCheck,
    deleteTrip,
    setGroupSize,
  } = usePlaces();
  const trip = getTrip(tripId);
  const [confirming, setConfirming] = useState(false);
  const [notice, setNotice] = useState('');
  const [task, setTask] = useState('');

  if (!trip) {
    return (
      <View style={styles.missing}>
        <Stack.Screen options={{ title: 'Trip' }} />
        <Text style={styles.missingTitle}>That trip is gone.</Text>
        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <Text style={styles.link}>Back to trips</Text>
        </Pressable>
      </View>
    );
  }

  const budget = budgetFor(trip);
  const verdict = assessRoute(trip.stops, trip.days);
  const group = groupSizeOf(trip);
  const checks = visibleChecks(trip);
  const done = checks.filter((item) => item.done).length;

  async function remind() {
    const placeNames = trip.stops
      .map((stop) => findPlace(stop.placeId)?.name)
      .filter(Boolean)
      .join(', ');
    const result = await sendReminder({
      title: trip.name,
      body: `${formatRange(trip.startDate, trip.days)}. ${placeNames || 'No places yet.'} About ${formatLkr(budget.total)} per person.`,
      seconds: 5,
    });
    setNotice(
      result.ok
        ? 'Reminder sent. It will show on this phone in a few seconds, including if you leave the app.'
        : result.reason
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen
        options={{
          title: trip.name,
          headerRight: () => (
            <Pressable
              onPress={() => router.dismissTo('/')}
              accessibilityRole="button"
              accessibilityLabel="Home"
              style={styles.homeButton}
            >
              <Ionicons name="home" size={18} color={colors.paper} />
              <Text style={styles.homeText}>Home</Text>
            </Pressable>
          ),
        }}
      />
      <Text style={styles.range}>{formatRange(trip.startDate, trip.days)}</Text>
      <Text style={styles.total}>{formatLkr(budget.total)} each</Text>
      <Text style={styles.split}>
        Tickets and extras {formatLkr(budget.tickets)} · Bus {formatLkr(budget.bus)}
        {budget.nights > 0 ? ` · room share ${formatLkr(budget.lodging)}` : ' · no overnight stay'}
        {` · ${formatLkr(budget.groupTotal)} for ${group}`}
      </Text>
      <View
        style={[
          styles.verdict,
          verdict.level === 'good' && styles.verdictGood,
          verdict.level === 'tight' && styles.verdictTight,
          verdict.level === 'bad' && styles.verdictBad,
        ]}
      >
        <Text style={styles.verdictTitle}>{verdict.title}</Text>
        <Text style={styles.verdictDetail}>{verdict.detail}</Text>
      </View>
      <Text style={styles.section}>People going</Text>
      <View style={styles.stepper}>
        <Pressable
          onPress={() => setGroupSize(trip.id, group - 1)}
          style={styles.stepButton}
          accessibilityRole="button"
        >
          <Text style={styles.stepButtonText}>−</Text>
        </Pressable>
        <Text style={styles.stepValue}>{group}</Text>
        <Pressable
          onPress={() => setGroupSize(trip.id, group + 1)}
          style={styles.stepButton}
          accessibilityRole="button"
        >
          <Text style={styles.stepButtonText}>+</Text>
        </Pressable>
      </View>
      <Text style={styles.split}>
        The room is split by this number. On a Yala, Udawalawe, or Minneriya trip the Rs 10,000 jeep
        is split the same way.
      </Text>
      <Text style={styles.section}>Length</Text>
      <View style={styles.chips}>
        {DAY_OPTIONS.map((option) => {
          const selected = option === trip.days;
          return (
            <Pressable
              key={option}
              onPress={() => setTripDays(trip.id, option)}
              style={[styles.chip, selected && styles.chipOn]}
              accessibilityRole="button"
            >
              <Text style={[styles.chipText, selected && styles.chipTextOn]}>
                {option === 1 ? 'Day trip' : `${option} days`}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.sectionRow}>
        <Text style={styles.section}>Places</Text>
        <Pressable onPress={() => router.push(`/trip/pick?tripId=${trip.id}`)} accessibilityRole="button">
          <Text style={styles.link}>Add</Text>
        </Pressable>
      </View>
      <Text style={styles.split}>Move a place between day 1, day 2, and day 3. A later day lengthens the trip.</Text>
      {trip.stops.length === 0 ? (
        <Text style={styles.empty}>Add at least one place. The bus fare uses the furthest one.</Text>
      ) : (
        DAY_OPTIONS.filter((day) => day <= trip.days).map((day) => {
          const stops = trip.stops.filter((stop) => stop.day === day);
          return (
            <View key={day} style={styles.dayBlock}>
              <Text style={styles.dayTitle}>Day {day}</Text>
              {stops.length === 0 ? <Text style={styles.empty}>Nothing on this day.</Text> : null}
              {stops.map((stop) => {
                const place = findPlace(stop.placeId);
                if (!place) {
                  return null;
                }
                return (
                  <View key={stop.placeId} style={styles.stop}>
                    <Pressable onPress={() => router.push(`/place/${place.id}`)} accessibilityRole="button">
                      <Text style={styles.stopName}>{place.name}</Text>
                      <Text style={styles.stopMeta}>{place.region}</Text>
                    </Pressable>
                    <View style={styles.stopActions}>
                      {DAY_OPTIONS.map((option) => (
                        <Pressable
                          key={option}
                          onPress={() => setStopDay(trip.id, place.id, option)}
                          style={[styles.mini, option === stop.day && styles.miniOn]}
                          accessibilityRole="button"
                        >
                          <Text style={[styles.miniText, option === stop.day && styles.miniTextOn]}>
                            Day {option}
                          </Text>
                        </Pressable>
                      ))}
                      <Pressable
                        onPress={() => removeStop(trip.id, place.id)}
                        accessibilityRole="button"
                      >
                        <Text style={styles.remove}>Remove</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })
      )}
      <Text style={styles.section}>
        Before you leave · {done}/{checks.length}
      </Text>
      <Text style={styles.split}>
        These follow the places on this trip. Tick what is done, or add a task of your own.
      </Text>
      {checks.map((item) => (
        <View key={item.id} style={styles.check}>
          <Pressable
            onPress={() => toggleCheck(trip.id, item)}
            style={styles.checkMain}
            accessibilityRole="button"
          >
            <View style={[styles.box, item.done && styles.boxOn]}>
              {item.done ? <Text style={styles.tick}>✓</Text> : null}
            </View>
            <Text style={[styles.checkLabel, item.done && styles.checkDone]}>{item.label}</Text>
          </Pressable>
          {item.custom ? (
            <Pressable onPress={() => removeCheck(trip.id, item.id)} accessibilityRole="button">
              <Text style={styles.remove}>Remove</Text>
            </Pressable>
          ) : null}
        </View>
      ))}
      <View style={styles.addTask}>
        <TextInput
          value={task}
          onChangeText={setTask}
          placeholder="Add a task, such as who is bringing water"
          placeholderTextColor={colors.muted}
          style={styles.taskInput}
        />
        <Pressable
          onPress={() => {
            addCheck(trip.id, task);
            setTask('');
          }}
          style={styles.addTaskButton}
          accessibilityRole="button"
        >
          <Text style={styles.addTaskText}>Add</Text>
        </Pressable>
      </View>
      <Text style={styles.section}>Note</Text>
      <TextInput
        value={trip.note}
        onChangeText={(value) => setTripNote(trip.id, value)}
        placeholder="Bus time, who is driving, what to carry"
        placeholderTextColor={colors.muted}
        style={styles.note}
        multiline
      />
      <Pressable onPress={remind} style={styles.primary} accessibilityRole="button">
        <Text style={styles.primaryText}>Remind me about this trip</Text>
      </Pressable>
      {notice ? <Text style={styles.notice}>{notice}</Text> : null}
      <Pressable onPress={() => setConfirming(true)} style={styles.danger} accessibilityRole="button">
        <Text style={styles.dangerText}>Delete trip</Text>
      </Pressable>
      <ConfirmModal
        visible={confirming}
        placeName={trip.name}
        title="Delete this trip?"
        message={`${trip.name} will be removed. Places stay on your shortlist.`}
        confirmLabel="Delete"
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          deleteTrip(trip.id);
          setConfirming(false);
          router.replace('/trips');
        }}
      />
    </ScrollView>
  );
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
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingLeft: 8,
  },
  homeText: {
    color: colors.paper,
    fontWeight: '700',
    fontSize: 15,
  },
  range: {
    color: colors.gold,
    fontWeight: '700',
  },
  total: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '700',
    marginTop: 4,
  },
  split: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
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
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 10,
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
  section: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 22,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  link: {
    color: colors.green,
    fontWeight: '700',
    fontSize: 15,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
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
  },
  chipTextOn: {
    color: colors.paper,
    fontWeight: '700',
  },
  empty: {
    color: colors.muted,
    marginTop: 8,
  },
  dayBlock: {
    marginTop: 12,
  },
  dayTitle: {
    color: colors.gold,
    fontWeight: '700',
    fontSize: 13,
  },
  stop: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    marginTop: 8,
  },
  stopName: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  stopMeta: {
    color: colors.muted,
    marginTop: 2,
  },
  stopActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  mini: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  miniOn: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  miniText: {
    color: colors.ink,
    fontWeight: '700',
    fontSize: 12,
  },
  miniTextOn: {
    color: colors.paper,
  },
  remove: {
    color: colors.danger,
    fontWeight: '700',
    marginLeft: 4,
  },
  check: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  checkMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addTask: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  taskInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.ink,
    fontSize: 15,
  },
  addTaskButton: {
    backgroundColor: colors.green,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  addTaskText: {
    color: colors.paper,
    fontWeight: '700',
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  boxOn: {
    backgroundColor: colors.green,
  },
  tick: {
    color: colors.paper,
    fontWeight: '700',
  },
  checkLabel: {
    color: colors.ink,
    fontSize: 15,
    flex: 1,
  },
  checkDone: {
    color: colors.muted,
  },
  note: {
    marginTop: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    color: colors.ink,
    fontSize: 15,
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
  notice: {
    color: colors.greenDark,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  danger: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 10,
  },
  dangerText: {
    color: colors.danger,
    fontWeight: '700',
  },
  missing: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: 'center',
  },
  missingTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '700',
  },
});

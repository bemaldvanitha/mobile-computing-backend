import { morePlaces } from './morePlaces';

export const origin = 'Colombo';

export const categories = ['All', 'Heritage', 'Coast', 'Highland', 'Wildlife'];

export const regions = [
  'All',
  'Cultural Triangle',
  'Hill Country',
  'South Coast',
  'South East',
  'East Coast',
  'West Coast',
  'Wet Zone',
  'North',
];

export const places = [
  {
    id: 'sigiriya',
    name: 'Sigiriya',
    region: 'Cultural Triangle',
    category: 'Heritage',
    summary: 'A fifth-century palace rock. Climb it before the heat sits on the staircases.',
    about:
      'Sigiriya rises out of the dry-zone plain near Dambulla. King Kashyapa built a palace on the summit in the 5th century, and the water gardens at the base are still the way in. The fresco pocket and the mirror wall are halfway up. The summit is a ruin of foundations and a wide view toward the reservoirs.',
    fromOrigin: 'About 4 hours by car or intercity bus, through Kurunegala and Dambulla.',
    bestTime: 'The ticket office opens at 7.00 a.m. Be there then. After 10 a.m. the rock face is in full sun.',
    visitLength: 'Half a day, including the gardens and the climb.',
    tip: 'Take water. The iron steps near the lion paw are one-way at busy times, so you cannot turn around easily.',
    image: require('../assets/places/sigiriya.jpg'),
    photoCredit: 'Jakub Hałun, CC BY 4.0, via Wikimedia Commons',
  },
  {
    id: 'galle',
    name: 'Galle Fort',
    region: 'South Coast',
    category: 'Heritage',
    summary: 'A Dutch fort you can walk in an afternoon, with the rampart as the main street.',
    about:
      'The fort is a living neighbourhood, not a closed monument. Dutch street names, a lighthouse, the old gate, and the Meeran mosque sit inside the walls. The walk that matters is along the rampart from the clock tower to the flag rock, especially after 4.30 p.m. when the breeze comes off the Indian Ocean.',
    fromOrigin: 'About 2 to 2.5 hours on the Southern Expressway. Leave at the Galle exit and follow the fort signs.',
    bestTime: 'Late afternoon. The walls face west, and the cruise-ship crowds thin out after 4 p.m.',
    visitLength: 'Three hours on foot, or a full day if you stay for dinner inside the walls.',
    tip: 'Walking the ramparts is free. The National Museum inside the fort has a separate ticket if you want the Dutch period indoors.',
    image: require('../assets/places/galle.jpg'),
    photoCredit: 'Daibo Taku, CC BY 3.0, via Wikimedia Commons',
  },
  {
    id: 'ella',
    name: 'Nine Arches Bridge',
    region: 'Hill Country',
    category: 'Highland',
    summary: 'The brick viaduct in Ella. Time it so you are on the tea path when a train crosses.',
    about:
      'Nine Arches is a short walk from Ella town, through a lane of guest houses and then onto the railway. The bridge was built in the colonial hill line and still carries the Badulla train. The view people come for is from the path on the tea side, looking back at the curve of brick as the train moves onto it.',
    fromOrigin: 'Train from Colombo Fort to Ella takes most of a day. A bus to Kandy and then the hill train is the usual split.',
    bestTime: 'Late morning, when at least one Colombo–Badulla service crosses. Ask a shop in Ella for that day’s time before you walk down.',
    visitLength: 'An hour at the bridge, plus the walk. Ella itself is an overnight stop, not a day return.',
    tip: 'Stand off the track. The path beside the line is the viewpoint, and the train does not slow down for photographs.',
    image: require('../assets/places/ella.jpg'),
    photoCredit: 'Kaushiru90, CC BY-SA 4.0, via Wikimedia Commons',
  },
  {
    id: 'yala',
    name: 'Yala National Park',
    region: 'South East',
    category: 'Wildlife',
    summary: 'A dawn jeep in Block 1. Elephants are reliable. Leopards are a bonus, not a promise.',
    about:
      'Yala Block 1 is the busiest safari block in the country and still the one most people mean by “Yala”. The park opens at 6.00 a.m. Jeeps go out of Tissamaharama and Kirinda. You are looking for elephant herds near the water holes, painted storks, and, if the tracker is patient, a leopard in a tree. Afternoon tickets exist, but the animals are out in the first hours.',
    fromOrigin: 'About 5 hours. The Southern Expressway to Mattala, then the road through Tissamaharama.',
    bestTime: 'A 6.00 a.m. entry. February to July is the drier window and the tracks are easier.',
    visitLength: 'A half-day jeep. Stay the night in Tissamaharama so you are not driving at 3 a.m. from Colombo.',
    tip: 'Book the jeep the day before and ask for Block 1. Carry cash for the park ticket. There is no food inside the block.',
    image: require('../assets/places/yala.jpg'),
    photoCredit: 'Jonashtand, CC BY-SA 4.0, via Wikimedia Commons',
  },
  {
    id: 'mirissa',
    name: 'Mirissa',
    region: 'South Coast',
    category: 'Coast',
    summary: 'A south-coast beach with whale boats from November to April.',
    about:
      'Mirissa is the beach most Colombo groups actually reach for a weekend. The bay is small, the point at Parrot Rock is a ten-minute walk, and the whale-watching boats leave before sunrise in season. Blue whales are the reason the boats exist. Out of season the beach is the point, and the sea is rougher from May onward.',
    fromOrigin: 'About 2.5 hours on the Southern Expressway, one exit past Galle.',
    bestTime: 'Whale boats run roughly November to April and leave around 6.00 a.m. For swimming only, a weekday morning is quieter.',
    visitLength: 'A day trip for the beach. The boat trip itself is about five hours on the water.',
    tip: 'If you book a whale boat, eat something small before you board and take a tablet if you get seasick. The harbour is not the swimming beach.',
    image: require('../assets/places/mirissa.jpg'),
    photoCredit: 'dronepicr, CC BY 2.0, via Wikimedia Commons',
  },
  {
    id: 'kandy',
    name: 'Temple of the Tooth',
    region: 'Hill Country',
    category: 'Heritage',
    summary: 'Sri Dalada Maligawa, on the Kandy lake. The evening puja is the visit.',
    about:
      'The temple holds the relic of the tooth of the Buddha and is the reason Kandy is a royal city rather than just a hill town. You enter from the lake side, leave your shoes, and walk through a sequence of halls up to the shrine room. The relic itself is not displayed in the open. What you see is the casket room and, if you time it, the puja with drummers in the courtyard.',
    fromOrigin: 'About 3 hours. The highway toward Kegalle, then the climb into Kandy.',
    bestTime: 'The evening puja, around 6.30 p.m. Morning is quieter if you only want the building.',
    visitLength: '90 minutes for the temple. The lake loop outside is another half hour.',
    tip: 'Cover shoulders and knees. Shoes come off at the entrance and are left with an attendant. There is a small fee for cameras.',
    image: require('../assets/places/kandy.jpg'),
    photoCredit: 'A.Savin, Free Art License, via Wikimedia Commons',
  },
  {
    id: 'horton',
    name: "Horton Plains",
    region: 'Hill Country',
    category: 'Highland',
    summary: "World's End is a cliff that vanishes into cloud if you arrive late.",
    about:
      "Horton Plains National Park is a grassland plateau above Nuwara Eliya. The standard walk is a loop of about 9 kilometres past Little World's End, World's End, and Baker's Falls. World's End is an 880-metre drop. On a clear morning you can see across the low country. By 9 a.m. the cloud usually climbs the cliff and the view is gone.",
    fromOrigin: 'Not a day trip. Stay in Nuwara Eliya and leave for the gate by 5.30 a.m. The plains are about an hour from town.',
    bestTime: 'First light, January to March, when the mornings are more often clear.',
    visitLength: 'Three to four hours of walking once you are through the gate.',
    tip: 'It is cold at the gate and warm by the falls. Take a light jacket and do not walk off the marked path. The drop is not fenced all the way along.',
    image: require('../assets/places/horton.jpg'),
    photoCredit: 'Pamuditha2000, CC BY-SA 4.0, via Wikimedia Commons',
  },
  {
    id: 'nilaveli',
    name: 'Nilaveli',
    region: 'East Coast',
    category: 'Coast',
    summary: 'A long Trincomalee beach that is calm when the south coast is rough.',
    about:
      'Nilaveli sits north of Trincomalee. The beach is a straight run of sand with Pigeon Island offshore, a small marine sanctuary you reach by boat in the morning. The east coast season is the opposite of Mirissa: the sea lies down from about May to September. Outside those months the wind picks up and many of the small hotels close.',
    fromOrigin: 'About 6 hours by road through Habarana, or the night bus to Trincomalee and a tuk-tuk north.',
    bestTime: 'A morning boat to Pigeon Island, then the beach after 10 a.m. May to September.',
    visitLength: 'A weekend. The drive is too long to turn around the same day.',
    tip: 'Pigeon Island tickets are sold near the beach and the boatmen leave in groups. Go early if you want the reef before the day boats arrive.',
    image: require('../assets/places/trinco.jpg'),
    photoCredit: 'Adam Jones, CC BY-SA 2.0, via Wikimedia Commons',
  },
  {
    id: 'anuradhapura',
    name: 'Anuradhapura',
    region: 'Cultural Triangle',
    category: 'Heritage',
    summary: 'The sacred city, best seen from a bicycle between the great stupas.',
    about:
      'Anuradhapura was a capital for more than a thousand years. The sites are spread out, which is why a bicycle works better than a tuk-tuk. Ruwanwelisaya, the white dome, is the landmark. Jethavanaramaya is the brick mass to the east. Sri Maha Bodhi, grown from a cutting of the tree at Bodh Gaya, is the living shrine and the one place where the dress code is strictest.',
    fromOrigin: 'About 4 hours via the Puttalam road or through Dambulla.',
    bestTime: 'Start by 7.30 a.m. so you are at Sri Maha Bodhi before the pilgrim buses, then ride the stupas in the middle of the day under a hat.',
    visitLength: 'A full day on a bicycle. The ticket covers the main ancient sites.',
    tip: 'Wear white or pale clothing at the shrines. Hire the bicycle in the new town, not at the stupa gates, and keep the site ticket with you.',
    image: require('../assets/places/anuradhapura.jpg'),
    photoCredit: 'Viraj Tharinda, CC BY-SA 4.0, via Wikimedia Commons',
  },
  {
    id: 'sripada',
    name: 'Sri Pada',
    region: 'Hill Country',
    category: 'Highland',
    summary: 'Adam’s Peak. A night climb in season if you want the sunrise from the summit.',
    about:
      'Sri Pada is the conical mountain above Hatton, sacred to Buddhists, Hindus, Muslims, and Christians, and crowded in season for that reason. The Nallathanni route is the one most visitors use. People start between midnight and 2 a.m., climb the lit staircase through the night, and reach the summit before the sun comes up over the low country. The shadow of the peak on the morning cloud is the sight the climb is built around.',
    fromOrigin: 'Bus or train to Hatton, then a tuk-tuk to Nallathanniya. Treat it as an overnight, not an evening outing.',
    bestTime: 'The pilgrimage season runs from the Unduvap full moon in December to Vesak in May. Climb on a weekday if you can.',
    visitLength: 'Four to six hours up, depending on the queue, and about three hours down.',
    tip: 'Take a warm layer for the summit and a head torch even though the path is lit. The steps are concrete and hard on the knees on the way down.',
    image: require('../assets/places/sripada.jpg'),
    photoCredit: 'Rehman Abubakr, CC BY-SA 4.0, via Wikimedia Commons',
  },
  ...morePlaces,
];

export function findPlace(id) {
  const placeId = Array.isArray(id) ? id[0] : id;
  return places.find((place) => place.id === placeId) ?? null;
}

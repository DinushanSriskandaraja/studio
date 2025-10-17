# **App Name**: Tip2Trip

## Core Features:

- Destination Input: Allows users to input their destination (city or region), travel dates, and preferences (culture, food, temples, nature, nightlife, adventure).
- Map API Integration: Uses OpenStreetMap (OSM) as the base, OpenRouteService for places of interest, routing, and travel time calculation, and Pelias/Nominatim for geocoding.
- LLM Itinerary Generation: Sends structured data (place name, category, distance, time) to LLM to generate a logical, human-friendly, day-by-day itinerary. The LLM tool groups nearby attractions and prioritizes cultural/nature places in the morning and food/nightlife in the evening.
- Itinerary Output: Displays a clean, structured itinerary for each day with morning, afternoon, and evening activities, attraction names with descriptions, and estimated travel times between locations, along with a map view with pins and routes.
- Place Caching: Caches frequent queries to reduce API cost and improve performance, by storing attraction data per location

## Style Guidelines:

- Primary color: Soft blue (#03A9F4) to evoke a sense of calmness and trust, relating to open skies and the sea. This also provides a backdrop for imagery related to landmarks, beaches, or natural settings. The color needs to contrast with the white background.
- Background color: Light gray (#F2F2F2), which allows the primary color and content to stand out without causing eye strain.
- Accent color: Coral (#ED4716), used for interactive elements and calls to action, providing a pop of energy that contrasts with the cooler blues.
- Headline font: 'Playfair', serif, with a geometric, high-contrast and elegant feel. Body font: 'PT Sans', humanist sans-serif. Longer text is anticipated.
- Simple, outline-style icons to represent different categories (e.g., culture, food, nature). Ensure icons are easily recognizable and match the overall minimal aesthetic.
- Clean, grid-based layout with a focus on readability and ease of navigation. Use clear visual hierarchy to guide the user through the itinerary and map.
- Subtle transitions and animations when loading new itinerary sections or map elements. Keep animations minimal to avoid distracting from the content.
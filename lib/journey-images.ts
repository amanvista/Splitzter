// Collection of journey images
const JOURNEY_IMAGES = [
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470', // Mountain landscape
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee', // Beach sunset
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d', // Road trip
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', // Mountain lake
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800', // Camping
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1', // Lake view
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4', // Camping tent
  'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5', // Tropical beach
];

/**
 * Get a consistent image URL for a journey based on its ID
 * This ensures the same journey always shows the same image
 */
export function getJourneyImageUrl(journeyId: string, customImageUrl?: string): string {
  // If journey has a custom image, use it
  if (customImageUrl) {
    return customImageUrl;
  }

  // Generate a consistent index based on journey ID
  const hash = journeyId.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);

  const index = hash % JOURNEY_IMAGES.length;
  return JOURNEY_IMAGES[index];
}

/**
 * Get a random image URL for new journeys
 */
export function getRandomJourneyImage(): string {
  const randomIndex = Math.floor(Math.random() * JOURNEY_IMAGES.length);
  return JOURNEY_IMAGES[randomIndex];
}

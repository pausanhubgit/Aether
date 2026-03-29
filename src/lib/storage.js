"use client";

// Feed and Profile keys are no longer used for localStorage as per user request
// All data should be managed via Redux and Backend API (port 5000)

export function getFeedItems() {
  return [];
}

export function setFeedItems(items) {
  // No-op: localStorage disabled
}

export function addFeedItem(item) {
  // Return the item as the only item in a mock list, or just return empty
  return [
    {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: new Date().toISOString(),
      ...item,
    }
  ];
}

export function getProfile() {
  return null;
}

export function setProfile(profile) {
  // No-op: localStorage disabled
}

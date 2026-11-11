// Workshop Variant Detection and Sidebar Configuration
// Determines which sidebar to load based on cached or fetched workshop variant

// Global variable to hold the sidebar path (set synchronously)
window.workshopSidebarPath = 'agenda-sidebar.md';

// Step 1: Check localStorage synchronously (instant)
(function() {
  const cachedVariant = localStorage.getItem('workshopVariant');

  if (cachedVariant && cachedVariant !== 'default') {
    window.workshopSidebarPath = `agenda-${cachedVariant}.md`;
    console.log(`Using cached variant: ${cachedVariant}`);
  }
})();

// Step 2: Fetch fresh data async (updates cache for next time)
(async function() {
  try {
    const workshopData = await getWorkshopData();
    if (!workshopData.hasOwnProperty('error') && workshopData.workshopVariant) {
      const freshVariant = workshopData.workshopVariant;
      const previousVariant = localStorage.getItem('workshopVariant');

      // Update cache
      localStorage.setItem('workshopVariant', freshVariant);
      console.log(`Cached variant updated: ${freshVariant}`);

      // Reload if variant differs from what Docsify loaded with (covers first visit and variant changes)
      if (previousVariant !== freshVariant) {
        console.log(`Variant changed from ${previousVariant} to ${freshVariant}, reloading...`);
        window.location.reload();
      }
    }
  } catch (error) {
    console.log(`Could not update variant cache: ${error.message}`);
  }
})();

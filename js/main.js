
/**
 * Main JavaScript for index page
 */
document.addEventListener('DOMContentLoaded', () => {
  // Update balance display
  ui.updateBalance();
  
  // Populate slots grid
  const slotsGrid = document.querySelector('.slots-grid');
  if (slotsGrid) {
    SLOTS.forEach(slot => {
      const card = ui.createSlotCard(slot);
      slotsGrid.appendChild(card);
    });
  }
});

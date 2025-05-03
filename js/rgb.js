// Добавляем динамический эффект
document.addEventListener('DOMContentLoaded', () => {
    const donateLink = document.getElementById('donateLink');
    let hue = 0;

    function updateGradient() {
      hue = (hue + 1) % 360;
      const color1 = hsl(${hue}, 100%, 50%);
      const color2 = hsl(${(hue + 90) % 360}, 100%, 50%);
      const color3 = hsl(${(hue + 180) % 360}, 100%, 50%);

      donateLink.style.background = 
        radial-gradient(circle at 100% 0%, ${color1} 0%, 
        ${color2} 30%, ${color3} 70%, #000 100%)
      ;

      requestAnimationFrame(updateGradient);
    }

    // Инициализация эффекта
    donateLink.addEventListener('mouseenter', () => {
      updateGradient();
    });

    donateLink.addEventListener('mouseleave', () => {
      donateLink.style.background = 'none';
      hue = 0;
    });
  });
document.addEventListener('DOMContentLoaded', () => {
  // set values
  document.getElementById('current_year').innerText = ( new Date().getFullYear() ).toString();
  document.getElementById('coding_years_big').dataset.target = ( new Date().getFullYear() - 2009 ).toString();
  document.getElementById('coding_years_small').dataset.target = ( new Date().getFullYear() - 2009 ).toString();
  document.getElementById('youtube_subscribers').dataset.target = ( 2699 ).toString();
  document.getElementById('wikidocs_stars').dataset.target = ( 349 ).toString();
  // retrieve stats
  const statsReady = fetch('https://automations.vps.zavy.dev/webhook/3d40e896-71ba-498e-88fd-81d945874132', {
    signal: AbortSignal.timeout(10000)
  })
    .then(response => response.json())
    .then(data => {
      document.getElementById('youtube_subscribers').dataset.target = ( data.youtube_subscribers ).toString();
      document.getElementById('wikidocs_stars').dataset.target = ( data.wikidocs_stars ).toString();
    })
    .catch(error => { console.error('Error retrieving stats from n8n', error); });
  // carousel
  let currentIndex = 0;
  const items = document.querySelectorAll('.carousel-item');
  function showItem(index) {
    items.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
  }
  function nextItem() {
    currentIndex = (currentIndex + 1) % items.length;
    showItem(currentIndex);
  }
  showItem(currentIndex);
  setInterval(nextItem, 10000);
  // animated numbers
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        statsReady.then(() => incrementNumber(entry.target));
        observer.unobserve(entry.target);
      }
    });
  },{ threshold: 0.27 });
  document.querySelectorAll('.animated_number').forEach(tag => observer.observe(tag));
  function incrementNumber(element) {
    const targetNumber = parseInt(element.getAttribute('data-target'), 10);
    let currentNumber = Math.max((targetNumber - 270),0);
    let incrementTime = 270;
    function updateNumber() {
      if (currentNumber < targetNumber) {
        currentNumber++;
        element.textContent = currentNumber.toLocaleString(document.documentElement.lang || 'en');
        incrementTime = incrementTime / 2;
        if(incrementTime < 1){incrementTime = 1;}
        setTimeout(updateNumber, incrementTime);
      }
    }
    setTimeout(updateNumber,1000);
  }
});
// show more
document.querySelectorAll('.show-more').forEach(link => {
  link.addEventListener('click', function() {
    const targetElement = document.getElementById(this.dataset.target);
    targetElement.classList.remove('is-hidden');
    targetElement.scrollIntoView({ behavior: 'smooth' });
    this.remove();
  });
});

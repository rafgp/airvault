// script.js

const API_KEY = 'E7EvvIuW+Wom0vX6i5XNGA==KV3UEBk09NTnM8CH';
const API_URL = 'https://api.api-ninjas.com/v1/aircraft';

document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('search-button');
  const luckyButton = document.getElementById('lucky-button');
  const aircraftList = document.getElementById('aircraft-list');

  if (searchButton && luckyButton) {
    searchButton.addEventListener('click', handleSearch);
    luckyButton.addEventListener('click', handleLucky);
  } else if (aircraftList) {
    displayAircraftList();
  }
});

async function handleSearch() {
  const range = Math.min(parseInt(document.getElementById('range').value) || 0, 7700);
  const speed = Math.min(parseInt(document.getElementById('speed').value) || 0, 270);
  const height = Math.min(parseInt(document.getElementById('height').value) || 0, 12);

  console.log('Search parameters:', { range, speed, height });

  const params = new URLSearchParams({
    min_range: range > 0 ? range : undefined,
    min_speed: speed > 0 ? speed : undefined,
    min_height: height > 0 ? height : undefined,
    limit: 10
  });

  try {
    const aircraft = await fetchAircraft(params);
    console.log('Fetched aircraft:', aircraft);
    if (aircraft.length > 0) {
      localStorage.setItem('aircraftList', JSON.stringify(aircraft));
      window.location.href = 'results.html';
    } else {
      displayError('No aircraft found matching the criteria.');
    }
  } catch (error) {
    console.error('Error:', error);
    displayError('Api error');
  }
}

async function handleLucky() {
  const randomRange = Math.floor(Math.random() * 7701); // 0-7700

  console.log('Lucky search parameter:', { min_range: randomRange });

  const params = new URLSearchParams({
    min_range: randomRange,
    limit: 1
  });

  try {
    const aircraft = await fetchAircraft(params);
    console.log('Fetched aircraft:', aircraft);
    if (aircraft.length > 0) {
      localStorage.setItem('aircraftList', JSON.stringify(aircraft));
      window.location.href = 'results.html';
    } else {
      displayError('No aircraft found. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    displayError('An error occurred while fetching data.');
  }
}

async function fetchAircraft(params) {
  const response = await fetch(`${API_URL}?${params}`, {
    headers: {
      'X-Api-Key': API_KEY
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

function displayAircraftList() {
  const aircraftList = document.getElementById('aircraft-list');
  const aircraft = JSON.parse(localStorage.getItem('aircraftList'));

  if (aircraft && aircraftList) {
    aircraftList.innerHTML = aircraft.map(plane => `
      <div class="bg-white p-6 rounded-lg shadow-md mb-4 ${getBorderColorClass(plane.engine_type)}">
        <h2 class="text-2xl font-bold mb-2">${plane.manufacturer} ${plane.model}</h2>
        <p><strong>Engine Type:</strong> ${plane.engine_type}</p>
        <p><strong>Max Speed:</strong> ${plane.max_speed_knots} knots</p>
        <p><strong>Range:</strong> ${plane.range_nautical_miles} nautical miles</p>
        <p><strong>Height:</strong> ${plane.height_ft} feet</p>
      </div>
    `).join('');
  } else {
    aircraftList.innerHTML = '<p class="text-center text-white">No aircraft information available.</p>';
  }
}

function getBorderColorClass(engineType) {
  switch (engineType.toLowerCase()) {
    case 'piston':
      return 'border-l-4 border-blue-500';
    case 'turboprop':
      return 'border-l-4 border-green-500';
    case 'jet':
      return 'border-l-4 border-red-500';
    default:
      return 'border-l-4 border-gray-500';
  }
}

function displayError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4';
  errorDiv.role = 'alert';
  errorDiv.innerHTML = `<strong class="font-bold">Error:</strong> <span class="block sm:inline">${message}</span>`;
  
  const container = document.querySelector('main');
  container.insertBefore(errorDiv, container.firstChild);
}
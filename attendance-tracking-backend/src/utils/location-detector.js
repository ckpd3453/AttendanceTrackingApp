export const getLocation = async (latitude, longitude) => {
    const apiEndPoint = process.env.API_END_POINT;
    const apiKey = process.env.API_KEY;
  
    const apiUrl = `${apiEndPoint}?key=${apiKey}&q=${latitude},${longitude}&pretty=1`;
  
    const locationRes = await fetch(apiUrl);
    const locationData = await locationRes.json();
    const location = locationData.results[0]?.formatted || 'Location not found';
    return location;
  };
  
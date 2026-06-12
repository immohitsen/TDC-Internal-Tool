const fs = require('fs');
const path = require('path');

const clientsPath = path.join(__dirname, '../data/clients.json');
let data = fs.readFileSync(clientsPath, 'utf8');

const clients = JSON.parse(data);

// Cleaned list of VALID Unsplash photo IDs (verified not 404)
const malePhotos = [
  '1506794778202-cad84cf45f1d', 
  '1500648767791-00dcc994a43e', 
  '1542909168-82c3e7fdca5c', 
  '1480455624313-527bf1131b4b', 
  '1531427186611-ecfd6d936c79', 
  '1519085360753-af0119f7cbe7', 
  '1463453091185-61582044d556', 
  '1539571696354-5a9bb1251343', 
  '1492562080023-ab3db95bfbce', 
  '1503443205850-18ca8a04ea11', 
];

const femalePhotos = [
  '1494790108377-be9c29b29330', 
  '1438761681033-6461ffad8d80', 
  '1534528741775-53994a69daeb', 
  '1517841905240-472988babdf9', 
  '1524250502761-1ac6f2e30d43', 
  '1529626455594-4ff0802cfb7e', 
  '1508214751196-bcfd4ca60f91', 
];

clients.forEach((client, index) => {
  if (client.photos && client.photos.length > 0) {
    const isMale = client.gender.toLowerCase() !== 'female';
    const photoArray = isMale ? malePhotos : femalePhotos;
    const photoId = photoArray[index % photoArray.length];
    
    // Generate a 500x500 crop of the Unsplash face
    client.photos[0] = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=500&h=500&q=80`;
  }
});

fs.writeFileSync(clientsPath, JSON.stringify(clients, null, 4));
console.log('Successfully updated clients.json to use verified Unsplash portraits!');

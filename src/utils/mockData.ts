import image11 from '../assets/images/MockStage1.png';
import image12 from '../assets/images/MockStage2.png';
import image13 from '../assets/images/MockStage3.png';
import image14 from '../assets/images/MockStage4.png';
import image1 from '../assets/images/image (3).png';
import image2 from '../assets/images/image (8).png';
import image3 from '../assets/images/image (9).png';
import image4 from '../assets/images/image (10).png';
import image5 from '../assets/images/image (11).png';
import image6 from '../assets/images/image (12).png';
import image7 from '../assets/images/image (13).png';
import image8 from '../assets/images/image (14).png';
import image9 from '../assets/images/image (15).png';
import image10 from '../assets/images/image (16).png';
import { VenueClubhouse, VenueStage } from '../assets/video/index';

export const venueData = [
  {
    name: 'Music-Store Stage',
    id: 'Music-Store-Stage',
    featuredImage: image5,
    images: [image5, image6, image7, image8, image8, image9, image10],
    featuredVideo: VenueStage,
    videos: [VenueStage],
    description:
      'Enjoy the nightlife in our Music-Store NightClub. The entrance to the most populair live dj events on the Metaverse'
  },
  {
    name: 'Music-Store Orangerie',
    id: 'Music-Store-Orangerie',
    featuredImage: image13,
    images: [image11, image12, image13, image14],
    featuredVideo: VenueStage,
    videos: [],
    description:
      'Enjoy the nightlife in our Music-Store NightClub. The entrance to the most populair live dj events on the Metaverse'
  },
  {
    name: 'Music-Store NightClub',
    id: 'Music-Store-NightClub',
    featuredImage: image1,
    description:
      'Enjoy the nightlife in our Music-Store NightClub. The entrance to the most populair live dj events on the Metaverse',
    images: [image1, image2, image3, image4],
    featuredVideo: VenueClubhouse,
    videos: [VenueClubhouse]
  }
];

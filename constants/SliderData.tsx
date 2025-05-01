import { ImageSourcePropType } from "react-native";

export type ImageSliderType = {
  title: string;
  image: ImageSourcePropType;
  description: string;
  
};

export const ImageSlider: ImageSliderType[] = [
  {
    title: "Tech Expo 2025",
    image: { uri: "https://images.pexels.com/photos/21705409/pexels-photo-21705409/free-photo-of-phong-c-nh-thien-nhien-hoa-v-n.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    description: "The Annual Tech Expo is a premier event that brings together industry leaders...",
  },
  {
    title: "Spring Music Concert",
    image: { uri: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=800" },
    description: "A spectacular evening of live performances by top artists...",
  },
  {
    title: "City Marathon",
    image: { uri: "https://images.unsplash.com/photo-1520975661595-6453be3f7070?q=80&w=800" },
    description: "Join thousands of runners in the annual city marathon...",
  },
  {
    title: "International Food Festival",
    image: { uri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800" },
    description: "Taste the best cuisines from around the world at our International Food Festival...",
  },
  {
    title: "AI & Robotics Summit",
    image: { uri: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=800" },
    description: "Explore the latest trends and breakthroughs in artificial intelligence and robotics...",
  },
  {
    title: "Comic Con Vietnam",
    image: { uri: "https://images.pexels.com/photos/31363763/pexels-photo-31363763/free-photo-of-n-i-th-t-c-a-ga-tau-di-n-ng-m-berlin.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    description: "Meet your favorite comic book artists, cosplayers, and game developers at Comic Con Vietnam...",
  },
  {
    title: "Startup Pitch Night",
    image: { uri: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800" },
    description: "A networking event where startups pitch their ideas to investors and industry experts...",
  },
  {
    title: "International Jazz Festival",
    image: { uri: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800" },
    description: "A night of mesmerizing jazz performances featuring artists from around the world...",
  },
  {
    title: "Vietnam Film Week",
    image: { uri: "https://images.unsplash.com/photo-1513451713350-dee890297c4a?q=80&w=800" },
    description: "Enjoy a selection of the best Vietnamese and international films during Vietnam Film Week...",
  },
  {
    title: "Yoga & Wellness Retreat",
    image: { uri: "https://images.pexels.com/photos/21708270/pexels-photo-21708270/free-photo-of-thien-nhien-canh-d-ng-hoa-v-n.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    description: "Relax and rejuvenate with a weekend of yoga, meditation, and holistic wellness workshops...",
  },
];

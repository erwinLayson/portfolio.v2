export type GalleryImage = {
  title: string;
  description: string;
  image: string;
};

import {barmStartUpMeeting, davaoAirport, ojtIntroduction, ttbdo} from "../assets/gallery"

export const gallery: GalleryImage[] = [
  {
    title: "Cebu Flight",
    description:
      "Departing from Davao Airport for Cebu to begin my On-the-Job Training (OJT) at UP Cebu.",
    image: davaoAirport,
  },
  {
    title: "Internship Orientation",
    description:
      "Starting my internship journey with an introduction and orientation at the TTBDO Office, UP Cebu.",
    image: ojtIntroduction,
  },
  {
    title: "Meeting with MOST BARMM",
    description:
      "Participated in a meeting with the Ministry of Science and Technology (MOST) of BARMM to discuss TTBDO initiatives and collaboration.",
    image: barmStartUpMeeting,
  },
  {
    title: "Meeting with MOST BARM Day 3",
    description:
      "Went on a guided tour of UP Cebu’s facilities, where we were introduced to various machines and equipment used for research and development.",
    image: ttbdo,
  }
];

import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import NewsSection from '../components/home/NewsSection';
import InstagramFeed from '../components/home/InstagramFeed';
import TrophiesGallery from '../components/home/TrophiesGallery';
import Footer from '../components/layout/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <NewsSection />
      <InstagramFeed />
      <TrophiesGallery />
    </>
  );
}

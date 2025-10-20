// pages/booking.js
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingForm from '../components/BookingForm';

export default function BookingPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Book an Appointment</h1>
        <BookingForm />
      </main>
      <Footer />
    </>
  );
}

import HotelForm from '@/components/dashboard/HotelForm';

export default function NewHotelPage() {
  return (
    <div className="p-8">
      <h1
        className="text-2xl font-semibold text-white mb-6"
        style={{ fontFamily: 'var(--font-instrument)' }}
      >
        New Hotel
      </h1>
      <HotelForm mode="new" />
    </div>
  );
}

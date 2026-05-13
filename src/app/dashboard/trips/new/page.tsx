import TripForm from '@/components/dashboard/TripForm';

export default function NewTripPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-6" style={{ fontFamily: 'var(--font-instrument)' }}>
        New Trip
      </h1>
      <TripForm mode="new" />
    </div>
  );
}

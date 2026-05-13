import DestinationForm from '@/components/dashboard/DestinationForm';

export default function NewDestinationPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-6" style={{ fontFamily: 'var(--font-instrument)' }}>
        New Destination
      </h1>
      <DestinationForm mode="new" />
    </div>
  );
}

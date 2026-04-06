import { EntryList } from '@/components/archive/EntryList';

export default function ArchivePage() {
  return (
    <div className="max-w-3xl mx-auto w-full px-6 py-8">
      <h1 className="font-serif text-3xl text-stone-800 mb-2">Past Entries</h1>
      <p className="text-sm text-stone-400 font-sans mb-6">All your diary entries, newest first.</p>
      <EntryList />
    </div>
  );
}

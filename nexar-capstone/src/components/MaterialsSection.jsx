export default function MaterialsSection({ courseId }) {
    // Use a local state/hook to fetch: courses/{courseId}/materials
    return (
      <div className="bg-white p-8 rounded-[3rem] border border-neutral-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-black">Materials</h3>
          <button className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
            +
          </button>
        </div>
        
        {/* List of materials would go here */}
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center gap-3">
            <div className="text-xl">📄</div>
            <div>
              <p className="text-sm font-bold">Week 1 Reading.pdf</p>
              <p className="text-[10px] font-black text-neutral-400 uppercase">File • 2.4MB</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
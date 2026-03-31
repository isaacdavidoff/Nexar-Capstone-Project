export default function DashboardLayout({ left, right }) {
    return (
      <div className="p-6 grid grid-cols-12 gap-6">
        
        {/* LEFT */}
        <div className="col-span-8 space-y-6">
          {left}
        </div>
  
        {/* RIGHT */}
        <div className="col-span-4 space-y-6">
          {right}
        </div>
  
      </div>
    );
  }
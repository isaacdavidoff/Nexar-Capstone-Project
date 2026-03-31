export default function WorkloadCard({ workload }) {
    return (
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Weekly Workload</h2>
  
        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all"
            style={{ width: `${workload.percent}%` }}
          />
        </div>
  
        <p className="text-sm text-gray-600">
          {workload.percent}% of weekly capacity scheduled
        </p>
      </div>
    );
  }
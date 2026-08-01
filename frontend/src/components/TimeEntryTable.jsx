function TimeEntryTable({ entries }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
        <h3 style={{ margin: 0, color: 'var(--text-muted)' }}>No time entries found.</h3>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ overflowX: 'auto' }}>
      <h2>Recent Entries</h2>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>In Time</th>
            <th>Out Time</th>
            <th>Worked</th>
            <th>Short</th>
            <th>Surplus</th>
          </tr>
        </thead>

        <tbody>
          {entries.map((e, index) => {
            // Determine badge classes based on hours
            const hasShort = parseFloat(e.shortHours) > 0;
            const hasSurplus = parseFloat(e.surplusHours) > 0;

            return (
              <tr key={index}>
                <td style={{ fontWeight: 500, color: 'var(--primary-light)' }}>{e.workDate}</td>
                <td>{e.inTime}</td>
                <td>{e.outTime}</td>
                <td style={{ fontWeight: 600 }}>{e.workedHours}</td>
                <td>
                  <span className={`status-badge ${hasShort ? 'status-short' : 'status-neutral'}`}>
                    {e.shortHours}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${hasSurplus ? 'status-surplus' : 'status-neutral'}`}>
                    {e.surplusHours}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TimeEntryTable;

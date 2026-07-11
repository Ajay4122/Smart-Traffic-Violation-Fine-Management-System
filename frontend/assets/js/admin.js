document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../index.html';
        return;
    }

    try {
        const data = await API.request('/violations/analytics', 'GET', null, token);

        document.getElementById('totalViolations').textContent = data.totalViolations;
        document.getElementById('pendingViolations').textContent = data.pendingViolations;
        document.getElementById('totalRevenue').textContent = '₹' + data.totalRevenue;

        // Charts
        const ctxVI = document.getElementById('violationsChart').getContext('2d');
        new Chart(ctxVI, {
            type: 'doughnut',
            data: {
                labels: ['Paid', 'Pending'],
                datasets: [{
                    data: [data.paidViolations, data.pendingViolations],
                    backgroundColor: ['#10b981', '#f59e0b'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#94a3b8' }
                    }
                }
            }
        });

        // Mock revenue trend for visual (since backend only returns total)
        const ctxRev = document.getElementById('revenueChart').getContext('2d');
        new Chart(ctxRev, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue',
                    data: [1200, 1900, 3000, 5000, 2000, data.totalRevenue], // Mock data ending with real total if it makes sense, or just mock
                    borderColor: '#6366f1',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                }
            }
        });

    } catch (error) {
        console.error('Error fetching analytics:', error);
        // alert('Failed to load analytics: ' + error.message);
    }
});

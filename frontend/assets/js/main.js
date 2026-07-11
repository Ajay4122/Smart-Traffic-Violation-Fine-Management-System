document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLogin = document.getElementById('closeLogin');
    const loginForm = document.getElementById('loginForm');
    const searchBtn = document.getElementById('searchBtn');
    const vehicleSearch = document.getElementById('vehicleSearch');
    const resultsArea = document.getElementById('resultsArea');
    const violationsList = document.getElementById('violationsList');

    // Modal Logic
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'flex';
    });

    closeLogin.addEventListener('click', () => {
        loginModal.style.display = 'none';
        // Click outside to close can be added too
    });

    window.onclick = (event) => {
        if (event.target == loginModal) {
            loginModal.style.display = 'none';
        }
    };

    // Login Logic
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const data = await API.request('/auth/login', 'POST', { email, password });

            // Save token and user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));

            // Redirect based on role
            if (data.role === 'admin') {
                window.location.href = 'admin/dashboard.html';
            } else if (data.role === 'police') {
                window.location.href = 'police/dashboard.html';
            } else {
                window.location.href = 'citizen/portal.html';
            }
        } catch (error) {
            alert(error.message);
        }
    });

    const paymentModal = document.getElementById('paymentModal');
    const confirmPayBtn = document.getElementById('confirmPayBtn');
    const cancelPayBtn = document.getElementById('cancelPayBtn');
    let selectedViolationId = null;

    // Search Logic
    async function search(vehicleNo) {
        if (!vehicleNo) {
            alert('Please enter a vehicle number');
            return;
        }

        try {
            const violations = await API.request(`/violations/search/${vehicleNo}`);

            resultsArea.style.display = 'block';
            violationsList.innerHTML = '';

            if (violations.length === 0) {
                violationsList.innerHTML = '<p class="text-muted">No violations found for this vehicle.</p>';
                return;
            }

            violations.forEach(v => {
                const card = document.createElement('div');
                card.className = 'card fade-in';
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="font-weight: bold; color: var(--primary-color);">#${v.rule.ruleName}</span>
                        <span style="font-size: 0.9rem; color: ${v.status === 'Paid' ? 'var(--success-color)' : 'var(--error-color)'}">${v.status}</span>
                    </div>
                    <p style="margin-bottom: 0.5rem;">${v.rule.description}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                        <div>
                            <p style="font-weight: bold; font-size: 1.2rem;">₹${v.fineAmount}</p>
                            <p style="font-size: 0.8rem; color: var(--text-muted);">${new Date(v.createdAt).toLocaleDateString()}</p>
                        </div>
                        ${v.status === 'Pending'
                        ? `<button class="btn" style="padding: 0.5rem 1rem; font-size: 0.9rem; display: inline-block !important;" onclick="openPayment('${v._id}', ${v.fineAmount})">Pay Now</button>`
                        : ''
                    }
                    </div>
                `;
                violationsList.appendChild(card);
            });
        } catch (error) {
            console.error(error);
            alert('Failed to fetch violations');
        }
    }

    searchBtn.addEventListener('click', () => search(vehicleSearch.value.trim()));

    // Payment Logic
    window.openPayment = (id, amount) => {
        selectedViolationId = id;
        document.getElementById('paymentAmount').textContent = `₹${amount}`;
        paymentModal.style.display = 'flex';
    };

    cancelPayBtn.addEventListener('click', () => {
        paymentModal.style.display = 'none';
        selectedViolationId = null;
    });

    confirmPayBtn.addEventListener('click', async () => {
        if (!selectedViolationId) return;

        confirmPayBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        try {
            await API.request(`/violations/${selectedViolationId}/pay`, 'PUT');

            // Mock delay
            setTimeout(() => {
                alert('Payment Successful!');
                paymentModal.style.display = 'none';
                confirmPayBtn.innerHTML = 'Pay Now';
                search(vehicleSearch.value.trim()); // Refresh list
            }, 1000);

        } catch (error) {
            alert(error.message);
            confirmPayBtn.innerHTML = 'Pay Now';
        }
    });

    window.onclick = (event) => {
        if (event.target == loginModal) loginModal.style.display = 'none';
        if (event.target == paymentModal) paymentModal.style.display = 'none';
    };
});

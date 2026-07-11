document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in (optional, but good for "Portal")
    // const token = localStorage.getItem('token');
    // if (!token) window.location.href = '../index.html';

    const searchBtn = document.getElementById('searchBtn');
    const vehicleSearch = document.getElementById('vehicleSearch');
    const violationsList = document.getElementById('violationsList');
    const loading = document.getElementById('loading');
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

        loading.style.display = 'block';
        violationsList.innerHTML = '';

        try {
            const violations = await API.request(`/violations/search/${vehicleNo}`, 'GET');
            loading.style.display = 'none';

            if (violations.length === 0) {
                violationsList.innerHTML = '<p class="text-muted">No violations found.</p>';
                return;
            }

            violations.forEach(v => {
                const card = document.createElement('div');
                card.className = 'card fade-in';
                card.style.display = 'flex';
                card.style.flexDirection = 'column'; // Mobile friendly
                card.style.gap = '1rem';

                // Desktop row layout
                if (window.innerWidth > 768) {
                    card.style.flexDirection = 'row';
                    card.style.alignItems = 'center';
                }

                // Image Path Construction
                let imagePath = v.evidenceImage.replace(/\\/g, '/'); // Normalize slashes

                // If path starts with 'backend/', remove it to match the static serve route
                if (imagePath.startsWith('backend/')) {
                    imagePath = imagePath.substring(8);
                }

                // Ensure no leading slash if we are appending to base
                if (imagePath.startsWith('/')) {
                    imagePath = imagePath.substring(1);
                }

                const imageUrl = `http://localhost:5000/${imagePath}`;

                card.innerHTML = `
                    <div style="width: 150px; height: 100px; background: #333; border-radius: var(--radius); overflow: hidden; flex-shrink: 0;">
                        <img src="${imageUrl}" alt="Evidence" style="width: 100%; height: 100%; object-fit: cover;" onclick="window.open(this.src)">
                    </div>
                    <div style="flex: 1;">
                        <h3 style="color: var(--primary-color); text-transform: uppercase;">${v.vehicleNumber}</h3>
                        <p style="font-weight: 500;">${v.rule.ruleName}</p>
                        <p style="font-size: 0.9rem; color: var(--text-muted);">${new Date(v.createdAt).toLocaleDateString()} ${new Date(v.createdAt).toLocaleTimeString()}</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem;">₹${v.fineAmount}</p>
                        ${v.status === 'Pending'
                        ? `<button class="btn" onclick="openPayment('${v._id}', ${v.fineAmount})">Pay Now</button>`
                        : `<span style="color: var(--success-color); font-weight: bold;"><i class="fas fa-check-circle"></i> Paid</span>`
                    }
                    </div>
                `;
                violationsList.appendChild(card);
            });

        } catch (error) {
            loading.style.display = 'none';
            console.error(error);
            alert('Error fetching records');
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
            }, 1500);

        } catch (error) {
            alert(error.message);
            confirmPayBtn.innerHTML = 'Pay Now';
        }
    });

    // Auto search if query param exists (optional)
});

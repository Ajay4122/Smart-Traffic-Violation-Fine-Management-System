document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../index.html';
        return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('officerName').textContent = user.name;

    const ruleSelect = document.getElementById('ruleSelect');
    const violationForm = document.getElementById('violationForm');
    const evidenceImage = document.getElementById('evidenceImage');
    const fileNameDisplay = document.getElementById('fileName');
    const recentViolations = document.getElementById('recentViolations');

    // Load Rules
    try {
        const rules = await API.request('/rules', 'GET');
        rules.forEach(rule => {
            const option = document.createElement('option');
            option.value = rule._id;
            option.textContent = `${rule.ruleName} (₹${rule.fineAmount})`;
            ruleSelect.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }

    // Handle File Selection
    evidenceImage.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            fileNameDisplay.textContent = e.target.files[0].name;
        }
    });

    // Load Recent Violations
    async function loadRecent() {
        try {
            const violations = await API.request('/violations', 'GET', null, token);
            recentViolations.innerHTML = '';

            violations.forEach(v => {
                const card = document.createElement('div');
                card.className = 'card fade-in';
                card.style.padding = '1rem';
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="font-weight: bold;">${v.vehicleNumber}</span>
                        <span style="font-size: 0.8rem; background: rgba(99,102,241,0.1); color: var(--primary-color); padding: 2px 8px; border-radius: 4px;">${v.status}</span>
                    </div>
                    <p style="font-size: 0.9rem; color: var(--text-muted);">${v.rule.ruleName}</p>
                    <p style="font-weight: bold;">₹${v.fineAmount}</p>
                `;
                recentViolations.appendChild(card);
            });
        } catch (error) {
            console.error(error);
        }
    }
    loadRecent();

    // Submit Violation
    violationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const vehicleNumber = document.getElementById('vehicleNumber').value;
        const ruleId = ruleSelect.value;
        const file = evidenceImage.files[0];

        if (!vehicleNumber || !ruleId || !file) {
            alert('Please fill all fields');
            return;
        }

        const formData = new FormData();
        formData.append('vehicleNumber', vehicleNumber);
        formData.append('ruleId', ruleId);
        formData.append('evidenceImage', file);

        try {
            await API.upload('/violations', formData, token);
            alert('Violation Recorded Successfully');
            violationForm.reset();
            fileNameDisplay.textContent = '';
            loadRecent();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
});

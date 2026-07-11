document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const tableBody = document.getElementById('rulesTableBody');
    const addRuleBtn = document.getElementById('addRuleBtn');
    const ruleModal = document.getElementById('ruleModal');
    const closeRuleModal = document.getElementById('closeRuleModal');
    const ruleForm = document.getElementById('ruleForm');

    // Fetch Rules
    async function loadRules() {
        try {
            const rules = await API.request('/rules', 'GET'); // Public endpoint for getting rules
            tableBody.innerHTML = '';

            rules.forEach(rule => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid var(--border-color)';
                tr.innerHTML = `
                    <td style="padding: 1rem; color: var(--primary-color); font-weight: 500;">${rule.ruleName}</td>
                    <td style="padding: 1rem; color: var(--text-muted);">${rule.description}</td>
                    <td style="padding: 1rem; font-weight: bold;">₹${rule.fineAmount}</td>
                    <td style="padding: 1rem;">
                        <button class="btn-outline" style="border: none; color: var(--error-color);" onclick="deleteRule('${rule._id}')"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        } catch (error) {
            console.error(error);
        }
    }

    loadRules();

    // Modal Logic
    addRuleBtn.addEventListener('click', () => ruleModal.style.display = 'flex');
    closeRuleModal.addEventListener('click', () => ruleModal.style.display = 'none');
    window.onclick = (e) => {
        if (e.target == ruleModal) ruleModal.style.display = 'none';
    };

    // Add Rule
    ruleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const ruleName = document.getElementById('ruleName').value;
        const description = document.getElementById('ruleDesc').value;
        const fineAmount = document.getElementById('ruleFine').value;

        try {
            await API.request('/rules', 'POST', { ruleName, description, fineAmount }, token);
            ruleModal.style.display = 'none';
            ruleForm.reset();
            loadRules(); // Refresh table
        } catch (error) {
            alert(error.message);
        }
    });

    // Delete Rule
    window.deleteRule = async (id) => {
        if (!confirm('Are you sure you want to delete this rule?')) return;
        try {
            await API.request(`/rules/${id}`, 'DELETE', null, token);
            loadRules();
        } catch (error) {
            alert(error.message);
        }
    };
});
